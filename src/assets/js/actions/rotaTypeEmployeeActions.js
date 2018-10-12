import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* CREATE ROTA TYPE EMPLOYEES */
export const createRotaTypeEmployeesSuccess = rotaEmployees => ({
	type: types.CREATE_ROTA_TYPE_EMPLOYEES,
	rotaEmployees,
});

export const createRotaTypeEmployees = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createRotaTypeEmployees(payload)
		.then((rotaEmployees) => {
			dispatch(ajaxLoading(false));

			dispatch(createRotaTypeEmployeesSuccess(rotaEmployees));

			return rotaEmployees;
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
