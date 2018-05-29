import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const subscriptionLevelsReducer = (state = combinedState.subscriptionLevels, action) => {
	switch (action.type) {
		case types.GET_SUBSCRIPTION_LEVELS:
			return action.subscriptionLevels;

		default:
			return state;
	}
};

export default subscriptionLevelsReducer;
