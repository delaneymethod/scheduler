import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, Row, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import TextField from '../fields/TextField';

import EmailField from '../fields/EmailField';

import constants from '../../helpers/constants';

import PasswordField from '../fields/PasswordField';

import { register } from '../../actions/authenticationActions';

import { getSubscriptionLevels } from '../../actions/subscriptionLevelActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
	subscriptionLevels: PropTypes.object.isRequired,
};

const defaultProps = {
	authenticated: false,
	subscriptionLevels: {},
};

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChangePassword = this.handleChangePassword.bind(this);
	}

	getInitialState = () => ({
		error: {},
		email: '',
		password: '',
		lastName: '',
		firstName: '',
		businessName: '',
		emailSent: false,
		confirmPassword: '',
		subscriptionLevelId: '',
	});

	componentDidMount = () => {
		const { actions } = this.props;

		actions.getSubscriptionLevels().catch(error => this.setState({ error }));

		document.title = `${constants.APP.TITLE}: ${routes.LOGIN.TITLE}`;

		document.title = `${constants.APP.TITLE}: ${routes.REGISTER.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.REGISTER.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.REGISTER.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	};

	componentWillReceiveProps = (nextProps) => {
		const { history, authenticated } = this.props;

		if (authenticated) {
			history.push(routes.DASHBOARD.HOME.URI);
		}

		/* Used to set a default the subscription level id value after the getSubscriptionLevels action has completed */
		const { subscriptionLevels } = nextProps;

		if (subscriptionLevels) {
			this.setState({ subscriptionLevelId: subscriptionLevels.data.map(({ subscriptionLevelId }) => subscriptionLevelId).toString() });
		}
	};

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

		const { actions } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const {
				email,
				password,
				lastName,
				firstName,
				businessName,
				subscriptionLevelId,
			} = this.state;

			const payload = {
				email,
				password,
				lastName,
				firstName,
				businessName,
				/* FIXME - rename subscriptionLevel to subscriptionLevelId once backend has been updated */
				subscriptionLevel: subscriptionLevelId,
			};

			actions.register(payload)
				.then(() => this.setState(Object.assign(this.getInitialState(), {
					email,
					emailSent: true,
				})))
				.catch(error => this.setState({ error }));
		}
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	successMessage = () => (this.state.emailSent ? <Alert color="success" message={`An email has been sent to <strong>${this.state.email}</strong>. Please follow the link in this email message to verify your account and complete registration.`} /> : null);

	render = () => (
		<Row className="d-flex flex-md-row flex-column register-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href={routes.HOME.URI} title={constants.APP.TITLE}><img src={constants.APP.LOGO} alt={constants.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{routes.REGISTER.MESSAGE}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<a href={routes.LOGIN.URI} title={routes.LOGIN.TITLE} className="panel-page__link float-right">Already a member? {routes.LOGIN.TITLE}</a>
					<div className="card panel-page__content">
						<h2 className="h5--title-card">{routes.REGISTER.TITLE}</h2>
						{this.errorMessage()}
						{this.successMessage()}
						<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
							{(this.props.subscriptionLevels.object === 'list' && this.props.subscriptionLevels.total_count > 0) ? (
								<FormGroup>
									<Label for="subscriptionLevelId">Subscription Type</Label>
									<Input type="select" name="subscriptionLevelId" id="subscriptionLevelId" className="custom-select custom-select-xl" onChange={this.handleChange} required>
										{this.props.subscriptionLevels.data.map((subscriptionLevel, index) => <option key={index} value={subscriptionLevel.subscriptionLevelId} label={subscriptionLevel.subscriptionLevelName} />)}
									</Input>
									<FieldFeedbacks for="subscriptionLevelId" show="all">
										<FieldFeedback when="*">- Please select a subscription.</FieldFeedback>
									</FieldFeedbacks>
								</FormGroup>
							) : null}
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
							<Button type="submit" color="primary" className="mt-4" title={routes.REGISTER.TITLE} block>{routes.REGISTER.TITLE}</Button>
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
	subscriptionLevels: state.subscriptionLevels,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ register, getSubscriptionLevels }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
