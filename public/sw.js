/* Abide service worker — app shell + static assets only.
 * Never caches Clerk/auth, API credentials, or personalized /api responses.
 */
const VERSION = 'abide-sw-v1'
const SHELL = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  )
})

function isAuthOrApi(url) {
  const p = url.pathname
  if (p.startsWith('/api/')) return true
  if (p.startsWith('/sign-in') || p.startsWith('/sign-up')) return true
  if (p.includes('clerk')) return true
  return false
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?|ico|webmanifest)$/i.test(url.pathname)
  )
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  let url
  try {
    url = new URL(req.url)
  } catch {
    return
  }

  // Only same-origin; never cache cross-origin bible/auth APIs here
  if (url.origin !== self.location.origin) return
  if (isAuthOrApi(url)) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put('/', copy)).catch(() => {})
          return res
        })
        .catch(async () => {
          const cached = (await caches.match('/')) || (await caches.match(req))
          return (
            cached ||
            new Response(
              '<!doctype html><title>Abide offline</title><body style="font-family:system-ui;padding:2rem"><h1>You are offline</h1><p>Open Abide again when you have a connection, or use content already on this device.</p></body>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
            )
          )
        }),
    )
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone()
              caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {})
            }
            return res
          }),
      ),
    )
  }
})

self.addEventListener('message', (event) => {
  const data = event.data
  if (!data || typeof data !== 'object') return
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (data.type === 'SHOW_NOTIFICATION' && self.registration.showNotification) {
    const title = typeof data.title === 'string' ? data.title : 'Abide'
    const options = data.options && typeof data.options === 'object' ? data.options : {}
    event.waitUntil(
      self.registration.showNotification(title, {
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        ...options,
      }),
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = event.notification.data?.url || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        if ('focus' in c) {
          c.navigate?.(target)
          return c.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target)
    }),
  )
})
