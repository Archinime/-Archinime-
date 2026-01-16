/* GUARDAR COMO: notification-system.js */

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si 'animes' está cargado (del index-data.js)
    if (typeof animes === 'undefined') {
        console.warn('Sistema de Notificaciones: index-data.js no cargado aún.');
        return;
    }

    checkLatestEvent();
});

function checkLatestEvent() {
    // 1. Filtrar animes que tengan datos de actualización
    const updatedAnimes = animes.filter(a => a.lastUpdate && a.updateType);
    if (updatedAnimes.length === 0) return;

    // 2. Ordenar por fecha (el más reciente primero)
    updatedAnimes.sort((a, b) => b.lastUpdate - a.lastUpdate);
    const latest = updatedAnimes[0];
    
    // 3. Comprobar LocalStorage para no spamear al usuario
    const lastSeenEvent = localStorage.getItem('archinime_last_event_seen');

    // Si el usuario ya vio este evento específico, no lo mostramos.
    if (lastSeenEvent == latest.lastUpdate) {
        // console.log("Evento ya visto por el usuario.");
        return; 
    }

    // 4. Mostrar el Modal
    showEventModal(latest);
}

function showEventModal(anime) {
    const modal = document.createElement('div');
    modal.id = 'eventModal';
    
    modal.innerHTML = `
        <div class="event-card">
            <button class="event-close" onclick="closeEventModal()"><i class="fas fa-times"></i></button>
            <div class="event-cover-container">
                <img src="${anime.img}" class="event-cover">
                <div class="event-badge">${anime.updateType || 'NUEVO'}</div>
            </div>
            <div class="event-inner">
                <div class="event-details">
                    <div class="event-title">${anime.title}</div>
                    <div class="event-subtitle">¡YA DISPONIBLE EN ARCHINIME!</div>
                    <p style="color:#888; font-size:0.85em; margin-bottom:15px; line-height:1.4">
                        Entra ahora y disfruta del contenido más reciente subido por nuestros administradores.
                    </p>
                    <button class="event-btn" onclick="goToAnime('${anime.id}', ${anime.lastUpdate})">
                        <i class="fas fa-play"></i> VER AHORA
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Pequeño delay para la animación CSS
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 400);
        
        // Marcar como visto al cerrar
        if(typeof animes !== 'undefined') {
             const updatedAnimes = animes.filter(a => a.lastUpdate).sort((a, b) => b.lastUpdate - a.lastUpdate);
             if(updatedAnimes.length > 0) {
                 localStorage.setItem('archinime_last_event_seen', updatedAnimes[0].lastUpdate);
             }
        }
    }
}

function goToAnime(id, timestamp) {
    // Guardamos que se vio antes de irse
    localStorage.setItem('archinime_last_event_seen', timestamp);
    // Redirigir a la página de detalle
    window.location.href = `anime-detail.html?id=${id}`;
}