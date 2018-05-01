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

const userRolesReducer = (state = combinedState.userRoles, action) => {
	switch (action.type) {
		case types.GET_USER_ROLES_SUCCESS:
			return action.userRoles;

		case types.GET_USER_ROLE_SUCCESS:
		case types.UPDATE_USER_ROLE_SUCCESS:
			return [
				...state.filter(userRole => userRole.id !== action.userRole.id),
				Object.assign({}, action.userRole),
			];

		case types.CREATE_USER_ROLE_SUCCESS:
			return [
				...state,
				Object.assign({}, action.userRole),
			];

		case types.DELETE_USER_ROLE_SUCCESS:
			return [
				...state.filter(userRole => userRole.id !== action.userRole.id),
			];

		default:
			return state;
	}
};

export default userRolesReducer;
