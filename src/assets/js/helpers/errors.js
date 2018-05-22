const formatError = (error) => {
	const data = {
		title: '',
		message: '',
	};

	/* The request was made and the server responded with a status code that falls out of the range of 2xx */
	if (error.response) {
		if (error.response.data) {
			data.title = `${error.response.data.error.code} ${error.response.data.error.type}`;

			data.message = `<p>${error.response.data.error.message}</p><p class="pb-0 mb-0">${error.response.data.error.hints.summary}</p>`;
		} else {
			data.title = `${error.response.code} ${error.response.name}`;

			data.message = `<p>${error.response.message}</p>`;
		}
	/* The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser */
	} else if (error.request) {
		if (error.message === 'Network Error') {
			data.title = '504 Network Error';

			data.message = '<p>A network error occurred. Please try again.</p>';
		} else {
			data.title = error.name;

			data.message = `<p>${error.message}</p>`;
		}
	/* Something else happened in setting up the request that triggered an Error */
	} else {
		data.title = 'Error';

		data.message = `<p>${error.message}</p>`;
	}

	return {
		data,
	};
};

export default formatError;
