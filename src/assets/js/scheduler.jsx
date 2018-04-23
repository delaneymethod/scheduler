/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import fastclick from 'fastclick';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import { BrowserRouter } from 'react-router-dom';

/* Included here to reduce the number of requests */
import '../scss/scheduler';

import App from './components/App';
import { saveState } from './store/persistedState';
import { getShifts } from './actions/shiftActions';
import configureStore from './store/configureStore';
import registerServiceWorker from './helpers/registerServiceWorker';

const store = configureStore();

/* Listen for state changes, saving a maximum once per second. We only want to persist the authenticated state for now. */
store.subscribe(throttle(() => {
	saveState({
		authenticated: store.getState().authenticated,
	});
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

/* Add a service worker for Progressive Web App purposes */
registerServiceWorker();
