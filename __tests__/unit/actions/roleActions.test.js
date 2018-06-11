import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/roleActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Role Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_ROLES and AJAX_LOADING actions on getRoles', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ roles: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			roles: [],
			type: types.GET_ROLES,
		}];

		const payload = {
			roleId: 1,
		};

		return store.dispatch(actions.getRoles(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getRoles', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ roles: [] });

		return store.dispatch(actions.getRoles({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_ROLE and AJAX_LOADING actions on getRole', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ roles: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			role: {},
			type: types.GET_ROLE,
		}];

		const payload = {
			roleId: 2,
		};

		return store.dispatch(actions.getRole(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getRole', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ roles: [] });

		return store.dispatch(actions.getRole({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_ROLE and AJAX_LOADING actions on createRole', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {},
			});
		});

		store = mockStore({ roles: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			role: {},
			type: types.CREATE_ROLE,
		}];

		const payload = {
			roleId: 1,
		};

		return store.dispatch(actions.createRole(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createRole', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ roles: [] });

		return store.dispatch(actions.createRole({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_ROLE and AJAX_LOADING actions on updateRole', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ roles: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			role: {},
			type: types.UPDATE_ROLE,
		}];

		const payload = {
			roleId: 1,
		};

		return store.dispatch(actions.updateRole(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updateRole', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ roles: [] });

		return store.dispatch(actions.updateRole({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_ROLE and AJAX_LOADING actions on deleteRole', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: {},
			});
		});

		store = mockStore({ roles: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			role: {},
			type: types.DELETE_ROLE,
		}];

		const payload = {
			roleId: 2,
		};

		return store.dispatch(actions.deleteRole(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deleteRole', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ roles: [] });

		return store.dispatch(actions.deleteRole({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
