import * as api from '../api';
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

export const getRotas = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotas(payload)
		.then((rotas) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotasSuccess(rotas));

			return rotas;
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

			return rota;
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

			return rota;
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

			return rota;
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
		.then((rota) => {
			dispatch(ajaxLoading(false));

			dispatch(deleteRotaSuccess(rota));

			return rota;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* SWITCH BETWEEN ROTAS */
export const switchRotaSuccess = rota => ({
	type: types.SWITCH_ROTA,
	rota,
});

export const switchRota = payload => (dispatch) => {
	dispatch(switchRotaSuccess(payload));

	return Promise.resolve(true);
};
