import thunk from 'redux-thunk';
// import { logger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

import reducers from '../reducers';

import config from '../helpers/config';

import initialState from './initialState';

import { getStates } from './persistedState';

const middlewares = [];

middlewares.push(thunk);

/*
if (process.env.NODE_ENV === 'development') {
	middlewares.push(reduxLogger);
}
*/

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const configureStore = () => createStore(reducers, combinedState, applyMiddleware(...middlewares));

export default configureStore;
