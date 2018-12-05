import thunk from 'redux-thunk';
/* import { logger } from 'redux-logger'; */
import { compose, createStore, applyMiddleware } from 'redux';

import reducers from '../reducers';

import config from '../helpers/config';

import initialState from './initialState';

import { getStates } from './persistedState';

const middlewares = [];

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

middlewares.push(thunk);

/*
if (process.env.NODE_ENV === 'development') {
	middlewares.push(reduxLogger);
}
*/

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable no-underscore-dangle */

const configureStore = () => createStore(reducers, combinedState, composeEnhancers(applyMiddleware(...middlewares)));

export default configureStore;
