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

export const getRotasSuccess = rotas => ({
	type: types.GET_ROTAS_SUCCESS,
	rotas,
});

/* GET ALL ROTAS */
export const getRotas = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotas()
		.then((rotas) => {
			dispatch(getRotasSuccess(rotas));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET ROTAS BY TYPE */
export const getRotaByType = rotaType => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotasByType(rotaType)
		.then((data) => {
			dispatch(getRotasSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const getRotaSuccess = rota => ({
	type: types.GET_ROTA_SUCCESS,
	rota,
});

/* GET SPECIFIC ROTA */
export const getRota = rota => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRota(rota)
		.then((data) => {
			dispatch(getRotaSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const createRotaSuccess = rota => ({
	type: types.CREATE_ROTA_SUCCESS,
	rota,
});

/* CREATE NEW ROTA */
export const createRota = rota => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createRota(rota)
		.then((data) => {
			dispatch(createRotaSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updateRotaSuccess = rota => ({
	type: types.UPDATE_ROTA_SUCCESS,
	rota,
});

/* UPDATE SPECIFIC ROTA */
export const updateRota = rota => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateRota(rota)
		.then((data) => {
			dispatch(updateRotaSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const deleteRotaSuccess = rota => ({
	type: types.DELETE_ROTA_SUCCESS,
	rota,
});

/* DELETE SPECIFIC ROTA */
export const deleteRota = rota => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteRota(rota)
		.then(() => {
			dispatch(deleteRotaSuccess(rota));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
