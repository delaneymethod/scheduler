import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const unavailabilityOccurrencesReducer = (state = combinedState.unavailabilityOccurrences, action) => {
	switch (action.type) {
		case types.GET_UNAVAILABILITY_OCCURRENCES:
			return action.unavailabilityOccurrences;

		default:
			return state;
	}
};

export default unavailabilityOccurrencesReducer;
