/* Archivo: pwa-handler.js */

let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const iosModal = document.getElementById('iosInstallModal');

// 1. Detectar si es iOS (iPhone/iPad)
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

// 2. Detectar si ya está instalada (Standalone)
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// 3. Detectar si es Móvil (coincidiendo con tu CSS de 780px)
const isMobile = () => window.matchMedia('(max-width: 780px)').matches;

// FUNCIÓN PRINCIPAL: Controlar visibilidad del botón
function checkInstallButtonVisibility() {
    // Solo mostrar si es Móvil Y NO está ya instalada en modo app
    if (isMobile() && !isInStandaloneMode()) {
        installBtn.style.display = 'flex';
    } else {
        // En PC o si ya está instalada, lo ocultamos
        installBtn.style.display = 'none';
    }
}

// 4. Manejo del evento nativo (Android / PC Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
  // Evita que Chrome muestre el prompt nativo inmediatamente y lo guarda
  e.preventDefault();
  deferredPrompt = e;
  // Actualizamos visibilidad (por seguridad)
  checkInstallButtonVisibility();
});

// 5. Click en el botón de instalar
installBtn.addEventListener('click', () => {
    if (isIos()) {
        // iOS: Mostrar instrucciones manuales (modal)
        iosModal.style.display = 'block';
    } else if (deferredPrompt) {
        // Android: Si tenemos el prompt guardado, lo lanzamos
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó instalar');
            }
            // NO ocultamos el botón aunque acepte o cancele, para que persista
            deferredPrompt = null;
        });
    } else {
        // FALLBACK: Si no hay prompt (porque ya se usó o el navegador no lo da)
        // pero seguimos en móvil, mostramos una alerta de ayuda.
        alert("🧠 Buen intento\nPero la app ya está instalada 😉");
    }
});

function closeIosModal() {
    iosModal.style.display = 'none';
}

// Inicialización: Comprobar al cargar la página
window.addEventListener('DOMContentLoaded', checkInstallButtonVisibility);

// Comprobar si cambia el tamaño de ventana (por si giran el móvil o redimensionan)
window.addEventListener('resize', checkInstallButtonVisibility);

/* Archivo: pwa-handler.js ACTUALIZADO */

let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const modalOverlay = document.getElementById('manualInstallModal');
const modalBody = document.getElementById('modalBody');

// --- DETECTORES ---
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
const isMobile = () => window.matchMedia('(max-width: 780px)').matches;

// --- GESTIÓN VISUAL DEL BOTÓN ---
function checkInstallButtonVisibility() {
    // Solo mostrar en móvil y si no está instalada ya
    if (isMobile() && !isInStandaloneMode()) {
        installBtn.style.display = 'flex';
    } else {
        installBtn.style.display = 'none';
    }
}

// --- CAPTURA DEL EVENTO DE INSTALACIÓN ---
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  checkInstallButtonVisibility();
});

// --- FUNCIONES DEL MODAL ---
function openManualModal(type) {
    let content = '';

    if (type === 'ios') {
        content = `
            <p>Para instalar en iOS sigue estos pasos:</p>
            <div class="instruction-step">
                <i class="fas fa-share-square"></i>
                <span>Pulsa el botón <strong>Compartir</strong> abajo.</span>
            </div>
            <div class="instruction-step">
                <i class="far fa-plus-square"></i>
                <span>Busca y selecciona <strong>"Agregar a Inicio"</strong>.</span>
            </div>
        `;
    } else {
        // Android / Fallback
        content = `
            <p>La instalación automática no está disponible ahora. Hazlo manualmente:</p>
            <div class="instruction-step">
                <i class="fas fa-ellipsis-v"></i>
                <span>Abre el <strong>Menú</strong> de tu navegador (3 puntos).</span>
            </div>
            <div class="instruction-step">
                <i class="fas fa-mobile-alt"></i>
                <span>Elige <strong>"Instalar aplicación"</strong> o "Agregar a pantalla principal".</span>
            </div>
        `;
    }

    modalBody.innerHTML = content;
    modalOverlay.classList.add('active'); // Muestra con animación CSS
}

window.closeManualModal = function() {
    modalOverlay.classList.remove('active');
}

// Cerrar si clicamos fuera del cuadro
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeManualModal();
    }
});

// --- CLIC EN EL BOTÓN DE DESCARGA ---
installBtn.addEventListener('click', () => {
    if (isIos()) {
        // Caso iOS: Siempre manual
        openManualModal('ios');
    } else if (deferredPrompt) {
        // Caso Android ideal: Tenemos el prompt nativo
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log('Resultado instalación:', choiceResult.outcome);
            // IMPORTANTE: Ponemos a null la variable, pero NO ocultamos el botón
            deferredPrompt = null; 
        });
    } else {
        // Caso Android Fallback: Ya se usó el prompt o navegador no soporta
        openManualModal('android');
    }
});

// Inicialización
window.addEventListener('DOMContentLoaded', checkInstallButtonVisibility);
window.addEventListener('resize', checkInstallButtonVisibility);