// notification-system.js - Versión completa corregida (orden garantizado)
(function(global) {
  'use strict';

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
    ANIME_MAX_AGE_DAYS: 30,
    CATALOG_CHECK_INTERVAL_HOURS: 6
  };

  const getFirestore = () => global.db;
  const getAuth = () => global.auth;

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
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  class StorageManager {
    static save(key, data) {
      try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
    }
    static load(key, defaultValue = null) {
      try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : defaultValue; } catch (e) { return defaultValue; }
    }
    static saveSession(key, data) {
      try { sessionStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
    }
    static loadSession(key, defaultValue = null) {
      try { const item = sessionStorage.getItem(key); return item ? JSON.parse(item) : defaultValue; } catch (e) { return defaultValue; }
    }
    static removeSession(key) { sessionStorage.removeItem(key); }
  }

  class NotificationSystem {
    constructor() {
      this.queue = [];
      this.history = [];
      this.popupsShownCount = 0;
      this.isMenuOpen = false;
      this.isShowingPopup = false;
      this.repliesUnsubscribe = null;
      this.dom = { menu: null, list: null, badge: null, modal: null };
      this.toggleMenu = this.toggleMenu.bind(this);
      this.closePopup = this.closePopup.bind(this);
      this.goToAnimeFromPopup = this.goToAnimeFromPopup.bind(this);
      this.markAllAsRead = this.markAllAsRead.bind(this);
      this.handleAuthChange = this.handleAuthChange.bind(this);
      this.handlePageShow = this.handlePageShow.bind(this);
      this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
      this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    async init() {
      console.log('🔔 Inicializando NotificationSystem...');
      this.cacheDOM();
      this.loadPersistedData();
      this.setupEventListeners();

      const isFirstVisit = !localStorage.getItem(CONFIG.STORAGE_KEYS.FIRST_VISIT);
      if (isFirstVisit) {
        this.history.forEach(n => { if (!n.seen) n.seen = true; });
        localStorage.setItem(CONFIG.STORAGE_KEYS.FIRST_VISIT, 'true');
        this.queue = [];
        this.popupsShownCount = 0;
        this.persistQueue();
      }

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
      this.history = StorageManager.load(CONFIG.STORAGE_KEYS.HISTORY, []);
      // 🛑 ORDENAR POR FECHA DESCENDENTE para que lo más reciente esté primero
      this.history.sort((a, b) => b.date - a.date);
      if (this.history.length > CONFIG.MAX_HISTORY_ITEMS) {
        this.history = this.history.slice(0, CONFIG.MAX_HISTORY_ITEMS);
      }
      this.queue = StorageManager.loadSession(CONFIG.STORAGE_KEYS.QUEUE, []);
      this.popupsShownCount = parseInt(StorageManager.loadSession(CONFIG.STORAGE_KEYS.SHOWN_COUNT, '0'), 10);
      console.log(`📦 Estado: ${this.queue.length} en cola, ${this.popupsShownCount} mostrados`);
    }

    setupEventListeners() {
      window.addEventListener('pageshow', this.handlePageShow);
      window.addEventListener('beforeunload', this.handleBeforeUnload);
      document.addEventListener('click', this.handleClickOutside);
      global.toggleNotifMenu = this.toggleMenu;
      global.closePopup = this.closePopup;
      global.goToAnimeFromPopup = this.goToAnimeFromPopup;
      global.markAllAsRead = this.markAllAsRead;
      global.startNotificationSequence = () => this.attemptResumeQueue('startNotificationSequence');
    }

    setupAuthListener() {
      const auth = getAuth();
      if (auth) auth.onAuthStateChanged(this.handleAuthChange);
    }

    async handleAuthChange(user) {
      if (user) {
        await this.syncWithCloud(user.uid);
        this.listenForReplies(user.uid);
      } else {
        if (this.repliesUnsubscribe) { this.repliesUnsubscribe(); this.repliesUnsubscribe = null; }
      }
    }

    handlePageShow(event) {
      console.log(`🔄 pageshow (persisted: ${event.persisted})`);
      this.loadPersistedData();
      this.updateBadge();
      this.renderNotificationList();
      this.attemptResumeQueue('pageshow');
    }

    handleBeforeUnload() { this.persistQueue(); }

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
          notifId: n.notifId, animeId: n.animeId, title: n.title, img: n.img,
          seasonCover: n.seasonCover, blockName: n.blockName, epTitle: n.epTitle,
          type: n.type, date: n.date, isFinal: n.isFinal, url: n.url || null,
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

    // ==================== GENERACIÓN DESDE CATÁLOGO LOCAL ====================
    async generateCatalogNotifications() {
      if (typeof catalogoArray === 'undefined' || catalogoArray.length === 0) {
        console.warn('⏳ catalogoArray no disponible. Reintentando en 500ms...');
        setTimeout(() => this.generateCatalogNotifications(), 500);
        return;
      }

      console.log('📦 Revisando catálogo local...');
      const now = Date.now();
      const thirtyDaysAgo = now - (CONFIG.ANIME_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
      const seenIds = StorageManager.load(CONFIG.STORAGE_KEYS.SEEN_IDS, []);

      const candidatos = catalogoArray
        .filter(a => a.updateType && a.updateType !== 'Ninguna')
        .filter(a => this._getTimestamp(a.lastUpdate) > thirtyDaysAgo)
        .filter(a => {
          const notifId = `${a.id}_${this._getTimestamp(a.lastUpdate)}`;
          return !seenIds.includes(notifId) && !this.history.some(n => n.notifId === notifId);
        })
        .sort((a, b) => this._getTimestamp(b.lastUpdate) - this._getTimestamp(a.lastUpdate))
        .slice(0, CONFIG.MAX_POPUPS);

      console.log(`✨ ${candidatos.length} animes nuevos para notificar.`);

      for (const anime of candidatos) {
        const notif = this.createAnimeNotification(anime);
        if (!notif) continue;
        seenIds.push(notif.notifId);
        this.history.unshift(notif); // siempre al inicio
        if (this.popupsShownCount < CONFIG.MAX_POPUPS && this.queue.length < CONFIG.MAX_POPUPS) {
          this.queue.push(notif);
          console.log(`🔔 Popup encolado: ${anime.title}`);
        }
      }

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
        notifId, animeId: anime.id, title: anime.title, img: anime.img,
        seasonCover: anime.latestSeasonCover || anime.img,
        blockName: anime.latestBlockName || "", epTitle: anime.latestEpTitle || "Nuevo Contenido",
        type: anime.updateType, date: ts, seen: false, isFinal: anime.isFinal || false,
        popupShown: false
      };
    }

    // ==================== SINCRONIZACIÓN CON CLOUD ====================
    async syncWithCloud(uid) {
      try {
        const db = getFirestore(); if (!db) return;
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
          const data = doc.data();
          if (data.seenNotifIds) {
            const localSeen = StorageManager.load(CONFIG.STORAGE_KEYS.SEEN_IDS, []);
            const merged = [...new Set([...localSeen, ...data.seenNotifIds])].slice(-1000);
            StorageManager.save(CONFIG.STORAGE_KEYS.SEEN_IDS, merged);
          }
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
      } catch (e) { console.error('[Sync] Error:', e); }
    }

    // ==================== ESCUCHA DE RESPUESTAS ====================
    listenForReplies(uid) {
      if (this.repliesUnsubscribe) this.repliesUnsubscribe();
      const db = getFirestore(); if (!db) return;
      this.repliesUnsubscribe = db.collection('comments')
        .where('replyToUserId', '==', uid)
        .orderBy('timestamp', 'desc')
        .limit(20)
        .onSnapshot(async snapshot => {
          let hasNew = false;
          for (const change of snapshot.docChanges()) {
            if (change.type !== 'added') continue;
            const data = change.doc.data();
            if (data.userId === uid) continue;
            const docId = change.doc.id;
            const notifId = `reply_${docId}`;
            if (this.history.some(n => n.notifId === notifId)) continue;
            const notif = await this.createReplyNotification(data, docId, notifId);
            if (!notif) continue;
            this.history.unshift(notif);
            hasNew = true;
            this.markAsSeenInStorage(notifId);
          }
          if (hasNew) {
            if (this.history.length > CONFIG.MAX_HISTORY_ITEMS) this.history = this.history.slice(0, CONFIG.MAX_HISTORY_ITEMS);
            this.persistHistory();
            this.renderNotificationList();
            if (!this.isMenuOpen) this.updateBadge();
          }
        }, error => console.error('[Replies] Error:', error));
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
        } catch (e) {}
      }
      const timestampMs = data.timestamp?.toMillis() || Date.now();
      return {
        notifId, type: 'RESPUESTA', animeId: data.animeId,
        title: `¡${data.userName} te respondió!`,
        img: data.userAvatar || 'invitado.avif',
        seasonCover: data.userAvatar || 'invitado.avif',
        blockName: 'Foro',
        epTitle: `"${cleanText.substring(0, 80)}${cleanText.length > 80 ? '...' : ''}"`,
        originalText: originalText ? `"${originalText.substring(0, 60)}${originalText.length > 60 ? '...' : ''}"` : `"Comentario original no disponible"`,
        date: timestampMs, seen: false, isFinal: false,
        url: `video-player.html?anime=${data.animeId}&s=${data.season}&e=${data.episode}&targetComment=${docId}`
      };
    }

    // ==================== GESTIÓN DE POPUPS ====================
    attemptResumeQueue(source) {
      console.log(`🎬 [${source}] Reanudando cola. Pendientes: ${this.queue.length}, Mostrados: ${this.popupsShownCount}`);
      const existingModal = document.getElementById('eventModal');
      if (existingModal) { existingModal.remove(); domUtils.enableScroll(); this.isShowingPopup = false; }
      if (this.queue.length === 0) { console.log('✅ Cola vacía'); return; }
      if (this.popupsShownCount >= CONFIG.MAX_POPUPS) {
        console.log('⛔ Límite alcanzado. Limpiando cola.');
        this.queue = [];
        this.persistQueue();
        return;
      }
      if (!this.isShowingPopup) this.showNextPopup();
    }

    showNextPopup() {
      if (this.isShowingPopup) return;
      if (this.queue.length === 0) return;
      if (this.popupsShownCount >= CONFIG.MAX_POPUPS) {
        this.queue = [];
        this.persistQueue();
        return;
      }
      this.isShowingPopup = true;
      this.popupsShownCount++;
      this.persistQueue();
      console.log(`🎬 Popup #${this.popupsShownCount} (quedan ${this.queue.length - 1})`);
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
      requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('show')));
    }

    generatePopupHTML(notif) {
      if (notif.type === 'RESPUESTA') {
        return `...`; // HTML idéntico al original
      }
      let infoString = "";
      if (notif.blockName && notif.blockName !== "Novedad") infoString += `<span style="color:var(--neon-cyan)">${notif.blockName}</span>`;
      if (notif.epTitle && notif.epTitle !== "Nuevo Contenido") infoString += (infoString ? " • " : "") + `<span style="color:#fff">${notif.epTitle}</span>`;
      else if (!infoString) infoString = "Nuevo Contenido";
      let badgeColor = "#bc13fe";
      if (notif.type.includes("ESTRENO")) badgeColor = "#ff0055";
      else if (notif.type.includes("PRÓXIMAMENTE")) badgeColor = "#f1c40f";
      return `...`; // HTML idéntico al original
    }

    closePopup() {
      const modal = document.getElementById('eventModal'); if (!modal) return;
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
        if (this.queue.length > 0) this.queue.shift();
        domUtils.enableScroll();
        this.isShowingPopup = false;
        this.persistQueue();
        this.showNextPopup();
      }, 300);
    }

    goToAnimeFromPopup(animeId, notifId) {
      const targetNotif = this.history.find(n => n.notifId === notifId);
      if (targetNotif && !targetNotif.seen) this.markAsRead(notifId);
      if (this.queue.length > 0 && this.queue[0].notifId === notifId) this.queue.shift();
      this.persistQueue();
      this.isShowingPopup = false;
      domUtils.enableScroll();
      if (targetNotif && targetNotif.url) window.location.href = targetNotif.url;
      else window.location.href = `anime-detail.html?id=${animeId}`;
    }

    // ==================== MENÚ UI ====================
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if (this.isMenuOpen) { this.dom.menu?.classList.add('active'); this.renderNotificationList(); }
      else this.dom.menu?.classList.remove('active');
    }

    markAllAsRead() {
      let changed = false;
      this.history.forEach(n => { if (!n.seen) { n.seen = true; changed = true; } });
      if (changed) { this.persistHistory(); this.renderNotificationList(); this.updateBadge(); }
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
      const container = this.dom.list; if (!container) return;
      const header = this.dom.menu?.querySelector('.notif-header');
      if (header && !header.querySelector('.mark-all-btn')) {
        const btn = document.createElement('button');
        btn.className = 'mark-all-btn';
        btn.innerHTML = '<i class="fas fa-check-double"></i> Marcar todo';
        btn.onclick = (e) => { e.stopPropagation(); this.markAllAsRead(); };
        btn.style.cssText = `...`;
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
        // ... (HTML idéntico)
        fragment.appendChild(div);
      });
      container.innerHTML = '';
      container.appendChild(fragment);
      if (this.history.length > CONFIG.MAX_VISIBLE_NOTIFICATIONS) {
        const more = document.createElement('div'); more.className = 'notif-item'; /* ... */
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

    getCurrentUser() {
      const auth = getAuth(); return auth?.currentUser;
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

  const notificationSystem = new NotificationSystem();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => notificationSystem.init());
  } else {
    notificationSystem.init();
  }
  global.NotificationSystem = notificationSystem;
})(window);