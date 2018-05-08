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

				data.message = `<p>${error.response.data.error.message}.</p><p class="pb-0 mb-0">${error.response.data.error.hints.summary}.</p>`;
			} else {
				data.title = `${error.response.code} ${error.response.name}`;

				data.message = `<p>${error.response.message}.</p>`;
			}
		} else if (error.request) {
			/* The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser */
			if (error.message === 'Network Error') {
				data.title = '504 Network Error';

				data.message = '<p>A network error occurred. Please try again.</p>';
			} else {
				data.title = error.name;

				data.message = `<p>${error.message}.</p>`;
			}
		} else {
			/* Something else happened in setting up the request that triggered an Error */
			data.title = 'Error';

			data.message = `<p>${error.message}.</p>`;
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

			const user = getState('user');

			/* Check if the object is not "falsey" (if the object is undefined, 0 or null) */
			if (user) {
				if (user.token) {
					axios.defaults.headers.common.Authorization = `Bearer ${user.token}`;
				}

				if (user.account) {
					axios.defaults.headers.common['X-Account-Id'] = user.account.id;
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

					/* Bubble the error back up the rabbit hole */
					const error = this.parseError(thrown);

					return Promise.reject(error);
				});
		};
	}

	/* AUTHENTICATE */
	static login(payload) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/login`, 200, payload);
	}

	/* REGISTER */
	static register(payload) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/business-sign-up`, 200, payload);
	}

	/* FORGOTTEN YOUR PASSWORD */
	static forgottenYourPassword(payload) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/forgotten-your-password`, 200, payload);
	}

	/* EMPLOYEES */
	static getEmployees() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/employees`);
	}

	static getEmployee(employee) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/employees/${employee.id}`);
	}

	static createEmployee(employee) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/employees`, 201, employee);
	}

	static updateEmployee(employee) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/employees/${employee.id}`, 204, employee);
	}

	static deleteEmployee(employee) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/employees/${employee.id}`, 204);
	}

	/* ACCOUNTS */
	static getAccounts() {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/accounts`);
	}

	static getAccount(account) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('GET', `${process.env.API_HOST}/accounts/${account.id}`);
	}

	static createAccount(account) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/accounts`, 201, account);
	}

	static updateAccount(account) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('PUT', `${process.env.API_HOST}/accounts/${account.id}`, 204, account);
	}

	static deleteAccount(account) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('DELETE', `${process.env.API_HOST}/accounts/${account.id}`, 204);
	}

	static switchAccount(account) {
		const axiosRequest = this.axiosRequest();

		return axiosRequest('POST', `${process.env.API_HOST}/accounts/switch`, 201, account);
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
