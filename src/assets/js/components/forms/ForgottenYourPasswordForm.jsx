import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { delay, debounce } from 'lodash';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import EmailField from '../fields/EmailField';

import scriptCache from '../../helpers/scriptCache';

import { forgottenYourPassword } from '../../actions/authenticationActions';

const routes = config.APP.ROUTES;

const propTypes = {};

const defaultProps = {};

class ForgottenYourPasswordForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.scriptCache = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState = () => ({
		error: {},
		email: '',
		emailSent: false,
	});

	componentWillMount = () => {
		this.scriptCache = scriptCache({
			zxcvbn: '/assets/js/zxcvbn.js',
		});
	};

	componentDidMount = () => {
		this.scriptCache.zxcvbn.onLoad(() => console.log('Called ForgottenYourPasswordForm - zxcvbn was loaded.'));

		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			error: {},
			emailSent: false,
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
			const payload = {
				email: this.state.email,
			};

			console.log('Called ForgottenYourPasswordForm handleSubmit forgottenYourPassword');
			actions.forgottenYourPassword(payload)
				.then(() => this.setState(Object.assign(this.getInitialState(), { email: payload.email, emailSent: true }), () => delay(() => this.form.reset(), 30)))
				.catch(error => this.setState({ error }));
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	successMessage = () => (this.state.emailSent ? <Alert color="success" message={`An email has been sent to <strong>${this.state.email}</strong>. Please follow the link in this email message to set your password.`} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={1} fieldAutoComplete={'on'} fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-4" title={routes.FORGOTTEN_YOUR_PASSWORD.TITLE} tabIndex="2" disabled={this.state.emailSent} block>{routes.FORGOTTEN_YOUR_PASSWORD.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

ForgottenYourPasswordForm.propTypes = propTypes;

ForgottenYourPasswordForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ forgottenYourPassword }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenYourPasswordForm);
