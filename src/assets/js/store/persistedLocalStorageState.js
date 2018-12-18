/* eslint-disable no-param-reassign */
import initialState from './initialState';

import packageJson from '../../../../package.json';

const prefix = packageJson.name;

export const getState = (key) => {
	if (window.localStorage.getItem) {
		const serializedData = window.localStorage.getItem(`${prefix}:${key}`);

		return (serializedData === null) ? undefined : JSON.parse(serializedData);
	}

	return false;
};

export const getStates = () => {
	const allStates = Object.keys(window.localStorage).reduce((states, key) => {
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
	if (window.localStorage.setItem) {
		const serializedData = JSON.stringify(data);

		window.localStorage.setItem(`${prefix}:${key}`, serializedData);

		return true;
	}

	return false;
};

export const deleteState = (key) => {
	if (getState(key) === undefined || getState(key) === false) {
		return false;
	}

	window.localStorage.removeItem(`${prefix}:${key}`);

	return true;
};

export const clearState = () => window.localStorage.clear();
/* eslint-enable no-param-reassign */
