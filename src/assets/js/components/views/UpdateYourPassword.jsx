import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import queryString from 'query-string';
import React, { Component } from 'react';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import LoginForm from '../forms/LoginForm';

import UpdateYourPasswordForm from '../forms/UpdateYourPasswordForm';

const routes = config.APP.ROUTES;

const propTypes = {
	token: PropTypes.string.isRequired,
};

const defaultProps = {
	token: '',
};

class UpdateYourPassword extends Component {
	componentDidMount = () => {
		document.title = `${config.APP.TITLE}: ${routes.UPDATE_YOUR_PASSWORD.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.UPDATE_YOUR_PASSWORD.META.KEYWORDS);
			meta.description.setAttribute('content', routes.UPDATE_YOUR_PASSWORD.META.DESCRIPTION);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}
	};

	render = () => (
		<Row className="d-flex flex-md-row flex-column update-your-password-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href={routes.HOME.URI} title={config.APP.TITLE}><img src={config.APP.LOGO} alt={config.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{routes.UPDATE_YOUR_PASSWORD.CONTENT.WELCOME}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				{(this.props.token === 'login') ? (
					<div className="panel-page">
						<a href={routes.HOME.URI} title={routes.HOME.TITLE} className="panel-page__link"><i className="fa fa-fw fa-arrow-circle-left" aria-hidden="true"></i> Back to {routes.HOME.TITLE}</a>
						<a href={routes.REGISTER.URI} title={routes.REGISTER.TITLE} className="panel-page__link pull-right">{routes.REGISTER.TITLE}</a>
						<div className="card panel-page__content">
							<h2 className="h5--title-card">{routes.LOGIN.TITLE}</h2>
							<Alert color="success" message="Your password was updated successfully. You can now login below." />
							<LoginForm history={this.props.history} />
						</div>
					</div>
				) : (
					<div className="panel-page">
						<a href={routes.LOGIN.URI} title={routes.LOGIN.TITLE} className="panel-page__link">Back to {routes.LOGIN.TITLE}</a>
						<div className="card panel-page__content">
							<h2 className="h5--title-card">{routes.UPDATE_YOUR_PASSWORD.TITLE}</h2>
							<UpdateYourPasswordForm token={this.props.token} email={queryString.parse(this.props.location.search).email} history={this.props.history} />
						</div>
					</div>
				)}
			</Col>
		</Row>
	);
}

UpdateYourPassword.propTypes = propTypes;

UpdateYourPassword.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	token: props.match.params.token,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateYourPassword);
