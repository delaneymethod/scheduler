import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rotaTypeReducer = (state = combinedState.rotaType, action) => {
	switch (action.type) {
		case types.SWITCH_ROTA_TYPE:
			return action.rotaType;

		default:
			return state;
	}
};

export default rotaTypeReducer;
