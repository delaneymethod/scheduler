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
import Shifts from './shifts';
import Employees from './employees';
import Overview from './overview';

const App = () => (
	<Switch>
		<Route exact path='/' component={Home} />
		<Route exact path='/login' component={Login} />
		<Route exact path='/shifts' component={Shifts} />
		<Route exact path='/employees' component={Employees} />
		<Route exact path='/overview' component={Overview} />
	</Switch>
);

export default hot(module)(App);
