import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/shiftActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Shift Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_SHIFTS and AJAX_LOADING actions on getShifts', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ shifts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shifts: [],
			type: types.GET_SHIFTS,
		}];

		const payload = {
			rotaId: 1,
		};

		return store.dispatch(actions.getShifts(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getShifts', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		return store.dispatch(actions.getShifts({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_ROTA and AJAX_LOADING actions on copyShifts', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {
					data: {},
				},
			});
		});

		store = mockStore({ shifts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rota: {},
			type: types.GET_ROTA,
		}];

		const payload = {
			rotaId: 1,
		};

		return store.dispatch(actions.copyShifts(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed copyShifts', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rota: [] });

		return store.dispatch(actions.copyShifts({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_SHIFT and AJAX_LOADING actions on getShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shift: {},
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
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		return store.dispatch(actions.getShift({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_SHIFT and AJAX_LOADING actions on createShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shift: {},
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
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		return store.dispatch(actions.createShift({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_SHIFT and AJAX_LOADING actions on updateShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shift: {},
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
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		return store.dispatch(actions.updateShift({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_SHIFT and AJAX_LOADING actions on deleteShift', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			shift: {},
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
				response: {},
			});
		});

		store = mockStore({ shifts: [] });

		return store.dispatch(actions.deleteShift({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
