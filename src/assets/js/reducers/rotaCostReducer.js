import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rotaCostReducer = (state = combinedState.rotaCost, action) => {
	switch (action.type) {
		case types.SWITCH_ROTA_COST:
			return action.rotaCost;

		default:
			return state;
	}
};

export default rotaCostReducer;
