import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const ajaxLoadingReducer = (state = combinedState.ajaxLoading, action) => {
	if (action.type === types.AJAX_LOADING) {
		return action.status;
	}

	return state;
};

export default ajaxLoadingReducer;
