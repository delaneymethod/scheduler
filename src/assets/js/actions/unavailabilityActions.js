import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET SPECIFIC UNAVAILABILITY */
export const getUnavailabilitySuccess = unavailability => ({
	type: types.GET_UNAVAILABILITY,
	unavailability,
});

export const getUnavailability = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUnavailability(payload)
		.then((unavailability) => {
			dispatch(ajaxLoading(false));

			dispatch(getUnavailabilitySuccess(unavailability));

			return unavailability;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* CREATE NEW UNAVAILABILITY */
export const createUnavailabilitySuccess = unavailability => ({
	type: types.CREATE_UNAVAILABILITY,
	unavailability,
});

export const createUnavailability = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createUnavailability(payload)
		.then((unavailability) => {
			dispatch(ajaxLoading(false));

			dispatch(createUnavailabilitySuccess(unavailability));

			return unavailability;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC UNAVAILABILITY */
export const updateUnavailabilitySuccess = unavailability => ({
	type: types.UPDATE_UNAVAILABILITY,
	unavailability,
});

export const updateUnavailability = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateUnavailability(payload)
		.then((unavailability) => {
			dispatch(ajaxLoading(false));

			dispatch(updateUnavailabilitySuccess(unavailability));

			return unavailability;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC UNAVAILABILITY */
export const deleteUnavailabilitySuccess = unavailability => ({
	type: types.DELETE_UNAVAILABILITY,
	unavailability,
});

export const deleteUnavailability = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteUnavailability(payload)
		.then((unavailability) => {
			dispatch(ajaxLoading(false));

			dispatch(deleteUnavailabilitySuccess(unavailability));

			return unavailability;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
