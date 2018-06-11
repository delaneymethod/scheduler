import rotaReducer from '../../../src/assets/js/reducers/rotaReducer';

import { SWITCH_ROTA } from '../../../src/assets/js/actions/actionTypes';

describe('Rota Reducer', () => {
	it('should handle SWITCH_ROTA', () => {
		const mockRota = {
			rotaId: 1,
		};

		const action = {
			type: SWITCH_ROTA,
			rota: mockRota,
		};

		const rota = rotaReducer(mockRota, action);

		expect(rota.rotaId).toEqual(mockRota.rotaId);
	});
});
