import { UPDATE_WEEK } from '../../../src/assets/js/actions/actionTypes';

import weekReducer from '../../../src/assets/js/reducers/weekReducer';

describe('Week Reducer', () => {
	it('should return the initial state', () => expect(weekReducer(undefined, {})).toEqual({}));

	it('should handle UPDATE_WEEK', () => {
		const week = {
			startDate: '',
			endDate: '',
		};

		const action = {
			type: UPDATE_WEEK,
			week,
		};

		expect(weekReducer({}, action)).toEqual(week);
	});
});
