import rotasReducer from '../../../src/assets/js/reducers/rotasReducer';

import { GET_ROTA, GET_ROTAS, CREATE_ROTA, UPDATE_ROTA, DELETE_ROTA } from '../../../src/assets/js/actions/actionTypes';

const findRota = (rotas, rotaId) => (rotas.length ? rotas.find(rota => rota.rotaId === rotaId) : null);

describe('Rotas Reducer', () => {
	let mockRotas;

	beforeEach(() => {
		mockRotas = [{
			roleId: 1,
			rotaTypeId: 1,
			startDate: '2019-03-07',
			budget: 15000,
		}];
	});

	it('should return the initial state', () => expect(rotasReducer(undefined, [])).toEqual([]));

	it('should handle GET_ROTA', () => {
		const mockRota = mockRotas[0];

		const action = {
			type: GET_ROTA,
			rota: mockRota,
		};

		const rotas = rotasReducer(mockRotas, action);

		const rota = findRota(rotas, mockRota.rotaId);

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
			roleId: 1,
			rotaTypeId: 1,
			startDate: '2019-03-07',
			budget: 15000,
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

		mockRota.budget = 2018;

		const action = {
			type: UPDATE_ROTA,
			rota: mockRota,
		};

		const rotas = rotasReducer(mockRotas, action);

		const rota = findRota(rotas, mockRota.rotaId);

		expect(rota.budget).toEqual(mockRota.budget);
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
