import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/unavailabilityTypeActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Unavailability Type Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_UNAVAILABILITY_TYPES and AJAX_LOADING actions on getUnavailabilityTypes', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ unavailabilityTypes: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			unavailabilityTypes: [],
			type: types.GET_UNAVAILABILITY_TYPES,
		}];

		return store.dispatch(actions.getUnavailabilityTypes()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getUnavailabilityTypes', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ unavailabilityTypes: [] });

		return store.dispatch(actions.getUnavailabilityTypes()).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
