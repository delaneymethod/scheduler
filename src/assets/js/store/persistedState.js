/* eslint-disable no-param-reassign */
import isEmpty from 'lodash/isEmpty';

import initialState from './initialState';

import packageJson from '../../../../package.json';

const prefix = packageJson.name;

export const getState = (key, storage = {}) => {
	storage = (!isEmpty(storage)) ? window.sessionStorage : window.localStorage;

	if (storage.getItem) {
		const serializedData = storage.getItem(`${prefix}:${key}`);

		return (serializedData === null) ? undefined : JSON.parse(serializedData);
	}

	return false;
};

export const getStates = () => {
	const allLocalStates = Object.keys(window.localStorage).reduce((states, key) => {
		key = key.replace(`${prefix}:`, '');

		states[key] = getState(key);

		return states;
	}, {});

	const allSessionStates = Object.keys(window.sessionStorage).reduce((states, key) => {
		key = key.replace(`${prefix}:`, '');

		states[key] = getState(key, 'session');

		return states;
	}, {});

	const storageKeys = Object.assign(allLocalStates, allSessionStates);

	return Object.keys(storageKeys).reduce((combinedStates, key) => {
		if (key in combinedStates) {
			if (key === 'user' || key === 'authenticated') {
				combinedStates[key] = getState(key, 'session');
			} else {
				combinedStates[key] = getState(key);
			}
		}

		return combinedStates;
	}, initialState);
};

export const saveState = (key, data, storage = {}) => {
	storage = (!isEmpty(storage)) ? window.sessionStorage : window.localStorage;

	if (storage.setItem) {
		const serializedData = JSON.stringify(data);

		storage.setItem(`${prefix}:${key}`, serializedData);

		return true;
	}

	return false;
};

export const deleteState = (key, storage = {}) => {
	storage = (!isEmpty(storage)) ? window.sessionStorage : window.localStorage;

	if ((key === 'user' || key === 'authenticated') && (getState(key, 'session') === undefined || getState(key, 'session') === false)) {
		return false;
	} else if (getState(key) === undefined || getState(key) === false) {
		return false;
	}

	storage.removeItem(`${prefix}:${key}`);

	return true;
};
/* eslint-enable no-param-reassign */
