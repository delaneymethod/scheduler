import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, Row, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import constants from '../../helpers/constants';

import { register } from '../../actions/authenticationActions';

import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';

import TextField from '../fields/TextField';
import EmailField from '../fields/EmailField';
import PasswordField from '../fields/PasswordField';

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Register extends Component {
	constructor(props) {
		super(props);

		if (this.props.authenticated) {
			this.props.history.push(constants.APP.ROUTES.DASHBOARD.HOME.URI);
		}

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChangePassword = this.handleChangePassword.bind(this);

		document.title = `${constants.APP.TITLE}: ${constants.APP.ROUTES.REGISTER.TITLE}`;

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
		password: '',
		lastName: '',
		firstName: '',
		businessName: '',
		emailSent: false,
		confirmPassword: '',
		subscriptionLevel: 1,
	});

	handleChange = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		await this.form.validateFields(target);
	};

	handleChangePassword = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		/* We want to validate the target field and the password confirmation field */
		await this.form.validateFields(target, 'confirmPassword');
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ errors: [], emailSent: false });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const payload = {
				email: this.state.email,
				password: this.state.password,
				lastName: this.state.lastName,
				firstName: this.state.firstName,
				businessName: this.state.businessName,
				subscriptionLevel: this.state.subscriptionLevel,
			};

			this.props.actions.register(payload)
				.then(() => {
					this.setState({
						password: '',
						lastName: '',
						firstName: '',
						emailSent: true,
						businessName: '',
						confirmPassword: '',
						subscriptionLevel: 1,
					});
				})
				.catch((error) => {
					const { errors } = this.state;

					errors.push(error);

					this.setState({ errors });
				});
		}
	};

	errorMessages = () => ((this.state.errors.length) ? this.state.errors.map((error, index) => <ErrorMessage key={index} error={error.data} />) : '');

	render = () => (
		<Row className="d-flex flex-md-row flex-column register-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href={constants.APP.ROUTES.HOME.URI} title={constants.APP.TITLE}><img src={constants.APP.LOGO} alt={constants.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{constants.APP.ROUTES.REGISTER.MESSAGE}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<a href={constants.APP.ROUTES.LOGIN.URI} title={constants.APP.ROUTES.LOGIN.TITLE} className="panel-page__link float-right">Already a member? {constants.APP.ROUTES.LOGIN.TITLE}</a>
					<div className="card panel-page__content">
						<h2 className="h5--title-card">{constants.APP.ROUTES.REGISTER.TITLE}</h2>
						{this.errorMessages()}
						{(this.state.emailSent) ? <SuccessMessage message={`An email has been sent to <strong>${this.state.email}</strong>. Please follow the link in this email message to verify your account and complete registration.`} /> : ''}
						<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
							<TextField fieldName="businessName" fieldLabel="Business Name" fieldValue={this.state.businessName} fieldPlaceholder="e.g. Gig Grafter.com" handleChange={this.handleChange} valueMissing="Please provide a valid business name." />
							<Row>
								<Col xs="12" sm="12" md="12" lg="6" xl="6">
									<TextField fieldName="firstName" fieldLabel="First Name" fieldValue={this.state.firstName} fieldPlaceholder="e.g. Barry" handleChange={this.handleChange} valueMissing="Please provide a valid first name." />
								</Col>
								<Col xs="12" sm="12" md="12" lg="6" xl="6">
									<TextField fieldName="lastName" fieldLabel="Last Name" fieldValue={this.state.lastName} fieldPlaceholder="e.g. Lynch" handleChange={this.handleChange} valueMissing="Please provide a valid last name." />
								</Col>
							</Row>
							<EmailField fieldValue={this.state.email} handleChange={this.handleChange} />
							<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChangePassword} showPasswordStrength showPasswordCommon />
							<PasswordField fieldLabel="Confirm Password" fieldName="confirmPassword" fieldValue={this.state.confirmPassword} handleChange={this.handleChange} />
							<Button type="submit" color="primary" className="mt-4" title={constants.APP.ROUTES.REGISTER.TITLE} block>{constants.APP.ROUTES.REGISTER.TITLE}</Button>
						</FormWithConstraints>
					</div>
				</div>
			</Col>
		</Row>
	);
}

Register.propTypes = propTypes;

Register.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ register }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
