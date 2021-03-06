import { getState, getStates, saveState, deleteState, clearState } from '../../../src/assets/js/store/persistedSessionStorageState';

describe('Persisted Session Storage State', () => {
	it('should return true on save', () => {
		const state = saveState('name', 'Gig Grafter');

		expect(state).toEqual(true);
	});

	it('should get state', () => {
		const state = getState('name');

		expect(state).toEqual('Gig Grafter');
	});

	it('should return all states', () => {
		saveState('ajaxLoading', true);

		const states = getStates();

		expect(states).toHaveProperty('authenticated', false);
	});

	it('should return true on delete if key is found', () => {
		saveState('name', 'Gig Grafter');

		const state = deleteState('name');

		expect(state).toEqual(true);
	});

	it('should return false on delete if key is not found', () => {
		const state = deleteState('project');

		expect(state).toEqual(false);
	});

	it('should return undefined on get if key is null', () => {
		const state = getState('doesnt-exist');

		expect(state).toEqual(undefined);
	});

	it('should return false if no sessionStorage available on delete', () => {
		window.sessionStorage = {};

		const state = deleteState('name');

		expect(state).toEqual(false);
	});

	it('should return undefined after clear', () => {
		clearState();

		const state = getState('doesnt-exist');

		expect(state).toEqual(undefined);
	});
});
