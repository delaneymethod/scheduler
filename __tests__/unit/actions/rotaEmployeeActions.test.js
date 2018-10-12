import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/rotaEmployeeActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Rota Employee Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_ROTA_EMPLOYEES and AJAX_LOADING actions on getRotaEmployees', () => {
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
			type: types.GET_ROTA_EMPLOYEES,
		}];

		const payload = {
			rotaId: 1,
		};

		return store.dispatch(actions.getRotaEmployees(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getRotaEmployees', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotas: [] });

		return store.dispatch(actions.getRotaEmployees({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_ROTA_EMPLOYEES_ORDER and AJAX_LOADING actions on updateRotaEmployeesOrder', () => {
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
			type: types.UPDATE_ROTA_EMPLOYEES_ORDER,
		}];

		const payload = {
			rotaId: 1,
			objectIdList: ['3', '1', '2'],
		};

		return store.dispatch(actions.updateRotaEmployeesOrder(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updateRotaEmployeesOrder', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ rotaEmployees: [] });

		return store.dispatch(actions.updateRotaEmployeesOrder({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
