import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/authenticationActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Authentication Actions', () => {
	let store;

	let mockPayload;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_USER, AJAX_LOADING and AUTHENTICATED actions on login', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: mockPayload,
			});
		});

		store = mockStore({ user: {} });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			user: mockPayload,
			type: types.GET_USER,
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
				title: '404 Not Found',
				message: '<p>A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.</p><p class="pb-0 mb-0">Email address was not found.</p>',
			},
		};

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry@giggraftercom',
		};

		return store.dispatch(actions.login(payload)).catch(error => expect(error).toEqual(expectedError));
	});

	it('should create AJAX_LOADING and AUTHENTICATED actions on logout', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ user: {} });

		const expectedActions = [{
			user: {},
			type: types.GET_USER,
		}, {
			status: false,
			type: types.AUTHENTICATED,
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

	it('should catch error on register', () => {
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
				title: '409 Conflict',
				message: '<p>A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.</p><p class="pb-0 mb-0">Email address already exists.</p>',
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
				title: '404 Not Found',
				message: '<p>A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.</p><p class="pb-0 mb-0">Email address was not found.</p>',
			},
		};

		const payload = {
			email: 'barry@giggraftercom',
		};

		return store.dispatch(actions.forgottenYourPassword(payload)).catch(error => expect(error).toEqual(expectedError));
	});
});
