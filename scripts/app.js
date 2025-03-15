if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js", {scope: "/"}).then(registration => {
        console.log("Service Worker registered with scope:", registration.scope);
    }).catch(error => {
        console.error("Service Worker registration failed lol", error);
    });
}
