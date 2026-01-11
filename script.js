// ============================================
// CONFIGURACIÓN FIREBASE
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyBpzYARIxaJijLbbL-2S6F9MWecbAbvK_I",
    authDomain: "login-admin-archinime.firebaseapp.com",
    projectId: "login-admin-archinime",
    storageBucket: "login-admin-archinime.firebasestorage.app",
    messagingSenderId: "938164660242",
    appId: "1:938164660242:web:648e0dce0e0d18dd78d0cb"
};

// USUARIOS PERMITIDOS (Super Admins)
const ALLOWED_USERS = [
    "archinime12@gmail.com", 
    "alejandroarchi12@gmail.com",
    "lucioguapofeo@gmail.com",
];

// CONFIGURACIÓN GITHUB
const OWNER = "Archinime";
const REPO = "-Archinime-";

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// FORZAR CIERRE DE SESIÓN AL CERRAR PESTAÑA
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

let currentUserToken = null;
let globalUsersData = {};
// Guardará todos los usuarios cargados

// VARIABLES DE ESTADO
let isEditMode = false;
let currentEditingId = null;
let cachedIndex = [];
let searchTimeout = null;
let previewTimeout = null;

// DATOS DEL USUARIO ACTUAL
let currentUserNick = "Usuario"; 
let currentUserAvatar = "Logo_Archinime.avif";
let currentUserEmail = "";

// Variable para el modo de búsqueda ('mine' o 'general')
let currentSearchMode = 'mine';

// ============================================
// AUTENTICACIÓN
// ============================================
auth.onAuthStateChanged((user) => {
    // Solo actuamos si tenemos token (significa que entró por Github o ya estaba)
    // El flujo principal se dispara en signInWithGitHub
    if (user && currentUserToken) {
        checkAccess(user);
    } else if (!user) {
        showLogin();
    }
});

function signInWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo');
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            return auth.signInWithPopup(provider);
        })
        .then((result) => {
            currentUserToken = result.credential.accessToken;
            // Llamamos a checkAccess aquí porque ya tenemos el token de GH necesario
            checkAccess(result.user);
        }).catch((error) => {
            console.error(error);
            document.getElementById('errorText').innerText = error.message;
            document.getElementById('loginError').style.display = 'block';
        });
}

// MODIFICADO: Ahora verifica en users-data.js
async function checkAccess(user) {
    const email = user.email;
    currentUserEmail = email;
    document.getElementById('errorText').innerText = "Verificando base de datos...";
    document.getElementById('loginError').style.display = 'none';

    try {
        // 1. Descargar users-data.js para ver si el usuario existe
        const usersFile = await getGithubFile(currentUserToken, OWNER, REPO, 'users-data.js');
        globalUsersData = safeEval(usersFile.content);

        if (globalUsersData[email]) {
            // USUARIO EXISTE -> CARGAR SUS DATOS
            const userData = globalUsersData[email];
            currentUserNick = userData.nick;
            currentUserAvatar = userData.avatar;
            showCMS();
        } else {
            // USUARIO NUEVO -> MOSTRAR PANTALLA DE REGISTRO
            showProfileSetup();
        }

    } catch (e) {
        console.error(e);
        document.getElementById('errorText').innerText = "Error leyendo users-data: " + e.message;
        document.getElementById('loginError').style.display = 'block';
    }
}

function showProfileSetup() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none';
    document.getElementById('profileSetupModal').style.display = 'flex';
    
    // Prellenar con info básica de la cuenta Google/Github si hay
    const user = auth.currentUser;
    if(user) {
        document.getElementById('setupNick').value = user.displayName || "";
        if(user.photoURL) {
            document.getElementById('setupAvatar').value = user.photoURL;
            document.getElementById('setupAvatarPreview').src = user.photoURL;
        }
    }
}

function updateProfilePreview(input) {
    const img = document.getElementById('setupAvatarPreview');
    if(input.value) img.src = input.value;
    else img.src = "Logo_Archinime.avif";
}

async function saveUserProfile() {
    const nick = document.getElementById('setupNick').value.trim();
    const avatar = document.getElementById('setupAvatar').value.trim();
    const social = document.getElementById('setupSocial').value.trim();
    const logEl = document.getElementById('profileLog');
    const btn = document.getElementById('btnSaveProfile');
    
    if(!nick || !avatar) {
        alert("Nick y Avatar son obligatorios.");
        return;
    }

    btn.disabled = true;
    logEl.innerText = "Guardando perfil en GitHub...";
    try {
        // Actualizamos el objeto local
        globalUsersData[currentUserEmail] = {
            nick: nick,
            avatar: avatar,
            social: social
        };
        // Guardamos en GitHub
        await updateGithubFile(currentUserToken, OWNER, REPO, 'users-data.js', (content) => {
            // Reconstruimos el archivo completo
            const jsonStr = JSON.stringify(globalUsersData, null, 4);
            return `const usersData = ${jsonStr};`;
        });
        // Actualizamos variables globales de sesión
        currentUserNick = nick;
        currentUserAvatar = avatar;
        logEl.innerText = "¡Perfil creado! Entrando...";
        setTimeout(() => {
            document.getElementById('profileSetupModal').style.display = 'none';
            showCMS();
        }, 1000);
    } catch(e) {
        console.error(e);
        logEl.innerText = "Error: " + e.message;
        btn.disabled = false;
    }
}

function showCMS() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'flex';
    document.getElementById('cmsContent').style.display = 'grid';
    // Actualizar UI con datos del usuario
    document.getElementById('userAvatarImg').src = currentUserAvatar;
    document.getElementById('userNameDisplay').innerText = currentUserNick;
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none';
    document.getElementById('profileSetupModal').style.display = 'none';
}

function logout() {
    auth.signOut().then(() => {
        location.reload();
    });
}

// ============================================
// LÓGICA DE INTERFAZ Y FORMULARIO
// ============================================
const genresList = [
    "Acción", "Animación", "Aventura", "Ciencia ficción", "Cocina", "Comedia", "Comedia oscura", "Cosplay", 
    "Cyberpunk", "Deducción Social", "Deportivo", "Drama", "Ecchi", "Escolar", "Fantasía", "Fantasía oscura", 
    "Harem", "Hentai", "Horror", "Incesto", "Isekai", "Isekai Inverso", "Kaiju", "Mecha", "Militar", 
    "Misterio", "Musical", "Nekketsu", "Psicológico", "Romance", "Seinen", "Shōnen", "Shōjo", 
    "Slice of Life", "Sobrenatural", "Superhéroes", "Suspenso", "Terror", "Yuri", "Yaoi", "Seijin"
];
const gContainer = document.getElementById('genresContainer');
genresList.forEach(g => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${g}" onchange="requestPreviewUpdate()"> ${g}`;
    gContainer.appendChild(label);
});

function showToast(msg, isError = false) {
    const x = document.getElementById("toast");
    x.innerHTML = isError ?
    `<i class="fas fa-times-circle" style="color:#ff4757"></i> ${msg}` : `<i class="fas fa-check-circle" style="color:var(--accent)"></i> ${msg}`;
    x.className = "show";
    x.style.borderColor = isError ? "#ff4757" : "var(--accent)";
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 4000);
}

function autoCap(input) {
    if(input.value) input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
}

function validate(input) {
    if(!input.value.trim()) input.style.borderColor = '#ff4757';
    else input.style.borderColor = '#2a2b35';
}

function log(msg) {
    const el = document.getElementById('statusLog');
    el.style.display = 'block';
    el.innerHTML += `> ${msg}<br>`;
    el.scrollTop = el.scrollHeight;
}

// CONVERSOR DE LINKS
function smartLinkConvert(input) {
    let val = input.value.trim();
    let changed = false;
    if (val.includes('dropbox.com') && val.endsWith('&dl=0')) {
        input.value = val.replace('&dl=0', '&raw=1');
        changed = true;
        showToast("Link Dropbox convertido a &raw=1");
    }
    const driveRegex = /(https:\/\/drive\.google\.com\/file\/d\/[^\/]+)\/(?:view|preview)(?:\?.*)?/;
    if (driveRegex.test(val) && !val.endsWith('/preview')) {
        const match = val.match(driveRegex);
        if (match && match[1]) {
            input.value = match[1] + '/preview';
            changed = true;
            showToast("Link Drive convertido a /preview");
        }
    }

    if(changed && input.id === 'portadaAnime') {
        checkCoverVisual(input);
        requestPreviewUpdate();
    }
}

function checkCoverVisual(input) {
    const img = document.getElementById('mainCoverPreview');
    const display = document.getElementById('dimDisplay');
    const val = input.value.trim();
    if(val === "") {
        img.style.display = 'none';
        display.innerText = "";
        requestPreviewUpdate();
        return;
    }
    img.src = val;
    img.style.display = 'block';
    display.innerText = "Verificando...";
    img.onload = function() { 
        const w = this.naturalWidth;
        const h = this.naturalHeight;
        const allowed = [{w: 1000, h: 1500}, {w: 2000, h: 3000}, {w: 3412, h: 5120}];
        const isValid = allowed.some(d => d.w === w && d.h === h);
        if (isValid) {
            display.innerHTML = `<span style="color:#00ffbf"><i class="fas fa-check"></i> Válido: ${w}x${h}px</span>`;
            input.style.borderColor = '#00ffbf';
            requestPreviewUpdate(); 
        } else {
            display.innerHTML = `<span style="color:#ff4757"><i class="fas fa-times"></i> Inválido: ${w}x${h}px.</span>`;
            input.style.borderColor = '#ff4757';
        }
    };
    img.onerror = function() { 
        display.innerText = "URL inválida";
        img.style.display='none'; 
        input.style.borderColor = '#ff4757';
    };
}

function addAlias(value = "") {
    const container = document.getElementById('aliasContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <input type="text" class="alias-input" placeholder="Alias..." value="${value}" oninput="requestPreviewUpdate()">
        <button class="btn-mini-del" onclick="this.parentElement.remove(); requestPreviewUpdate()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(div);
}

// AUDIO PLAYER
function addMusic(url = "") {
    const container = document.getElementById('musicContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <div class="audio-preview-box">
            <input type="text" class="m-url" value="${url}" placeholder="Audio (mp3...)" oninput="updateAudioPreview(this)" onblur="smartLinkConvert(this)">
            <audio controls preload="none"></audio>
            <div class="audio-status-text"></div>
        </div>
        <button class="btn-mini-del" onclick="this.parentElement.remove()" style="height:auto; aspect-ratio:1/1"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(div);
    if(url) updateAudioPreview(div.querySelector('.m-url'));
}

function updateAudioPreview(input) {
    const parent = input.parentElement;
    const audioEl = parent.querySelector('audio');
    const statusEl = parent.querySelector('.audio-status-text');
    
    if (!input.value.trim()) {
        statusEl.innerHTML = '';
        return;
    }
    statusEl.innerHTML = '<span style="color:#facc15"><i class="fas fa-circle-notch fa-spin"></i> Cargando...</span>';
    audioEl.src = input.value;
    audioEl.load();
    audioEl.onloadeddata = () => { statusEl.innerHTML = '<span style="color:#00ffbf"><i class="fas fa-check"></i> Válido</span>'; };
    audioEl.onerror = () => { statusEl.innerHTML = '<span style="color:#ff4757"><i class="fas fa-triangle-exclamation"></i> Error</span>'; };
}

// SEASONS & CHAPTERS - PALETA DE COLORES
const colorPalette = [
    '#00f0ff', '#8c52ff', '#ff0055', '#00ff9d', '#ffeb3b', '#ff9100', '#2979ff', '#e040fb'
];
function addSeason(data = null) {
    const container = document.getElementById('seasonsContainer');
    const div = document.createElement('div');
    div.className = 'season-card';
    const count = document.querySelectorAll('.season-card').length;
    const color = colorPalette[count % colorPalette.length];
    div.style.cssText = `
        border-left: 4px solid ${color};
        background: linear-gradient(120deg, ${color}11 0%, rgba(19, 20, 25, 0.9) 35%);
    `;
    div.innerHTML = `
        <button class="btn-del-section" onclick="removeSeasonBlock(this)"><i class="fas fa-trash"></i> ELIMINAR</button>
        <div class="row-flex">
            <div class="col-flex">
                <label>Tipo</label>
                <select class="s-type" onchange="handleSeasonTypeChange(this)">
                    <option value="" disabled ${!data ? 'selected' : ''}>Seleccionar...</option>
                    <option value="Temporada">Temporada</option>
                    <option value="Pelicula">Película</option>
                    <option value="OVA">OVA</option>
                    <option value="Especial">Especial</option>
                    <option value="Spin-Off">Spin-Off</option>
                </select>
            </div>
            <div class="col-flex">
                 <label>Nombre Bloque</label>
                 <input type="text" class="s-name" placeholder="Auto" disabled oninput="requestPreviewUpdate()">
            </div>
        </div>
        <label>Poster Bloque</label>
        <input type="text" class="s-img" placeholder="https://..." oninput="requestPreviewUpdate()" onblur="smartLinkConvert(this)">
        
        <label>Cant. Capítulos</label>
        <input type="number" class="s-count" min="1" onchange="renderChapters(this)">
        <div class="chapters-grid" style="margin-top:20px;"></div>
    `;
    container.appendChild(div);

    if(data) {
        let selectedType = 'Spin-Off';
        if(data.name.startsWith('Temporada')) selectedType = 'Temporada';
        else if(data.name.startsWith('Película')) selectedType = 'Pelicula';
        else if(data.name.startsWith('OVA')) selectedType = 'OVA';
        else if(data.name.startsWith('Especial')) selectedType = 'Especial';
        
        const typeSel = div.querySelector('.s-type');
        typeSel.value = selectedType;
        const nameInp = div.querySelector('.s-name');
        nameInp.value = data.name;
        div.querySelector('.s-img').value = data.cover;
        
        handleSeasonTypeChange(typeSel);
        
        const countInp = div.querySelector('.s-count');
        countInp.value = data.eps.length;
        renderChapters(countInp, data.eps);
    }
}

function removeSeasonBlock(btn) {
    btn.closest('.season-card').remove();
    updateAllBlockNames();
    requestPreviewUpdate();
    document.querySelectorAll('.season-card').forEach((card, idx) => {
        const color = colorPalette[idx % colorPalette.length];
        card.style.borderLeftColor = color;
        card.style.background = `linear-gradient(120deg, ${color}11 0%, rgba(19, 20, 25, 0.9) 35%)`;
    });
}

function updateAllBlockNames() {
    const cards = document.querySelectorAll('.season-card');
    let tempCount = 0, movieCount = 0, ovaCount = 0, specialCount = 0, spinOffCount = 0;
    cards.forEach(card => {
        const typeSelect = card.querySelector('.s-type');
        const nameInput = card.querySelector('.s-name');
        const type = typeSelect.value;
        if (!type) return;

        nameInput.disabled = (type !== 'Spin-Off');

        if(!isEditMode) { 
             if (type === 'Temporada') {
                tempCount++;
                nameInput.value = `Temporada ${tempCount}`;
            } else if (type === 'Spin-Off') {
                spinOffCount++;
                if (!nameInput.value) nameInput.value = `Spin-Off ${spinOffCount}`; 
            } else if (type === 'Pelicula') {
                movieCount++;
                nameInput.value = `Película ${movieCount}`;
            } else if (type === 'OVA') {
                ovaCount++;
                nameInput.value = `OVA ${ovaCount}`;
            } else if (type === 'Especial') {
                specialCount++;
                nameInput.value = `Especial ${specialCount}`;
            }
        }
    });
}

function handleSeasonTypeChange(select) {
    const card = select.closest('.season-card');
    const countInput = card.querySelector('.s-count');
    const type = select.value;
    if (['Pelicula', 'OVA', 'Especial'].includes(type)) {
        countInput.value = 1;
        countInput.disabled = true;
    } else {
        countInput.disabled = false;
    }
    if(!select.dataset.loading) updateAllBlockNames();
    if(countInput.value) renderChapters(countInput);
    requestPreviewUpdate();
}

function renderChapters(input, existingEps = []) {
    const card = input.closest('.season-card');
    const typeSelect = card.querySelector('.s-type');
    const type = typeSelect ? typeSelect.value : "";
    const count = parseInt(input.value);
    const list = card.querySelector('.chapters-grid');
    // Guardar datos actuales
    let currentData = [];
    if(existingEps.length === 0) {
        card.querySelectorAll('.chapter-row').forEach(row => {
            currentData.push({
                lat: row.querySelector('.c-link-lat').value,
                sub: row.querySelector('.c-link-sub').value,
                title: row.querySelector('.c-title-ov').value
            });
        });
    }

    list.innerHTML = '';
    if(isNaN(count) || count < 1) return;
    for(let i=0; i<count; i++) {
        const row = document.createElement('div');
        row.className = 'chapter-row';
        let sub = '', lat = '', customTitle = '';
        if(existingEps[i]) {
             lat = existingEps[i].link || '';
             sub = existingEps[i].link2 || ''; 
             if(!['Temporada', 'Spin-Off'].includes(type)) customTitle = existingEps[i].title;
        } else if(currentData[i]) {
             lat = currentData[i].lat;
             sub = currentData[i].sub;
             customTitle = currentData[i].title;
        }

        let titleInputDisabled = ['Temporada', 'Spin-Off'].includes(type) ? "disabled" : "";
        let titlePlaceholder = titleInputDisabled ? `Capítulo ${i+1}` : "Nombre (ej: El viaje...)";
        if(titleInputDisabled) customTitle = `Capítulo ${i+1}`;
        row.innerHTML = `
            <div class="chapter-header"><span class="chapter-num">CAPÍTULO ${i+1}</span></div>
            <div class="c-inputs-grid">
                <input type="text" class="c-link-lat" value="${lat}" placeholder="🔗 Lat" onblur="smartLinkConvert(this)">
                <input type="text" class="c-link-sub" value="${sub}" placeholder="🔗 Sub" onblur="smartLinkConvert(this)">
            </div>
            <input type="text" class="c-title-ov" value="${customTitle}" ${titleInputDisabled} placeholder="${titlePlaceholder}" style="margin-top:10px; font-size:0.9em; border-color:#333; background:#111;">
        `;
        list.appendChild(row);
    }
}

// THROTTLE PARA VISTA PREVIA (ANTI-LAG)
function requestPreviewUpdate() {
    if (!previewTimeout) {
        previewTimeout = requestAnimationFrame(() => {
            updateWebPreview();
            previewTimeout = null;
        });
    }
}

function updateWebPreview() {
    const title = document.getElementById('tituloAnime').value;
    document.getElementById('webTitle').innerText = title || 'Título';
    const coverUrl = document.getElementById('portadaAnime').value;
    if(coverUrl) document.getElementById('webCover').src = coverUrl;
    document.getElementById('previewId').innerText = isEditMode ? currentEditingId : "###";

    const demo = document.getElementById('demografiaAnime').value;
    document.getElementById('webDemography').innerText = demo ? demo.toUpperCase() : 'DEMO';
    
    const aliases = [];
    document.querySelectorAll('.alias-input').forEach(i => { if(i.value.trim()) aliases.push(i.value.trim()) });
    const aliasStr = aliases.length > 0 ? aliases.join(', ') : "";
    document.getElementById('previewAliasesList').innerText = aliasStr;

    const ratingSel = document.getElementById('ratingAnime').value;
    let ratingTxt = "--";
    if(ratingSel === 'excellent') ratingTxt = "4.9";
    else if(ratingSel === 'good') ratingTxt = "4.6";
    else if(ratingSel === 'regular') ratingTxt = "4.0";
    document.getElementById('webRating').innerText = `⭐ ${ratingTxt}`;
    
    const tagsContainer = document.getElementById('webTags');
    tagsContainer.innerHTML = '';
    document.querySelectorAll('#genresContainer input:checked').forEach(cb => {
        let s = document.createElement('span');
        s.style.cssText = "font-size:0.65em; padding:3px 8px; border-radius:4px; background:rgba(255,255,255,0.1); color:#ccc;";
        s.innerText = cb.value;
        tagsContainer.appendChild(s);
    });
    const grid = document.getElementById('webSeasonsGrid');
    grid.innerHTML = '';
    document.querySelectorAll('.season-card').forEach(card => {
        const img = card.querySelector('.s-img').value;
        const name = card.querySelector('.s-name').value;
        const type = card.querySelector('.s-type').value;
        const count = card.querySelector('.s-count').value || 0;

        if(name) {
            const div = document.createElement('div');
            div.className = 'preview-s-item';
            let label = (['Temporada', 'Spin-Off'].includes(type)) ? `${count} Caps` : (count > 1 ? `${count} ${type}s` : `${count} ${type}`);
            div.innerHTML = `<img src="${img || 'https://via.placeholder.com/150'}"><div class="preview-s-count">${label}</div><div class="preview-s-title">${name}</div>`;
            grid.appendChild(div);
        }
    });
}

// ============================================
// API GITHUB Y PARSEO SEGURO
// ============================================
async function getGithubFile(token, owner, repo, path) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, {
        headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!response.ok) throw new Error(`Error leyendo ${path}`);
    const data = await response.json();
    return { 
        sha: data.sha, 
        content: new TextDecoder().decode(Uint8Array.from(atob(data.content), c => c.charCodeAt(0))) 
    };
}

function safeEval(fileContent) {
    try {
        const eqIndex = fileContent.indexOf('=');
        if (eqIndex === -1) throw new Error("No se encontró asignación de variable");
        let dataStr = fileContent.substring(eqIndex + 1).trim();
        if (dataStr.endsWith(';')) dataStr = dataStr.slice(0, -1);
        return eval('(' + dataStr + ')');
    } catch (e) {
        console.error("Error parseando JS:", e);
        throw new Error("El archivo tiene un formato inválido o complejo.");
    }
}

async function updateGithubFile(token, owner, repo, path, contentTransformer) {
    const fileData = await getGithubFile(token, owner, repo, path);
    const newContent = contentTransformer(fileData.content);
    const encodedContent = btoa(new TextEncoder().encode(newContent).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: `Update ${path} via CMS (${isEditMode ? 'Edit' : 'New'})`,
            content: encodedContent,
            sha: fileData.sha
        })
    });
    if (!response.ok) throw new Error(`Error subiendo ${path}`);
}

// ============================================
// CARGA Y EDICIÓN (CON PESTAÑAS)
// ============================================
function openSearchModal() {
    document.getElementById('searchModal').style.display = 'flex';
    document.getElementById('searchInput').value = ""; 
    document.getElementById('searchResults').innerHTML = "";
    
    // Default a 'mine' al abrir
    switchSearchTab('mine');

    if(cachedIndex.length === 0) loadIndexForSearch();
    else filterSearch();
}

function handleModalClick(event) {
    if (event.target.id === 'searchModal') {
        closeSearchModal();
    }
}

function closeSearchModal() { 
    document.getElementById('searchModal').style.display = 'none';
}

function switchSearchTab(mode) {
    currentSearchMode = mode;
    // Update visual
    document.getElementById('tabMine').className = mode === 'mine' ? 'tab-btn active' : 'tab-btn';
    document.getElementById('tabGeneral').className = mode === 'general' ? 'tab-btn active' : 'tab-btn';

    // Refilter
    if(cachedIndex.length > 0) filterSearch();
}

async function loadIndexForSearch() {
    const loading = document.getElementById('loadingSearch');
    loading.style.display = 'block';
    try {
        if(!currentUserToken) throw new Error("No hay sesión");
        const file = await getGithubFile(currentUserToken, OWNER, REPO, 'index-data.js');
        const data = safeEval(file.content);
        cachedIndex = data.reverse(); 
        filterSearch();
    } catch(e) {
        document.getElementById('searchResults').innerHTML = `<div style="color:red; text-align:center">Error: ${e.message}</div>`;
    } finally {
        loading.style.display = 'none';
    }
}

function filterSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { _performFilter(); }, 300);
}

function _performFilter() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
    
    const isSuperAdmin = ALLOWED_USERS.includes(currentUserEmail);
    const filtered = cachedIndex.filter(a => {
        const matchesText = a.title.toLowerCase().includes(query);
        const uploaderName = a.uploader || "Archinime";

        // CORREGIDO: Lógica estricta para "Mis Animes"
        if (currentSearchMode === 'mine') {
            // Solo muestra si el nombre del uploader coincide EXACTAMENTE con el usuario actual
            // Ignoramos isSuperAdmin aquí para limpiar la vista personal
            return matchesText && (uploaderName === currentUserNick);
        } else {
            // General: muestra todo
            return matchesText;
        }
    }).slice(0, 1000);

    filtered.forEach(anime => {
        const div = document.createElement('div');
        div.className = 's-result-item';
        div.onclick = () => loadAnimeForEditing(anime.id);
        
        let extraInfo = "";
        if (currentSearchMode === 'general') {
            extraInfo = ` | Subido por: <span style="color:var(--primary)">${anime.uploader || "Desconocido"}</span>`;
        }

        div.innerHTML = `
            <img src="${anime.img}" class="s-result-img" onerror="this.src='https://via.placeholder.com/50'">
            <div>
                <div style="font-weight:bold; color:#fff;">${anime.title}</div>
                <div style="color:#777; font-size:0.8em">ID: ${anime.id}${extraInfo}</div>
            </div>
        `;
        results.appendChild(div);
    });

    if(filtered.length === 0) {
        let emptyMsg = "";
        if (currentSearchMode === 'mine') {
            emptyMsg = `No se encontraron animes subidos por <b>${currentUserNick}</b>.`;
        } else {
            emptyMsg = "No se encontraron resultados en el catálogo general.";
        }

        results.innerHTML = `
            <div style="padding:20px; color:#777; text-align:center">
                <i class="fas fa-folder-open" style="font-size:2em; margin-bottom:10px;"></i><br>
                ${emptyMsg}
            </div>`;
    }
}

async function loadAnimeForEditing(id) {
    if(!confirm("¿Cargar anime? Se perderán los datos actuales del formulario.")) return;
    closeSearchModal();
    showToast("Descargando datos...", false);
    
    try {
        const [detailFile, playerFile, musicFile] = await Promise.all([
            getGithubFile(currentUserToken, OWNER, REPO, 'anime-detail-data.js'),
            getGithubFile(currentUserToken, OWNER, REPO, 'video-player-data.js'),
            getGithubFile(currentUserToken, OWNER, REPO, 'musica-data.js')
        ]);
        const detObj = safeEval(detailFile.content);
        const playObj = safeEval(playerFile.content);
        const musObj = safeEval(musicFile.content);

        const targetDetail = detObj[id];
        const targetPlayer = playObj[id] || {};
        const targetMusic = musObj[id] || [];

        if(!targetDetail) throw new Error("Anime no encontrado en Details");
        isEditMode = true;
        currentEditingId = id;
        document.getElementById('editModeBar').style.display = 'block';
        document.getElementById('editIdDisplay').innerText = id;
        document.getElementById('btnActionText').innerText = "GUARDAR CAMBIOS (EDITAR)";
        // VERIFICACIÓN DE PROPIEDAD PARA BLOQUEAR BOTÓN
        const indexEntry = cachedIndex.find(x => x.id === id);
        const uploaderName = targetDetail.uploader || (indexEntry ? indexEntry.uploader : "Archinime");
        const isSuperAdmin = ALLOWED_USERS.includes(currentUserEmail);
        const isOwner = (uploaderName === currentUserNick) || isSuperAdmin || (currentUserNick === "Archinime");

        const saveBtn = document.getElementById('btnSaveAction');
        if (!isOwner) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-lock"></i> EDICIÓN BLOQUEADA (Solo Lectura)';
            showToast("Modo Lectura: No eres el autor de este anime", true);
        } else {
            saveBtn.disabled = false;
        }

        document.getElementById('tituloAnime').value = targetDetail.title;
        document.getElementById('portadaAnime').value = targetDetail.cover;
        document.getElementById('sinopsisAnime').value = targetDetail.desc;
        
        document.getElementById('aliasContainer').innerHTML = '';
        if(indexEntry && indexEntry.aliases) indexEntry.aliases.forEach(a => addAlias(a));

        if(indexEntry && indexEntry.genres && indexEntry.genres.length > 0) {
            let loadedGenres = [...indexEntry.genres];
            const lastGenre = loadedGenres[loadedGenres.length - 1];
            const demoOptions = ["Shōnen", "Seinen", "Shōjo", "Josei", "Kodomo"];
            if (demoOptions.includes(lastGenre)) {
                document.getElementById('demografiaAnime').value = lastGenre;
                loadedGenres.pop();
            }

            document.querySelectorAll('#genresContainer input').forEach(cb => {
                cb.checked = loadedGenres.includes(cb.value);
            });
        }
        
        const rateSelect = document.getElementById('ratingAnime');
        if(indexEntry) {
            if(indexEntry.rating >= 4.8) rateSelect.value = 'excellent';
            else if(indexEntry.rating >= 4.6) rateSelect.value = 'good';
            else rateSelect.value = 'regular';
        }
        
        document.getElementById('seasonsContainer').innerHTML = '';
        targetDetail.seasons.forEach(s => {
            const seasonPlayer = targetPlayer[s.num] || {}; 
            const fullEps = s.eps.map((e, idx) => {
                const epNum = idx + 1;
                const links = seasonPlayer[epNum] || {};
                return { title: e.title, link: links.link, link2: links.link2 };
            });
            addSeason({ name: s.name || `Temporada ${s.num}`, cover: s.cover, eps: fullEps });
        });
        document.getElementById('musicContainer').innerHTML = '';
        targetMusic.forEach(url => addMusic(url));

        checkCoverVisual(document.getElementById('portadaAnime'));
        requestPreviewUpdate();
        showToast("¡Datos cargados correctamente!");
    } catch(e) {
        console.error(e);
        showToast("Error cargando: " + e.message, true);
        exitEditMode();
    }
}

function exitEditMode() {
    isEditMode = false;
    currentEditingId = null;
    document.getElementById('editModeBar').style.display = 'none';
    document.getElementById('btnActionText').innerText = "COMPILAR Y SUBIR";
    // Restaurar botón si estaba bloqueado
    const saveBtn = document.getElementById('btnSaveAction');
    saveBtn.disabled = false;
    
    location.reload();
}

// ============================================
// GENERACIÓN Y SUBIDA
// ============================================
function generateData() {
    const selectedGenres = [];
    document.querySelectorAll('#genresContainer input:checked').forEach(cb => selectedGenres.push(cb.value));
    const demoSelect = document.getElementById('demografiaAnime').value;
    const ratingSelect = document.getElementById('ratingAnime').value;
    const aliasList = [];
    document.querySelectorAll('.alias-input').forEach(i => { if(i.value.trim()) aliasList.push(i.value.trim()) });
    let ratingVal = 0;
    if(ratingSelect === 'excellent') ratingVal = 4.9;
    else if(ratingSelect === 'good') ratingVal = 4.6;
    else if(ratingSelect === 'regular') ratingVal = 4.0;

    // Aquí capturamos la info del usuario actual
    const anime = {
        id: isEditMode ? currentEditingId : 0, 
        titulo: document.getElementById('tituloAnime').value.trim(),
        aliases: aliasList,
        portada: document.getElementById('portadaAnime').value.trim(),
        sinopsis: document.getElementById('sinopsisAnime').value.trim(),
        demografia: demoSelect, 
        generos: selectedGenres,
        rating: ratingVal,
        musica: [],
        temporadas: [],
        uploader: currentUserNick, // Guardamos tu nombre
        uploaderAvatar: currentUserAvatar // Guardamos tu foto
    };
    document.querySelectorAll('#musicContainer .m-url').forEach(i => { if(i.value) anime.musica.push(i.value.trim()); });

    let globalOrder = 1, seasonCountVP = 0, ovaCountVP = 0, movieCountVP = 0, specialCountVP = 0, spinOffCount = 0;
    document.querySelectorAll('.season-card').forEach(card => {
        const eps = [];
        const sName = card.querySelector('.s-name').value;
        const sType = card.querySelector('.s-type').value;
        
        if(sType === 'Temporada') seasonCountVP++;
        if(sType === 'OVA') ovaCountVP++;
        if(sType === 'Pelicula') movieCountVP++;
        if(sType === 'Especial') specialCountVP++;

        card.querySelectorAll('.chapter-row').forEach((row, idx) => {
            const lat = row.querySelector('.c-link-lat').value.trim();
            const sub = row.querySelector('.c-link-sub').value.trim();
            
            let customTitleInput = row.querySelector('.c-title-ov').value.trim();
            
            let playerTitle = "", detailTitle = ""; 

            if (sType === 'Temporada') {
                detailTitle = `Capítulo ${idx+1}`;
                playerTitle = `${anime.titulo} T${seasonCountVP} Cap ${idx+1}`;
            } else if (sType === 'Spin-Off') {
                detailTitle = `Capítulo ${idx+1}`;
                playerTitle = `${anime.titulo} ${sName} Cap ${idx+1}`;
            } else if (sType === 'OVA') {
                detailTitle = customTitleInput || sName;
                playerTitle = `${anime.titulo} OVA ${ovaCountVP}` + (customTitleInput ? ` "${customTitleInput}"` : "");
            } else if (sType === 'Pelicula') {
                detailTitle = customTitleInput || sName;
                playerTitle = `${anime.titulo} Película ${movieCountVP}` + (customTitleInput ? `: ${customTitleInput}` : "");
            } else if (sType === 'Especial') {
                detailTitle = customTitleInput || sName;
                playerTitle = `${anime.titulo} Especial ${specialCountVP}` + (customTitleInput ? `: ${customTitleInput}` : "");
            }

            if(sub || lat) {
                eps.push({ num: idx + 1, link: lat, link2: sub, title: detailTitle, playerTitle: playerTitle });
            }
        });
        if(eps.length > 0) {
            anime.temporadas.push({
                num: globalOrder++,
                name: sName,
                type: sType,
                cover: card.querySelector('.s-img').value,
                eps: eps
            });
        }
    });

    return anime;
}

// FUNCIÓN PARA RESALTAR EL BOTÓN DE LOGOUT
function highlightLogoutButton() {
    const headerBtns = document.querySelectorAll('#userHeader button');
    const logoutBtn = Array.from(headerBtns).find(btn => btn.getAttribute('onclick') === 'logout()');
    if (logoutBtn) {
        logoutBtn.style.transition = 'all 0.5s ease';
        logoutBtn.style.border = '2px solid #00f0ff';
        logoutBtn.style.boxShadow = '0 0 20px #00f0ff, inset 0 0 10px #00f0ff';
        logoutBtn.style.color = '#00f0ff';
        logoutBtn.style.transform = 'scale(1.2)';
        // Animación simple de parpadeo
        let visible = true;
        setInterval(() => {
            logoutBtn.style.opacity = visible ? '0.5' : '1';
            visible = !visible;
        }, 500);
        // Mensaje flotante
        const tip = document.createElement('div');
        tip.innerHTML = "⬇ CLIC AQUÍ ⬇";
        tip.style.position = 'absolute';
        tip.style.top = '50px';
        tip.style.right = '10px';
        tip.style.background = '#00f0ff';
        tip.style.color = '#000';
        tip.style.padding = '5px 10px';
        tip.style.borderRadius = '5px';
        tip.style.fontWeight = 'bold';
        tip.style.zIndex = '9999';
        tip.style.pointerEvents = 'none';
        document.body.appendChild(tip);
    }
}

async function subirAGithHub() {
    const btn = document.getElementById('btnSaveAction');
    if(btn.disabled) return showToast("Edición Bloqueada", true);

    const token = currentUserToken;
    if(!token) return showToast("Error de sesión", true);
    const nuevoAnime = generateData();
    if(!nuevoAnime.titulo) return showToast("Falta Título", true);
    if(!nuevoAnime.portada) return showToast("Falta Portada", true);
    if(!nuevoAnime.sinopsis) return showToast("Falta Sinopsis", true);
    if(!nuevoAnime.demografia) return showToast("Elige Demografía", true);
    if(nuevoAnime.rating === 0) return showToast("Elige Valoración", true);
    if(nuevoAnime.generos.length === 0) return showToast("Elige Géneros", true);
    if(nuevoAnime.temporadas.length === 0) return showToast("Agrega contenido", true);

    document.getElementById('statusLog').innerHTML = "🚀 Iniciando...<br>";
    try {
        let FINAL_ID = nuevoAnime.id;
        if (!isEditMode) {
            log("1/5 Calculando ID...");
            const indexFile = await getGithubFile(token, OWNER, REPO, 'index-data.js');
            const indexData = safeEval(indexFile.content);
            let maxId = 0;
            indexData.forEach(item => { if(item.id > maxId) maxId = item.id; });
            FINAL_ID = maxId + 1;
            log(`✅ ID: ${FINAL_ID}`);
        } else {
            log(`📝 Editando ID: ${FINAL_ID}`);
        }

        // UPDATE INDEX
        log("2/5 Actualizando Index...");
        await updateGithubFile(token, OWNER, REPO, 'index-data.js', (content) => {
            let newContent = content;
            if(isEditMode) {
                const regexRemove = new RegExp(`\\s*\\{id:${FINAL_ID},[^]*?genres:\\[[^]*?\\]\\},?`, 'g');
                newContent = newContent.replace(regexRemove, '');
            }
            
            // LIMPIEZA DE COMAS DOBLES ANTES DE INSERTAR
            newContent = newContent.replace(/,\s*,/g, ',');

            const insertionPoint = newContent.lastIndexOf('];');
            let before = newContent.substring(0, insertionPoint).trim();
            
            if(before.endsWith(',')) {
                before = before.slice(0, -1);
            }
            
            let finalGenres = [...nuevoAnime.generos];
            if(nuevoAnime.demografia) {
                finalGenres = finalGenres.filter(g => g !== nuevoAnime.demografia);
                finalGenres.push(nuevoAnime.demografia);
            }
            const generosStr = finalGenres.map(g => `"${g}"`).join(',');
            const aliasesStr = nuevoAnime.aliases.length > 0 ? `, aliases: [${nuevoAnime.aliases.map(a => `"${a}"`).join(',')}]` : '';
            // AQUI AGREGAMOS TU NOMBRE Y TU AVATAR AL ARCHIVO
            const newEntry = `,\n      {id:${FINAL_ID}, title:"${nuevoAnime.titulo}"${aliasesStr}, img:"${nuevoAnime.portada}", rating:${nuevoAnime.rating}, uploader:"${nuevoAnime.uploader}", uploaderImg:"${nuevoAnime.uploaderAvatar}", genres:[${generosStr}]}`;
            return before + newEntry + "\n];";
        });
        
        // UPDATE DETAILS
        log("3/5 Actualizando Detalles...");
        await updateGithubFile(token, OWNER, REPO, 'anime-detail-data.js', (content) => {
            let newContent = content;
            if(isEditMode) {
                 const regexRemove = new RegExp(`\\s*${FINAL_ID}:\\s*\\{[^]*?seasons:\\[[^]*?\\]\\s*\\},?`, 'g');
                 newContent = newContent.replace(regexRemove, '');
            }
            
            const insertionPoint = newContent.lastIndexOf('};');
            const before = newContent.substring(0, insertionPoint).trimEnd();

            let seasonsStr = "";
            nuevoAnime.temporadas.forEach(t => {
                let epsStr = "";
                t.eps.forEach(e => epsStr += `            { title: "${e.title}"},\n`);
                let nameField = t.name ? `\n            name: "${t.name}",` : "";
                seasonsStr += `          {
            num: ${t.num},${nameField}
            cover: "${t.cover}",
            eps: [\n${epsStr}            ]
          },\n`;
            });
            const newDetail = `,\n    ${FINAL_ID}: {
        title: "${nuevoAnime.titulo}",
        desc: "${nuevoAnime.sinopsis.replace(/"/g, '\\"')}",
        cover: "${nuevoAnime.portada}",
        uploader: "${nuevoAnime.uploader}", 
        seasons: [\n${seasonsStr}          ]
    }`;
        return before + newDetail + "\n};";
        });

        // UPDATE PLAYER
        log("4/5 Actualizando Player...");
        await updateGithubFile(token, OWNER, REPO, 'video-player-data.js', (content) => {
            let newContent = content;
            
            if(isEditMode) {
                 const regexRemove = new RegExp(`\\s*"${FINAL_ID}":\\s*\\{[^]*?\\n\\s{0,7}\\},?`, 'g');
                 newContent = newContent.replace(regexRemove, '');
            }
            
            newContent = newContent.replace(/,\s*,/g, ',');

            const insertionPoint = newContent.lastIndexOf('};');
            let before = newContent.substring(0, insertionPoint).trimEnd();
            
            if(before.endsWith(',')) {
                before = before.slice(0, -1);
            }
            
            let playerStr = `,\n      "${FINAL_ID}": {\n`;
            nuevoAnime.temporadas.forEach(t => {
                playerStr += `          "${t.num}": {\n`;
                t.eps.forEach(e => playerStr += `          "${e.num}": { link:'${e.link}', link2:'${e.link2}', title:'${e.playerTitle}' },\n`);
                playerStr += `        },\n`;
            });
            playerStr += `      }`;
            
            return before + playerStr + "\n};";
        });
        // UPDATE MUSIC
        log("5/5 Actualizando Música...");
        await updateGithubFile(token, OWNER, REPO, 'musica-data.js', (content) => {
            let newContent = content;
            
            if(isEditMode) {
                const regexRemove = new RegExp(`\\s*${FINAL_ID}:\\s*\\[[^]*?\\]\\,?`, 'g');
                newContent = newContent.replace(regexRemove, '');
            }

            newContent = newContent.replace(/,\s*,/g, ',');

            const insertionPoint = newContent.lastIndexOf('};');
            let before = newContent.substring(0, insertionPoint).trimEnd();
            
            if(before.endsWith(',')) {
                before = before.slice(0, -1);
            }
            
            const tracks = nuevoAnime.musica.map(m => `"${m}"`).join(',\n            ');
            const musicEntry = `,\n        ${FINAL_ID}: [\n            ${tracks}\n        ]`;
            return before + musicEntry + "\n};";
        });

        log("✨ ¡EXITO! YA PUEDES CERRAR SESIÓN");
        showToast("¡Datos subidos! Cierra sesión para refrescar.", false);
        
        // AVISAR
        alert("✅ Cambios guardados correctamente.\n\nPor favor, presiona el botón de 'CERRAR SESIÓN' y vuelve a entrar para ver los cambios o editar otro anime.");
        highlightLogoutButton();

    } catch (e) {
        console.error(e);
        log(`❌ ERROR: ${e.message}`);
        showToast("Error crítico (ver log)", true);
    }
}