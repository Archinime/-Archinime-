let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const iosModal = document.getElementById('iosInstallModal');

// 1. Detectar si es iOS (iPhone/iPad) [cite: 2]
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// 2. Detectar si ya está instalada (Standalone) [cite: 3]
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// 3. Manejo para Android / PC (Chrome, Edge) [cite: 4]
window.addEventListener('beforeinstallprompt', (e) => {
  // Evita que Chrome muestre el prompt nativo inmediatamente [cite: 4]
  e.preventDefault();
  deferredPrompt = e;
  // Mostrar nuestro botón personalizado [cite: 4]
  installBtn.style.display = 'flex';
});

installBtn.addEventListener('click', () => {
    if (isIos()) {
        // En iOS mostramos instrucciones [cite: 5]
        iosModal.style.display = 'block';
    } else if (deferredPrompt) {
        // En Android/PC lanzamos el prompt nativo [cite: 5]
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó instalar'); [cite: 6]
            }
            // Mantenemos deferredPrompt o lo reseteamos según prefieras, 
            // pero NO ocultamos el botón visualmente. [cite: 6]
            deferredPrompt = null; 
        });
    }
});

// Mostrar botón siempre si no está en modo standalone (App abierta) [cite: 7]
function checkDisplayBtn() {
    if (!isInStandaloneMode()) {
        installBtn.style.display = 'flex';
    } else {
        installBtn.style.display = 'none'; // Se oculta solo si ya estás DENTRO de la app instalada
    }
}

// Ejecutar al cargar
checkDisplayBtn(); [cite: 7, 8]

function closeIosModal() {
    iosModal.style.display = 'none'; [cite: 8]
}