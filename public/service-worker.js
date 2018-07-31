(() => {
	const staticFilesToCache = [
		'404.html',
		'robots.txt',
		'index.html',
		'main.bundle.js',
		'crossdomain.xml',
		'main.bundle.css',
		'runtime.bundle.js',
		'vendors.bundle.js',
		'proximanova-light-webfont.woff2',
		'proximanova-light-webfont.woff',
		'proximanova-regular-webfont.woff2',
		'proximanova-regular-webfont.woff',
		'proximanova-semibold-webfont.woff2',
		'proximanova-semibold-webfont.woff',
		'proximanova-bold-webfont.woff2',
		'proximanova-bold-webfont.woff',
		'fontawesome-webfont.woff2?v=4.7.0',
	];

	/* Will use cache, falling back to network. */
	const staticCaches = 'scheduler-app-cache';

	/* Will use cache then network. */
	const apiCaches = 'scheduler-api-cache';

	/* Attempting to install service worker and cache static assets */
	self.addEventListener('install', event => {
		event.waitUntil(
			caches.open(staticCaches)
				.then(cache => cache.addAll(staticFilesToCache))
				.catch(error => console.error('Service worker failed to install and cache static assets: ', error))
			);
	});

	/* Activating new service worker */
	self.addEventListener('activate', event => {
		const cacheWhitelist = [
			apiCaches,
			staticCaches, 
		];

		event.waitUntil(
			caches.keys()
				.then(cacheNames => {
					return Promise.all(cacheNames.map(cacheName => {
						if (cacheWhitelist.indexOf(cacheName) === -1) {
							return caches.delete(cacheName);
						}
					}));
				})
				.catch(error => console.error('Service worker failed to activate new service worker: ', error))
			);
	});

	/* If found in the cache then return from cache else from network */
	self.addEventListener('fetch', event => {
		/* Fetch event for event.request.url */
		event.respondWith(
			caches.match(event.request)
				.then(response => {
					if (response) {
						/* Found event.request.url in cache */
						return response;
					}

					/* Not in cache... Making network request for event.request.url */
					return fetch(event.request)
						.then(response => {
							if (response.status === 404) {
								return caches.match('404.html');
							}

							return response;
						})
						.catch(error => console.error('Service worker failed to fetch: ', event.request.url, error));
				})
				.catch(error => {
					console.error('Service worker failed to match caches: ', error);

					return caches.match('404.html');
				})
			);
	});
})();
