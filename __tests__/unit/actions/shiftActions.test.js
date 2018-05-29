import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/shiftActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Shift Actions', () => {
	let store;

	let mockPayload;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_SHIFTS and AJAX_LOADING actions on getShifts', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: mockPayload,
			});
		});

		store = mockStore({ shifts: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shifts: mockPayload,
			type: types.GET_SHIFTS,
		}];

		return store.dispatch(actions.getShifts()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getShifts', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: mockPayload,
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.getShifts({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_SHIFT and AJAX_LOADING actions on getShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: mockPayload,
			});
		});

		store = mockStore({ shifts: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shift: mockPayload,
			type: types.GET_SHIFT,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.getShift(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: mockPayload,
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.getShift({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_SHIFT and AJAX_LOADING actions on createShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: mockPayload,
			});
		});

		store = mockStore({ shifts: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shift: mockPayload,
			type: types.CREATE_SHIFT,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.createShift(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: mockPayload,
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.createShift({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_SHIFT and AJAX_LOADING actions on updateShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: mockPayload,
			});
		});

		store = mockStore({ shifts: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shift: mockPayload,
			type: types.UPDATE_SHIFT,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.updateShift(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updateShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: mockPayload,
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.updateShift({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_SHIFT and AJAX_LOADING actions on deleteShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: mockPayload,
			});
		});

		store = mockStore({ shifts: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shift: mockPayload,
			type: types.DELETE_SHIFT,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.deleteShift(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deleteShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: mockPayload,
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.deleteShift({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
