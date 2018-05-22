import accountsReducer from '../../../src/assets/js/reducers/accountsReducer';

import { GET_ACCOUNT, GET_ACCOUNTS, CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from '../../../src/assets/js/actions/actionTypes';

const findAccount = (accounts, id) => (accounts.length ? accounts.find(account => account.id === id) : null);

describe('Accounts Reducer', () => {
	let mockAccounts;

	beforeEach(() => {
		mockAccounts = [{
			id: 2,
			account_name: 'Barry\'s business',
			subscription_level_id: 1,
			created_date: '2018-04-18 15:53:18',
			last_updated: '2018-04-18 15:53:18',
		}];
	});

	it('should return the initial state', () => expect(accountsReducer(undefined, {})).toEqual([]));

	it('should handle GET_ACCOUNT', () => {
		const mockAccount = mockAccounts[0];

		const action = {
			type: GET_ACCOUNT,
			account: mockAccount,
		};

		const accounts = accountsReducer(mockAccounts, action);

		const account = findAccount(accounts, mockAccount.id);

		expect(account).toEqual(mockAccount);
	});

	it('should handle GET_ACCOUNTS', () => {
		const action = {
			type: GET_ACCOUNTS,
			accounts: mockAccounts,
		};

		expect(accountsReducer(mockAccounts, action)).toEqual(mockAccounts);
	});

	it('should handle CREATE_ACCOUNT', () => {
		const mockAccount = {
			id: 3,
			account_name: 'DelaneyMethod',
			subscription_level_id: 1,
			created_date: '2018-04-18 15:53:18',
			last_updated: '2018-04-18 15:53:18',
		};

		const action = {
			type: CREATE_ACCOUNT,
			account: mockAccount,
		};

		const accounts = accountsReducer(mockAccounts, action);

		expect(accounts.length).toEqual(2);
	});

	it('should handle UPDATE_ACCOUNT', () => {
		const mockAccount = mockAccounts[0];

		mockAccount.last_updated = '2018-05-16 16:40:32';

		const action = {
			type: UPDATE_ACCOUNT,
			account: mockAccount,
		};

		const accounts = accountsReducer(mockAccounts, action);

		const account = findAccount(accounts, mockAccount.id);

		expect(account.last_updated).toEqual(mockAccount.last_updated);
	});

	it('should handle DELETE_ACCOUNT', () => {
		const mockAccount = mockAccounts[0];

		const action = {
			type: DELETE_ACCOUNT,
			account: mockAccount,
		};

		const accounts = accountsReducer(mockAccounts, action);

		expect(accounts.length).toEqual(0);
	});
});
