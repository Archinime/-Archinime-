/* Archivo: script-index.js - Versión final estable con Firestore */
/* -------------------------------------------------- */
/* PAGINACIÓN + FILTROS EN CLIENTE         */
/* -------------------------------------------------- */

// ============================================
// VARIABLES GLOBALES PARA FIRESTORE
// ============================================
let lastVisible = null;
let isLoading = false;
let hasMore = true;
let currentFilters = {
    search: '',
    genre: '',
    demographic: '',
    rating: ''
};
let debounceTimer = null;
const gridEl = document.getElementById('grid');
const loadingEl = document.getElementById('loadingMore');

// ============================================
// FUNCIONES DE RENDERIZADO
// ============================================
function render(list, append = false) {
    if (!append) gridEl.innerHTML = '';
    if (!list || list.length === 0) {
        if (!append && gridEl.children.length === 0) mostrarNoResultados();
        return;
    }

    const fragment = document.createDocumentFragment();
    list.forEach(a => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = a.id;
        card.setAttribute('onclick', `location='anime-detail.html?id=${a.id}'`);
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');

        const rating = (a.rating != null && !isNaN(a.rating)) ? a.rating.toFixed(1) : '—';
        card.innerHTML = `
            <img src="${a.img}" alt="${a.title}" loading="lazy">
            <div class="info">
                <strong>${a.title}</strong>
                <span class="rating-value">⭐ ${rating}</span>
            </div>
        `;
        fragment.appendChild(card);
    });
    gridEl.appendChild(fragment);
    aplicarTiltANuevasCards();
}

function mostrarNoResultados() {
    if (!document.getElementById('archinime-no-results-css')) {
        const style = document.createElement('style');
        style.id = 'archinime-no-results-css';
        style.innerHTML = `
            .cyber-no-results {
                grid-column: 1 / -1;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                padding: 60px 20px; background: rgba(10, 12, 16, 0.7); border: 1px solid var(--neon-purple);
                border-radius: 16px;
                box-shadow: 0 0 30px rgba(188, 19, 254, 0.15), inset 0 0 20px rgba(0, 243, 255, 0.05); backdrop-filter: blur(10px);
                text-align: center; margin-top: 20px; animation: fadeInCyber 0.5s ease forwards;
            }
            .cyber-no-results i { font-size: 3.5rem;
                color: var(--neon-cyan); margin-bottom: 15px; filter: drop-shadow(0 0 10px var(--neon-cyan)); animation: floatIcon 3s ease-in-out infinite;
            }
            .cyber-no-results h2 { font-family: 'Orbitron', sans-serif; font-size: 1.8rem;
                color: #fff; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px var(--neon-purple);
            }
            .cyber-no-results p { color: #aaa; font-size: 1rem;
                margin-bottom: 25px; max-width: 500px; line-height: 1.5; }
            .btn-cyber-reset { background: transparent;
                border: 2px solid var(--neon-pink); color: #fff; font-family: 'Orbitron', sans-serif; padding: 12px 30px; font-size: 1rem; border-radius: 8px; cursor: pointer;
                transition: all 0.3s ease; box-shadow: 0 0 15px rgba(255, 0, 85, 0.3);
            }
            .btn-cyber-reset:hover { background: var(--neon-pink);
                box-shadow: 0 0 25px var(--neon-pink); color: #fff; transform: scale(1.05); }
            @keyframes fadeInCyber { from { opacity: 0;
                transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes floatIcon { 0%, 100% { transform: translateY(0);
            } 50% { transform: translateY(-10px); } }
        `;
        document.head.appendChild(style);
    }

    gridEl.innerHTML = `
        <div class="cyber-no-results">
            <i class="fas fa-satellite-dish"></i>
            <h2>¡Ups! Sin Resultados</h2>
            <p>Verifica el nombre o prueba buscar por un alias.<br>Si no aparece, puedes solicitar que se suba a la base de datos.</p>
            <button class="btn-cyber-reset" id="btn-reset">RESTAURAR RADARES</button>
        </div>
    `;
    const btn = document.getElementById('btn-reset');
    if (btn) btn.addEventListener('click', resetearFiltros);
}

// ============================================
// CARGA DE DATOS DESDE FIRESTORE (PAGINACIÓN)
// ============================================
async function cargarAnimes(reset = true) {
    if (isLoading) return;
    if (!reset && !hasMore) return;

    isLoading = true;
    if (reset) {
        gridEl.innerHTML = '';
        lastVisible = null;
        hasMore = true;
    }
    if (loadingEl) loadingEl.style.display = 'block';
    try {
        let query = db.collection('catalogo');
        // Solo aplicamos el filtro de género en Firestore (más eficiente)
        if (currentFilters.genre) {
            query = query.where('genres', 'array-contains', currentFilters.genre);
        }

        query = query.orderBy('title').limit(20);
        if (lastVisible) query = query.startAfter(lastVisible);
        const snapshot = await query.get();
        if (loadingEl) loadingEl.style.display = 'none';
        if (snapshot.empty) {
            hasMore = false;
            if (reset) mostrarNoResultados();
            isLoading = false;
            return;
        }

        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        let animes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Normalización para filtros cliente
        const normalize = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        // Filtro de demografía en cliente (para evitar doble array-contains)
        if (currentFilters.demographic) {
            const target = normalize(currentFilters.demographic);
            animes = animes.filter(a => (a.genres || []).some(g => normalize(g) === target));
        }

        // Búsqueda por texto (título + aliases)
        if (currentFilters.search) {
            const term = normalize(currentFilters.search);
            animes = animes.filter(a => {
                const titles = [a.title, ...(a.aliases || [])];
                return titles.some(t => normalize(t).includes(term));
            });
        }

        // Filtro por rating
        if (currentFilters.rating) {
            animes = animes.filter(a => {
                const r = a.rating || 0;
                if (currentFilters.rating === 'excellent') return r >= 4.8;
                if (currentFilters.rating === 'good') return r >= 4.6 && r < 4.8;
                if (currentFilters.rating === 'regular') return r < 4.6;
                return true;
            });
        }

        render(animes, !reset);
        if (snapshot.docs.length < 20) hasMore = false;
    } catch (error) {
        console.error('Error cargando catálogo:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        if (reset) {
            gridEl.innerHTML = `<div class="error-message" style="grid-column:1/-1; text-align:center; padding:40px; color:var(--neon-pink);">Error al cargar.
            Recarga la página.<br><small>${error.message}</small></div>`;
        }
    } finally {
        isLoading = false;
    }
}

// ============================================
// FUNCIONES AUXILIARES PARA FILTROS
// ============================================
function normalizeText(s) {
    try { return (s || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, ''); }
    catch(e) { return (s || '').toLowerCase().replace(/[\u0300-\u036f]/g, ''); }
}

function debouncedCargar() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => cargarAnimes(true), 300);
}

function resetearFiltros() {
    document.getElementById('search').value = '';
    document.getElementById('genre-select').value = '';
    document.getElementById('demographic-select').value = '';
    document.getElementById('rating-select').value = '';
    currentFilters = { search: '', genre: '', demographic: '', rating: '' };
    cargarAnimes(true);
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    cargarAnimes(true);

    const searchInput = document.getElementById('search');
    const genreSelect = document.getElementById('genre-select');
    const demographicSelect = document.getElementById('demographic-select');
    const ratingSelect = document.getElementById('rating-select');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            debouncedCargar();
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); cargarAnimes(true); }
        });
    }
    if (genreSelect) genreSelect.addEventListener('change', (e) => { currentFilters.genre = e.target.value; cargarAnimes(true); });
    if (demographicSelect) demographicSelect.addEventListener('change', (e) => { currentFilters.demographic = e.target.value; cargarAnimes(true); });
    if (ratingSelect) ratingSelect.addEventListener('change', (e) => { currentFilters.rating = e.target.value; cargarAnimes(true); });
    window.addEventListener('scroll', () => {
        if (isLoading || !hasMore) return;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) cargarAnimes(false);
    });
});

// ============================================
// TILT EFFECT
// ============================================
function aplicarTiltANuevasCards() {
    document.querySelectorAll('.card:not([data-tilt-init])').forEach(card => {
        card.dataset.tiltInit = 'true';
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });
}

function handleCardTilt(e) {
    const card = e.currentTarget;
    if (card.tiltRAF) cancelAnimationFrame(card.tiltRAF);
    card.tiltRAF = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
}

function resetCardTilt(e) {
    const card = e.currentTarget;
    if (card.tiltRAF) cancelAnimationFrame(card.tiltRAF);
    card.style.transform = '';
}

// ============================================
// HELPERS DE RENDIMIENTO
// ============================================
function getPerformanceHints() {
    let cores = navigator.hardwareConcurrency || 4;
    let deviceMem = navigator.deviceMemory || 4;
    let prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let processingScale = 1.0;
    if (cores >= 8 && deviceMem >= 8) processingScale = 1.0;
    else if (cores >= 4 && deviceMem >= 4) processingScale = 0.85;
    else if (cores >= 2 && deviceMem >= 2) processingScale = 0.6;
    else processingScale = 0.45;
    if (prefersReducedMotion) processingScale = Math.min(processingScale, 0.55);
    return { cores, deviceMem, processingScale, prefersReducedMotion };
}

// ============================================
// LÓGICA DE MÚSICA
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-music');
    const hints = getPerformanceHints();
    if (typeof musicList === 'undefined' || musicList.length === 0) return;

    let currentMusicIndex = Math.floor(Math.random() * musicList.length);
    function playByIndex(idx) {
        currentMusicIndex = ((idx % musicList.length) + musicList.length) % musicList.length;
        audio.src = musicList[currentMusicIndex];
        audio.load();
        audio.volume = 0.75;
    
        if (hints.processingScale >= 0.6) {
            audio.play().catch(() => {
                document.addEventListener('click', () => { audio.play().catch(() => {}); }, { once: true });
            });
        }
    }
    audio.addEventListener('ended', () => { currentMusicIndex = currentMusicIndex + 1; playByIndex(currentMusicIndex); });
    playByIndex(currentMusicIndex);
});

// ============================================
// CHROMA + FG LOGIC
// ============================================
const fgContainer = document.getElementById('fgContainer');
const fgCanvas = document.getElementById('fgCanvas');
const fgVideo = document.getElementById('fgVideo');
const bgVideo = document.getElementById('bg-video');
const bgMusic = document.getElementById('bg-music');
const ctx = fgCanvas.getContext ? fgCanvas.getContext('2d', { alpha: true }) : null;

let off = document.createElement('canvas');
let offCtx = off.getContext ? off.getContext('2d') : null;
let chromaIntervalId = null;
let chromaFps = 24;
let usingChroma = true;
let visibilityPaused = false;
let currentVideoObj = null;
let lastObjectUrl = null;
let isAnimatingExplosion = false;
let scheduledTimer = null;

function pickRandomVideo(excludeId){
    if (typeof videoList === 'undefined' || videoList.length === 0) return null;
    if (videoList.length === 1) return videoList[0];
    const candidates = videoList.filter(v => v.id !== excludeId);
    if (candidates.length === 0) return videoList[Math.floor(Math.random()*videoList.length)];
    return candidates[Math.floor(Math.random()*candidates.length)];
}

function placeRandomSide(infoObj){
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const margin = window.matchMedia('(max-width:767px)').matches ? '12px' : '20px';
    if (side === 'left') { fgContainer.style.left = margin; fgContainer.style.right = ''; }
    else { fgContainer.style.right = margin; fgContainer.style.left = ''; }
}

function drawProcessedToScreen(){
    if (!ctx || !fgCanvas) return;
    const cw = fgCanvas.clientWidth || parseInt(fgCanvas.style.width) || fgCanvas.width;
    const ch = fgCanvas.clientHeight || parseInt(fgCanvas.style.height) || fgCanvas.height;
    const vw = off.width || 1;
    const vh = off.height || 1;
    ctx.clearRect(0, 0, cw, ch);
    if (vw === 0 || vh === 0 || cw === 0 || ch === 0) return;
    const scale = Math.min(cw / vw, ch / vh);
    const dw = Math.round(vw * scale);
    const dh = Math.round(vh * scale);
    const dx = Math.round((cw - dw) / 2);
    const dy = Math.round((ch - dh) / 2);
    ctx.drawImage(off, 0, 0, vw, vh, dx, dy, dw, dh);
}

function adjustContainerToVideo(video, infoObj){
    const vw = video.videoWidth || 16;
    const vh = video.videoHeight || 9;
    const hints = getPerformanceHints();
    let maxW = Math.min(window.innerWidth * 0.32, 360);
    let maxH = Math.min(window.innerHeight * 0.4, 640);
    if (window.matchMedia('(max-width:767px)').matches) {
        if (infoObj && infoObj.id === 'rem') {
            maxW = Math.min(window.innerWidth * 0.30, 180);
            maxH = Math.min(window.innerHeight * 0.30, 200);
        } else if (infoObj && infoObj.id === 'hola') {
            maxW = Math.min(window.innerWidth * 0.62, 380);
            maxH = Math.min(window.innerHeight * 0.62, 520);
        } else {
            maxW = Math.min(window.innerWidth * 0.45, 260);
            maxH = Math.min(window.innerHeight * 0.45, 420);
        }
    } else {
        maxW = Math.min(window.innerWidth * 0.32, 360);
        maxH = Math.min(window.innerHeight * 0.4, 640);
    }

    const displayScale = Math.min(maxW / vw, maxH / vh, 1.0);
    const displayW = Math.max(120, Math.round(vw * displayScale));
    const displayH = Math.max(80, Math.round(vh * displayScale));
    fgContainer.style.width = displayW + 'px';
    fgContainer.style.height = displayH + 'px';

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    fgCanvas.width = Math.round(displayW * dpr);
    fgCanvas.height = Math.round(displayH * dpr);
    fgCanvas.style.width = displayW + 'px';
    fgCanvas.style.height = displayH + 'px';
    if (ctx && typeof ctx.setTransform === 'function') {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const capHigh = 1280;
    const capMed = 720;
    const hintsScale = hints.processingScale;
    const chosenCap = hintsScale >= 0.85 ? capHigh : hintsScale >= 0.6 ? capMed : 480;

    const sourceW = vw;
    const sourceH = vh;
    const sourceRatio = sourceW / sourceH || (16/9);

    let offW = Math.min(sourceW, chosenCap);
    let offH = Math.round(offW / sourceRatio);
    if (offH > chosenCap) {
        offH = chosenCap;
        offW = Math.round(offH * sourceRatio);
    }
    off.width = Math.max(16, offW);
    off.height = Math.max(16, offH);

    resizeFireCanvas();
}

function applyChromaKey(imageData, settings, keyColor = 'green'){
    const data = imageData.data;
    const len = data.length;
    const thresh = settings.threshold ?? 0.4; const minDiff = settings.diff ?? 30;
    const soften = settings.soft ?? 30;
    for (let i = 0; i < len; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (a === 0) continue;
        const sum = r + g + b + 1;
        if (keyColor === 'blue') {
            const maxrg = Math.max(r, g);
            const blueScore = (b - maxrg) / sum;
            const isBlueCandidate = (b - maxrg) > minDiff && blueScore > (thresh - 0.2);
            if (!isBlueCandidate) { data[i+3] = 255; continue; }
            const diff = b - maxrg;
            if (soften <= 0) data[i+3] = (diff > minDiff) ? 0 : 255;
            else {
                const t = (diff - minDiff) / soften;
                const clamped = Math.max(0, Math.min(1, t));
                data[i+3] = Math.round((1 - clamped) * 255);
            }
        } else {
            const maxrb = Math.max(r, b);
            const greenScore = (g - maxrb) / sum;
            const isGreenCandidate = (g - maxrb) > minDiff && greenScore > (thresh - 0.2);
            if (!isGreenCandidate) { data[i+3] = 255; continue; }
            const diff = g - maxrb;
            if (soften <= 0) data[i+3] = (diff > minDiff) ? 0 : 255;
            else {
                const t = (diff - minDiff) / soften;
                const clamped = Math.max(0, Math.min(1, t));
                data[i+3] = Math.round((1 - clamped) * 255);
            }
        }
    }
    return imageData;
}

function processFrame(video, infoObj){
    if (!usingChroma || visibilityPaused) return;
    if (video.paused || video.ended) return;
    if (!offCtx) return;
    try { 
        offCtx.drawImage(video, 0, 0, off.width, off.height);
    } catch (err) {
        usingChroma = false; fgCanvas.style.display = 'none';
        fgVideo.style.display = 'block';
        fgVideo.play().catch(()=>{ document.getElementById('playOverlay').style.display = 'flex'; });
        return;
    }
    
    let frame;
    try { 
        frame = offCtx.getImageData(0,0,off.width,off.height);
    } catch (err) {
        usingChroma = false; fgCanvas.style.display = 'none'; fgVideo.style.display = 'block';
        fgVideo.play().catch(()=>{ document.getElementById('playOverlay').style.display = 'flex'; });
        return;
    }
    
    const settings = infoObj && infoObj.preset ? infoObj.preset : { threshold:0.4, diff:30, soft:30 };
    const keyColor = infoObj && infoObj.keyColor ? infoObj.keyColor : 'green';
    const processed = applyChromaKey(frame, settings, keyColor);
    offCtx.putImageData(processed, 0, 0);
    drawProcessedToScreen();
}

function startChromaIntervalIfNeeded(infoObj){
    const hints = getPerformanceHints();
    chromaFps = hints.processingScale >= 0.85 ? 30 : hints.processingScale >= 0.6 ? 20 : 12;
    stopChromaInterval();
    if (!usingChroma || visibilityPaused) return;
    chromaIntervalId = setInterval(()=>{ processFrame(fgVideo, infoObj); }, Math.round(1000 / chromaFps));
}

function stopChromaInterval(){
    if (chromaIntervalId) { clearInterval(chromaIntervalId); chromaIntervalId = null; }
}

function showContainer(){ fgContainer.style.display = 'flex'; fgContainer.classList.remove('exit'); fgContainer.classList.add('enter'); }
function hideContainerInstantlyForTransition(){ fgContainer.classList.remove('enter'); fgContainer.classList.add('exit'); }

function scheduleNextVideo(afterSeconds = 3, excludeId = null){
    if (scheduledTimer){ clearTimeout(scheduledTimer); scheduledTimer = null; }
    hideContainerInstantlyForTransition();
    scheduledTimer = setTimeout(()=>{ const next = pickRandomVideo(excludeId); if (!next) return; playVideoClip(next); }, afterSeconds*1000);
}

// Fuegos artificiales
const fireCanvas = document.createElement('canvas');
fireCanvas.className = 'firework-canvas';
fireCanvas.style.position = 'absolute';
fireCanvas.style.left = '0'; fireCanvas.style.top = '0';
fireCanvas.style.width = '100%'; fireCanvas.style.height = '100%';
fireCanvas.style.zIndex = '9999'; fireCanvas.style.pointerEvents = 'none';
if (fgContainer) {
    fgContainer.appendChild(fireCanvas);
} else {
    console.warn('fgContainer no existe al crear fireCanvas — creando canvas sin appendChild.');
}
const fctx = fireCanvas.getContext ? fireCanvas.getContext('2d') : null;

function resizeFireCanvas(){
    const rect = fgContainer.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    
    if (fireCanvas.width !== w || fireCanvas.height !== h) {
        fireCanvas.width = w;
        fireCanvas.height = h;
        fireCanvas.style.width = rect.width + 'px';
        fireCanvas.style.height = rect.height + 'px';
        fctx.setTransform(dpr,0,0,dpr,0,0);
    }
}
window.addEventListener('resize', resizeFireCanvas, {passive:true});
setTimeout(resizeFireCanvas, 120);

// MEJORA: Aumentamos velocidad, vida y expansión de chispas
function explodeParticlesAt(x, y, colors, count = 150, duration = 900) {
    const hints = getPerformanceHints();
    const rect = fgContainer.getBoundingClientRect();
    const areaFactor = Math.min(2.2, Math.max(0.45, (rect.width * rect.height) / (360 * 640)));
    let effectiveCount = Math.round(count * areaFactor);
    
    if (hints.processingScale < 0.45) effectiveCount = Math.max(12, Math.round(effectiveCount * 0.30));
    else if (hints.processingScale < 0.6) effectiveCount = Math.max(18, Math.round(effectiveCount * 0.45));
    else if (hints.processingScale < 0.85) effectiveCount = Math.max(28, Math.round(effectiveCount * 0.7));
    effectiveCount = Math.min(300, effectiveCount);
    const targetFps = hints.processingScale >= 0.85 ? 50 : hints.processingScale >= 0.6 ? 36 : 24;
    const frameInterval = 1000 / targetFps;

    const particles = [];
    function rnd(min, max){ return Math.random()*(max-min)+min; }

    for (let i = 0; i < effectiveCount; i++) {
        const angle = rnd(0, Math.PI*2);
        const speed = rnd(3.5, 12.0); // FIX: Chispas más rápidas y lejanas
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed * rnd(0.8, 1.5),
            vy: Math.sin(angle) * speed * rnd(0.8, 1.5) - rnd(1.0, 3.0),
            life: rnd(duration*0.8, duration*1.2), // FIX: Viven más tiempo
            age: 0,
            radius: rnd(2.0, 6.0),
            color: colors[Math.floor(Math.random()*colors.length)]
        });
    }

    const safeTimeoutMs = Math.round(duration + 400);
    const start = performance.now();
    return new Promise(resolve => {
        let lastFrameTime = 0;
        let finished = false;
        const safeTimer = setTimeout(() => {
            if (!finished) {
                finished = true;
                try { fctx.clearRect(0,0,fireCanvas.width,fireCanvas.height); } catch(e){}
                resolve();
            }
        }, safeTimeoutMs);

        function frame(now){
            try {
                if (finished) return;
                if (!lastFrameTime) lastFrameTime = now;
            
                const dt = now - lastFrameTime;
                
                if (dt < frameInterval) {
                    requestAnimationFrame(frame);
                    return;
                }
                lastFrameTime = now;

                const t = now - start;
                fctx.clearRect(0,0,fireCanvas.width,fireCanvas.height);

                for (let p of particles) {
                    p.age = t;
                    const lifeRatio = Math.max(0, 1 - p.age / p.life);
                    p.x += p.vx * (dt/16.67);
                    p.y += p.vy * (dt/16.67);
                    p.vy += 0.16 * (dt/16.67);
                    const alpha = Math.max(0, Math.min(1, lifeRatio));
                    fctx.globalAlpha = alpha;
                    fctx.beginPath();
                    fctx.fillStyle = p.color;
                    fctx.arc(p.x, p.y, p.radius * (0.6 + lifeRatio * 0.8), 0, Math.PI*2);
                    fctx.fill();
                    fctx.globalAlpha = Math.max(0, alpha * 0.22);
                    fctx.beginPath();
                    fctx.fillStyle = p.color;
                    fctx.arc(p.x, p.y, (p.radius * 5) * (0.22 + (1 - lifeRatio) * 0.9), 0, Math.PI*2);
                    fctx.fill();
                }

                fctx.globalAlpha = 1;
                if (t < duration) {
                    requestAnimationFrame(frame);
                } else {
                    finished = true;
                    clearTimeout(safeTimer);
                    try { fctx.clearRect(0,0,fireCanvas.width,fireCanvas.height); } catch(e){}
                    resolve();
                }
            } catch (err) {
                finished = true;
                clearTimeout(safeTimer);
                try { fctx.clearRect(0,0,fireCanvas.width,fireCanvas.height); } catch(e){}
                resolve();
            }
        }
        
        try { requestAnimationFrame(frame); } catch (err) {
            clearTimeout(safeTimer);
            try { fctx.clearRect(0,0,fireCanvas.width,fireCanvas.height); } catch(e){}
            resolve();
        }
    });
}

async function doFireworkThenHide(){
    if (isAnimatingExplosion) return;
    isAnimatingExplosion = true;
    try {
        await new Promise(r => setTimeout(r, 8));
        try { fgVideo.pause(); } catch(e){}
        const rect = fgContainer.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        resizeFireCanvas();
        const palette = ['#ffcc00','#ff4d4d','#ffd700','#00fff7','#ff6ad5','#ff7f50','#8b5cf6'];
        
        // FIX: Cambiamos la animación para que brille y explote hacia adelante en lugar de caer
        fgContainer.style.transition = 'transform .25s ease-out, opacity .25s ease, filter .25s ease';
        fgContainer.style.transform = 'scale(1.05)';
        fgContainer.style.filter = 'drop-shadow(0 0 15px var(--neon-cyan)) brightness(1.2)';
        fgContainer.style.opacity = '0.9';

        await explodeParticlesAt(cx, cy, palette, 200, 900); // Más chispas y más tiempo
        
        fgContainer.style.opacity = '0';
        fgContainer.style.transform = 'scale(1.2) translateZ(0)'; // En vez de caer, se expande
        fgContainer.style.filter = '';
        
        await new Promise(r => setTimeout(r, 220));
        fgContainer.style.display = 'none';
        fgContainer.style.transform = '';
        fgContainer.style.opacity = '';
    } catch (err) {
        console.warn('doFireworkThenHide error:', err);
    } finally {
        isAnimatingExplosion = false;
    }
}

async function playVideoClip(infoObj){
    if (!infoObj) return;
    currentVideoObj = infoObj;
    usingChroma = true;
    if (lastObjectUrl) { try { URL.revokeObjectURL(lastObjectUrl); } catch(e){}; lastObjectUrl = null; }

    fgVideo.src = infoObj.src;
    fgVideo.load();
    const onMeta = () => {
        fgVideo.removeEventListener('loadedmetadata', onMeta);
        if (infoObj.id === 'hola') { fgContainer.style.bottom = '0px'; }
        else { fgContainer.style.bottom = '20px'; }
        placeRandomSide(infoObj);
        adjustContainerToVideo(fgVideo, infoObj);
        fgCanvas.style.display = 'block';
        fgVideo.style.display = 'none';
        fgVideo.play().catch(()=>{});
        bgVideo.play().catch(()=>{});
        startChromaIntervalIfNeeded(infoObj);
        showContainer();
    };

    fgVideo.addEventListener('loadedmetadata', onMeta);
    fgVideo.onerror = (e) => {
        usingChroma = false;
        fgCanvas.style.display = 'none';
        fgVideo.style.display = 'block';
        fgVideo.play().catch(()=>{ document.getElementById('playOverlay').style.display = 'flex'; });
    };
    fgVideo.onended = () => {
        scheduleNextVideo(3, infoObj.id);
    };
}

fgContainer.addEventListener('click', async (ev) => {
    if (isAnimatingExplosion) return;
    if (scheduledTimer) { clearTimeout(scheduledTimer); scheduledTimer = null; }
    usingChroma = false;
    stopChromaInterval();
    try {
        await doFireworkThenHide();
    } catch (err) {
        console.warn('Error during fireworks click flow:', err);
    }
    const currentId = currentVideoObj ? currentVideoObj.id : null;
    const next = pickRandomVideo(currentId);
    setTimeout(() => { playVideoClip(next); }, 420);
});

document.getElementById('playBtn') && document.getElementById('playBtn').addEventListener('click', ()=>{
    document.getElementById('playOverlay').style.display = 'none';
    bgVideo.play().catch(()=>{}); fgVideo.play().catch(()=>{});
    try { bgMusic.play().catch(()=>{}); } catch(e){}
    if (currentVideoObj) startChromaIntervalIfNeeded(currentVideoObj);
});

let resizeRaf = null;
window.addEventListener('resize', ()=> {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(()=> {
        resizeFireCanvas();
        if (currentVideoObj && fgVideo.videoWidth && fgVideo.videoHeight) {
            adjustContainerToVideo(fgVideo, currentVideoObj);
        }
        resizeRaf = null;
    });
}, {passive:true});

document.addEventListener('visibilitychange', ()=> {
    if (document.hidden) {
        visibilityPaused = true;
        stopChromaInterval();
    } else {
        visibilityPaused = false;
        if (usingChroma && fgVideo && !chromaIntervalId) {
            startChromaIntervalIfNeeded(currentVideoObj);
        }
    }
}, {passive:true});

function init(){
    fgContainer.style.display = 'none';
    fgCanvas.style.display = 'none'; fgVideo.style.display = 'none';
    const first = pickRandomVideo(null);
    if (!first) return;
    playVideoClip(first);
}

init();
window.addEventListener('beforeunload', ()=>{ if (lastObjectUrl) try{ URL.revokeObjectURL(lastObjectUrl); } catch(e){} });