/* Archivo: pwa-handler.js - VERSIÓN CORREGIDA */

let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const iosModal = document.getElementById('iosInstallModal');
const fallbackModal = document.getElementById('fallbackModal');

// 1. Detectores de estado
const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;

// Funciones de interfaz
function openAppModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = 'block';
    setTimeout(() => modalElement.classList.add('active'), 10);
}

window.closeAppModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

// 2. Capturar el evento de instalación (Solo Android/Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log("✅ Evento de instalación capturado y listo.");
    if (installBtn) installBtn.style.display = 'flex';
});

// 3. LÓGICA DEL BOTÓN (Aquí es donde forzamos que pase algo)
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        console.log("Botón presionado...");

        // Caso A: Es iPhone/iPad
        if (isIos()) {
            openAppModal(iosModal);
            return;
        }

        // Caso B: Android con instalación automática disponible
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
        } 
        // Caso C: No hay prompt (Ya está instalada o navegador no compatible)
        else {
            console.log("No hay prompt disponible, mostrando modal de ayuda.");
            openAppModal(fallbackModal);
        }
    });
}

// Control de visibilidad inicial
function checkVisibility() {
    if (isInStandaloneMode()) {
        if (installBtn) installBtn.style.display = 'none';
    } else {
        // Forzamos que se vea en móviles para que el usuario pueda recibir el mensaje de ayuda
        if (window.innerWidth <= 780 && installBtn) {
            installBtn.style.display = 'flex';
        }
    }
}

window.addEventListener('DOMContentLoaded', checkVisibility);