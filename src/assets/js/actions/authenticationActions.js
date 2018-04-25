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

export const authenticated = status => ({
	type: types.AUTHENTICATED,
	status,
});

export const login = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.login(payload)
		.then((response) => {
			dispatch(authenticated(true));

			dispatch(ajaxLoading(false));

			return response;
		})
		.catch((error) => {
			dispatch(authenticated(false));

			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const logout = () => (dispatch) => {
	dispatch(authenticated(false));

	try {
		sessionStorage.removeItem('scheduler:token');

		return Promise.resolve(true);
	} catch (error) {
		/* Bubble the error back up the rabbit hole */
		return Promise.reject(error);
	}
};

export const register = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.register(payload)
		.then((response) => {
			dispatch(authenticated(true));

			dispatch(ajaxLoading(false));

			return response;
		})
		.catch((error) => {
			dispatch(authenticated(false));

			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
