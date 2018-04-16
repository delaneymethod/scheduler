/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from './actionTypes';
import schedulerApi from '../api/schedulerApi';

export const formStatus = status => ({
	type: types.FORM_STATUS,
	status,
});

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getRotaTypesSuccess = rotaTypes => ({
	type: types.GET_ROTA_TYPES_SUCCESS,
	rotaTypes,
});

/* GET ALL ROTA TYPES */
export const getRotaTypes = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.getRotaTypes()
		.then((rotaTypes) => {
			dispatch(getRotaTypesSuccess(rotaTypes));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const getRotaTypeSuccess = rotaType => ({
	type: types.GET_ROTA_TYPE_SUCCESS,
	rotaType,
});

/* GET SPECIFIC ROTA TYPE */
export const getRotaType = rotaType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.getRotaType(rotaType)
		.then((data) => {
			dispatch(getRotaTypeSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const createRotaTypeSuccess = rotaType => ({
	type: types.CREATE_ROTA_TYPE_SUCCESS,
	rotaType,
});

/* CREATE NEW ROTA TYPE */
export const createRotaType = rotaType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.createRotaType(rotaType)
		.then((data) => {
			dispatch(createRotaTypeSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updateRotaTypeSuccess = rotaType => ({
	type: types.UPDATE_ROTA_TYPE_SUCCESS,
	rotaType,
});

/* UPDATE SPECIFIC ROTA TYPE */
export const updateRotaType = rotaType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.updateRotaType(rotaType)
		.then((data) => {
			dispatch(updateRotaTypeSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const deleteRotaTypeSuccess = rotaType => ({
	type: types.DELETE_ROTA_TYPE_SUCCESS,
	rotaType,
});

/* DELETE SPECIFIC ROTA TYPE */
export const deleteRotaType = rotaType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.deleteRotaType(rotaType)
		.then(() => {
			dispatch(deleteRotaTypeSuccess(rotaType));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
