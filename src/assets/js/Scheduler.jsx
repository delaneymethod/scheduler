import 'bootstrap';
import 'raf/polyfill';
import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import 'classlist-polyfill';
import 'vanilla-autofill-event';
import ReactDOM from 'react-dom';
import fastclick from 'fastclick';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import { BrowserRouter } from 'react-router-dom';

import '../scss/global';

import App from './components/App';

import config from './helpers/config';

import { removeClass } from './helpers/classes';

import packageJson from '../../../package.json';

import configureStore from './store/configureStore';

import registerServiceWorker from './helpers/registerServiceWorker';

import { saveState as saveLocalStorageState } from './store/persistedLocalStorageState';

import { saveState as saveSessionStorageState } from './store/persistedSessionStorageState';

console.log(`%c${packageJson.author.name} version: ${packageJson.version}`, 'background-color: #343E48; color: #90BC47; padding: 5px 10px');

const store = configureStore();

const APP_ID = (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ? config.APP.TRACKING.INTERCOM.DEV : config.APP.TRACKING.INTERCOM.PROD;

window.intercomSettings = {
	app_id: APP_ID,
};

window.isRunningLocalhost = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '');

/* Listen for state changes, saving a maximum once per second. */
store.subscribe(throttle(() => {
	const {
		week,
		user,
		rota,
		rotas,
		roles,
		route,
		shifts,
		rotaCost,
		settings,
		rotaType,
		rotaTypes,
		employees,
		cookieConsent,
		authenticated,
		rotaEmployees,
		unavailabilities,
		unavailabilityTypes,
		applicationUserRoles,
		unavailabilityOccurrences,
	} = store.getState();

	saveSessionStorageState('week', week);

	saveSessionStorageState('user', user);

	saveSessionStorageState('route', route);

	saveSessionStorageState('roles', roles);

	saveSessionStorageState('settings', settings);

	saveSessionStorageState('employees', employees);

	/* Keep cookie consent in local storage so the cookie banner state stays consistent across multiple tabs/windows */
	saveLocalStorageState('cookieConsent', cookieConsent);

	saveSessionStorageState('authenticated', authenticated);

	saveSessionStorageState('unavailabilities', unavailabilities);

	saveSessionStorageState('unavailabilityTypes', unavailabilityTypes);

	saveSessionStorageState('applicationUserRoles', applicationUserRoles);

	saveSessionStorageState('rotas', (rotaTypes.length === 0) ? [] : rotas);

	saveSessionStorageState('unavailabilityOccurrences', unavailabilityOccurrences);

	saveSessionStorageState('rotaCost', (rotaTypes.length === 0) ? 0 : rotaCost);

	saveSessionStorageState('rotaType', (rotaTypes.length === 0) ? {} : rotaType);

	saveSessionStorageState('rotaTypes', (rotaTypes.length === 0) ? [] : rotaTypes);

	saveSessionStorageState('rotaEmployees', (rotaTypes.length === 0) ? [] : rotaEmployees);

	saveSessionStorageState('rota', (rotaTypes.length === 0 || rotas.length === 0) ? {} : rota);

	saveSessionStorageState('shifts', (rotaTypes.length === 0 || rotas.length === 0) ? [] : shifts);
}, 1000));

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app'),
);

/* Polyfill to remove click delays on touch UIs */
fastclick.attach(document.body);

/* Fixes Object doesn't support property or method "forEach" in IE */
if (typeof NodeList.prototype.forEach !== 'function') {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

/* IE10 viewport hack for Surface/desktop Windows 8 bug */
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	const msViewportStyle = document.createElement('style');

	msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));

	document.head.appendChild(msViewportStyle);
}

const navigatorUserAgent = navigator.userAgent;

const isAndroid = (navigatorUserAgent.indexOf('Mozilla/5.0') > -1 && navigatorUserAgent.indexOf('Android ') > -1 && navigatorUserAgent.indexOf('AppleWebKit') > -1 && navigatorUserAgent.indexOf('Chrome') === -1);

if (isAndroid) {
	const element = document.querySelector('select.form-control');

	element.style.width = '100%';

	removeClass(element, 'form-control');
}

/* Add a service worker for Progressive Web App purposes */
registerServiceWorker();
