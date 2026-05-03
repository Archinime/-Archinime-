// notification-system.js - Versión completa corregida
// Sistema de notificaciones con cola de popups, persistencia y sincronización en tiempo real.
// AHORA LAS NOTIFICACIONES DE ANIME SE BASAN EN catalogoArray (local), NO EN Firestore.

(function(global) {
  'use strict';

  // ==================== CONFIGURACIÓN ====================
  const CONFIG = {
    MAX_POPUPS: 5,
    MAX_HISTORY_ITEMS: 50,
    MAX_VISIBLE_NOTIFICATIONS: 30,
    STORAGE_KEYS: {
      QUEUE: 'archinime_popup_queue',
      SHOWN_COUNT: 'archinime_popups_shown',
      HISTORY: 'archinime_notif_history',
      SEEN_IDS: 'archinime_seen_notif_ids',
      FIRST_VISIT: 'archinime_notif_first_visit',
      LAST_CATALOG_CHECK: 'archinime_last_catalog_check'
    },
    ANIME_MAX_AGE_DAYS: 30,            // Antigüedad máxima para considerar "nuevo"
    CATALOG_CHECK_INTERVAL_HOURS: 6     // Intervalo mínimo entre revisiones del catálogo
  };

  // ==================== DEPENDENCIAS EXTERNAS ====================
  const getFirestore = () => global.db;
  const getAuth = () => global.auth;

  // ==================== UTILIDADES ====================
  const domUtils = {
    disableScroll() {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollbarWidth + 'px';
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    },
    enableScroll() {
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    },
    sanitizeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  // ==================== GESTOR DE ALMACENAMIENTO ====================
  class StorageManager {
    static save(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error(`[Storage] Error guardando ${key}:`, e);
      }
    }

    static load(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error(`[Storage] Error cargando ${key}:`, e);
        return defaultValue;
      }
    }

    static saveSession(key, data) {
      try {
        sessionStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error(`[SessionStorage] Error guardando ${key}:`, e);
      }
    }

    static loadSession(key, defaultValue = null) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error(`[SessionStorage] Error cargando ${key}:`, e);
        return defaultValue;
      }
    }

    static removeSession(key) {
      sessionStorage.removeItem(key);
    }
  }

  // ==================== CLASE PRINCIPAL ====================
  class NotificationSystem {
    constructor() {
      this.queue = [];                 // Cola de popups pendientes
      this.history = [];               // Historial completo
      this.popupsShownCount = 0;
      this.isMenuOpen = false;
      this.isShowingPopup = false;

      // Suscripciones Firestore (solo para respuestas)
      this.repliesUnsubscribe = null;

      // Referencias DOM
      this.dom = {
        menu: null,
        list: null,
        badge: null,
        modal: null
      };

      // Binding de métodos
      this.toggleMenu = this.toggleMenu.bind(this);
      this.closePopup = this.closePopup.bind(this);
      this.goToAnimeFromPopup = this.goToAnimeFromPopup.bind(this);
      this.markAllAsRead = this.markAllAsRead.bind(this);
      this.handleAuthChange = this.handleAuthChange.bind(this);
      this.handlePageShow = this.handlePageShow.bind(this);
      this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
      this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    // ==================== INICIALIZACIÓN ====================
    async init() {
      console.log('🔔 Inicializando NotificationSystem...');
      this.cacheDOM();
      this.loadPersistedData();
      this.setupEventListeners();

      const isFirstVisit = !localStorage.getItem(CONFIG.STORAGE_KEYS.FIRST_VISIT);
      if (isFirstVisit) {
        // Marcar todas las notificaciones antiguas como vistas
        this.history.forEach(n => { if (!n.seen) n.seen = true; });
        localStorage.setItem(CONFIG.STORAGE_KEYS.FIRST_VISIT, 'true');
        // Limpiar cola y reiniciar contador para la primera visita
        this.queue = [];
        this.popupsShownCount = 0;
        this.persistQueue();
      }

      // NUEVO: Generar notificaciones desde el catálogo local (siempre, no solo la primera vez)
      await this.generateCatalogNotifications();

      this.renderNotificationList();
      this.updateBadge();
      this.attemptResumeQueue('init');

      this.setupAuthListener();
    }

    cacheDOM() {
      this.dom.menu = document.getElementById('notifMenu');
      this.dom.list = document.getElementById('notifList');
      this.dom.badge = document.getElementById('notifBadge');
    }

    loadPersistedData() {
      // Historial y IDs vistos desde localStorage
      this.history = StorageManager.load(CONFIG.STORAGE_KEYS.HISTORY, []);
      if (this.history.length > CONFIG.MAX_HISTORY_ITEMS) {
        this.history = this.history.slice(0, CONFIG.MAX_HISTORY_ITEMS);
      }

      // Cola de popups y contador desde sessionStorage (se reinician al cerrar la pestaña)
      this.queue = StorageManager.loadSession(CONFIG.STORAGE_KEYS.QUEUE, []);
      this.popupsShownCount = parseInt(
        StorageManager.loadSession(CONFIG.STORAGE_KEYS.SHOWN_COUNT, '0'),
        10
      );

      console.log(`📦 Estado cargado: ${this.queue.length} en cola, ${this.popupsShownCount} mostrados`);
    }

    setupEventListeners() {
      window.addEventListener('pageshow', this.handlePageShow);
      window.addEventListener('beforeunload', this.handleBeforeUnload);
      document.addEventListener('click', this.handleClickOutside);

      // Exponer métodos globales requeridos por el HTML
      global.toggleNotifMenu = this.toggleMenu;
      global.closePopup = this.closePopup;
      global.goToAnimeFromPopup = this.goToAnimeFromPopup;
      global.markAllAsRead = this.markAllAsRead;
      // Compatibilidad con nombre antiguo
      global.startNotificationSequence = () => this.attemptResumeQueue('startNotificationSequence');
    }

    setupAuthListener() {
      const auth = getAuth();
      if (auth) {
        auth.onAuthStateChanged(this.handleAuthChange);
      }
    }

    async handleAuthChange(user) {
      if (user) {
        await this.syncWithCloud(user.uid);
        this.listenForReplies(user.uid);
      } else {
        if (this.repliesUnsubscribe) {
          this.repliesUnsubscribe();
          this.repliesUnsubscribe = null;
        }
      }
    }

    handlePageShow(event) {
      console.log(`🔄 pageshow (persisted: ${event.persisted})`);
      this.loadPersistedData(); // Recargar por posibles cambios en otra pestaña
      this.updateBadge();
      this.renderNotificationList();
      this.attemptResumeQueue('pageshow');
    }

    handleBeforeUnload() {
      this.persistQueue();
    }

    handleClickOutside(e) {
      const wrapper = document.querySelector('.notif-wrapper');
      if (wrapper && !wrapper.contains(e.target) && this.isMenuOpen) {
        this.isMenuOpen = false;
        if (this.dom.menu) this.dom.menu.classList.remove('active');
      }
    }

    // ==================== PERSISTENCIA ====================
    persistQueue() {
      if (this.queue.length > 0) {
        const serializable = this.queue.map(n => ({
          notifId: n.notifId,
          animeId: n.animeId,
          title: n.title,
          img: n.img,
          seasonCover: n.seasonCover,
          blockName: n.blockName,
          epTitle: n.epTitle,
          type: n.type,
          date: n.date,
          isFinal: n.isFinal,
          url: n.url || null,
          originalText: n.originalText || null
        }));
        StorageManager.saveSession(CONFIG.STORAGE_KEYS.QUEUE, serializable);
      } else {
        StorageManager.removeSession(CONFIG.STORAGE_KEYS.QUEUE);
      }
      StorageManager.saveSession(CONFIG.STORAGE_KEYS.SHOWN_COUNT, this.popupsShownCount.toString());
    }

    persistHistory() {
      StorageManager.save(CONFIG.STORAGE_KEYS.HISTORY, this.history);
      this.updateBadge();

      const user = this.getCurrentUser();
      if (user) {
        const db = getFirestore();
        if (db) {
          db.collection('users').doc(user.uid).set({
            notifHistory: this.history,
            seenNotifIds: StorageManager.load(CONFIG.STORAGE_KEYS.SEEN_IDS, [])
          }, { merge: true }).catch(e => console.error('[Firestore] Error guardando historial:', e));
        }
      }
    }

    // ==================== GENERACIÓN DE NOTIFICACIONES DESDE EL CATÁLOGO LOCAL ====================
    async generateCatalogNotifications() {
      // Verificar que catalogoArray exista
      if (typeof catalogoArray === 'undefined' || catalogoArray.length === 0) {
        console.warn('⏳ catalogoArray no disponible aún. Reintentando en 500ms...');
        setTimeout(() => this.generateCatalogNotifications(), 500);
        return;
      }

      console.log('📦 Revisando catálogo local en busca de nuevos animes...');

      const now = Date.now();
      const thirtyDaysAgo = now - (CONFIG.ANIME_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
      const seenIds = StorageManager.load(CONFIG.STORAGE_KEYS.SEEN_IDS, []);

      // Filtrar animes con updateType relevante, fecha reciente y no vistos previamente
      const candidatos = catalogoArray
        .filter(a => a.updateType && a.updateType !== 'Ninguna')
        .filter(a => {
          const ts = this._getTimestamp(a.lastUpdate);
          return ts > thirtyDaysAgo;
        })
        .filter(a => {
          const notifId = `${a.id}_${this._getTimestamp(a.lastUpdate)}`;
          return !seenIds.includes(notifId) && !this.history.some(n => n.notifId === notifId);
        })
        .sort((a, b) => this._getTimestamp(b.lastUpdate) - this._getTimestamp(a.lastUpdate))
        .slice(0, CONFIG.MAX_POPUPS);

      console.log(`✨ ${candidatos.length} animes nuevos encontrados para notificar.`);

      for (const anime of candidatos) {
        const notif = this.createAnimeNotification(anime);
        if (!notif) continue;

        // Marcar como visto para no repetirlo en futuras cargas
        seenIds.push(notif.notifId);
        this.history.unshift(notif);

        // Agregar a la cola de popups si no hemos excedido el límite de esta sesión
        if (this.popupsShownCount < CONFIG.MAX_POPUPS && this.queue.length < CONFIG.MAX_POPUPS) {
          this.queue.push(notif);
          console.log(`🔔 Popup encolado: ${anime.title}`);
        }
      }

      // Guardar IDs vistos actualizados (limitar a 1000 para no sobrecargar localStorage)
      StorageManager.save(CONFIG.STORAGE_KEYS.SEEN_IDS, seenIds.slice(-1000));

      if (this.history.length > CONFIG.MAX_HISTORY_ITEMS) {
        this.history = this.history.slice(0, CONFIG.MAX_HISTORY_ITEMS);
      }

      this.persistHistory();
      this.renderNotificationList();
      this.updateBadge();
      this.persistQueue();
    }

    _getTimestamp(value) {
      if (!value) return 0;
      if (typeof value.toMillis === 'function') return value.toMillis();
      if (typeof value === 'number') return value;
      return new Date(value).getTime() || 0;
    }

    createAnimeNotification(anime) {
      const ts = this._getTimestamp(anime.lastUpdate);
      const notifId = `${anime.id}_${ts}`;
      return {
        notifId,
        animeId: anime.id,
        title: anime.title,
        img: anime.img,
        seasonCover: anime.latestSeasonCover || anime.img,
        blockName: anime.latestBlockName || "",
        epTitle: anime.latestEpTitle || "Nuevo Contenido",
        type: anime.updateType,
        date: ts,
        seen: false,
        isFinal: anime.isFinal || false,
        popupShown: false
      };
    }

    // ==================== SINCRONIZACIÓN CON CLOUD (SOLO PARA RESPUESTAS) ====================
    async syncWithCloud(uid) {
      try {
        const db = getFirestore();
        if (!db) return;

        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
          const data = doc.data();
          // Fusionar IDs vistos
          if (data.seenNotifIds) {
            const localSeen = StorageManager.load(CONFIG.STORAGE_KEYS.SEEN_IDS, []);
            const merged = [...new Set([...localSeen, ...data.seenNotifIds])].slice(-1000);
            StorageManager.save(CONFIG.STORAGE_KEYS.SEEN_IDS, merged);
          }
          // Fusionar historial
          if (data.notifHistory) {
            const merged = [...this.history, ...data.notifHistory];
            const uniqueMap = new Map();
            merged.forEach(n => uniqueMap.set(n.notifId, n));
            this.history = Array.from(uniqueMap.values())
              .sort((a, b) => b.date - a.date)
              .slice(0, CONFIG.MAX_HISTORY_ITEMS);
          }
        }
        this.persistHistory();
        this.renderNotificationList();
        this.updateBadge();
      } catch (e) {
        console.error('[Sync] Error sincronizando con nube:', e);
      }
    }

    // ==================== ESCUCHA DE RESPUESTAS (FIRESTORE) ====================
    listenForReplies(uid) {
      if (this.repliesUnsubscribe) this.repliesUnsubscribe();

      const db = getFirestore();
      if (!db) return;

      this.repliesUnsubscribe = db.collection('comments')
        .where('replyToUserId', '==', uid)
        .orderBy('timestamp', 'desc')
        .limit(20)
        .onSnapshot(async snapshot => {
          let hasNew = false;
          let shouldShowPopup = false;

          for (const change of snapshot.docChanges()) {
            if (change.type !== 'added') continue;
            const data = change.doc.data();
            if (data.userId === uid) continue; // No notificar respuestas propias

            const docId = change.doc.id;
            const notifId = `reply_${docId}`;
            if (this.history.some(n => n.notifId === notifId)) continue;

            const notif = await this.createReplyNotification(data, docId, notifId);
            if (!notif) continue;

            this.history.unshift(notif);
            hasNew = true;

            // No se agrega automáticamente a la cola de popups para respuestas (se controla en otro lado si se desea)
            // Solo se marca como visto en el almacenamiento local
            this.markAsSeenInStorage(notifId);
          }

          if (hasNew) {
            if (this.history.length > CONFIG.MAX_HISTORY_ITEMS) {
              this.history = this.history.slice(0, CONFIG.MAX_HISTORY_ITEMS);
            }
            this.persistHistory();
            this.renderNotificationList();
            if (!this.isMenuOpen) this.updateBadge();
          }
        }, error => console.error('[Replies] Error en listener:', error));
    }

    async createReplyNotification(data, docId, notifId) {
      let rawText = data.texto || "";
      let cleanText = rawText.replace(/\[Sticker\]\([^)]+\)/g, '🖼️ (Sticker)').trim();
      if (!cleanText) cleanText = "🖼️ (Sticker)";

      let originalText = data.replyToText || data.textoOriginal || "";
      if (!originalText && data.replyToId) {
        try {
          const db = getFirestore();
          const parentDoc = await db.collection('comments').doc(data.replyToId).get();
          if (parentDoc.exists) {
            let pText = parentDoc.data().texto || "";
            originalText = pText.replace(/\[Sticker\]\([^)]+\)/g, '🖼️ (Sticker)').trim();
          }
        } catch (e) { /* ignorar */ }
      }

      const timestampMs = data.timestamp?.toMillis() || Date.now();

      return {
        notifId,
        type: 'RESPUESTA',
        animeId: data.animeId,
        title: `¡${data.userName} te respondió!`,
        img: data.userAvatar || 'invitado.avif',
        seasonCover: data.userAvatar || 'invitado.avif',
        blockName: 'Foro',
        epTitle: `"${cleanText.substring(0, 80)}${cleanText.length > 80 ? '...' : ''}"`,
        originalText: originalText ? `"${originalText.substring(0, 60)}${originalText.length > 60 ? '...' : ''}"` : `"Comentario original no disponible"`,
        date: timestampMs,
        seen: false,
        isFinal: false,
        url: `video-player.html?anime=${data.animeId}&s=${data.season}&e=${data.episode}&targetComment=${docId}`
      };
    }

    // ==================== GESTIÓN DE POPUPS ====================
    attemptResumeQueue(source) {
      console.log(`🎬 [${source}] Reanudando cola. Pendientes: ${this.queue.length}, Mostrados: ${this.popupsShownCount}`);

      // Limpiar modal residual
      const existingModal = document.getElementById('eventModal');
      if (existingModal) {
        existingModal.remove();
        domUtils.enableScroll();
        this.isShowingPopup = false;
      }

      if (this.queue.length === 0) {
        console.log('✅ Cola vacía');
        return;
      }

      if (this.popupsShownCount >= CONFIG.MAX_POPUPS) {
        console.log('⛔ Límite de popups alcanzado. Limpiando cola.');
        this.queue = [];
        this.persistQueue();
        return;
      }

      if (!this.isShowingPopup) {
        this.showNextPopup();
      }
    }

    showNextPopup() {
      if (this.isShowingPopup) {
        console.warn('⚠️ Ya hay un popup activo');
        return;
      }

      if (this.queue.length === 0) {
        console.log('✅ Cola de popups vacía');
        return;
      }

      if (this.popupsShownCount >= CONFIG.MAX_POPUPS) {
        console.log('⛔ Límite alcanzado');
        this.queue = [];
        this.persistQueue();
        return;
      }

      this.isShowingPopup = true;
      this.popupsShownCount++;
      this.persistQueue();

      console.log(`🎬 Mostrando popup #${this.popupsShownCount} (quedan ${this.queue.length - 1})`);
      this.renderPopup(this.queue[0]);
    }

    renderPopup(notif) {
      const existing = document.getElementById('eventModal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'eventModal';
      modal.innerHTML = this.generatePopupHTML(notif);
      document.body.appendChild(modal);
      domUtils.disableScroll();

      // Forzar reflow y luego mostrar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => modal.classList.add('show'));
      });
    }

    generatePopupHTML(notif) {
      if (notif.type === 'RESPUESTA') {
        return `
          <div class="event-card" style="border: 1px solid var(--neon-cyan); box-shadow: 0 10px 40px rgba(0, 243, 255, 0.15); background: #0a0a0f; overflow: hidden; border-radius: 20px; max-width: 420px; width: 90%;">
            <button class="event-close" onclick="closePopup()" aria-label="Cerrar" style="background: rgba(0,0,0,0.5); border: 1px solid var(--neon-cyan); color: var(--neon-cyan); top: 15px; right: 15px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; z-index: 10;"><i class="fas fa-times"></i></button>
            <div style="background: linear-gradient(135deg, rgba(0,243,255,0.1) 0%, transparent 100%); padding: 25px 20px 15px; border-bottom: 1px solid rgba(0, 243, 255, 0.15); display: flex; align-items: center; gap: 15px; position: relative;">
              <div style="position: relative; flex-shrink: 0;">
                <img src="${notif.img}" alt="Avatar Usuario" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--neon-cyan); box-shadow: 0 0 15px rgba(0,243,255,0.4);">
                <div style="position: absolute; bottom: -2px; right: -2px; background: #0a0a0f; border-radius: 50%; padding: 4px; border: 1px solid var(--neon-cyan); display: flex; align-items: center; justify-content: center; width: 22px; height: 22px;">
                  <i class="fas fa-reply" style="color: var(--neon-cyan); font-size: 0.65rem;"></i>
                </div>
              </div>
              <div style="flex: 1; text-align: left; padding-right: 20px; overflow: hidden;">
                <div style="color: var(--neon-cyan); font-family: 'Orbitron', sans-serif; font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 3px;">NUEVA RESPUESTA</div>
                <h2 style="font-size: 1.05rem; color: #fff; margin: 0; font-weight: 700; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${domUtils.sanitizeHTML(notif.title)}</h2>
              </div>
            </div>
            <div style="padding: 20px; text-align: left;">
              <div style="background: rgba(255,255,255,0.03); border-left: 3px solid rgba(255,255,255,0.15); padding: 12px 15px; border-radius: 0 8px 8px 0; margin-bottom: 15px; position: relative;">
                <i class="fas fa-quote-left" style="position: absolute; top: 10px; right: 15px; font-size: 1.2rem; color: rgba(255,255,255,0.03);"></i>
                <div style="font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tu comentario</div>
                <span style="font-size: 0.85rem; color: #aaa; font-style: italic; display: block; padding-right: 20px; line-height: 1.4;">${domUtils.sanitizeHTML(notif.originalText)}</span>
              </div>
              <div style="background: rgba(0, 243, 255, 0.05); border: 1px solid rgba(0, 243, 255, 0.15); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <p style="color: #fff; font-size: 0.95rem; margin: 0; line-height: 1.5; word-wrap: break-word;">${domUtils.sanitizeHTML(notif.epTitle)}</p>
              </div>
              <button class="event-btn" style="background: var(--neon-cyan); color: #000; box-shadow: 0 0 15px rgba(0, 243, 255, 0.3); border-radius: 10px; font-size: 0.85rem; padding: 12px; width: 100%; border: none; font-weight: 800; font-family: 'Orbitron', sans-serif; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="goToAnimeFromPopup('${notif.animeId}', '${notif.notifId}')"> <i class="fas fa-comments"></i> VER CONVERSACIÓN </button>
            </div>
          </div>`;
      }

      // Popup de anime normal
      let infoString = "";
      if (notif.blockName && notif.blockName !== "Novedad") infoString += `<span style="color:var(--neon-cyan)">${notif.blockName}</span>`;
      if (notif.epTitle && notif.epTitle !== "Nuevo Contenido") infoString += (infoString ? " • " : "") + `<span style="color:#fff">${notif.epTitle}</span>`;
      else if (!infoString) infoString = "Nuevo Contenido";

      let badgeColor = "#bc13fe";
      if (notif.type.includes("ESTRENO")) badgeColor = "#ff0055";
      else if (notif.type.includes("PRÓXIMAMENTE")) badgeColor = "#f1c40f";

      return `
        <div class="event-card">
          <button class="event-close" onclick="closePopup()" aria-label="Cerrar"><i class="fas fa-times"></i></button>
          <div class="event-visuals">
            <div class="visual-bg" style="background-image: url('${notif.img}');"></div>
            <div class="covers-container">
              <img src="${notif.img}" class="cover-back" alt="Poster">
              <img src="${notif.seasonCover}" class="cover-front" alt="Season">
            </div>
            <div class="event-type-badge" style="background: ${badgeColor}; box-shadow: 0 0 15px ${badgeColor};">${notif.type}</div>
            ${notif.isFinal ? '<div style="position: absolute; bottom: 15px; right: 15px; z-index: 20; color: #fff; background: rgba(255, 0, 0, 0.8); border: 2px solid #ff0000; padding: 4px 12px; border-radius: 4px; font-weight: 900; font-family: \'Orbitron\', sans-serif; font-size: 0.85rem; transform: rotate(-10deg); box-shadow: 0 0 15px #ff0000; letter-spacing: 1px;">FINALIZADO</div>' : ''}
          </div>
          <div class="event-info">
            <h2 class="event-title">${domUtils.sanitizeHTML(notif.title)}</h2>
            <div class="event-meta">${infoString}</div>
            <p class="event-desc">¡Ya disponible en la plataforma! Disfruta del estreno.</p>
            <button class="event-btn" onclick="goToAnimeFromPopup('${notif.animeId}', '${notif.notifId}')"><i class="fas fa-play"></i> VER AHORA</button>
          </div>
        </div>`;
    }

    closePopup() {
      const modal = document.getElementById('eventModal');
      if (!modal) return;

      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
        if (this.queue.length > 0) {
          this.queue.shift();
        }
        domUtils.enableScroll();
        this.isShowingPopup = false;
        this.persistQueue();
        this.showNextPopup();
      }, 300); // duración de la animación (CONFIG.ANIMATION_DURATION)
    }

    goToAnimeFromPopup(animeId, notifId) {
      const targetNotif = this.history.find(n => n.notifId === notifId);
      if (targetNotif && !targetNotif.seen) {
        this.markAsRead(notifId);
      }

      if (this.queue.length > 0 && this.queue[0].notifId === notifId) {
        this.queue.shift();
      }
      this.persistQueue();
      this.isShowingPopup = false;
      domUtils.enableScroll();

      if (targetNotif && targetNotif.url) {
        window.location.href = targetNotif.url;
      } else {
        window.location.href = `anime-detail.html?id=${animeId}`;
      }
    }

    // ==================== UI DEL MENÚ ====================
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if (this.isMenuOpen) {
        this.dom.menu?.classList.add('active');
        this.renderNotificationList();
      } else {
        this.dom.menu?.classList.remove('active');
      }
    }

    markAllAsRead() {
      let changed = false;
      this.history.forEach(n => {
        if (!n.seen) {
          n.seen = true;
          changed = true;
        }
      });
      if (changed) {
        this.persistHistory();
        this.renderNotificationList();
        this.updateBadge();
      }
    }

    markAsRead(notifId) {
      const target = this.history.find(n => n.notifId === notifId);
      if (target && !target.seen) {
        target.seen = true;
        this.persistHistory();
        this.updateBadge();
        this.renderNotificationList();
      }
    }

    renderNotificationList = domUtils.debounce(() => {
      const container = this.dom.list;
      if (!container) return;

      // Agregar botón "Marcar todo" si no existe
      const header = this.dom.menu?.querySelector('.notif-header');
      if (header && !header.querySelector('.mark-all-btn')) {
        const btn = document.createElement('button');
        btn.className = 'mark-all-btn';
        btn.innerHTML = '<i class="fas fa-check-double"></i> Marcar todo';
        btn.title = 'Marcar todas las notificaciones como vistas';
        btn.onclick = (e) => { e.stopPropagation(); this.markAllAsRead(); };
        btn.style.cssText = `
          background: rgba(0,243,255,0.1); border: 1px solid var(--neon-cyan); color: var(--neon-cyan);
          border-radius: 20px; padding: 4px 12px; font-size: 0.7rem; font-family: 'Orbitron', sans-serif;
          cursor: pointer; transition: all 0.2s; margin-left: 10px;
          ${window.innerWidth <= 768 ? 'margin-right: 35px;' : ''}
        `;
        btn.onmouseenter = () => { btn.style.background = 'rgba(0,243,255,0.3)'; btn.style.transform = 'scale(1.02)'; };
        btn.onmouseleave = () => { btn.style.background = 'rgba(0,243,255,0.1)'; btn.style.transform = 'scale(1)'; };
        header.appendChild(btn);
      }

      if (!this.history.length) {
        container.innerHTML = '<div class="empty-notif"><i class="fas fa-satellite-dish"></i><br>Sin novedades por ahora.</div>';
        return;
      }

      const visible = this.history.slice(0, CONFIG.MAX_VISIBLE_NOTIFICATIONS);
      const fragment = document.createDocumentFragment();

      visible.forEach(item => {
        const div = document.createElement('div');
        div.className = 'notif-item';

        let imgClass = 'notif-img-box';
        if (item.type === 'RESPUESTA') imgClass += ' rounded-avatar';

        let infoString = "";
        if (item.blockName && item.blockName !== "Novedad") infoString += `<span class="n-block">${item.blockName}</span>`;
        if (item.epTitle && item.epTitle !== "Nuevo Contenido") infoString += (infoString ? " " : "") + `<span class="n-ep-title">${item.epTitle}</span>`;
        else if (!infoString) infoString = `<span class="n-ep-title">Nuevo Contenido</span>`;

        let typeColor = "var(--neon-purple)";
        if (item.type.includes("ESTRENO")) typeColor = "var(--neon-pink)";
        else if (item.type.includes("PRÓXIMAMENTE")) typeColor = "var(--neon-yellow)";
        else if (item.type === "RESPUESTA") typeColor = "var(--neon-cyan)";

        div.innerHTML = `
          <div style="position:relative; display:inline-block;">
            ${!item.seen ? '<div class="unread-dot" style="position:absolute; top:-4px; left:-4px; width:12px; height:12px; background:#ff0000; border-radius:50%; box-shadow:0 0 8px #ff0000; z-index:20; border:1px solid #fff;"></div>' : ''}
            <div class="${imgClass}"><img src="${item.seasonCover}" alt="cover" loading="lazy"></div>
          </div>
          <div class="notif-content">
            <div class="notif-header-line"><span class="n-title">${domUtils.sanitizeHTML(item.title)}</span></div>
            <div class="n-type" style="color:${typeColor}">${item.type} ${item.isFinal ? '<span class="tag-final">FINALIZADO</span>' : ''}</div>
            <div class="n-meta">${infoString}</div>
          </div>`;

        div.addEventListener('click', () => {
          if (!item.seen) {
            this.markAsRead(item.notifId);
            div.querySelector('.unread-dot')?.remove();
          }
          location.href = item.url || `anime-detail.html?id=${item.animeId}`;
        });

        fragment.appendChild(div);
      });

      container.innerHTML = '';
      container.appendChild(fragment);

      if (this.history.length > CONFIG.MAX_VISIBLE_NOTIFICATIONS) {
        const more = document.createElement('div');
        more.className = 'notif-item';
        more.style.justifyContent = 'center';
        more.style.opacity = '0.7';
        more.innerHTML = `<div style="text-align:center;"><i class="fas fa-ellipsis-h"></i> ${this.history.length - CONFIG.MAX_VISIBLE_NOTIFICATIONS} notificaciones antiguas</div>`;
        container.appendChild(more);
      }
    }, 100);

    updateBadge() {
      const unread = this.history.filter(n => !n.seen).length;
      if (this.dom.badge) {
        this.dom.badge.style.display = unread ? 'flex' : 'none';
        if (unread) this.dom.badge.textContent = unread > 9 ? '+9' : unread;
      }
    }

    // ==================== HELPERS ====================
    getCurrentUser() {
      const auth = getAuth();
      return auth?.currentUser;
    }

    markAsSeenInStorage(notifId) {
      const seenIds = StorageManager.load(CONFIG.STORAGE_KEYS.SEEN_IDS, []);
      if (!seenIds.includes(notifId)) {
        seenIds.push(notifId);
        if (seenIds.length > 1000) seenIds.shift();
        StorageManager.save(CONFIG.STORAGE_KEYS.SEEN_IDS, seenIds);
      }
    }
  }

  // ==================== INICIALIZACIÓN AUTOMÁTICA ====================
  const notificationSystem = new NotificationSystem();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => notificationSystem.init());
  } else {
    notificationSystem.init();
  }

  // Exponer la instancia para depuración (opcional)
  global.NotificationSystem = notificationSystem;

})(window);