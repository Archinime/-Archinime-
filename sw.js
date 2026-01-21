const CACHE_NAME = 'archinime-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'styles-index.css',
  'Logo_Archinime.avif'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});