export default {
	APP: {
		TITLE: 'Scheduler',
		LOGO: '/assets/img/scheduler-logo.svg',
		AUTHOR: 'Gig Grafter',
		ROUTES: {
			HOME: {
				TITLE: 'Home',
				URI: '/',
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			LOGIN: {
				TITLE: 'Login',
				URI: '/login',
				MESSAGES: {
					WELCOME: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
					FAILED: 'You entered an incorrect username or password. Please try again or if you have forgotten your password, click on the link below.',
				},
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			LOGOUT: {
				TITLE: 'Logout',
			},
			EMPLOYEES: {
				DELETE: {
					TITLE: 'Delete Employee',
				},
				UPDATE: {
					TITLE: 'Update Employee',
				},
				CREATE: {
					TITLE: 'Create Employee',
				},
				UPLOAD: {
					TITLE: 'Upload Employees',
				},
			},
			SHIFTS: {
				DELETE: {
					TITLE: 'Delete Shift',
				},
				UPDATE: {
					TITLE: 'Update Shift',
				},
				CREATE: {
					TITLE: 'Create Shift',
				},
			},
			ROTAS: {
				DELETE: {
					TITLE: 'Delete Rota',
				},
				UPDATE: {
					TITLE: 'Update Rota',
				},
				CREATE: {
					TITLE: 'Create Rota',
					MESSAGE: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
				},
				STATUSES: {
					DRAFT: 'DRAFT',
					PUBLISHED: 'PUBLISHED',
				},
			},
			REGISTER: {
				TITLE: 'Register',
				URI: '/register',
				MESSAGES: {
					WELCOME: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
				},
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			FORGOTTEN_YOUR_PASSWORD: {
				TITLE: 'Forgotten your Password',
				URI: '/passwords/forgot',
				MESSAGES: {
					WELCOME: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
					NOT_FOUND: 'Email address was not found.',
				},
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			UPDATE_YOUR_PASSWORD: {
				TITLE: 'Update your Password',
				URI: '/passwords/update',
				MESSAGES: {
					WELCOME: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
					NOT_FOUND: 'Email address was not found.',
					FAILED: 'Password was not updated.',
				},
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			PAGE_NOT_FOUND: {
				TITLE: 'Page Not Found',
				MESSAGES: {
					WELCOME: "<p class=\"lead\">What does this mean?</p><p>We couldn't find the page you requested on our servers.</p><p>We're really sorry about that. It's our fault, not yours.</p><p>We'll work hard to get this page back online as soon as possible.</p><p>Perhaps you would like to go back or go to our homepage?</p>",
				},
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			DASHBOARD: {
				HOME: {
					TITLE: 'Dashboard',
					URI: '/dashboard',
					META: {
						DESCRIPTION: '',
						KEYWORDS: '',
					},
				},
				OVERVIEW: {
					TITLE: 'Overview',
					URI: '/dashboard/overview',
					META: {
						DESCRIPTION: '',
						KEYWORDS: '',
					},
				},
				SHIFTS: {
					TITLE: 'Shifts',
					URI: '/dashboard/shifts',
					META: {
						DESCRIPTION: '',
						KEYWORDS: '',
					},
				},
				EMPLOYEES: {
					TITLE: 'Employees',
					URI: '/dashboard/employees',
					META: {
						DESCRIPTION: '',
						KEYWORDS: '',
					},
				},
			},
		},
	},
	API: {
		HOST: 'https://test.giggrafter.com/v1',
	},
};
