import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/rotaActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Rota Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_ROTAS and AJAX_LOADING actions on getRotas', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ rotas: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rotas: [],
			type: types.GET_ROTAS,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.getRotas(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getRotas', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		return store.dispatch(actions.getRotas({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_ROTA and AJAX_LOADING actions on getRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

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
			id: 2,
		};

		return store.dispatch(actions.getRota(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		return store.dispatch(actions.getRota({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_ROTA and AJAX_LOADING actions on createRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rota: {},
			type: types.CREATE_ROTA,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.createRota(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		return store.dispatch(actions.createRota({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_ROTA and AJAX_LOADING actions on updateRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rota: {},
			type: types.UPDATE_ROTA,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.updateRota(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updateRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		return store.dispatch(actions.updateRota({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_ROTA and AJAX_LOADING actions on deleteRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rota: {},
			type: types.DELETE_ROTA,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.deleteRota(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deleteRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		return store.dispatch(actions.deleteRota({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create SWITCH_ROTA action on switchRota', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ rota: {} });

		const expectedActions = [{
			rota: {},
			type: types.SWITCH_ROTA,
		}];

		return store.dispatch(actions.switchRota({})).then(() => expect(store.getActions()).toEqual(expectedActions));
	});
});
