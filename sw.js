const CACHE_NAME = "atividade-pwa";
const FILES_TO_CACHE = [
    "/Atividade-pwa/",
    "/Atividade-pwa/index.html",
    "/Atividade-pwa/css/style.css",
    "/Atividade-pwa/js/script.js",
    "/Atividade-pwa/js/scriptCRUD.js",
    "/Atividade-pwa/manifest.json",
    "/Atividade-pwa/icon.png"
];

// Instala e faz cache dos arquivos
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// Limpa caches antigos
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Serve do cache, com fallback pra rede
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
});