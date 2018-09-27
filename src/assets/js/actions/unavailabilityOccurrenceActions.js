import * as api from '../api';
import * as types from './actionTypes';

export const getUnavailabilityOccurrencesSuccess = unavailabilityOccurrences => ({
	type: types.GET_UNAVAILABILITY_OCCURRENCES,
	unavailabilityOccurrences,
});

/* GET ALL UNAVAILABILITY OCCURRENCES */
export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getUnavailabilityOccurrences = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getUnavailabilityOccurrences(payload)
		.then((unavailabilityOccurrences) => {
			dispatch(ajaxLoading(false));

			dispatch(getUnavailabilityOccurrencesSuccess(unavailabilityOccurrences));

			return unavailabilityOccurrences;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
