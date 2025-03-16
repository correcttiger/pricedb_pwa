// self.addEventListener("install", event => {
//     event.waitUntil(
//         caches.open("pricedb-cache").then(cache => {
//             return cache.addAll([
//                 "/",
//                 "/manifest.json",
//                 "/scripts/sw.js",
//                 "/scripts/app.js",
//                 "/bootstrap/bootstrap.min.css",
//                 "/bootstrap/bootstrap.bundle.min.js",
//             ]);
//         })
//     );
// });

// self.addEventListener("fetch", event => {
//     event.respondWith(
//         caches.match(event.request).then(response => {
//             return response || fetch(event.request);
//         })
//     );
// });


const serviceWorkerVersion = "0.1.0"
const cacheName = "MyPdfSlideshowPWA-v" + serviceWorkerVersion
const appShellFiles = [
    "./index.html",
    "./scripts/app.js",
    "./images/icon_128.png",
    "./styles/bootstrap.min.css",
    "./scripts/bootstrap.bundle.min.js"
]
const otherFiles = []
const contentToCache = appShellFiles.concat(otherFiles)

self.addEventListener("install", function (evt) {
    console.log("[Service Worker] Installing... version: " + serviceWorkerVersion + " cacheName:" + cacheName)
    // use newly installed service worker.
    // returned Promise from skipWaiting() can be safely ignored.
    self.skipWaiting()
    evt.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[Service Worker] Caching all: app shell and content")
            return cache.addAll(contentToCache)
        })
    )
})

self.addEventListener("fetch", function (evt) {
    evt.respondWith(
        caches.match(evt.request).then(function (r) {
            console.log("[Service Worker] Fetching resource: " + evt.request.url)
            // we don"t store falsy objects, so "||" works fine here.
            return r || fetch(evt.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    console.log("[Service Worker] Caching new resource: " + evt.request.url)
                    cache.put(evt.request, response.clone())
                    return response
                })
            })
        })
    )
})

self.addEventListener("activate", (evt) => {
    console.log("Activating new service worker...")
    const cacheAllowlist = [cacheName]

    evt.waitUntil(
        caches.keys().then((keyList) => {
            // eslint-disable-next-line array-callback-return
            return Promise.all(keyList.map((key) => {
                if (cacheAllowlist.indexOf(key) === -1) {
                    console.log("[Service Worker] deleting old cache: " + cacheName)
                    return caches.delete(key)
                }
            }))
        })
    )
    console.log("done.")
})
