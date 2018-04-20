/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from './actionTypes';
import schedulerApi from '../api/schedulerApi';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const authenticated = status => ({
	type: types.AUTHENTICATED,
	status,
});

export const login = credentials => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.login(credentials)
		.then((response) => {
			dispatch(authenticated(true));

			dispatch(ajaxLoading(false));

			return response;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const logout = () => dispatch => dispatch(authenticated(false));
