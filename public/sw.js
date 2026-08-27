// Cleanup service worker — replaces the old next-pwa service worker.
// Once deployed, the browser detects the byte difference, installs this new SW,
// and on activation it wipes all old caches and unregisters itself.

self.addEventListener('install', function () {
  // Skip waiting so this SW activates immediately, replacing the old next-pwa SW
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    // 1. Claim all clients so this SW takes control immediately
    self.clients
      .claim()
      .then(function () {
        // 2. Delete all caches created by next-pwa (workbox)
        return caches.keys();
      })
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
      .then(function () {
        // 3. Unregister this service worker so the app runs SW-free
        return self.registration.unregister();
      })
      .then(function () {
        // 4. Reload all open tabs/windows to fetch fresh content from the network
        return self.clients.matchAll({ type: 'window' });
      })
      .then(function (clients) {
        clients.forEach(function (client) {
          client.navigate(client.url);
        });
      })
  );
});
