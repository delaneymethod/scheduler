import api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getShiftsSuccess = shifts => ({
	type: types.GET_SHIFTS_SUCCESS,
	shifts,
});

/* GET ALL SHIFTS */
export const getShifts = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getShifts()
		.then((shifts) => {
			dispatch(getShiftsSuccess(shifts));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const getShiftSuccess = shift => ({
	type: types.GET_SHIFT_SUCCESS,
	shift,
});

/* GET SPECIFIC SHIFT */
export const getShift = shift => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getShift(shift)
		.then((data) => {
			dispatch(getShiftSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const createShiftSuccess = shift => ({
	type: types.CREATE_SHIFT_SUCCESS,
	shift,
});

/* CREATE NEW SHIFT */
export const createShift = shift => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createShift(shift)
		.then((data) => {
			dispatch(createShiftSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updateShiftSuccess = shift => ({
	type: types.UPDATE_SHIFT_SUCCESS,
	shift,
});

/* UPDATE SPECIFIC SHIFT */
export const updateShift = shift => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateShift(shift)
		.then((data) => {
			dispatch(updateShiftSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const deleteShiftSuccess = shift => ({
	type: types.DELETE_SHIFT_SUCCESS,
	shift,
});

/* DELETE SPECIFIC SHIFT */
export const deleteShift = shift => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteShift(shift)
		.then(() => {
			dispatch(deleteShiftSuccess(shift));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
