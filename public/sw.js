const CACHE_NAME = "mokeb-khadem-alreza-v3";

const STATIC_ASSETS = [
    "/",
    "/logo.png",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (const asset of STATIC_ASSETS) {
                try {
                    await cache.add(asset);
                } catch (error) {
                    console.error(
                        "Failed to cache:",
                        asset,
                        error
                    );
                }
            }
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter(
                        (name) =>
                            name !== CACHE_NAME
                    )
                    .map((name) =>
                        caches.delete(name)
                    )
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (
        url.pathname.startsWith("/admin") ||
        url.pathname.startsWith("/api") ||
        url.pathname.startsWith("/auth") ||
        url.pathname.startsWith("/login") ||
        url.pathname.startsWith("/register") ||
        url.pathname.startsWith("/_next/")
    ) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (
                    response.ok &&
                    response.type === "basic"
                ) {
                    const clone = response.clone();

                    caches.open(CACHE_NAME).then(
                        (cache) => {
                            cache.put(request, clone);
                        }
                    );
                }

                return response;
            })
            .catch(async () => {
                const cached =
                    await caches.match(request);

                if (cached) {
                    return cached;
                }

                return caches.match("/");
            })
    );
});