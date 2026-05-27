// Pawgress Service Worker – Offline Support
const CACHE = "pawgress-v1";
const STATIC = [
  "/",
  "/manifest.json",
  "/images/home_hero.webp",
  "/images/nav_paw.webp",
  "/images/paw.webp",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Never cache Supabase API calls
  if (url.hostname.includes("supabase")) return;
  // Cache-first for assets, network-first for navigation
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("/"))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached ?? fetch(e.request))
    );
  }
});
