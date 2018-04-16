/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */
 
import React from 'react';
import { hot } from 'react-hot-loader';

const Image = props => (
	<img src={props.src} alt={props.alt} className={props.className} />
);

export default hot(module)(Image);
