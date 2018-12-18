import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rotaTypesReducer = (state = combinedState.rotaTypes, action) => {
	switch (action.type) {
		case types.GET_ROTA_TYPES:
			return action.rotaTypes;

		case types.GET_ROTA_TYPE:
		case types.UPDATE_ROTA_TYPE:
			return [
				...state.filter(rotaType => rotaType.id !== action.rotaType.id),
				Object.assign({}, action.rotaType),
			];

		case types.CREATE_ROTA_TYPE:
			return [
				...state,
				Object.assign({}, action.rotaType),
			];

		case types.DELETE_ROTA_TYPE:
			return [
				...state.filter(rotaType => rotaType.id !== action.rotaType.id),
			];

		default:
			return state;
	}
};

export default rotaTypesReducer;
