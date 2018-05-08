import api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET ALL EMPLOYEES */
export const getEmployeesSuccess = employees => ({
	type: types.GET_EMPLOYEES,
	employees,
});

export const getEmployees = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getEmployees()
		.then((employees) => {
			dispatch(ajaxLoading(false));

			dispatch(getEmployeesSuccess(employees));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET SPECIFIC EMPLOYEE */
export const getEmployeeSuccess = employee => ({
	type: types.GET_EMPLOYEE,
	employee,
});

export const getEmployee = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getEmployee(payload)
		.then((employee) => {
			dispatch(ajaxLoading(false));

			dispatch(getEmployeeSuccess(employee));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* CREATE NEW EMPLOYEE */
export const createEmployeeSuccess = employee => ({
	type: types.CREATE_EMPLOYEE,
	employee,
});

export const createEmployee = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createEmployee(payload)
		.then((employee) => {
			dispatch(ajaxLoading(false));

			dispatch(createEmployeeSuccess(employee));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC EMPLOYEE */
export const updateEmployeeSuccess = employee => ({
	type: types.UPDATE_EMPLOYEE,
	employee,
});

export const updateEmployee = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateEmployee(payload)
		.then((employee) => {
			dispatch(ajaxLoading(false));

			dispatch(updateEmployeeSuccess(employee));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC EMPLOYEE */
export const deleteEmployee = employee => ({
	type: types.DELETE_EMPLOYEE,
	employee,
});

export const deleteEmployeeSuccess = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteEmployee(payload)
		.then(() => {
			dispatch(ajaxLoading(false));

			dispatch(deleteEmployeeSuccess(payload));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
