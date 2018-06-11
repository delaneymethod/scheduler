import rotaTypeReducer from '../../../src/assets/js/reducers/rotaTypeReducer';

import { SWITCH_ROTA_TYPE } from '../../../src/assets/js/actions/actionTypes';

describe('Rota Type Reducer', () => {
	it('should handle SWITCH_ROTA_TYPE', () => {
		const mockRotaType = {
			rotaTypeId: 1,
			rotaTypeName: 'Bar',
		};

		const action = {
			type: SWITCH_ROTA_TYPE,
			rotaType: mockRotaType,
		};

		const rotaType = rotaTypeReducer(mockRotaType, action);

		expect(rotaType.rotaTypeName).toEqual(mockRotaType.rotaTypeName);
	});
});
