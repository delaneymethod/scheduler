import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rotaReducer = (state = combinedState.rota, action) => {
	switch (action.type) {
		case types.SWITCH_ROTA:
			return action.rota;

		default:
			return state;
	}
};

export default rotaReducer;
