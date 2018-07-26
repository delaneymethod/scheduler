const formatError = (error) => {
	const data = {
		message: '',
	};

	/* The request was made and the server responded with a status code that falls out of the range of 2xx */
	if (error.response) {
		if (error.response.data) {
			data.message = `<p><strong>The following error occurred:</strong></p><ul><li>${error.response.data.error.hints.summary}</li></ul>`;
		} else {
			data.message = `<p><strong>The following error occurred:</strong></p><ul><li>${error.response.message}</li></ul>`;
		}
	/* The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser */
	} else if (error.request) {
		if (error.message === 'Network Error') {
			data.message = '<p><strong>A network error has occurred:</strong></p><ul><li>Please try again in a few minutes.</li></ul>';
		} else {
			data.message = `<p><strong>The following error occurred:</strong></p><ul><li>${error.message}</li></ul>`;
		}
	/* Something else happened in setting up the request that triggered an Error */
	} else {
		data.message = `<p><strong>The following error occurred:</strong></p><ul><li>${error.message}</li></ul>`;
	}

	return {
		data,
	};
};

export default formatError;
