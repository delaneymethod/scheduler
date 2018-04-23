/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import React from 'react';
import { hot } from 'react-hot-loader';

import Header from './Header';
import Main from './Main';

const App = () => (
	<div>
		<Header />
		<Main />
	</div>
);

export default hot(module)(App);
