import initialState from './initialState';

const prefix = 'scheduler';

export const getState = (key) => {
	try {
		const serializedData = sessionStorage.getItem(`${prefix}:${key}`);

		return (serializedData === null) ? undefined : JSON.parse(serializedData);
	} catch (error) {
		return undefined;
	}
};

/* eslint-disable no-param-reassign */
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
/* eslint-enable no-param-reassign */

export const saveState = (key, data) => {
	try {
		const serializedData = JSON.stringify(data);

		return sessionStorage.setItem(`${prefix}:${key}`, serializedData);
	} catch (error) {
		return undefined;
	}
};

export const deleteState = (key) => {
	try {
		return sessionStorage.removeItem(`${prefix}:${key}`);
	} catch (error) {
		return undefined;
	}
};
