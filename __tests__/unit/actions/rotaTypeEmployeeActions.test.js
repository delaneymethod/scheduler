import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/rotaTypeEmployeeActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Rota Type Employee Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create CREATE_ROTA_TYPE_EMPLOYEES and AJAX_LOADING actions on createRotaTypeEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ rotaEmployees: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rotaEmployees: [],
			type: types.CREATE_ROTA_TYPE_EMPLOYEES,
		}];

		const payload = {
			rotaTypeId: 1,
			employees: ['1', '2', '3'],
		};

		return store.dispatch(actions.createRotaTypeEmployees(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createRotaTypeEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotaEmployees: [] });

		return store.dispatch(actions.createRotaTypeEmployees({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_ROTA_TYPE_EMPLOYEE and AJAX_LOADING actions on deleteRotaTypeEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ rotaEmployees: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			rotaEmployee: {},
			type: types.DELETE_ROTA_TYPE_EMPLOYEE,
		}];

		const payload = {
			rotaTypeId: 1,
			accountEmployeeId: 3,
		};

		return store.dispatch(actions.deleteRotaTypeEmployee(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deleteRotaTypeEmployee', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotaEmployees: [] });

		return store.dispatch(actions.deleteRotaTypeEmployee({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
