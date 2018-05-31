import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const authenticated = status => ({
	type: types.AUTHENTICATED,
	status,
});

export const updateUserSuccess = user => ({
	type: types.UPDATE_USER,
	user,
});

export const login = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.login(payload)
		.then((user) => {
			dispatch(updateUserSuccess(user));

			dispatch(ajaxLoading(false));

			dispatch(authenticated(true));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			dispatch(authenticated(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const logout = () => (dispatch) => {
	dispatch(updateUserSuccess({}));

	dispatch(authenticated(false));

	return Promise.resolve(true);
};

export const register = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.register(payload)
		.then(() => dispatch(ajaxLoading(false)))
		.catch((error) => {
			dispatch(ajaxLoading(false));

			dispatch(authenticated(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const forgottenYourPassword = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.forgottenYourPassword(payload)
		.then(() => dispatch(ajaxLoading(false)))
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
