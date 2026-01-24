const CACHE_NAME = 'archinime-cache-v2'; // ¡RECUERDA CAMBIAR ESTO SIEMPRE!
const urlsToCache = [
  './',
  'index.html',
  'styles-index.css',
  'Logo_Archinime.avif'
];

self.addEventListener('install', event => {
  // Obliga al SW a activarse inmediatamente sin esperar
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Borra cachés antiguas para ahorrar espacio y evitar conflictos
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Toma el control de la página inmediatamente
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});