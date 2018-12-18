import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const unavailabilityTypesReducer = (state = combinedState.unavailabilityTypes, action) => {
	switch (action.type) {
		case types.GET_UNAVAILABILITY_TYPES:
			return action.unavailabilityTypes;

		default:
			return state;
	}
};

export default unavailabilityTypesReducer;
