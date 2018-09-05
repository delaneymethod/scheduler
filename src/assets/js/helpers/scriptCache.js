let counter = 0;

const scriptMap = new Map();

export const ScriptCache = (global => (scripts) => {
	const Cache = {};

	Cache.onLoad = key => (cb) => {
		const stored = scriptMap.get(key);

		if (stored) {
			stored.promise.then(() => {
				stored.error ? cb(stored.error) : cb(null, stored);
			});
		} else {
			logMessage('warn', `No script cached for ${key}`);
		}
	};

	Cache.scriptTag = (key, src) => {
		if (!scriptMap.has(key)) {
			const tag = document.createElement('script');

			const promise = new Promise((resolve, reject) => {
				let cb;

				const cbName = `loaderCB${counter +=1 }${Date.now()}`;

				const body = document.getElementsByTagName('body')[0];

				const cleanup = () => {
					if (global[cbName] && typeof global[cbName] === 'function') {
						global[cbName] = null;
					}
				};

				const handleResult = (state) => {
					return (event) => {
						let stored = scriptMap.get(key);

						if (state === 'loaded') {
							stored.resolved = true;

							resolve(src);
						} else if (state === 'error') {
							stored.rejected = true;

							reject(event);
						}

						cleanup();
					};
				};

				tag.async = true;

				tag.defer = true;

				tag.type = 'text/javascript';

				tag.onload = handleResult('loaded');

				tag.onerror = handleResult('error');

				tag.onreadystatechange = () => {
					handleResult(tag.readyState);
				};

				if (src.match(/callback=CALLBACK_NAME/)) {
					src = src.replace(/(callback=)[^\&]+/, `$1${cbName}`);

					cb = window[cbName] = tag.onload;
				} else {
					tag.addEventListener('load', tag.onload);
				}

				tag.addEventListener('error', tag.onerror);

				tag.src = src;

				body.appendChild(tag);

				return tag;
			});

			const initialState = {
				tag,
				promise,
				rejected: false,
				resolved: false,
			};

			scriptMap.set(key, initialState);
		}

		return scriptMap.get(key);
	};

	Object.keys(scripts).forEach((key) => {
		const script = scripts[key];

		Cache[key] = {
			onLoad: Cache.onLoad(key),
			tag: Cache.scriptTag(key, script),
		};
	});

	return Cache;
})(window);

export default ScriptCache;
