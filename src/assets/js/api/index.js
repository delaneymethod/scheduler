import axios from 'axios';
import jwtDecode from 'jwt-decode';

import formatError from '../helpers/errors';

import constants from '../helpers/constants';

import { getState } from '../store/persistedState';

let axiosCall = null;

const { CancelToken } = axios;

const requestHeaders = () => ({
	'Cache-Control': 'no-cache',
	'Content-Type': 'application/json',
});

/* Cancellable request */
const request = (method, url, expectedStatus = 200, data = null) => {
	if (axiosCall) {
		axiosCall.cancel();
	}

	axiosCall = CancelToken.source();

	const headers = requestHeaders();

	const config = {
		url,
		method,
		headers,
		data,
		cancelToken: axiosCall.token,
		validateStatus: status => status === expectedStatus,
	};

	const user = getState('user');

	if (user) {
		if (user.token) {
			axios.defaults.headers.common.Authorization = `Bearer ${user.token}`;
		}

		if (user.account) {
			axios.defaults.headers.common['X-Account-Id'] = user.account.id;
		}
	}

	axios.defaults.baseURL = constants.API.HOST;

	return axios.request(config)
		.then(response => response.data)
		.catch((thrown) => {
			if (axios.isCancel(thrown)) {
				return null;
			}

			/* Bubble the error back up the rabbit hole */
			const error = formatError(thrown);

			return Promise.reject(error);
		});
};

/* LOGIN */
export const login = payload => request('POST', '/login', 200, payload);

/* REGISTER */
export const register = payload => request('POST', '/business-sign-up', 200, payload);

/* FORGOTTEN YOUR PASSWORD */
export const forgottenYourPassword = payload => request('POST', '/forgotten-your-password', 200, payload);

/* EMPLOYEES */
export const getEmployees = () => request('GET', '/employees');

export const getEmployee = employee => request('GET', `/employees/${employee.id}`);

export const createEmployee = employee => request('POST', '/employees', 201, employee);

export const updateEmployee = employee => request('PUT', `/employees/${employee.id}`, 200, employee);

export const deleteEmployee = employee => request('DELETE', `/employees/${employee.id}`, 204);

/* ACCOUNTS */
export const getAccounts = () => request('GET', '/accounts');

export const getAccount = account => request('GET', `/accounts/${account.id}`);

export const createAccount = account => request('POST', '/accounts', 201, account);

export const updateAccount = account => request('PUT', `/accounts/${account.id}`, 200, account);

export const deleteAccount = account => request('DELETE', `/accounts/${account.id}`, 204);

export const switchAccount = account => request('POST', '/accounts/switch', 200, account);

/* SHIFTS */
export const getShifts = () => request('GET', '/shifts');

export const getShift = shift => request('GET', `/shifts/${shift.id}`);

export const createShift = shift => request('POST', '/shifts', 201, shift);

export const updateShift = shift => request('PUT', `/shifts/${shift.id}`, 200, shift);

export const deleteShift = shift => request('DELETE', `/shifts/${shift.id}`, 204);

/* ROTAS */
export const getRotas = () => request('GET', '/rotas');

export const getRota = rota => request('GET', `/rotas/${rota.id}`);

export const getRotasByType = rotaType => request('GET', `/rotas/type/${rotaType.id}`);

export const createRota = rota => request('POST', '/rotas', 201, rota);

export const updateRota = rota => request('PUT', `/rotas/${rota.id}`, 200, rota);

export const deleteRota = rota => request('DELETE', `/rotas/${rota.id}`, 204);

/* ROTA TYPES */
export const getRotaTypes = () => request('GET', '/rota-types');

export const getRotaType = rotaType => request('GET', `/rota-types/${rotaType.id}`);

export const createRotaType = rotaType => request('POST', '/rota-types', 201, rotaType);

export const updateRotaType = rotaType => request('PUT', `/rota-types/${rotaType.id}`, 200, rotaType);

export const deleteRotaType = rotaType => request('DELETE', `/rota-types/${rotaType.id}`, 204);

/* PLACEMENTS */
export const getPlacements = () => request('GET', '/placements');

export const getPlacement = placement => request('GET', `/placements/${placement.id}`);

export const createPlacement = placement => request('POST', '/placements', 201, placement);

export const updatePlacement = placement => request('PUT', `/placements/${placement.id}`, 200, placement);

export const deletePlacement = placement => request('DELETE', `/placements/${placement.id}`, 204);
