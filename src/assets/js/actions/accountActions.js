import api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET ALL ACCOUNTS */
export const getAccountsSuccess = accounts => ({
	type: types.GET_ACCOUNTS,
	accounts,
});

export const getAccounts = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getAccounts()
		.then((accounts) => {
			dispatch(ajaxLoading(false));

			dispatch(getAccountsSuccess(accounts));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET SPECIFIC ACCOUNT */
export const getAccountSuccess = account => ({
	type: types.GET_ACCOUNT,
	account,
});

export const getAccount = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getAccount(payload)
		.then((account) => {
			dispatch(ajaxLoading(false));

			dispatch(getAccountSuccess(account));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* CREATE NEW ACCOUNT */
export const createAccountSuccess = account => ({
	type: types.CREATE_ACCOUNT,
	account,
});

export const createAccount = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createAccount(payload)
		.then((account) => {
			dispatch(ajaxLoading(false));

			dispatch(createAccountSuccess(account));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC ACCOUNT */
export const updateAccountSuccess = account => ({
	type: types.UPDATE_ACCOUNT,
	account,
});

export const updateAccount = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updateAccount(payload)
		.then((account) => {
			dispatch(ajaxLoading(false));

			dispatch(updateAccountSuccess(account));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC ACCOUNT */
export const deleteAccountSuccess = account => ({
	type: types.DELETE_ACCOUNT,
	account,
});

export const deleteAccount = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deleteAccount(payload)
		.then(() => {
			dispatch(ajaxLoading(false));

			dispatch(deleteAccountSuccess(payload));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* SWITCH BETWEEN ACCOUNTS */
export const switchAccountSuccess = account => ({
	type: types.SWITCH_ACCOUNT,
	account,
});

export const switchAccount = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.switchAccount(payload)
		.then((account) => {
			dispatch(ajaxLoading(false));

			dispatch(switchAccountSuccess(account));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
