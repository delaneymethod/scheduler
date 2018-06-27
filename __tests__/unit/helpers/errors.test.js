import formatError from '../../../src/assets/js/helpers/errors';

describe('Errors', () => {
	it('should format error response with data', () => {
		const error = {
			response: {
				data: {
					error: {
						code: 404,
						type: 'Not Found',
						message: 'A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.',
						hints: {
							summary: 'Email address was not found.',
						},
					},
				},
			},
		};

		const formattedError = {
			data: {
				code: 404,
				title: '404 Not Found',
				message: '<p>A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.</p><p class="pb-0 mb-0">Email address was not found.</p>',
			},
		};

		expect(formatError(error)).toEqual(formattedError);
	});

	it('should format error response with no data', () => {
		const error = {
			response: {
				code: 404,
				name: 'Not Found',
				message: 'A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.',
			},
		};

		const formattedError = {
			data: {
				code: 404,
				title: '404 Not Found',
				message: '<p>A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.</p>',
			},
		};

		expect(formatError(error)).toEqual(formattedError);
	});

	it('should format generic error request', () => {
		const error = {
			request: true,
			name: 'Error',
			message: 'Test error message',
		};

		const formattedError = {
			data: {
				code: undefined,
				title: 'Error',
				message: '<p>Test error message</p>',
			},
		};

		expect(formatError(error)).toEqual(formattedError);
	});

	it('should format network error request', () => {
		const error = {
			request: true,
			message: 'Network Error',
		};

		const formattedError = {
			data: {
				code: 504,
				title: '504 Network Error',
				message: '<p>A network error has occurred. Please try again in a few minutes.</p>',
			},
		};

		expect(formatError(error)).toEqual(formattedError);
	});

	it('should format generic error', () => {
		const error = {
			message: 'Test error message',
		};

		const formattedError = {
			data: {
				code: undefined,
				title: 'Error',
				message: '<p>Test error message</p>',
			},
		};

		expect(formatError(error)).toEqual(formattedError);
	});
});
