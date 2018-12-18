import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const routeReducer = (state = combinedState.route, action) => {
	switch (action.type) {
		case types.SWITCH_ROUTE:
			return action.route;

		default:
			return state;
	}
};

export default routeReducer;
