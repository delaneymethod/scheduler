import { UPDATE_SETTINGS } from '../../../src/assets/js/actions/actionTypes';

import settingsReducer from '../../../src/assets/js/reducers/settingsReducer';

describe('Settings Reducer', () => {
	it('should return the initial state', () => {
		expect(settingsReducer(undefined, {})).toEqual({});
	});

	it('should handle UPDATE_SETTINGS', () => {
		const action = {
			settings: {},
			type: UPDATE_SETTINGS,
		};

		expect(settingsReducer({}, action)).toEqual({});
	});
});
