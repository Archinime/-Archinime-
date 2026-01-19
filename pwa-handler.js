/* Archivo: pwa-handler.js */
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const installModal = document.getElementById('universalInstallModal');

// Detectar si ya es app
const isApp = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// Mostrar botón siempre
if (installBtn) installBtn.style.display = 'flex';

window.addEventListener('beforeinstallprompt', (e) => {
  // Evitar que Chrome lo haga solo
  e.preventDefault();
  deferredPrompt = e;
  console.log('PC lista para instalar');
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (isApp()) {
      alert("¡Ya estás usando la aplicación!");
      return;
    }

    // Si el navegador nos da permiso (Evento activo)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') deferredPrompt = null;
    } 
    else {
      // SI NO FUNCIONA EL AUTOMÁTICO EN PC:
      // Mostramos el modal que explica dónde está el botón nativo de Chrome/Edge
      if (installModal) {
          document.getElementById('modalTextPc').style.display = 'block';
          installModal.style.display = 'block';
      }
    }
  });
}

window.closeInstallModal = () => {
  if (installModal) installModal.style.display = 'none';
};