import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/weekActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Week Actions', () => {
	let store;

	it('should create SWITCH_WEEK action on updateWeek', () => {
		store = mockStore({ week: {} });

		const payload = {
			startDate: '',
			endDate: '',
		};

		const expectedActions = [{
			week: payload,
			type: types.SWITCH_WEEK,
		}];

		return store.dispatch(actions.switchWeek(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});
});
