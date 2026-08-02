// video-player-core.js - Versión con catálogo local + Firestore
// MEJORADO: Descarga única (bloqueo de botón), barra de progreso única
// SOPORTE: Múltiples partes, selección automática de opción, títulos dinámicos
// NUEVO: Conversión de enlaces DoomStream (/e/ -> /d/), ocultar logo en DoomStream, sin alert en fallos de descarga
// NUEVO: Banner para recomendar Brave y modal con video tutorial (solo si no es Brave)
// NUEVO: Soporte para 4 opciones de enlaces (latino, op2, op3, op4)
// NUEVO: Conversión de mp4upload embed a directo para descarga
// NUEVO: Menú desplegable (select) para opciones de servidor (mejor para móviles)
// NUEVO: Reordenamiento automático: mp4upload -> Opción 1, Google Drive -> Opción 4

class VideoPlayer {
  constructor() {
    this.params = new URLSearchParams(location.search);
    this.animeId = this.params.get('anime');
    this.season = this.params.get('s');
    this.episode = this.params.get('e');
    
    this.auth = null;
    this.db = null;
    this.animeData = null;
    this.currentDownloadUrls = [];
    this.currentPeerTubeUrl = null;
    this.currentEpisodeData = null;
    this.authReady = false;
    this.pendingMarks = [];
    this.currentPartIndex = 0;
    this.activeOptionLabel = 'Opción 1';
    this.activeOptionKey = 'link'; // clave del campo en episodeData
    this.currentVideoElement = null;
    this.isDownloading = false;
    
    window.comentariosAnimeId = this.animeId;
    window.comentariosSeason = this.season;
    window.comentariosEpisode = this.episode;
    
    this.initFirebase();
    this.initUI();
    this.waitForCatalogAndLoad();
    this.setupAuthUI();
    this.setupAuthMigration();

    this.checkBraveAndShowBanner();

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
  
  isDoomStreamUrl(url) {
    if (!url) return false;
    return /(playmogo\.com|doomstream\.com)\/e\//i.test(url);
  }

  generateDirectLink(url) {
    if (!url) return "#";
    
    if (this.isDoomStreamUrl(url)) {
      return url.replace(/\/e\//, '/d/');
    }

    if (url.includes('mp4upload.com/embed-')) {
      const match = url.match(/embed-([^\.]+)(\.html)?/);
      if (match && match[1]) {
        return `https://www.mp4upload.com/${match[1]}`;
      }
    }

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

  updateLogoBlocker(url) {
    const logo = document.querySelector('.logo-blocker');
    if (!logo) return;
    if (this.isDoomStreamUrl(url)) {
      logo.style.display = 'none';
    } else {
      logo.style.display = 'flex';
    }
  }

  playPart(partIndex, urlsArray) {
    if (!urlsArray || partIndex >= urlsArray.length) return;
    const url = urlsArray[partIndex];
    if (!url) return;
    
    const container = document.getElementById('mediaContainer');
    container.innerHTML = '';
    
    const isVideoFile = /\.(mp4|webm|ogg|mov|m3u8)$/i.test(url);
    if (isVideoFile && !url.includes('drive.google.com')) {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.style.width = '100%';
      video.style.height = '100%';
      container.appendChild(video);
      this.currentVideoElement = video;
      this.updateLogoBlocker(url);
      const onEnded = () => {
        if (partIndex + 1 < urlsArray.length) {
          this.playPart(partIndex + 1, urlsArray);
        } else {
          console.log('Episodio completado');
        }
      };
      video.addEventListener('ended', onEnded, { once: true });
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      container.appendChild(iframe);
      this.currentVideoElement = null;
      this.updateLogoBlocker(url);
    }
  }

  async forceDownload(url, suggestedFilename = 'video.mp4') {
    this.showProgressBar();
    const percentSpan = document.getElementById('progressPercent');
    const fillDiv = document.getElementById('progressBarFill');

    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (total) {
          const percent = Math.round((loaded / total) * 100);
          if (percentSpan) percentSpan.innerText = percent;
          if (fillDiv) fillDiv.style.width = percent + '%';
        } else {
          if (percentSpan) percentSpan.innerText = '...';
        }
      }
      const blob = new Blob(chunks, { type: response.headers.get('content-type') || 'video/mp4' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = suggestedFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn(error);
      window.open(url, '_blank');
    } finally {
      // La barra se oculta en handleDownloadClick
    }
  }

  async handleDownloadClick() {
    if (this.isDownloading) {
      console.log('Descarga en curso, espera a que termine');
      return;
    }

    const user = this.getCurrentUser();
    if (!user) {
      this.openLoginModal();
      return;
    }
    
    let urlsToDownload = [...this.currentDownloadUrls];
    
    if (this.currentPeerTubeUrl) {
      const fallbackUrls = this.getActiveEpisodeUrls();
      if (fallbackUrls.length > 0) {
        urlsToDownload = fallbackUrls.map(url => this.generateDirectLink(url));
      } else {
        alert('No hay enlace alternativo para PeerTube.');
        return;
      }
    }
    
    if (urlsToDownload.length === 0 || urlsToDownload[0] === '#') {
      alert('No hay enlace de descarga disponible.');
      return;
    }
    
    const epTitleElem = document.getElementById('epTitle');
    let baseFilename = epTitleElem ? epTitleElem.innerText : 'video';
    baseFilename = baseFilename.replace(/[^a-z0-9ñáéíóúü \-_]/gi, '').replace(/\s+/g, '_');

    this.isDownloading = true;
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.disabled = true;
      downloadBtn.style.opacity = '0.6';
      downloadBtn.style.cursor = 'not-allowed';
      downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Descargando...';
    }

    try {
      for (let i = 0; i < urlsToDownload.length; i++) {
        const url = urlsToDownload[i];
        
        if (this.isDoomStreamUrl(url)) {
          window.open(url, '_blank');
          continue;
        }

        const isCatbox = url.includes('catbox.moe');
        const isCrossOrigin = !url.startsWith(location.origin);
        
        let filename = `${baseFilename}`;
        if (urlsToDownload.length > 1) {
          filename = `${baseFilename}_parte${i+1}.mp4`;
        } else {
          filename = `${baseFilename}.mp4`;
        }
        
        if (isCatbox || isCrossOrigin) {
          await this.forceDownload(url, filename);
        } else {
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.target = this.isMobile() ? '_blank' : '_self';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          await new Promise(r => setTimeout(r, 500));
        }
      }
    } finally {
      this.isDownloading = false;
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = '1';
        downloadBtn.style.cursor = 'pointer';
        downloadBtn.innerHTML = '⬇ Descargar';
      }
      this.hideProgressBar();
    }
  }

  async waitForCatalogAndLoad() {
    if (typeof catalogoArray !== 'undefined') {
      this.loadEpisodeData();
      return;
    }
    console.log('⏳ Esperando catalogoArray...');
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

  async migrateLocalToFirestore(userId) {
    if (!userId) return;
    const watchedKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('watched_')) watchedKeys.push(key);
    }
    if (watchedKeys.length === 0) return;
    
    console.log(`🔄 Migrando ${watchedKeys.length} registros...`);
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
      } catch (e) { console.warn(e); }
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
    } catch (e) { return false; }
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

  initUI() {
    const backLink = document.getElementById('backLink');
    if (backLink && this.animeId) backLink.href = `anime-detail.html?id=${this.animeId}`;
    
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

    const openBtn = document.getElementById('openTutorialBtn');
    const closeBtns = document.querySelectorAll('#closeTutorialBtn, #closeTutorialBtn2');
    const modal = document.getElementById('tutorialModal');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.openTutorialModal());
    }
    closeBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => this.closeTutorialModal());
      }
    });
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeTutorialModal();
        }
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeTutorialModal();
      }
    });
  }

  async checkBraveAndShowBanner() {
    const banner = document.getElementById('braveBanner');
    if (!banner) return;

    let isBrave = false;
    if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
      try {
        isBrave = await navigator.brave.isBrave();
      } catch (e) {
        console.warn('Error detectando Brave:', e);
      }
    }

    if (!isBrave) {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }

  openTutorialModal() {
    const modal = document.getElementById('tutorialModal');
    if (!modal) return;
    modal.classList.add('show');
    const video = document.getElementById('tutorialVideo');
    if (video) {
      video.play().catch(() => {});
    }
    document.body.style.overflow = 'hidden';
  }

  closeTutorialModal() {
    const modal = document.getElementById('tutorialModal');
    if (!modal) return;
    modal.classList.remove('show');
    const video = document.getElementById('tutorialVideo');
    if (video) {
      video.pause();
    }
    document.body.style.overflow = '';
  }

  formatEpisodeTitle(season, epNum, episodeData) {
    const animeTitle = this.animeData?.title || 'Anime';
    const seasonName = season.name || `Temporada ${season.num}`;
    const episodeTitle = episodeData.title || `Capítulo ${epNum}`;
    return `${animeTitle} - ${seasonName} - ${episodeTitle}`;
  }

  normalizeUrls(urls) {
    if (!urls) return [];
    if (Array.isArray(urls)) return urls.filter(u => u && u.trim() !== '');
    if (typeof urls === 'string' && urls.trim() !== '') return [urls];
    return [];
  }

  // ===== NUEVA FUNCIÓN: PRIORIZAR Y RENOMBRAR OPCIONES =====
  prioritizeOptions(options) {
    // Asignar prioridad según el primer enlace de cada opción
    const getPriority = (urls) => {
      if (!urls || urls.length === 0) return 1;
      const firstUrl = urls[0] || '';
      if (firstUrl.includes('mp4upload.com')) return 0;   // mayor prioridad
      if (firstUrl.includes('drive.google.com')) return 2; // menor prioridad
      return 1; // otros
    };

    // Ordenar por prioridad (ascendente)
    options.sort((a, b) => getPriority(a.urls) - getPriority(b.urls));

    // Renombrar etiquetas y guardar la clave original
    const labels = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'];
    options.forEach((opt, index) => {
      opt.label = labels[index] || `Opción ${index + 1}`;
      // Guardar la clave original (link, link2, link3, link4) para usarla después
      opt.originalKey = opt.key; // asumimos que cada opción tiene un 'key'
    });

    return options;
  }

  // Crear el select con las opciones ya ordenadas
  createServerSelect(options, initialIndex) {
    const container = document.getElementById('serverOptions');
    container.innerHTML = '';
    
    const select = document.createElement('select');
    select.id = 'serverSelect';
    select.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      background: rgba(0,0,0,0.7);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      padding-right: 35px;
    `;
    
    options.forEach((opt, idx) => {
      const option = document.createElement('option');
      option.value = idx;
      option.textContent = opt.label; // "Opción 1", "Opción 2", ...
      if (idx === initialIndex) option.selected = true;
      select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value);
      const selected = options[idx];
      if (selected) {
        this.activeOptionLabel = selected.label;
        this.activeOptionKey = selected.originalKey || 'link'; // usar la clave guardada
        this.updateDownloadUrls(selected.urls);
        this.playPart(0, selected.urls);
      }
    });
    
    container.appendChild(select);
    return select;
  }

  updateDownloadUrls(urls) {
    this.currentDownloadUrls = urls.map(url => this.generateDirectLink(url));
    this.currentPeerTubeUrl = (urls.length > 0 && this.isPeerTubeUrl(urls[0])) ? urls[0] : null;
  }

  isPeerTubeUrl(url) {
    if (!url) return false;
    return /^(https?:\/\/)?([a-z0-9-]+\.)*peertube\.\w+\//i.test(url);
  }

  // Obtener las URLs según la clave activa
  getActiveEpisodeUrls() {
    const episodeData = this.currentEpisodeData;
    if (!episodeData) return [];
    // Usar la clave almacenada (link, link2, link3, link4)
    const key = this.activeOptionKey || 'link';
    return this.normalizeUrls(episodeData[key]);
  }

  showProgressBar() {
    if (document.getElementById('customDownloadProgress')) return;
    const div = document.createElement('div');
    div.id = 'customDownloadProgress';
    div.innerHTML = `
      <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:9999; background:rgba(0,0,0,0.9); border-radius:16px; padding:16px; border:1px solid var(--primary-color); backdrop-filter:blur(8px); text-align:center; font-family:'Poppins',sans-serif;">
        <div style="margin-bottom:8px; color:#fff;">⬇ Descargando video... <span id="progressPercent">0</span>%</div>
        <div style="background:#222; border-radius:50px; overflow:hidden; height:10px;">
          <div id="progressBarFill" style="width:0%; height:100%; background:linear-gradient(90deg, #00f3ff, #bc13fe); transition:width 0.2s;"></div>
        </div>
        <div style="font-size:0.7rem; color:#aaa; margin-top:8px;">No cierres la página hasta que termine</div>
      </div>
    `;
    document.body.appendChild(div);
  }

  hideProgressBar() {
    const el = document.getElementById('customDownloadProgress');
    if (el) el.remove();
  }

  isMobile() {
    return /android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase());
  }

  setupNavigation() {
    if (!this.animeData?.seasons) return;
    const flat = [];
    this.animeData.seasons.sort((a,b) => a.num - b.num).forEach(season => {
      season.eps?.forEach((ep, idx) => {
        const hasLink = (ep.link && (Array.isArray(ep.link) ? ep.link.length : ep.link)) ||
                        (ep.link2 && (Array.isArray(ep.link2) ? ep.link2.length : ep.link2)) ||
                        (ep.link3 && (Array.isArray(ep.link3) ? ep.link3.length : ep.link3)) ||
                        (ep.link4 && (Array.isArray(ep.link4) ? ep.link4.length : ep.link4));
        if (hasLink) {
          flat.push({ s: season.num, e: idx + 1, seasonObj: season, episodeData: ep });
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
      prevBtn.setAttribute('title', this.formatEpisodeTitle(prev.seasonObj, prev.e, prev.episodeData));
    } else {
      prevBtn.classList.add('btn-hidden');
    }
    
    if (idx < flat.length - 1) {
      const next = flat[idx+1];
      nextBtn.classList.remove('btn-hidden');
      nextBtn.href = `?anime=${this.animeId}&s=${next.s}&e=${next.e}`;
      nextBtn.setAttribute('title', this.formatEpisodeTitle(next.seasonObj, next.e, next.episodeData));
    } else {
      nextBtn.classList.add('btn-hidden');
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
      
      this.currentEpisodeData = episodeData;
      const formattedTitle = this.formatEpisodeTitle(season, parseInt(this.episode), episodeData);
      document.title = `Ver ${formattedTitle} - Archinime`;
      document.getElementById('epTitle').innerText = formattedTitle;
      
      // Crear array de opciones con sus claves originales
      let options = [
        { label: 'Latino', key: 'link', urls: this.normalizeUrls(episodeData.link) },
        { label: 'Opción 2', key: 'link2', urls: this.normalizeUrls(episodeData.link2) },
        { label: 'Opción 3', key: 'link3', urls: this.normalizeUrls(episodeData.link3) },
        { label: 'Opción 4', key: 'link4', urls: this.normalizeUrls(episodeData.link4) }
      ].filter(opt => opt.urls.length > 0);

      if (options.length === 0) {
        document.getElementById('epTitle').innerText = 'No hay enlaces disponibles';
        return;
      }

      // Reordenar y renombrar según prioridad
      options = this.prioritizeOptions(options);

      // Crear el select con las opciones ya ordenadas
      this.createServerSelect(options, 0);

      // Establecer la primera opción como activa
      const firstOption = options[0];
      this.activeOptionLabel = firstOption.label;
      this.activeOptionKey = firstOption.originalKey || 'link';
      this.updateDownloadUrls(firstOption.urls);
      this.playPart(0, firstOption.urls);
      
      this.setupNavigation();
      await this.autoMarkAsWatched();
    } catch (error) {
      console.error(error);
      document.getElementById('epTitle').innerText = 'Error al cargar el episodio';
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new VideoPlayer());
} else {
  new VideoPlayer();
}

window.openLoginModalFromComent = () => window.videoPlayer?.openLoginModal();
window.toggleStickerPanelSistema = () => window.videoPlayer?.toggleStickerPanel();