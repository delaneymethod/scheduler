import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET SPECIFIC ROTA EMPLOYEES */
export const getRotaEmployeesSuccess = employees => ({
	type: types.GET_ROTA_EMPLOYEES,
	employees,
});

export const getRotaEmployees = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotaEmployees(payload)
		.then((employees) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotaEmployeesSuccess(employees));

			return employees;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC ROTA EMPLOYEES ORDER */
export const updateRotaEmployeesOrderSuccess = employees => ({
	type: types.UPDATE_ROTA_EMPLOYEES_ORDER,
	employees,
});

export const updateRotaEmployeesOrder = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateRotaEmployeesOrder(payload)
		.then((employees) => {
			dispatch(ajaxLoading(false));

			dispatch(updateRotaEmployeesOrderSuccess(employees));

			return employees;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
