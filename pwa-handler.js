/* Archivo: pwa-handler.js */

let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const iosModal = document.getElementById('iosInstallModal');
const fallbackModal = document.getElementById('fallbackModal');

// 1. Detectar si es iOS (iPhone/iPad)
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

// 2. Detectar si ya está instalada (Standalone)
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// 3. Detectar si es Móvil (coincidiendo con tu CSS de 780px)
const isMobile = () => window.matchMedia('(max-width: 780px)').matches;

// FUNCIÓN AUXILIAR: Abrir Modal con animación
function openAppModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = 'block';
    // Pequeño retraso para permitir que el navegador procese el display:block antes de la opacidad
    setTimeout(() => {
        modalElement.classList.add('active');
    }, 10);
}

// FUNCIÓN AUXILIAR: Cerrar Modal (Global para llamarla desde HTML)
window.closeAppModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Esperar a que termine la transición CSS (0.3s) antes de ocultar
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// FUNCIÓN PRINCIPAL: Controlar visibilidad del botón de descarga
function checkInstallButtonVisibility() {
    // Solo mostrar si es Móvil Y NO está ya instalada en modo app
    if (isMobile() && !isInStandaloneMode()) {
        if (installBtn) installBtn.style.display = 'flex';
    } else {
        // En PC o si ya está instalada, lo ocultamos
        if (installBtn) installBtn.style.display = 'none';
    }
}

// 4. Manejo del evento nativo (Android / PC Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
  // Evita que Chrome muestre el prompt nativo inmediatamente y lo guarda
  e.preventDefault();
  deferredPrompt = e;
  // Actualizamos visibilidad
  checkInstallButtonVisibility();
});

// 5. Click en el botón de instalar
if (installBtn) {
    installBtn.addEventListener('click', () => {
        if (isIos()) {
            // iOS: Mostrar instrucciones manuales con el nuevo diseño
            openAppModal(iosModal);
        } else if (deferredPrompt) {
            // Android: Si tenemos el prompt guardado, lo lanzamos
            deferredPrompt.prompt();
            
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuario aceptó instalar');
                }
                deferredPrompt = null;
            });
        } else {
            // FALLBACK: Si no hay prompt (ya instalada o navegador no compatible)
            // Mostramos el modal bonito en lugar de alert()
            openAppModal(fallbackModal);
        }
    });
}

// Inicialización: Comprobar al cargar la página
window.addEventListener('DOMContentLoaded', checkInstallButtonVisibility);

// Comprobar si cambia el tamaño de ventana
window.addEventListener('resize', checkInstallButtonVisibility);