import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rotasReducer = (state = combinedState.rotas, action) => {
	switch (action.type) {
		case types.GET_ROTAS:
			return action.rotas;

		case types.GET_ROTA:
		case types.UPDATE_ROTA:
			return [
				...state.filter(rota => rota.id !== action.rota.id),
				Object.assign({}, action.rota),
			];

		case types.CREATE_ROTA:
			return [
				...state,
				Object.assign({}, action.rota),
			];

		case types.DELETE_ROTA:
			return [
				...state.filter(rota => rota.id !== action.rota.id),
			];

		default:
			return state;
	}
};

export default rotasReducer;
