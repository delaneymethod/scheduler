import React, { Component } from 'react';
import gtmParts from 'react-google-tag-manager';
import CookieConsent, { Cookies } from 'react-cookie-consent';

import config from '../../helpers/config';

class GoogleTagManager extends Component {
	componentDidMount = () => {
		if (Cookies.get('schedulerCookiesConsentAccepted')) {
			if (!window.dataLayer) {
				const gtmScriptNode = document.getElementById('google-tag-manager');

				/* eslint-disable no-eval */
				eval(gtmScriptNode.textContent);
				/* eslint-enable no-eval */
			}
		}
	};

	render = () => {
		const gtm = gtmParts({
			scheme: 'https:',
			id: config.APP.TRACKING.GOOGLE,
		});

		return (
			<div id="google-tag-manager">
				{gtm.scriptAsReact()}
			</div>
		);
	};
}

export default GoogleTagManager;
