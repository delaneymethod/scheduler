/* Regularly try to get some scripts' init function until it's loaded. */

/*
const scriptService = {};

const scriptLoadTimer = setInterval(() => {
	if (window.someScriptInit) {
		scriptService.someScriptInit = window.someScriptInit;

		clearInterval(scriptLoadTimer);
	}
}, 100);

export default scriptService;
*/
