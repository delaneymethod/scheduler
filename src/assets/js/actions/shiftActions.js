import * as api from '../api';
import * as types from './actionTypes';

export const getRotaSuccess = rota => ({
	type: types.GET_ROTA,
	rota,
});

export const getShiftsSuccess = shifts => ({
	type: types.GET_SHIFTS,
	shifts,
});

/* GET ALL SHIFTS */
export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getShifts = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getShifts(payload)
		.then((shifts) => {
			dispatch(ajaxLoading(false));

			dispatch(getShiftsSuccess(shifts));

			return shifts;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const copyShifts = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.copyShifts(payload)
		.then((rota) => {
			dispatch(ajaxLoading(false));

			dispatch(getRotaSuccess(rota));

			/* The response is a rota object but we have already updated the store */
			return rota;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET SPECIFIC SHIFT */
export const getShiftSuccess = shift => ({
	type: types.GET_SHIFT,
	shift,
});

export const getShift = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getShift(payload)
		.then((shift) => {
			dispatch(ajaxLoading(false));

			dispatch(getShiftSuccess(shift));

			return shift;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* CREATE NEW SHIFT */
export const createShiftSuccess = shift => ({
	type: types.CREATE_SHIFT,
	shift,
});

export const createShift = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createShift(payload)
		.then((shift) => {
			dispatch(ajaxLoading(false));

			dispatch(createShiftSuccess(shift));

			return shift;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC SHIFT */
export const updateShiftSuccess = shift => ({
	type: types.UPDATE_SHIFT,
	shift,
});

export const updateShift = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateShift(payload)
		.then((shift) => {
			dispatch(ajaxLoading(false));

			dispatch(updateShiftSuccess(shift));

			return shift;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC SHIFT */
export const deleteShiftSuccess = shift => ({
	type: types.DELETE_SHIFT,
	shift,
});

export const deleteShift = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteShift(payload)
		.then((shift) => {
			dispatch(ajaxLoading(false));

			dispatch(deleteShiftSuccess(shift));

			return shift;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
