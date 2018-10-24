import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as api from '../../../src/assets/js/api';

const mock = new MockAdapter(axios);

const user = JSON.stringify({
	firstName: 'Barry',
	token: '1234567890',
	account: {
		id: 1,
		title: 'Account 1',
	},
	email: 'barry.lynch@giggrafter.com',
});

describe('API', () => {
	beforeEach(() => {
		sessionStorage.setItem('scheduler:user', user);
	});

	afterEach(() => {
		sessionStorage.removeItem('scheduler:user', user);

		mock.reset();
	});

	it('should use development API', () => {
		mock.onPost('/login').reply(200, {
			token: '1234567890',
		});

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		process.env.NODE_ENV = 'development';

		return api.login(payload).then(data => expect(data.token).toEqual('1234567890'));
	});

	it('should grab user state', () => {
		mock.onPost('/login').reply(200, {
			token: '1234567890',
		});

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		return api.login(payload).then(data => expect(data.token).toEqual('1234567890'));
	});

	it('should not grab user state', () => {
		mock.onPost('/login').reply(200, {});

		sessionStorage.removeItem('scheduler:user');

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		return api.login(payload).then(data => expect(data).toEqual({}));
	});

	it('should grab user state and token', () => {
		mock.onPost('/login').reply(200, {
			token: '1234567890',
		});

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		return api.login(payload).then(data => expect(data.token).toEqual('1234567890'));
	});

	it('should grab user state but not token', () => {
		mock.onPost('/login').reply(200, {});

		const userWithOutToken = JSON.stringify({
			firstName: 'Barry',
			account: {
				id: 1,
				title: 'Account 1',
			},
			email: 'barry.lynch@giggrafter.com',
		});

		sessionStorage.setItem('scheduler:user', userWithOutToken);

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		return api.login(payload).then(data => expect(data).toEqual({}));
	});

	it('should grab user state and account', () => {
		mock.onPost('/login').reply(200, {
			token: '1234567890',
		});

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		return api.login(payload).then(data => expect(data.token).toEqual('1234567890'));
	});

	it('should grab user state but not account', () => {
		mock.onPost('/login').reply(200, {});

		const userWithOutAccount = JSON.stringify({
			firstName: 'Barry',
			token: '1234567890',
			email: 'barry.lynch@giggrafter.com',
		});

		sessionStorage.setItem('scheduler:user', userWithOutAccount);

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		return api.login(payload).then(data => expect(data).toEqual({}));
	});

	it('should return token on login', () => {
		mock.onPost('/login').reply(200, {
			token: '1234567890',
		});

		const payload = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		return api.login(payload).then(data => expect(data.token).toEqual('1234567890'));
	});

	it('should catch login errors', () => {
		mock.onPost('/login').reply(400);

		const expectedError = {
			data: {
				message: '<p><strong>The following error occurred:</strong></p><ul><li>undefined</li></ul>',
			},
		};

		return api.login({}).catch(error => expect(error).toEqual(expectedError));
	});

	it('should return email sent on register', () => {
		mock.onPost('/business-sign-up').reply(200, {
			emailSent: true,
		});

		const payload = {
			lastName: 'Lynch',
			firstName: 'Barry',
			businessName: 'Gig Grafter',
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
			subscriptionLevelId: '1eaf7eb7-4996-4b95-8593-8b18a6bff6b9',
		};

		return api.register(payload).then(data => expect(data.emailSent).toEqual(true));
	});

	it('should return email sent on forgotton your password', () => {
		mock.onPost('/passwords/forgot').reply(200, {
			emailSent: true,
		});

		const payload = {
			email: 'barry.lynch@giggrafter.com',
		};

		return api.forgottenYourPassword(payload).then(data => expect(data.emailSent).toEqual(true));
	});

	it('should return email sent on reset your password', () => {
		mock.onPost('/passwords/reset').reply(200, {
			emailSent: true,
		});

		const payload = {
			email: 'barry.lynch@giggrafter.com',
		};

		return api.resetYourPassword(payload).then(data => expect(data.emailSent).toEqual(true));
	});

	it('should return password updated on update your password', () => {
		mock.onPut('/passwords/1234567890').reply(200, {
			emailSent: true,
		});

		const payload = {
			token: '1234567890',
			email: 'barry.lynch@giggrafter.com',
		};

		return api.updateYourPassword(payload).then(data => expect(data.emailSent).toEqual(true));
	});

	/*
	it('should cancel duplicate requests', () => {
		mock.onPost('/login').reply(200, {});

		const payload1 = {
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
		};

		const payload2 = {
			password: 'passwordMustBe11',
			email: 'barry.lynch@giggrafter.com',
		};

		const payload3 = {
			password: 'passwordMustBe12',
			email: 'barry.lynch@giggrafter.com',
		};

		return Promise.all([
			api.login(payload1),
			api.login(payload2),
			api.login(payload3),
		]).then(([first, second, third]) => {
			expect(first).toBe(null);
			expect(second).toBe(null);
			expect(third).toEqual({});
		});
	});
	*/

	it('should subscribe to service updates', () => {
		mock.onPost('/service-updates-sign-up').reply(200, {
			emailSent: true,
		});

		const payload = {
			email: 'hello@giggrafter.com',
		};

		return api.serviceUpdates(payload).then(data => expect(data.emailSent).toEqual(true));
	});

	it('should get subscription levels', () => {
		mock.onGet('/subscription-levels').reply(200, {
			subscriptionLevels: [],
		});

		return api.getSubscriptionLevels().then(data => expect(data.subscriptionLevels).toEqual([]));
	});

	it('should get employees', () => {
		mock.onGet('/employees').reply(200, {
			employees: [],
		});

		return api.getEmployees().then(data => expect(data.employees).toEqual([]));
	});

	it('should order employees', () => {
		mock.onPut('/employees/order?rotaTypeId=1').reply(200, {
			employees: [],
		});

		const payload = {
			rotaTypeId: 1,
			objectIdList: ['3', '1', '2'],
		};

		return api.orderEmployees(payload).then(data => expect(data.employees).toEqual([]));
	});

	it('should upload employees', () => {
		mock.onPost('/employees/load').reply(200, {
			employees: [],
		});

		const payload = {
			file: 'filename.csv',
		};

		return api.uploadEmployees(payload).then(data => expect(data.employees).toEqual([]));
	});

	it('should get employee', () => {
		mock.onGet('/employees/3').reply(200, {
			employees: [{
				employee: {
					employeeId: 3,
				},
			}],
		});

		const payload = {
			employeeId: 3,
		};

		return api.getEmployee(payload).then(data => expect(data.employees[0].employee.employeeId).toEqual(3));
	});

	it('should create employee', () => {
		mock.onPost('/employees').reply(201, {
			employees: [{
				employee: {
					lastName: 'Lynch',
					firstName: 'Ciaran',
					email: 'ciaran.lynch@giggrafter.com',
				},
			}],
		});

		const payload = {
			lastName: 'Lynch',
			firstName: 'Ciaran',
			email: 'ciaran.lynch@giggrafter.com',
		};

		return api.createEmployee(payload).then(data => expect(data.employees[0].employee.lastName).toEqual('Lynch'));
	});

	it('should update employee', () => {
		mock.onPut('/employees/1').reply(200, {
			employees: [{
				employee: {
					employeeId: 1,
					firstName: 'Barry',
				},
			}],
		});

		const payload = {
			employeeId: 1,
			firstName: 'Barry',
		};

		return api.updateEmployee(payload).then(data => expect(data.employees[0].employee.firstName).toEqual('Barry'));
	});

	it('should delete employee', () => {
		mock.onDelete('/employees/1').reply(204, {
			deleted: true,
		});

		const payload = {
			employeeId: 1,
		};

		return api.deleteEmployee(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should get accounts', () => {
		mock.onGet('/accounts').reply(200, {
			accounts: [],
		});

		return api.getAccounts().then(data => expect(data.accounts).toEqual([]));
	});

	it('should get account', () => {
		mock.onGet('/accounts/2').reply(200, {
			accounts: [{
				accountId: 2,
			}],
		});

		const payload = {
			accountId: 2,
		};

		return api.getAccount(payload).then(data => expect(data.accounts[0].accountId).toEqual(2));
	});

	it('should create account', () => {
		mock.onPost('/accounts').reply(201, {
			accounts: [{
				accountName: 'Gig Grafter',
			}],
		});

		const payload = {
			accountName: 'Gig Grafter',
		};

		return api.createAccount(payload).then(data => expect(data.accounts[0].accountName).toEqual('Gig Grafter'));
	});

	it('should update account', () => {
		mock.onPut('/accounts/2').reply(200, {
			accounts: [{
				accountId: 2,
				accountName: 'Gig Grafter',
			}],
		});

		const payload = {
			accountId: 2,
			accountName: 'Gig Grafter',
		};

		return api.updateAccount(payload).then(data => expect(data.accounts[0].accountName).toEqual('Gig Grafter'));
	});

	it('should delete account', () => {
		mock.onDelete('/accounts/1').reply(204, {
			deleted: true,
		});

		const payload = {
			accountId: 1,
		};

		return api.deleteAccount(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should get rota types', () => {
		mock.onGet('/rota-types').reply(200, {
			rotaTypes: [],
		});

		return api.getRotaTypes().then(data => expect(data.rotaTypes).toEqual([]));
	});

	it('should get rota type', () => {
		mock.onGet('/rota-types/5').reply(200, {
			rotaTypes: [{
				rotaTypeId: 5,
			}],
		});

		const payload = {
			rotaTypeId: 5,
		};

		return api.getRotaType(payload).then(data => expect(data.rotaTypes[0].rotaTypeId).toEqual(5));
	});

	it('should create rota type', () => {
		mock.onPost('/rota-types').reply(201, {
			rotaTypes: [{
				rotaTypeId: 4,
				accountId: 2,
				rotaTypeName: 'Bar1',
			}],
		});

		const payload = {
			rotaTypeId: 4,
			accountId: 2,
			rotaTypeName: 'Bar1',
		};

		return api.createRotaType(payload).then(data => expect(data.rotaTypes[0].accountId).toEqual(2));
	});

	it('should update rota type', () => {
		mock.onPut('/rota-types/2').reply(200, {
			rotaTypes: [{
				rotaTypeId: 2,
				rotaTypeName: 'Bar2',
			}],
		});

		const payload = {
			rotaTypeId: 2,
			rotaTypeName: 'Bar2',
		};

		return api.updateRotaType(payload).then(data => expect(data.rotaTypes[0].rotaTypeName).toEqual('Bar2'));
	});

	it('should delete rota type', () => {
		mock.onDelete('/rota-types/1').reply(204, {
			deleted: true,
		});

		const payload = {
			rotaTypeId: 1,
		};

		return api.deleteRotaType(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should create rota type employees', () => {
		mock.onPost('/rota-types/4/employees').reply(201, {
			employees: [{
				accountEmployeeId: 1,
			}],
		});

		const payload = {
			rotaTypeId: 4,
			employees: ['1', '2', '3'],
		};

		return api.createRotaTypeEmployees(payload).then(data => expect(data.employees[0].accountEmployeeId).toEqual(1));
	});

	it('should delete rota type employee', () => {
		mock.onDelete('/rota-types/1/employees/2').reply(204, {
			deleted: true,
		});

		const payload = {
			rotaTypeId: 1,
			accountEmployeeId: 2,
		};

		return api.deleteRotaTypeEmployee(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should get rotas', () => {
		mock.onGet('/rotas?rotaTypeId=3').reply(200, {
			rotas: [],
		});

		const payload = {
			rotaTypeId: 3,
			rotaName: 'Bar',
		};

		return api.getRotas(payload).then(data => expect(data.rotas).toEqual([]));
	});

	it('should get rota', () => {
		mock.onGet('/rotas/4').reply(200, {
			rotas: [{
				rotaId: 4,
			}],
		});

		const payload = {
			rotaId: 4,
		};

		return api.getRota(payload).then(data => expect(data.rotas[0].rotaId).toEqual(4));
	});

	it('should get rota employees', () => {
		mock.onGet('/rotas/4/employees').reply(200, {
			employees: [{
				accountEmployeeId: 4,
			}],
		});

		const payload = {
			rotaId: 4,
		};

		return api.getRotaEmployees(payload).then(data => expect(data.employees[0].accountEmployeeId).toEqual(4));
	});

	it('should create rota', () => {
		mock.onPost('/rotas').reply(201, {
			rotas: [{
				rotaId: 4,
				accountId: 2,
				rotaTypeId: 1,
			}],
		});

		const payload = {
			rotaId: 4,
			accountId: 2,
			rotaTypeId: 1,
		};

		return api.createRota(payload).then(data => expect(data.rotas[0].accountId).toEqual(2));
	});

	it('should update rota', () => {
		mock.onPut('/rotas/2').reply(200, {
			rotas: [{
				rotaId: 2,
				rotaTypeId: 1,
			}],
		});

		const payload = {
			rotaId: 2,
			rotaTypeId: 1,
		};

		return api.updateRota(payload).then(data => expect(data.rotas[0].rotaTypeId).toEqual(1));
	});

	it('should delete rota', () => {
		mock.onDelete('/rotas/1').reply(204, {
			deleted: true,
		});

		const payload = {
			rotaId: 1,
		};

		return api.deleteRota(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should publish rota', () => {
		mock.onPost('/rotas/2/publish').reply(201, {
			rotas: [{
				rotaId: 2,
				rotaTypeId: 1,
			}],
		});

		const payload = {
			rotaId: 2,
		};

		return api.publishRota(payload).then(data => expect(data.rotas[0].rotaTypeId).toEqual(1));
	});

	it('should update rota employees order', () => {
		mock.onPut('/rotas/2/employees/order').reply(200, {
			employees: [],
		});

		const payload = {
			rotaId: 2,
			objectIdList: ['3', '1', '2'],
		};

		return api.updateRotaEmployeesOrder(payload).then(data => expect(data.employees).toEqual([]));
	});

	it('should get shifts', () => {
		mock.onGet('/shifts?rotaId=1').reply(200, {
			shifts: [],
		});

		const payload = {
			rotaId: 1,
		};

		return api.getShifts(payload).then(data => expect(data.shifts).toEqual([]));
	});

	it('should copy shifts', () => {
		mock.onPost('/shifts/copy?fromRotaId=2&toRotaId=3&includePlacements=true').reply(201, {
			rota: {},
		});

		const fromRota = {
			rotaId: 2,
		};

		const toRota = {
			rotaId: 3,
		};

		const includePlacements = true;

		return api.copyShifts(fromRota, toRota, includePlacements).then(data => expect(data.rota).toEqual({}));
	});

	it('should download shifts as PDF', () => {
		mock.onGet('/shifts/download?format=pdf&rotaId=1234').reply(200, {
			stream: {},
		});

		const rota = {
			rotaId: 1234,
		};

		const format = 'pdf';

		return api.downloadShifts(rota, format).then(data => expect(data.stream).toEqual({}));
	});

	it('should download shifts as Excel', () => {
		mock.onGet('/shifts/download?format=excel&rotaId=1234').reply(200, {
			stream: {},
		});

		const rota = {
			rotaId: 1234,
		};

		const format = 'excel';

		return api.downloadShifts(rota, format).then(data => expect(data.stream).toEqual({}));
	});

	it('should get shift', () => {
		mock.onGet('/shifts/3').reply(200, {
			shifts: [{
				shiftId: 3,
			}],
		});

		const payload = {
			shiftId: 3,
		};

		return api.getShift(payload).then(data => expect(data.shifts[0].shiftId).toEqual(3));
	});

	it('should create shift', () => {
		mock.onPost('/shifts').reply(201, {
			shifts: [{
				shiftId: 4,
				accountId: 1,
			}],
		});

		const payload = {
			shiftId: 4,
			accountId: 1,
		};

		return api.createShift(payload).then(data => expect(data.shifts[0].accountId).toEqual(1));
	});

	it('should update shift', () => {
		mock.onPut('/shifts/2').reply(200, {
			shifts: [{
				shiftId: 2,
				rotaId: 1,
			}],
		});

		const payload = {
			shiftId: 2,
			rotaId: 1,
		};

		return api.updateShift(payload).then(data => expect(data.shifts[0].rotaId).toEqual(1));
	});

	it('should delete shift', () => {
		mock.onDelete('/shifts/1').reply(204, {
			deleted: true,
		});

		const payload = {
			shiftId: 1,
		};

		return api.deleteShift(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should get placements', () => {
		mock.onGet('/placements').reply(200, {
			placements: [],
		});

		return api.getPlacements().then(data => expect(data.placements).toEqual([]));
	});

	it('should get placement', () => {
		mock.onGet('/placements/1').reply(200, {
			placements: [{
				placementId: 1,
			}],
		});

		const payload = {
			placementId: 1,
		};

		return api.getPlacement(payload).then(data => expect(data.placements[0].placementId).toEqual(1));
	});

	it('should create placement', () => {
		mock.onPost('/placements').reply(201, {
			placements: [{
				placementId: 4,
				cost: 50,
				shiftId: 1,
				accountId: 2,
				employeeId: 2,
			}],
		});

		const payload = {
			placementId: 4,
			cost: 50,
			shiftId: 1,
			accountId: 2,
			employeeId: 2,
		};

		return api.createPlacement(payload).then(data => expect(data.placements[0].accountId).toEqual(2));
	});

	it('should update placement', () => {
		mock.onPut('/placements/2').reply(200, {
			placements: [{
				placementId: 2,
				cost: 100,
			}],
		});

		const payload = {
			placementId: 2,
			cost: 100,
		};

		return api.updatePlacement(payload).then(data => expect(data.placements[0].cost).toEqual(100));
	});

	it('should delete placement', () => {
		mock.onDelete('/placements/1').reply(204, {
			deleted: true,
		});

		const payload = {
			placementId: 1,
		};

		return api.deletePlacement(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should get unavailabilities', () => {
		mock.onGet('/unavailabilities/1').reply(200, {
			unavailabilities: [],
		});

		const payload = {
			unavailabilityId: 1,
		};

		return api.getUnavailability(payload).then(data => expect(data.unavailabilities.length).toEqual(0));
	});

	it('should create unavailability', () => {
		mock.onPost('/unavailabilities').reply(201, {
			unavailabilities: [{
				unavailabilityId: 4,
				fullDay: true,
			}],
		});

		const payload = {
			unavailabilityId: 4,
			fullDay: true,
		};

		return api.createUnavailability(payload).then(data => expect(data.unavailabilities[0].fullDay).toEqual(true));
	});

	it('should update unavailability', () => {
		mock.onPost('/unavailabilities/2/update').reply(200, {
			unavailabilities: [],
		});

		const payload = {
			unavailabilityId: 2,
			fullDay: false,
		};

		return api.updateUnavailability(payload).then(data => expect(data.unavailabilities.length).toEqual(0));
	});

	it('should delete unavailability', () => {
		mock.onDelete('/unavailabilities/1').reply(204, {
			deleted: true,
		});

		const payload = {
			unavailabilityId: 1,
		};

		return api.deleteUnavailability(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should get unavailability occurrences', () => {
		mock.onGet('/unavailability-occurrences?fromDate=2018-09-10T00:00:00&toDate=2018-09-16T00:00:00').reply(200, {
			unavailabilityOccurrences: [],
		});

		const payload = {
			endDate: '2018-09-16T00:00:00',
			startDate: '2018-09-10T00:00:00',
		};

		return api.getUnavailabilityOccurrences(payload).then(data => expect(data.unavailabilityOccurrences).toEqual([]));
	});

	it('should get unavailability types', () => {
		mock.onGet('/unavailability-types').reply(200, {
			unavailabilityTypes: [],
		});

		return api.getUnavailabilityTypes().then(data => expect(data.unavailabilityTypes).toEqual([]));
	});
});
