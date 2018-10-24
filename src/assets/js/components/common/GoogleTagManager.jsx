import React, { Component } from 'react';
import gtmParts from 'react-google-tag-manager';
import CookieConsent, { Cookies } from 'react-cookie-bar';

import config from '../../helpers/config';

const gtm = gtmParts({
	scheme: 'https:',
	id: config.APP.TRACKING.GOOGLE,
});

class GoogleTagManager extends Component {
	componentDidMount = () => {
		if (Cookies.get('schedulerCookiesConsentAccepted')) {
			if (!window.dataLayer) {
				/* eslint-disable no-eval */
				eval(gtm.scriptAsHTML().replace(/<\/?script>/g, ''));
				/* eslint-enable no-eval */
			}
		}
	};

	render = () => gtm.noScriptAsReact();
}

export default GoogleTagManager;
