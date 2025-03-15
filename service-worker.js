self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("my-cache").then(cache => {
            console.log('install');
            return cache.addAll([
                "/",
                "/index.html",
                "/manifest.json",
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
