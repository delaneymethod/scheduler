import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, Row, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import constants from '../../helpers/constants';

import { forgottenYourPassword } from '../../actions/authenticationActions';

import ErrorMessage from '../common/ErrorMessage';

import SuccessMessage from '../common/SuccessMessage';

import EmailField from '../fields/EmailField';

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

		if (this.props.authenticated) {
			this.props.history.push(routes.DASHBOARD.HOME.URI);
		}

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		document.title = `${constants.APP.TITLE}: ${routes.FORGOTTEN_YOUR_PASSWORD.TITLE}`;

		/*
		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	}

	getInitialState = () => ({
		email: '',
		errors: [],
		emailSent: false,
	});

	handleChange = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		await this.form.validateFields(target);
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ errors: [], emailSent: false });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const payload = {
				email: this.state.email,
			};

			this.props.actions.forgottenYourPassword(payload)
				.then(() => this.setState(Object.assign(this.getInitialState(), { emailSent: true })))
				.catch((error) => {
					const { errors } = this.state;

					errors.push(error);

					this.setState({ errors });
				});
		}
	};

	errorMessages = () => ((this.state.errors.length) ? this.state.errors.map((error, index) => <ErrorMessage key={index} error={error.data} />) : '');

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
						{this.errorMessages()}
						{(this.state.emailSent) ? <SuccessMessage message={`An email has been sent to <strong>${this.state.email}</strong>. Please follow the link in this email message to set your password.`} /> : ''}
						<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
							<EmailField fieldValue={this.state.email} handleChange={this.handleChange} />
							<Button type="submit" color="primary" className="mt-4" title={routes.FORGOTTEN_YOUR_PASSWORD.TITLE} block>{routes.FORGOTTEN_YOUR_PASSWORD.TITLE}</Button>
						</FormWithConstraints>
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

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ forgottenYourPassword }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenYourPassword);
