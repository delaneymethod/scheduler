/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import reducers from '../reducers';
import initialState from './initialState';
import { loadState } from './persistedState';

const persistedState = loadState();

const combinedState = Object.assign(initialState, persistedState);

const configureStore = () => createStore(reducers, combinedState, applyMiddleware(thunk));

export default configureStore;