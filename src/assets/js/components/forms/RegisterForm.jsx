import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import TextField from '../fields/TextField';

import EmailField from '../fields/EmailField';

import constants from '../../helpers/constants';

import scrollToTop from '../../helpers/animations';

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

		this.form = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);
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
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));

		const { actions } = this.props;

		console.log('Called RegisterForm componentDidMount getSubscriptionLevels');
		actions.getSubscriptionLevels()
			.then((subscriptionLevels) => {
				/* Used to set a default the subscription level id value after the getSubscriptionLevels action has completed */
				if (subscriptionLevels.length > 0) {
					this.setState({ subscriptionLevelId: subscriptionLevels.map(({ subscriptionLevelId }) => subscriptionLevelId).toString() });
				}
			})
			.catch(error => this.setState({ error }));
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

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
				subscriptionLevelId,
			};

			console.log('Called RegisterForm handleSubmit register');
			actions.register(payload)
				.then(() => this.setState(Object.assign(this.getInitialState(), { email, emailSent: true })))
				.catch(error => this.setState({ error }));

			scrollToTop();
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	successMessage = () => (this.state.emailSent ? <Alert color="success" message={`An email has been sent to <strong>${this.state.email}</strong>. Please follow the link in this email message to verify your account and complete registration.`} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				{(this.props.subscriptionLevels.length > 0) ? (
					<FormGroup>
						<Label for="subscriptionLevelId">Subscription Type</Label>
						<Input type="select" name="subscriptionLevelId" id="subscriptionLevelId" className="custom-select custom-select-xl" onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="1" required>
							{this.props.subscriptionLevels.map((subscriptionLevel, index) => <option key={index} value={subscriptionLevel.subscriptionLevelId} label={subscriptionLevel.subscriptionLevelName}>{subscriptionLevel.subscriptionLevelName}</option>)}
						</Input>
						<FieldFeedbacks for="subscriptionLevelId" show="all">
							<FieldFeedback when="*">- Please select a subscription.</FieldFeedback>
						</FieldFeedbacks>
					</FormGroup>
				) : null}
				<TextField fieldName="businessName" fieldLabel="Business Name" fieldValue={this.state.businessName} fieldPlaceholder="e.g. Steak & Grill Bar" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid business name." fieldTabIndex={2} fieldAutoComplete={'on'} fieldRequired={true} />
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<TextField fieldName="firstName" fieldLabel="First Name" fieldValue={this.state.firstName} fieldPlaceholder="e.g. Jane" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid first name." fieldTabIndex={3} fieldAutoComplete={'on'} fieldRequired={true} />
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<TextField fieldName="lastName" fieldLabel="Last Name" fieldValue={this.state.lastName} fieldPlaceholder="e.g. Smith" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid last name." fieldTabIndex={4} fieldAutoComplete={'on'} fieldRequired={true} />
					</Col>
				</Row>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={5} fieldRequired={true} />
				<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={6} showPasswordStrength showPasswordCommon fieldRequired={true} />
				<PasswordField fieldLabel="Confirm Password" fieldName="confirmPassword" fieldValue={this.state.confirmPassword} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={7} fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-4" title={routes.REGISTER.TITLE} tabIndex="8" disabled={this.state.emailSent} block>{routes.REGISTER.TITLE}</Button>
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
