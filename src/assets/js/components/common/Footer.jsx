import React, { Fragment } from 'react';

import Intercom from './Intercom';

import CookieBanner from './CookieBanner';

import GoogleTagManager from './GoogleTagManager';

const Footer = () => (
	<Fragment>
		<CookieBanner />
		<GoogleTagManager />
		<Intercom />
	</Fragment>
);

export default Footer;
