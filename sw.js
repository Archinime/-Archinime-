const CACHE_NAME = 'archinime-os-dynamic';
const urlsToCache = [
  './',
  'index.html',
  'styles-index.css',
  'Logo_Archinime.avif'
];

// 1. INSTALACIÓN: Cachea lo básico, pero no bloquea
self.addEventListener('install', event => {
  self.skipWaiting(); // Forza al SW a activarse de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 2. ACTIVACIÓN: Limpia cachés viejas automáticamente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
           // Borra cualquier caché que no sea la actual
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Toma control de la página inmediatamente
});

// 3. FETCH: ESTRATEGIA NETWORK FIRST (La magia)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si hay internet y respuesta válida:
        // 1. Clonamos la respuesta (porque se consume al leerla)
        const responseClone = networkResponse.clone();
        
        // 2. Actualizamos la caché con lo NUEVO que acabamos de bajar
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        // 3. Entregamos la versión nueva al usuario
        return networkResponse;
      })
      .catch(() => {
        // Si falla internet (catch), entregamos lo que haya en caché
        return caches.match(event.request);
      })
  );
});