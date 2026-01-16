/* GUARDAR COMO: notification-system.js */

let notificationQueue = []; // Cola de pop-ups pendientes por ver
let notificationsHistory = []; // Historial completo para la lista
let isMenuOpen = false;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof animes === 'undefined') {
        console.warn('Sistema de Notificaciones: index-data.js no cargado.');
        return;
    }

    loadHistoryFromStorage();
    checkForNewUpdates();
    renderNotificationList();
    updateBellBadge();
});

// --- LÓGICA PRINCIPAL ---

function loadHistoryFromStorage() {
    const stored = localStorage.getItem('archinime_notif_history');
    if (stored) {
        try {
            notificationsHistory = JSON.parse(stored);
        } catch (e) {
            notificationsHistory = [];
        }
    }
}

function saveHistoryToStorage() {
    localStorage.setItem('archinime_notif_history', JSON.stringify(notificationsHistory));
    updateBellBadge();
}

function checkForNewUpdates() {
    // Buscar animes que tengan fecha de actualización
    const updatedAnimes = animes.filter(a => a.lastUpdate && a.updateType);
    
    // Ordenar por fecha (más reciente primero)
    updatedAnimes.sort((a, b) => b.lastUpdate - a.lastUpdate);

    // Revisar cuáles no están en nuestro historial local
    let newItemsFound = [];

    updatedAnimes.forEach(anime => {
        // Usamos el timestamp como ID único de la notificación
        const notifId = `${anime.id}_${anime.lastUpdate}`;
        
        // Verificar si ya existe en el historial
        const exists = notificationsHistory.find(n => n.notifId === notifId);
        
        if (!exists) {
            // Es nuevo! Lo agregamos al historial y a la cola de pop-ups
            const newNotif = {
                notifId: notifId,
                animeId: anime.id,
                title: anime.title,
                img: anime.img,
                // Si tuvieras portadas específicas en el futuro, irían aquí:
                seasonImg: anime.seasonCover || anime.img, 
                // Si tuvieras nombre de cap específico:
                epTitle: anime.latestEpTitle || "Nuevo Contenido", 
                type: anime.updateType,
                date: anime.lastUpdate,
                seen: false // "seen" significa visto en pop-up
            };
            
            notificationsHistory.unshift(newNotif); // Agregar al inicio de la lista
            newItemsFound.push(newNotif);
        }
    });

    // Si encontramos nuevos, guardamos y preparamos la cola
    if (newItemsFound.length > 0) {
        // Limitamos el historial a 50 items para no saturar memoria
        if (notificationsHistory.length > 50) notificationsHistory = notificationsHistory.slice(0, 50);
        
        saveHistoryToStorage();
        
        // Los nuevos van a la cola de pop-ups para mostrarse uno por uno
        notificationQueue = newItemsFound;
        
        // Iniciar la secuencia de pop-ups
        showNextPopup();
    }
}

// --- POP-UPS (COLA) ---

function showNextPopup() {
    if (notificationQueue.length === 0) return;

    const notif = notificationQueue[0]; // Tomar el primero
    createPopupHTML(notif);
}

function createPopupHTML(notif) {
    // Eliminar previo si existe
    const existing = document.getElementById('eventModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'eventModal';
    
    // Mensaje personalizado indie
    const indieMessage = "Entra ahora y disfruta de las últimas novedades ya disponibles";

    // NOTA: Aquí usamos notif.img para ambas imágenes porque el CMS actual solo guarda una.
    // Si actualizas el CMS para guardar 'seasonCover', cambia el segundo src.
    modal.innerHTML = `
        <div class="event-card">
            <button class="event-close" onclick="closePopup()" title="Cerrar"><i class="fas fa-times"></i></button>
            
            <div class="event-visuals">
                <img src="${notif.img}" class="bg-blur-cover">
                
                <div class="covers-wrapper">
                    <img src="${notif.img}" class="main-cover-img" title="Anime">
                    <img src="${notif.seasonImg}" class="season-cover-img" title="Novedad">
                </div>
                
                <div class="event-badge">${notif.type}</div>
            </div>
            
            <div class="event-inner">
                <div class="event-details">
                    <div class="event-title">${notif.title}</div>
                    <div class="event-chapter-info">
                        ${notif.epTitle === "Nuevo Contenido" ? "¡NUEVA ACTUALIZACIÓN DISPONIBLE!" : notif.epTitle}
                    </div>
                    
                    <p class="event-desc">${indieMessage}</p>
                    
                    <button class="event-btn" onclick="goToAnimeFromPopup('${notif.animeId}', '${notif.notifId}')">
                        <i class="fas fa-play"></i> VER AHORA
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 50);
}

function closePopup() {
    const modal = document.getElementById('eventModal');
    if(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            
            // Marcar este item como "Visto" en la cola y sacarlo
            const processed = notificationQueue.shift();
            markAsRead(processed.notifId);
            
            // Mostrar siguiente
            showNextPopup();
        }, 300);
    }
}

function goToAnimeFromPopup(animeId, notifId) {
    markAsRead(notifId);
    // Limpiamos la cola porque el usuario ya decidió irse a ver algo
    notificationQueue = []; 
    window.location.href = `anime-detail.html?id=${animeId}`;
}

// --- MENÚ DE LISTA (CAMPANITA) ---

function toggleNotifMenu() {
    const menu = document.getElementById('notifMenu');
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        menu.classList.add('active');
        renderNotificationList(); // Re-renderizar para asegurar frescura
        // Al abrir, quitamos el punto rojo (badge) visualmente
        document.getElementById('notifBadge').style.display = 'none';
    } else {
        menu.classList.remove('active');
    }
}

// Cerrar menú si clic fuera
document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.notif-wrapper');
    if (wrapper && !wrapper.contains(e.target) && isMenuOpen) {
        isMenuOpen = false;
        document.getElementById('notifMenu').classList.remove('active');
    }
});

function renderNotificationList() {
    const listContainer = document.getElementById('notifList');
    listContainer.innerHTML = '';

    if (notificationsHistory.length === 0) {
        listContainer.innerHTML = '<div class="empty-notif">Sin novedades por ahora.</div>';
        return;
    }

    notificationsHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'notif-item';
        // Formatear fecha simple
        const dateObj = new Date(item.date);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.getHours() + ':' + String(dateObj.getMinutes()).padStart(2, '0');

        div.innerHTML = `
            <img src="${item.img}">
            <div class="notif-item-content" onclick="window.location.href='anime-detail.html?id=${item.animeId}'">
                <div class="notif-item-title">${item.title}</div>
                <div class="notif-item-info">${item.type}</div>
                <div class="notif-item-date">${dateStr}</div>
            </div>
            <button class="notif-item-del" onclick="deleteSingleNotif('${item.notifId}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        listContainer.appendChild(div);
    });
}

function updateBellBadge() {
    // Contar cuántos tienen seen: false (opcional, o simplemente si hay items recientes)
    // Para simplificar: si hay historial, mostramos badge hasta que el usuario abra el menú.
    // O mejor: contemos los "no leídos" reales si quisieras lógica compleja.
    // Lógica simple: Si hay items en historial, mostramos badge si isMenuOpen es false.
    // (Ajusta según prefieras).
    
    // Aquí: solo muestra badge si hay updates que llegaron en esta sesión (notificationQueue)
    // O si hay items no leidos.
    const unread = notificationsHistory.filter(n => !n.seen).length;
    const badge = document.getElementById('notifBadge');
    if (unread > 0) {
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function markAsRead(notifId) {
    const target = notificationsHistory.find(n => n.notifId === notifId);
    if (target) {
        target.seen = true;
        saveHistoryToStorage();
    }
}

function clearAllNotifications() {
    if(confirm("¿Borrar todo el historial de notificaciones?")) {
        notificationsHistory = [];
        saveHistoryToStorage();
        renderNotificationList();
    }
}

function deleteSingleNotif(notifId) {
    notificationsHistory = notificationsHistory.filter(n => n.notifId !== notifId);
    saveHistoryToStorage();
    renderNotificationList();
}