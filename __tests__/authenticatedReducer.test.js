import { AUTHENTICATED } from '../src/assets/js/actions/actionTypes';
import authenticatedReducer from '../src/assets/js/reducers/authenticatedReducer';

describe('Authenticated Reducer', () => {
	it('should return the initial state', () => expect(authenticatedReducer(undefined, {})).toEqual(false));

	it('should handle AUTHENTICATED', () => {
		const action = {
			status: false,
			type: AUTHENTICATED,
		};

		expect(authenticatedReducer({}, action)).toEqual(false);
	});
});
