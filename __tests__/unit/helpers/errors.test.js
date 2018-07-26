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
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Email address was not found.</li></ul>',
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
				message: '<p><strong>The following error occurred:</strong></p><ul><li>A 404 status code indicates that the requested resource was not found at the URL given, and the server has no idea how long for.</li></ul>',
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
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Test error message</li></ul>',
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
				message: '<p><strong>A network error has occurred:</strong></p><ul><li>Please try again in a few minutes.</li></ul>',
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
				message: '<p><strong>The following error occurred:</strong></p><ul><li>Test error message</li></ul>',
			},
		};

		expect(formatError(error)).toEqual(formattedError);
	});
});
