const isIncognitoMode = () => new Promise((resolve, reject) => {
	const fs = window.RequestFileSystem || window.webkitRequestFileSystem;

	if (!fs) {
		reject();
	}

	fs(window.TEMPORARY, 100, () => reject(), () => resolve());
});

export default isIncognitoMode;
