/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';

import Home from './views/Home';
import Login from './views/Login';
import Logout from './views/Logout';
import Register from './views/Register';
import NotFoundPage from './views/NotFoundPage';
import Verification from './views/Verification';
import ForgottenYourPassword from './views/ForgottenYourPassword';

import Dashboard from './views/dashboard/Dashboard';
import Overview from './views/dashboard/Overview';
import Shifts from './views/dashboard/shifts/Shifts';
import Employees from './views/dashboard/employees/Employees';

const Main = () => (
	<ErrorBoundary>
		<Switch>
			<Route exact path='/' component={Home} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/logout' component={Logout} />
			<Route exact path='/register' component={Register} />
			<Route exact path='/verification' component={Verification} />
			<Route exact path='/forgotten-your-password' component={ForgottenYourPassword} />
			<Route exact path='/dashboard' component={Dashboard} />
			<Route exact path='/dashboard/overview' component={Overview} />
			<Route exact path='/dashboard/shifts' component={Shifts} />
			<Route exact path='/dashboard/employees' component={Employees} />
			<Route component={NotFoundPage} />
		</Switch>
	</ErrorBoundary>
);

export default Main;
