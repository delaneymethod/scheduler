import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/authenticationActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Authentication Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create UPDATE_USER, AJAX_LOADING and AUTHENTICATED actions on login', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ user: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			user: {},
			type: types.UPDATE_USER,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			status: true,
			type: types.AUTHENTICATED,
		}];

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry@giggrafter.com',
		};

		return store.dispatch(actions.login(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on login', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 404,
				response: {
					error: {
						code: 404,
						type: 'Not Found',
						message: 'A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.',
						hints: {
							summary: 'Email address was not found.',
						},
					},
				},
			});
		});

		store = mockStore({});

		const expectedError = {
			data: {
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Email address was not found.</li></ul>',
			},
		};

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry@giggraftercom',
		};

		return store.dispatch(actions.login(payload)).catch(error => expect(error).toEqual(expectedError));
	});

	it('should create UPDATE_USER and AUTHENTICATED actions on logout', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({
			rota: {},
			week: {},
			user: {},
			route: '',
			rotas: [],
			shifts: [],
			rotaType: {},
			rotaTypes: [],
			placements: [],
			applicationUserRoles: [],
		});

		const expectedActions = [{
			rotas: [],
			type: 'GET_ROTAS',
		}, {
			shifts: [],
			type: 'GET_SHIFTS',
		}, {
			status: false,
			type: 'AUTHENTICATED',
		}, {
			type: 'UPDATE_USER',
			user: {},
		}, {
			type: 'SWITCH_ROUTE',
			route: '',
		}, {
			type: 'SWITCH_WEEK',
			week: {},
		}, {
			rota: {},
			type: 'SWITCH_ROTA',
		}, {
			employees: [],
			type: 'GET_EMPLOYEES',
		}, {
			rotaTypes: [],
			type: 'GET_ROTA_TYPES',
		}, {
			placements: [],
			type: 'GET_PLACEMENTS',
		}, {
			rotaType: {},
			type: 'SWITCH_ROTA_TYPE',
		}, {
			rotaEmployees: [],
			type: 'GET_ROTA_EMPLOYEES',
		}, {
			unavailabilityTypes: [],
			type: 'GET_UNAVAILABILITY_TYPES',
		}, {
			applicationUserRoles: [],
			type: 'GET_APPLICATION_USER_ROLES',
		}];

		return store.dispatch(actions.logout()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should create AJAX_LOADING action on register', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({});

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}];

		const payload = {
			lastName: 'Lynch',
			firstName: 'Barry',
			subscriptionLevel: 1,
			businessName: 'Gig Grafter',
			password: 'passwordMustBe10',
			email: 'barry@giggrafter.com',
		};

		return store.dispatch(actions.register(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch 409 error on register', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 409,
				response: {
					error: {
						code: 409,
						type: 'Conflict',
						message: 'A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.',
						hints: {
							summary: 'Email address already exists.',
						},
					},
				},
			});
		});

		store = mockStore({});

		const expectedError = {
			data: {
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Email address already exists.</li></ul>',
			},
		};

		const payload = {
			lastName: 'Lynch',
			firstName: 'Barry',
			subscriptionLevel: 1,
			businessName: 'Gig Grafter',
			password: 'passwordMustBe10',
			email: 'barry@giggrafter.com',
		};

		return store.dispatch(actions.register(payload)).catch(error => expect(error).toEqual(expectedError));
	});

	it('should catch 400 error on register', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {
					error: {
						code: 409,
						type: 'Conflict',
						message: 'A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.',
						hints: {
							summary: 'Email address already exists.',
						},
					},
				},
			});
		});

		store = mockStore({});

		const payload = {
			lastName: 'Lynch',
			firstName: 'Barry',
			businessName: 'Gig Grafter',
			password: 'passwordMustBe10',
			email: 'barry@giggrafter.com',
		};

		const expectedError = {
			data: {
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Email address already exists.</li></ul>',
			},
		};

		return store.dispatch(actions.register(payload)).catch(error => expect(error).toEqual(expectedError));
	});

	it('should create AJAX_LOADING action on forgotten your password', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({});

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}];

		const payload = {
			email: 'barry@giggrafter.com',
		};

		return store.dispatch(actions.forgottenYourPassword(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on forgotten your password', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 404,
				response: {
					error: {
						code: 404,
						type: 'Not Found',
						message: 'A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.',
						hints: {
							summary: 'Email address was not found.',
						},
					},
				},
			});
		});

		store = mockStore({});

		const expectedError = {
			data: {
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Email address was not found.</li></ul>',
			},
		};

		const payload = {
			email: 'barry@giggraftercom',
		};

		return store.dispatch(actions.forgottenYourPassword(payload)).catch(error => expect(error).toEqual(expectedError));
	});

	it('should create AJAX_LOADING action on reset your password', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({});

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}];

		const payload = {
			email: 'barry@giggrafter.com',
		};

		return store.dispatch(actions.resetYourPassword(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on reset your password', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 404,
				response: {
					error: {
						code: 404,
						type: 'Not Found',
						message: 'A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.',
						hints: {
							summary: 'Email address was not found.',
						},
					},
				},
			});
		});

		store = mockStore({});

		const expectedError = {
			data: {
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Email address was not found.</li></ul>',
			},
		};

		const payload = {
			email: 'barry@giggraftercom',
		};

		return store.dispatch(actions.resetYourPassword(payload)).catch(error => expect(error).toEqual(expectedError));
	});

	it('should create AJAX_LOADING action on update your password', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({});

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}];

		const payload = {
			token: '1234567890',
			email: 'barry@giggrafter.com',
		};

		return store.dispatch(actions.updateYourPassword(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on update your password', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 404,
				response: {
					error: {
						code: 404,
						type: 'Not Found',
						message: 'A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.',
						hints: {
							summary: 'Email address was not found.',
						},
					},
				},
			});
		});

		store = mockStore({});

		const expectedError = {
			data: {
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Email address was not found.</li></ul>',
			},
		};

		const payload = {
			token: '1234567890',
			email: 'barry@giggraftercom',
		};

		return store.dispatch(actions.updateYourPassword(payload)).catch(error => expect(error).toEqual(expectedError));
	});
});
