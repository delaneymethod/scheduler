import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rotaEmployeesReducer = (state = combinedState.employees, action) => {
	switch (action.type) {
		case types.GET_ROTA_EMPLOYEES:
			return action.employees;

		case types.UPDATE_ROTA_EMPLOYEES_ORDER:
			return state;

		default:
			return state;
	}
};

export default rotaEmployeesReducer;
