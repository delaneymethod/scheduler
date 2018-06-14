import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
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
	subscriptionLevels: PropTypes.array.isRequired,
};

const defaultProps = {
	subscriptionLevels: [],
};

class RegisterForm extends Component {
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

		console.log('Called RegisterForm componentDidMount getSubscriptionLevels');
		actions.getSubscriptionLevels().catch(error => this.setState({ error }));
	};

	componentWillReceiveProps = (nextProps) => {
		/* Used to set a default the subscription level id value after the getSubscriptionLevels action has completed */
		if (nextProps.subscriptionLevels.length > 0) {
			this.setState({ subscriptionLevelId: nextProps.subscriptionLevels.map(({ subscriptionLevelId }) => subscriptionLevelId).toString() });
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

			console.log('Called RegisterForm handleSubmit register');
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
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				{(this.props.subscriptionLevels.length > 0) ? (
					<FormGroup>
						<Label for="subscriptionLevelId">Subscription Type</Label>
						<Input type="select" name="subscriptionLevelId" id="subscriptionLevelId" className="custom-select custom-select-xl" onChange={this.handleChange} tabIndex="1" required>
							{this.props.subscriptionLevels.map((subscriptionLevel, index) => <option key={index} value={subscriptionLevel.subscriptionLevelId} label={subscriptionLevel.subscriptionLevelName} />)}
						</Input>
						<FieldFeedbacks for="subscriptionLevelId" show="all">
							<FieldFeedback when="*">- Please select a subscription.</FieldFeedback>
						</FieldFeedbacks>
					</FormGroup>
				) : null}
				<TextField fieldName="businessName" fieldLabel="Business Name" fieldValue={this.state.businessName} fieldPlaceholder="e.g. Gig Grafter.com" handleChange={this.handleChange} valueMissing="Please provide a valid business name." tabIndex="2" fieldRequired={true} />
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<TextField fieldName="firstName" fieldLabel="First Name" fieldValue={this.state.firstName} fieldPlaceholder="e.g. Barry" handleChange={this.handleChange} valueMissing="Please provide a valid first name." tabIndex="3" fieldRequired={true} />
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<TextField fieldName="lastName" fieldLabel="Last Name" fieldValue={this.state.lastName} fieldPlaceholder="e.g. Lynch" handleChange={this.handleChange} valueMissing="Please provide a valid last name." tabIndex="4" fieldRequired={true} />
					</Col>
				</Row>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} tabIndex="5" fieldRequired={true} />
				<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChangePassword} tabIndex="6" showPasswordStrength showPasswordCommon fieldRequired={true} />
				<PasswordField fieldLabel="Confirm Password" fieldName="confirmPassword" fieldValue={this.state.confirmPassword} handleChange={this.handleChange} tabIndex="7" fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-4" title={routes.REGISTER.TITLE} tabIndex="8" block>{routes.REGISTER.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

RegisterForm.propTypes = propTypes;

RegisterForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	subscriptionLevels: state.subscriptionLevels,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ register, getSubscriptionLevels }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
