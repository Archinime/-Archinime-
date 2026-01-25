/* --- sw.js AUTOMÁTICO (Network First) --- */
const CACHE_NAME = 'archinime-os-auto';
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'Logo_Archinime.avif'
  // No cacheamos JS ni CSS aquí para forzar su actualización en vivo
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Activar inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Limpiamos cualquier caché vieja que no sea la actual
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Solo interceptamos peticiones GET (lectura)
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // ESTRATEGIA: NETWORK FIRST (RED PRIMERO)
  // Intenta ir a internet primero. Si funciona, actualiza la caché y muestra lo nuevo.
  // Si falla (offline), muestra lo guardado.
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si la respuesta es válida, la guardamos en caché para la próxima vez que estemos offline
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si no hay internet, devolvemos lo que tengamos en caché
        return caches.match(event.request);
      })
  );
});