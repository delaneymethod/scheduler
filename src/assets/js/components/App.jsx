/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';

import Login from './login';

const App = () => (
	<Switch>
		<Route exact path='/login' component={Login} />
	</Switch>
);

export default hot(module)(App);
