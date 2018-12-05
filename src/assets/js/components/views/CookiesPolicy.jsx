import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import config from '../../helpers/config';

import SiteNavBar from '../common/SiteNavBar';

import SiteFooter from '../common/SiteFooter';

import { switchRoute } from '../../actions/routeActions';

import ServiceUpdatesForm from '../forms/ServiceUpdatesForm';

import { updateCookieConsent } from '../../actions/cookieConsentActions';

const routes = config.APP.ROUTES;

const propTypes = {
	route: PropTypes.string.isRequired,
	cookieConsent: PropTypes.bool.isRequired,
};

const defaultProps = {
	route: '',
	cookieConsent: false,
};

class CookiesPolicy extends Component {
	componentDidMount = () => {
		document.title = config.APP.TITLE;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.COOKIES_POLICY.META.KEYWORDS);
			meta.description.setAttribute('content', routes.COOKIES_POLICY.META.DESCRIPTION);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}

		/* Tracks the current route/page of the user */
		this.props.actions.switchRoute(routes.COOKIES_POLICY.URI);
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
		<Row className="general-page-container">
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<SiteNavBar />
				<Row className="introduction bg-white d-flex justify-content-center">
					<Col xs="12" sm="12" md="10" lg="10" xl="10" className="align-self-start align-self-lg-center text-center text-md-left m-0 p-4 p-lg-5">
						<h1 className="lead-text h2 font-weight-bold mt-sm-0 mt-md-3 mt-lg-3 mb-4 pb-4 position-relative">GIG GRAFTER BETA RELEASE - COOKIES POLICY</h1>
						<div className="p-0 m-0" dangerouslySetInnerHTML={{ __html: routes.COOKIES_POLICY.CONTENT.WELCOME }} />
					</Col>
				</Row>
				<Row className="bg-white d-flex justify-content-center border-top">
					<Col xs="12" sm="12" md="10" lg="10" xl="10" className="terms align-self-start align-self-lg-center text-left m-0 p-4 p-lg-5">
						<Row className="no-gutters mb-4">
							<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-0 m-0">
								<p>Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.</p>
								<p>A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer&#39;s hard drive.</p>
								<p>We use the following cookies:</p>
								<ul>
									<li><span className="font-weight-bold">Strictly necessary cookies.</span> These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website, use a shopping cart or make use of e-billing services.</li>
									<li><span className="font-weight-bold">Analytical/performance cookies.</span> They allow us to recognise and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.</li>
									<li><span className="font-weight-bold">Functionality cookies.</span> These are used to recognise you when you return to our website. This enables us to personalise our content for you, greet you by name and remember your preferences (for example, your choice of language or region).</li>
									<li><span className="font-weight-bold">Targeting cookies.</span> These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose.</li>
								</ul>
								<p>You can find more information about the individual cookies we use and the purposes for which we use them in the table below:</p>
								<table className="table">
									<thead>
										<tr>
											<th>Cookie Name</th>
											<th>Purpose</th>
											<th>Type</th>
											<th>Expiration</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td><code>_ga</code></td>
											<td>Used to distinguish users.</td>
											<td>Analytical</td>
											<td>2 years</td>
										</tr>
										<tr>
											<td><code>_gid</code></td>
											<td>Used to distinguish users.</td>
											<td>Analytical</td>
											<td>24hrs</td>
										</tr>
										<tr>
											<td><code>_gat_&lt;property-id&gt;</code></td>
											<td>Used to throttle request rate.</td>
											<td>Analytical</td>
											<td>1 minute</td>
										</tr>
										<tr>
											<td><code>intercom-id-&lt;app-id&gt;</code></td>
											<td>Unique anonymous visitor identifier cookie.</td>
											<td>Analytical</td>
											<td>9 months</td>
										</tr>
										<tr>
											<td><code>intercom-session-&lt;app-id&gt;</code></td>
											<td>Identifier for each unique browser session. This cookie is refreshed on each successful logged-in ping, extending it to 1 week from that moment.</td>
											<td>Analytical</td>
											<td>1 week</td>
										</tr>
									</tbody>
								</table>
								<p>You block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site.</p>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="service-updates">
					<Col xs="12" sm="2" md="3" lg="4" xl="4" className="d-none d-sm-block"></Col>
					<Col xs="12" sm="8" md="6" lg="4" xl="4" className="m-0 p-4 p-lg-5">
						<div className="h5 m-0 mb-4 text-center text-white" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.SERVICE_UPDATES.OVERVIEW }} />
						<ServiceUpdatesForm />
					</Col>
					<Col xs="12" sm="2" md="3" lg="4" xl="4" className="d-none d-sm-block"></Col>
				</Row>
				<SiteFooter />
			</Col>
		</Row>
	);
}

CookiesPolicy.propTypes = propTypes;

CookiesPolicy.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	route: state.route,
	cookieConsent: state.cookieConsent,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		switchRoute,
		updateCookieConsent,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CookiesPolicy);
