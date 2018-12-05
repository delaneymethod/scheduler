import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import queryString from 'query-string';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';

import Footer from '../common/Footer';

import config from '../../helpers/config';

import RegisterForm from '../forms/RegisterForm';

import UserSignUpForm from '../forms/UserSignUpForm';

import { switchRoute } from '../../actions/routeActions';

import { updateCookieConsent } from '../../actions/cookieConsentActions';

const routes = config.APP.ROUTES;

const propTypes = {
	route: PropTypes.string.isRequired,
	authenticated: PropTypes.bool.isRequired,
	cookieConsent: PropTypes.bool.isRequired,
};

const defaultProps = {
	route: '',
	cookieConsent: false,
	authenticated: false,
};

class Register extends Component {
	constructor(props) {
		super(props);

		const { history, authenticated } = this.props;

		if (authenticated) {
			history.push(routes.DASHBOARD.HOME.URI);
		}
	}

	componentDidMount = () => {
		if (this.props.authenticated) {
			return;
		}

		document.title = `${config.APP.TITLE}: ${routes.LOGIN.TITLE}`;

		document.title = `${config.APP.TITLE}: ${routes.REGISTER.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.REGISTER.META.KEYWORDS);
			meta.description.setAttribute('content', routes.REGISTER.META.DESCRIPTION);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}

		/* Tracks the current route/page of the user */
		this.props.actions.switchRoute(routes.REGISTER.URI);
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

	renderForm = () => {
		/* Render form based on if user has been invited to sign up is a new business user wanting to register */
		const queryParams = queryString.parse(this.props.location.search);

		if (this.props.location.pathname === routes.USER_SIGN_UP.URI) {
			return <UserSignUpForm history={this.props.history} code={queryParams.code} email={queryParams.email} />;
		}

		return <RegisterForm history={this.props.history} />;
	};

	render = () => {
		if (this.props.authenticated) {
			return null;
		}

		return (
			<Fragment>
				<Row className="d-flex flex-md-row flex-column register-page-container">
					<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
						<div className="panel-welcome">
							<h1><a href={routes.HOME.URI} title={config.APP.TITLE}><img src={config.APP.LOGO} alt={config.APP.TITLE} className="mb-4" /></a></h1>
							<p className="h5 mb-0">{routes.REGISTER.CONTENT.WELCOME}</p>
						</div>
					</Col>
					<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
						<div className="panel-page">
							<a href={routes.HOME.URI} title={routes.HOME.TITLE} id="home" className="panel-page__link"><i className="fa fa-fw fa-arrow-circle-left" aria-hidden="true"></i> Back to {routes.HOME.TITLE}</a>
							<a href={routes.LOGIN.URI} title={routes.LOGIN.TITLE} id="login" className="panel-page__link float-right">Already a member? {routes.LOGIN.TITLE}</a>
							<div className="card panel-page__content">
								<h2 className="h5--title-card">{routes.REGISTER.TITLE}</h2>
								{this.renderForm()}
							</div>
						</div>
					</Col>
				</Row>
				<Footer history={this.props.history} />
			</Fragment>
		);
	};
}

Register.propTypes = propTypes;

Register.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
