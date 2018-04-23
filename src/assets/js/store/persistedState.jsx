/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

export const loadState = () => {
	try {
		const serializedState = localStorage.getItem('scheduler:state');

		return (serializedState === null) ? undefined : JSON.parse(serializedState);
	} catch (error) {
		return undefined;
	}
};

export const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);

		return localStorage.setItem('scheduler:state', serializedState);
	} catch (error) {
		return undefined;
	}
};
