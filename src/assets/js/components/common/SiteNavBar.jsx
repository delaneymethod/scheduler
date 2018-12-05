import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import config from '../../helpers/config';

import { addClass, removeClass } from '../../helpers/classes';

import { updateCookieConsent } from '../../actions/cookieConsentActions';

const routes = config.APP.ROUTES;

const propTypes = {
	cookieConsent: PropTypes.bool.isRequired,
};

const defaultProps = {
	cookieConsent: false,
};

class SiteNavBar extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick = (event) => {
		if (event.currentTarget.classList.contains('cross')) {
			removeClass(event.currentTarget, 'cross');
		} else {
			addClass(event.currentTarget, 'cross');
		}
	};

	handleAnchorClick = () => {
		/**
		 * If there is no cookie consent already given and the user has navigated the site without closing the cookie banner,
		 * we are dropping cookies as per https://trello.com/c/xGejf1Uf/199-update-cookie-consent-process
		 */
		if (!this.props.cookieConsent) {
			this.props.actions.updateCookieConsent(true);
		}
	};

	render = () => (
		<Row className="header">
			<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-3 m-0">
				<nav className="fixed row no-gutters p-0 m-0 navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="mt-3 mt-md-0 mb-3 m-lg-auto navbar-collapse collapse w-100 p-0 m-0 order-2 order-sm-2 order-md-1 order-lg-2 order-xl-2" id="navbar">
						<ul className="p-0 m-0 nav navbar-nav ml-auto w-100 justify-content-end">
							<li className="nav-item p-0 m-0"><a href="#benefits" title="Benefits" id="benefitsNavLink" className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-dark border-0" onClick={this.handleAnchorClick}>Benefits</a></li>
							<li className="nav-item p-0 m-0"><a href="#about" title="About" id="aboutNavLink" className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-dark border-0" onClick={this.handleAnchorClick}>About</a></li>
							<li className="nav-item p-0 m-0"><a href="#beta" title="Beta" id="betaNavLink" className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-dark border-0" onClick={this.handleAnchorClick}>Beta</a></li>
							<li className="nav-item p-0 m-0"><a href="#pricing" title="Pricing" id="pricingNavLink" className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-dark border-0" onClick={this.handleAnchorClick}>Pricing</a></li>
							<li className="nav-item p-0 m-0"><a href={routes.NEWS.URI} id="newsNavLink" title={routes.NEWS.TITLE} className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-dark border-0">{routes.NEWS.TITLE}</a></li>
							<li className="d-none d-lg-block nav-item p-0 m-0"><a href={routes.LOGIN.URI} id="loginNavLink" title={routes.LOGIN.TITLE} className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-secondary border-0">{routes.LOGIN.TITLE}</a></li>
							<li className="d-none d-lg-block nav-item p-0 m-0"><a href={routes.REGISTER.URI} id="registerNavLink" title={routes.REGISTER.TITLE} className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-primary border-0">{routes.REGISTER.TITLE}</a></li>
						</ul>
					</div>
					<div className="p-0 pt-3 p-md-0 m-0 text-center order-3 order-sm-3 order-md-2 order-lg-1 order-xl-1 col-12 col-md-auto">
						<a href={routes.HOME.URI} title={config.APP.AUTHOR.TITLE} className="p-0 m-0 navbar-brand"><img src={config.APP.AUTHOR.LOGO} alt={config.APP.AUTHOR.TITLE} className="img-fluid border-0 p-0 m-0" /></a>
					</div>
					<div className="p-0 m-0 text-center order-1 order-sm-1 order-md-3 col-12 col-md-auto">
						<button type="button" className="text-center btn-lines mt-0 pt-2 pl-2 pr-2 pb-2 border-1 rounded-1 text-white lines-button x navbar-toggler" role="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation" onClick={event => this.handleClick(event)}>
							<span className="align-middle lines"></span>&nbsp;<span className="">Menu</span>
						</button>
						<div className="d-inline-block d-lg-none">
							<a href={routes.LOGIN.URI} id="login" title={routes.LOGIN.TITLE} className="mt-0 ml-2 pt-0 pl-3 pr-3 pb-0 btn btn-secondary btn-med border-0 med-buttons">{routes.LOGIN.TITLE}</a>
							<a href={routes.REGISTER.URI} id="register" title={routes.REGISTER.TITLE} className="mt-0 ml-2 pt-0 pl-3 pr-3 pb-0 btn btn-primary btn-med border-0">{routes.REGISTER.TITLE}</a>
						</div>
					</div>
				</nav>
			</Col>
		</Row>
	);
}

SiteNavBar.propTypes = propTypes;

SiteNavBar.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	cookieConsent: state.cookieConsent,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		updateCookieConsent,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteNavBar);
