import * as types from './actionTypes';

import logMessage from '../helpers/logging';

import isIncognitoMode from '../helpers/isIncognitoMode';

import { clearState } from '../store/persistedLocalStorageState';

/* UPDATE COOKIE CONSENT */
export const updateCookieConsentSuccess = cookieConsent => ({
	type: types.UPDATE_COOKIE_CONSENT,
	cookieConsent,
});

export const deleteCookies = () => () => {
	const cookies = document.cookie.split(';');

	for (let i = 0; i < cookies.length; i += 1) {
		const cookie = cookies[i];

		const eqPos = cookie.indexOf('=');

		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
	}

	logMessage('info', 'Cookies deleted');

	clearState();

	return Promise.resolve(true);
};

export const updateCookieConsent = payload => (dispatch) => {
	isIncognitoMode().then(() => {
		logMessage('info', 'Incognito mode detected');

		dispatch(updateCookieConsentSuccess(false));
	}).catch(() => {
		logMessage('info', `Cookie Consent accepted: ${payload}`);

		dispatch(updateCookieConsentSuccess(payload));

		if (!payload) {
			deleteCookies();
		}
	});

	return Promise.resolve(true);
};
