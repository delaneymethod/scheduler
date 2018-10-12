import axios from 'axios';
import jwtDecode from 'jwt-decode';

import formatError from '../helpers/errors';

import config from '../helpers/config';

import { getState } from '../store/persistedState';

/*
const axiosCall = null;

const { CancelToken } = axios;
*/

const requestHeaders = () => ({
	'Cache-Control': 'no-cache',
	'Content-Type': 'application/json',
});

/* Cancellable request */
const request = (method, url, expectedStatus = 200, payload = null) => {
	/*
	if (axiosCall) {
		axiosCall.cancel();
	}

	axiosCall = CancelToken.source();
	*/

	let data = payload;

	/* If we are uploading a file, we need to use FormData() to attach the file and set the correct content type */
	if (typeof data !== 'undefined' && data !== null && typeof data.file !== 'undefined' && data.file !== null) {
		const { file } = data;

		data = new FormData();

		data.append('file', file);
	}

	const headers = requestHeaders();

	if (url.includes('pdf') || url.includes('excel')) {
		headers.Accept = 'application/vnd.ms-excel';
	}

	const axiosConfig = {
		url,
		data,
		method,
		headers,
		/* cancelToken: axiosCall.token, */
		validateStatus: status => status === expectedStatus,
		responseType: (url.includes('pdf') || url.includes('excel')) ? 'blob' : null,
	};

	const user = getState('user');

	if (user) {
		const { token, account } = user;

		if (token) {
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		}

		if (account) {
			axios.defaults.headers.common['X-Account-Id'] = account.id;
		}
	}

	axios.defaults.baseURL = (process.env.NODE_ENV === 'development') ? config.API.HOST.DEV : config.API.HOST.PROD;

	/* If the response is an array of data, the data array will be wrapped in a data attribute. Confusing I know! */
	return axios.request(axiosConfig)
		.then(response => ((response.data.data) ? response.data.data : response.data))
		.catch((thrown) => {
			/*
			if (axios.isCancel(thrown)) {
				return null;
			}
			*/

			/* Bubble the error back up the rabbit hole */
			const error = formatError(thrown);

			return Promise.reject(error);
		});
};

/* SERVICE UPDATES */
export const serviceUpdates = payload => request('POST', '/service-updates-sign-up', 200, payload);

/* LOGIN */
export const login = payload => request('POST', '/login', 200, payload);

/* REGISTER */
export const register = payload => request('POST', '/business-sign-up', 200, payload);

/* FORGOTTEN YOUR PASSWORD */
export const forgottenYourPassword = payload => request('POST', '/passwords/forgot', 200, payload);

/* RESET YOUR PASSWORD */
export const resetYourPassword = payload => request('POST', '/passwords/reset', 200, payload);

/* UPDATE YOUR PASSWORD */
export const updateYourPassword = payload => request('PUT', `/passwords/${payload.token}`, 200, payload);

/* SUBSCRIPTION LEVELS */
export const getSubscriptionLevels = () => request('GET', '/subscription-levels');

/* EMPLOYEES */
export const getEmployees = () => request('GET', '/employees');

export const orderEmployees = payload => request('PUT', `/employees/order?rotaTypeId=${payload.rotaTypeId}`, 200, payload);

export const uploadEmployees = employees => request('POST', '/employees/load', 200, employees);

export const getEmployee = employee => request('GET', `/employees/${employee.employeeId}`);

export const createEmployee = employee => request('POST', '/employees', 201, employee);

export const updateEmployee = employee => request('PUT', `/employees/${employee.employeeId}`, 200, employee);

export const deleteEmployee = employee => request('DELETE', `/employees/${employee.employeeId}`, 204);

/* ACCOUNTS */
export const getAccounts = () => request('GET', '/accounts');

export const getAccount = account => request('GET', `/accounts/${account.accountId}`);

export const createAccount = account => request('POST', '/accounts', 201, account);

export const updateAccount = account => request('PUT', `/accounts/${account.accountId}`, 200, account);

export const deleteAccount = account => request('DELETE', `/accounts/${account.accountId}`, 204);

/* SHIFTS */
export const getShifts = rota => request('GET', `/shifts?rotaId=${rota.rotaId}`);

export const copyShifts = (fromRota, toRota, includePlacements) => request('POST', `/shifts/copy?fromRotaId=${fromRota.rotaId}&toRotaId=${toRota.rotaId}&includePlacements=${includePlacements}`, 201);

export const downloadShifts = (rota, format) => request('GET', `/shifts/download?format=${format}&rotaId=${rota.rotaId}`);

export const getShift = shift => request('GET', `/shifts/${shift.shiftId}`);

export const createShift = shift => request('POST', '/shifts', 201, shift);

export const updateShift = shift => request('PUT', `/shifts/${shift.shiftId}`, 200, shift);

export const deleteShift = shift => request('DELETE', `/shifts/${shift.shiftId}`, 204);

/* ROTAS */
export const getRotas = rotaType => request('GET', `/rotas?rotaTypeId=${rotaType.rotaTypeId}`);

export const getRota = rota => request('GET', `/rotas/${rota.rotaId}`);

export const createRota = rota => request('POST', '/rotas', 201, rota);

export const updateRota = rota => request('PUT', `/rotas/${rota.rotaId}`, 200, rota);

export const deleteRota = rota => request('DELETE', `/rotas/${rota.rotaId}`, 204);

export const publishRota = rota => request('POST', `/rotas/${rota.rotaId}/publish`, 201);

/* ROTA EMPLOYEES */

export const getRotaEmployees = rota => request('GET', `/rotas/${rota.rotaId}/employees`);

export const updateRotaEmployeesOrder = payload => request('PUT', `/rotas/${payload.rotaId}/employees/order`, 200, payload);

/* ROTA TYPES */
export const getRotaTypes = () => request('GET', '/rota-types');

export const getRotaType = rotaType => request('GET', `/rota-types/${rotaType.rotaTypeId}`);

export const createRotaType = rotaType => request('POST', '/rota-types', 201, rotaType);

export const updateRotaType = rotaType => request('PUT', `/rota-types/${rotaType.rotaTypeId}`, 200, rotaType);

export const deleteRotaType = rotaType => request('DELETE', `/rota-types/${rotaType.rotaTypeId}`, 204);

/* ROTA TYPE EMPLOYEES */

export const createRotaTypeEmployees = (rotaType, employees) => request('POST', `/rota-types/${rotaType.rotaTypeId}/employees`, 201, employees);

export const deleteRotaTypeEmployee = payload => request('DELETE', `/rota-types/${payload.rotaTypeId}/employees/${payload.accountEmployeeId}`, 204);

/* PLACEMENTS */
export const getPlacements = () => request('GET', '/placements');

export const getPlacement = placement => request('GET', `/placements/${placement.placementId}`);

export const createPlacement = placement => request('POST', '/placements', 201, placement);

export const updatePlacement = placement => request('PUT', `/placements/${placement.placementId}`, 200, placement);

export const deletePlacement = placement => request('DELETE', `/placements/${placement.placementId}`, 204);

/* ROLES */
export const getRoles = () => request('GET', '/roles');

export const getRole = role => request('GET', `/roles/${role.id}`);

export const createRole = role => request('POST', '/roles', 201, role);

export const updateRole = role => request('PUT', `/roles/${role.id}`, 200, role);

export const deleteRole = role => request('DELETE', `/roles/${role.id}`, 204);

/* UNAVAILABILITY */
export const getUnavailability = unavailability => request('GET', `/unavailabilities/${unavailability.unavailabilityId}`);

export const createUnavailability = unavailability => request('POST', '/unavailabilities', 201, unavailability);

export const updateUnavailability = unavailability => request('POST', `/unavailabilities/${unavailability.unavailabilityId}/update`, 200, unavailability);

export const deleteUnavailability = unavailability => request('DELETE', `/unavailabilities/${unavailability.unavailabilityId}`, 204);

/* UNAVAILABILITY OCCURRENCES */
export const getUnavailabilityOccurrences = payload => request('GET', `/unavailability-occurrences?fromDate=${payload.startDate}&toDate=${payload.endDate}`);

/* UNAVAILABILITY TYPES */
export const getUnavailabilityTypes = () => request('GET', '/unavailability-types');
