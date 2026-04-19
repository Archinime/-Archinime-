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

const ALLOWED_USERS = [
    "archinime12@gmail.com", 
    "alejandroarchi12@gmail.com",
    "lucioguapofeo@gmail.com",
];

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

let globalUsersData = {};
let isEditMode = false;
let currentEditingId = null;
let cachedCatalog = [];
let searchTimeout = null;
let previewTimeout = null;
let originalAnimeState = null;

// Variables de usuario
let currentUserNick = "Usuario"; 
let currentUserAvatar = "Logo_Archinime.avif";
let currentUserEmail = "";
let currentSearchMode = 'mine';

// ============================================
// AUTENTICACIÓN (integrada con ArchinimeState)
// ============================================

function getCurrentUser() {
    if (window.ArchinimeState) return ArchinimeState.get('currentUser');
    return auth.currentUser;
}

function syncUserFromState(user) {
    if (user) {
        currentUserEmail = user.email;
        if (globalUsersData[currentUserEmail]) {
            currentUserNick = globalUsersData[currentUserEmail].nick;
            currentUserAvatar = globalUsersData[currentUserEmail].avatar;
        } else if (user.email === "archinime12@gmail.com") {
            currentUserNick = "Archinime";
            currentUserAvatar = "Logo_Archinime.avif";
        } else {
            currentUserNick = user.displayName || user.email.split('@')[0];
            currentUserAvatar = user.photoURL || "Logo_Archinime.avif";
        }
    } else {
        currentUserEmail = "";
        currentUserNick = "Usuario";
        currentUserAvatar = "Logo_Archinime.avif";
    }
}

if (window.ArchinimeState) {
    ArchinimeState.on('currentUser', async (user) => {
        if (user) {
            await checkAccess(user);
        } else {
            showLogin();
        }
    });
} else {
    auth.onAuthStateChanged((user) => {
        if (user) {
            checkAccess(user);
        } else {
            showLogin();
        }
    });
}

function signInWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => auth.signInWithPopup(provider))
        .then((result) => checkAccess(result.user))
        .catch((error) => {
            console.error(error);
            const errEl = document.getElementById('errorText');
            if(errEl) errEl.innerText = error.message;
            const logErr = document.getElementById('loginError');
            if(logErr) logErr.style.display = 'block';
        });
}

async function checkAccess(user) {
    const email = user.email;
    currentUserEmail = email;
    const errText = document.getElementById('errorText');
    if(errText) errText.innerText = "Verificando base de datos...";
    const logErr = document.getElementById('loginError');
    if(logErr) logErr.style.display = 'none';
    
    try {
        const usersSnapshot = await db.collection('users').get();
        globalUsersData = {};
        usersSnapshot.forEach(doc => {
            globalUsersData[doc.id] = doc.data();
        });
    } catch (e) {
        console.warn("No se pudo cargar la DB de usuarios.");
        globalUsersData = {}; 
    }

    if (email === "archinime12@gmail.com") {
        currentUserNick = "Archinime";
        currentUserAvatar = "Logo_Archinime.avif";
        showCMS();
        return;
    }

    try {
        if (globalUsersData[email]) {
            const userData = globalUsersData[email];
            currentUserNick = userData.nick;
            currentUserAvatar = userData.avatar;
            showCMS();
        } else {
            showProfileSetup();
        }
    } catch (e) {
        console.error("Error acceso:", e);
        if(errText) errText.innerText = "Acceso Denegado: No formas parte de los aportadores.";
        if(logErr) logErr.style.display = 'block';
    }
}

function showProfileSetup() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none';
    document.getElementById('profileSetupModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = "Bienvenido/a";
    document.getElementById('modalDesc').innerText = "Es tu primera vez aquí. Configura tu cuenta para continuar.";
    document.getElementById('btnSaveProfile').innerText = 'GUARDAR PERFIL';
    const btnCancel = document.getElementById('btnCancelProfile');
    if(btnCancel) btnCancel.style.display = 'none';
    
    const user = getCurrentUser();
    if(user) {
        document.getElementById('setupNick').value = "";
        if(user.photoURL) {
            document.getElementById('setupAvatar').value = user.photoURL;
            document.getElementById('setupAvatarPreview').src = user.photoURL;
        }
    }
}

function closeProfileModal() {
    document.getElementById('profileSetupModal').style.display = 'none';
}

function openProfileEditor() {
    document.getElementById('profileSetupModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = "Editar Perfil";
    document.getElementById('modalDesc').innerText = "Actualiza tu nombre o red social.";
    document.getElementById('btnSaveProfile').innerText = 'ACTUALIZAR DATOS';
    const btnCancel = document.getElementById('btnCancelProfile');
    if(btnCancel) btnCancel.style.display = 'block';
    if(globalUsersData[currentUserEmail]) {
        document.getElementById('setupNick').value = globalUsersData[currentUserEmail].nick;
        document.getElementById('setupAvatar').value = globalUsersData[currentUserEmail].avatar;
        document.getElementById('setupAvatarPreview').src = globalUsersData[currentUserEmail].avatar;
        document.getElementById('setupSocial').value = globalUsersData[currentUserEmail].social || "";
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
    
    if(!nick) { 
        alert("Debes elegir un nombre de usuario.");
        return; 
    }
    if(!avatar) { 
        alert("Debes colocar una URL de avatar."); 
        return;
    }

    if (nick.toLowerCase().includes("archinime")) {
        if (currentUserEmail !== "archinime12@gmail.com") {
             alert("El nombre 'Archinime' está reservado y no puede ser utilizado.");
             return;
        }
    }

    const nickLower = nick.toLowerCase();
    const isTaken = Object.entries(globalUsersData).some(([email, data]) => {
        return data.nick?.toLowerCase() === nickLower && email !== currentUserEmail;
    });
    if (isTaken) {
        alert("Este nombre ya ha sido registrado, elige otro por favor.");
        return;
    }

    btn.disabled = true;
    logEl.innerText = "Guardando perfil en Firestore...";
    try {
        const userData = {
            nick: nick,
            avatar: avatar,
            social: social,
            email: currentUserEmail,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('users').doc(currentUserEmail).set(userData, { merge: true });
        
        globalUsersData[currentUserEmail] = userData;
        currentUserNick = nick;
        currentUserAvatar = avatar;

        logEl.innerText = "¡Perfil actualizado! Entrando...";
        setTimeout(() => {
            document.getElementById('profileSetupModal').style.display = 'none';
            btn.disabled = false;
            logEl.innerText = "";
            showCMS();
        }, 1000);
    } catch(e) {
        console.error(e);
        logEl.innerText = "Error al guardar el perfil: " + e.message;
        btn.disabled = false;
    }
}

function showCMS() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'flex';
    document.getElementById('cmsContent').style.display = 'grid';
    document.getElementById('userAvatarImg').src = currentUserAvatar;
    document.getElementById('userNameDisplay').innerText = currentUserNick;
    
    injectStateSelect();
    injectFinalBlock();
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none';
    document.getElementById('profileSetupModal').style.display = 'none';
}

function logout() {
    auth.signOut().then(() => {
        if (window.ArchinimeState) ArchinimeState.set('currentUser', null);
        location.reload();
    });
}

// ============================================
// LÓGICA DE INTERFAZ Y FORMULARIO (SIN RATING)
// ============================================

function injectStateSelect() {
    if(document.getElementById('estadoAnime')) return;
    const genresContainer = document.getElementById('genresContainer');
    if(!genresContainer) return;

    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = "25px";
    wrapper.innerHTML = `
        <h2><i class="fas fa-fire"></i> Estado del Anime</h2>
        <select id="estadoAnime" onchange="requestPreviewUpdate()">
            <option value="ESTRENO 🚨" selected>ESTRENO 🚨</option>
            <option value="NUEVO 🔥">NUEVO 🔥</option>
            <option value="PRÓXIMAMENTE ⏳">PRÓXIMAMENTE ⏳</option>
            <option value="Ninguna">Ninguna</option>
        </select>
    `;
    genresContainer.parentNode.insertBefore(wrapper, genresContainer);
    
    const sel = document.getElementById('estadoAnime');
    sel.style.width = "100%";
    sel.style.padding = "14px 16px";
    sel.style.background = "#181920";
    sel.style.border = "1px solid #2a2b35";
    sel.style.color = "white";
    sel.style.borderRadius = "12px";
    sel.style.fontSize = "16px";
    sel.style.appearance = "none";
    sel.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b8d96'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")";
    sel.style.backgroundRepeat = "no-repeat";
    sel.style.backgroundPosition = "right 15px center";
    sel.style.backgroundSize = "16px";
}

function injectFinalBlock() {
    if(document.getElementById('finalToggle')) return;
    const musicContainer = document.getElementById('musicContainer');
    if(!musicContainer) return;
    const parent = musicContainer.parentNode;
    const musicHeader = musicContainer.previousElementSibling;
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = "25px";
    wrapper.style.padding = "20px";
    wrapper.style.background = "#131419";
    wrapper.style.borderRadius = "16px";
    wrapper.style.border = "1px solid #2a2b35";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "space-between";
    wrapper.innerHTML = `
        <div style="font-weight:700; color:#fff; display:flex; align-items:center; gap:10px;">
            <i class="fas fa-flag-checkered" style="color:var(--accent)"></i> MARCAR COMO FINAL
        </div>
        <label class="switch" style="margin:0; width:auto; background:none; border:none;">
            <input type="checkbox" id="finalToggle">
            <span class="slider round" style="position:relative; display:inline-block; width:50px; height:26px; background-color:#333; border-radius:34px; transition:.4s;">
                <span style="position:absolute; content:''; height:20px; width:20px; left:3px; bottom:3px; background-color:white; border-radius:50%; transition:.4s;" id="sliderCircle"></span>
            </span>
        </label>
    `;
    const checkbox = wrapper.querySelector('#finalToggle');
    const slider = wrapper.querySelector('.slider');
    const circle = wrapper.querySelector('#sliderCircle');
    
    checkbox.addEventListener('change', () => {
        if(checkbox.checked) {
            slider.style.backgroundColor = "#00f0ff";
            circle.style.transform = "translateX(24px)";
        } else {
            slider.style.backgroundColor = "#333";
            circle.style.transform = "translateX(0)";
        }
        requestPreviewUpdate();
    });

    if (musicHeader && musicHeader.tagName === 'H2') {
        parent.insertBefore(wrapper, musicHeader);
    } else {
        parent.insertBefore(wrapper, musicContainer);
    }
}

const genresList = [
    "Acción", "Animación", "Artes Marciales", "Aventura", "Ciencia ficción", "Cocina", "Comedia", 
    "Comedia oscura", "Coming-of-age", "Cosplay", "Crimen", "Cyberpunk", "Deducción Social", "Deportivo", 
    "Divulgación Científica", "Drama", "Ecchi", "Espionaje", "Escolar", "Fantasía", 
    "Fantasía oscura", "Familiar", "Gag", "Gore", "Harem", "Hentai", "Histórico", 
    "Horror", "Incesto", "Infantil", "Isekai", "Isekai Inverso", "Kaiju", "Mahō Shōjo", 
    "Mecha", "Militar", "Mitología", "Misterio", "Musical", "Nekketsu", "Parodia", 
    "Policial", "Post-apocalíptico", "Psicológico", "Reverse Harem", "Romance", "RPG", 
    "Slice of Life", "Sobrenatural", "Steampunk", "Superhéroes", "Survival", 
    "Survival Game", "Suspenso", "Tentáculos", "Terror", "Terror psicológico", "Thriller", 
    "Thriller psicológico", "Tokusatsu", "Tragedia", "VRMMO", "Yankī", "Yaoi", "Yuri"
];
const gContainer = document.getElementById('genresContainer');
genresList.forEach(g => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${g}" onchange="requestPreviewUpdate()"> ${g}`;
    gContainer.appendChild(label);
});
const demoSelectCMS = document.getElementById('demografiaAnime');
if(demoSelectCMS) {
    demoSelectCMS.innerHTML = `
        <option value="" disabled selected>Seleccionar...</option>
        <option>Josei</option>
        <option>Kodomo</option>
        <option>Seijin</option>
        <option>Seinen</option>
        <option>Shōjo</option>
        <option>Shōnen</option>
    `;
}

function showToast(msg, isError = false) {
    const x = document.getElementById("toast");
    if(!x) return;
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
    if(!el) return;
    el.style.display = 'block';
    el.innerHTML += `> ${msg}<br>`;
    el.scrollTop = el.scrollHeight;
}

function smartLinkConvert(input) {
    let val = input.value.trim();
    let changed = false;
    if (val.includes('http://10.22.7.119:8080')) {
        input.value = val.replace('http://10.22.7.119:8080', 'https://fsb-latest-gdv3.onrender.com');
        changed = true;
        showToast("Link local convertido a Render");
    }

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
    
    if (/ok\.ru\/video\//i.test(val)) {
        input.value = val.replace(/ok\.ru\/video\//i, 'ok.ru/videoembed/');
        changed = true;
        showToast("Link ok.ru convertido a /videoembed/");
    }

    if (val.includes('odysee.com/') && !val.includes('odysee.com/$/embed/')) {
        input.value = val.replace(/odysee\.com\//i, 'odysee.com/$/embed/');
        changed = true;
        showToast("Link Odysee convertido a Embed");
    }
    
    if(changed) {
        if(input.id === 'portadaAnime') {
            checkCoverVisual(input);
        } else if (input.classList.contains('m-url')) {
            updateAudioPreview(input);
        }
        requestPreviewUpdate();
    }
}

function checkCoverVisual(input) {
    const img = document.getElementById('mainCoverPreview');
    const display = document.getElementById('dimDisplay');
    if(!img || !display) return;
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
        const allowed = [{w: 1000, h: 1500}, {w: 1400, h: 2100}, {w: 2000, h: 3000}, {w: 2090, h: 3135}, {w: 3412, h: 5120}];
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
    requestPreviewUpdate();
}

function addMusic(url = "") {
    const container = document.getElementById('musicContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <div class="audio-preview-box">
            <input type="text" class="m-url" value="${url}" placeholder="Audio (mp3...)" oninput="updateAudioPreview(this); requestPreviewUpdate()" onblur="smartLinkConvert(this)">
            <audio controls preload="none"></audio>
            <div class="audio-status-text"></div>
        </div>
        <button class="btn-mini-del" onclick="this.parentElement.remove(); requestPreviewUpdate()" style="height:auto; aspect-ratio:1/1"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(div);
    if(url) updateAudioPreview(div.querySelector('.m-url'));
    requestPreviewUpdate();
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

const colorPalette = ['#00f0ff', '#8c52ff', '#ff0055', '#00ff9d', '#ffeb3b', '#ff9100', '#2979ff', '#e040fb'];
function addSeason(data = null) {
    const container = document.getElementById('seasonsContainer');
    const div = document.createElement('div');
    div.className = 'season-card';
    const count = document.querySelectorAll('.season-card').length;
    const color = colorPalette[count % colorPalette.length];
    div.style.cssText = `border-left: 4px solid ${color}; background: linear-gradient(120deg, ${color}11 0%, rgba(19, 20, 25, 0.9) 35%);`;
    div.innerHTML = `
        <div class="card-controls">
            <button class="btn-move" onclick="moveSeason(this, -1)" title="Mover Atrás/Arriba"><i class="fas fa-arrow-up"></i></button>
            <button class="btn-move" onclick="moveSeason(this, 1)" title="Mover Adelante/Abajo"><i class="fas fa-arrow-down"></i></button>
            <button class="btn-del-section" onclick="removeSeasonBlock(this)"><i class="fas fa-trash"></i> ELIMINAR</button>
        </div>
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
        <div class="row-flex">
            <div class="col-flex">
                <label>Cant. Capítulos</label>
                <input type="number" class="s-count" min="1" onchange="renderChapters(this); checkAutoState();">
            </div>
            <div class="col-flex">
                <label>Numeración</label>
                <select class="s-start-index" onchange="renderChapters(this)">
                    <option value="1" selected>Desde Cap 1</option>
                    <option value="0">Desde Cap 0</option>
                </select>
            </div>
        </div>
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
        
        const startSel = div.querySelector('.s-start-index');
        if(data.eps && data.eps.length > 0) {
            const firstTitle = data.eps[0].title || "";
            if(firstTitle.includes(" 0") || firstTitle.includes("Capítulo 0")) startSel.value = "0";
            else startSel.value = "1";
        }
        const countInp = div.querySelector('.s-count');
        countInp.value = data.eps.length;
        renderChapters(countInp, data.eps);
    }
    updateAllBlockNames();
    requestPreviewUpdate();
    checkAutoState();
}

function checkAutoState() {
    const stateSel = document.getElementById('estadoAnime');
    if(!stateSel) return;
    
    let totalCaps = 0;
    document.querySelectorAll('.s-count').forEach(inp => {
        const val = parseInt(inp.value);
        if(!isNaN(val) && !inp.disabled) totalCaps += val;
        if(inp.disabled) totalCaps += 1;
    });
    if (stateSel.value !== 'PRÓXIMAMENTE ⏳' && stateSel.value !== 'Ninguna') {
        if (totalCaps === 1) {
            stateSel.value = "ESTRENO 🚨";
        } else if (totalCaps > 1) {
            stateSel.value = "NUEVO 🔥";
        }
    }
}

function moveSeason(btn, direction) {
    const card = btn.closest('.season-card');
    const container = document.getElementById('seasonsContainer');
    if (direction === -1) {
        if (card.previousElementSibling) container.insertBefore(card, card.previousElementSibling);
    } else {
        if (card.nextElementSibling) container.insertBefore(card, card.nextElementSibling.nextElementSibling);
    }
    updateAllBlockNames();
    document.querySelectorAll('.season-card').forEach((c, idx) => {
        const color = colorPalette[idx % colorPalette.length];
        c.style.borderLeftColor = color;
        c.style.background = `linear-gradient(120deg, ${color}11 0%, rgba(19, 20, 25, 0.9) 35%)`;
    });
    requestPreviewUpdate();
}

function removeSeasonBlock(btn) {
    btn.closest('.season-card').remove();
    updateAllBlockNames();
    checkAutoState();
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
        
        if (nameInput.disabled || nameInput.value.trim() === "") {
             if (type === 'Temporada') { tempCount++; nameInput.value = `Temporada ${tempCount}`; }
             else if (type === 'Pelicula') { movieCount++; nameInput.value = `Película ${movieCount}`; }
             else if (type === 'OVA') { ovaCount++; nameInput.value = `OVA ${ovaCount}`; }
             else if (type === 'Especial') { specialCount++; nameInput.value = `Especial ${specialCount}`; }
             else if (type === 'Spin-Off') { 
                 spinOffCount++;
                 if (!nameInput.value) nameInput.value = `Spin-Off ${spinOffCount}`;
             }
        } else {
             if (type === 'Temporada') tempCount++;
             else if (type === 'Pelicula') movieCount++;
             else if (type === 'OVA') ovaCount++;
             else if (type === 'Especial') specialCount++;
             else if (type === 'Spin-Off') spinOffCount++;
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
    
    updateAllBlockNames();
    if(countInput.value) renderChapters(countInput);
    checkAutoState();
    requestPreviewUpdate();
}

function renderChapters(input, existingEps = []) {
    const card = input.closest('.season-card');
    const typeSelect = card.querySelector('.s-type');
    const type = typeSelect ? typeSelect.value : "";
    const countInput = card.querySelector('.s-count');
    const count = parseInt(countInput.value);
    const startSel = card.querySelector('.s-start-index');
    const startNum = startSel ? parseInt(startSel.value) : 1;

    const list = card.querySelector('.chapters-grid');
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

        let currentNum = startNum + i;
        let titleInputDisabled = ['Temporada', 'Spin-Off'].includes(type) ? "disabled" : "";
        let titlePlaceholder = titleInputDisabled ? `Capítulo ${currentNum}` : "Nombre (ej: El viaje...)";
        if(titleInputDisabled) customTitle = `Capítulo ${currentNum}`;
        row.innerHTML = `
            <div class="chapter-header"><span class="chapter-num">CAPÍTULO ${currentNum}</span></div>
            <div class="c-inputs-grid">
                <input type="text" class="c-link-lat" value="${lat}" placeholder="🔗 Lat" oninput="requestPreviewUpdate()" onblur="smartLinkConvert(this)">
                <input type="text" class="c-link-sub" value="${sub}" placeholder="🔗 Sub" oninput="requestPreviewUpdate()" onblur="smartLinkConvert(this)">
            </div>
            <input type="text" class="c-title-ov" value="${customTitle}" ${titleInputDisabled} placeholder="${titlePlaceholder}" oninput="requestPreviewUpdate()" style="margin-top:10px; font-size:0.9em; border-color:#333; background:#111;">
        `;
        list.appendChild(row);
    }
    requestPreviewUpdate();
}

function requestPreviewUpdate() {
    if (!previewTimeout) {
        previewTimeout = requestAnimationFrame(() => {
            updateWebPreview();
            checkForChanges();
            previewTimeout = null;
        });
    }
}

function checkForChanges() {
    if (!isEditMode) return;
    const btn = document.getElementById('btnSaveAction');
    if (!originalAnimeState) return;
    const currentState = JSON.stringify(generateData());
    if (currentState !== originalAnimeState) {
        if (btn.disabled && !btn.innerHTML.includes("BLOQUEADA")) {
             btn.disabled = false;
             btn.style.opacity = "1";
             btn.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> GUARDAR CAMBIOS';
        }
    } else {
        if (!btn.innerHTML.includes("BLOQUEADA")) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.innerHTML = '<i class="fas fa-check"></i> Sin cambios pendientes';
        }
    }
}

function updateWebPreview() {
    const titleEl = document.getElementById('webTitle');
    const titleVal = document.getElementById('tituloAnime').value;
    if(titleEl) titleEl.innerText = titleVal || 'Título';

    const coverUrl = document.getElementById('portadaAnime').value;
    const webCover = document.getElementById('webCover');
    if(coverUrl && webCover) webCover.src = coverUrl;
    const prevId = document.getElementById('previewId');
    if(prevId) prevId.innerText = isEditMode ? currentEditingId : "###";

    const demo = document.getElementById('demografiaAnime').value;
    const wDemo = document.getElementById('webDemography');
    if(wDemo) wDemo.innerText = demo ? demo.toUpperCase() : 'DEMO';
    
    const aliases = [];
    document.querySelectorAll('.alias-input').forEach(i => { if(i.value.trim()) aliases.push(i.value.trim()) });
    const prevAlias = document.getElementById('previewAliasesList');
    if(prevAlias) prevAlias.innerText = aliases.length > 0 ? aliases.join(', ') : "";

    // Eliminamos la visualización del rating en la previsualización
    const tagsContainer = document.getElementById('webTags');
    if(tagsContainer) {
        tagsContainer.innerHTML = '';
        document.querySelectorAll('#genresContainer input:checked').forEach(cb => {
            let s = document.createElement('span');
            s.style.cssText = "font-size:0.65em; padding:3px 8px; border-radius:4px; background:rgba(255,255,255,0.1); color:#ccc;";
            s.innerText = cb.value;
            tagsContainer.appendChild(s);
        });
    }

    const grid = document.getElementById('webSeasonsGrid');
    if(grid) {
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
}

// ============================================
// BÚSQUEDA EN FIRESTORE
// ============================================
function openSearchModal() {
    document.getElementById('searchModal').style.display = 'flex';
    document.getElementById('searchInput').value = "";
    document.getElementById('searchResults').innerHTML = "";
    switchSearchTab('mine');
    if(cachedCatalog.length === 0) loadCatalogForSearch();
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
    document.getElementById('tabMine').className = mode === 'mine' ? 'tab-btn active' : 'tab-btn';
    document.getElementById('tabGeneral').className = mode === 'general' ? 'tab-btn active' : 'tab-btn';
    if(cachedCatalog.length > 0) filterSearch();
}

async function loadCatalogForSearch() {
    const loading = document.getElementById('loadingSearch');
    loading.style.display = 'block';
    try {
        const snapshot = await db.collection('catalogo').orderBy('title').get();
        cachedCatalog = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    
    const filtered = cachedCatalog.filter(a => {
        const matchesText = a.title.toLowerCase().includes(query);
        if (currentSearchMode === 'mine') { 
            return matchesText && (a.uploader === currentUserEmail || a.uploader === currentUserNick); 
        } else { 
            return matchesText; 
        }
    }).slice(0, 1000);
    
    filtered.forEach(anime => {
        const div = document.createElement('div');
        div.className = 's-result-item';
        div.onclick = () => loadAnimeForEditing(anime.id);
        
        let extraInfo = "";
        let displayNick = anime.uploader;
        let uploaderImg = "Logo_Archinime.avif"; 
        if(globalUsersData[anime.uploader]) {
             displayNick = globalUsersData[anime.uploader].nick;
             uploaderImg = globalUsersData[anime.uploader].avatar;
        }
        if (currentSearchMode === 'general') { 
            extraInfo = ` | Subido por: <img src="${uploaderImg}" style="width:16px; height:16px; border-radius:50%; vertical-align:middle; margin:0 4px; object-fit:cover; border:1px solid #555;"> <span style="color:var(--primary)">${displayNick || "Desconocido"}</span>`; 
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
        let emptyMsg = currentSearchMode === 'mine' ? `No se encontraron animes subidos por <b>${currentUserNick}</b>.` : "No se encontraron resultados.";
        results.innerHTML = `<div style="padding:20px; color:#777; text-align:center"><i class="fas fa-folder-open" style="font-size:2em; margin-bottom:10px;"></i><br>${emptyMsg}</div>`;
    }
}

// ============================================
// CARGAR ANIME PARA EDITAR DESDE FIRESTORE
// ============================================
async function loadAnimeForEditing(id) {
    if(!confirm("¿Cargar anime? Se perderán los datos actuales del formulario.")) return;
    closeSearchModal();
    showToast("Descargando datos...", false);
    
    try {
        const docRef = db.collection('catalogo').doc(String(id));
        const doc = await docRef.get();
        
        if (!doc.exists) {
            throw new Error("Anime no encontrado");
        }
        
        const targetDetail = doc.data();
        
        isEditMode = true;
        currentEditingId = id;
        
        const editModeBar = document.getElementById('editModeBar');
        if(editModeBar) editModeBar.style.display = 'block';
        const existingDelBtn = document.getElementById('btnDeleteAnime');
        if(existingDelBtn) existingDelBtn.remove();
        if(currentUserEmail === "archinime12@gmail.com") {
             const delBtn = document.createElement('button');
             delBtn.id = 'btnDeleteAnime';
             delBtn.innerText = "🗑 ELIMINAR ANIME";
             delBtn.style.cssText = "background: #ff4757; color: white; border: none; padding: 4px 10px; border-radius: 4px; margin-top: 5px; margin-left:10px; cursor: pointer; font-weight:bold;";
             delBtn.onclick = () => deleteCurrentAnime(id);
             editModeBar.appendChild(delBtn);
        }
        
        const editIdEl = document.getElementById('editIdDisplay');
        if(editIdEl) editIdEl.innerText = id;
        const btnActEl = document.getElementById('btnActionText');
        if(btnActEl) btnActEl.innerText = "GUARDAR CAMBIOS";
        
        const storedUploader = targetDetail.uploader || "Archinime";
        const isSuperAdmin = ALLOWED_USERS.includes(currentUserEmail);
        const isOwner = (storedUploader === currentUserEmail) || (storedUploader === currentUserNick) || isSuperAdmin || (currentUserNick === "Archinime");
        const saveBtn = document.getElementById('btnSaveAction');
        if (!isOwner) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-lock"></i> EDICIÓN BLOQUEADA (Solo Lectura)';
            showToast("Modo Lectura: No eres el autor de este anime", true);
        } else {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Sin cambios pendientes';
            saveBtn.style.opacity = '0.5';
        }

        // Rellenar formulario (sin campos de rating)
        document.getElementById('tituloAnime').value = targetDetail.title || '';
        document.getElementById('portadaAnime').value = targetDetail.img || '';
        document.getElementById('sinopsisAnime').value = targetDetail.desc || '';
        document.getElementById('aliasContainer').innerHTML = '';
        if(targetDetail.aliases) targetDetail.aliases.forEach(a => addAlias(a));

        // Géneros y demografía
        if(targetDetail.genres && targetDetail.genres.length > 0) {
            let loadedGenres = [...targetDetail.genres];
            const demoOptions = ["Gekiga", "Josei", "Kodomo", "Seijin", "Seinen", "Shōjo", "Shōnen"];
            const foundDemo = loadedGenres.find(g => demoOptions.includes(g));
            
            if(foundDemo) {
                document.getElementById('demografiaAnime').value = foundDemo;
                loadedGenres = loadedGenres.filter(g => g !== foundDemo);
            }
            document.querySelectorAll('#genresContainer input').forEach(cb => {
                cb.checked = loadedGenres.includes(cb.value);
            });
        }
        
        // Estado
        if (targetDetail.updateType) {
            const estadoSel = document.getElementById('estadoAnime');
            if (estadoSel) estadoSel.value = targetDetail.updateType;
        }
        
        // Final
        if (targetDetail.isFinal) {
            const toggle = document.getElementById('finalToggle');
            if(toggle) {
                toggle.checked = true;
                toggle.dispatchEvent(new Event('change'));
            }
        }
        
        // Temporadas
        document.getElementById('seasonsContainer').innerHTML = '';
        if(targetDetail.seasons) {
            targetDetail.seasons.forEach(s => {
                addSeason(s);
            });
        }

        // Música (ahora campo "music")
        document.getElementById('musicContainer').innerHTML = '';
        if(targetDetail.music) {
            targetDetail.music.forEach(url => addMusic(url));
        }

        checkCoverVisual(document.getElementById('portadaAnime'));
        requestPreviewUpdate();
        originalAnimeState = JSON.stringify(generateData());
        
        checkAutoState();
        
        showToast("¡Datos cargados correctamente!");
    } catch(e) {
        console.error(e);
        showToast("Error cargando: " + e.message, true);
        exitEditMode();
    }
}

// ============================================
// ELIMINAR ANIME (SOLO ADMIN)
// ============================================
async function deleteCurrentAnime(idToDelete) {
    if(currentUserEmail !== "archinime12@gmail.com") { 
        alert("Acción no permitida.");
        return; 
    }
    if(!confirm(`⚠️ PELIGRO ⚠️\n\n¿Eliminar anime ID: ${idToDelete}?`)) return;
    if(!confirm(`ÚLTIMA ADVERTENCIA.\n¿Confirmar borrado?`)) return;

    showToast("Eliminando anime...", false);
    try {
        await db.collection('catalogo').doc(String(idToDelete)).delete();
        showToast("✅ Anime eliminado correctamente");
        
        await loadCatalogForSearch();
        
        exitEditMode();
    } catch(e) {
        console.error(e);
        showToast("Error al eliminar: " + e.message, true);
    }
}

function exitEditMode() {
    isEditMode = false;
    currentEditingId = null;
    originalAnimeState = null;
    document.getElementById('editModeBar').style.display = 'none';
    document.getElementById('btnActionText').innerText = "COMPILAR Y SUBIR";
    const saveBtn = document.getElementById('btnSaveAction');
    saveBtn.disabled = false;
    saveBtn.style.opacity = '1';
    // Limpiar formulario
    document.getElementById('tituloAnime').value = '';
    document.getElementById('portadaAnime').value = '';
    document.getElementById('sinopsisAnime').value = '';
    document.getElementById('aliasContainer').innerHTML = '';
    document.getElementById('seasonsContainer').innerHTML = '';
    document.getElementById('musicContainer').innerHTML = '';
    document.querySelectorAll('#genresContainer input').forEach(cb => cb.checked = false);
    requestPreviewUpdate();
}

function generateData() {
    const selectedGenres = [];
    document.querySelectorAll('#genresContainer input:checked').forEach(cb => selectedGenres.push(cb.value));
    const demoSelect = document.getElementById('demografiaAnime').value;
    // Ya no se incluye rating
    const aliasList = [];
    document.querySelectorAll('.alias-input').forEach(i => { if(i.value.trim()) aliasList.push(i.value.trim()) });
    
    let selectedState = "ESTRENO 🚨";
    const stEl = document.getElementById('estadoAnime');
    if(stEl) selectedState = stEl.value;

    let isFinal = false;
    const finalTog = document.getElementById('finalToggle');
    if(finalTog) isFinal = finalTog.checked;

    const anime = {
        id: isEditMode ? currentEditingId : null,
        title: document.getElementById('tituloAnime').value.trim(),
        aliases: aliasList,
        img: document.getElementById('portadaAnime').value.trim(),
        desc: document.getElementById('sinopsisAnime').value.trim(),
        genres: selectedGenres,
        rating: 0,
        music: [],  // CAMBIADO de "musica" a "music"
        seasons: [],
        uploader: currentUserEmail, 
        uploaderImg: currentUserAvatar,
        updateType: selectedState,
        isFinal: isFinal,
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Añadir demografía a géneros
    if(demoSelect) {
        anime.genres = anime.genres.filter(g => g !== demoSelect);
        anime.genres.push(demoSelect);
    }
    
    // CAMBIADO: ahora se usa anime.music en lugar de anime.musica
    document.querySelectorAll('#musicContainer .m-url').forEach(i => { if(i.value) anime.music.push(i.value.trim()); });
    
    let globalOrder = 1;
    document.querySelectorAll('.season-card').forEach(card => {
        const eps = [];
        const sName = card.querySelector('.s-name').value;
        const sType = card.querySelector('.s-type').value;
        const sCover = card.querySelector('.s-img').value;
        const startSel = card.querySelector('.s-start-index');
        const startNum = startSel ? parseInt(startSel.value) : 1;

        card.querySelectorAll('.chapter-row').forEach((row, idx) => {
            const lat = row.querySelector('.c-link-lat').value.trim();
            const sub = row.querySelector('.c-link-sub').value.trim();
            let customTitleInput = row.querySelector('.c-title-ov').value.trim();
            let detailTitle = ""; 
            let currentEpNum = startNum + idx;
         
            if (sType === 'Temporada' || sType === 'Spin-Off') {
                detailTitle = `Capítulo ${currentEpNum}`;
            } else {
                detailTitle = customTitleInput || sName;
            }

            if(sub || lat) {
                eps.push({ 
                    title: detailTitle, 
                    link: lat, 
                    link2: sub 
                });
            }
        });
        
        if(eps.length > 0 || anime.updateType === 'PRÓXIMAMENTE ⏳') {
            anime.seasons.push({ 
                num: globalOrder++, 
                name: sName, 
                type: sType, 
                cover: sCover, 
                eps: eps 
            });
        }
    });
    
    // Datos para la notificación
    if (anime.seasons.length > 0) {
        const lastSeason = anime.seasons[anime.seasons.length - 1];
        anime.latestSeasonCover = lastSeason.cover || anime.img;
        anime.latestBlockName = lastSeason.name;
        if (lastSeason.eps.length > 0) {
            anime.latestEpTitle = lastSeason.eps[lastSeason.eps.length - 1].title;
        }
    }
    
    return anime;
}

// ============================================
// GUARDAR EN FIRESTORE (SIN CREAR VOTOS)
// ============================================
async function guardarEnFirestore() {
    const btn = document.getElementById('btnSaveAction');
    if(btn.disabled) return showToast("Edición Bloqueada o Sin Cambios", true);
    
    const nuevoAnime = generateData();
    
    // Validaciones
    if(!nuevoAnime.title) return showToast("Falta Título", true);
    if(!nuevoAnime.img) return showToast("Falta Portada", true);
    if(!nuevoAnime.desc) return showToast("Falta Sinopsis", true);
    if(nuevoAnime.genres.length === 0) return showToast("Elige Géneros", true);
    
    if(nuevoAnime.updateType !== 'PRÓXIMAMENTE ⏳') {
        if(nuevoAnime.seasons.length === 0) return showToast("Agrega contenido", true);
    }

    if(!confirm(`¿Deseas ${isEditMode ? 'actualizar' : 'crear'} "${nuevoAnime.title}"?`)) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    
    try {
        let finalId = nuevoAnime.id;
        
        if (!isEditMode) {
            // Obtener el último ID
            const snapshot = await db.collection('catalogo')
                .orderBy('id', 'desc')
                .limit(1)
                .get();
            
            if (!snapshot.empty) {
                finalId = snapshot.docs[0].data().id + 1;
            } else {
                finalId = 1;
            }
            nuevoAnime.id = finalId;
        }
        
        // Timestamp para lastUpdate
        nuevoAnime.lastUpdate = Date.now();
        
        // Guardar en Firestore (solo catálogo, NO se crea animeRatings)
        await db.collection('catalogo').doc(String(finalId)).set(nuevoAnime, { merge: true });
        
        showToast(`¡Anime ${isEditMode ? 'actualizado' : 'creado'} correctamente!`, false);
        
        // Recargar catálogo en caché
        await loadCatalogForSearch();
        
        if (!isEditMode) {
            exitEditMode();
        } else {
            originalAnimeState = JSON.stringify(nuevoAnime);
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-check"></i> Sin cambios pendientes';
            btn.style.opacity = '0.5';
        }
        
    } catch (error) {
        console.error('Error al guardar:', error);
        showToast('Error al guardar: ' + error.message, true);
        btn.disabled = false;
        btn.innerHTML = isEditMode ? 'GUARDAR CAMBIOS' : 'COMPILAR Y SUBIR';
        btn.style.opacity = '1';
    }
}

// Reemplazar la función original
window.subirAGithHub = guardarEnFirestore;

// Inicializar la inyección
injectStateSelect();
injectFinalBlock();