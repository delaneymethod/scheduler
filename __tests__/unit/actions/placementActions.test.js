import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/placementActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Placement Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create GET_PLACEMENTS and AJAX_LOADING actions on getPlacements', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {
					data: [],
				},
			});
		});

		store = mockStore({ placements: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			placements: [],
			type: types.GET_PLACEMENTS,
		}];

		return store.dispatch(actions.getPlacements()).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getPlacements', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		return store.dispatch(actions.getPlacements({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create GET_PLACEMENT and AJAX_LOADING actions on getPlacement', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			placement: {},
			type: types.GET_PLACEMENT,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.getPlacement(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed getPlacement', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		return store.dispatch(actions.getPlacement({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create CREATE_PLACEMENT and AJAX_LOADING actions on createPlacement', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 201,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			placement: {},
			type: types.CREATE_PLACEMENT,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.createPlacement(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed createPlacement', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		return store.dispatch(actions.createPlacement({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create UPDATE_PLACEMENT and AJAX_LOADING actions on updatePlacement', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			placement: {},
			type: types.UPDATE_PLACEMENT,
		}];

		const payload = {
			id: 1,
		};

		return store.dispatch(actions.updatePlacement(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed updatePlacement', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		return store.dispatch(actions.updatePlacement({})).catch(error => expect(store.getActions()).not.toBeNull());
	});

	it('should create DELETE_PLACEMENT and AJAX_LOADING actions on deletePlacement', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 204,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		const expectedActions = [{
			status: true,
			type: types.AJAX_LOADING,
		}, {
			status: false,
			type: types.AJAX_LOADING,
		}, {
			placement: {},
			type: types.DELETE_PLACEMENT,
		}];

		const payload = {
			id: 2,
		};

		return store.dispatch(actions.deletePlacement(payload)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});

	it('should catch error on failed deletePlacement', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 400,
				response: {},
			});
		});

		store = mockStore({ placements: [] });

		return store.dispatch(actions.deletePlacement({})).catch(error => expect(store.getActions()).not.toBeNull());
	});
});
