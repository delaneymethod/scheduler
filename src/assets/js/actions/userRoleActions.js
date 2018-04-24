/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getUserRolesSuccess = userRoles => ({
	type: types.GET_USER_ROLES_SUCCESS,
	userRoles,
});

/* GET ALL USER ROLES */
export const getUserRoles = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUserRoles()
		.then((userRoles) => {
			dispatch(getUserRolesSuccess(userRoles));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const getUserRoleSuccess = userRole => ({
	type: types.GET_USER_ROLE_SUCCESS,
	userRole,
});

/* GET SPECIFIC USER ROLE */
export const getUserRole = userRole => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUserRole(userRole)
		.then((data) => {
			dispatch(getUserRoleSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const createUserRoleSuccess = userRole => ({
	type: types.CREATE_USER_ROLE_SUCCESS,
	userRole,
});

/* CREATE NEW USER ROLE */
export const createUserRole = userRole => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createUserRole(userRole)
		.then((data) => {
			dispatch(createUserRoleSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updateUserRoleSuccess = userRole => ({
	type: types.UPDATE_USER_ROLE_SUCCESS,
	userRole,
});

/* UPDATE SPECIFIC USER ROLE */
export const updateUserRole = userRole => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateUserRole(userRole)
		.then((data) => {
			dispatch(updateUserRoleSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const deleteUserRoleSuccess = userRole => ({
	type: types.DELETE_USER_ROLE_SUCCESS,
	userRole,
});

/* DELETE SPECIFIC USER ROLE */
export const deleteUserRole = userRole => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteUserRole(userRole)
		.then(() => {
			dispatch(deleteUserRoleSuccess(userRole));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
