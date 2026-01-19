/* Archivo: pwa-handler.js */

let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
const iosModal = document.getElementById('iosInstallModal');

// 1. Detectar si es iOS
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

// 2. Detectar si ya estamos DENTRO de la app instalada
const isInStandaloneMode = () => {
    return ('standalone' in window.navigator) && (window.navigator.standalone) 
           || window.matchMedia('(display-mode: standalone)').matches;
};

// 3. Capturar el evento de instalación (CRUCIAL para PC y Android)
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que Chrome muestre su barra automática (la controlaremos nosotros)
  e.preventDefault();
  deferredPrompt = e;
  console.log('Evento de instalación capturado y listo.');
});

// 4. Lógica del botón
if(installBtn) {
    // Aseguramos que el botón sea visible si NO estamos dentro de la app
    // Si quieres que aparezca INCLUSO dentro de la app instalada, borra el "if" y deja solo la linea del display.
    if (!isInStandaloneMode()) {
        installBtn.style.display = 'flex'; 
    }

    installBtn.addEventListener('click', async () => {
        // Opción A: Es iOS (iPhone/iPad) -> Mostrar instrucciones
        if (isIos()) {
            if(iosModal) iosModal.style.display = 'block';
            return;
        }

        // Opción B: Tenemos el evento guardado (PC o Android) -> LANZAR INSTALADOR
        if (deferredPrompt) {
            deferredPrompt.prompt(); // <-- Esto abre la ventanita nativa en PC
            
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuario decidió: ${outcome}`);
            
            // Nota: deferredPrompt solo sirve una vez. Se reinicia.
            deferredPrompt = null;
        } 
        // Opción C: No hay evento (Ya está instalada o el navegador no soporta PWA)
        else {
             // Solo aquí mostramos ayuda, por si el botón no responde
             alert('Parece que la instalación automática no está disponible ahora (o ya tienes la App instalada).\n\nEn PC: Busca el icono (+) o "Instalar" en la barra de direcciones arriba a la derecha.');
        }
    });
}

// Función para cerrar modal iOS
window.closeIosModal = function() {
    if(iosModal) iosModal.style.display = 'none';
}

// Escuchar si se instaló con éxito (Opcional: solo para registro)
window.addEventListener('appinstalled', () => {
  console.log('Aplicación instalada con éxito');
  deferredPrompt = null;
  // NO ocultamos el botón, como pediste.
});