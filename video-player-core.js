// video-player-core.js - Versión con catálogo local + Firestore para funciones sociales
// Obtiene los enlaces desde catalogoArray (definido en catalogo.js)
// MEJORA: Restricción de descarga solo para usuarios autenticados
// OPTIMIZACIÓN: Carga diferida de sistemas externos, validaciones mejoradas

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
    this.currentDownloadUrl = '#';       // Almacena la URL directa de descarga
    
    // Variables de contexto para sistemas externos (comentarios, stickers)
    window.comentariosAnimeId = this.animeId;
    window.comentariosSeason = this.season;
    window.comentariosEpisode = this.episode;
    
    this.initFirebase();
    this.initUI();
    this.loadEpisodeData();
    this.setupAuthUI();

    // Exponer métodos públicos para el HTML (manteniendo compatibilidad)
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
  
  initFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyBpzYARIxaJijLbbL-2S6F9MWecbAbvK_I",
      authDomain: "login-admin-archinime.firebaseapp.com",
      projectId: "login-admin-archinime",
      storageBucket: "login-admin-archinime.firebasestorage.app",
      messagingSenderId: "938164660242",
      appId: "1:938164660242:web:648e0dce0e0d18dd78d0cb"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.storage = firebase.storage();
    
    this.auth.onAuthStateChanged(user => {
      // Actualizar estado global (ArchinimeState o respaldo)
      if (window.ArchinimeState) {
        window.ArchinimeState.set('currentUser', user);
      } else {
        this.currentUser = user;
      }
      
      // Refrescar UI según autenticación
      this.updateCommentFormVisibility();
      
      // Inicializar sistemas dependientes de autenticación (carga diferida)
      if (typeof initComentariosSystem === 'function') {
        initComentariosSystem(this.db, this.auth);
      }
      
      if (typeof initStickersSystem === 'function') {
        initStickersSystem(this.db, this.auth);
      }
    });
  }
  
  getCurrentUser() {
    // Obtener usuario desde el estado central o respaldo local
    if (window.ArchinimeState) return window.ArchinimeState.get('currentUser');
    return this.currentUser;
  }
  
  initUI() {
    // Configurar enlace "Volver"
    const backLink = document.getElementById('backLink');
    if (backLink && this.animeId) {
      backLink.href = `anime-detail.html?id=${this.animeId}`;
    }
    
    // Configurar envío con Enter en textarea de comentarios
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
    
    // ***** NUEVO: Configurar botón de descarga con verificación de autenticación *****
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      // Reemplazar cualquier listener previo y usar el nuestro
      downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleDownloadClick();
      });
    }
    
    // Pestañas del panel de stickers
    document.querySelectorAll('.sticker-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchStickerTab(tab.dataset.tab));
    });
  }
  
  // ***** NUEVO: Carga desde catálogo local (catalogoArray) *****
  async loadEpisodeData() {
    try {
      // Buscar el anime en el array local
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
      
      document.title = `Ver ${episodeData.title || `Episodio ${this.episode}`} - Archinime`;
      document.getElementById('epTitle').innerText = episodeData.title || `Episodio ${this.episode}`;
      
      const initialLink = episodeData.link || episodeData.link2;
      this.updateDownloadUrl(initialLink);
      this.loadVideo(initialLink);

      // Botones de servidores
      const serverContainer = document.getElementById('serverOptions');
      serverContainer.innerHTML = '';
      if (episodeData.link) this.createServerButton('Latino', episodeData.link, true);
      if (episodeData.link2) this.createServerButton('Opción 2', episodeData.link2, !episodeData.link);
      
      this.setupNavigation();
      this.autoMarkAsWatched();

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
  
  // Actualiza la URL de descarga interna (sin modificar el DOM directamente)
  updateDownloadUrl(url) {
    this.currentDownloadUrl = this.generateDirectLink(url);
  }
  
  generateDirectLink(url) {
    if (!url) return '#';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/(.+?)\//);
      if (match) return `https://drive.usercontent.google.com/download?id=${match[1]}&export=download`;
    }
    if (url.includes('dropbox.com') && url.includes('dl=0')) {
      return url.replace('dl=0', 'dl=1');
    }
    return url;
  }
  
  // ***** NUEVO: Manejador del clic en descarga *****
  handleDownloadClick() {
    const user = this.getCurrentUser();
    
    if (!user) {
      // No autenticado: mostrar modal de inicio de sesión
      this.openLoginModal();
      return;
    }
    
    // Usuario autenticado: proceder con la descarga
    if (this.currentDownloadUrl && this.currentDownloadUrl !== '#') {
      const link = document.createElement('a');
      link.href = this.currentDownloadUrl;
      link.download = '';               // Sugerir descarga
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
  
  setupNavigation() {
    if (!this.animeData?.seasons) return;
    const flat = [];
    this.animeData.seasons.sort((a,b) => a.num - b.num).forEach(season => {
      season.eps?.forEach((ep, idx) => {
        if (ep.link || ep.link2) {
          flat.push({ s: season.num, e: idx + 1 });
        }
      });
    });

    const idx = flat.findIndex(i => i.s === parseInt(this.season) && i.e === parseInt(this.episode));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (idx > 0) {
      prevBtn.classList.remove('btn-hidden');
      prevBtn.href = `?anime=${this.animeId}&s=${flat[idx-1].s}&e=${flat[idx-1].e}`;
    }
    if (idx < flat.length - 1) {
      nextBtn.classList.remove('btn-hidden');
      nextBtn.href = `?anime=${this.animeId}&s=${flat[idx+1].s}&e=${flat[idx+1].e}`;
    }
  }
  
  async autoMarkAsWatched() {
    const aId = this.animeId;
    const sNum = parseInt(this.season);
    const eNum = parseInt(this.episode);
    if (!aId || isNaN(sNum) || isNaN(eNum)) return;
    const user = this.getCurrentUser();

    if (user) {
      try {
        const docRef = this.db.collection('watchHistory').doc(user.uid);
        const doc = await docRef.get();
        let data = doc.exists ? doc.data() : {};
        let animeData = data[aId] || {};
        let seasonData = animeData[sNum] || [];
        if (!seasonData.includes(eNum)) {
          seasonData.push(eNum);
          animeData[sNum] = seasonData;
          data[aId] = animeData;
          await docRef.set(data, { merge: true });
        }
      } catch (e) { console.warn('Error al marcar como visto:', e); }
    } else {
      localStorage.setItem(`watched_${aId}_${sNum}_${eNum}`, 'true');
    }
  }
  
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
  
  // --- Métodos de autenticación (invocados desde el HTML) ---
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
  
  // --- Interfaz de comentarios y stickers ---
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

// Funciones globales para compatibilidad con el HTML antiguo
window.openLoginModalFromComent = () => window.videoPlayer?.openLoginModal();
window.toggleStickerPanelSistema = () => window.videoPlayer?.toggleStickerPanel();
// NOTA: window.subirStickerDesdePC fue eliminado para que stickers-system.js lo maneje.