import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET ALL ROLES */
export const getRolesSuccess = roles => ({
	type: types.GET_ROLES,
	roles,
});

export const getRoles = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRoles()
		.then((roles) => {
			dispatch(ajaxLoading(false));

			dispatch(getRolesSuccess(roles));

			return roles;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET SPECIFIC ROLE */
export const getRoleSuccess = role => ({
	type: types.GET_ROLE,
	role,
});

export const getRole = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRole(payload)
		.then((role) => {
			dispatch(ajaxLoading(false));

			dispatch(getRoleSuccess(role));

			return role;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* CREATE NEW ROLE */
export const createRoleSuccess = role => ({
	type: types.CREATE_ROLE,
	role,
});

export const createRole = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createRole(payload)
		.then((role) => {
			dispatch(ajaxLoading(false));

			dispatch(createRoleSuccess(role));

			return role;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC ROLE */
export const updateRoleSuccess = role => ({
	type: types.UPDATE_ROLE,
	role,
});

export const updateRole = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateRole(payload)
		.then((role) => {
			dispatch(ajaxLoading(false));

			dispatch(updateRoleSuccess(role));

			return role;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC ROLE */
export const deleteRoleSuccess = role => ({
	type: types.DELETE_ROLE,
	role,
});

export const deleteRole = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteRole(payload)
		.then((role) => {
			dispatch(ajaxLoading(false));

			dispatch(deleteRoleSuccess(role));

			return role;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
