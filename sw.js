/* Archivo: sw.js */
const CACHE_NAME = 'archinime-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'styles-index.css',
  'Logo_Archinime.avif',
  'manifest.json'
];

self.addEventListener('install', event => {
  // Obliga al SW a activarse inmediatamente
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Toma control de todos los clientes inmediatamente
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});