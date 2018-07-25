const formatError = (error) => {
	const data = {
		message: '',
	};

	/* The request was made and the server responded with a status code that falls out of the range of 2xx */
	if (error.response) {
		if (error.response.data) {
			data.message = `<p><strong>The following error occurred:</strong> ${error.response.data.error.hints.summary}</p>`;
		} else {
			data.message = `<p><strong>The following error occurred:</strong> ${error.response.message}</p>`;
		}
	/* The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser */
	} else if (error.request) {
		if (error.message === 'Network Error') {
			data.message = '<p><strong>A network error has occurred:</strong> Please try again in a few minutes.</p>';
		} else {
			data.message = `<p><strong>The following error occurred:</strong> ${error.message}</p>`;
		}
	/* Something else happened in setting up the request that triggered an Error */
	} else {
		data.message = `<p><strong>The following error occurred:</strong> ${error.message}</p>`;
	}

	return {
		data,
	};
};

export default formatError;
