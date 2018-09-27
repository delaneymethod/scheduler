import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/unavailabilityOccurrenceActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Unavailability Occurrence Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_UNAVAILABILITY_OCCURRENCES and AJAX_LOADING actions on getUnavailabilityOccurrences', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ unavailabilityOccurrences: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			unavailabilityOccurrences: [],
			type: types.GET_UNAVAILABILITY_OCCURRENCES,
		}];

		const payload = {
			unavailabilityOccurrenceId: 1,
		};

		return store.dispatch(actions.getUnavailabilityOccurrences(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getUnavailabilityOccurrences', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ unavailabilityOccurrences: [] });

		return store.dispatch(actions.getUnavailabilityOccurrences({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
