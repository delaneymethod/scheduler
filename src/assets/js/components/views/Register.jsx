/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Alert, Col, Row, Button, FormGroup, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import { register } from '../../actions/authenticationActions';

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
			this.props.history.push('/dashboard');
		}

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState = () => ({
		email: '',
		errors: [],
		password: '',
		lastName: '',
		firstName: '',
		businessName: '',
		confirmPassword: '',
		/* FIXME - default subscription level to 1. Eventually based on chosen subscription plan, */
		/* for now there is only 1 */
		subscriptionLevel: 1,
	});

	componentDidMount = () => {
		document.title = 'Scheduler: Register';

		/*
		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	};

	componentDidUpdate = prevProps => ({});

	handleChange = (event) => {
		const target = event.currentTarget;

		this.form.validateFields(target);

		this.setState({
			[target.name]: target.value,
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();

		this.setState({ errors: [] });

		this.form.validateFields();

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
				.then((response) => {
					this.setState(this.getInitialState());

					this.props.history.push('/dashboard/welcome');
				})
				.catch((error) => {
					const { errors } = this.state;

					errors.push({
						title: error.data.error,
						message: error.data.message,
					});

					this.setState({ errors });
				});
		}
	};

	errorMessages = () => {
		if (this.state.errors.length) {
			return this.state.errors.map((error, index) => <Alert color="danger" key={index}><strong>{error.title}</strong><br />{error.message}</Alert>);
		}

		return '';
	};

	render = () => (
		<Row className="d-flex flex-md-row flex-column register-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href="/" title="Scheduler"><img src="/assets/img/scheduler-logo.svg" alt="Scheduler Logo" className="mb-4" /></a></h1>
					<p className="h5 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta velit in lectus efficitur hendrerit. Quisque cursus arcu sollicitudin rhoncus molestie. Donec at rhoncus enim, ut rhoncus lacus. Sed eget felis est.</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<a href="/login" title="Already a member? Log In" className="panel-page__link float-right">Already a member? Log In</a>
					<div className="card panel-page__content">
						<h2 className="h5--title-card">Register</h2>
						{this.errorMessages()}
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
							<EmailField emailValue={this.state.email} handleChange={this.handleChange} />
							<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChange} />
							<PasswordField fieldLabel="Confirm Password" fieldName="confirmPassword" fieldValue={this.state.confirmPassword} handleChange={this.handleChange} />
							<Button type="submit" color="primary" className="mt-4" title="Register" block>Register</Button>
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
