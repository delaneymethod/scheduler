import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';

import constants from '../helpers/constants';

import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import NotFoundPage from './views/NotFoundPage';
import ForgottenYourPassword from './views/ForgottenYourPassword';

import Dashboard from './views/dashboard/Dashboard';
import Overview from './views/dashboard/Overview';
import Shifts from './views/dashboard/shifts/Shifts';
import Employees from './views/dashboard/employees/Employees';

const App = () => (
	<ErrorBoundary>
		<Switch>
			<Route exact path={constants.APP.ROUTES.HOME.URI} component={Home} />
			<Route exact path={constants.APP.ROUTES.LOGIN.URI} component={Login} />
			<Route exact path={constants.APP.ROUTES.REGISTER.URI} component={Register} />
			<Route exact path={constants.APP.ROUTES.FORGOTTEN_YOUR_PASSWORD.URI} component={ForgottenYourPassword} />
			<Route exact path={constants.APP.ROUTES.DASHBOARD.HOME.URI} component={Dashboard} />
			<Route exact path={constants.APP.ROUTES.DASHBOARD.OVERVIEW.URI} component={Overview} />
			<Route exact path={constants.APP.ROUTES.DASHBOARD.SHIFTS.URI} component={Shifts} />
			<Route exact path={constants.APP.ROUTES.DASHBOARD.EMPLOYEES.URI} component={Employees} />
			<Route component={NotFoundPage} />
		</Switch>
	</ErrorBoundary>
);

export default hot(module)(App);
