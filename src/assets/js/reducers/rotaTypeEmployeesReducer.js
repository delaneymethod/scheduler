import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedSessionStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rotaTypeEmployeesReducer = (state = combinedState.rotaEmployees, action) => {
	switch (action.type) {
		case types.CREATE_ROTA_TYPE_EMPLOYEES:
			return [
				...state,
				Object.assign({}, action.rotaEmployees),
			];

		case types.DELETE_ROTA_TYPE_EMPLOYEE:
			return [
				...state.filter(rotaEmployee => rotaEmployee.id !== action.rotaEmployee.id),
			];

		default:
			return state;
	}
};

export default rotaTypeEmployeesReducer;
