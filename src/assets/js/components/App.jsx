/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import React from 'react';
import { hot } from 'react-hot-loader';

import Main from './Main';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';

const App = () => (
	<ErrorBoundary>
		<Main />
	</ErrorBoundary>
);

export default hot(module)(App);
