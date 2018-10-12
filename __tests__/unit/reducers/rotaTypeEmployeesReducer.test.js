import rotaTypeEmployeesReducer from '../../../src/assets/js/reducers/rotaTypeEmployeesReducer';

import { CREATE_ROTA_TYPE_EMPLOYEES, DELETE_ROTA_TYPE_EMPLOYEE } from '../../../src/assets/js/actions/actionTypes';

const findEmployee = (employees, employeeId) => (employees.length ? employees.find(employee => employee.accountEmployeeId === employeeId) : null);

describe('Rota Type Employees Reducer', () => {
	let mockEmployees;

	beforeEach(() => {
		mockEmployees = [{
			accountEmployeeId: 1,
		}];
	});

	it('should return the initial state', () => expect(rotaTypeEmployeesReducer(undefined, [])).toEqual([]));

	it('should handle CREATE_ROTA_TYPE_EMPLOYEES', () => {
		const action = {
			type: CREATE_ROTA_TYPE_EMPLOYEES,
			employees: ['3'],
		};

		const employees = rotaTypeEmployeesReducer(mockEmployees, action);

		expect(employees.length).toEqual(2);
	});

	it('should handle DELETE_ROTA_TYPE_EMPLOYEE', () => {
		const mockEmployee = mockEmployees[0];

		const action = {
			type: DELETE_ROTA_TYPE_EMPLOYEE,
			rotaEmployee: mockEmployee,
		};

		const employees = rotaTypeEmployeesReducer(mockEmployees, action);

		expect(employees.length).toEqual(0);
	});
});
