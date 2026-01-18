/* Archivo: pwa-handler.js */

let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
const iosModal = document.getElementById('iosInstallModal');

// 1. Detectar si es iOS (iPhone/iPad)
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

// 2. Detectar si ya está instalada (Standalone)
// Comprueba tanto la propiedad navigator.standalone (iOS) como display-mode (Android/PC)
const isInStandaloneMode = () => {
    return ('standalone' in window.navigator) && (window.navigator.standalone) 
           || window.matchMedia('(display-mode: standalone)').matches;
};

// 3. Inicialización: Mostrar el botón SIEMPRE, excepto si ya estamos dentro de la App instalada
// Esto garantiza que en PC aparezca siempre que entres a la web.
if (!isInStandaloneMode()) {
    if(installBtn) installBtn.style.display = 'flex';
} else {
    // Si ya es la app, lo ocultamos para que no estorbe
    if(installBtn) installBtn.style.display = 'none';
}

// 4. Capturar el evento 'beforeinstallprompt' (Chrome/Edge en PC y Android)
window.addEventListener('beforeinstallprompt', (e) => {
  // Evita que Chrome muestre el prompt nativo inmediatamente y lo guardamos
  e.preventDefault();
  deferredPrompt = e;
  console.log('Evento de instalación capturado');
  
  // Aseguramos que el botón sea visible (por si acaso)
  if(installBtn) installBtn.style.display = 'flex';
});

// 5. Manejar el click del botón
if(installBtn) {
    installBtn.addEventListener('click', async () => {
        // CASO A: iOS
        if (isIos()) {
            iosModal.style.display = 'block';
            return;
        } 

        // CASO B: Tenemos el prompt automático (PC o Android compatible)
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuario escogió: ${outcome}`);
            
            // Nota: deferredPrompt solo sirve una vez. Lo limpiamos.
            deferredPrompt = null;
            
            // NO ocultamos el botón aquí, para cumplir tu requisito de "nunca desaparezca"
            // (a menos que recargues la página ya instalada).
        } 
        // CASO C: No hay prompt automático (PC cuando ya se intentó antes, o navegadores no compatibles)
        else {
            // Aquí mostramos una alerta o instrucción manual para PC,
            // simulando la ayuda que pediste tipo "ver en los 3 puntitos".
            alert('Para instalar la aplicación en PC:\n\n1. Busca el menú de tu navegador (los 3 puntos o líneas en la esquina).\n2. Selecciona "Instalar aplicación" o "Guardar y compartir" > "Instalar Archinime".\n\n(Si ya la tienes instalada, búscala en tu escritorio o menú de inicio).');
        }
    });
}

// Función global para cerrar el modal de iOS
window.closeIosModal = function() {
    if(iosModal) iosModal.style.display = 'none';
}

// Detectar cambios de estado (si el usuario instala y vuelve a la pestaña sin recargar)
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    if (evt.matches) {
        if(installBtn) installBtn.style.display = 'none';
    }
});