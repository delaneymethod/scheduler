/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Overview from './Overview';
import Register from './Register';
import Dashboard from './Dashboard';
import Shifts from './shifts/Shifts';
import Employees from './employees/Employees';

const App = () => (
	<Switch>
		<Route exact path='/' component={Home} />
		<Route exact path='/login' component={Login} />
		<Route exact path='/shifts' component={Shifts} />
		<Route exact path='/overview' component={Overview} />
		<Route exact path='/register' component={Register} />
		<Route exact path='/dashboard' component={Dashboard} />
		<Route exact path='/employees' component={Employees} />
	</Switch>
);

export default hot(module)(App);
