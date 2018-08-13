import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as types from '../../../src/assets/js/actions/actionTypes';

import * as actions from '../../../src/assets/js/actions/rotaCostActions';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

describe('Rota Cost Actions', () => {
	let store;

	beforeEach(() => moxios.install());

	afterEach(() => moxios.uninstall());

	it('should create SWITCH_ROTA_COST action on switchRotaCost', () => {
		moxios.wait(() => {
			const request = moxios.requests.mostRecent();

			request.respondWith({
				status: 200,
				response: 500,
			});
		});

		store = mockStore({ rotaCost: 0 });

		const expectedActions = [{
			rotaCost: 500,
			type: types.SWITCH_ROTA_COST,
		}];

		return store.dispatch(actions.switchRotaCost(500)).then(() => expect(store.getActions()).toEqual(expectedActions));
	});
});
