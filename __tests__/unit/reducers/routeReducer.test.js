import { SWITCH_ROUTE } from '../../../src/assets/js/actions/actionTypes';

import routeReducer from '../../../src/assets/js/reducers/routeReducer';

describe('Route Reducer', () => {
	it('should return the initial state', () => expect(routeReducer(undefined, '')).toEqual(''));

	it('should handle SWITCH_ROUTE', () => {
		const route = '/';

		const action = {
			type: SWITCH_ROUTE,
			route,
		};

		expect(routeReducer({}, action)).toEqual(route);
	});
});
