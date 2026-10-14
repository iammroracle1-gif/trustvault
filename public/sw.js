// Service Worker for Trust Vault PWA - Optimized for Speed
const CACHE_NAME = 'trust-vault-v2';
const STATIC_CACHE = 'trust-vault-static-v2';
const DYNAMIC_CACHE = 'trust-vault-dynamic-v2';

// Critical assets to cache immediately for instant load
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.png',
  '/dashboard',
  '/markets',
  '/notifications',
  '/settings',
];

// Install event - Pre-cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Cache install failed:', err))
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Cache-first for static, Network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first, cache as fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for offline support
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets and pages - Cache first for instant load
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately
          console.log('[SW] Serving from cache:', url.pathname);
          
          // Update cache in background (stale-while-revalidate)
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, response);
              });
            }
          }).catch(() => {});
          
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }

            const responseClone = response.clone();
            
            // Cache static assets
            if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2|woff)$/)) {
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            } else {
              // Cache HTML pages dynamically
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }

            return response;
          })
          .catch(() => {
            // Offline fallback
            return caches.match('/');
          });
      })
  );
});
