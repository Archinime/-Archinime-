// ============================================================
// ARCHINIME - SISTEMA DE NOTIFICACIONES v2.0
// ============================================================

(function(global) {
  'use strict';

  const CONFIG = {
    MAX_POPUPS_PER_SESSION: 4,        // Máximo de popups por visita
    MAX_HISTORY_ITEMS: 50,
    STORAGE_KEYS: {
      HISTORY: 'ani_notif_hist',
      SEEN_IDS: 'ani_notif_seen',
      LAST_CATALOG_SNAPSHOT: 'ani_last_catalog_snapshot',
      POPUP_COUNTER: 'ani_popup_counter',
      POPUP_QUEUE: 'ani_popup_queue'
    },
    MIN_POPUP_INTERVAL: 2000          // ms entre popups
  };

  // Utilidades
  const dom = {
    disableScroll() {
      document.body.classList.add('modal-open');
    },
    enableScroll() {
      document.body.classList.remove('modal-open');
    },
    sanitize(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  };

  class NotificationSystem {
    constructor() {
      this.history = [];               // Todas las notificaciones
      this.popupQueue = [];            // Cola de popups pendientes
      this.popupsShown = 0;
      this.activePopup = false;
      this.unsubscribeReplies = null;

      // DOM
      this.menu = document.getElementById('notifMenu');
      this.list = document.getElementById('notifList');
      this.badge = document.getElementById('notifBadge');

      this.init();
    }

    async init() {
      console.log('🔔 NotificationSystem v2 iniciado');
      this.loadHistory();
      this.loadPopupState();

      // Detectar cambios en el catálogo local
      await this.detectCatalogChanges();

      // Reanudar cola de popups
      this.processQueue();

      // Escuchar respuestas a comentarios (Firestore)
      this.listenToReplies();

      // Exponer métodos globales
      global.toggleNotifMenu = () => this.toggleMenu();
      global.closePopup = () => this.closePopup();
      global.goToAnimeFromPopup = (id) => this.goToAnimeFromPopup(id);
      global.markAllAsRead = () => this.markAllAsRead();

      // Pedir permiso para notificaciones nativas
      this.requestNativePermission();
    }

    // ==================== ALMACENAMIENTO ====================
    loadHistory() {
      try {
        this.history = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY) || '[]');
      } catch(e) { this.history = []; }
    }

    saveHistory() {
      localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(this.history.slice(0, CONFIG.MAX_HISTORY_ITEMS)));
      this.updateBadge();
    }

    loadPopupState() {
      this.popupsShown = parseInt(sessionStorage.getItem(CONFIG.STORAGE_KEYS.POPUP_COUNTER) || '0', 10);
      try {
        this.popupQueue = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.POPUP_QUEUE) || '[]');
      } catch(e) { this.popupQueue = []; }
    }

    savePopupState() {
      sessionStorage.setItem(CONFIG.STORAGE_KEYS.POPUP_COUNTER, this.popupsShown.toString());
      sessionStorage.setItem(CONFIG.STORAGE_KEYS.POPUP_QUEUE, JSON.stringify(this.popupQueue));
    }

    markAsSeen(notifId) {
      const ids = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SEEN_IDS) || '[]');
      if (!ids.includes(notifId)) {
        ids.push(notifId);
        localStorage.setItem(CONFIG.STORAGE_KEYS.SEEN_IDS, JSON.stringify(ids));
      }
    }

    isSeen(notifId) {
      const ids = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SEEN_IDS) || '[]');
      return ids.includes(notifId);
    }

    // ==================== BADGE ====================
    updateBadge() {
      const unread = this.history.filter(n => !n.seen).length;
      if (this.badge) {
        this.badge.textContent = unread > 9 ? '9+' : unread;
        this.badge.style.display = unread > 0 ? 'flex' : 'none';
      }
    }

    // ==================== DETECCIÓN DE CAMBIOS EN CATÁLOGO ====================
    async detectCatalogChanges() {
      if (typeof catalogoArray === 'undefined' || !catalogoArray.length) {
        console.warn('⚠️ catalogoArray no disponible');
        return;
      }

      const prevSnapshot = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_CATALOG_SNAPSHOT);
      // Creamos un snapshot ligero: { id: lastUpdate }
      const currentSnapshot = {};
      catalogoArray.forEach(a => { currentSnapshot[a.id] = a.lastUpdate || 0; });

      const prevData = prevSnapshot ? JSON.parse(prevSnapshot) : {};
      const newItems = [];
      const updatedItems = [];

      for (const id in currentSnapshot) {
        if (!prevData[id]) {
          // Nuevo anime
          newItems.push(id);
        } else if (currentSnapshot[id] > (prevData[id] + 1000)) { // Diferencia > 1s
          // Actualizado
          updatedItems.push(id);
        }
      }

      // Guardar nuevo snapshot
      localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_CATALOG_SNAPSHOT, JSON.stringify(currentSnapshot));

      // Procesar nuevos y actualizados
      const relevant = [...newItems, ...updatedItems];
      if (relevant.length === 0) return;

      console.log(`📦 Cambios detectados: ${newItems.length} nuevos, ${updatedItems.length} actualizados`);

      for (const id of relevant) {
        const anime = catalogoArray.find(a => a.id == id);
        if (!anime || anime.updateType === 'Ninguna') continue;
        
        const notifId = `anime_${anime.id}_${anime.lastUpdate}`;
        if (this.isSeen(notifId) || this.history.some(n => n.notifId === notifId)) continue;

        const notif = this.createAnimeNotification(anime, notifId, newItems.includes(id) ? 'NUEVO' : 'ACTUALIZADO');
        this.history.unshift(notif);
        this.markAsSeen(notifId);

        // Agregar a cola de popups si no hemos llegado al límite
        if (this.popupsShown < CONFIG.MAX_POPUPS_PER_SESSION && this.popupQueue.length < 3) {
          this.popupQueue.push(notif);
          this.savePopupState();
        }
      }

      this.saveHistory();
      this.renderList();
      this.processQueue();
    }

    createAnimeNotification(anime, notifId, type) {
      return {
        notifId,
        animeId: anime.id,
        title: anime.title,
        img: anime.img,
        seasonCover: anime.latestSeasonCover || anime.img,
        blockName: anime.latestBlockName || '',
        epTitle: anime.latestEpTitle || 'Nuevo Contenido',
        type: type === 'NUEVO' ? 'ESTRENO 🚨' : anime.updateType || 'ACTUALIZADO',
        date: anime.lastUpdate || Date.now(),
        seen: false,
        isFinal: anime.isFinal || false
      };
    }

    // ==================== RESPUESTAS DE FIRESTORE ====================
    listenToReplies() {
      const auth = global.auth;
      const db = global.db;
      if (!auth || !db) return;

      auth.onAuthStateChanged(user => {
        if (this.unsubscribeReplies) {
          this.unsubscribeReplies();
          this.unsubscribeReplies = null;
        }
        if (!user) return;

        this.unsubscribeReplies = db.collection('comments')
          .where('replyToUserId', '==', user.uid)
          .orderBy('timestamp', 'desc')
          .limit(20)
          .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
              if (change.type !== 'added') return;
              const data = change.doc.data();
              const notifId = `reply_${change.doc.id}`;
              if (this.history.some(n => n.notifId === notifId)) return;

              const notif = {
                notifId,
                type: 'RESPUESTA',
                animeId: data.animeId,
                title: `${data.userName} te respondió`,
                img: data.userAvatar || 'invitado.avif',
                blockName: 'Foro',
                epTitle: data.texto ? data.texto.slice(0, 100) : '',
                date: data.timestamp?.toMillis() || Date.now(),
                seen: false,
                url: `video-player.html?anime=${data.animeId}&s=${data.season}&e=${data.episode}#comment-${change.doc.id}`
              };

              this.history.unshift(notif);
              this.saveHistory();
              this.renderList();
              this.sendNativeNotification(notif);
            });
          });
      });
    }

    // ==================== NOTIFICACIONES NATIVAS ====================
    async requestNativePermission() {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'granted') return;
      if (Notification.permission === 'denied') return;
      // Pedir permiso en un momento tranquilo (después de 5s)
      setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
    }

    sendNativeNotification(notif) {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      if (document.visibilityState === 'visible') return; // No molestar si está viendo la página

      const title = notif.type === 'RESPUESTA' ? notif.title : `¡${notif.title}!`;
      const options = {
        body: notif.epTitle || notif.blockName || 'Nuevo contenido disponible',
        icon: notif.img,
        badge: notif.img,
        tag: notif.notifId
      };
      try {
        new Notification(title, options);
      } catch(e) {}
    }

    // ==================== POPUPS ====================
    processQueue() {
      if (this.activePopup || this.popupQueue.length === 0) return;
      if (this.popupsShown >= CONFIG.MAX_POPUPS_PER_SESSION) {
        this.popupQueue = [];
        this.savePopupState();
        return;
      }

      const notif = this.popupQueue.shift();
      this.savePopupState();
      this.showPopup(notif);
    }

    showPopup(notif) {
      this.activePopup = true;
      this.popupsShown++;
      this.savePopupState();

      // Eliminar popup existente
      const existing = document.getElementById('ani-popup-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'ani-popup-modal';
      modal.innerHTML = this.buildPopupHTML(notif);
      document.body.appendChild(modal);
      dom.disableScroll();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => modal.classList.add('active'));
      });

      // Enviar notificación nativa
      this.sendNativeNotification(notif);

      // Marcar como visto en el historial
      const entry = this.history.find(n => n.notifId === notif.notifId);
      if (entry && !entry.seen) {
        entry.seen = true;
        this.saveHistory();
        this.renderList();
      }
    }

    buildPopupHTML(notif) {
      const isReply = notif.type === 'RESPUESTA';
      return `
        <div class="ani-popup-overlay" onclick="closePopup()"></div>
        <div class="ani-popup-card ${isReply ? 'reply' : ''}">
          <button class="ani-popup-close" onclick="closePopup()">✕</button>
          <div class="ani-popup-header">
            <span class="ani-popup-type">${notif.type}</span>
          </div>
          <div class="ani-popup-body">
            <img class="ani-popup-img" src="${notif.img}" alt="${notif.title}">
            <div class="ani-popup-info">
              <h3>${dom.sanitize(notif.title)}</h3>
              <p>${dom.sanitize(notif.epTitle || notif.blockName || '')}</p>
            </div>
          </div>
          <button class="ani-popup-btn" onclick="goToAnimeFromPopup('${notif.animeId}')">
            ${isReply ? '💬 Ver respuesta' : '▶ Ver ahora'}
          </button>
        </div>
        <style>
          #ani-popup-modal {
            position: fixed; inset: 0; z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: all 0.3s ease;
          }
          #ani-popup-modal.active {
            opacity: 1; visibility: visible;
          }
          .ani-popup-overlay {
            position: absolute; inset: 0;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(6px);
          }
          .ani-popup-card {
            position: relative; z-index: 2;
            background: #0f0f13; border: 2px solid var(--neon-cyan);
            border-radius: 16px; width: 90%; max-width: 400px;
            box-shadow: 0 0 40px rgba(0,243,255,0.2);
            transform: scale(0.9) translateY(20px);
            transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            overflow: hidden;
          }
          #ani-popup-modal.active .ani-popup-card {
            transform: scale(1) translateY(0);
          }
          .ani-popup-close {
            position: absolute; top: 8px; right: 8px; z-index: 5;
            background: rgba(0,0,0,0.5); border: none; color: #fff;
            width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
            font-size: 1.2rem; transition: 0.2s;
          }
          .ani-popup-close:hover { background: var(--neon-pink); }
          .ani-popup-header {
            background: linear-gradient(135deg, rgba(0,243,255,0.15), transparent);
            padding: 15px 20px; text-align: center;
          }
          .ani-popup-type {
            font-family: 'Orbitron', sans-serif; font-size: 0.8rem;
            font-weight: 800; letter-spacing: 2px;
            color: var(--neon-cyan); text-transform: uppercase;
          }
          .ani-popup-body {
            display: flex; gap: 15px; padding: 20px; align-items: center;
          }
          .ani-popup-img {
            width: 80px; height: 110px; object-fit: cover;
            border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
            flex-shrink: 0;
          }
          .ani-popup-info h3 {
            font-size: 1rem; margin-bottom: 8px; color: #fff;
          }
          .ani-popup-info p {
            font-size: 0.85rem; color: #aaa; line-height: 1.4;
          }
          .ani-popup-btn {
            display: block; width: 100%; padding: 14px;
            background: var(--neon-cyan); color: #000;
            border: none; font-weight: 800; font-family: 'Orbitron';
            font-size: 0.95rem; cursor: pointer; transition: 0.2s;
            text-transform: uppercase; letter-spacing: 1px;
          }
          .ani-popup-btn:hover {
            background: #fff; box-shadow: 0 0 20px var(--neon-cyan);
          }
          .ani-popup-card.reply .ani-popup-btn {
            background: var(--neon-purple); color: #fff;
          }
          @media (max-width: 480px) {
            .ani-popup-img { width: 60px; height: 85px; }
            .ani-popup-body { padding: 15px; gap: 10px; }
            .ani-popup-info h3 { font-size: 0.9rem; }
          }
        </style>
      `;
    }

    closePopup() {
      const modal = document.getElementById('ani-popup-modal');
      if (!modal) return;
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
        dom.enableScroll();
        this.activePopup = false;
        setTimeout(() => this.processQueue(), CONFIG.MIN_POPUP_INTERVAL);
      }, 300);
    }

    goToAnimeFromPopup(animeId) {
      this.closePopup();
      window.location.href = `anime-detail.html?id=${animeId}`;
    }

    // ==================== MENÚ DE NOTIFICACIONES ====================
    toggleMenu() {
      if (this.menu) {
        this.menu.classList.toggle('active');
        if (this.menu.classList.contains('active')) {
          this.renderList();
        }
      }
    }

    markAllAsRead() {
      this.history.forEach(n => n.seen = true);
      this.saveHistory();
      this.renderList();
    }

    renderList() {
      if (!this.list) return;
      if (this.history.length === 0) {
        this.list.innerHTML = '<div class="empty-notif"><i class="fas fa-bell-slash"></i><br>No hay notificaciones</div>';
        return;
      }

      let html = '';
      this.history.slice(0, 20).forEach(n => {
        const unreadDot = !n.seen ? '<span class="unread-dot"></span>' : '';
        const typeColor = n.type === 'RESPUESTA' ? 'var(--neon-cyan)' :
                          n.type.includes('ESTRENO') ? 'var(--neon-pink)' : 'var(--neon-purple)';
        html += `
          <div class="notif-item" onclick="goToAnimeFromPopup('${n.animeId}')">
            <div class="notif-img-box">
              <img src="${n.img}" alt="${n.title}">
              ${unreadDot}
            </div>
            <div class="notif-content">
              <span class="n-title">${dom.sanitize(n.title)}</span>
              <div class="n-type" style="color:${typeColor}">
                ${n.type} ${n.isFinal ? '<span class="tag-final">FINAL</span>' : ''}
              </div>
              <span class="n-meta">${dom.sanitize(n.epTitle || n.blockName || '')}</span>
            </div>
          </div>
        `;
      });
      this.list.innerHTML = html;
    }
  }

  // Inicializar al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NotificationSystem());
  } else {
    new NotificationSystem();
  }

})(window);