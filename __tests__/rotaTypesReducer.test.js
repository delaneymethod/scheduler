import rotaTypesReducer from '../src/assets/js/reducers/rotaTypesReducer';
import { GET_ROTA_TYPE, GET_ROTA_TYPES, CREATE_ROTA_TYPE, UPDATE_ROTA_TYPE, DELETE_ROTA_TYPE } from '../src/assets/js/actions/actionTypes';

const findRotaType = (rotaTypes, id) => (rotaTypes.length ? rotaTypes.find(rotaType => rotaType.id === id) : null);

describe('Rota Types Reducer', () => {
	let mockRotaTypes;

	beforeEach(() => {
		mockRotaTypes = [{
			id: 1,
			account_id: 2,
			rota_type_name: 'Bar1',
			created_date: '2018-04-24 09:32:08',
			last_updated: '2018-04-24 09:32:08',
		}];
	});

	it('should return the initial state', () => expect(rotaTypesReducer(undefined, {})).toEqual([]));

	it('should handle GET_ROTA_TYPE', () => {
		const mockRotaType = mockRotaTypes[0];

		const action = {
			type: GET_ROTA_TYPE,
			rotaType: mockRotaType,
		};

		const rotaTypes = rotaTypesReducer(mockRotaTypes, action);

		const rotaType = findRotaType(rotaTypes, mockRotaType.id);

		expect(rotaType).toEqual(mockRotaType);
	});

	it('should handle GET_ROTA_TYPES', () => {
		const action = {
			type: GET_ROTA_TYPES,
			rotaTypes: mockRotaTypes,
		};

		expect(rotaTypesReducer(mockRotaTypes, action)).toEqual(mockRotaTypes);
	});

	it('should handle CREATE_ROTA_TYPE', () => {
		const mockRotaType = {
			id: 1,
			account_id: 3,
			rota_type_name: 'Bar2',
			created_date: '2018-04-24 09:32:08',
			last_updated: '2018-04-24 09:32:08',
		};

		const action = {
			type: CREATE_ROTA_TYPE,
			rotaType: mockRotaType,
		};

		const rotaTypes = rotaTypesReducer(mockRotaTypes, action);

		expect(rotaTypes.length).toEqual(2);
	});

	it('should handle UPDATE_ROTA_TYPE', () => {
		const mockRotaType = mockRotaTypes[0];

		mockRotaType.last_updated = '2018-05-16 16:40:32';

		const action = {
			type: UPDATE_ROTA_TYPE,
			rotaType: mockRotaType,
		};

		const rotaTypes = rotaTypesReducer(mockRotaTypes, action);

		const rotaType = findRotaType(rotaTypes, mockRotaType.id);

		expect(rotaType.last_updated).toEqual(mockRotaType.last_updated);
	});

	it('should handle DELETE_ROTA_TYPE', () => {
		const mockRotaType = mockRotaTypes[0];

		const action = {
			type: DELETE_ROTA_TYPE,
			rotaType: mockRotaType,
		};

		const rotaTypes = rotaTypesReducer(mockRotaTypes, action);

		expect(rotaTypes.length).toEqual(0);
	});
});
