import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/unavailabilityActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Unavailability Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_UNAVAILABILITY and AJAX_LOADING actions on getUnavailability', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ unavailabilities: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			unavailability: {},
			type: types.GET_UNAVAILABILITY,
		}];

		const payload = {
			unavailabilityId: 2,
		};

		return store.dispatch(actions.getUnavailability(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getUnavailability', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ unavailabilities: [] });

		return store.dispatch(actions.getUnavailability({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_UNAVAILABILITY and AJAX_LOADING actions on createUnavailability', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {},
			});
		});

		store = mockStore({ unavailabilities: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			unavailability: {},
			type: types.CREATE_UNAVAILABILITY,
		}];

		const payload = {
			unavailabilityId: 1,
		};

		return store.dispatch(actions.createUnavailability(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createUnavailability', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ unavailabilities: [] });

		return store.dispatch(actions.createUnavailability({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_UNAVAILABILITY and AJAX_LOADING actions on updateUnavailability', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ unavailabilities: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			unavailability: {},
			type: types.UPDATE_UNAVAILABILITY,
		}];

		const payload = {
			unavailabilityId: 1,
		};

		return store.dispatch(actions.updateUnavailability(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updateUnavailability', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ unavailabilities: [] });

		return store.dispatch(actions.updateUnavailability({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_UNAVAILABILITY and AJAX_LOADING actions on deleteUnavailability', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: {},
			});
		});

		store = mockStore({ unavailabilities: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			unavailability: {},
			type: types.DELETE_UNAVAILABILITY,
		}];

		const payload = {
			unavailabilityId: 2,
		};

		return store.dispatch(actions.deleteUnavailability(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deleteUnavailability', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ unavailabilities: [] });

		return store.dispatch(actions.deleteUnavailability({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
