/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import axios from 'axios';

const { CancelToken } = axios;

class SchedulerApi {
	constructor() {
		this.axiosCall = null;
	}

	static requestHeaders() {
		return {
			'Content-Type': 'application/json',
		};
	}

	/* TODO: Trigger a popup dialog or model window */
	/* eslint-disable no-console */
	static reportError(error) {
		if (error && error.message !== undefined) {
			/* Something happened in setting up the request that triggered an Error */
			console.error(error.message);
		} else if (error && error.response) {
			/* The request was made and the server responded with a status code that falls out of the range of 2xx */
			console.error(error.response.data);
			console.error(error.response.status);
			console.error(error.response.headers);
		} else if (error && error.request) {
			/* The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser */
			console.error(error.request);
		}
	}
	/* eslint-enable no-console */

	/* Cancellable request */
	static axiosRequest() {
		return (method, url, expectedStatus = 200, data = null) => {
			if (this.axiosCall) {
				this.axiosCall.cancel();
			}

			this.axiosCall = CancelToken.source();

			const headers = this.requestHeaders();

			const config = {
				url,
				method,
				headers,
				data,
				validateStatus: status => status === expectedStatus,
			};

			const cancelable = {
				cancelToken: this.axiosCall.token,
			};

			return axios.request(config, cancelable)
				.then(response => response.data)
				.catch((thrown) => {
					if (axios.isCancel(thrown)) {
						/* Duplicate request cancelled */
						return null;
					}

					/* Prints the error in the console */
					this.reportError(thrown);

					/* Bubble the error back up the rabbit hole */
					return Promise.reject(thrown);
				});
		};
	}

	/* AUTHENTICATE */
	static login(credentials) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(credentials);

		return axiosRequest('POST', `${process.env.API_HOST}/authenticate`, 200, data);
	}

	static refresh(token) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(token);

		return axiosRequest('POST', `${process.env.API_HOST}/authenticate/refresh`, 200, data);
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

	static getUserByType(userType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/users/type/${userType.id}`);
	}

	static getUserByRole(userRole) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/users/role/${userRole.id}`);
	}

	static createUser(user) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(user);

		return axiosRequest('POST', `${process.env.API_HOST}/users`, 201, data);
	}

	static updateUser(user) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(user);

		return axiosRequest('PUT', `${process.env.API_HOST}/users/${user.id}`, 204, data);
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

		const data = JSON.stringify(userType);

		return axiosRequest('POST', `${process.env.API_HOST}/user-types`, 201, data);
	}

	static updateUserType(userType) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(userType);

		return axiosRequest('PUT', `${process.env.API_HOST}/user-types/${userType.id}`, 204, data);
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

		const data = JSON.stringify(userRole);

		return axiosRequest('POST', `${process.env.API_HOST}/user-roles`, 201, data);
	}

	static updateUserRole(userRole) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(userRole);

		return axiosRequest('PUT', `${process.env.API_HOST}/user-roles/${userRole.id}`, 204, data);
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

		const data = JSON.stringify(company);

		return axiosRequest('POST', `${process.env.API_HOST}/companies`, 201, data);
	}

	static updateCompany(company) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(company);

		return axiosRequest('PUT', `${process.env.API_HOST}/companies/${company.id}`, 204, data);
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

		const data = JSON.stringify(shift);

		return axiosRequest('POST', `${process.env.API_HOST}/shifts`, 201, data);
	}

	static updateShift(shift) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(shift);

		return axiosRequest('PUT', `${process.env.API_HOST}/shifts/${shift.id}`, 204, data);
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

	static getRotaByType(rotaType) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/rotas/type/${rotaType.id}`);
	}

	static createRota(rota) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(rota);

		return axiosRequest('POST', `${process.env.API_HOST}/rotas`, 201, data);
	}

	static updateRota(rota) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(rota);

		return axiosRequest('PUT', `${process.env.API_HOST}/rotas/${rota.id}`, 204, data);
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

		const data = JSON.stringify(rotaType);

		return axiosRequest('POST', `${process.env.API_HOST}/rota-types`, 201, data);
	}

	static updateRotaType(rotaType) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(rotaType);

		return axiosRequest('PUT', `${process.env.API_HOST}/rota-types/${rotaType.id}`, 204, data);
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

		const data = JSON.stringify(placement);

		return axiosRequest('POST', `${process.env.API_HOST}/placements`, 201, data);
	}

	static updatePlacement(placement) {
		const axiosRequest = this.axiosRequest();

		const data = JSON.stringify(placement);

		return axiosRequest('PUT', `${process.env.API_HOST}/placements/${placement.id}`, 204, data);
	}

	static deletePlacement(placement) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/placements/${placement.id}`, 204);
	}
}

export default SchedulerApi;
