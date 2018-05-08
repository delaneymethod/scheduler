import api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET ALL ROTAS */
export const getRotasSuccess = rotas => ({
	type: types.GET_ROTAS,
	rotas,
});

export const getRotas = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotas()
		.then((rotas) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotasSuccess(rotas));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET ROTAS BY TYPE */
export const getRotaByType = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotasByType(payload)
		.then((rotaType) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotasSuccess(rotaType));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET SPECIFIC ROTA */
export const getRotaSuccess = rota => ({
	type: types.GET_ROTA,
	rota,
});

export const getRota = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRota(payload)
		.then((rota) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotaSuccess(rota));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* CREATE NEW ROTA */
export const createRotaSuccess = rota => ({
	type: types.CREATE_ROTA,
	rota,
});

export const createRota = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createRota(payload)
		.then((rota) => {
			dispatch(ajaxLoading(false));

			dispatch(createRotaSuccess(rota));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC ROTA */
export const updateRotaSuccess = rota => ({
	type: types.UPDATE_ROTA,
	rota,
});

export const updateRota = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateRota(payload)
		.then((rota) => {
			dispatch(ajaxLoading(false));

			dispatch(updateRotaSuccess(rota));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC ROTA */
export const deleteRotaSuccess = rota => ({
	type: types.DELETE_ROTA,
	rota,
});

export const deleteRota = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteRota(payload)
		.then(() => {
			dispatch(ajaxLoading(false));

			dispatch(deleteRotaSuccess(payload));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
