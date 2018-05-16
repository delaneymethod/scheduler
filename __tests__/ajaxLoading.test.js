import { AJAX_LOADING } from '../src/assets/js/actions/actionTypes';
import ajaxLoadingReducer from '../src/assets/js/reducers/ajaxLoadingReducer';

describe('Ajax Loading Reducer', () => {
	it('should return the initial state', () => {
		expect(ajaxLoadingReducer(undefined, {})).toEqual(false);
	});

	it('should handle AJAX_LOADING', () => {
		const action = {
			status: false,
			type: AJAX_LOADING,
		};

		expect(ajaxLoadingReducer({}, action)).toEqual(status);
	});
});
