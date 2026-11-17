/* Service Worker der Stundenbewertung: macht die App offline nutzbar.
   index.html wird "Netz zuerst" geladen (neue Version sofort, wenn Internet da ist),
   sonst aus dem Cache. Alles andere (Icons, Manifest) kommt aus dem Cache. */
const CACHE = 'stundenbewertung-shell-v1'; // nur hochzählen, wenn sich Icons oder Manifest ändern
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isPage) {
    const fromNet = fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); } return r; });
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000));
    e.respondWith(Promise.race([fromNet, timeout]).catch(() => caches.match('./index.html').then(r => r || fromNet)));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })));
});
