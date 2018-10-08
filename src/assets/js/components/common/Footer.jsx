import React, { Fragment } from 'react';

import CookieBanner from './CookieBanner';

import GoogleTagManager from './GoogleTagManager';

const Footer = () => (
	<Fragment>
		<CookieBanner />
		<GoogleTagManager />
	</Fragment>
);

export default Footer;
