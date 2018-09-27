import * as api from '../api';
import * as types from './actionTypes';

export const getUnavailabilityTypesSuccess = unavailabilityTypes => ({
	type: types.GET_UNAVAILABILITY_TYPES,
	unavailabilityTypes,
});

/* GET ALL UNAVAILABILITY TYPES */
export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getUnavailabilityTypes = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUnavailabilityTypes()
		.then((unavailabilityTypes) => {
			dispatch(ajaxLoading(false));

			dispatch(getUnavailabilityTypesSuccess(unavailabilityTypes));

			return unavailabilityTypes;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
