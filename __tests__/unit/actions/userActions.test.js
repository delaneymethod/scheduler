import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/userActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('User Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

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

	it('should create AJAX_LOADING actions on serviceUpdates', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ user: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}];

		const payload = {
			email: 'hello@giggrafter.com',
		};

		return store.dispatch(actions.serviceUpdates(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed serviceUpdates', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ user: [] });

		return store.dispatch(actions.serviceUpdates({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
