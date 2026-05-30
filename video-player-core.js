// video-player-core.js - Versión con catálogo local + Firestore
// CORREGIDO: Marcado automático de episodios vistos con migración localStorage -> Firestore
// NUEVO: Descarga directa desde PeerTube (obtiene enlace real del archivo .mp4 vía API)
// MEJORADO: Títulos dinámicos según tipo de temporada (T1 Cap 1, Spin-Off: Nombre Cap 1, OVA 1, Película: Nombre, etc.)
// CORRECCIÓN: Detección insensible a mayúsculas para Spin-Off y uso correcto del nombre de la temporada.

class VideoPlayer {
  constructor() {
    this.params = new URLSearchParams(location.search);
    this.animeId = this.params.get('anime');
    this.season = this.params.get('s');
    this.episode = this.params.get('e');
    
    this.auth = null;
    this.db = null;
    this.storage = null;
    this.animeData = null;
    this.currentDownloadUrl = '#';      // URL sincrónica (para enlaces directos normales)
    this.currentPeerTubeUrl = null;     // Guardamos la URL original de PeerTube si es el caso
    this.authReady = false;
    this.pendingMarks = [];
    
    // Variables de contexto para sistemas externos
    window.comentariosAnimeId = this.animeId;
    window.comentariosSeason = this.season;
    window.comentariosEpisode = this.episode;
    
    this.initFirebase();
    this.initUI();
    this.waitForCatalogAndLoad();
    this.setupAuthUI();
    this.setupAuthMigration();

    // Exponer métodos públicos
    window.videoPlayerMethods = {
      toggleStickerPanel: () => this.toggleStickerPanel(),
      enviarComentario: () => this.enviarComentario(),
      quitarStickerPreview: () => this.quitarStickerPreview(),
      openLoginModal: () => this.openLoginModal(),
      closeAuthModal: () => this.closeAuthModal(),
      loginWithEmail: () => this.loginWithEmail(),
      registerWithEmail: () => this.registerWithEmail(),
      loginWithGoogle: () => this.loginWithGoogle(),
      loginWithGitHub: () => this.loginWithGitHub(),
      switchStickerTab: (tab) => this.switchStickerTab(tab)
    };
    window.videoPlayer = window.videoPlayerMethods;
  }
  
  // ========== ESPERA DEL CATÁLOGO ==========
  async waitForCatalogAndLoad() {
    if (typeof catalogoArray !== 'undefined') {
      this.loadEpisodeData();
      return;
    }
    console.log('⏳ Esperando catalogoArray en video-player...');
    const checkInterval = setInterval(() => {
      if (typeof catalogoArray !== 'undefined') {
        clearInterval(checkInterval);
        this.loadEpisodeData();
      }
    }, 50);
    setTimeout(() => {
      clearInterval(checkInterval);
      if (typeof catalogoArray === 'undefined') {
        console.error('❌ No se cargó catalogoArray');
        document.getElementById('epTitle').innerText = 'Error: Catálogo no disponible';
      }
    }, 5000);
  }
  
  // ========== FIREBASE ==========
  initFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyBpzYARIxaJijLbbL-2S6F9MWecbAbvK_I",
      authDomain: "login-admin-archinime.firebaseapp.com",
      projectId: "login-admin-archinime",
      storageBucket: "login-admin-archinime.firebasestorage.app",
      messagingSenderId: "938164660242",
      appId: "1:938164660242:web:648e0dce0e0d18dd78d0cb"
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.storage = firebase.storage();
    
    this.auth.onAuthStateChanged(user => {
      if (window.ArchinimeState) {
        window.ArchinimeState.set('currentUser', user);
      } else {
        this.currentUser = user;
      }
      this.authReady = true;
      this.updateCommentFormVisibility();
      
      if (typeof initComentariosSystem === 'function') {
        initComentariosSystem(this.db, this.auth);
      }
      if (typeof initStickersSystem === 'function') {
        initStickersSystem(this.db, this.auth);
      }
    });
  }
  
  getCurrentUser() {
    if (window.ArchinimeState) return window.ArchinimeState.get('currentUser');
    return this.currentUser;
  }
  
  // ========== MIGRACIÓN Y MARCAS ==========
  async migrateLocalToFirestore(userId) {
    if (!userId) return;
    const watchedKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('watched_')) {
        watchedKeys.push(key);
      }
    }
    if (watchedKeys.length === 0) return;
    
    console.log(`🔄 Migrando ${watchedKeys.length} registros locales a Firestore...`);
    const historyRef = this.db.collection('watchHistory').doc(userId);
    
    for (const key of watchedKeys) {
      const parts = key.split('_');
      if (parts.length < 4) continue;
      const animeId = parts[1];
      const seasonNum = parseInt(parts[2]);
      const episodeNum = parseInt(parts[3]);
      if (isNaN(seasonNum) || isNaN(episodeNum)) continue;
      
      try {
        const doc = await historyRef.get();
        let data = doc.exists ? doc.data() : {};
        if (!data[animeId]) data[animeId] = {};
        if (!data[animeId][seasonNum]) data[animeId][seasonNum] = [];
        if (!data[animeId][seasonNum].includes(episodeNum)) {
          data[animeId][seasonNum].push(episodeNum);
        }
        await historyRef.set(data, { merge: true });
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Error migrando ${key}:`, e);
      }
    }
    console.log('✅ Migración completada');
  }
  
  setupAuthMigration() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.migrateLocalToFirestore(user.uid);
        if (this.pendingMarks.length > 0) {
          for (const mark of this.pendingMarks) {
            await this.saveToFirestore(mark.animeId, mark.season, mark.episode, user.uid);
          }
          this.pendingMarks = [];
        }
      }
    });
  }
  
  async saveToFirestore(animeId, seasonNum, episodeNum, userId) {
    if (!userId) return false;
    try {
      const docRef = this.db.collection('watchHistory').doc(userId);
      const doc = await docRef.get();
      let data = doc.exists ? doc.data() : {};
      if (!data[animeId]) data[animeId] = {};
      if (!data[animeId][seasonNum]) data[animeId][seasonNum] = [];
      if (!data[animeId][seasonNum].includes(episodeNum)) {
        data[animeId][seasonNum].push(episodeNum);
        await docRef.set(data, { merge: true });
      }
      return true;
    } catch (e) {
      console.warn('Error guardando en Firestore:', e);
      return false;
    }
  }
  
  async autoMarkAsWatched() {
    const aId = this.animeId;
    const sNum = parseInt(this.season);
    const eNum = parseInt(this.episode);
    if (!aId || isNaN(sNum) || isNaN(eNum)) return;
    
    const user = this.getCurrentUser();
    const localKey = `watched_${aId}_${sNum}_${eNum}`;
    
    if (user && user.uid) {
      const success = await this.saveToFirestore(aId, sNum, eNum, user.uid);
      if (success) {
        localStorage.removeItem(localKey);
        return;
      }
    }
    
    localStorage.setItem(localKey, 'true');
    if (!user && !this.authReady) {
      this.pendingMarks.push({ animeId: aId, season: sNum, episode: eNum });
    }
  }
  
  // ========== UI INICIAL ==========
  initUI() {
    const backLink = document.getElementById('backLink');
    if (backLink && this.animeId) {
      backLink.href = `anime-detail.html?id=${this.animeId}`;
    }
    
    const textarea = document.getElementById('comentarioTexto');
    if (textarea) {
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.enviarComentario();
        }
      });
      textarea.addEventListener('input', () => this.validateSendButton());
    }
    
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleDownloadClick();
      });
    }
    
    document.querySelectorAll('.sticker-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchStickerTab(tab.dataset.tab));
    });
  }
  
  // ========== GENERACIÓN DE TÍTULO SEGÚN TIPO DE TEMPORADA (CORREGIDO) ==========
  /**
   * Genera el título formateado para el episodio actual.
   * @param {Object} season - Objeto de la temporada (contiene name, type, num, etc.)
   * @param {number} epNum - Número del episodio (1-indexed)
   * @param {Object} episodeData - Datos del episodio (puede contener title específico)
   * @returns {string} Título formateado
   */
  formatEpisodeTitle(season, epNum, episodeData) {
    const seasonTypeRaw = season.type || 'Temporada';
    // Normalizar el tipo: convertir a minúsculas y eliminar guiones/espacios para comparación flexible
    const normalizedType = seasonTypeRaw.toLowerCase().replace(/[-\s]/g, '');
    const seasonName = season.name || `Temporada ${season.num}`;
    const episodeTitleRaw = episodeData.title || `Capítulo ${epNum}`;

    // Película
    if (normalizedType === 'pelicula') {
      return `Película: ${episodeTitleRaw}`;
    }
    // OVA: mostrar "OVA X" donde X es el número extraído del título o el season.num
    else if (normalizedType === 'ova') {
      const match = episodeTitleRaw.match(/\d+/);
      const ovaNum = match ? match[0] : (season.num || epNum);
      return `OVA ${ovaNum}`;
    }
    // Especial
    else if (normalizedType === 'especial') {
      return `Especial ${epNum}`;
    }
    // Spin-Off: usar el nombre completo de la temporada + " Cap " + número
    else if (normalizedType === 'spinoff') {
      // Si el nombre de la temporada contiene "Temporada", lo reemplazamos por el nombre real (ej. "Tensura Nikki...")
      // No es necesario, ya que en el catálogo el name ya es el específico.
      return `${seasonName} Cap ${epNum}`;
    }
    // Temporada normal
    else {
      let seasonNumber = season.num;
      // Si no tiene num, intentar extraer del nombre (ej: "Temporada 1")
      if (!seasonNumber) {
        const match = seasonName.match(/\d+/);
        seasonNumber = match ? match[0] : '?';
      }
      return `T${seasonNumber} Cap ${epNum}`;
    }
  }

  // ========== CARGA DEL EPISODIO ==========
  async loadEpisodeData() {
    try {
      const anime = catalogoArray.find(a => a.id == this.animeId);
      if (!anime) {
        document.getElementById('epTitle').innerText = 'Anime no encontrado';
        return;
      }
      this.animeData = anime;
      const seasons = this.animeData.seasons || [];
      const season = seasons.find(s => s.num === parseInt(this.season));
      if (!season) {
        document.getElementById('epTitle').innerText = 'Temporada no encontrada';
        return;
      }
      const epIndex = parseInt(this.episode) - 1;
      const episodeData = season.eps?.[epIndex];
      if (!episodeData) {
        document.getElementById('epTitle').innerText = 'Episodio no encontrado';
        return;
      }
      
      // 🔥 Generar título dinámico según el tipo de temporada
      const formattedTitle = this.formatEpisodeTitle(season, parseInt(this.episode), episodeData);
      
      document.title = `Ver ${formattedTitle} - Archinime`;
      document.getElementById('epTitle').innerText = formattedTitle;
      
      const initialLink = episodeData.link || episodeData.link2;
      this.updateDownloadUrl(initialLink);
      this.loadVideo(initialLink);
      
      const serverContainer = document.getElementById('serverOptions');
      serverContainer.innerHTML = '';
      if (episodeData.link) this.createServerButton('Latino', episodeData.link, true);
      if (episodeData.link2) this.createServerButton('Opción 2', episodeData.link2, !episodeData.link);
      
      this.setupNavigation();
      await this.autoMarkAsWatched();
      
    } catch (error) {
      console.error('Error cargando episodio:', error);
      document.getElementById('epTitle').innerText = 'Error al cargar el episodio';
    }
  }
  
  createServerButton(label, url, isActive) {
    const container = document.getElementById('serverOptions');
    const btn = document.createElement('button');
    const isFirst = container.children.length === 0;
    btn.className = 'opt-btn' + ((isActive || isFirst) ? ' active' : '');
    btn.innerText = label;
    btn.onclick = () => {
      document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.updateDownloadUrl(url);
      this.loadVideo(url);
    };
    container.appendChild(btn);
  }
  
  loadVideo(url) {
    const container = document.getElementById('mediaContainer');
    container.innerHTML = '';
    if (!url) return;
    const isVideoFile = /\.(mp4|webm|ogg|mov|m3u8)$/i.test(url);
    if (isVideoFile && !url.includes('drive.google.com')) {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.style.width = '100%';
      video.style.height = '100%';
      container.appendChild(video);
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      container.appendChild(iframe);
    }
  }
  
  // ========== ACTUALIZACIÓN DE URL DE DESCARGA (síncrona normal) ==========
  updateDownloadUrl(url) {
    this.currentDownloadUrl = this.generateDirectLink(url);
    this.currentPeerTubeUrl = this.isPeerTubeUrl(url) ? url : null;
  }
  
  // Detección de PeerTube
  isPeerTubeUrl(url) {
    if (!url) return false;
    const peerTubePattern = /^(https?:\/\/)?([a-z0-9-]+\.)*peertube\.\w+\//i;
    return peerTubePattern.test(url);
  }
  
  // Generador de enlaces síncrono (Google Drive, Dropbox, etc.) - NO para PeerTube asíncrono
  generateDirectLink(url) {
    if (!url) return "#";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\//);
      if (match && match[1]) return `https://drive.usercontent.google.com/download?id=${match[1]}&export=download&authuser=0`;
      const altMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (altMatch && altMatch[1]) return `https://drive.usercontent.google.com/download?id=${altMatch[1]}&export=download&authuser=0`;
    }
    if (url.includes("dropbox.com") && url.includes("dl=0")) return url.replace('dl=0', 'dl=1');
    if (url.includes("ok.ru/")) {
      const match = url.match(/ok\.ru\/video(?:embed)?\/(\d+)/);
      if (match && match[1]) return `https://anydownloader.com/en/#url=https://ok.ru/video/${match[1]}`;
    }
    if (url.includes("odysee.com")) {
      let claimStr = url.split("/embed/")[1];
      if (claimStr) {
        if (claimStr.includes('/')) claimStr = claimStr.split('/').pop();
        claimStr = claimStr.replace(':', '/');
        return `https://odysee.com/$/download/${claimStr}`;
      }
      return url;
    }
    return url;
  }
  
  // ========== OBTENCIÓN ASÍNCRONA DEL ENLACE DIRECTO DE PEERTUBE ==========
  async getPeerTubeDirectDownloadUrl(embedUrl) {
    try {
      let videoId = null;
      let instanceUrl = null;
      
      const urlParts = embedUrl.match(/^(https?:\/\/[^\/]+)\/(?:videos\/embed|w)\/([a-zA-Z0-9_-]+)/i);
      if (urlParts && urlParts[2]) {
        instanceUrl = urlParts[1];
        videoId = urlParts[2];
      } else {
        const idMatch = embedUrl.match(/\/([a-zA-Z0-9_-]+)$/);
        if (idMatch && idMatch[1]) {
          videoId = idMatch[1];
          const domainMatch = embedUrl.match(/^(https?:\/\/[^\/]+)/);
          if (domainMatch) instanceUrl = domainMatch[1];
        }
      }
      
      if (!instanceUrl || !videoId) {
        console.warn('No se pudo extraer ID o dominio de PeerTube:', embedUrl);
        return null;
      }
      
      const apiUrl = `${instanceUrl}/api/v1/videos/${videoId}`;
      console.log('📡 Consultando API de PeerTube:', apiUrl);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      let downloadUrl = null;
      if (data.files && data.files.length > 0) {
        downloadUrl = data.files[0].fileDownloadUrl;
      } else if (data.streamingPlaylists && data.streamingPlaylists.length > 0) {
        const playlist = data.streamingPlaylists[0];
        if (playlist.files && playlist.files.length > 0) {
          downloadUrl = playlist.files[0].fileDownloadUrl;
        }
      }
      
      if (!downloadUrl) {
        console.warn('No se encontró fileDownloadUrl en la respuesta de PeerTube');
        return null;
      }
      
      console.log('✅ Enlace directo obtenido:', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('❌ Error obteniendo descarga de PeerTube:', error);
      return null;
    }
  }
  
  // ========== MANEJADOR DEL BOTÓN DESCARGAR ==========
  async handleDownloadClick() {
    const user = this.getCurrentUser();
    if (!user) {
      this.openLoginModal();
      return;
    }
    
    let finalDownloadUrl = this.currentDownloadUrl;
    
    if (this.currentPeerTubeUrl) {
      const btn = document.getElementById('downloadBtn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo enlace...';
      btn.disabled = true;
      
      const directUrl = await this.getPeerTubeDirectDownloadUrl(this.currentPeerTubeUrl);
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      if (directUrl) {
        finalDownloadUrl = directUrl;
      } else {
        alert('No se pudo obtener el enlace de descarga directa de PeerTube. Es posible que el administrador no lo haya habilitado.');
        return;
      }
    }
    
    if (finalDownloadUrl && finalDownloadUrl !== '#') {
      const link = document.createElement('a');
      link.href = finalDownloadUrl;
      link.download = '';
      link.target = this.isMobile() ? '_blank' : '_self';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No hay enlace de descarga disponible para este servidor.');
    }
  }
  
  isMobile() {
    return /android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase());
  }
  
  // ========== NAVEGACIÓN ENTRE EPISODIOS (con títulos dinámicos) ==========
  setupNavigation() {
    if (!this.animeData?.seasons) return;
    // Aplanar todos los episodios disponibles (con link o link2)
    const flat = [];
    this.animeData.seasons.sort((a,b) => a.num - b.num).forEach(season => {
      season.eps?.forEach((ep, idx) => {
        if (ep.link || ep.link2) {
          flat.push({ 
            s: season.num, 
            e: idx + 1,
            seasonObj: season,
            episodeData: ep
          });
        }
      });
    });
    const idx = flat.findIndex(i => i.s === parseInt(this.season) && i.e === parseInt(this.episode));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (idx > 0) {
      const prev = flat[idx-1];
      prevBtn.classList.remove('btn-hidden');
      prevBtn.href = `?anime=${this.animeId}&s=${prev.s}&e=${prev.e}`;
      const prevSeason = prev.seasonObj;
      const prevTitle = this.formatEpisodeTitle(prevSeason, prev.e, prev.episodeData);
      prevBtn.setAttribute('title', prevTitle);
    } else {
      prevBtn.classList.add('btn-hidden');
    }
    
    if (idx < flat.length - 1) {
      const next = flat[idx+1];
      nextBtn.classList.remove('btn-hidden');
      nextBtn.href = `?anime=${this.animeId}&s=${next.s}&e=${next.e}`;
      const nextSeason = next.seasonObj;
      const nextTitle = this.formatEpisodeTitle(nextSeason, next.e, next.episodeData);
      nextBtn.setAttribute('title', nextTitle);
    } else {
      nextBtn.classList.add('btn-hidden');
    }
  }
  
  // ========== SISTEMA DE AUTENTICACIÓN ==========
  setupAuthUI() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('authLoginForm').style.display = tabName === 'login' ? 'flex' : 'none';
        document.getElementById('authRegisterForm').style.display = tabName === 'register' ? 'flex' : 'none';
      });
    });
  }
  
  openLoginModal() { document.getElementById('authModal').classList.add('show'); }
  closeAuthModal() { 
    document.getElementById('authModal').classList.remove('show'); 
    const errEl = document.getElementById('authError');
    if (errEl) errEl.innerText = '';
  }
  
  async loginWithEmail() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;
    try { 
      await this.auth.signInWithEmailAndPassword(email, pass); 
      this.closeAuthModal(); 
    } catch (e) { 
      document.getElementById('authError').innerText = e.message; 
    }
  }
  
  async registerWithEmail() {
    const email = document.getElementById('registerEmail').value;
    const pass = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    if (pass !== confirm) { 
      document.getElementById('authError').innerText = 'Las contraseñas no coinciden'; 
      return; 
    }
    try { 
      await this.auth.createUserWithEmailAndPassword(email, pass); 
      this.closeAuthModal(); 
    } catch (e) { 
      document.getElementById('authError').innerText = e.message; 
    }
  }
  
  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try { 
      await this.auth.signInWithPopup(provider); 
      this.closeAuthModal(); 
    } catch (e) { 
      document.getElementById('authError').innerText = e.message; 
    }
  }
  
  async loginWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    try { 
      await this.auth.signInWithPopup(provider); 
      this.closeAuthModal(); 
    } catch (e) { 
      document.getElementById('authError').innerText = e.message; 
    }
  }
  
  // ========== COMENTARIOS Y STICKERS ==========
  updateCommentFormVisibility() {
    const user = this.getCurrentUser();
    const loginMsg = document.getElementById('comentarioLoginMessage');
    const form = document.getElementById('comentarioFormContainer');
    const avatar = document.getElementById('comentarioUserAvatar');
    const nameSpan = document.getElementById('comentarioUserName');
    if (user) {
      if (loginMsg) loginMsg.style.display = 'none';
      if (form) {
        form.style.display = 'block';
        if (avatar) avatar.src = user.photoURL || 'invitado.avif';
        if (nameSpan) nameSpan.innerText = user.displayName || user.email?.split('@')[0] || 'Usuario';
      }
    } else {
      if (loginMsg) loginMsg.style.display = 'block';
      if (form) form.style.display = 'none';
    }
  }
  
  toggleStickerPanel() {
    const panel = document.getElementById('stickerPanelFull');
    if (panel) {
      panel.classList.toggle('active');
      if (panel.classList.contains('active') && typeof cargarStickersUsuario === 'function') {
        cargarStickersUsuario();
      }
    }
  }
  
  switchStickerTab(tabId) {
    if (typeof window.switchStickerTab === 'function') {
      window.switchStickerTab(tabId);
    } else {
      document.querySelectorAll('.sticker-tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`.sticker-tab[data-tab="${tabId}"]`)?.classList.add('active');
      document.querySelectorAll('.sticker-tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabId === 'mis' ? 'misStickersTab' : 'subirStickersTab')?.classList.add('active');
    }
  }
  
  validateSendButton() {
    const textarea = document.getElementById('comentarioTexto');
    const btn = document.getElementById('enviarComentarioBtn');
    if (textarea && btn) {
      const hasContent = textarea.value.trim().length > 0 || window.stickerSeleccionadoParaEnviar;
      btn.disabled = !hasContent;
      btn.style.opacity = hasContent ? '1' : '0.5';
    }
  }
  
  enviarComentario() { 
    if (typeof enviarComentarioTexto === 'function') enviarComentarioTexto();
  }
  
  quitarStickerPreview() { 
    if (typeof quitarStickerPreview === 'function') { quitarStickerPreview(); } 
    this.validateSendButton();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new VideoPlayer());
} else {
  new VideoPlayer();
}

// Funciones globales para compatibilidad
window.openLoginModalFromComent = () => window.videoPlayer?.openLoginModal();
window.toggleStickerPanelSistema = () => window.videoPlayer?.toggleStickerPanel();