import rotaEmployeesReducer from '../../../src/assets/js/reducers/rotaEmployeesReducer';

import { GET_ROTA_EMPLOYEES, UPDATE_ROTA_EMPLOYEES_ORDER } from '../../../src/assets/js/actions/actionTypes';

const findRotaEmployee = (rotaEmployees, rotaEmployeeId) => (rotaEmployees.length ? rotaEmployees.find(rotaEmployee => rotaEmployee.accountEmployeeId === rotaEmployeeId) : null);

describe('Rota Employees Reducer', () => {
	let mockRotaEmployees;

	beforeEach(() => {
		mockRotaEmployees = [{
			accountEmployeeId: 1,
		}];
	});

	it('should return the initial state', () => expect(rotaEmployeesReducer(undefined, [])).toEqual([]));

	it('should handle GET_ROTA_EMPLOYEES', () => {
		const action = {
			type: GET_ROTA_EMPLOYEES,
			rotaEmployees: mockRotaEmployees,
		};

		expect(rotaEmployeesReducer(mockRotaEmployees, action)).toEqual(mockRotaEmployees);
	});

	it('should handle UPDATE_ROTA_EMPLOYEES_ORDER', () => {
		const action = {
			type: UPDATE_ROTA_EMPLOYEES_ORDER,
			rotaEmployees: mockRotaEmployees,
		};

		expect(rotaEmployeesReducer(mockRotaEmployees, action)).toEqual(mockRotaEmployees);
	});
});
