import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/rotaTypeActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Rota Type Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_ROTA_TYPES and AJAX_LOADING actions on getRotaTypes', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ rotaTypeTypes: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rotaTypes: [],
			type: types.GET_ROTA_TYPES,
		}];

		return store.dispatch(actions.getRotaTypes()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getRotaTypes', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotaTypeTypes: [] });

		return store.dispatch(actions.getRotaTypes({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_ROTA_TYPE and AJAX_LOADING actions on getRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ rotaTypeTypes: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rotaType: {},
			type: types.GET_ROTA_TYPE,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.getRotaType(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotaTypeTypes: [] });

		return store.dispatch(actions.getRotaType({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_ROTA_TYPE and AJAX_LOADING actions on createRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {},
			});
		});

		store = mockStore({ rotaTypeTypes: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rotaType: {},
			type: types.CREATE_ROTA_TYPE,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.createRotaType(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotaTypeTypes: [] });

		return store.dispatch(actions.createRotaType({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_ROTA_TYPE and AJAX_LOADING actions on updateRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ rotaTypes: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rotaType: {},
			type: types.UPDATE_ROTA_TYPE,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.updateRotaType(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updateRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotaTypeTypes: [] });

		return store.dispatch(actions.updateRotaType({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_ROTA_TYPE and AJAX_LOADING actions on deleteRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: {},
			});
		});

		store = mockStore({ rotaTypes: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rotaType: {},
			type: types.DELETE_ROTA_TYPE,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.deleteRotaType(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deleteRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotaTypeTypes: [] });

		return store.dispatch(actions.deleteRotaType({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create SWITCH_ROTA_TYPE action on switchRotaType', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ rotaType: {} });

		const expectedActions = [{
			rotaType: {},
			type: types.SWITCH_ROTA_TYPE,
		}];

		return store.dispatch(actions.switchRotaType({})).then(() => expect(store.getActions()).toEqual(expectedActions));
	});
});
