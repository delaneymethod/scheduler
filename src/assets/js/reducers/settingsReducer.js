import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const settingsReducer = (state = combinedState.settings, action) => {
	if (action.type === types.UPDATE_SETTINGS) {
		return action.settings;
	}

	return state;
};

export default settingsReducer;
