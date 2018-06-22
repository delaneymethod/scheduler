import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import constants from '../helpers/constants';

import ErrorBoundary from './ErrorBoundary';

import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import NotFoundPage from './views/NotFoundPage';
import ForgottenYourPassword from './views/ForgottenYourPassword';

import Shifts from './views/dashboard/Shifts';
import Overview from './views/dashboard/Overview';
import Dashboard from './views/dashboard/Dashboard';
import Employees from './views/dashboard/Employees';

const routes = constants.APP.ROUTES;

const App = () => (
	<ErrorBoundary>
		<Switch context="router">
			<Route exact path={routes.HOME.URI} component={Home} />
			<Route exact path={routes.LOGIN.URI} component={Login} />
			<Route exact path={routes.REGISTER.URI} component={Register} />
			<Route exact path={routes.FORGOTTEN_YOUR_PASSWORD.URI} component={ForgottenYourPassword} />
			<Route exact path={routes.DASHBOARD.HOME.URI} component={Dashboard} />
			<Route exact path={routes.DASHBOARD.OVERVIEW.URI} component={Overview} />
			<Route exact path={routes.DASHBOARD.SHIFTS.URI} component={Shifts} />
			<Route exact path={routes.DASHBOARD.EMPLOYEES.URI} component={Employees} />
			<Route path="*" component={NotFoundPage} />
		</Switch>
	</ErrorBoundary>
);

export default hot(module)(App);
