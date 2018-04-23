/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { loadState } from '../store/persistedState';

const persistedState = loadState();

const combinedState = Object.assign(initialState, persistedState);

const authenticatedReducer = (state = combinedState.authenticated, action) => {
	if (action.type === types.AUTHENTICATED) {
		return action.status;
	}

	return state;
};

export default authenticatedReducer;
