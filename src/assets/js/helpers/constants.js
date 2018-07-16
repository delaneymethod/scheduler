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
				},
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			LOGOUT: {
				TITLE: 'Logout',
			},
			SETTINGS: {
				UPDATE: {
					TITLE: 'Update Settings',
				},
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
			ROLES: {
				DELETE: {
					TITLE: 'Delete Role',
				},
				UPDATE: {
					TITLE: 'Update Role',
				},
				CREATE: {
					TITLE: 'Create Role',
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
				ASSIGN: {
					TITLE: 'Assign Shift',
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
					EDITED: 'EDITED',
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
				ROLES: {
					TITLE: 'Roles',
					URI: '/dashboard/roles',
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
				SETTINGS: {
					TITLE: 'Settings',
					URI: '/dashboard/settings',
					META: {
						DESCRIPTION: '',
						KEYWORDS: '',
					},
				},
			},
		},
		NOTIFICATIONS: {
			TIMEOUT: 3000,
		},
	},
	API: {
		HOST: {
			DEV: 'https://test.giggrafter.com/v1',
			PROD: 'https://api.giggrafter.com/v1',
		},
	},
};
