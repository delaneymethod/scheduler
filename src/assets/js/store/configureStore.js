import thunk from 'redux-thunk';
/* import { logger } from 'redux-logger'; */
import { compose, createStore, applyMiddleware } from 'redux';

import reducers from '../reducers';

import initialState from './initialState';

import { getStates as getLocalStorageStates } from './persistedLocalStorageState';

import { getStates as getSessionStorageStates } from './persistedSessionStorageState';

const middlewares = [];

const combinedStates = Object.assign(initialState, getLocalStorageStates(), getSessionStorageStates());

middlewares.push(thunk);

/*
if (process.env.NODE_ENV === 'development') {
	middlewares.push(reduxLogger);
}
*/

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable no-underscore-dangle */

const configureStore = () => createStore(reducers, combinedStates, composeEnhancers(applyMiddleware(...middlewares)));

export default configureStore;
