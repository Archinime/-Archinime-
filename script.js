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
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

let currentUserToken = null;
let globalUsersData = {}; 

// VARIABLES DE ESTADO
let isEditMode = false;
let currentEditingId = null;
let cachedIndex = [];
let searchTimeout = null;
let previewTimeout = null;
let originalAnimeState = null;

// DATOS USUARIO
let currentUserNick = "Usuario"; 
let currentUserAvatar = "Logo_Archinime.avif";
let currentUserEmail = "";
let currentSearchMode = 'mine';

// ============================================
// AUTENTICACIÓN
// ============================================
auth.onAuthStateChanged((user) => {
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
            checkAccess(result.user);
        }).catch((error) => {
            console.error(error);
            document.getElementById('errorText').innerText = error.message;
            document.getElementById('loginError').style.display = 'block';
        });
}

async function checkAccess(user) {
    const email = user.email;
    currentUserEmail = email;
    document.getElementById('errorText').innerText = "Verificando base de datos...";
    document.getElementById('loginError').style.display = 'none';

    // 1. COMPROBACIÓN ESPECIAL PARA EL DUEÑO (SUPER ADMIN)
    // Si eres tú, forzamos tus datos para evitar que te pida configurar el perfil
    if (email === "archinime12@gmail.com") {
        currentUserNick = "Archinime";
        currentUserAvatar = "Logo_Archinime.avif";
        // Intentamos cargar la DB solo para tener los otros usuarios, pero te dejamos pasar ya
        try {
            const usersFile = await getGithubFile(currentUserToken, OWNER, REPO, 'users-data.js');
            globalUsersData = safeEval(usersFile.content);
        } catch (e) {
            console.warn("No se pudo cargar la DB de usuarios, pero eres Admin.");
            globalUsersData = {}; 
        }
        showCMS();
        return; // Salimos aquí para que no ejecute el código de abajo
    }

    // 2. LÓGICA PARA EL RESTO DE APORTADORES
    try {
        const usersFile = await getGithubFile(currentUserToken, OWNER, REPO, 'users-data.js');
        globalUsersData = safeEval(usersFile.content);

        if (globalUsersData[email]) {
            const userData = globalUsersData[email];
            currentUserNick = userData.nick;
            currentUserAvatar = userData.avatar;
            showCMS();
        } else {
            // Si es un Super Admin de la lista ALLOWED_USERS pero no está en el JSON
            if (ALLOWED_USERS.includes(email)) {
                showProfileSetup();
            } else {
                throw new Error("No registrado.");
            }
        }

    } catch (e) {
        console.error("Error acceso:", e);
        document.getElementById('errorText').innerText = "Acceso Denegado: No formas parte de los aportadores.";
        document.getElementById('loginError').style.display = 'block';
    }
}

function closeProfileModal() {
    document.getElementById('profileSetupModal').style.display = 'none';
}

function showProfileSetup() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none';
    document.getElementById('profileSetupModal').style.display = 'flex';
    
    document.getElementById('modalTitle').innerText = "Bienvenido/a";
    document.getElementById('modalDesc').innerText = "Es tu primera vez aquí. Configura tu cuenta para continuar.";
    document.getElementById('btnSaveProfile').innerText = 'GUARDAR PERFIL';
    document.getElementById('btnCancelProfile').style.display = 'none';
    
    const user = auth.currentUser;
    if(user) {
        document.getElementById('setupNick').value = "";
        if(user.photoURL) {
            document.getElementById('setupAvatar').value = user.photoURL;
            document.getElementById('setupAvatarPreview').src = user.photoURL;
        }
    }
}

function openProfileEditor() {
    document.getElementById('profileSetupModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = "Editar Perfil";
    document.getElementById('modalDesc').innerText = "Actualiza tu nombre o red social.";
    document.getElementById('btnSaveProfile').innerText = 'ACTUALIZAR DATOS';
    document.getElementById('btnCancelProfile').style.display = 'block';
    
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
    
    if(!nick) { alert("Debes elegir un nombre de usuario."); return; }
    if(!avatar) { alert("Debes colocar una URL de avatar."); return; }

    // VALIDACIÓN: Solo el dueño puede usar 'Archinime'
    if (nick.toLowerCase().includes("archinime")) {
        if (currentUserEmail !== "archinime12@gmail.com") {
             alert("El nombre 'Archinime' está reservado y no puede ser utilizado.");
             return;
        }
    }

    const nickLower = nick.toLowerCase();
    const isTaken = Object.entries(globalUsersData).some(([email, data]) => {
        return data.nick.toLowerCase() === nickLower && email !== currentUserEmail;
    });

    if (isTaken) {
        alert("Este nombre ya ha sido registrado, elige otro por favor.");
        return;
    }

    btn.disabled = true;
    logEl.innerText = "Guardando perfil en GitHub...";

    try {
        globalUsersData[currentUserEmail] = { nick: nick, avatar: avatar, social: social };

        await updateGithubFile(currentUserToken, OWNER, REPO, 'users-data.js', (content) => {
            const jsonStr = JSON.stringify(globalUsersData, null, 4);
            return `const usersData = ${jsonStr};`;
        });

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
        logEl.innerText = "Error guardando datos.";
        btn.disabled = false;
    }
}

function showCMS() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'flex';
    document.getElementById('cmsContent').style.display = 'grid';
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
    auth.signOut().then(() => { location.reload(); });
}

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

const gContainer = document.getElementById('genresContainer');
genresList.forEach(g => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${g}" onchange="requestPreviewUpdate()"> ${g}`;
    gContainer.appendChild(label);
});

// LIMITAR VALORACIÓN EN TIEMPO REAL
function limitRating(input, min, max) {
    if(input.value.length > 1) input.value = input.value.slice(0,1);
    const val = parseInt(input.value);
    // Permitir vacío para editar
    if(isNaN(val)) return; 
    if (val < min) input.value = min;
    if (val > max) input.value = max;
}

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
        const allowed = [
            {w: 1000, h: 1500}, {w: 1400, h: 2100}, {w: 2000, h: 3000}, {w: 2090, h: 3135}, {w: 3412, h: 5120}
        ];
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
    if (!input.value.trim()) { statusEl.innerHTML = ''; return; }
    statusEl.innerHTML = '<span style="color:#facc15"><i class="fas fa-circle-notch fa-spin"></i> Cargando...</span>';
    audioEl.src = input.value;
    audioEl.load();
    audioEl.onloadeddata = () => { statusEl.innerHTML = '<span style="color:#00ffbf"><i class="fas fa-check"></i> Válido</span>'; };
    audioEl.onerror = () => { statusEl.innerHTML = '<span style="color:#ff4757"><i class="fas fa-triangle-exclamation"></i> Error</span>'; };
}

// SEASONS
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
             if (type === 'Temporada') { tempCount++; nameInput.value = `Temporada ${tempCount}`; }
             else if (type === 'Spin-Off') { spinOffCount++; if (!nameInput.value) nameInput.value = `Spin-Off ${spinOffCount}`; }
             else if (type === 'Pelicula') { movieCount++; nameInput.value = `Película ${movieCount}`; }
             else if (type === 'OVA') { ovaCount++; nameInput.value = `OVA ${ovaCount}`; }
             else if (type === 'Especial') { specialCount++; nameInput.value = `Especial ${specialCount}`; }
        }
    });
}

function handleSeasonTypeChange(select) {
    const card = select.closest('.season-card');
    const countInput = card.querySelector('.s-count');
    const type = select.value;
    if (['Pelicula', 'OVA', 'Especial'].includes(type)) { countInput.value = 1; countInput.disabled = true; }
    else { countInput.disabled = false; }
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
             lat = existingEps[i].link || ''; sub = existingEps[i].link2 || ''; 
             if(!['Temporada', 'Spin-Off'].includes(type)) customTitle = existingEps[i].title;
        } else if(currentData[i]) {
             lat = currentData[i].lat; sub = currentData[i].sub; customTitle = currentData[i].title;
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
             btn.disabled = false; btn.style.opacity = "1"; btn.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> GUARDAR CAMBIOS';
        }
    } else {
        if (!btn.innerHTML.includes("BLOQUEADA")) {
            btn.disabled = true; btn.style.opacity = "0.5"; btn.innerHTML = '<i class="fas fa-check"></i> Sin cambios pendientes';
        }
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
    document.getElementById('previewAliasesList').innerText = aliases.length > 0 ? aliases.join(', ') : "";

    // PUNTUACIÓN EN PREVIEW
    const ri = document.getElementById('ratingInt').value;
    const rd = document.getElementById('ratingDec').value;
    document.getElementById('webRating').innerText = `⭐ ${ri || 0}.${rd || 0}`;
    
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

async function getGithubFile(token, owner, repo, path) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, {
        headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!response.ok) throw new Error(`Error leyendo ${path}`);
    const data = await response.json();
    return { sha: data.sha, content: new TextDecoder().decode(Uint8Array.from(atob(data.content), c => c.charCodeAt(0))) };
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

function openSearchModal() {
    document.getElementById('searchModal').style.display = 'flex';
    document.getElementById('searchInput').value = ""; 
    document.getElementById('searchResults').innerHTML = "";
    switchSearchTab('mine');
    if(cachedIndex.length === 0) loadIndexForSearch();
    else filterSearch();
}

function handleModalClick(event) {
    if (event.target.id === 'searchModal') closeSearchModal();
}

function closeSearchModal() { 
    document.getElementById('searchModal').style.display = 'none';
}

function switchSearchTab(mode) {
    currentSearchMode = mode;
    document.getElementById('tabMine').className = mode === 'mine' ? 'tab-btn active' : 'tab-btn';
    document.getElementById('tabGeneral').className = mode === 'general' ? 'tab-btn active' : 'tab-btn';
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
    
    const filtered = cachedIndex.filter(a => {
        const matchesText = a.title.toLowerCase().includes(query);
        const uploaderName = a.uploader || "Archinime";
        if (currentSearchMode === 'mine') { return matchesText && (uploaderName === currentUserNick); }
        else { return matchesText; }
    }).slice(0, 1000);

    filtered.forEach(anime => {
        const div = document.createElement('div');
        div.className = 's-result-item';
        div.onclick = () => loadAnimeForEditing(anime.id);
        let extraInfo = "";
        if (currentSearchMode === 'general') { extraInfo = ` | Subido por: <span style="color:var(--primary)">${anime.uploader || "Desconocido"}</span>`; }
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
        let emptyMsg = (currentSearchMode === 'mine') ? `No se encontraron animes subidos por <b>${currentUserNick}</b>.` : "No se encontraron resultados en el catálogo general.";
        results.innerHTML = `<div style="padding:20px; color:#777; text-align:center"><i class="fas fa-folder-open" style="font-size:2em; margin-bottom:10px;"></i><br>${emptyMsg}</div>`;
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
        document.getElementById('btnActionText').innerText = "GUARDAR CAMBIOS";
        
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
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Sin cambios pendientes';
            saveBtn.style.opacity = '0.5';
        }

        document.getElementById('tituloAnime').value = targetDetail.title;
        document.getElementById('portadaAnime').value = targetDetail.cover;
        document.getElementById('sinopsisAnime').value = targetDetail.desc;
        
        document.getElementById('aliasContainer').innerHTML = '';
        if(indexEntry && indexEntry.aliases) indexEntry.aliases.forEach(a => addAlias(a));

        if(indexEntry && indexEntry.genres && indexEntry.genres.length > 0) {
            let loadedGenres = [...indexEntry.genres];
            const lastGenre = loadedGenres[loadedGenres.length - 1];
            // FIX: DETECTAR SEIJIN EN DEMOGRAFÍA
            const demoOptions = ["Shōnen", "Seinen", "Shōjo", "Josei", "Kodomo", "Seijin"];
            
            // Si el último es demografía, lo sacamos
            if (demoOptions.includes(lastGenre)) {
                document.getElementById('demografiaAnime').value = lastGenre;
                loadedGenres.pop();
            } else {
                // Si no estaba al final, buscamos si está en algún lado del array
                const foundDemo = loadedGenres.find(g => demoOptions.includes(g));
                if(foundDemo) {
                    document.getElementById('demografiaAnime').value = foundDemo;
                    loadedGenres = loadedGenres.filter(g => g !== foundDemo);
                }
            }

            document.querySelectorAll('#genresContainer input').forEach(cb => {
                cb.checked = loadedGenres.includes(cb.value);
            });
        }
        
        // FIX: CARGA DE VALORACIÓN EN DOS CUADROS
        let r = 0;
        if(indexEntry && indexEntry.rating) r = parseFloat(indexEntry.rating);
        if(isNaN(r)) r = 0;
        // Separar entero y decimal
        const intPart = Math.floor(r); 
        const decPart = Math.round((r - intPart) * 10);
        document.getElementById('ratingInt').value = intPart || "";
        document.getElementById('ratingDec').value = decPart; // 0 es válido
        
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

        originalAnimeState = JSON.stringify(generateData());
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
    originalAnimeState = null;
    document.getElementById('editModeBar').style.display = 'none';
    document.getElementById('btnActionText').innerText = "COMPILAR Y SUBIR";
    const saveBtn = document.getElementById('btnSaveAction');
    saveBtn.disabled = false;
    saveBtn.style.opacity = '1';
    location.reload();
}

function generateData() {
    const selectedGenres = [];
    document.querySelectorAll('#genresContainer input:checked').forEach(cb => selectedGenres.push(cb.value));
    const demoSelect = document.getElementById('demografiaAnime').value;
    
    // OBTENER VALOR EXACTO DE DOS INPUTS
    const iVal = document.getElementById('ratingInt').value || "0";
    const dVal = document.getElementById('ratingDec').value || "0";
    const ratingVal = parseFloat(iVal + "." + dVal);

    const aliasList = [];
    document.querySelectorAll('.alias-input').forEach(i => { if(i.value.trim()) aliasList.push(i.value.trim()) });

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
        uploader: currentUserNick,
        uploaderAvatar: currentUserAvatar
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

function highlightLogoutButton() {
    const headerBtns = document.querySelectorAll('#userHeader button');
    const logoutBtn = Array.from(headerBtns).find(btn => btn.getAttribute('onclick') === 'logout()');
    if (logoutBtn) {
        logoutBtn.style.transition = 'all 0.5s ease';
        logoutBtn.style.border = '2px solid #00f0ff';
        logoutBtn.style.boxShadow = '0 0 20px #00f0ff, inset 0 0 10px #00f0ff';
        logoutBtn.style.color = '#00f0ff';
        logoutBtn.style.transform = 'scale(1.2)';
        let visible = true;
        setInterval(() => {
            logoutBtn.style.opacity = visible ? '0.5' : '1';
            visible = !visible;
        }, 500);
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
    if(btn.disabled) return showToast("Edición Bloqueada o Sin Cambios", true);
    const token = currentUserToken;
    if(!token) return showToast("Error de sesión", true);
    
    const nuevoAnime = generateData();
    if(!nuevoAnime.titulo) return showToast("Falta Título", true);
    if(!nuevoAnime.portada) return showToast("Falta Portada", true);
    if(!nuevoAnime.sinopsis) return showToast("Falta Sinopsis", true);
    if(!nuevoAnime.demografia) return showToast("Elige Demografía", true);
    
    // Validación de Rating
    if(nuevoAnime.rating < 1.0 || nuevoAnime.rating > 5.0) {
        return showToast("Valoración inválida (Min: 1.0, Max: 5.0)", true);
    }

    if(nuevoAnime.generos.length === 0) return showToast("Elige Géneros", true);
    if(nuevoAnime.temporadas.length === 0) return showToast("Agrega contenido", true);

    const confirmMsg = `¿Deseas compilar y subir los datos de "${nuevoAnime.titulo}"?\n\n- Presiona 'Aceptar' para SÍ (Subir).\n- Presiona 'Cancelar' para AÚN NO (Seguir editando).`;
    if(!confirm(confirmMsg)) {
        return;
    }

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

        log("2/5 Actualizando Index...");
        await updateGithubFile(token, OWNER, REPO, 'index-data.js', (content) => {
            let newContent = content;
            if(isEditMode) {
                const regexRemove = new RegExp(`\\s*\\{id:${FINAL_ID},[^]*?genres:\\[[^]*?\\]\\},?`, 'g');
                newContent = newContent.replace(regexRemove, '');
            }
            newContent = newContent.replace(/,\s*,/g, ',');
            const insertionPoint = newContent.lastIndexOf('];');
            let before = newContent.substring(0, insertionPoint).trim();
            if(before.endsWith(',')) before = before.slice(0, -1);
            
            let finalGenres = [...nuevoAnime.generos];
            if(nuevoAnime.demografia) {
                finalGenres = finalGenres.filter(g => g !== nuevoAnime.demografia);
                finalGenres.push(nuevoAnime.demografia);
            }
            const generosStr = finalGenres.map(g => `"${g}"`).join(',');
            const aliasesStr = nuevoAnime.aliases.length > 0 ? `, aliases: [${nuevoAnime.aliases.map(a => `"${a}"`).join(',')}]` : '';
            // Guardamos el rating exacto
            const newEntry = `,\n      {id:${FINAL_ID}, title:"${nuevoAnime.titulo}"${aliasesStr}, img:"${nuevoAnime.portada}", rating:${nuevoAnime.rating}, uploader:"${nuevoAnime.uploader}", uploaderImg:"${nuevoAnime.uploaderAvatar}", genres:[${generosStr}]}`;
            return before + newEntry + "\n];";
        });
        
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
            if(before.endsWith(',')) before = before.slice(0, -1);
            
            let playerStr = `,\n      "${FINAL_ID}": {\n`;
            nuevoAnime.temporadas.forEach(t => {
                playerStr += `          "${t.num}": {\n`;
                t.eps.forEach(e => playerStr += `          "${e.num}": { link:'${e.link}', link2:'${e.link2}', title:'${e.playerTitle}' },\n`);
                playerStr += `        },\n`;
            });
            playerStr += `      }`;
            return before + playerStr + "\n};";
        });

        log("5/5 Actualizando Música...");
        await updateGithubFile(token, OWNER, REPO, 'musica-data.js', (content) => {
            let newContent = content;
            if(isEditMode) {
                const regexRemove = new RegExp(`\\s*${FINAL_ID}:\\s*\\{[^]*?\\]\\,?`, 'g');
                newContent = newContent.replace(regexRemove, '');
            }
            newContent = newContent.replace(/,\s*,/g, ',');
            const insertionPoint = newContent.lastIndexOf('};');
            let before = newContent.substring(0, insertionPoint).trimEnd();
            if(before.endsWith(',')) before = before.slice(0, -1);
            
            const tracks = nuevoAnime.musica.map(m => `"${m}"`).join(',\n            ');
            const musicEntry = `,\n        ${FINAL_ID}: [\n            ${tracks}\n        ]`;
            return before + musicEntry + "\n};";
        });

        log("✨ ¡EXITO! YA PUEDES CERRAR SESIÓN");
        showToast("¡Datos subidos! Cierra sesión para refrescar.", false);
        alert("✅ Cambios guardados correctamente.\n\nPor favor, presiona el botón de 'CERRAR SESIÓN' y vuelve a entrar para ver los cambios o editar otro anime.");
        highlightLogoutButton();

    } catch (e) {
        console.error(e);
        log(`❌ ERROR: ${e.message}`);
        showToast("Error crítico (ver log)", true);
    }
}