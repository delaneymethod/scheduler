import api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getUsersSuccess = users => ({
	type: types.GET_USERS_SUCCESS,
	users,
});

/* GET ALL USERS */
export const getUsers = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUsers()
		.then((users) => {
			dispatch(getUsersSuccess(users));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET USERS BY TYPE */
export const getUsersByType = userType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUsersByType(userType)
		.then((data) => {
			dispatch(getUsersSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET USERS BY ROLE */
export const getUsersByRole = userRole => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUsersByRole(userRole)
		.then((data) => {
			dispatch(getUsersSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const getUserSuccess = user => ({
	type: types.GET_USER_SUCCESS,
	user,
});

/* GET SPECIFIC USER */
export const getUser = user => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUser(user)
		.then((data) => {
			dispatch(getUserSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const createUserSuccess = user => ({
	type: types.CREATE_USER_SUCCESS,
	user,
});

/* CREATE NEW USER */
export const createUser = user => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createUser(user)
		.then((data) => {
			dispatch(createUserSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updateUserSuccess = user => ({
	type: types.UPDATE_USER_SUCCESS,
	user,
});

/* UPDATE SPECIFIC USER */
export const updateUser = user => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateUser(user)
		.then((data) => {
			dispatch(updateUserSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const deleteUserSuccess = user => ({
	type: types.DELETE_USER_SUCCESS,
	user,
});

/* DELETE SPECIFIC USER */
export const deleteUser = user => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteUser(user)
		.then(() => {
			dispatch(deleteUserSuccess(user));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
