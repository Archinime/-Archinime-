/* GUARDAR COMO: notification-system.js */

let notificationQueue = []; 
let notificationsHistory = [];
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

function loadHistoryFromStorage() {
    const stored = localStorage.getItem('archinime_notif_history');
    if (stored) {
        try { notificationsHistory = JSON.parse(stored); } 
        catch (e) { notificationsHistory = []; }
    }
}

function saveHistoryToStorage() {
    localStorage.setItem('archinime_notif_history', JSON.stringify(notificationsHistory));
    updateBellBadge();
}

function checkForNewUpdates() {
    // Filtramos solo los que tienen fecha de actualización
    const updatedAnimes = animes.filter(a => a.lastUpdate);
    updatedAnimes.sort((a, b) => b.lastUpdate - a.lastUpdate);

    let newItemsFound = [];

    updatedAnimes.forEach(anime => {
        const notifId = `${anime.id}_${anime.lastUpdate}`;
        const exists = notificationsHistory.find(n => n.notifId === notifId);
        
        if (!exists) {
            // === AQUÍ CAPTURAMOS LOS DATOS NUEVOS ===
            const newNotif = {
                notifId: notifId,
                animeId: anime.id,
                title: anime.title,
                
                // Imagen Principal (Anime completo)
                mainImg: anime.img, 
                
                // Imagen Específica (Temporada/Peli nueva) - Fallback a mainImg si no existe
                seasonImg: anime.metaSeasonCover || anime.img, 
                
                // Textos Específicos
                seasonName: anime.metaSeasonName || "Actualización",
                epTitle: anime.metaEpTitle || "Nuevo Contenido",
                
                date: anime.lastUpdate,
                seen: false 
            };
            
            notificationsHistory.unshift(newNotif);
            newItemsFound.push(newNotif);
        }
    });

    if (newItemsFound.length > 0) {
        if (notificationsHistory.length > 50) notificationsHistory = notificationsHistory.slice(0, 50);
        saveHistoryToStorage();
        notificationQueue = newItemsFound;
        showNextPopup();
    }
}

function showNextPopup() {
    if (notificationQueue.length === 0) return;
    const notif = notificationQueue[0];
    createPopupHTML(notif);
}

function createPopupHTML(notif) {
    const existing = document.getElementById('eventModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'eventModal';

    // Construcción del HTML con doble imagen y textos detallados
    modal.innerHTML = `
        <div class="event-card">
            <button class="event-close" onclick="closePopup()" title="Cerrar"><i class="fas fa-times"></i></button>
            
            <div class="event-visuals">
                <img src="${notif.mainImg}" class="bg-blur-cover">
                
                <div class="covers-wrapper">
                    <div class="cover-box back">
                        <img src="${notif.mainImg}" alt="Anime Cover">
                    </div>
                    
                    <div class="cover-box front">
                        <img src="${notif.seasonImg}" alt="Season Cover">
                        <div class="new-tag">NUEVO</div>
                    </div>
                </div>
            </div>
            
            <div class="event-inner">
                <div class="event-details">
                    <div class="event-title">${notif.title}</div>
                    
                    <div class="event-meta-info">
                        <span class="meta-season">${notif.seasonName}</span>
                        <span class="meta-sep">•</span>
                        <span class="meta-ep">${notif.epTitle}</span>
                    </div>
                    
                    <p class="event-desc">¡Ya disponible! Entra ahora para ver el nuevo contenido recién salido del horno.</p>
                    
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
            const processed = notificationQueue.shift();
            markAsRead(processed.notifId);
            showNextPopup();
        }, 300);
    }
}

function goToAnimeFromPopup(animeId, notifId) {
    markAsRead(notifId);
    notificationQueue = [];
    window.location.href = `anime-detail.html?id=${animeId}`;
}

// --- MENÚ DE LISTA (CAMPANITA) ---
// (Esta parte se mantiene similar, solo actualizamos los datos visuales)

function toggleNotifMenu() {
    const menu = document.getElementById('notifMenu');
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        menu.classList.add('active');
        renderNotificationList();
        document.getElementById('notifBadge').style.display = 'none';
    } else {
        menu.classList.remove('active');
    }
}

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
        const dateObj = new Date(item.date);
        const dateStr = dateObj.toLocaleDateString();

        div.innerHTML = `
            <img src="${item.seasonImg}" style="object-fit:cover;">
            <div class="notif-item-content" onclick="window.location.href='anime-detail.html?id=${item.animeId}'">
                <div class="notif-item-title">${item.title}</div>
                <div class="notif-item-info">
                    <span style="color:var(--accent)">${item.seasonName}</span> - ${item.epTitle}
                </div>
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
    const unread = notificationsHistory.filter(n => !n.seen).length;
    const badge = document.getElementById('notifBadge');
    if (unread > 0) badge.style.display = 'block';
    else badge.style.display = 'none';
}

function markAsRead(notifId) {
    const target = notificationsHistory.find(n => n.notifId === notifId);
    if (target) { target.seen = true; saveHistoryToStorage(); }
}

function clearAllNotifications() {
    if(confirm("¿Borrar todo el historial?")) {
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