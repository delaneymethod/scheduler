import rotaCostReducer from '../../../src/assets/js/reducers/rotaCostReducer';

import { SWITCH_ROTA_COST } from '../../../src/assets/js/actions/actionTypes';

describe('Rota Cost Reducer', () => {
	it('should handle SWITCH_ROTA_COST', () => {
		const mockRotaCost = 500;

		const action = {
			type: SWITCH_ROTA_COST,
			rotaCost: mockRotaCost,
		};

		const rotaCost = rotaCostReducer(mockRotaCost, action);

		expect(rotaCost).toEqual(mockRotaCost);
	});
});
