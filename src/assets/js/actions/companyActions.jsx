/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from './actionTypes';
import schedulerApi from '../api/schedulerApi';

export const formStatus = status => ({
	type: types.FORM_STATUS,
	status,
});

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getCompaniesSuccess = companies => ({
	type: types.GET_COMPANIES_SUCCESS,
	companies,
});

/* GET ALL COMPANIES */
export const getCompanies = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.getCompanies()
		.then((companies) => {
			dispatch(getCompaniesSuccess(companies));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const getCompanySuccess = company => ({
	type: types.GET_COMPANY_SUCCESS,
	company,
});

/* GET SPECIFIC COMPANY */
export const getCompany = company => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.getCompany(company)
		.then((data) => {
			dispatch(getCompanySuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const createCompanySuccess = company => ({
	type: types.CREATE_COMPANY_SUCCESS,
	company,
});

/* CREATE NEW COMPANY */
export const createCompany = company => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.createCompany(company)
		.then((data) => {
			dispatch(createCompanySuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updateCompanySuccess = company => ({
	type: types.UPDATE_COMPANY_SUCCESS,
	company,
});

/* UPDATE SPECIFIC COMPANY */
export const updateCompany = company => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.updateCompany(company)
		.then((data) => {
			dispatch(updateCompanySuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const deleteCompanySuccess = company => ({
	type: types.DELETE_COMPANY_SUCCESS,
	company,
});

/* DELETE SPECIFIC COMPANY */
export const deleteCompany = company => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.deleteCompany(company)
		.then(() => {
			dispatch(deleteCompanySuccess(company));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
