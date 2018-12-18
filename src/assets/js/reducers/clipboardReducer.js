import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const clipboardReducer = (state = combinedState.clipboard, action) => {
	switch (action.type) {
		case types.COPY_SHIFT_TO_CLIPBOARD:
			return {
				...state,
				copiedShift: action.shift,
			};

		default:
			return state;
	}
};

export default clipboardReducer;
