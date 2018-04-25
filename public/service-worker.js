/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

/* https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker */

(() => {
	const staticFilesToCache = [
		'404.html',
		'robots.txt',
		'index.html',
		'main.bundle.js',
		'crossdomain.xml',
		'main.bundle.css',
		'vendors.bundle.js',
		'scripts.bundle.js',
		'service-worker.js',
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
