import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rotaTypeEmployeesReducer = (state = combinedState.employees, action) => {
	switch (action.type) {
		case types.CREATE_ROTA_TYPE_EMPLOYEES:
			return [
				...state,
				Object.assign({}, action.employees),
			];

		case types.DELETE_ROTA_TYPE_EMPLOYEE:
			return [
				...state.filter(employee => employee.id !== action.employee.id),
			];

		default:
			return state;
	}
};

export default rotaTypeEmployeesReducer;
