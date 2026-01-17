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

// 3. Manejo para Android / PC (Chrome, Edge)
window.addEventListener('beforeinstallprompt', (e) => {
  // Evita que Chrome muestre el prompt nativo inmediatamente
  e.preventDefault();
  deferredPrompt = e;
  // Mostrar nuestro botón personalizado
  installBtn.style.display = 'flex';
});

installBtn.addEventListener('click', () => {
    if (isIos()) {
        // En iOS no hay prompt programático, mostramos instrucciones
        iosModal.style.display = 'block';
    } else if (deferredPrompt) {
        // En Android/PC lanzamos el prompt nativo guardado
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó instalar');
                installBtn.style.display = 'none';
            }
            deferredPrompt = null;
        });
    }
});

// Mostrar botón también en iOS si no está instalada
if (isIos() && !isInStandaloneMode()) {
    installBtn.style.display = 'flex';
}

function closeIosModal() {
    iosModal.style.display = 'none';
}