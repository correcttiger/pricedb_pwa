self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("pricedb-cache").then(cache => {
            return cache.addAll([
                "/",
                "/manifest.json",
                "/service_worker.js",
                "/scripts/app.js",
                "/bootstrap/bootstrap.min.css",
                "/bootstrap/bootstrap.bundle.min.js",
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
