import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const accountsReducer = (state = combinedState.accounts, action) => {
	switch (action.type) {
		case types.GET_ACCOUNTS:
			return action.accounts;

		case types.GET_ACCOUNT:
		case types.UPDATE_ACCOUNT:
			return [
				...state.filter(account => account.id !== action.account.id),
				Object.assign({}, action.account),
			];

		case types.CREATE_ACCOUNT:
			return [
				...state,
				Object.assign({}, action.account),
			];

		case types.DELETE_ACCOUNT:
			return [
				...state.filter(account => account.id !== action.account.id),
			];
		case types.SWITCH_ACCOUNT:
			return action.account;

		default:
			return state;
	}
};

export default accountsReducer;
