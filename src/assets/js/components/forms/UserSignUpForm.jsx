import delay from 'lodash/delay';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';

import React, { Fragment, Component } from 'react';
import { toast } from 'react-toastify';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import TextField from '../fields/TextField';

import logMessage from '../../helpers/logging';

import scrollToTop from '../../helpers/animations';

import PasswordField from '../fields/PasswordField';

import scriptCache from '../../helpers/scriptCache';

import Notification from '../common/Notification';

import { userSignUp } from '../../actions/authenticationActions';

import { getSubscriptionLevels } from '../../actions/subscriptionLevelActions';

const routes = config.APP.ROUTES;

const notifications = config.APP.NOTIFICATIONS;

class UserSignUpForm extends Component {
	constructor(props) {
		super(props);

		if (!this.props.code || !this.props.email) {
			this.props.history.push(routes.HOME.URI);
		}

		this.form = null;

		this.toastId = null;

		this.scriptCache = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState = () => ({
		code: this.props.code,
		email: this.props.email,
		error: {},
		password: '',
		lastName: '',
		firstName: '',
		confirmPassword: '',
		termsOfUseAgreed: false,
	});

	componentWillMount = () => {
		this.scriptCache = scriptCache({
			zxcvbn: '/assets/js/zxcvbn.js',
		});
	};

	componentDidMount = () => {
		this.scriptCache.zxcvbn.onLoad(() => logMessage('info', 'Called RegisterForm - zxcvbn was loaded.'));

		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));
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
				code,
				password,
				email,
				termsOfUseAgreed,
			} = this.state;

			const requestData = {
				code,
				password,
				email,
				termsOfUseAgreed: (termsOfUseAgreed === 'on'),
			};

			actions.userSignUp(requestData)
				.then(() => this.handleSuccessNotification())
				.catch(error => this.setState({ error }));

			scrollToTop();
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	handleSuccessNotification = () => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message='Registration Succesful, Please log in using the form below' />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}

		this.props.history.push(routes.LOGIN.URI);
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}

			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>

				<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={6} showPasswordStrength showPasswordCommon fieldRequired={true} />
				<PasswordField fieldLabel="Confirm Password" fieldName="confirmPassword" fieldValue={this.state.confirmPassword} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={7} fieldRequired={true} />
				<FormGroup check>
					<Row>
						<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 mt-2 mb-2">
							<Input type="checkbox" name="termsOfUseAgreed" id="termsOfUseAgreed" className="form-check-input align-midde p-0 m-0 mr-2" onChange={this.handleChange} onBlur={this.handleBlur} tabIndex={8} required />
						</Col>
						<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 mt-2 mb-2">
							<Label check for="termsOfUseAgreed" className="p-0 m-0 terms-of-use-agreed">{routes.REGISTER.CONTENT.TERMS_OF_USE_AGREED} <a href={routes.TERMS_OF_SERVICE.URI} title={routes.TERMS_OF_SERVICE.TITLE} target="_blank" className="text-secondary">{routes.TERMS_OF_SERVICE.TITLE}</a>.</Label>
						</Col>
						<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-0">
							<FieldFeedbacks for="termsOfUseAgreed" show="all">
								<FieldFeedback when="*">- Please read and accept the {routes.TERMS_OF_SERVICE.TITLE}.</FieldFeedback>
							</FieldFeedbacks>
						</Col>
					</Row>
				</FormGroup>
				<Button type="submit" color="primary" className="mt-4" id="submitRegister" title={routes.REGISTER.TITLE} tabIndex="9" disabled={this.state.emailSent} block>{routes.REGISTER.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}


const mapStateToProps = (state, props) => ({
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ userSignUp, getSubscriptionLevels }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSignUpForm);
