/* ==========================================
   1. CÓDIGO DE PUBLICIDAD (PropellerAds)
   ========================================== */
self.options = {
    "domain": "5gvci.com",
    "zoneId": 10499066
};
self.lary = "";
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');

/* ==========================================
   2. CÓDIGO DE CACHÉ (PWA / Offline)
   ========================================== */
const CACHE_NAME = 'archinime-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'styles-index.css',
  // He cambiado .avif a .png para que coincida con tu HTML
  'Logo_Archinime.png' 
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