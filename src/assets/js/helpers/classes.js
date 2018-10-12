export const addClass = (element, className) => {
	const currentClassName = element.getAttribute('class');

	if (typeof currentClassName !== 'undefined' && currentClassName) {
		element.setAttribute('class', `${currentClassName} ${className}`);
	} else {
		element.setAttribute('class', className);
	}
};

export const removeClass = (element, className) => {
	const currentClassName = element.getAttribute('class');

	if (typeof currentClassName !== 'undefined' && currentClassName) {
		const class2RemoveIndex = currentClassName.indexOf(className);

		if (class2RemoveIndex !== -1) {
			const class2Remove = currentClassName.substr(class2RemoveIndex, className.length);

			const updatedClassName = currentClassName.replace(class2Remove, '').trim();

			element.setAttribute('class', updatedClassName);
		}
	} else {
		element.removeAttribute('class');
	}
};

export const showEditHandler = (accountEmployeeId) => {
	const accountEmployeeEditHandler = document.querySelector(`[data-account-employee-id="${accountEmployeeId}"] .edit-handler`);

	addClass(accountEmployeeEditHandler, 'd-inline-block');

	Object.assign(accountEmployeeEditHandler.style, { top: 0, right: 0 });
};

export const hideEditHandler = (accountEmployeeId) => {
	const accountEmployeeEditHandler = document.querySelector(`[data-account-employee-id="${accountEmployeeId}"] .edit-handler`);

	accountEmployeeEditHandler.removeAttribute('style');

	removeClass(accountEmployeeEditHandler, 'd-inline-block');
};
