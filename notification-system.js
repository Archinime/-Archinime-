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
        // FILTRO IMPORTANTE: Si es solo ACTUALIZACIÓN, no lo mostramos en notificaciones
        if (anime.updateType.includes("ACTUALIZACIÓN")) return;

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
                img: anime.img, // Portada principal
                
                // --- NUEVOS CAMPOS ESPECÍFICOS ---
                // Portada del bloque específico (o principal si no hay)
                seasonCover: anime.latestSeasonCover || anime.img, 
                // Nombre del bloque (Ej: Temporada 2)
                blockName: anime.latestBlockName || "",
                // Título del capítulo (Ej: Capítulo 12)
                epTitle: anime.latestEpTitle || "Nuevo Contenido", 
                // ---------------------------------

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

    const notif = notificationQueue[0];
    // Tomar el primero
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
    // Construir el string de información (Bloque - Capítulo)
    // Ejemplo: "Temporada 2 - Capítulo 12" o solo "Capítulo 1" si no hay bloque
    let infoString = notif.epTitle;
    if (notif.blockName && notif.blockName !== "Novedad") {
        infoString = `${notif.blockName} - ${notif.epTitle}`;
    }

    // --- LÓGICA DE COLORES ---
    // Si es ESTRENO -> Rojo
    // Si es NUEVO -> Gradiente Morado (default)
    let badgeStyle = "background: linear-gradient(135deg, #8c52ff 0%, #5e17eb 100%); color: #fff;"; // Default Purple
    if (notif.type.includes("ESTRENO")) {
        badgeStyle = "background: #ff0000; color: #fff; box-shadow: 0 0 10px rgba(255,0,0,0.5);"; // Rojo
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
                    
                    <div class="event-chapter-info">
                        ${infoString}
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
        renderNotificationList();
        // Re-renderizar para asegurar frescura
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
        
        // Construir infoString para la lista también (Bloque - Capitulo)
        let infoString = item.epTitle;
        if (item.blockName && item.blockName !== "Novedad") {
            infoString = `${item.blockName} - ${item.epTitle}`;
        }

        // Estilo badge pequeño en la lista
        let smallBadgeStyle = "color: #8c52ff;";
        if (item.type.includes("ESTRENO")) {
            smallBadgeStyle = "color: #ff4757; font-weight: 800;";
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
    // Contar cuántos tienen seen: false
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