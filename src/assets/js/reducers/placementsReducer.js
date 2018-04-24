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

const placementsReducer = (state = combinedState.placements, action) => {
	switch (action.type) {
		case types.GET_PLACEMENTS_SUCCESS:
			return action.placements;

		case types.GET_PLACEMENT_SUCCESS:
		case types.UPDATE_PLACEMENT_SUCCESS:
			return [
				...state.filter(placement => placement.id !== action.placement.id),
				Object.assign({}, action.placement),
			];

		case types.CREATE_PLACEMENT_SUCCESS:
			return [
				...state,
				Object.assign({}, action.placement),
			];

		case types.DELETE_PLACEMENT_SUCCESS:
			return [
				...state.filter(placement => placement.id !== action.placement.id),
			];

		default:
			return state;
	}
};

export default placementsReducer;
