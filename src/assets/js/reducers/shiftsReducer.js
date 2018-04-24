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

const shiftsReducer = (state = combinedState.shifts, action) => {
	switch (action.type) {
		case types.GET_SHIFTS_SUCCESS:
			return action.shifts;

		case types.GET_SHIFT_SUCCESS:
		case types.UPDATE_SHIFT_SUCCESS:
			return [
				...state.filter(shift => shift.id !== action.shift.id),
				Object.assign({}, action.shift),
			];

		case types.CREATE_SHIFT_SUCCESS:
			return [
				...state,
				Object.assign({}, action.shift),
			];

		case types.DELETE_SHIFT_SUCCESS:
			return [
				...state.filter(shift => shift.id !== action.shift.id),
			];

		default:
			return state;
	}
};

export default shiftsReducer;
