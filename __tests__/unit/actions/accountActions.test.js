import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/accountActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Account Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_ACCOUNTS and AJAX_LOADING actions on getAccounts', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ accounts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			accounts: [],
			type: types.GET_ACCOUNTS,
		}];

		return store.dispatch(actions.getAccounts()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getAccounts', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: [],
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.getAccounts({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_ACCOUNT and AJAX_LOADING actions on getAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			account: {},
			type: types.GET_ACCOUNT,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.getAccount(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.getAccount({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_ACCOUNT and AJAX_LOADING actions on createAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			account: {},
			type: types.CREATE_ACCOUNT,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.createAccount(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.createAccount({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_ACCOUNT and AJAX_LOADING actions on updateAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			account: {},
			type: types.UPDATE_ACCOUNT,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.updateAccount(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updateAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.updateAccount({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_ACCOUNT and AJAX_LOADING actions on deleteAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			account: {},
			type: types.DELETE_ACCOUNT,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.deleteAccount(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deleteAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.deleteAccount({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create SWITCH_ACCOUNT and AJAX_LOADING actions on switchAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			account: {},
			type: types.SWITCH_ACCOUNT,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.switchAccount(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed switchAccount', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ accounts: [] });

		return store.dispatch(actions.switchAccount({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
