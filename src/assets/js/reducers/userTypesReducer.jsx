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

const userTypesReducer = (state = combinedState.userTypes, action) => {
	switch (action.type) {
		case types.GET_USER_TYPES_SUCCESS:
			return action.userTypes;

		case types.GET_USER_TYPE_SUCCESS:
		case types.UPDATE_USER_TYPE_SUCCESS:
			return [
				...state.filter(userType => userType.id !== action.userType.id),
				Object.assign({}, action.userType),
			];

		case types.CREATE_USER_TYPE_SUCCESS:
			return [
				...state,
				Object.assign({}, action.userType),
			];

		case types.DELETE_USER_TYPE_SUCCESS:
			return [
				...state.filter(userType => userType.id !== action.userType.id),
			];

		default:
			return state;
	}
};

export default userTypesReducer;
