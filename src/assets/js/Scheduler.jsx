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

import { removeClass } from './helpers/classes';

import packageJson from '../../../package.json';

import { saveState } from './store/persistedState';

import configureStore from './store/configureStore';

import registerServiceWorker from './helpers/registerServiceWorker';

console.log('Gig Grafter version:', packageJson.version);

const store = configureStore();

/* Listen for state changes, saving a maximum once per second. */
store.subscribe(throttle(() => {
	const {
		week,
		user,
		rota,
		rotas,
		roles,
		shifts,
		settings,
		rotaType,
		rotaTypes,
		employees,
		authenticated,
	} = store.getState();

	saveState('user', user);

	saveState('week', week);

	saveState('roles', roles);

	saveState('settings', settings);

	saveState('employees', employees);

	saveState('authenticated', authenticated);

	saveState('rotas', (rotaTypes.length === 0) ? [] : rotas);

	saveState('rotaType', (rotaTypes.length === 0) ? {} : rotaType);

	saveState('rotaTypes', (rotaTypes.length === 0) ? [] : rotaTypes);

	saveState('rota', (rotaTypes.length === 0 || rotas.length === 0) ? {} : rota);

	saveState('shifts', (rotaTypes.length === 0 || rotas.length === 0) ? [] : shifts);
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
