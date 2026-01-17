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
        try { notificationsHistory = JSON.parse(stored); } catch (e) { notificationsHistory = []; }
    }
}

function saveHistoryToStorage() {
    localStorage.setItem('archinime_notif_history', JSON.stringify(notificationsHistory));
    updateBellBadge();
}

function checkForNewUpdates() {
    const updatedAnimes = animes.filter(a => a.lastUpdate && a.updateType);
    updatedAnimes.sort((a, b) => b.lastUpdate - a.lastUpdate);
    let newItemsFound = [];
    updatedAnimes.forEach(anime => {
        // FILTRO: No mostrar actualizaciones menores en el popup
        if (anime.updateType.includes("ACTUALIZACIÓN")) return;

        const notifId = `${anime.id}_${anime.lastUpdate}`;
        const exists = notificationsHistory.find(n => n.notifId === notifId);
        
        if (!exists) {
            const newNotif = {
                notifId: notifId,
                animeId: anime.id,
                title: anime.title,
                img: anime.img, 
                seasonCover: anime.latestSeasonCover || anime.img, 
                blockName: anime.latestBlockName || "",
                epTitle: anime.latestEpTitle || "Nuevo Contenido", 
                type: anime.updateType,
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
    const indieMessage = "Entra ahora y disfruta de las últimas novedades ya disponibles";
    let infoString = notif.epTitle;
    if (notif.blockName && notif.blockName !== "Novedad") {
        infoString = `${notif.blockName} - ${notif.epTitle}`;
    }

    // --- LÓGICA DE COLORES ---
    let badgeStyle = "background: linear-gradient(135deg, #8c52ff 0%, #5e17eb 100%); color: #fff;"; // Morado (NUEVO 🔥)
    if (notif.type.includes("ESTRENO")) {
        badgeStyle = "background: #ff0000; color: #fff; box-shadow: 0 0 10px rgba(255,0,0,0.5);"; // Rojo (ESTRENO 🚨)
    }

    modal.innerHTML = `
        <div class="event-card">
            <button class="event-close" onclick="closePopup()" title="Cerrar"><i class="fas fa-times"></i></button>
            <div class="event-visuals">
                <img src="${notif.img}" class="bg-blur-cover">
                <div class="covers-wrapper">
                    <img src="${notif.img}" class="main-cover-img" title="${notif.title}">
                    <img src="${notif.seasonCover}" class="season-cover-img" title="${notif.blockName || 'Novedad'}">
                </div>
                <div class="event-badge" style="${badgeStyle}">${notif.type}</div>
            </div>
            <div class="event-inner">
                <div class="event-details">
                    <div class="event-title">${notif.title}</div>
                    <div class="event-chapter-info">${infoString}</div>
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
        
        let infoString = item.epTitle;
        if (item.blockName && item.blockName !== "Novedad") {
            infoString = `${item.blockName} - ${item.epTitle}`;
        }

        let smallBadgeStyle = "color: #8c52ff;"; // Morado
        if (item.type.includes("ESTRENO")) {
            smallBadgeStyle = "color: #ff4757; font-weight: 800;"; // Rojo
        }

        div.innerHTML = `
            <img src="${item.seasonCover}"> 
            <div class="notif-item-content" onclick="window.location.href='anime-detail.html?id=${item.animeId}'">
                <div class="notif-item-title">${item.title}</div>
                <div class="notif-item-info" style="${smallBadgeStyle}">${item.type}</div>
                <div class="notif-item-date" style="color:#aaa; font-style:italic;">${infoString}</div>
            </div>
        `;
        listContainer.appendChild(div);
    });
}

function updateBellBadge() {
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