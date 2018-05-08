import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import reducers from '../reducers';

import initialState from './initialState';

import { getStates } from './persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const configureStore = () => createStore(reducers, combinedState, applyMiddleware(thunk));

export default configureStore;
