import * as api from '../api';

import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const updateUserSuccess = user => ({
	type: types.UPDATE_USER,
	user,
});

export const updateUser = payload => (dispatch) => {
	dispatch(updateUserSuccess(payload));

	return Promise.resolve(true);
};

export const serviceUpdates = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.serviceUpdates(payload)
		.then((response) => {
			dispatch(ajaxLoading(false));

			return response;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
