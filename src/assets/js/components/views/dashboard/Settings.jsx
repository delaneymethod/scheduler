import moment from 'moment';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';

import Header from '../../common/Header';

import Footer from '../../common/Footer';

import Toolbar from '../../common/Toolbar';

import config from '../../../helpers/config';

import SettingsForm from '../../forms/SettingsForm';

import { switchRoute } from '../../../actions/routeActions';

import { updateCookieConsent } from '../../../actions/cookieConsentActions';

const routes = config.APP.ROUTES;

const propTypes = {
	user: PropTypes.object.isRequired,
	week: PropTypes.object.isRequired,
	route: PropTypes.string.isRequired,
	authenticated: PropTypes.bool.isRequired,
	cookieConsent: PropTypes.bool.isRequired,
};

const defaultProps = {
	user: {},
	week: {},
	route: '',
	cookieConsent: false,
	authenticated: false,
};

class Settings extends Component {
	constructor(props) {
		super(props);

		let tokenExpired;

		const { history, authenticated } = this.props;

		if (!isEmpty(this.props.user)) {
			/* The tokens contains the expiry, so even though the users session storage still has authenticated as true, we need to make sure the token hasn't expired. */
			const token = jwtDecode(this.props.user.token);

			tokenExpired = moment().isAfter(moment.unix(token.exp));
		}

		if (!authenticated || tokenExpired) {
			history.push(routes.LOGIN.URI);
		}
	}

	componentDidMount = () => {
		if (isEmpty(this.props.week)) {
			return;
		}

		document.title = `${config.APP.TITLE}: ${routes.DASHBOARD.SETTINGS.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.DASHBOARD.SETTINGS.META.KEYWORDS);
			meta.description.setAttribute('content', routes.DASHBOARD.SETTINGS.META.DESCRIPTION);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}

		/* Tracks the current route/page of the user */
		this.props.actions.switchRoute(routes.DASHBOARD.SETTINGS.URI);
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.route !== prevProps.route) {
			/**
			 * If there is no cookie consent already given and the user has navigated the site without closing the cookie banner,
			 * we are dropping cookies as per https://trello.com/c/xGejf1Uf/199-update-cookie-consent-process
			 */
			if (!this.props.cookieConsent) {
				this.props.actions.updateCookieConsent(true);
			}
		}
	};

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Toolbar history={this.props.history} />
			<SettingsForm history={this.props.history} />
			<Footer history={this.props.history} />
		</Fragment>
	);
}

Settings.propTypes = propTypes;

Settings.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
	week: state.week,
	route: state.route,
	cookieConsent: state.cookieConsent,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		switchRoute,
		updateCookieConsent,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
