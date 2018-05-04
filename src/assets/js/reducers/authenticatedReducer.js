import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const authenticatedReducer = (state = combinedState.authenticated, action) => {
	if (action.type === types.AUTHENTICATED) {
		return action.status;
	}

	return state;
};

export default authenticatedReducer;
