/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import reducers from '../reducers';
import initialState from './initialState';

const configureStore = () => createStore(reducers, initialState, applyMiddleware(thunk));

export default configureStore;
