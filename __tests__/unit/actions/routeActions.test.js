import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/routeActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Route Actions', () => {
	let store;

	it('should create SWITCH_ROUTE action on switchRoute', () => {
		store = mockStore({ route: '' });

		const payload = '/';

		const expectedActions = [{
			route: payload,
			type: types.SWITCH_ROUTE,
		}];

		return store.dispatch(actions.switchRoute(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should accept cookies consent on acceptCookiesConsent', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: '',
			});
		});

		store = mockStore({});

		const expectedActions = [];

		return store.dispatch(actions.acceptCookiesConsent()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});
});
