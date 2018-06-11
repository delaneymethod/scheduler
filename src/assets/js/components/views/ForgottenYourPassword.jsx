import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import constants from '../../helpers/constants';

import ForgottenYourPasswordForm from '../forms/ForgottenYourPasswordForm';

const routes = constants.APP.ROUTES;

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class ForgottenYourPassword extends Component {
	constructor(props) {
		super(props);

		const { history, authenticated } = this.props;

		if (authenticated) {
			history.push(routes.DASHBOARD.HOME.URI);
		}
	}

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.FORGOTTEN_YOUR_PASSWORD.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.FORGOTTEN_YOUR_PASSWORD.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.FORGOTTEN_YOUR_PASSWORD.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	};

	render = () => (
		<Row className="d-flex flex-md-row flex-column forgotten-your-password-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href={routes.HOME.URI} title={constants.APP.TITLE}><img src={constants.APP.LOGO} alt={constants.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{routes.LOGIN.MESSAGE}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<a href={routes.LOGIN.URI} title={routes.LOGIN.TITLE} className="panel-page__link">Back to {routes.LOGIN.TITLE}</a>
					<div className="card panel-page__content">
						<h2 className="h5--title-card">{routes.FORGOTTEN_YOUR_PASSWORD.TITLE}</h2>
						<ForgottenYourPasswordForm />
					</div>
				</div>
			</Col>
		</Row>
	);
}

ForgottenYourPassword.propTypes = propTypes;

ForgottenYourPassword.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenYourPassword);
