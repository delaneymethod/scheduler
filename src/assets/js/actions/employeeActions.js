import * as api from '../api';
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

			return employees;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* ORDER EMPLOYEES */
export const orderEmployeesSuccess = employees => ({
	type: types.ORDER_EMPLOYEES,
	employees,
});

export const orderEmployees = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.orderEmployees(payload)
		.then((employees) => {
			dispatch(ajaxLoading(false));

			dispatch(orderEmployeesSuccess(employees));

			return employees;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPLOAD EMPLOYEES */
export const uploadEmployeesSuccess = employees => ({
	type: types.UPLOAD_EMPLOYEES,
	employees,
});

export const uploadEmployees = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.uploadEmployees(payload)
		.then((employees) => {
			dispatch(ajaxLoading(false));

			dispatch(uploadEmployeesSuccess(employees));

			return employees;
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

			return employee;
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

			return employee;
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

			return employee;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC EMPLOYEE */
export const deleteEmployeeSuccess = employee => ({
	type: types.DELETE_EMPLOYEE,
	employee,
});

export const deleteEmployee = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteEmployee(payload)
		.then((employee) => {
			dispatch(ajaxLoading(false));

			dispatch(deleteEmployeeSuccess(employee));

			return employee;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
