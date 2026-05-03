/* ============================================================
   sw.js - Archinime OS Service Worker
   Estrategia híbrida:
   - HTML: Network-first (nunca cachear HTML para respuesta)
   - Imágenes y vídeos: Stale-while-revalidate
   - Fuentes y estilos: Cache-first con actualización en segundo plano
   - Otros recursos: Network-first
   Compatible con PWA y notificaciones push (base)
   ============================================================ */

const CACHE_STATIC = 'archinime-static-v23';
const CACHE_DYNAMIC = 'archinime-dynamic-v23';
const CACHE_IMAGES = 'archinime-images-v23';
const CACHE_FONTS = 'archinime-fonts-v23';

// Recursos críticos a precachear (estáticos y siempre necesarios)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/anime-detail.html',
  '/video-player.html',
  '/styles-index.css',
  '/script-index.js',
  '/anime-detail-core.js',
  '/notification-system.js',
  '/musica_fondo.js',
  '/animaciones.js',
  '/gifs.js',
  '/anuncios_index.js',
  '/manifest.json',
  '/Logo_Archinime.avif',
  '/Logo_Archinime.png',
  '/youtube.avif',
  '/invitado.avif',
  '/galaxia-morado1.avif',
  '/chica_corriendo.gif'
];

// Instalación: precache de recursos estáticos
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  self.skipWaiting(); // Activar inmediatamente

  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(err => console.warn('[SW] Precache falló en algunos recursos:', err))
  );
});

// Activación: limpieza de cachés antiguas
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
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
    })
  );

  return self.clients.claim(); // Tomar control de todas las pestañas
});

// Estrategia de fetch según tipo de recurso
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const request = event.request;

  // Ignorar peticiones no GET
  if (request.method !== 'GET') return;

  // 🔥 REGLA #1: NUNCA SERVIR HTML DESDE CACHÉ (siempre red primero)
  if (request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(networkFirst(request));
    return;
  }

  // 🎨 REGLA #2: FUENTES Y CSS/JS (cache first con actualización en segundo plano)
  if (request.destination === 'font' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 🖼️ REGLA #3: IMÁGENES Y VÍDEOS (stale-while-revalidate para carga instantánea)
  if (request.destination === 'image' || request.destination === 'video') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 🌐 REGLA #4: API o cualquier otra petición (network-first, sin cache)
  if (url.origin.includes('firestore') || url.origin.includes('googleapis') || url.pathname.includes('/api/')) {
    event.respondWith(fetch(request)); // Solo red, no cachear
    return;
  }

  // 📦 REGLA #5: Resto de recursos (network-first con fallback a cache)
  event.respondWith(networkFirst(request));
});

// ---------- ESTRATEGIAS ----------

// Network-first: intenta red, si falla usa cache (y guarda en dinámica)
async function networkFirst(request) {
  const cache = await caches.open(CACHE_DYNAMIC);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Guardar en cache dinámico para futuro offline
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('[SW] Sirviendo desde cache (offline):', request.url);
      return cachedResponse;
    }
    // Si no está en cache, devolver fallback (p.ej. página offline)
    if (request.destination === 'document') {
      return caches.match('/offline.html'); // Puedes crear una página offline
    }
    throw err;
  }
}

// Stale-while-revalidate: devuelve cache primero, actualiza en segundo plano
async function staleWhileRevalidate(request) {
  const cacheName = getCacheNameForRequest(request);
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(err => console.warn('[SW] Actualización en segundo plano falló:', err));

  // Devolver cache inmediatamente si existe, si no esperar a la red
  return cachedResponse || fetchPromise;
}

// Determinar qué caché usar según el tipo de recurso
function getCacheNameForRequest(request) {
  const dest = request.destination;
  if (dest === 'image' || dest === 'video') return CACHE_IMAGES;
  if (dest === 'font') return CACHE_FONTS;
  if (dest === 'style' || dest === 'script') return CACHE_STATIC;
  return CACHE_DYNAMIC;
}

// ---------- MENSAJES (para actualización de SW) ----------
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// ---------- PUSH NOTIFICATIONS (opcional) ----------
self.addEventListener('push', event => {
  let data = { title: 'Archinime', body: 'Nueva actualización disponible', icon: '/Logo_Archinime.png' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/Logo_Archinime.png',
    badge: '/Logo_Archinime.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});