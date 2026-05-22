// ============================================
// CONFIGURACIÓN FIREBASE AUTH (solo login)
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyBpzYARIxaJijLbbL-2S6F9MWecbAbvK_I",
    authDomain: "login-admin-archinime.firebaseapp.com",
    projectId: "login-admin-archinime",
    storageBucket: "login-admin-archinime.firebasestorage.app",
    messagingSenderId: "938164660242",
    appId: "1:938164660242:web:648e0dce0e0d18dd78d0cb"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ============================================
// LISTA DE USUARIOS PERMITIDOS
// ============================================
const ALLOWED_USERS = [
    "archinime12@gmail.com",
    "alejandroarchi12@gmail.com",
    "lucioguapofeo@gmail.com",
];

// ============================================
// ESTADO GLOBAL
// ============================================
let currentUser = null;            // objeto de Firebase Auth
let isEditMode = false;
let currentEditingId = null;
let originalAnimeState = null;
let previewTimeout = null;
let searchTimeout = null;
let cachedIndex = [];              // índice de búsqueda local
let currentSearchMode = 'mine';

// ============================================
// PERFIL DE USUARIO (localStorage)
// ============================================
let userProfile = {
    nick: '',
    color: '#00f0ff'
};

function loadProfile() {
    const saved = localStorage.getItem('archinime_cms_profile');
    if (saved) {
        try { userProfile = JSON.parse(saved); } catch (e) {}
    }
}

function saveProfileToStorage() {
    localStorage.setItem('archinime_cms_profile', JSON.stringify(userProfile));
}

// ============================================
// AUTENTICACIÓN
// ============================================
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        loadProfile();

        // Verificar si está en la lista de permitidos
        if (!ALLOWED_USERS.includes(user.email)) {
            auth.signOut();
            showLoginError("No tienes permiso para acceder al CMS.");
            return;
        }

        // Si no tiene perfil configurado, mostrar modal
        if (!userProfile.nick) {
            showProfileSetup();
        } else {
            showCMS();
        }
    } else {
        showLogin();
    }
});

function signInWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        console.error(error);
        showLoginError(error.message);
    });
}

function logout() {
    auth.signOut();
    localStorage.removeItem('archinime_cms_profile');
    location.reload();
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none';
    document.getElementById('profileSetupModal').style.display = 'none';
    document.getElementById('loginError').style.display = 'none';
}

function showLoginError(msg) {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none';
    document.getElementById('profileSetupModal').style.display = 'none';
    document.getElementById('errorText').innerText = msg;
    document.getElementById('loginError').style.display = 'block';
}

// ============================================
// PERFIL DE USUARIO (UI)
// ============================================
function showProfileSetup() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'none';
    document.getElementById('cmsContent').style.display = 'none';
    document.getElementById('profileSetupModal').style.display = 'flex';

    if (currentUser) {
        document.getElementById('setupAvatarPreview').src = currentUser.photoURL || 'Logo_Archinime.avif';
        document.getElementById('setupNick').value = currentUser.displayName || currentUser.email.split('@')[0];
    }
}

function saveInitialProfile() {
    const nick = document.getElementById('setupNick').value.trim();
    const color = document.getElementById('setupColor').value;
    if (!nick) {
        alert('Debes elegir un nombre público.');
        return;
    }
    userProfile.nick = nick;
    userProfile.color = color;
    saveProfileToStorage();
    showCMS();
}

function openProfileEditor() {
    document.getElementById('profileSetupModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = 'Editar Perfil';
    document.getElementById('modalDesc').innerText = 'Cambia tu nombre o color.';
    document.getElementById('setupNick').value = userProfile.nick;
    document.getElementById('setupColor').value = userProfile.color;
    document.getElementById('setupAvatarPreview').src = currentUser.photoURL || 'Logo_Archinime.avif';
    document.getElementById('btnSaveProfile').innerText = 'GUARDAR CAMBIOS';
    document.getElementById('btnSaveProfile').onclick = () => {
        userProfile.nick = document.getElementById('setupNick').value.trim();
        userProfile.color = document.getElementById('setupColor').value;
        saveProfileToStorage();
        document.getElementById('profileSetupModal').style.display = 'none';
        showCMS();
    };
}

function closeProfileModal() {
    document.getElementById('profileSetupModal').style.display = 'none';
}

// ============================================
// INTERFAZ PRINCIPAL (CMS)
// ============================================
function showCMS() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('userHeader').style.display = 'flex';
    document.getElementById('cmsContent').style.display = 'grid';
    document.getElementById('profileSetupModal').style.display = 'none';

    // Actualizar header con datos del perfil
    const avatar = currentUser.photoURL || 'Logo_Archinime.avif';
    document.getElementById('userAvatarImg').src = avatar;
    document.getElementById('userNameDisplay').innerText = userProfile.nick;
    document.getElementById('userAvatarImg').style.borderColor = userProfile.color;

    // Inyectar elementos dinámicos si no existen
    injectStateSelect();
    injectFinalBlock();
    fillGenres();
}

function injectStateSelect() {
    if (document.getElementById('estadoAnime')) return;
    const genresContainer = document.getElementById('genresContainer');
    if (!genresContainer) return;

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
    sel.style.cssText = "width:100%;padding:14px 16px;background:#181920;border:1px solid #2a2b35;color:white;border-radius:12px;font-size:16px;appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b8d96'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 15px center;background-size:16px;";
}

function injectFinalBlock() {
    if (document.getElementById('finalToggle')) return;
    const musicContainer = document.getElementById('musicContainer');
    if (!musicContainer) return;
    const parent = musicContainer.parentNode;
    const musicHeader = musicContainer.previousElementSibling;
    const wrapper = document.createElement('div');
    wrapper.style.cssText = "margin-bottom:25px;padding:20px;background:#131419;border-radius:16px;border:1px solid #2a2b35;display:flex;align-items:center;justify-content:space-between;";
    wrapper.innerHTML = `
        <div style="font-weight:700;color:#fff;display:flex;align-items:center;gap:10px;">
            <i class="fas fa-flag-checkered" style="color:var(--accent)"></i> MARCAR COMO FINAL
        </div>
        <label class="switch" style="margin:0;">
            <input type="checkbox" id="finalToggle" onchange="requestPreviewUpdate()">
            <span class="slider" style="position:relative;display:inline-block;width:50px;height:26px;background:#333;border-radius:34px;transition:.4s;">
                <span style="position:absolute;content:'';height:20px;width:20px;left:3px;bottom:3px;background:white;border-radius:50%;transition:.4s;"></span>
            </span>
        </label>
    `;
    if (musicHeader && musicHeader.tagName === 'H2') {
        parent.insertBefore(wrapper, musicHeader);
    } else {
        parent.insertBefore(wrapper, musicContainer);
    }
    const toggle = document.getElementById('finalToggle');
    toggle.addEventListener('change', () => {
        const slider = toggle.nextElementSibling;
        const circle = slider.firstElementChild;
        if (toggle.checked) {
            slider.style.background = "#00f0ff";
            circle.style.transform = "translateX(24px)";
        } else {
            slider.style.background = "#333";
            circle.style.transform = "translateX(0)";
        }
        requestPreviewUpdate();
    });
}

const genresList = [
    "Acción", "Animación", "Artes Marciales", "Aventura", "Ciencia ficción", "Cocina", "Comedia",
    "Comedia oscura", "Coming-of-age", "Cosplay", "Crimen", "Cyberpunk", "Deducción Social", "Deportivo",
    "Divulgación Científica", "Drama", "Ecchi", "Espionaje", "Escolar", "Fantasía", "Fantasía oscura",
    "Familiar", "Gag", "Gore", "Harem", "Hentai", "Histórico", "Horror", "Incesto", "Infantil", "Isekai",
    "Isekai Inverso", "Kaiju", "Mahō Shōjo", "Mecha", "Militar", "Mitología", "Misterio", "Musical",
    "Nekketsu", "Parodia", "Policial", "Post-apocalíptico", "Psicológico", "Reverse Harem", "Romance",
    "RPG", "Slice of Life", "Sobrenatural", "Steampunk", "Superhéroes", "Survival", "Survival Game",
    "Suspenso", "Tentáculos", "Terror", "Terror psicológico", "Thriller", "Thriller psicológico",
    "Tokusatsu", "Tragedia", "VRMMO", "Yankī", "Yaoi", "Yuri"
];

function fillGenres() {
    const container = document.getElementById('genresContainer');
    if (container.children.length > 0) return;
    genresList.forEach(g => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${g}" onchange="requestPreviewUpdate()"> ${g}`;
        container.appendChild(label);
    });
}

// ============================================
// BÚSQUEDA Y CARGA DESDE CATÁLOGO LOCAL
// ============================================
function openSearchModal() {
    document.getElementById('searchModal').style.display = 'flex';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
    switchSearchTab('mine');
    loadIndexForSearch();
}

function closeSearchModal() {
    document.getElementById('searchModal').style.display = 'none';
}

function handleModalClick(event) {
    if (event.target.id === 'searchModal') closeSearchModal();
}

function switchSearchTab(mode) {
    currentSearchMode = mode;
    document.getElementById('tabMine').className = mode === 'mine' ? 'tab-btn active' : 'tab-btn';
    document.getElementById('tabGeneral').className = mode === 'general' ? 'tab-btn active' : 'tab-btn';
    if (cachedIndex.length > 0) filterSearch();
}

function loadIndexForSearch() {
    const loading = document.getElementById('loadingSearch');
    loading.style.display = 'block';
    try {
        // catalogoArray viene de catalogo.js
        cachedIndex = catalogoArray.map(anime => ({
            id: anime.id,
            title: anime.title,
            img: anime.img,
            rating: anime.rating || 0,
            uploader: anime.uploader,
            uploaderImg: anime.uploaderImg || 'Logo_Archinime.avif',
            genres: anime.genres,
            isFinal: anime.isFinal
        }));
        cachedIndex.sort((a, b) => b.id - a.id);
        filterSearch();
    } catch (e) {
        document.getElementById('searchResults').innerHTML = `<div style="color:red;text-align:center">Error: ${e.message}</div>`;
    } finally {
        loading.style.display = 'none';
    }
}

function filterSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(_performFilter, 300);
}

function _performFilter() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    const filtered = cachedIndex.filter(a => {
        const match = a.title.toLowerCase().includes(query);
        if (currentSearchMode === 'mine') {
            return match && a.uploader === (currentUser ? currentUser.email : '');
        }
        return match;
    }).slice(0, 1000);

    filtered.forEach(anime => {
        const div = document.createElement('div');
        div.className = 's-result-item';
        div.onclick = () => loadAnimeForEditing(anime.id);
        let extra = '';
        if (currentSearchMode === 'general') {
            extra = ` | Subido por: <img src="${anime.uploaderImg}" style="width:16px;height:16px;border-radius:50%;vertical-align:middle;margin:0 4px"> <span style="color:var(--primary)">${anime.uploader || 'Desconocido'}</span>`;
        }
        div.innerHTML = `
            <img src="${anime.img}" class="s-result-img" onerror="this.src='https://via.placeholder.com/50'">
            <div>
                <div style="font-weight:bold;color:#fff">${anime.title}</div>
                <div style="color:#777;font-size:0.8em">ID: ${anime.id}${extra}</div>
            </div>
        `;
        container.appendChild(div);
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="padding:20px;color:#777;text-align:center">No se encontraron resultados.</div>`;
    }
}

async function loadAnimeForEditing(id) {
    if (!confirm("¿Cargar anime? Se perderán los datos actuales del formulario.")) return;
    closeSearchModal();
    showToast("Cargando...");
    try {
        const animeData = catalogoArray.find(a => a.id == id);
        if (!animeData) throw new Error("No encontrado");

        isEditMode = true;
        currentEditingId = id;

        document.getElementById('editModeBar').style.display = 'block';
        document.getElementById('editIdDisplay').innerText = id;
        document.getElementById('btnActionText').innerText = 'GUARDAR CAMBIOS';

        // Permisos: dueño o admin
        const isAdmin = currentUser.email === 'archinime12@gmail.com';
        const isOwner = animeData.uploader === currentUser.email || isAdmin;
        const saveBtn = document.getElementById('btnSaveAction');
        if (!isOwner) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-lock"></i> SOLO LECTURA';
            showToast("No eres el autor de este anime", true);
        } else {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Sin cambios pendientes';
            saveBtn.style.opacity = '0.5';
        }

        // Rellenar formulario
        document.getElementById('tituloAnime').value = animeData.title || '';
        document.getElementById('portadaAnime').value = animeData.img || '';
        document.getElementById('sinopsisAnime').value = animeData.desc || '';
        document.getElementById('aliasContainer').innerHTML = '';
        (animeData.aliases || []).forEach(a => addAlias(a));

        // Géneros + demografía
        const allCheckboxes = document.querySelectorAll('#genresContainer input');
        allCheckboxes.forEach(cb => cb.checked = false);
        const demoOptions = ['Josei','Kodomo','Seijin','Seinen','Shōjo','Shōnen'];
        let foundDemo = '';
        (animeData.genres || []).forEach(g => {
            if (demoOptions.includes(g)) {
                foundDemo = g;
            } else {
                allCheckboxes.forEach(cb => { if (cb.value === g) cb.checked = true; });
            }
        });
        document.getElementById('demografiaAnime').value = foundDemo;

        // Seasons
        document.getElementById('seasonsContainer').innerHTML = '';
        (animeData.seasons || []).forEach(s => addSeason({
            name: s.name, cover: s.cover, eps: s.eps, type: s.type
        }));

        // Música
        document.getElementById('musicContainer').innerHTML = '';
        (animeData.music || []).forEach(url => addMusic(url));

        // Finalizado
        const finalToggle = document.getElementById('finalToggle');
        if (finalToggle) {
            finalToggle.checked = !!animeData.isFinal;
            finalToggle.dispatchEvent(new Event('change'));
        }

        // Estado
        const estadoSel = document.getElementById('estadoAnime');
        if (estadoSel && animeData.updateType) estadoSel.value = animeData.updateType;

        checkCoverVisual(document.getElementById('portadaAnime'));
        requestPreviewUpdate();
        originalAnimeState = JSON.stringify(generateData());
        checkAutoState();
        showToast("Datos cargados correctamente.");
    } catch (e) {
        console.error(e);
        showToast("Error al cargar: " + e.message, true);
        exitEditMode();
    }
}

// ============================================
// COMPILAR Y DESCARGAR catalogo.js
// ============================================
async function subirAGithHub() {
    const btn = document.getElementById('btnSaveAction');
    if (btn.disabled) return showToast("Bloqueado o sin cambios", true);
    if (!currentUser) return showToast("Error de sesión", true);

    const nuevoAnime = generateData();
    // Validaciones básicas
    if (!nuevoAnime.titulo) return showToast("Falta título", true);
    if (!nuevoAnime.portada) return showToast("Falta portada", true);
    if (!nuevoAnime.sinopsis) return showToast("Falta sinopsis", true);
    if (!nuevoAnime.demografia) return showToast("Elige demografía", true);
    if (nuevoAnime.generos.length === 0) return showToast("Elige géneros", true);
    if (nuevoAnime.estado !== 'PRÓXIMAMENTE ⏳' && nuevoAnime.temporadas.length === 0) return showToast("Agrega contenido", true);

    if (!confirm(`¿Descargar el archivo catalogo.js con los cambios de "${nuevoAnime.titulo}"?`)) return;

    const log = document.getElementById('statusLog');
    log.innerHTML = '🚀 Generando...<br>';

    try {
        // Calcular ID
        let FINAL_ID = nuevoAnime.id;
        if (!isEditMode) {
            const maxId = catalogoArray.reduce((max, a) => Math.max(max, a.id), 0);
            FINAL_ID = maxId + 1;
            log.innerHTML += `✅ Nuevo ID: ${FINAL_ID}<br>`;
        } else {
            log.innerHTML += `📝 Editando ID: ${FINAL_ID}<br>`;
        }

        // Datos complementarios
        let lastSeasonCover = nuevoAnime.portada;
        let lastBlockName = 'Novedad';
        let lastEpTitle = 'Nuevo Contenido';
        if (nuevoAnime.temporadas.length) {
            const last = nuevoAnime.temporadas[nuevoAnime.temporadas.length-1];
            if (last.cover) lastSeasonCover = last.cover;
            if (last.name) lastBlockName = last.name;
            if (last.eps.length) lastEpTitle = last.eps[last.eps.length-1].title;
        }

        const finalGenres = [...nuevoAnime.generos];
        if (nuevoAnime.demografia) {
            const idx = finalGenres.indexOf(nuevoAnime.demografia);
            if (idx !== -1) finalGenres.splice(idx, 1);
            finalGenres.push(nuevoAnime.demografia);
        }

        const animeToSave = {
            id: FINAL_ID,
            title: nuevoAnime.titulo,
            desc: nuevoAnime.sinopsis,
            img: nuevoAnime.portada,
            genres: finalGenres,
            lastUpdate: Date.now(),
            updateType: nuevoAnime.estado,
            latestSeasonCover: lastSeasonCover,
            latestBlockName: lastBlockName,
            latestEpTitle: lastEpTitle,
            isFinal: nuevoAnime.isFinal,
            music: nuevoAnime.musica,
            uploader: currentUser.email,
            uploaderImg: currentUser.photoURL || 'Logo_Archinime.avif',
            seasons: nuevoAnime.temporadas.map(t => ({
                num: t.num,
                name: t.name,
                type: t.type,
                cover: t.cover,
                eps: t.eps.map(e => ({ title: e.title, link: e.link, link2: e.link2 }))
            }))
        };
        if (nuevoAnime.aliases.length) animeToSave.aliases = nuevoAnime.aliases;

        // Actualizar catálogo local
        let newCatalog = isEditMode
            ? catalogoArray.map(a => a.id == FINAL_ID ? animeToSave : a)
            : [...catalogoArray, animeToSave];

        // Ordenar por último update descendente
        newCatalog.sort((a, b) => b.lastUpdate - a.lastUpdate);

        // Generar archivo
        const cabecera = `// Catalogo Archinime – ${new Date().toLocaleDateString()}\n// Total animes: ${newCatalog.length}\n\n`;
        const contenido = cabecera + `const catalogoArray = ${JSON.stringify(newCatalog, null, 2)};\n`;

        // Descargar
        const blob = new Blob([contenido], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'catalogo.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        log.innerHTML += '✨ Archivo descargado. Sustitúyelo en GitHub.<br>';
        showToast('catalogo.js generado. Actualiza el repositorio.');
        alert('✅ Archivo descargado.\nReemplázalo en tu repositorio de GitHub para que la web se actualice.');
        highlightLogoutButton();
    } catch (e) {
        console.error(e);
        log.innerHTML += `❌ ERROR: ${e.message}<br>`;
        showToast("Error crítico", true);
    }
}

// ============================================
// ELIMINAR ANIME (descarga catálogo actualizado)
// ============================================
async function deleteCurrentAnime(id) {
    if (currentUser.email !== 'archinime12@gmail.com') {
        alert('Solo el administrador puede eliminar.');
        return;
    }
    if (!confirm(`¿Eliminar anime ID ${id}?`)) return;

    const newCatalog = catalogoArray.filter(a => a.id != id);
    newCatalog.sort((a, b) => a.id - b.id);

    const cabecera = `// Catalogo Archinime (anime ${id} eliminado)\n\n`;
    const contenido = cabecera + `const catalogoArray = ${JSON.stringify(newCatalog, null, 2)};\n`;

    const blob = new Blob([contenido], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalogo.js';
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Archivo actualizado descargado. Súbelo a GitHub.');
    exitEditMode();
}

// ============================================
// GENERAR OBJETO ANIME DESDE FORMULARIO
// ============================================
function generateData() {
    const selectedGenres = [];
    document.querySelectorAll('#genresContainer input:checked').forEach(cb => selectedGenres.push(cb.value));
    const demoSelect = document.getElementById('demografiaAnime').value;
    const aliasList = [];
    document.querySelectorAll('.alias-input').forEach(i => { if (i.value.trim()) aliasList.push(i.value.trim()); });
    let selectedState = "ESTRENO 🚨";
    const stEl = document.getElementById('estadoAnime');
    if (stEl) selectedState = stEl.value;
    let isFinal = false;
    const finalTog = document.getElementById('finalToggle');
    if (finalTog) isFinal = finalTog.checked;

    const anime = {
        id: isEditMode ? currentEditingId : 0,
        titulo: document.getElementById('tituloAnime').value.trim(),
        aliases: aliasList,
        portada: document.getElementById('portadaAnime').value.trim(),
        sinopsis: document.getElementById('sinopsisAnime').value.trim(),
        demografia: demoSelect,
        generos: selectedGenres,
        musica: [],
        temporadas: [],
        uploader: currentUser.email,
        uploaderAvatar: currentUser.photoURL || "Logo_Archinime.avif",
        estado: selectedState,
        isFinal: isFinal
    };

    document.querySelectorAll('#musicContainer .m-url').forEach(i => { if (i.value) anime.musica.push(i.value.trim()); });

    let globalOrder = 1, seasonCount = 0, ovaCount = 0, movieCount = 0, specialCount = 0, spinOffCount = 0;
    document.querySelectorAll('.season-card').forEach(card => {
        const eps = [];
        const sName = card.querySelector('.s-name').value;
        const sType = card.querySelector('.s-type').value;
        const startSel = card.querySelector('.s-start-index');
        const startNum = startSel ? parseInt(startSel.value) : 1;

        if (sType === 'Temporada') seasonCount++;
        if (sType === 'OVA') ovaCount++;
        if (sType === 'Pelicula') movieCount++;
        if (sType === 'Especial') specialCount++;

        card.querySelectorAll('.chapter-row').forEach((row, idx) => {
            const lat = row.querySelector('.c-link-lat').value.trim();
            const sub = row.querySelector('.c-link-sub').value.trim();
            let customTitleInput = row.querySelector('.c-title-ov').value.trim();
            let detailTitle = "";
            let currentEpNum = startNum + idx;

            if (sType === 'Temporada') {
                detailTitle = `Capítulo ${currentEpNum}`;
            } else if (sType === 'Spin-Off') {
                detailTitle = `Capítulo ${currentEpNum}`;
            } else if (sType === 'OVA') {
                detailTitle = customTitleInput || sName;
            } else if (sType === 'Pelicula') {
                detailTitle = customTitleInput || sName;
            } else if (sType === 'Especial') {
                detailTitle = customTitleInput || sName;
            }

            if (sub || lat) {
                eps.push({ num: idx + 1, link: lat, link2: sub, title: detailTitle });
            }
        });

        if (eps.length > 0) {
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

// ============================================
// FUNCIONES AUXILIARES DE UI (estilo, temporadas, vista previa)
// ============================================
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = isError
        ? `<i class="fas fa-times-circle" style="color:#ff4757"></i> ${msg}`
        : `<i class="fas fa-check-circle" style="color:var(--accent)"></i> ${msg}`;
    toast.className = 'show';
    setTimeout(() => { toast.className = ''; }, 4000);
}

function autoCap(input) {
    if (input.value) input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
}

function validate(input) {
    if (!input.value.trim()) input.style.borderColor = '#ff4757';
    else input.style.borderColor = '#2a2b35';
}

/**
 * Extrae la URL del atributo src de un iframe si el texto completo es un iframe.
 * @param {string} value - El texto a evaluar
 * @returns {string|null} - La URL del src o null si no es un iframe válido
 */
function extractUrlFromIframe(value) {
    if (!value || typeof value !== 'string') return null;
    // Buscar etiqueta iframe y extraer src (comillas simples o dobles)
    const iframeRegex = /<iframe[^>]*src=["']([^"']+)["'][^>]*>/i;
    const match = value.match(iframeRegex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

function smartLinkConvert(input) {
    let val = input.value.trim();
    let changed = false;

    // ----- NUEVA FUNCIONALIDAD: convertir iframe a su URL src -----
    const extractedUrl = extractUrlFromIframe(val);
    if (extractedUrl) {
        input.value = extractedUrl;
        changed = true;
        showToast("Iframe convertido a enlace directo");
    } else {
        // Conversiones existentes
        if (val.includes('http://10.22.7.119:8080')) {
            input.value = val.replace('http://10.22.7.119:8080', 'https://fsb-latest-gdv3.onrender.com');
            changed = true;
        }
        if (val.includes('dropbox.com') && val.endsWith('&dl=0')) {
            input.value = val.replace('&dl=0', '&raw=1');
            changed = true;
        }
        const driveRegex = /(https:\/\/drive\.google\.com\/file\/d\/[^\/]+)\/(?:view|preview)(?:\?.*)?/;
        if (driveRegex.test(val) && !val.endsWith('/preview')) {
            const match = val.match(driveRegex);
            if (match && match[1]) {
                input.value = match[1] + '/preview';
                changed = true;
            }
        }
        if (/ok\.ru\/video\//i.test(val)) {
            input.value = val.replace(/ok\.ru\/video\//i, 'ok.ru/videoembed/');
            changed = true;
        }
        if (val.includes('odysee.com/') && !val.includes('odysee.com/$/embed/')) {
            input.value = val.replace(/odysee\.com\//i, 'odysee.com/$/embed/');
            changed = true;
        }
    }

    if (changed) {
        if (input.id === 'portadaAnime') checkCoverVisual(input);
        else if (input.classList.contains('m-url')) updateAudioPreview(input);
        requestPreviewUpdate();
    }
}

function checkCoverVisual(input) {
    const img = document.getElementById('mainCoverPreview');
    const display = document.getElementById('dimDisplay');
    if (!img || !display) return;
    const val = input.value.trim();
    if (val === "") {
        img.style.display = 'none';
        display.innerText = "";
        return;
    }
    img.src = val;
    img.style.display = 'block';
    display.innerText = "Verificando...";
    img.onload = function () {
        const w = this.naturalWidth;
        const h = this.naturalHeight;
        const allowed = [{ w: 1000, h: 1500 }, { w: 1400, h: 2100 }, { w: 2000, h: 3000 }, { w: 2090, h: 3135 }, { w: 3412, h: 5120 }];
        const isValid = allowed.some(d => d.w === w && d.h === h);
        if (isValid) {
            display.innerHTML = `<span style="color:#00ffbf"><i class="fas fa-check"></i> Válido: ${w}x${h}px</span>`;
            input.style.borderColor = '#00ffbf';
        } else {
            display.innerHTML = `<span style="color:#ff4757"><i class="fas fa-times"></i> Inválido: ${w}x${h}px</span>`;
            input.style.borderColor = '#ff4757';
        }
    };
    img.onerror = function () {
        display.innerText = "URL inválida";
        img.style.display = 'none';
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
        <button class="btn-mini-del" onclick="this.parentElement.remove(); requestPreviewUpdate()"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(div);
    if (url) updateAudioPreview(div.querySelector('.m-url'));
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

// ============================================
// GESTIÓN DE TEMPORADAS (ADD, MOVE, DELETE, RENDER)
// ============================================
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
            <button class="btn-move" onclick="moveSeason(this, -1)"><i class="fas fa-arrow-up"></i></button>
            <button class="btn-move" onclick="moveSeason(this, 1)"><i class="fas fa-arrow-down"></i></button>
            <button class="btn-del-section" onclick="this.closest('.season-card').remove(); updateAllBlockNames(); checkAutoState(); requestPreviewUpdate()"><i class="fas fa-trash"></i> ELIMINAR</button>
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

    if (data) {
        let selectedType = data.type;
        if (!selectedType) {
            if (data.name.startsWith('Temporada')) selectedType = 'Temporada';
            else if (data.name.startsWith('Película')) selectedType = 'Pelicula';
            else if (data.name.startsWith('OVA')) selectedType = 'OVA';
            else if (data.name.startsWith('Especial')) selectedType = 'Especial';
            else selectedType = 'Spin-Off';
        }
        const typeSel = div.querySelector('.s-type');
        typeSel.value = selectedType;
        const nameInp = div.querySelector('.s-name');
        nameInp.value = data.name;
        div.querySelector('.s-img').value = data.cover;
        handleSeasonTypeChange(typeSel);

        const startSel = div.querySelector('.s-start-index');
        if (data.eps && data.eps.length > 0) {
            const firstTitle = data.eps[0].title || "";
            if (firstTitle.includes(" 0") || firstTitle.includes("Capítulo 0")) startSel.value = "0";
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
            else if (type === 'Spin-Off') { spinOffCount++; if (!nameInput.value) nameInput.value = `Spin-Off ${spinOffCount}`; }
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
    if (countInput.value) renderChapters(countInput);
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
    if (existingEps.length === 0) {
        card.querySelectorAll('.chapter-row').forEach(row => {
            currentData.push({
                lat: row.querySelector('.c-link-lat').value,
                sub: row.querySelector('.c-link-sub').value,
                title: row.querySelector('.c-title-ov').value
            });
        });
    }

    list.innerHTML = '';
    if (isNaN(count) || count < 1) return;

    for (let i = 0; i < count; i++) {
        const row = document.createElement('div');
        row.className = 'chapter-row';
        let sub = '', lat = '', customTitle = '';
        if (existingEps[i]) {
            lat = existingEps[i].link || '';
            sub = existingEps[i].link2 || '';
            if (!['Temporada', 'Spin-Off'].includes(type)) customTitle = existingEps[i].title;
        } else if (currentData[i]) {
            lat = currentData[i].lat;
            sub = currentData[i].sub;
            customTitle = currentData[i].title;
        }
        let currentNum = startNum + i;
        let titleInputDisabled = ['Temporada', 'Spin-Off'].includes(type) ? "disabled" : "";
        let titlePlaceholder = titleInputDisabled ? `Capítulo ${currentNum}` : "Nombre (ej: El viaje...)";
        if (titleInputDisabled) customTitle = `Capítulo ${currentNum}`;

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

function checkAutoState() {
    const stateSel = document.getElementById('estadoAnime');
    if (!stateSel) return;
    let totalCaps = 0;
    document.querySelectorAll('.s-count').forEach(inp => {
        const val = parseInt(inp.value);
        if (!isNaN(val) && !inp.disabled) totalCaps += val;
        if (inp.disabled) totalCaps += 1;
    });
    if (stateSel.value !== 'PRÓXIMAMENTE ⏳' && stateSel.value !== 'Ninguna') {
        if (totalCaps === 1) stateSel.value = "ESTRENO 🚨";
        else if (totalCaps > 1) stateSel.value = "NUEVO 🔥";
    }
}

// ============================================
// VISTA PREVIA
// ============================================
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
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> GUARDAR CAMBIOS';
    } else {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.innerHTML = '<i class="fas fa-check"></i> Sin cambios pendientes';
    }
}

function updateWebPreview() {
    const titleEl = document.getElementById('webTitle');
    const titleVal = document.getElementById('tituloAnime').value;
    if (titleEl) titleEl.innerText = titleVal || 'Título';
    const coverUrl = document.getElementById('portadaAnime').value;
    const webCover = document.getElementById('webCover');
    if (coverUrl && webCover) webCover.src = coverUrl;
    document.getElementById('previewId').innerText = isEditMode ? currentEditingId : "###";
    const demo = document.getElementById('demografiaAnime').value;
    document.getElementById('webDemography').innerText = demo ? demo.toUpperCase() : 'DEMO';

    const aliases = [];
    document.querySelectorAll('.alias-input').forEach(i => { if (i.value.trim()) aliases.push(i.value.trim()) });
    document.getElementById('previewAliasesList').innerText = aliases.length > 0 ? aliases.join(', ') : "";

    const tagsContainer = document.getElementById('webTags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        document.querySelectorAll('#genresContainer input:checked').forEach(cb => {
            let s = document.createElement('span');
            s.style.cssText = "font-size:0.65em; padding:3px 8px; border-radius:4px; background:rgba(255,255,255,0.1); color:#ccc;";
            s.innerText = cb.value;
            tagsContainer.appendChild(s);
        });
    }

    const grid = document.getElementById('webSeasonsGrid');
    if (grid) {
        grid.innerHTML = '';
        document.querySelectorAll('.season-card').forEach(card => {
            const img = card.querySelector('.s-img').value;
            const name = card.querySelector('.s-name').value;
            const type = card.querySelector('.s-type').value;
            const count = card.querySelector('.s-count').value || 0;
            if (name) {
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
// MODO EDICIÓN Y OTROS
// ============================================
function exitEditMode() {
    isEditMode = false;
    currentEditingId = null;
    originalAnimeState = null;
    document.getElementById('editModeBar').style.display = 'none';
    document.getElementById('btnActionText').innerText = 'COMPILAR Y DESCARGAR catalogo.js';
    const saveBtn = document.getElementById('btnSaveAction');
    saveBtn.disabled = false;
    saveBtn.style.opacity = '1';
    location.reload();
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
    }
}

// ============================================
// INICIALIZACIÓN AL CARGAR
// ============================================
window.onload = () => {
    fillGenres();
};