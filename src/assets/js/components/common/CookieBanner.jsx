import React, { Component } from 'react';
import gtmParts from 'react-google-tag-manager';
import CookieConsent from 'react-cookie-consent';

import config from '../../helpers/config';

const routes = config.APP.ROUTES;

const gtm = gtmParts({
	scheme: 'https:',
	id: config.APP.TRACKING.GOOGLE,
});

class CookieBanner extends Component {
	constructor(props) {
		super(props);

		this.handleCookiesAccepted = this.handleCookiesAccepted.bind(this);
	}

	handleCookiesAccepted = () => {
		if (!window.dataLayer) {
			/* eslint-disable no-eval */
			eval(gtm.scriptAsHTML().replace(/<\/?script>/g, ''));
			/* eslint-enable no-eval */
		}
	};

	render = () => (
		<CookieConsent disableStyles={true} onAccept={this.handleCookiesAccepted} cookieName="schedulerCookiesConsentAccepted" buttonText="Accept Cookies" containerClasses="cookie-consent-container row" contentClasses="cookie-consent-content col-12 col-md-10 m-0 p-0 pr-md-3 text-center text-md-left" buttonClasses="cookie-consent-button col-12 col-md-2 m-0 mt-3 mt-md-0 p-3 p-md-0 btn btn-primary border-0">
			{routes.COOKIES_POLICY.CONTENT.CONSENT} Read our <a href={routes.COOKIES_POLICY.URI} title={routes.COOKIES_POLICY.TITLE}>{routes.COOKIES_POLICY.TITLE}</a>.
		</CookieConsent>
	);
}

export default CookieBanner;
