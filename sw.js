/* ============================================================
   sw.js - Archinime OS Service Worker - OFFLINE FIRST
   ============================================================ */

const CACHE_STATIC = 'archinime-static-v57';
const CACHE_DYNAMIC = 'archinime-dynamic-v57';
const CACHE_IMAGES = 'archinime-images-v57';
const CACHE_FONTS = 'archinime-fonts-v57';

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

self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  const currentCaches = [CACHE_STATIC, CACHE_DYNAMIC, CACHE_IMAGES, CACHE_FONTS];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const request = event.request;
  if (request.method !== 'GET') return;

  // Catálogo: siempre desde caché primero (stale-while-revalidate)
  if (url.pathname.endsWith('/catalogo.js')) {
    event.respondWith(staleWhileRevalidate(request, CACHE_DYNAMIC));
    return;
  }

  // HTML: cache-first (offline prioritario)
  if (request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // CSS/JS/Fuentes: stale-while-revalidate
  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'font') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Imágenes/vídeos: stale-while-revalidate
  if (request.destination === 'image' || request.destination === 'video') {
    event.respondWith(staleWhileRevalidate(request, CACHE_IMAGES));
    return;
  }

  // Firestore/API: solo red (sin caché)
  if (url.origin.includes('firestore') || url.origin.includes('googleapis') || url.pathname.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Resto: network-first
  event.respondWith(networkFirst(request));
});

// ========== ESTRATEGIAS ==========

// Cache first: devuelve caché, si no, red
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_STATIC);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return new Response('Página no disponible offline', { status: 503 });
  }
}

// Network-first con fallback a caché
async function networkFirst(request) {
  const cache = await caches.open(CACHE_DYNAMIC);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    return cached || new Response('Recurso no disponible', { status: 503 });
  }
}

// Stale-while-revalidate
async function staleWhileRevalidate(request, cacheName = CACHE_DYNAMIC) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {});
  return cached || fetchPromise;
}

// Push (notificaciones)
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