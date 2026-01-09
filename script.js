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

// USUARIOS PERMITIDOS (ACTUALIZADO)
const ALLOWED_USERS = [
    "archinime12@gmail.com", 
    "alejandroarchi12@gmail.com", 
    "lucioguapofeo@gmail.com"
]; [cite: 2]

// CONFIGURACIÓN GITHUB
const OWNER = "Archinime";
const REPO = "-Archinime-";

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); [cite: 3]
let currentUserToken = null;

// VARIABLES DE ESTADO
let isEditMode = false;
let currentEditingId = null;
let cachedIndex = []; [cite: 4]
let searchTimeout = null;
let previewTimeout = null;

// ============================================
// AUTENTICACIÓN
// ============================================
auth.onAuthStateChanged((user) => {
    if (user) checkAccess(user);
    else showLogin();
}); [cite: 5]

function signInWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo'); [cite: 6]
    auth.signInWithPopup(provider)
        .then((result) => {
            currentUserToken = result.credential.accessToken;
            checkAccess(result.user);
        }).catch((error) => {
            console.error(error);
            document.getElementById('errorText').innerText = error.message;
            document.getElementById('loginError').style.display = 'block';
        }); [cite: 7]
} [cite: 8]

function checkAccess(user) {
    const email = user.email;
    const nickname = user.providerData[0]?.displayName || user.reloadUserInfo?.screenName;
    const isAllowed = ALLOWED_USERS.includes(email) || ALLOWED_USERS.includes(nickname); [cite: 9]

    if (isAllowed) {
        showCMS(user); [cite: 10]
    } else {
        document.getElementById('errorText').innerText = "No autorizado.";
        document.getElementById('loginError').style.display = 'block';
        setTimeout(() => auth.signOut(), 3000); [cite: 11]
    }
}

function showCMS(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'flex';
    document.getElementById('cmsContent').style.display = 'grid';
    document.getElementById('userAvatarImg').src = user.photoURL; [cite: 12]
    
    // Lógica para mostrar el nombre según el correo
    let displayName = "Usuario";
    if (user.email === "archinime12@gmail.com") displayName = "Archinime";
    else if (user.email === "alejandroarchi12@gmail.com") displayName = "Alejandro";
    else if (user.email === "lucioguapofeo@gmail.com") displayName = "Lucio";
    
    document.getElementById('userNameDisplay').innerText = displayName; [cite: 12]
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none'; [cite: 13]
}

function logout() {
    auth.signOut();
    location.reload();
} [cite: 14]

// ============================================
// LÓGICA DE INTERFAZ Y FORMULARIO
// ============================================
const genresList = [
    "Acción", "Animación", "Aventura", "Ciencia ficción", "Cocina", "Comedia", "Comedia oscura", "Cosplay", 
    "Cyberpunk", "Deducción Social", "Deportivo", "Drama", "Ecchi", "Escolar", "Fantasía", "Fantasía oscura", 
    "Harem", "Hentai", "Horror", "Incesto", "Isekai", "Isekai Inverso", "Kaiju", "Mecha", "Militar", 
    "Misterio", "Musical", "Nekketsu", "Psicológico", "Romance", "Seinen", "Shōnen", "Shōjo", 
    "Slice of Life", "Sobrenatural", "Superhéroes", "Suspenso", "Terror", "Yuri", "Yaoi"
];

const gContainer = document.getElementById('genresContainer'); [cite: 15]
genresList.forEach(g => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${g}" onchange="requestPreviewUpdate()"> ${g}`;
    gContainer.appendChild(label);
});

function showToast(msg, isError = false) { [cite: 16]
    const x = document.getElementById("toast");
    x.innerHTML = isError ?
    `<i class="fas fa-times-circle" style="color:#ff4757"></i> ${msg}` : `<i class="fas fa-check-circle" style="color:var(--accent)"></i> ${msg}`; [cite: 17]
    x.className = "show";
    x.style.borderColor = isError ? "#ff4757" : "var(--accent)"; [cite: 18]
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
} [cite: 19]

function autoCap(input) {
    if(input.value) input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
} [cite: 20]

function validate(input) {
    if(!input.value.trim()) input.style.borderColor = '#ff4757';
    else input.style.borderColor = '#2a2b35';
} [cite: 21]

function log(msg) {
    const el = document.getElementById('statusLog');
    el.style.display = 'block';
    el.innerHTML += `> ${msg}<br>`;
    el.scrollTop = el.scrollHeight;
} [cite: 22]

// CONVERSOR DE LINKS (DROPBOX / DRIVE)
function smartLinkConvert(input) {
    let val = input.value.trim();
    let changed = false;
    if (val.includes('dropbox.com') && val.endsWith('&dl=0')) { [cite: 23]
        input.value = val.replace('&dl=0', '&raw=1');
        changed = true;
        showToast("Link Dropbox convertido a &raw=1"); [cite: 24]
    }
    const driveRegex = /(https:\/\/drive\.google\.com\/file\/d\/[^\/]+)\/(?:view|preview)(?:\?.*)?/;
    if (driveRegex.test(val) && !val.endsWith('/preview')) { [cite: 25]
        const match = val.match(driveRegex);
        if (match && match[1]) { [cite: 26]
            input.value = match[1] + '/preview';
            changed = true; [cite: 27]
            showToast("Link Drive convertido a /preview");
        }
    }

    if(changed && input.id === 'portadaAnime') {
        checkCoverVisual(input);
        requestPreviewUpdate(); [cite: 28]
    }
}

function checkCoverVisual(input) {
    const img = document.getElementById('mainCoverPreview');
    const display = document.getElementById('dimDisplay');
    const val = input.value.trim();
    if(val === "") { [cite: 29]
        img.style.display = 'none';
        display.innerText = "";
        requestPreviewUpdate();
        return;
    } [cite: 30]
    img.src = val;
    img.style.display = 'block';
    display.innerText = "Verificando...";
    img.onload = function() { [cite: 31]
        const w = this.naturalWidth;
        const h = this.naturalHeight;
        const allowed = [{w: 1000, h: 1500}, {w: 2000, h: 3000}, {w: 3412, h: 5120}]; [cite: 32]
        const isValid = allowed.some(d => d.w === w && d.h === h); [cite: 33]
        if (isValid) { [cite: 34]
            display.innerHTML = `<span style="color:#00ffbf"><i class="fas fa-check"></i> Válido: ${w}x${h}px</span>`;
            input.style.borderColor = '#00ffbf'; [cite: 35]
            requestPreviewUpdate(); 
        } else {
            display.innerHTML = `<span style="color:#ff4757"><i class="fas fa-times"></i> Inválido: ${w}x${h}px.</span>`;
            input.style.borderColor = '#ff4757'; [cite: 36]
        }
    };
    img.onerror = function() { 
        display.innerText = "URL inválida";
        img.style.display='none'; [cite: 37]
        input.style.borderColor = '#ff4757';
    };
}

function addAlias(value = "") {
    const container = document.getElementById('aliasContainer');
    const div = document.createElement('div'); [cite: 38]
    div.className = 'dynamic-item';
    div.innerHTML = `
        <input type="text" class="alias-input" placeholder="Alias..." value="${value}" oninput="requestPreviewUpdate()">
        <button class="btn-mini-del" onclick="this.parentElement.remove(); requestPreviewUpdate()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(div); [cite: 39]
}

// AUDIO PLAYER
function addMusic(url = "") {
    const container = document.getElementById('musicContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-item'; [cite: 40]
    div.innerHTML = `
        <div class="audio-preview-box">
            <input type="text" class="m-url" value="${url}" placeholder="Audio (mp3...)" oninput="updateAudioPreview(this)" onblur="smartLinkConvert(this)">
            <audio controls preload="none"></audio>
            <div class="audio-status-text"></div>
        </div>
        <button class="btn-mini-del" onclick="this.parentElement.remove()" style="height:auto; aspect-ratio:1/1"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(div); [cite: 41]
    if(url) updateAudioPreview(div.querySelector('.m-url'));
}

function updateAudioPreview(input) {
    const parent = input.parentElement;
    const audioEl = parent.querySelector('audio');
    const statusEl = parent.querySelector('.audio-status-text'); [cite: 42]
    
    if (!input.value.trim()) {
        statusEl.innerHTML = '';
        return;
    } [cite: 43]
    statusEl.innerHTML = '<span style="color:#facc15"><i class="fas fa-circle-notch fa-spin"></i> Cargando...</span>';
    audioEl.src = input.value;
    audioEl.load();
    audioEl.onloadeddata = () => { statusEl.innerHTML = '<span style="color:#00ffbf"><i class="fas fa-check"></i> Válido</span>'; }; [cite: 44]
    audioEl.onerror = () => { statusEl.innerHTML = '<span style="color:#ff4757"><i class="fas fa-triangle-exclamation"></i> Error</span>'; }; [cite: 45]
} [cite: 46]

// SEASONS & CHAPTERS - PALETA DE COLORES
const colorPalette = [
    '#00f0ff', '#8c52ff', '#ff0055', '#00ff9d', '#ffeb3b', '#ff9100', '#2979ff', '#e040fb'
];

function addSeason(data = null) { [cite: 47]
    const container = document.getElementById('seasonsContainer');
    const div = document.createElement('div');
    div.className = 'season-card';
    const count = document.querySelectorAll('.season-card').length; [cite: 48]
    const color = colorPalette[count % colorPalette.length];
    div.style.cssText = `
        border-left: 4px solid ${color}; [cite: 49]
        background: linear-gradient(120deg, ${color}11 0%, rgba(19, 20, 25, 0.9) 35%); [cite: 50]
    `;
    div.innerHTML = ` [cite: 51]
        <button class="btn-del-section" onclick="removeSeasonBlock(this)"><i class="fas fa-trash"></i> ELIMINAR</button>
        <div class="row-flex">
            <div class="col-flex">
                <label>Tipo</label>
                <select class="s-type" onchange="handleSeasonTypeChange(this)">
                    <option value="" disabled ${!data ? 'selected' : ''}>Seleccionar...</option> [cite: 52]
                    <option value="Temporada">Temporada</option>
                    <option value="Pelicula">Película</option>
                    <option value="OVA">OVA</option>
                    <option value="Especial">Especial</option>
                    <option value="Spin-Off">Spin-Off</option> [cite: 53]
                </select>
            </div>
            <div class="col-flex">
                 <label>Nombre Bloque</label>
                 <input type="text" class="s-name" placeholder="Auto" disabled oninput="requestPreviewUpdate()">
            </div> [cite: 54]
        </div>
        <label>Poster Bloque</label>
        <input type="text" class="s-img" placeholder="https://..." oninput="requestPreviewUpdate()" onblur="smartLinkConvert(this)">
        <label>Cant. Capítulos</label> [cite: 55]
        <input type="number" class="s-count" min="1" onchange="renderChapters(this)">
        <div class="chapters-grid" style="margin-top:20px;"></div>
    `;
    container.appendChild(div); [cite: 56]

    if(data) {
        let selectedType = 'Spin-Off';
        if(data.name.startsWith('Temporada')) selectedType = 'Temporada';
        else if(data.name.startsWith('Película')) selectedType = 'Pelicula'; [cite: 57]
        else if(data.name.startsWith('OVA')) selectedType = 'OVA';
        else if(data.name.startsWith('Especial')) selectedType = 'Especial';
        
        const typeSel = div.querySelector('.s-type');
        typeSel.value = selectedType; [cite: 58]
        const nameInp = div.querySelector('.s-name');
        nameInp.value = data.name;
        div.querySelector('.s-img').value = data.cover;
        
        handleSeasonTypeChange(typeSel);
        
        const countInp = div.querySelector('.s-count');
        countInp.value = data.eps.length; [cite: 59]
        renderChapters(countInp, data.eps);
    }
}

function removeSeasonBlock(btn) {
    btn.closest('.season-card').remove();
    updateAllBlockNames();
    requestPreviewUpdate();
    document.querySelectorAll('.season-card').forEach((card, idx) => { [cite: 60]
        const color = colorPalette[idx % colorPalette.length];
        card.style.borderLeftColor = color;
        card.style.background = `linear-gradient(120deg, ${color}11 0%, rgba(19, 20, 25, 0.9) 35%)`;
    });
} [cite: 61]

function updateAllBlockNames() {
    const cards = document.querySelectorAll('.season-card');
    let tempCount = 0, movieCount = 0, ovaCount = 0, specialCount = 0, spinOffCount = 0; [cite: 62]
    cards.forEach(card => { [cite: 63]
        const typeSelect = card.querySelector('.s-type');
        const nameInput = card.querySelector('.s-name');
        const type = typeSelect.value;
        if (!type) return;

        nameInput.disabled = (type !== 'Spin-Off');

        if(!isEditMode) { 
             if (type === 'Temporada') {
                tempCount++; [cite: 64]
                nameInput.value = `Temporada ${tempCount}`;
            } else if (type === 'Spin-Off') {
                spinOffCount++;
                if (!nameInput.value) nameInput.value = `Spin-Off ${spinOffCount}`; 
            } else if (type === 'Pelicula') {
                 movieCount++; [cite: 65]
                nameInput.value = `Película ${movieCount}`;
            } else if (type === 'OVA') {
                ovaCount++;
                nameInput.value = `OVA ${ovaCount}`;
            } else if (type === 'Especial') {
                specialCount++; [cite: 66]
                nameInput.value = `Especial ${specialCount}`;
            }
        }
    });
} [cite: 67]

function handleSeasonTypeChange(select) {
    const card = select.closest('.season-card');
    const countInput = card.querySelector('.s-count');
    const type = select.value;
    if (['Pelicula', 'OVA', 'Especial'].includes(type)) { [cite: 68]
        countInput.value = 1;
        countInput.disabled = true;
    } else { [cite: 69]
        countInput.disabled = false;
    }
    if(!select.dataset.loading) updateAllBlockNames();
    if(countInput.value) renderChapters(countInput); [cite: 70]
    requestPreviewUpdate();
}

function renderChapters(input, existingEps = []) {
    const card = input.closest('.season-card');
    const typeSelect = card.querySelector('.s-type');
    const type = typeSelect ? typeSelect.value : ""; [cite: 71]
    const count = parseInt(input.value);
    const list = card.querySelector('.chapters-grid');
    let currentData = []; [cite: 72]
    if(existingEps.length === 0) { [cite: 73]
        card.querySelectorAll('.chapter-row').forEach(row => {
            currentData.push({
                lat: row.querySelector('.c-link-lat').value,
                sub: row.querySelector('.c-link-sub').value,
                title: row.querySelector('.c-title-ov').value
            });
        });
    } [cite: 74]

    list.innerHTML = '';
    if(isNaN(count) || count < 1) return;
    for(let i=0; i<count; i++) { [cite: 75]
        const row = document.createElement('div');
        row.className = 'chapter-row';
        let sub = '', lat = '', customTitle = ''; [cite: 76]
        if(existingEps[i]) { [cite: 77]
             lat = existingEps[i].link || ''; [cite: 78]
             sub = existingEps[i].link2 || ''; 
             if(!['Temporada', 'Spin-Off'].includes(type)) customTitle = existingEps[i].title;
        } else if(currentData[i]) { [cite: 79]
             lat = currentData[i].lat;
             sub = currentData[i].sub; [cite: 80]
             customTitle = currentData[i].title;
        }

        let titleInputDisabled = ['Temporada', 'Spin-Off'].includes(type) ? "disabled" : ""; [cite: 81]
        let titlePlaceholder = titleInputDisabled ? `Capítulo ${i+1}` : "Nombre (ej: El viaje...)";
        if(titleInputDisabled) customTitle = `Capítulo ${i+1}`;
        row.innerHTML = ` [cite: 82]
            <div class="chapter-header"><span class="chapter-num">CAPÍTULO ${i+1}</span></div>
            <div class="c-inputs-grid">
                <input type="text" class="c-link-lat" value="${lat}" placeholder="🔗 Lat" onblur="smartLinkConvert(this)">
                <input type="text" class="c-link-sub" value="${sub}" placeholder="🔗 Sub" onblur="smartLinkConvert(this)">
            </div>
            <input type="text" class="c-title-ov" value="${customTitle}" ${titleInputDisabled} placeholder="${titlePlaceholder}" style="margin-top:10px; font-size:0.9em; border-color:#333; background:#111;"> [cite: 83]
        `;
        list.appendChild(row);
    } [cite: 84]
}

// THROTTLE PARA VISTA PREVIA (ANTI-LAG)
function requestPreviewUpdate() {
    if (!previewTimeout) {
        previewTimeout = requestAnimationFrame(() => {
            updateWebPreview();
            previewTimeout = null;
        });
    } [cite: 85]
}

function updateWebPreview() {
    const title = document.getElementById('tituloAnime').value;
    document.getElementById('webTitle').innerText = title || 'Título';
    const coverUrl = document.getElementById('portadaAnime').value;
    if(coverUrl) document.getElementById('webCover').src = coverUrl; [cite: 86]
    document.getElementById('previewId').innerText = isEditMode ? currentEditingId : "###";

    const demo = document.getElementById('demografiaAnime').value;
    document.getElementById('webDemography').innerText = demo ? demo.toUpperCase() : 'DEMO'; [cite: 87]
    
    const aliases = [];
    document.querySelectorAll('.alias-input').forEach(i => { if(i.value.trim()) aliases.push(i.value.trim()) });
    const aliasStr = aliases.length > 0 ? aliases.join(', ') : ""; [cite: 88]
    document.getElementById('previewAliasesList').innerText = aliasStr;

    const ratingInputVal = document.getElementById('ratingAnime').value; [cite: 89]
    const ratingTxt = ratingInputVal ? parseFloat(ratingInputVal).toFixed(1) : "--";
    document.getElementById('webRating').innerText = `⭐ ${ratingTxt}`; [cite: 90]
    
    const tagsContainer = document.getElementById('webTags');
    tagsContainer.innerHTML = '';
    document.querySelectorAll('#genresContainer input:checked').forEach(cb => { [cite: 91]
        let s = document.createElement('span');
        s.style.cssText = "font-size:0.65em; padding:3px 8px; border-radius:4px; background:rgba(255,255,255,0.1); color:#ccc;";
        s.innerText = cb.value;
        tagsContainer.appendChild(s);
    });
    const grid = document.getElementById('webSeasonsGrid'); [cite: 92]
    grid.innerHTML = '';
    document.querySelectorAll('.season-card').forEach(card => {
        const img = card.querySelector('.s-img').value;
        const name = card.querySelector('.s-name').value;
        const type = card.querySelector('.s-type').value;
        const count = card.querySelector('.s-count').value || 0;

        if(name) {
            const div = document.createElement('div');
            div.className = 'preview-s-item';
             let label = (['Temporada', 'Spin-Off'].includes(type)) ? `${count} Caps` : (count > 1 ? `${count} ${type}s` : `${count} ${type}`); [cite: 93]
            div.innerHTML = `<img src="${img || 'https://via.placeholder.com/150'}"><div class="preview-s-count">${label}</div><div class="preview-s-title">${name}</div>`;
            grid.appendChild(div);
        }
    });
} [cite: 94]

// ============================================
// API GITHUB Y PARSEO SEGURO
// ============================================
async function getGithubFile(token, owner, repo, path) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, { [cite: 95]
        headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!response.ok) throw new Error(`Error leyendo ${path}`); [cite: 96]
    const data = await response.json();
    return { [cite: 97]
        sha: data.sha, 
        content: new TextDecoder().decode(Uint8Array.from(atob(data.content), c => c.charCodeAt(0))) 
    };
} [cite: 98]

function safeEval(fileContent) {
    try {
        const eqIndex = fileContent.indexOf('=');
        if (eqIndex === -1) throw new Error("No se encontró asignación de variable"); [cite: 99]
        let dataStr = fileContent.substring(eqIndex + 1).trim();
        if (dataStr.endsWith(';')) dataStr = dataStr.slice(0, -1); [cite: 100]
        return eval('(' + dataStr + ')');
    } catch (e) { [cite: 101]
        console.error("Error parseando JS:", e);
        throw new Error("El archivo tiene un formato inválido o complejo."); [cite: 102]
    }
} [cite: 103]

async function updateGithubFile(token, owner, repo, path, contentTransformer) {
    const fileData = await getGithubFile(token, owner, repo, path);
    const newContent = contentTransformer(fileData.content); [cite: 104]
    const encodedContent = btoa(new TextEncoder().encode(newContent).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { [cite: 105]
        method: 'PUT',
        headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: `Update ${path} via CMS (${isEditMode ? 'Edit' : 'New'})`,
            content: encodedContent,
            sha: fileData.sha
        })
    });
    if (!response.ok) throw new Error(`Error subiendo ${path}`); [cite: 106]
}

// ============================================
// CARGA Y EDICIÓN (OPTIMIZADA)
// ============================================
function openSearchModal() {
    document.getElementById('searchModal').style.display = 'flex';
    document.getElementById('searchInput').value = ""; [cite: 107]
    document.getElementById('searchResults').innerHTML = "";
    if(cachedIndex.length === 0) loadIndexForSearch();
    else filterSearch();
} [cite: 108]

function handleModalClick(event) {
    if (event.target.id === 'searchModal') {
        closeSearchModal();
    } [cite: 109]
}

function closeSearchModal() { 
    document.getElementById('searchModal').style.display = 'none';
} [cite: 110]

async function loadIndexForSearch() {
    const loading = document.getElementById('loadingSearch');
    loading.style.display = 'block';
    try { [cite: 111]
        if(!currentUserToken) throw new Error("No hay sesión");
        const file = await getGithubFile(currentUserToken, OWNER, REPO, 'index-data.js'); [cite: 112]
        const data = safeEval(file.content);
        cachedIndex = data.reverse(); 
        filterSearch();
    } catch(e) { [cite: 113]
        document.getElementById('searchResults').innerHTML = `<div style="color:red; text-align:center">Error: ${e.message}</div>`;
    } finally { [cite: 114]
        loading.style.display = 'none';
    }
}

function filterSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { _performFilter(); }, 300); [cite: 115]
}

function _performFilter() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults'); [cite: 116]
    results.innerHTML = '';
    const filtered = cachedIndex.filter(a => a.title.toLowerCase().includes(query)).slice(0, 50);
    filtered.forEach(anime => { [cite: 117]
        const div = document.createElement('div');
        div.className = 's-result-item';
        div.onclick = () => loadAnimeForEditing(anime.id);
        div.innerHTML = `
            <img src="${anime.img}" class="s-result-img" onerror="this.src='https://via.placeholder.com/50'">
            <div>
                <div style="font-weight:bold; color:#fff;">${anime.title}</div>
                <div style="color:#777; font-size:0.8em">ID: ${anime.id} | ⭐ ${anime.rating}</div> [cite: 118]
            </div>
        `;
        results.appendChild(div);
    });
    if(filtered.length === 0) results.innerHTML = '<div style="padding:10px; color:#777; text-align:center">Sin resultados</div>'; [cite: 119]
} [cite: 120]

async function loadAnimeForEditing(id) {
    if(!confirm("¿Cargar anime? Se perderán los datos actuales del formulario.")) return;
    closeSearchModal();
    showToast("Descargando datos...", false); [cite: 121]
    
    try {
        const [detailFile, playerFile, musicFile] = await Promise.all([
            getGithubFile(currentUserToken, OWNER, REPO, 'anime-detail-data.js'),
            getGithubFile(currentUserToken, OWNER, REPO, 'video-player-data.js'),
            getGithubFile(currentUserToken, OWNER, REPO, 'musica-data.js')
        ]);
        const detObj = safeEval(detailFile.content); [cite: 122]
        const playObj = safeEval(playerFile.content);
        const musObj = safeEval(musicFile.content);

        const targetDetail = detObj[id];
        const targetPlayer = playObj[id] || {}; [cite: 123]
        const targetMusic = musObj[id] || [];

        if(!targetDetail) throw new Error("Anime no encontrado en Details");
        isEditMode = true; [cite: 124]
        currentEditingId = id;
        document.getElementById('editModeBar').style.display = 'block';
        document.getElementById('editIdDisplay').innerText = id;
        document.getElementById('btnActionText').innerText = "GUARDAR CAMBIOS (EDITAR)";

        document.getElementById('tituloAnime').value = targetDetail.title;
        document.getElementById('portadaAnime').value = targetDetail.cover; [cite: 125]
        document.getElementById('sinopsisAnime').value = targetDetail.desc;
        
        const indexEntry = cachedIndex.find(x => x.id === id);
        document.getElementById('aliasContainer').innerHTML = '';
        if(indexEntry && indexEntry.aliases) indexEntry.aliases.forEach(a => addAlias(a)); [cite: 126]

        if(indexEntry && indexEntry.genres && indexEntry.genres.length > 0) {
            let loadedGenres = [...indexEntry.genres];
            const lastGenre = loadedGenres[loadedGenres.length - 1]; [cite: 127]
            const demoOptions = ["Shōnen", "Seinen", "Shōjo", "Josei", "Kodomo", "Seijin"];
            if (demoOptions.includes(lastGenre)) { [cite: 128]
                document.getElementById('demografiaAnime').value = lastGenre;
                loadedGenres.pop(); [cite: 129]
            }

            document.querySelectorAll('#genresContainer input').forEach(cb => {
                cb.checked = loadedGenres.includes(cb.value);
            });
        } [cite: 130]
        
        if(indexEntry && indexEntry.rating) {
            document.getElementById('ratingAnime').value = indexEntry.rating;
        } else { [cite: 131]
            document.getElementById('ratingAnime').value = "";
        } [cite: 132]
        
        document.getElementById('seasonsContainer').innerHTML = '';
        targetDetail.seasons.forEach(s => { [cite: 133]
            const seasonPlayer = targetPlayer[s.num] || {}; 
            const fullEps = s.eps.map((e, idx) => {
                const epNum = idx + 1;
                const links = seasonPlayer[epNum] || {};
                return { title: e.title, link: links.link, link2: links.link2 }; [cite: 134]
            });
            addSeason({ name: s.name || `Temporada ${s.num}`, cover: s.cover, eps: fullEps });
        });
        document.getElementById('musicContainer').innerHTML = ''; [cite: 135]
        targetMusic.forEach(url => addMusic(url));

        checkCoverVisual(document.getElementById('portadaAnime'));
        requestPreviewUpdate();
        showToast("¡Datos cargados correctamente!");
    } catch(e) { [cite: 136]
        console.error(e);
        showToast("Error cargando: " + e.message, true);
        exitEditMode();
    } [cite: 137]
}

function exitEditMode() {
    isEditMode = false;
    currentEditingId = null;
    document.getElementById('editModeBar').style.display = 'none';
    document.getElementById('btnActionText').innerText = "COMPILAR Y SUBIR";
    location.reload(); [cite: 138]
}

// ============================================
// GENERACIÓN Y SUBIDA
// ============================================
function generateData() {
    const selectedGenres = [];
    document.querySelectorAll('#genresContainer input:checked').forEach(cb => selectedGenres.push(cb.value));
    const demoSelect = document.getElementById('demografiaAnime').value; [cite: 139]
    
    const ratingInput = document.getElementById('ratingAnime');
    let ratingVal = parseFloat(ratingInput.value); [cite: 140]
    if(isNaN(ratingVal)) ratingVal = 0;

    const aliasList = [];
    document.querySelectorAll('.alias-input').forEach(i => { if(i.value.trim()) aliasList.push(i.value.trim()) }); [cite: 141]

    const anime = {
        id: isEditMode ? currentEditingId : 0, [cite: 142]
        titulo: document.getElementById('tituloAnime').value.trim(),
        aliases: aliasList,
        portada: document.getElementById('portadaAnime').value.trim(),
        sinopsis: document.getElementById('sinopsisAnime').value.trim(),
        demografia: demoSelect, 
        generos: selectedGenres,
        rating: ratingVal,
        musica: [],
        temporadas: []
    };
    document.querySelectorAll('#musicContainer .m-url').forEach(i => { if(i.value) anime.musica.push(i.value.trim()); }); [cite: 143]

    let globalOrder = 1, seasonCountVP = 0, ovaCountVP = 0, movieCountVP = 0, specialCountVP = 0, spinOffCount = 0;
    document.querySelectorAll('.season-card').forEach(card => { [cite: 144]
        const eps = [];
        const sName = card.querySelector('.s-name').value;
        const sType = card.querySelector('.s-type').value;
        
        if(sType === 'Temporada') seasonCountVP++;
        if(sType === 'OVA') ovaCountVP++;
        if(sType === 'Pelicula') movieCountVP++;
        if(sType === 'Especial') specialCountVP++;

        card.querySelectorAll('.chapter-row').forEach((row, idx) => {
            const lat = row.querySelector('.c-link-lat').value.trim(); [cite: 145]
            const sub = row.querySelector('.c-link-sub').value.trim();
            let customTitleInput = row.querySelector('.c-title-ov').value.trim();
            let playerTitle = "", detailTitle = ""; [cite: 146]

            if (sType === 'Temporada') {
                detailTitle = `Capítulo ${idx+1}`;
                playerTitle = `${anime.titulo} T${seasonCountVP} Cap ${idx+1}`; [cite: 147]
            } else if (sType === 'Spin-Off') {
                detailTitle = `Capítulo ${idx+1}`;
                playerTitle = `${anime.titulo} ${sName} Cap ${idx+1}`; [cite: 148]
            } else if (sType === 'OVA') {
                detailTitle = customTitleInput || sName; [cite: 149]
                playerTitle = `${anime.titulo} OVA ${ovaCountVP}` + (customTitleInput ? ` "${customTitleInput}"` : "");
            } else if (sType === 'Pelicula') { [cite: 150]
                detailTitle = customTitleInput || sName; [cite: 151]
                playerTitle = `${anime.titulo} Película ${movieCountVP}` + (customTitleInput ? `: ${customTitleInput}` : "");
            } else if (sType === 'Especial') { [cite: 152]
                detailTitle = customTitleInput || sName; [cite: 153]
                playerTitle = `${anime.titulo} Especial ${specialCountVP}` + (customTitleInput ? `: ${customTitleInput}` : "");
            } [cite: 154]

            if(sub || lat) {
                eps.push({ num: idx + 1, link: lat, link2: sub, title: detailTitle, playerTitle: playerTitle }); [cite: 155]
            }
        });
        if(eps.length > 0) { [cite: 156]
            anime.temporadas.push({
                num: globalOrder++,
                name: sName,
                type: sType,
                cover: card.querySelector('.s-img').value,
                eps: eps [cite: 157]
            });
        }
    });

    return anime;
} [cite: 158]

async function subirAGithHub() {
    const token = currentUserToken;
    if(!token) return showToast("Error de sesión", true);
    const nuevoAnime = generateData(); [cite: 159]
    
    if(!nuevoAnime.titulo) return showToast("Falta Título", true);
    if(!nuevoAnime.portada) return showToast("Falta Portada", true);
    if(!nuevoAnime.sinopsis) return showToast("Falta Sinopsis", true);
    if(!nuevoAnime.demografia) return showToast("Elige Demografía", true); [cite: 160]
    
    if(!nuevoAnime.rating || isNaN(nuevoAnime.rating) || nuevoAnime.rating < 1 || nuevoAnime.rating > 5) {
        return showToast("Valoración inválida (Debe ser entre 1.0 y 5.0)", true);
    } [cite: 161]
    
    if(nuevoAnime.generos.length === 0) return showToast("Elige Géneros", true);
    if(nuevoAnime.temporadas.length === 0) return showToast("Agrega contenido", true); [cite: 162]

    document.getElementById('statusLog').innerHTML = "🚀 Iniciando...<br>";
    try { [cite: 163]
        let FINAL_ID = nuevoAnime.id;
        if (!isEditMode) { [cite: 164]
            log("1/5 Calculando ID...");
            const indexFile = await getGithubFile(token, OWNER, REPO, 'index-data.js'); [cite: 165]
            const indexData = safeEval(indexFile.content);
            let maxId = 0;
            indexData.forEach(item => { if(item.id > maxId) maxId = item.id; }); [cite: 166]
            FINAL_ID = maxId + 1;
            log(`✅ ID: ${FINAL_ID}`);
        } else { [cite: 167]
            log(`📝 Editando ID: ${FINAL_ID}`);
        } [cite: 168]

        // UPDATE INDEX
        log("2/5 Actualizando Index...");
        await updateGithubFile(token, OWNER, REPO, 'index-data.js', (content) => { [cite: 169]
            let newContent = content;
            if(isEditMode) {
                const regexRemove = new RegExp(`\\s*\\{id:${FINAL_ID},[^]*?genres:\\[[^]*?\\]\\},?`, 'g');
                newContent = newContent.replace(regexRemove, '');
            }
            
            newContent = newContent.replace(/,\s*,/g, ','); [cite: 170]

            const insertionPoint = newContent.lastIndexOf('];');
            let before = newContent.substring(0, insertionPoint).trim();
            
            if(before.endsWith(',')) { [cite: 171]
                before = before.slice(0, -1);
            }
            
            let finalGenres = [...nuevoAnime.generos];
            if(nuevoAnime.demografia) {
                finalGenres = finalGenres.filter(g => g !== nuevoAnime.demografia); [cite: 172]
                finalGenres.push(nuevoAnime.demografia);
            } [cite: 173]
            const generosStr = finalGenres.map(g => `"${g}"`).join(',');
            const aliasesStr = nuevoAnime.aliases.length > 0 ? `, aliases: [${nuevoAnime.aliases.map(a => `"${a}"`).join(',')}]` : ''; [cite: 174]
            const newEntry = `,\n      {id:${FINAL_ID}, title:"${nuevoAnime.titulo}"${aliasesStr}, img:"${nuevoAnime.portada}", rating:${nuevoAnime.rating}, genres:[${generosStr}]}`; [cite: 175]
            return before + newEntry + "\n];";
        }); [cite: 176]
        
        // UPDATE DETAILS
        log("3/5 Actualizando Detalles...");
        await updateGithubFile(token, OWNER, REPO, 'anime-detail-data.js', (content) => { [cite: 177]
            let newContent = content;
            if(isEditMode) {
                 const regexRemove = new RegExp(`\\s*${FINAL_ID}:\\s*\\{[^]*?seasons:\\[[^]*?\\]\\s*\\},?`, 'g');
                 newContent = newContent.replace(regexRemove, '');
            }
           
            const insertionPoint = newContent.lastIndexOf('};'); [cite: 178]
            const before = newContent.substring(0, insertionPoint).trimEnd();

            let seasonsStr = "";
            nuevoAnime.temporadas.forEach(t => {
                let epsStr = "";
                t.eps.forEach(e => epsStr += ` { title: "${e.title}"},\n`); [cite: 179]
                let nameField = t.name ? `\n            name: "${t.name}",` : "";
                seasonsStr += `          {
            num: ${t.num},${nameField}
            cover: "${t.cover}", [cite: 180]
            eps: [\n${epsStr}            ]
          },\n`;
            });
            const newDetail = `,\n    ${FINAL_ID}: {
        title: "${nuevoAnime.titulo}",
        desc: "${nuevoAnime.sinopsis.replace(/"/g, '\\"')}",
        cover: "${nuevoAnime.portada}",
        seasons: [\n${seasonsStr}          ] [cite: 181]
    }`;
            return before + newDetail + "\n};";
        }); [cite: 182]

        // UPDATE PLAYER
        log("4/5 Actualizando Player...");
        await updateGithubFile(token, OWNER, REPO, 'video-player-data.js', (content) => { [cite: 183]
            let newContent = content;
            if(isEditMode) {
                 const regexRemove = new RegExp(`\\s*"${FINAL_ID}":\\s*\\{[^]*?\\n\\s{0,7}\\},?`, 'g');
                 newContent = newContent.replace(regexRemove, '');
            } [cite: 184]
            
            newContent = newContent.replace(/,\s*,/g, ',');
            const insertionPoint = newContent.lastIndexOf('};');
            let before = newContent.substring(0, insertionPoint).trimEnd(); [cite: 185]
     
            if(before.endsWith(',')) {
                before = before.slice(0, -1);
            }
            
            let playerStr = `,\n      "${FINAL_ID}": {\n`; [cite: 186]
            nuevoAnime.temporadas.forEach(t => {
                playerStr += `          "${t.num}": {\n`;
                t.eps.forEach(e => playerStr += `          "${e.num}": { link:'${e.link}', link2:'${e.link2}', title:'${e.playerTitle}' },\n`); [cite: 187]
                playerStr += `        },\n`; [cite: 188]
            });
            playerStr += `      }`; [cite: 189]
            
            return before + playerStr + "\n};";
        }); [cite: 190]

        // UPDATE MUSIC
        log("5/5 Actualizando Música...");
        await updateGithubFile(token, OWNER, REPO, 'musica-data.js', (content) => { [cite: 191]
            let newContent = content;
            if(isEditMode) {
                const regexRemove = new RegExp(`\\s*${FINAL_ID}:\\s*\\[[^]*?\\]\\,?`, 'g');
                newContent = newContent.replace(regexRemove, ''); [cite: 192]
            }

            newContent = newContent.replace(/,\s*,/g, ',');
            const insertionPoint = newContent.lastIndexOf('};');
            let before = newContent.substring(0, insertionPoint).trimEnd(); [cite: 193]
            
            if(before.endsWith(',')) {
                before = before.slice(0, -1);
            }
            
            const tracks = nuevoAnime.musica.map(m => `"${m}"`).join(',\n            '); [cite: 194]
            const musicEntry = `,\n        ${FINAL_ID}: [\n            ${tracks}\n        ]`;
            return before + musicEntry + "\n};";
        }); [cite: 195]

        log("✨ ¡EXITO!");
        showToast("¡Proceso Completado!");
        setTimeout(() => location.reload(), 3000);
    } catch (e) { [cite: 196]
        console.error(e);
        log(`❌ ERROR: ${e.message}`);
        showToast("Error crítico (ver log)", true);
    } [cite: 197]
}