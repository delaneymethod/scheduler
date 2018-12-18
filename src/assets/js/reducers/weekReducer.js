import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const weekReducer = (state = combinedState.week, action) => {
	switch (action.type) {
		case types.SWITCH_WEEK:
			return action.week;

		default:
			return state;
	}
};

export default weekReducer;
