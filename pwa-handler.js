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
        alert("Para instalar la App:\nBusca en el menú de tu navegador la opción 'Instalar aplicación' o 'Agregar a la pantalla principal'.");
    }
});

function closeIosModal() {
    iosModal.style.display = 'none';
}

// Inicialización: Comprobar al cargar la página
window.addEventListener('DOMContentLoaded', checkInstallButtonVisibility);

// Comprobar si cambia el tamaño de ventana (por si giran el móvil o redimensionan)
window.addEventListener('resize', checkInstallButtonVisibility);