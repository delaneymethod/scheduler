import 'bootstrap';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import fastclick from 'fastclick';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import { BrowserRouter } from 'react-router-dom';

import '../scss/global';

import App from './components/App';
import { saveState } from './store/persistedState';
import { getShifts } from './actions/shiftActions';
import configureStore from './store/configureStore';
import registerServiceWorker from './helpers/registerServiceWorker';

const store = configureStore();

/* Listen for state changes, saving a maximum once per second. We only want to persist the authenticated state for now. */
store.subscribe(throttle(() => saveState('authenticated', store.getState().authenticated), 1000));

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

/* IE10 viewport hack for Surface/desktop Windows 8 bug */
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	const msViewportStyle = document.createElement('style');

	msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));

	document.head.appendChild(msViewportStyle);
}

const navigatorUserAgent = navigator.userAgent;

const isAndroid = (navigatorUserAgent.indexOf('Mozilla/5.0') > -1 && navigatorUserAgent.indexOf('Android ') > -1 && navigatorUserAgent.indexOf('AppleWebKit') > -1 && navigatorUserAgent.indexOf('Chrome') === -1);

if (isAndroid) {
	/* FIXME - Convert to vanilla JS instead of jQuery $('select.form-control').removeClass('form-control').css('width', '100%'); */
}

/* Add a service worker for Progressive Web App purposes */
registerServiceWorker();
