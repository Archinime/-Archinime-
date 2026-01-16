/* GUARDAR COMO: notification-system.js */

let notificationQueue = []; // Cola de notificaciones pendientes
let maxTimestampSeen = 0;   // Para guardar la fecha más reciente al final

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si 'animes' está cargado (del index-data.js)
    if (typeof animes === 'undefined') {
        console.warn('Sistema de Notificaciones: index-data.js no cargado aún.');
        return;
    }

    checkLatestEvents();
});

function checkLatestEvents() {
    const lastSeenEvent = localStorage.getItem('archinime_last_event_seen') || 0;

    // 1. Filtrar animes NUEVOS (fecha mayor a lo último visto)
    //    y que tengan datos de actualización válidos.
    const newAnimes = animes.filter(a => 
        a.lastUpdate && 
        a.updateType && 
        a.lastUpdate > lastSeenEvent
    );

    if (newAnimes.length === 0) return;

    // 2. Ordenar: Mostramos primero los más recientes (o los más antiguos, según prefieras).
    //    Aquí ordenamos por fecha descendente (El más nuevo primero).
    newAnimes.sort((a, b) => b.lastUpdate - a.lastUpdate);

    // 3. Llenar la cola y preparar el timestamp para guardar al final
    notificationQueue = newAnimes;
    maxTimestampSeen = notificationQueue[0].lastUpdate; // El más reciente de todos

    // 4. Mostrar el primero de la cola
    showNextNotification();
}

function showNextNotification() {
    // Si la cola está vacía, terminamos y guardamos
    if (notificationQueue.length === 0) {
        localStorage.setItem('archinime_last_event_seen', maxTimestampSeen);
        return;
    }

    // Sacar el primer anime de la cola
    const anime = notificationQueue.shift();
    createModalHTML(anime);
}

function createModalHTML(anime) {
    // Borrar modal anterior si existe (por seguridad)
    const existing = document.getElementById('eventModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'eventModal';
    
    // TEXTO PERSONALIZADO AQUÍ:
    const customMessage = "La verdad no son muchos, solo soy yo, pero le pongo cariño. ¡Disfrútalo!";

    modal.innerHTML = `
        <div class="event-card">
            <button class="event-close" onclick="closeEventModal()" title="Cerrar notificación">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="event-cover-container">
                <img src="${anime.img}" class="event-cover">
                <div class="event-badge">${anime.updateType || 'NUEVO'}</div>
            </div>
            
            <div class="event-inner">
                <div class="event-details">
                    <div class="event-title">${anime.title}</div>
                    <div class="event-subtitle">¡YA DISPONIBLE!</div>
                    
                    <p class="event-desc">
                        ${customMessage}
                    </p>
                    
                    <button class="event-btn" onclick="goToAnime('${anime.id}')">
                        <i class="fas fa-play"></i> VER AHORA
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Pequeño delay para la animación de entrada
    setTimeout(() => {
        modal.classList.add('show');
    }, 50);
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if(modal) {
        modal.classList.remove('show');
        
        // Esperar a que termine la animación de salida para quitarlo del DOM
        // Y lanzar el SIGUIENTE de la cola
        setTimeout(() => {
            modal.remove();
            // LLAMADA RECURSIVA: Mostrar el siguiente si hay
            showNextNotification();
        }, 300);
    }
}

function goToAnime(id) {
    // Si el usuario hace clic en ver, asumimos que ya vio todo y guardamos la fecha máxima
    localStorage.setItem('archinime_last_event_seen', maxTimestampSeen);
    window.location.href = `anime-detail.html?id=${id}`;
}