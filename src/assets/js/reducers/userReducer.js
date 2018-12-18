import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const userReducer = (state = combinedState.user, action) => {
	if (action.type === types.UPDATE_USER) {
		return action.user;
	}

	return state;
};

export default userReducer;
