import employeesReducer from '../../../src/assets/js/reducers/employeesReducer';

import { GET_EMPLOYEE, GET_EMPLOYEES, CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE, ORDER_EMPLOYEES } from '../../../src/assets/js/actions/actionTypes';

const findEmployee = (employees, id) => (employees.length ? employees.find(employee => employee.id === id) : null);

describe('Employees Reducer', () => {
	let mockEmployees;

	beforeEach(() => {
		mockEmployees = [{
			employee: {
				id: 2,
				email: 'barry.lynch@giggrafter.com',
				first_name: 'Barry',
				surname: 'Lynch',
				created_date: '2018-04-18 15:53:18',
				last_updated: '2018-04-18 15:53:18',
			},
		}];
	});

	it('should return the initial state', () => expect(employeesReducer(undefined, [])).toEqual([]));

	it('should handle GET_EMPLOYEE', () => {
		const mockEmployee = mockEmployees[0].employee;

		const action = {
			type: GET_EMPLOYEE,
			employee: mockEmployee,
		};

		const employees = employeesReducer(mockEmployees, action);

		const employee = findEmployee(employees, mockEmployee.id);

		expect(employee).toEqual(mockEmployee);
	});

	it('should handle GET_EMPLOYEES', () => {
		const action = {
			type: GET_EMPLOYEES,
			employees: mockEmployees,
		};

		expect(employeesReducer(mockEmployees, action)).toEqual(mockEmployees);
	});

	it('should handle ORDER_EMPLOYEES', () => {
		const action = {
			type: ORDER_EMPLOYEES,
			employees: mockEmployees,
		};

		expect(employeesReducer(mockEmployees, action)).toEqual(mockEmployees);
	});

	it('should handle CREATE_EMPLOYEE', () => {
		const mockEmployee = {
			employee: {
				id: 3,
				email: 'hello@delaneymethod.com',
				first_name: 'Sean',
				surname: 'Delaney',
				created_date: '2018-04-18 15:53:18',
				last_updated: '2018-04-18 15:53:18',
			},
		};

		const action = {
			type: CREATE_EMPLOYEE,
			employee: mockEmployee,
		};

		const employees = employeesReducer(mockEmployees, action);

		expect(employees.length).toEqual(2);
	});

	it('should handle UPDATE_EMPLOYEE', () => {
		const mockEmployee = mockEmployees[0];

		mockEmployee.last_updated = '2018-05-16 16:40:32';

		const action = {
			type: UPDATE_EMPLOYEE,
			employee: mockEmployee,
		};

		const employees = employeesReducer(mockEmployees, action);

		const employee = findEmployee(employees, mockEmployee.id);

		expect(employee.last_updated).toEqual(mockEmployee.last_updated);
	});

	it('should handle DELETE_EMPLOYEE', () => {
		const mockEmployee = mockEmployees[0];

		const action = {
			type: DELETE_EMPLOYEE,
			employee: mockEmployee,
		};

		const employees = employeesReducer(mockEmployees, action);

		expect(employees.length).toEqual(0);
	});
});
