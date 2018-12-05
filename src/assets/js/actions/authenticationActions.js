import * as api from '../api';

import * as types from './actionTypes';

import { saveState } from '../store/persistedState';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const authenticated = status => ({
	type: types.AUTHENTICATED,
	status,
});

export const getApplicationUserRolesSuccess = applicationUserRoles => ({
	type: types.GET_APPLICATION_USER_ROLES,
	applicationUserRoles,
});

export const getUnavailabilityTypesSuccess = unavailabilityTypes => ({
	type: types.GET_UNAVAILABILITY_TYPES,
	unavailabilityTypes,
});

export const getRotaEmployeesSuccess = rotaEmployees => ({
	type: types.GET_ROTA_EMPLOYEES,
	rotaEmployees,
});

export const getEmployeesSuccess = employees => ({
	type: types.GET_EMPLOYEES,
	employees,
});

export const updateUserSuccess = user => ({
	type: types.UPDATE_USER,
	user,
});

export const switchRouteSuccess = route => ({
	type: types.SWITCH_ROUTE,
	route,
});

export const switchWeekSuccess = week => ({
	type: types.SWITCH_WEEK,
	week,
});

export const switchRotaSuccess = rota => ({
	type: types.SWITCH_ROTA,
	rota,
});

export const getRotasSuccess = rotas => ({
	type: types.GET_ROTAS,
	rotas,
});

export const getShiftsSuccess = shifts => ({
	type: types.GET_SHIFTS,
	shifts,
});

export const getRotaTypesSuccess = rotaTypes => ({
	type: types.GET_ROTA_TYPES,
	rotaTypes,
});

export const switchRotaTypeSuccess = rotaType => ({
	type: types.SWITCH_ROTA_TYPE,
	rotaType,
});

export const getPlacementsSuccess = placements => ({
	type: types.GET_PLACEMENTS,
	placements,
});

export const login = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.login(payload)
		.then((user) => {
			dispatch(updateUserSuccess(user));

			dispatch(ajaxLoading(false));

			dispatch(authenticated(true));

			return user;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			dispatch(authenticated(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const logout = () => (dispatch) => {
	dispatch(getRotasSuccess([]));

	dispatch(getShiftsSuccess([]));

	dispatch(authenticated(false));

	dispatch(updateUserSuccess({}));

	dispatch(switchRouteSuccess(''));

	dispatch(switchWeekSuccess({}));

	dispatch(switchRotaSuccess({}));

	dispatch(getEmployeesSuccess([]));

	dispatch(getRotaTypesSuccess([]));

	dispatch(getPlacementsSuccess([]));

	saveState('employees:ordered', []);

	dispatch(switchRotaTypeSuccess({}));

	dispatch(getRotaEmployeesSuccess([]));

	dispatch(getUnavailabilityTypesSuccess([]));

	dispatch(getApplicationUserRolesSuccess([]));

	return Promise.resolve(true);
};

export const register = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.register(payload)
		.then(() => dispatch(ajaxLoading(false)))
		.catch((error) => {
			dispatch(ajaxLoading(false));

			dispatch(authenticated(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const userSignUp = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.userSignUp(payload)
		.then(() => dispatch(ajaxLoading(false)))
		.catch((error) => {
			dispatch(ajaxLoading(false));

			dispatch(authenticated(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const forgottenYourPassword = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.forgottenYourPassword(payload)
		.then(() => dispatch(ajaxLoading(false)))
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const resetYourPassword = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.resetYourPassword(payload)
		.then(() => dispatch(ajaxLoading(false)))
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updateYourPassword = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateYourPassword(payload)
		.then(() => dispatch(ajaxLoading(false)))
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
