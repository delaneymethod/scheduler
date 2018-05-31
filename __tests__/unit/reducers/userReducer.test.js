import { UPDATE_USER } from '../../../src/assets/js/actions/actionTypes';

import userReducer from '../../../src/assets/js/reducers/userReducer';

describe('User Reducer', () => {
	it('should return the initial state', () => expect(userReducer(undefined, {})).toEqual({}));

	it('should handle UPDATE_USER', () => {
		const user = {
			firstName: 'Barry',
			email: 'barry.lynch@giggrafter.com',
		};

		const action = {
			type: UPDATE_USER,
			user,
		};

		expect(userReducer({}, action)).toEqual(user);
	});
});
