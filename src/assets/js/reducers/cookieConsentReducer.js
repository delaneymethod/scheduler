import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedLocalStorageState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const cookieConsentReducer = (state = combinedState.cookieConsent, action) => {
	switch (action.type) {
		case types.UPDATE_COOKIE_CONSENT:
			return action.cookieConsent;

		default:
			return state;
	}
};

export default cookieConsentReducer;
