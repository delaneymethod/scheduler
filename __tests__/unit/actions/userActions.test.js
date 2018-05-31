import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/userActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('User Actions', () => {
	let store;

	it('should create UPDATE_USER action on updateUser', () => {
		store = mockStore({ user: {} });

		const payload = {
			id: 1,
		};

		const expectedActions = [{
			user: payload,
			type: types.UPDATE_USER,
		}];

		return store.dispatch(actions.updateUser(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});
});
