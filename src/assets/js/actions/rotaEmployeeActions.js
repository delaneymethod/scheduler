import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET SPECIFIC ROTA EMPLOYEES */
export const getRotaEmployeesSuccess = rotaEmployees => ({
	type: types.GET_ROTA_EMPLOYEES,
	rotaEmployees,
});

export const getRotaEmployees = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotaEmployees(payload)
		.then((rotaEmployees) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotaEmployeesSuccess(rotaEmployees));

			return rotaEmployees;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC ROTA EMPLOYEES ORDER */
export const updateRotaEmployeesOrderSuccess = rotaEmployees => ({
	type: types.UPDATE_ROTA_EMPLOYEES_ORDER,
	rotaEmployees,
});

export const updateRotaEmployeesOrder = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateRotaEmployeesOrder(payload)
		.then((rotaEmployees) => {
			dispatch(ajaxLoading(false));

			dispatch(updateRotaEmployeesOrderSuccess(rotaEmployees));

			return rotaEmployees;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
