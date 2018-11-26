import { addClass, removeClass } from './classes';

export const showEditHandler = (accountEmployeeId) => {
	const accountEmployeeEditHandler = document.querySelector(`[data-account-employee-id="${accountEmployeeId}"] .edit-handler`);

	// addClass(accountEmployeeEditHandler, 'd-inline-block');

	Object.assign(accountEmployeeEditHandler.style, { top: 0, right: 0 });
};

export const hideEditHandler = (accountEmployeeId) => {
	const accountEmployeeEditHandler = document.querySelector(`[data-account-employee-id="${accountEmployeeId}"] .edit-handler`);

	accountEmployeeEditHandler.removeAttribute('style');

	removeClass(accountEmployeeEditHandler, 'd-inline-block');
};
