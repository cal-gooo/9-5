const CACHE_NAME = `9-5-cache-${new Date().toISOString().slice(0, 10)}`; // Cache name with today's date
const urlsToCache = ['/', '/index.html', '/manifest.json'];

// Install the service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch resources
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached response if available
            if (response) {
                return response;
            }

            // Log the request URL for debugging
            console.debug('Fetching:', event.request.url);

            // Attempt to fetch the resource from the network
            return fetch(event.request).catch((error) => {
                console.error('Fetch failed:', error, event.request.url);

                // Provide a fallback response if fetch fails
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});

// Activate the service worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );

    // Claim clients immediately so the new service worker takes control
    self.clients.claim();
});

// Periodic Update Check
setInterval(() => {
    self.registration.update(); // Check for updates to the service worker
}, 24 * 60 * 60 * 1000); // Check every 24 hours
