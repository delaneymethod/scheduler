import * as api from '../api';

import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET APPLICATION USER ROLES */
export const getApplicationUserRolesSuccess = applicationUserRoles => ({
	type: types.GET_APPLICATION_USER_ROLES,
	applicationUserRoles,
});

export const getApplicationUserRoles = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getApplicationUserRoles()
		.then((applicationUserRoles) => {
			dispatch(ajaxLoading(false));

			dispatch(getApplicationUserRolesSuccess(applicationUserRoles));

			return applicationUserRoles;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
