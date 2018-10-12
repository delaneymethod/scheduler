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
