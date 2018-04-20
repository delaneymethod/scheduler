/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from './actionTypes';
import schedulerApi from '../api/schedulerApi';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getUserTypesSuccess = userTypes => ({
	type: types.GET_USER_TYPES_SUCCESS,
	userTypes,
});

/* GET ALL USER TYPES */
export const getUserTypes = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.getUserTypes()
		.then((userTypes) => {
			dispatch(getUserTypesSuccess(userTypes));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const getUserTypeSuccess = userType => ({
	type: types.GET_USER_TYPE_SUCCESS,
	userType,
});

/* GET SPECIFIC USER TYPE */
export const getUserType = userType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.getUserType(userType)
		.then((data) => {
			dispatch(getUserTypeSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const createUserTypeSuccess = userType => ({
	type: types.CREATE_USER_TYPE_SUCCESS,
	userType,
});

/* CREATE NEW USER TYPE */
export const createUserType = userType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.createUserType(userType)
		.then((data) => {
			dispatch(createUserTypeSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updateUserTypeSuccess = userType => ({
	type: types.UPDATE_USER_TYPE_SUCCESS,
	userType,
});

/* UPDATE SPECIFIC USER TYPE */
export const updateUserType = userType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.updateUserType(userType)
		.then((data) => {
			dispatch(updateUserTypeSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const deleteUserTypeSuccess = userType => ({
	type: types.DELETE_USER_TYPE_SUCCESS,
	userType,
});

/* DELETE SPECIFIC USER TYPE */
export const deleteUserType = userType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.deleteUserType(userType)
		.then(() => {
			dispatch(deleteUserTypeSuccess(userType));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
