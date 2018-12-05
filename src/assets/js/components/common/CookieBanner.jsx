import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import config from '../../helpers/config';

import logMessage from '../../helpers/logging';

import isIncognitoMode from '../../helpers/isIncognitoMode';

import { deleteCookies, updateCookieConsent } from '../../actions/cookieConsentActions';

const routes = config.APP.ROUTES;

const propTypes = {
	cookieConsent: PropTypes.bool.isRequired,
};

const defaultProps = {
	cookieConsent: false,
};

class CookieBanner extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleCookieConsent = this.handleCookieConsent.bind(this);
	}

	getInitialState = () => ({
		hideBanner: true,
	});

	componentDidMount = () => {
		isIncognitoMode()
			.then(() => {
				logMessage('info', 'Called CookieBanner Component handleShowBanner - Private Mode - Consent Not Given - Hide Banner');

				/* If private mode, update consent to false and hide the banner */
				this.props.actions.updateCookieConsent(false);

				this.setState({ hideBanner: true });
			})
			.catch(() => {
				/* If NOT private mode, then if consent to true, hide the banner otherwise show the banner */
				if (this.props.cookieConsent) {
					logMessage('info', 'Called CookieBanner Component handleShowBanner - Consent Given - Hide Banner');

					this.setState({ hideBanner: true });
				} else {
					logMessage('info', 'Called CookieBanner Component handleShowBanner - Consent Not Given - Show Banner');

					/* The page has a) reloaded, b) user manually wiped cookie consent or c) new visitor - so lets make sure we give them a clean start */
					this.props.actions.deleteCookies();

					this.setState({ hideBanner: false });
				}
			});
	};

	handleCookieConsent = () => this.setState({ hideBanner: true }, () => this.props.actions.updateCookieConsent(true));

	render = () => ((!this.state.hideBanner) ? (
		<div className="cookieConsent cookie-consent-container row position-fixed" style={{ bottom: 0 }}>
			<div className="cookie-consent-content col-12 col-md-10 m-0 p-0 pr-md-3 text-center text-md-left">
				{routes.COOKIES_POLICY.CONTENT.CONSENT} Read our <a href={routes.COOKIES_POLICY.URI} title={routes.COOKIES_POLICY.TITLE}>{routes.COOKIES_POLICY.TITLE}</a>.
			</div>
			<button className="cookie-consent-button col-12 col-md-2 m-0 mt-3 mt-md-0 p-3 p-md-0 btn btn-primary border-0" id="cookie-consent" onClick={this.handleCookieConsent}>Close</button>
		</div>
	) : '');
}

CookieBanner.propTypes = propTypes;

CookieBanner.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	cookieConsent: state.cookieConsent,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		deleteCookies,
		updateCookieConsent,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CookieBanner);
