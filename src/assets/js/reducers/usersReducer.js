/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const usersReducer = (state = combinedState.users, action) => {
	switch (action.type) {
		case types.GET_USERS_SUCCESS:
			return action.users;

		case types.GET_USER_SUCCESS:
		case types.UPDATE_USER_SUCCESS:
			return [
				...state.filter(user => user.id !== action.user.id),
				Object.assign({}, action.user),
			];

		case types.CREATE_USER_SUCCESS:
			return [
				...state,
				Object.assign({}, action.user),
			];

		case types.DELETE_USER_SUCCESS:
			return [
				...state.filter(user => user.id !== action.user.id),
			];

		default:
			return state;
	}
};

export default usersReducer;
