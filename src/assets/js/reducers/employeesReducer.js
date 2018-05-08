import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const employeesReducer = (state = combinedState.employees, action) => {
	switch (action.type) {
		case types.GET_EMPLOYEES:
			return action.employees;

		case types.GET_EMPLOYEE:
		case types.UPDATE_EMPLOYEE:
			return [
				...state.filter(employee => employee.id !== action.employee.id),
				Object.assign({}, action.employee),
			];

		case types.CREATE_EMPLOYEE:
			return [
				...state,
				Object.assign({}, action.employee),
			];

		case types.DELETE_EMPLOYEE:
			return [
				...state.filter(employee => employee.id !== action.employee.id),
			];

		default:
			return state;
	}
};

export default employeesReducer;
