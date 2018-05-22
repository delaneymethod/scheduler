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
			subscriptionLevel: 1,
			businessName: 'Gig Grafter',
			password: 'passwordMustBe10',
			email: 'barry.lynch@giggrafter.com',
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

	it('should get employees', () => {
		mock.onGet('/employees').reply(200, {
			employees: [],
		});

		return api.getEmployees().then(data => expect(data.employees).toEqual([]));
	});

	it('should get employee', () => {
		mock.onGet('/employees/3').reply(200, {
			employees: [{
				id: 3,
			}],
		});

		const payload = {
			id: 3,
		};

		return api.getEmployee(payload).then(data => expect(data.employees[0].id).toEqual(3));
	});

	it('should create employee', () => {
		mock.onPost('/employees').reply(201, {
			employees: [{
				id: 4,
				lastName: 'Lynch',
				firstName: 'Ciaran',
				email: 'ciaran.lynch@giggrafter.com',
			}],
		});

		const payload = {
			id: 4,
			lastName: 'Lynch',
			firstName: 'Ciaran',
			email: 'ciaran.lynch@giggrafter.com',
		};

		return api.createEmployee(payload).then(data => expect(data.employees[0].lastName).toEqual('Lynch'));
	});

	it('should update employee', () => {
		mock.onPut('/employees/2').reply(200, {
			employees: [{
				id: 2,
				firstName: 'Barry',
			}],
		});

		const payload = {
			id: 2,
			firstName: 'Barry',
		};

		return api.updateEmployee(payload).then(data => expect(data.employees[0].firstName).toEqual('Barry'));
	});

	it('should delete employee', () => {
		mock.onDelete('/employees/1').reply(204, {
			deleted: true,
		});

		const payload = {
			id: 1,
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
				id: 2,
			}],
		});

		const payload = {
			id: 2,
		};

		return api.getAccount(payload).then(data => expect(data.accounts[0].id).toEqual(2));
	});

	it('should create account', () => {
		mock.onPost('/accounts').reply(201, {
			accounts: [{
				id: 4,
				account_name: 'Gig Grafter',
			}],
		});

		const payload = {
			id: 4,
			account_name: 'Gig Grafter',
		};

		return api.createAccount(payload).then(data => expect(data.accounts[0].account_name).toEqual('Gig Grafter'));
	});

	it('should update account', () => {
		mock.onPut('/accounts/2').reply(200, {
			accounts: [{
				id: 2,
				account_name: 'Gig Grafter',
			}],
		});

		const payload = {
			id: 2,
			account_name: 'Gig Grafter',
		};

		return api.updateAccount(payload).then(data => expect(data.accounts[0].account_name).toEqual('Gig Grafter'));
	});

	it('should delete account', () => {
		mock.onDelete('/accounts/1').reply(204, {
			deleted: true,
		});

		const payload = {
			id: 1,
		};

		return api.deleteAccount(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should switch account', () => {
		mock.onPost('/accounts/switch').reply(200, {
			accounts: [],
		});

		const payload = {
			id: 1,
		};

		return api.switchAccount(payload).then(data => expect(data.accounts).toEqual([]));
	});

	it('should get shifts', () => {
		mock.onGet('/shifts').reply(200, {
			shifts: [],
		});

		return api.getShifts().then(data => expect(data.shifts).toEqual([]));
	});

	it('should get shift', () => {
		mock.onGet('/shifts/3').reply(200, {
			shifts: [{
				id: 3,
			}],
		});

		const payload = {
			id: 3,
		};

		return api.getShift(payload).then(data => expect(data.shifts[0].id).toEqual(3));
	});

	it('should create shift', () => {
		mock.onPost('/shifts').reply(201, {
			shifts: [{
				id: 4,
				account_id: 1,
			}],
		});

		const payload = {
			id: 4,
			account_id: 1,
		};

		return api.createShift(payload).then(data => expect(data.shifts[0].account_id).toEqual(1));
	});

	it('should update shift', () => {
		mock.onPut('/shifts/2').reply(200, {
			shifts: [{
				id: 2,
				rota_id: 1,
			}],
		});

		const payload = {
			id: 2,
			rota_id: 1,
		};

		return api.updateShift(payload).then(data => expect(data.shifts[0].rota_id).toEqual(1));
	});

	it('should delete shift', () => {
		mock.onDelete('/shifts/1').reply(204, {
			deleted: true,
		});

		const payload = {
			id: 1,
		};

		return api.deleteShift(payload).then(data => expect(data.deleted).toBe(true));
	});

	it('should get rotas', () => {
		mock.onGet('/rotas').reply(200, {
			rotas: [],
		});

		return api.getRotas().then(data => expect(data.rotas).toEqual([]));
	});

	it('should get rotas by type', () => {
		mock.onGet('/rotas/type/1').reply(200, {
			rotas: [],
		});

		const payload = {
			id: 1,
		};

		return api.getRotasByType(payload).then(data => expect(data.rotas).toEqual([]));
	});

	it('should get rota', () => {
		mock.onGet('/rotas/4').reply(200, {
			rotas: [{
				id: 4,
			}],
		});

		const payload = {
			id: 4,
		};

		return api.getRota(payload).then(data => expect(data.rotas[0].id).toEqual(4));
	});

	it('should create rota', () => {
		mock.onPost('/rotas').reply(201, {
			rotas: [{
				id: 4,
				account_id: 2,
				rota_type_id: 1,
			}],
		});

		const payload = {
			id: 4,
			account_id: 2,
			rota_type_id: 1,
		};

		return api.createRota(payload).then(data => expect(data.rotas[0].account_id).toEqual(2));
	});

	it('should update rota', () => {
		mock.onPut('/rotas/2').reply(200, {
			rotas: [{
				id: 2,
				rota_type_id: 1,
			}],
		});

		const payload = {
			id: 2,
			rota_type_id: 1,
		};

		return api.updateRota(payload).then(data => expect(data.rotas[0].rota_type_id).toEqual(1));
	});

	it('should delete rota', () => {
		mock.onDelete('/rotas/1').reply(204, {
			deleted: true,
		});

		const payload = {
			id: 1,
		};

		return api.deleteRota(payload).then(data => expect(data.deleted).toBe(true));
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
				id: 5,
			}],
		});

		const payload = {
			id: 5,
		};

		return api.getRotaType(payload).then(data => expect(data.rotaTypes[0].id).toEqual(5));
	});

	it('should create rota type', () => {
		mock.onPost('/rota-types').reply(201, {
			rotaTypes: [{
				id: 4,
				account_id: 2,
				rota_type_name: 'Bar1',
			}],
		});

		const payload = {
			id: 4,
			account_id: 2,
			rota_type_name: 'Bar1',
		};

		return api.createRotaType(payload).then(data => expect(data.rotaTypes[0].account_id).toEqual(2));
	});

	it('should update rota type', () => {
		mock.onPut('/rota-types/2').reply(200, {
			rotaTypes: [{
				id: 2,
				rota_type_name: 'Bar2',
			}],
		});

		const payload = {
			id: 2,
			rota_type_name: 'Bar2',
		};

		return api.updateRotaType(payload).then(data => expect(data.rotaTypes[0].rota_type_name).toEqual('Bar2'));
	});

	it('should delete rota type', () => {
		mock.onDelete('/rota-types/1').reply(204, {
			deleted: true,
		});

		const payload = {
			id: 1,
		};

		return api.deleteRotaType(payload).then(data => expect(data.deleted).toBe(true));
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
				id: 1,
			}],
		});

		const payload = {
			id: 1,
		};

		return api.getPlacement(payload).then(data => expect(data.placements[0].id).toEqual(1));
	});

	it('should create placement', () => {
		mock.onPost('/placements').reply(201, {
			placements: [{
				id: 4,
				cost: 50,
				shift_id: 1,
				account_id: 2,
				employee_id: 2,
			}],
		});

		const payload = {
			id: 4,
			cost: 50,
			shift_id: 1,
			account_id: 2,
			employee_id: 2,
		};

		return api.createPlacement(payload).then(data => expect(data.placements[0].account_id).toEqual(2));
	});

	it('should update placement', () => {
		mock.onPut('/placements/2').reply(200, {
			placements: [{
				id: 2,
				cost: 100,
			}],
		});

		const payload = {
			id: 2,
			cost: 100,
		};

		return api.updatePlacement(payload).then(data => expect(data.placements[0].cost).toEqual(100));
	});

	it('should delete placement', () => {
		mock.onDelete('/placements/1').reply(204, {
			deleted: true,
		});

		const payload = {
			id: 1,
		};

		return api.deletePlacement(payload).then(data => expect(data.deleted).toBe(true));
	});
});
