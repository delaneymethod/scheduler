import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const unavailabilitiesReducer = (state = combinedState.unavailabilities, action) => {
	switch (action.type) {
		/*
        case types.GET_UNAVAILABILITY:
		case types.UPDATE_UNAVAILABILITY:
			return [
				...state.filter(unavailability => unavailability.id !== action.unavailability.id),
				Object.assign({}, action.unavailability),
			];

		case types.CREATE_UNAVAILABILITY:
			return [
				...state,
				Object.assign({}, action.unavailability),
			];

		case types.DELETE_UNAVAILABILITY:
			return [
				...state.filter(unavailability => unavailability.id !== action.unavailability.id),
			];
        */

		default:
			return state;
	}
};

export default unavailabilitiesReducer;
