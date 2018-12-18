import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const placementsReducer = (state = combinedState.placements, action) => {
	switch (action.type) {
		case types.GET_PLACEMENTS:
			return action.placements;

		case types.GET_PLACEMENT:
		case types.UPDATE_PLACEMENT:
			return [
				...state.filter(placement => placement.id !== action.placement.id),
				Object.assign({}, action.placement),
			];

		case types.CREATE_PLACEMENT:
			return [
				...state,
				Object.assign({}, action.placement),
			];

		case types.DELETE_PLACEMENT:
			return [
				...state.filter(placement => placement.id !== action.placement.id),
			];

		default:
			return state;
	}
};

export default placementsReducer;
