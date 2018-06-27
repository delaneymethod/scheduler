import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/employeeActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Employee Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_EMPLOYEES and AJAX_LOADING actions on getEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ employees: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			employees: [],
			type: types.GET_EMPLOYEES,
		}];

		return store.dispatch(actions.getEmployees()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ employees: [] });

		return store.dispatch(actions.getEmployees({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create ORDER_EMPLOYEES and AJAX_LOADING actions on orderEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ employees: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			employees: [],
			type: types.ORDER_EMPLOYEES,
		}];

		const payload = {
			rotaTypeId: 1,
			objectIdList: ['3', '1', '2'],
		};

		return store.dispatch(actions.orderEmployees(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed orderEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ employees: [] });

		return store.dispatch(actions.orderEmployees({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPLOAD_EMPLOYEES and AJAX_LOADING actions on uploadEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ employees: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			employees: [],
			type: types.UPLOAD_EMPLOYEES,
		}];

		const payload = {
			file: 'filename.csv',
		};

		return store.dispatch(actions.uploadEmployees(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed uploadEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ employees: [] });

		return store.dispatch(actions.uploadEmployees({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_EMPLOYEE and AJAX_LOADING actions on getEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ employees: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			employee: {},
			type: types.GET_EMPLOYEE,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.getEmployee(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ employees: [] });

		return store.dispatch(actions.getEmployee({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_EMPLOYEE and AJAX_LOADING actions on createEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {},
			});
		});

		store = mockStore({ employees: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			employee: {},
			type: types.CREATE_EMPLOYEE,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.createEmployee(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ employees: [] });

		return store.dispatch(actions.createEmployee({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_EMPLOYEE and AJAX_LOADING actions on updateEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ employees: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			employee: {},
			type: types.UPDATE_EMPLOYEE,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.updateEmployee(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updateEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ employees: [] });

		return store.dispatch(actions.updateEmployee({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_EMPLOYEE and AJAX_LOADING actions on deleteEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: {},
			});
		});

		store = mockStore({ employees: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			employee: {},
			type: types.DELETE_EMPLOYEE,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.deleteEmployee(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deleteEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ employees: [] });

		return store.dispatch(actions.deleteEmployee({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
