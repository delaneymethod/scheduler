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
				MESSAGE: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			LOGOUT: {
				TITLE: 'Logout',
			},
			REGISTER: {
				TITLE: 'Register',
				URI: '/register',
				MESSAGE: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			FORGOTTEN_YOUR_PASSWORD: {
				TITLE: 'Forgotten your Password',
				URI: '/forgotten-your-password',
				META: {
					DESCRIPTION: '',
					KEYWORDS: '',
				},
			},
			PAGE_NOT_FOUND: {
				TITLE: 'Page Not Found',
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
		HOST: '//schedulerlbtest-844744214.eu-west-1.elb.amazonaws.com',
	},
};
