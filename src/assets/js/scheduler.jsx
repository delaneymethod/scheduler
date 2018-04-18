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
import { BrowserRouter } from 'react-router-dom';

/* Included here to reduce the number of requests */
import '../scss/scheduler';

import App from './components/App';
import { getShifts } from './actions/shiftActions';
import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

/* Loads the shifts list from the API */
/**
 * FIXME - Comment back in once the API is available
 *
 * store.dispatch(getShifts());
 */

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
