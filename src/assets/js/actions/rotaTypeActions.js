import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET ALL ROTA TYPES */
export const getRotaTypesSuccess = rotaTypes => ({
	type: types.GET_ROTA_TYPES,
	rotaTypes,
});

export const getRotaTypes = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotaTypes()
		.then((rotaTypes) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotaTypesSuccess(rotaTypes));

			return rotaTypes;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET SPECIFIC ROTA TYPE */
export const getRotaTypeSuccess = rotaType => ({
	type: types.GET_ROTA_TYPE,
	rotaType,
});

export const getRotaType = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getRotaType(payload)
		.then((rotaType) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotaTypeSuccess(rotaType));

			return rotaType;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* CREATE NEW ROTA TYPE */
export const createRotaTypeSuccess = rotaType => ({
	type: types.CREATE_ROTA_TYPE,
	rotaType,
});

export const createRotaType = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createRotaType(payload)
		.then((rotaType) => {
			dispatch(ajaxLoading(false));

			dispatch(createRotaTypeSuccess(rotaType));

			return rotaType;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC ROTA TYPE */
export const updateRotaTypeSuccess = rotaType => ({
	type: types.UPDATE_ROTA_TYPE,
	rotaType,
});

export const updateRotaType = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateRotaType(payload)
		.then((rotaType) => {
			dispatch(ajaxLoading(false));

			dispatch(updateRotaTypeSuccess(rotaType));

			return rotaType;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC ROTA TYPE */
export const deleteRotaTypeSuccess = rotaType => ({
	type: types.DELETE_ROTA_TYPE,
	rotaType,
});

export const deleteRotaType = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteRotaType(payload)
		.then((rotaType) => {
			dispatch(ajaxLoading(false));

			dispatch(deleteRotaTypeSuccess(rotaType));

			return rotaType;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* SWITCH BETWEEN ROTA TYPES */
export const switchRotaTypeSuccess = rotaType => ({
	type: types.SWITCH_ROTA_TYPE,
	rotaType,
});

export const switchRotaType = payload => dispatch => Promise.resolve(dispatch(switchRotaTypeSuccess(payload)));
