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
				message: '<p>undefined</p>',
				title: 'undefined undefined',
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
		mock.onPost('/forgotten-your-password').reply(200, {
			emailSent: true,
		});

		const payload = {
			email: 'barry.lynch@giggrafter.com',
		};

		return api.forgottenYourPassword(payload).then(data => expect(data.emailSent).toEqual(true));
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

	it('should switch account', () => {
		mock.onPost('/accounts/switch').reply(200, {
			accounts: [],
		});

		const payload = {
			accountId: 1,
		};

		return api.switchAccount(payload).then(data => expect(data.accounts).toEqual([]));
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

	it('should get shifts', () => {
		mock.onGet('/shifts?rotaId=1').reply(200, {
			shifts: [],
		});

		const payload = {
			rotaId: '1',
		};

		return api.getShifts(payload).then(data => expect(data.shifts).toEqual([]));
	});

	it('should copy shifts', () => {
		mock.onGet('/rotas/1/copy-shifts').reply(200, {
			rota: {},
		});

		const payload = {
			rotaId: '1',
		};

		return api.copyShifts(payload).then(data => expect(data.rota).toEqual({})).catch(data => console.log(data));
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
});
