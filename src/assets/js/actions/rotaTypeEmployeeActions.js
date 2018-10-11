import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* CREATE ROTA TYPE EMPLOYEES */
export const createRotaTypeEmployeesSuccess = employees => ({
	type: types.CREATE_ROTA_TYPE_EMPLOYEES,
	employees,
});

export const createRotaTypeEmployees = (rotaType, employeeIds) => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createRotaTypeEmployees(rotaType, employeeIds)
		.then((employees) => {
			dispatch(ajaxLoading(false));

			dispatch(createRotaTypeEmployeesSuccess(employees));

			return employees;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC ROTA TYPE EMPLOYEE */
export const deleteRotaTypeEmployeeSuccess = employee => ({
	type: types.DELETE_ROTA_TYPE_EMPLOYEE,
	employee,
});

export const deleteRotaTypeEmployee = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteRotaTypeEmployee(payload)
		.then((employee) => {
			dispatch(ajaxLoading(false));

			dispatch(deleteRotaTypeEmployeeSuccess(employee));

			return employee;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
