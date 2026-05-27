// Pawgress Service Worker – Offline Support
// Cache-Version wird beim Build automatisch gesetzt
const CACHE = "pawgress-v__BUILD_DATE__";
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
  // Alle alten Caches löschen → zwingt Nutzer zur neuen Version
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Supabase API-Calls nie cachen
  if (url.hostname.includes("supabase")) return;
  // Navigation: Network-first, Fallback auf gecachte Root
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("/"))
    );
  } else {
    // Assets: Cache-first
    e.respondWith(
      caches.match(e.request).then(cached => cached ?? fetch(e.request))
    );
  }
});

// Update-Check: Beim Aktivieren Clients informieren
self.addEventListener("message", e => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
