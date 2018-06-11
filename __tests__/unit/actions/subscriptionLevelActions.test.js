import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/subscriptionLevelActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Subscription Level Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_SUBSCRIPTION_LEVELS and AJAX_LOADING actions on getsubscriptionLevels', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ subscriptionLevels: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			subscriptionLevels: [],
			type: types.GET_SUBSCRIPTION_LEVELS,
		}];

		return store.dispatch(actions.getSubscriptionLevels()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getSubscriptionLevels', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ subscriptionLevels: [] });

		return store.dispatch(actions.getSubscriptionLevels({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
