/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { loadState } from '../store/persistedState';

const persistedState = loadState();

const combinedState = Object.assign(initialState, persistedState);

const companiesReducer = (state = combinedState.companies, action) => {
	switch (action.type) {
		case types.GET_COMPANIES_SUCCESS:
			return action.companies;

		case types.GET_COMPANY_SUCCESS:
		case types.UPDATE_COMPANY_SUCCESS:
			return [
				...state.filter(company => company.id !== action.company.id),
				Object.assign({}, action.company),
			];

		case types.CREATE_COMPANY_SUCCESS:
			return [
				...state,
				Object.assign({}, action.company),
			];

		case types.DELETE_COMPANY_SUCCESS:
			return [
				...state.filter(company => company.id !== action.company.id),
			];

		default:
			return state;
	}
};

export default companiesReducer;
