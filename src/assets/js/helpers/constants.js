export default {
	APP: {
		TITLE: 'Scheduler',
		LOGO: '/assets/img/scheduler-logo.svg',
		ROUTES: {
			HOME: {
				TITLE: 'Home',
				URI: '/',
			},
			LOGIN: {
				TITLE: 'Login',
				URI: '/login',
				MESSAGE: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
			},
			LOGOUT: {
				TITLE: 'Logout',
				URI: '/logout',
			},
			REGISTER: {
				TITLE: 'Register',
				URI: '/register',
				MESSAGE: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.',
			},
			FORGOTTEN_YOUR_PASSWORD: {
				TITLE: 'Forgotten your Password',
				URI: '/forgotten-your-password',
			},
			DASHBOARD: {
				HOME: {
					TITLE: 'Dashboard',
					URI: '/dashboard',
				},
				OVERVIEW: {
					TITLE: 'Overview',
					URI: '/dashboard/overview',
				},
				SHIFTS: {
					TITLE: 'Shifts',
					URI: '/dashboard/shifts',
				},
				EMPLOYEES: {
					TITLE: 'Employees',
					URI: '/dashboard/employees',
				},
			},
		},
	},
};
