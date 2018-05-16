import rotasReducer from '../src/assets/js/reducers/rotasReducer';
import { GET_ROTA, GET_ROTAS, CREATE_ROTA, UPDATE_ROTA, DELETE_ROTA } from '../src/assets/js/actions/actionTypes';

const findRota = (rotas, id) => (rotas.length ? rotas.find(rota => rota.id === id) : null);

describe('Rotas Reducer', () => {
	let mockRotas;

	beforeEach(() => {
		mockRotas = [{
			id: 1,
			account_id: 2,
			rota_type_id: 1,
			start_date: '2019-03-07',
			budget: 2500.25,
			rota_status: 'DRAFT',
			created_date: '2018-04-24 09:32:21',
			last_updated: '2018-04-24 09:32:20',
		}];
	});

	it('should return the initial state', () => expect(rotasReducer(undefined, {})).toEqual([]));

	it('should handle GET_ROTA', () => {
		const mockRota = mockRotas[0];

		const action = {
			type: GET_ROTA,
			rota: mockRota,
		};

		const rotas = rotasReducer(mockRotas, action);

		const rota = findRota(rotas, mockRota.id);

		expect(rota).toEqual(mockRota);
	});

	it('should handle GET_ROTAS', () => {
		const action = {
			type: GET_ROTAS,
			rotas: mockRotas,
		};

		expect(rotasReducer(mockRotas, action)).toEqual(mockRotas);
	});

	it('should handle CREATE_ROTA', () => {
		const mockRota = {
			id: 1,
			account_id: 3,
			rota_type_id: 1,
			start_date: '2019-03-07',
			budget: 15000,
			rota_status: 'DRAFT',
			created_date: '2018-04-24 09:32:21',
			last_updated: '2018-04-24 09:32:20',
		};

		const action = {
			type: CREATE_ROTA,
			rota: mockRota,
		};

		const rotas = rotasReducer(mockRotas, action);

		expect(rotas.length).toEqual(2);
	});

	it('should handle UPDATE_ROTA', () => {
		const mockRota = mockRotas[0];

		mockRota.last_updated = '2018-05-16 16:40:32';

		const action = {
			type: UPDATE_ROTA,
			rota: mockRota,
		};

		const rotas = rotasReducer(mockRotas, action);

		const rota = findRota(rotas, mockRota.id);

		expect(rota.last_updated).toEqual(mockRota.last_updated);
	});

	it('should handle DELETE_ROTA', () => {
		const mockRota = mockRotas[0];

		const action = {
			type: DELETE_ROTA,
			rota: mockRota,
		};

		const rotas = rotasReducer(mockRotas, action);

		expect(rotas.length).toEqual(0);
	});
});
