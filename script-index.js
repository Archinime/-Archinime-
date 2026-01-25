/* Archivo: script-index.js */

/* ----------------------------
    Renderizado grid
    ---------------------------- */
function render(list) {
    const grid = document.getElementById('grid');
    if (!list || list.length === 0) {
        grid.innerHTML = `
        <div class="no-results" role="status" aria-live="polite">
        <div class="title shimmer">¡Ups!
        No se encontraron resultados que coincidan con la búsqueda.</div>
        <div class="subtitle">¿No lo encuentras?
        Puede que lo hayas escrito con un error o que todavía no lo haya subido.</div>
        <div class="sparkles"><button class="btn-reset" id="btn-reset">Entiendo</button></div>
        </div>
    `;
    const btn = document.getElementById('btn-reset');
        if (btn) btn.addEventListener('click', () => {
        document.getElementById('search').value = '';
        document.getElementById('genre-select').value = '';
        document.getElementById('demographic-select') && (document.getElementById('demographic-select').value = '');
        document.getElementById('rating-select').value = '';
        filtro();
        document.getElementById('search').focus();
        });
    return;
    }

    // Render sencillo
    grid.innerHTML = list.map(a => `
    <div class="card" onclick="location='anime-detail.html?id=${a.id}'" role="link" tabindex="0">
        <img src="${a.img}" alt="${a.title}">
        <div class="info"><strong>${a.title}</strong><span>⭐ ${a.rating ? (a.rating.toFixed? a.rating.toFixed(1): a.rating) : '—'}</span></div>
    </div>
    `).join('');
}

function updateResultsCount(count){ const el = document.getElementById('results-count'); if (el) el.textContent = count; }

function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t);
t=setTimeout(()=>fn(...a), wait); }; }

const debouncedFiltro = debounce(filtro, 200);
function normalizeText(s){
    try {
    return (s||'').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
    } catch(e) {
    return (s||'').toLowerCase().replace(/[\u0300-\u036f]/g, '');
    }
}

function getBestTitleForSort(a){ const titles = [a.title].concat(a.aliases || []);
const norm = titles.map(t=>normalizeText(t)); norm.sort(); return norm[0]; }

function filtro(){
    const qRaw = document.getElementById('search').value || '';
    const q = qRaw.trim(); const qn = normalizeText(q);
    const g = document.getElementById('genre-select').value;
    const d = document.getElementById('demographic-select') ? document.getElementById('demographic-select').value : '';
    const cat = document.getElementById('rating-select').value;

    const filtrados = animes.filter(a=>{
    const titles = [a.title].concat(a.aliases || []);
    const matchesText = !qn || titles.some(t => normalizeText(t).startsWith(qn));
    const byGenre = !g || (a.genres && a.genres.includes(g));
    const byDemo  = !d || (a.genres && a.genres.includes(d));
    let byRating = true;
    
    if (cat==='excellent') byRating = a.rating >= 4.8;
    else if (cat==='good') byRating = a.rating >= 4.6 && a.rating < 4.8;
    else if (cat==='regular') byRating = a.rating < 4.6;
   
    return matchesText && byGenre && byDemo && byRating;
    });
    let resultList = filtrados.slice();
    if (qn) {
    resultList.sort((A,B)=>{
        const titlesA = [A.title].concat(A.aliases||[]).map(t=>normalizeText(t));
        const titlesB = [B.title].concat(B.aliases||[]).map(t=>normalizeText(t));
        const aStarts = titlesA.some(t=>t.startsWith(qn));
        const bStarts = titlesB.some(t=>t.startsWith(qn));
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        const na = getBestTitleForSort(A); const 
        nb = getBestTitleForSort(B);
        return na 
        < nb ? -1 : na > nb ? 1 : 0;
    });
    } else {
    resultList.sort((A,B)=> normalizeText(A.title) < normalizeText(B.title) ? -1 : normalizeText(A.title) > normalizeText(B.title) ? 1 : 0);
    }

    render(resultList);
    updateResultsCount(resultList.length);
}

// inicial -> orden aleatorio en la grid
function shuffleArray(arr){ const a = arr.slice();
for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

if (typeof animes !== 'undefined') {
    render(shuffleArray(animes));
    updateResultsCount(animes.length);
} else {
    console.error("Error: No se encontró la lista 'animes'. Revisa que index-data.js esté bien vinculado.");
}

document.getElementById('search').addEventListener('input', debouncedFiltro);
document.getElementById('search').addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); filtro(); } });
['genre-select','rating-select','demographic-select'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('change', filtro); });
/* ----------------------------
    Helpers de rendimiento
    ---------------------------- */
function getPerformanceHints() {
    let cores = navigator.hardwareConcurrency ||
    4;
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

window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('bg-video');
    const overlay = document.getElementById('overlay');
    const hints = getPerformanceHints();

    if (hints.processingScale < 0.55 || hints.prefersReducedMotion) {
    try { video.pause(); video.style.display = 'none'; overlay.style.opacity = '1'; } catch(e){}
    } else {
    try { video.preload = video.getAttribute('preload') || 'metadata'; } catch(e){ console.warn(e); }
    video.muted = true; video.playsInline = true;
    const revealVideo = () => { video.style.opacity = '1'; overlay.style.opacity = '0'; };
    overlay.addEventListener('transitionend', (ev) => 
    { if (ev.propertyName === 'opacity' && getComputedStyle(overlay).opacity === '0') overlay.style.display = 'none'; });
    video.addEventListener('playing', () => { revealVideo(); }, { once: true });
    video.addEventListener('canplaythrough', () => { video.play().catch(()=>{}); }, { once: true });
    video.addEventListener('loadeddata', () => { video.play().catch(()=>{});
    }, { once: true });
    }
});

/* ----------------------------
   Lógica de Música: 
   Inicio Aleatorio -> Luego Secuencial
---------------------------- */
window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-music');
    const hints = getPerformanceHints();
    
    // Si no hay música cargada desde musica_fondo.js, salimos
    if (typeof musicList === 'undefined' || musicList.length === 0) return;

    // 1. Elegimos un índice aleatorio solo para la primera canción
    let currentMusicIndex = Math.floor(Math.random() * musicList.length);

    function playByIndex(idx) {
    
    // Aseguramos que el índice esté dentro del rango (bucle)
        currentMusicIndex = ((idx % musicList.length) + musicList.length) % musicList.length;
        audio.src = musicList[currentMusicIndex];
        audio.load();
        audio.volume = 0.75;
        
        if (hints.processingScale >= 0.6) {
            audio.play().catch(()=> { 
         
       document.addEventListener('click', ()=>{ audio.play().catch(()=>{}); }, { once: true }); 
            });
    }
    }

    // 2. Cuando termina la canción, pasamos a la SIGUIENTE (+1) en orden
    audio.addEventListener('ended', ()=> { 
        currentMusicIndex = currentMusicIndex + 1; 
        playByIndex(currentMusicIndex); 
    });
    // Reproducir la primera (que fue aleatoria)
    playByIndex(currentMusicIndex);
});
// función utilitaria para abrir en nueva pestaña
function openInNewTab(url){ try{ const w = window.open(url, '_blank'); if (w) w.focus();
}catch(e){} }

/* ----------------------------
    Chroma + FG logic
    ---------------------------- */
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
    if (side === 'left') { fgContainer.style.left = margin; fgContainer.style.right = '';
    }
    else { fgContainer.style.right = margin; fgContainer.style.left = '';
    }
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
    try { offCtx.drawImage(video, 0, 0, off.width, off.height);
    } catch (err) {
    usingChroma = false; fgCanvas.style.display = 'none';
    fgVideo.style.display = 'block';
    fgVideo.play().catch(()=>{ document.getElementById('playOverlay').style.display = 'flex'; });
    return;
    }
    let frame;
    try { frame = offCtx.getImageData(0,0,off.width,off.height);
    } catch (err) {
    usingChroma = false; fgCanvas.style.display = 'none'; fgVideo.style.display = 'block';
    fgVideo.play().catch(()=>{ document.getElementById('playOverlay').style.display = 'flex'; });
    return;
    }
    const settings = infoObj && infoObj.preset ?
    infoObj.preset : { threshold:0.4, diff:30, soft:30 };
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

function showContainer(){ fgContainer.style.display = 'flex'; fgContainer.classList.remove('exit'); fgContainer.classList.add('enter');
}
function hideContainerInstantlyForTransition(){ fgContainer.classList.remove('enter'); fgContainer.classList.add('exit'); }

function scheduleNextVideo(afterSeconds = 3, excludeId = null){
    if (scheduledTimer){ clearTimeout(scheduledTimer); scheduledTimer = null;
    }
    hideContainerInstantlyForTransition();
    scheduledTimer = setTimeout(()=>{ const next = pickRandomVideo(excludeId); if (!next) return; playVideoClip(next); }, afterSeconds*1000);
}

/* ----------------------------
    Fuegos artificiales (canvas)
    ---------------------------- */
const fireCanvas = document.createElement('canvas');
fireCanvas.className = 'firework-canvas';
fireCanvas.style.position = 'absolute';
fireCanvas.style.left = '0';
fireCanvas.style.top = '0';
fireCanvas.style.width = '100%';
fireCanvas.style.height = '100%';
fireCanvas.style.zIndex = '9999';
fireCanvas.style.pointerEvents = 'none';
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
function explodeParticlesAt(x, y, colors, count = 60, duration = 650) {
const hints = getPerformanceHints();
const rect = fgContainer.getBoundingClientRect();
const areaFactor = Math.min(2.2, Math.max(0.45, (rect.width * rect.height) / (360 * 640)));
let effectiveCount = Math.round(count * areaFactor);
if (hints.processingScale < 0.45) effectiveCount = Math.max(12, Math.round(effectiveCount * 0.30));
else if (hints.processingScale < 0.6) effectiveCount = Math.max(18, Math.round(effectiveCount * 0.45));
else if (hints.processingScale < 0.85) effectiveCount = Math.max(28, Math.round(effectiveCount * 0.7));
effectiveCount = Math.min(220, effectiveCount);
const targetFps = hints.processingScale >= 0.85 ? 50 : hints.processingScale >= 0.6 ? 36 : 24;
const frameInterval = 1000 / targetFps;

const particles = [];
function rnd(min, max){ return Math.random()*(max-min)+min;
}

for (let i = 0; i < effectiveCount; i++) {
const angle = rnd(0, Math.PI*2);
const speed = rnd(1.2, 6.0);
particles.push({
    x, y,
    vx: Math.cos(angle) * speed * rnd(0.6, 1.2),
    vy: Math.sin(angle) * speed * rnd(0.6, 1.2) - rnd(0.6, 2.2),
    life: rnd(duration*0.65, duration*1.05),
    age: 0,
    radius: rnd(1.6, 5.2),
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

        const 
        alpha = Math.max(0, Math.min(1, lifeRatio));
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
        try { fctx.clearRect(0,0,fireCanvas.width,fireCanvas.height);
        } catch(e){}
        resolve();
    }
    } catch (err) {
    finished = true;
    clearTimeout(safeTimer);
    try { fctx.clearRect(0,0,fireCanvas.width,fireCanvas.height);
    } catch(e){}
    resolve();
    }
}
try { requestAnimationFrame(frame); } catch (err) {
    clearTimeout(safeTimer);
    try { fctx.clearRect(0,0,fireCanvas.width,fireCanvas.height);
    } catch(e){}
    resolve();
}
});
}

async function doFireworkThenHide(){
    if (isAnimatingExplosion) return;
    isAnimatingExplosion = true;
    try {
    await new Promise(r => setTimeout(r, 8));
    try { fgVideo.pause();
    } catch(e){}
    const rect = fgContainer.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    resizeFireCanvas();
    const palette = ['#ffcc00','#ff4d4d','#ffd700','#00fff7','#ff6ad5','#ff7f50','#8b5cf6'];
    fgContainer.style.transition = 'transform .25s ease-out, opacity .25s ease';
    fgContainer.style.transform = 'scale(0.96)';
    fgContainer.style.opacity = '0.85';

    await explodeParticlesAt(cx, cy, palette, 80, 700);
    fgContainer.style.opacity = '0';
    fgContainer.style.transform = 'scale(.8) translateY(10px)';
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
    if (infoObj.id === 'hola') { fgContainer.style.bottom = '0px';
    }
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
document.getElementById('playBtn').addEventListener('click', ()=>{
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
}, 
{passive:true});
/* ----------------------------
    POPUP MÓVIL (CORREGIDO Y OPTIMIZADO)
    ---------------------------- */
(function mobileSelectPopups() {
    const mobileQ = () => window.matchMedia('(max-width:780px)').matches;
    const SELECT_IDS = ['genre-select','demographic-select','rating-select'];
    let activePopup = null;
    let outsideListener = null;
    let resizeListener = null;
    let scrollListener = null;

    function closePopup() {
    if (activePopup) {
        try { activePopup.remove(); } catch(e){}
        activePopup = null;
    }
    if 
    (outsideListener) { document.removeEventListener('pointerdown', outsideListener, true); outsideListener = null; }
    if (resizeListener) { window.removeEventListener('resize', resizeListener); resizeListener = null; }
    if (scrollListener) { window.removeEventListener('scroll', scrollListener, true); scrollListener = null; }
    }

    function createPopupFor(selectEl) {
    selectEl.addEventListener('click', function onClick(e){
        if (!mobileQ()) return;
        e.preventDefault();
        e.stopPropagation();
        
        // --- LOGICA TOGGLE (ABRIR/CERRAR) ---
        // Si el popup activo pertenece a este mismo elemento, lo cerramos y salimos.
        if (activePopup && activePopup.dataset.owner === selectEl.id) {
            closePopup();
            return;
        }

        openPopupFor(selectEl);
    });
    selectEl.addEventListener('keydown', (e) => {
        if (!mobileQ()) return;
        if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        if (activePopup && activePopup.dataset.owner === selectEl.id) {
            closePopup();
            return;
        }
        openPopupFor(selectEl);
        }
    });
    }

    function openPopupFor(selectEl) {
    closePopup();
    const rect = selectEl.getBoundingClientRect();
    const docEl = document.documentElement;
    const winW = Math.max(docEl.clientWidth || 0, window.innerWidth || 0);
    const winH = Math.max(docEl.clientHeight || 0, window.innerHeight || 0);
    
    // Crear el DIV
    const popup = document.createElement('div');
    popup.className = 'mobile-select-popup';
    popup.setAttribute('role','listbox');
    popup.setAttribute('aria-label', selectEl.getAttribute('aria-label') || 'Opciones');
    
    // Marcar quién abrió este popup (para el toggle)
    popup.dataset.owner = selectEl.id;

    const pad = 8;
    const maxHeight = window.matchMedia('(max-width:420px)').matches ? 160 : 220;
    popup.style.maxHeight = maxHeight + 'px';
    const width = Math.min(rect.width, Math.max(140, winW - 24));
    popup.style.minWidth = Math.max(130, width) + 'px';

    // Cálculo de posición corregido (scrollY)
    const scrollY = window.scrollY || window.pageYOffset;
    let top = rect.bottom + scrollY + 6;
    
    const estimatedHeight = Math.min(maxHeight, (selectEl.options ? selectEl.options.length * 42 : maxHeight));
    
    // Si se sale por abajo de la pantalla, mostrarlo arriba
    if ((rect.bottom + estimatedHeight + pad) > winH) {
        // Calcular posición "arriba"
        top = (rect.top + scrollY) - estimatedHeight - 6;
    }
    
    popup.style.left = Math.max(pad, rect.left) + 'px';
    popup.style.top = top + 'px';

    const opts = Array.from(selectEl.options);
    opts.forEach((opt, idx) => {
        const d = document.createElement('div');
        d.className = 'opt';
        d.setAttribute('role','option');
        d.setAttribute('data-value', opt.value || opt.text);
        d.setAttribute('tabindex','0');
        if (opt.selected) d.setAttribute('aria-selected','true');
        d.textContent = opt.textContent || opt.innerText || opt.value;

        d.addEventListener('click', (ev) => {
        ev.stopPropagation();
      
        try {
            selectEl.value = opt.value;
            Array.from(selectEl.options).forEach(o => o.selected = (o.value === opt.value));
            const evCh = new Event('change', { bubbles: true });
            selectEl.dispatchEvent(evCh);
        } catch(e){}
        closePopup();
            try { selectEl.focus();
  
        } catch(e){}
        });
        d.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            d.click();
        } else if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            const next = d.nextElementSibling;
            if (next) next.focus();
        } else if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            const prev = d.previousElementSibling;
            if (prev) prev.focus();
        } else if (ev.key === 'Escape') {
            closePopup();
            try { selectEl.focus(); } catch(e){}
        }
        });
    popup.appendChild(d);
    });

    document.body.appendChild(popup);
    activePopup = popup;
    const selected = popup.querySelector('.opt[aria-selected="true"]') || popup.querySelector('.opt');
    if (selected) { selected.focus();
    popup.scrollTop = Math.max(0, selected.offsetTop - 8);
    }

    outsideListener = function outsideHandler(ev){
        if (!activePopup) return;
        if (ev.target === selectEl || activePopup.contains(ev.target)) return;
        closePopup();
    };
    document.addEventListener('pointerdown', outsideListener, true);
    resizeListener = () => closePopup();
    window.addEventListener('resize', resizeListener);
    scrollListener = function scrollHandler(ev) {
        if (!activePopup) return;
        if (activePopup.contains(ev.target) || ev.target === selectEl) {
        return;
        }
        closePopup();
    };
    window.addEventListener('scroll', scrollListener, true);
    }

    function init() {
        try {
        SELECT_IDS.forEach(id => {
        const el = document.getElementById(id);
        if(el) createPopupFor(el);
        });
    } catch(e) {
        console.warn('mobileSelectPopups init error', e);
    }
    }

    window.addEventListener('resize', function(){
    if (!mobileQ()) closePopup();
    }, { passive:true });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
    window._closeMobileSelectPopup = closePopup;
})();

function init(){
    fgContainer.style.display = 'none';
    fgCanvas.style.display = 'none'; fgVideo.style.display = 'none';
    const first = pickRandomVideo(null);
    if (!first) return;
    playVideoClip(first);
}

init();
window.addEventListener('beforeunload', ()=>{ if (lastObjectUrl) try{ URL.revokeObjectURL(lastObjectUrl); } catch(e){}; });