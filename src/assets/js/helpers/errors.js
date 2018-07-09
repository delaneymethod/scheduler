const formatError = (error) => {
	const data = {
		message: '',
	};

	/* The request was made and the server responded with a status code that falls out of the range of 2xx */
	if (error.response) {
		if (error.response.data) {
			data.message = `<p>${error.response.data.error.hints.summary}</p>`;
		} else {
			data.message = `<p>${error.response.message}</p>`;
		}
	/* The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser */
	} else if (error.request) {
		if (error.message === 'Network Error') {
			data.message = '<p>A network error has occurred. Please try again in a few minutes.</p>';
		} else {
			data.message = `<p>${error.message}</p>`;
		}
	/* Something else happened in setting up the request that triggered an Error */
	} else {
		data.message = `<p>${error.message}</p>`;
	}

	return {
		data,
	};
};

export default formatError;
