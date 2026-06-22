/* ============================================================
   sw.js - Archinime OS Service Worker
   OFFLINE FIRST: Catálogo, páginas y recursos siempre disponibles
   ============================================================ */

const CACHE_STATIC = 'archinime-static-v55';
const CACHE_DYNAMIC = 'archinime-dynamic-v55';
const CACHE_IMAGES = 'archinime-images-v55';
const CACHE_FONTS = 'archinime-fonts-v55';

// Lista completa de recursos que se cachean al instalar
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/anime-detail.html',
  '/video-player.html',
  '/catalogo.js',
  '/animaciones.js',
  '/musica_fondo.js',
  '/notification-system.js',
  '/gifs.js',
  '/state.js',
  '/app-core.js',
  '/dompurify-config.js',
  '/comentarios.js',
  '/reacciones.js',
  '/stickers-system.js',
  '/video-player-core.js',
  '/anime-detail-core.js',
  '/manifest.json',
  '/Logo_Archinime.avif',
  '/Logo_Archinime.png',
  '/invitado.avif',
  '/galaxia-morado1.avif',
  '/chica_corriendo.gif',
  '/youtube.avif'
];

// Instalación: precache de todos los recursos
self.addEventListener('install', event => {
  console.log('[SW] Instalando y precacheando...');
  self.skipWaiting(); // Toma el control inmediatamente
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(err => console.warn('[SW] Error en precache:', err))
  );
});

// Activación: limpieza de cachés antiguas
self.addEventListener('activate', event => {
  console.log('[SW] Activando y limpiando...');
  const currentCaches = [CACHE_STATIC, CACHE_DYNAMIC, CACHE_IMAGES, CACHE_FONTS];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[SW] Eliminando caché obsoleta:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: estrategias por tipo de recurso
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const request = event.request;

  // Solo GET
  if (request.method !== 'GET') return;

  // ============================================================
  // 1. CATÁLOGO: stale-while-revalidate (siempre disponible)
  // ============================================================
  if (url.pathname.endsWith('/catalogo.js')) {
    event.respondWith(staleWhileRevalidate(request, CACHE_DYNAMIC));
    return;
  }

  // ============================================================
  // 2. HTML: network-first, fallback a caché
  // ============================================================
  if (request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(networkFirst(request));
    return;
  }

  // ============================================================
  // 3. CSS/JS/Fuentes: stale-while-revalidate
  // ============================================================
  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'font') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // ============================================================
  // 4. Imágenes y vídeos: stale-while-revalidate (caché separada)
  // ============================================================
  if (request.destination === 'image' || request.destination === 'video') {
    event.respondWith(staleWhileRevalidate(request, CACHE_IMAGES));
    return;
  }

  // ============================================================
  // 5. API / Firestore: solo red (sin caché)
  // ============================================================
  if (url.origin.includes('firestore') || url.origin.includes('googleapis') || url.pathname.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // ============================================================
  // 6. Resto: network-first
  // ============================================================
  event.respondWith(networkFirst(request));
});

// ==================== ESTRATEGIAS ====================

// Network-first con fallback a caché
async function networkFirst(request) {
  const cache = await caches.open(CACHE_DYNAMIC);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || Response.error();
  }
}

// Stale-while-revalidate: sirve caché mientras se actualiza en segundo plano
async function staleWhileRevalidate(request, cacheName = CACHE_DYNAMIC) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Actualización en segundo plano (no bloquea)
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {});

  // Devuelve caché si existe, sino espera la red
  return cachedResponse || fetchPromise;
}

// ==================== PUSH (notificaciones) ====================
self.addEventListener('push', event => {
  let data = { title: 'Archinime', body: 'Nueva actualización', icon: '/Logo_Archinime.png' };
  if (event.data) {
    try { data = event.data.json(); } catch (e) { data.body = event.data.text(); }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/Logo_Archinime.png',
      badge: '/Logo_Archinime.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});