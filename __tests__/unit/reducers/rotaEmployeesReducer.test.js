import rotaEmployeesReducer from '../../../src/assets/js/reducers/rotaEmployeesReducer';

import { GET_ROTA_EMPLOYEES, UPDATE_ROTA_EMPLOYEES_ORDER } from '../../../src/assets/js/actions/actionTypes';

const findEmployee = (employees, employeeId) => (employees.length ? employees.find(employee => employee.accountEmployeeId === employeeId) : null);

describe('Rota Employees Reducer', () => {
	let mockEmployees;

	beforeEach(() => {
		mockEmployees = [{
			accountEmployeeId: 1,
		}];
	});

	it('should return the initial state', () => expect(rotaEmployeesReducer(undefined, [])).toEqual([]));

	it('should handle GET_ROTA_EMPLOYEES', () => {
		const action = {
			type: GET_ROTA_EMPLOYEES,
			employees: mockEmployees,
		};

		expect(rotaEmployeesReducer(mockEmployees, action)).toEqual(mockEmployees);
	});

	it('should handle UPDATE_ROTA_EMPLOYEES_ORDER', () => {
		const action = {
			type: UPDATE_ROTA_EMPLOYEES_ORDER,
			employees: mockEmployees,
		};

		expect(rotaEmployeesReducer(mockEmployees, action)).toEqual(mockEmployees);
	});
});
