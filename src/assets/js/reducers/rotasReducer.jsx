/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { loadState } from '../store/persistedState';

const persistedState = loadState();

const combinedState = Object.assign(initialState, persistedState);

const rotasReducer = (state = combinedState.rotas, action) => {
	switch (action.type) {
		case types.GET_ROTAS_SUCCESS:
			return action.rotas;

		case types.GET_ROTA_SUCCESS:
		case types.UPDATE_ROTA_SUCCESS:
			return [
				...state.filter(rota => rota.id !== action.rota.id),
				Object.assign({}, action.rota),
			];

		case types.CREATE_ROTA_SUCCESS:
			return [
				...state,
				Object.assign({}, action.rota),
			];

		case types.DELETE_ROTA_SUCCESS:
			return [
				...state.filter(rota => rota.id !== action.rota.id),
			];

		default:
			return state;
	}
};

export default rotasReducer;
