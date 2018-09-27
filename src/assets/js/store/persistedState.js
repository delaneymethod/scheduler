/* eslint-disable no-param-reassign */
import initialState from './initialState';

import packageJson from '../../../../package.json';

const prefix = packageJson.name;

export const getState = (key) => {
	if (sessionStorage.getItem) {
		const serializedData = sessionStorage.getItem(`${prefix}:${key}`);

		return (serializedData === null) ? undefined : JSON.parse(serializedData);
	}

	return false;
};

export const getStates = () => {
	const allStates = Object.keys(sessionStorage).reduce((states, key) => {
		key = key.replace(`${prefix}:`, '');

		states[key] = getState(key);

		return states;
	}, {});

	return Object.keys(allStates).reduce((combinedStates, key) => {
		if (key in combinedStates) {
			combinedStates[key] = getState(key);
		}

		return combinedStates;
	}, initialState);
};

export const saveState = (key, data) => {
	if (sessionStorage.setItem) {
		const serializedData = JSON.stringify(data);

		sessionStorage.setItem(`${prefix}:${key}`, serializedData);

		return true;
	}

	return false;
};

export const deleteState = (key) => {
	if (getState(key) === undefined || getState(key) === false) {
		return false;
	}

	sessionStorage.removeItem(`${prefix}:${key}`);

	return true;
};
/* eslint-enable no-param-reassign */
