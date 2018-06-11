import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import EmailField from '../fields/EmailField';

import constants from '../../helpers/constants';

import { forgottenYourPassword } from '../../actions/authenticationActions';

const routes = constants.APP.ROUTES;

const propTypes = {};

const defaultProps = {};

class ForgottenYourPasswordForm extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState = () => ({
		error: {},
		email: '',
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

		const { actions } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const payload = {
				email: this.state.email,
			};

			console.log('Called ForgottenYourPasswordForm handleSubmit forgottenYourPassword');
			actions.forgottenYourPassword(payload)
				.then(() => this.setState(Object.assign(this.getInitialState(), { emailSent: true })))
				.catch(error => this.setState({ error }));
		}
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	successMessage = () => (this.state.emailSent ? <Alert color="success" message={`An email has been sent to <strong>${this.state.email}</strong>. Please follow the link in this email message to set your password.`} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} tabIndex="1" />
				<Button type="submit" color="primary" className="mt-4" title={routes.FORGOTTEN_YOUR_PASSWORD.TITLE} tabIndex="2" block>{routes.FORGOTTEN_YOUR_PASSWORD.TITLE}</Button>
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
