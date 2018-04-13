/**
 * @link	  https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license	  https://www.giggrafter.com/license
 */
 
import React from 'react';
import { hot } from 'react-hot-loader';

import Image from './elements/Image';

// import largeImage from '../../img/large.jpg';

const App = () => (
	<div>
		<Image src="/assets/img/large.jpg" alt="" className="" />
	</div>
);

export default hot(module)(App);
