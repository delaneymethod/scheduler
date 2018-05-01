/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import axios from 'axios';
import jwtDecode from 'jwt-decode';

import { getState } from '../store/persistedState';

const { CancelToken } = axios;

let axiosCall = null;

class SchedulerApi {
	static requestHeaders() {
		return {
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
		};
	}

	static parseError(error) {
		const data = {
			title: '',
			message: '',
		};

		if (error.response) {
			/* The request was made and the server responded with a status code that falls out of the range of 2xx */
			if (error.response.data) {
				data.title = `${error.response.data.error.code} ${error.response.data.error.type}`;
				data.message = `${error.response.data.error.message}.<br />${error.response.data.error.hints.summary}.`;
			} else {
				data.title = `${error.response.code} ${error.response.name}`;
				data.message = error.response.message;
			}
		} else if (error.request) {
			/* The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser */
			if (error.message === 'Network Error') {
				data.title = '504 Network Error';
				data.message = 'A network error occurred. Please try again.';
			} else {
				data.title = error.name;
				data.message = error.message;
			}
		} else {
			/* Something else happened in setting up the request that triggered an Error */
			data.title = 'Error';
			data.message = error.message;
		}

		return {
			data,
		};
	}

	/* Cancellable request */
	static axiosRequest() {
		return (method, url, expectedStatus = 200, data = null) => {
			if (axiosCall) {
				axiosCall.cancel();
			}

			axiosCall = CancelToken.source();

			const headers = this.requestHeaders();

			const config = {
				url,
				method,
				headers,
				data,
				validateStatus: status => status === expectedStatus,
			};

			const cancelable = {
				cancelToken: axiosCall.token,
			};

			const token = getState('token');

			/* Check if the object is not "falsey" (if the object is undefined, 0 or null) */
			if (token) {
				axios.defaults.headers.common.Authorization = `Bearer ${token}`;
			}

			const user = getState('user');

			/* Check if the object is not "falsey" (if the object is undefined, 0 or null) */
			if (user) {
				if (user.accountId) {
					axios.defaults.headers.common['X-Account-Id'] = user.accountId;
				}
			}

			const csrf = document.head.querySelector('meta[name="csrf-token"]');

			/* Check if the object is not "falsey" (if the object is undefined, 0 or null) */
			if (csrf) {
				axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf.content;
			}

			return axios.request(config, cancelable)
				.then(response => response.data)
				.catch((thrown) => {
					if (axios.isCancel(thrown)) {
						/* Duplicate request cancelled */
						return null;
					}

					const error = this.parseError(thrown);

					/* Bubble the error back up the rabbit hole */
					return Promise.reject(error);
				});
		};
	}

	/* AUTHENTICATE */
	static login(credentials) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/login`, 200, credentials);
	}

	/* REGISTER */
	static register(business) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/business-sign-up`, 200, business);
	}

	/* USERS */
	static getUsers() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/users`);
	}

	static getUser(user) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/users/${user.id}`);
	}

	static getUsersByType(userType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/users/type/${userType.id}`);
	}

	static getUsersByRole(userRole) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/users/role/${userRole.id}`);
	}

	static createUser(user) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/users`, 201, user);
	}

	static updateUser(user) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/users/${user.id}`, 204, user);
	}

	static deleteUser(user) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/users/${user.id}`, 204);
	}

	/* USER TYPES */
	static getUserTypes() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/user-types`);
	}

	static getUserType(userType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/user-types/${userType.id}`);
	}

	static createUserType(userType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/user-types`, 201, userType);
	}

	static updateUserType(userType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/user-types/${userType.id}`, 204, userType);
	}

	static deleteUserType(userType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/user-types/${userType.id}`, 204);
	}

	/* USER ROLES */
	static getUserRoles() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/user-roles`);
	}

	static getUserRole(userRole) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/user-roles/${userRole.id}`);
	}

	static createUserRole(userRole) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/user-roles`, 201, userRole);
	}

	static updateUserRole(userRole) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/user-roles/${userRole.id}`, 204, userRole);
	}

	static deleteUserRole(userRole) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/user-roles/${userRole.id}`, 204);
	}

	/* COMPANIES */
	static getCompanies() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/companies`);
	}

	static getCompany(company) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/companies/${company.id}`);
	}

	static createCompany(company) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/companies`, 201, company);
	}

	static updateCompany(company) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/companies/${company.id}`, 204, company);
	}

	static deleteCompany(company) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/companies/${company.id}`, 204);
	}

	/* SHIFTS */
	static getShifts() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/shifts`);
	}

	static getShift(shift) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/shifts/${shift.id}`);
	}

	static createShift(shift) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/shifts`, 201, shift);
	}

	static updateShift(shift) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/shifts/${shift.id}`, 204, shift);
	}

	static deleteShift(shift) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/shifts/${shift.id}`, 204);
	}

	/* ROTAS */
	static getRotas() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/rotas`);
	}

	static getRota(rota) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/rotas/${rota.id}`);
	}

	static getRotasByType(rotaType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/rotas/type/${rotaType.id}`);
	}

	static createRota(rota) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/rotas`, 201, rota);
	}

	static updateRota(rota) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/rotas/${rota.id}`, 204, rota);
	}

	static deleteRota(rota) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/rotas/${rota.id}`, 204);
	}

	/* ROTA TYPES */
	static getRotaTypes() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/rota-types`);
	}

	static getRotaType(rotaType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/rota-types/${rotaType.id}`);
	}

	static createRotaType(rotaType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/rota-types`, 201, rotaType);
	}

	static updateRotaType(rotaType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/rota-types/${rotaType.id}`, 204, rotaType);
	}

	static deleteRotaType(rotaType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/rota-types/${rotaType.id}`, 204);
	}

	/* PLACEMENTS */
	static getPlacements() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/placements`);
	}

	static getPlacement(placement) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/placements/${placement.id}`);
	}

	static createPlacement(placement) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/placements`, 201, placement);
	}

	static updatePlacement(placement) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/placements/${placement.id}`, 204, placement);
	}

	static deletePlacement(placement) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/placements/${placement.id}`, 204);
	}
}

export default SchedulerApi;
