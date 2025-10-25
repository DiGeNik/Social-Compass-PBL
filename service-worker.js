// --- Service Worker за PWA ---
// service-worker.js

// Име на кеша. Препоръчително е да се променя при всяка актуализация на файловете.
const CACHE_NAME = 'crusoe-compass-cache-v1';

// Списък с файловете, които трябва да бъдат кеширани
const urlsToCache = [
    './',
    './index.html',
    './app.js',
    './manifest.webmanifest',
    'https://cdn.tailwindcss.com', // Tailwind CSS CDN
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', // Font Awesome
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap' // Inter Font
];

// Инсталиране на Service Worker и кеширане на статичните ресурси
self.addEventListener('install', event => {
    // Изчакваме докато кеширането приключи
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Добавяне на всички необходими ресурси в кеша
                return cache.addAll(urlsToCache);
            })
    );
    // Принуждаваме service worker-а да се активира веднага
    self.skipWaiting();
});

// Активиране на Service Worker и почистване на стари кешове
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    // Изчистване на всички стари версии на кеша
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Изтриване на стари кешове
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Стратегия за обработка на заявки: Cache-First
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Ако има отговор в кеша, връщаме него
                if (response) {
                    return response;
                }
                // Ако няма, правим мрежова заявка
                return fetch(event.request);
            })
    );
});
