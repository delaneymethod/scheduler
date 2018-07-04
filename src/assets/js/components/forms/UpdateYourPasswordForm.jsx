import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import EmailField from '../fields/EmailField';

import PasswordField from '../fields/PasswordField';

import constants from '../../helpers/constants';

import { updateYourPassword } from '../../actions/authenticationActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	token: PropTypes.string.isRequired,
};

const defaultProps = {
	token: '',
};

class UpdateYourPasswordForm extends Component {
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
		token: '',
		email: '',
		newPassword: '',
		emailSent: false,
	});

	componentDidMount = () => {
		const { token } = this.props;

		this.setState({ token });

		/* We debounce this call to wait 1000ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1000);
	};

	handleChange = (event) => {
		this.setState({ error: {}, emailSent: false });

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
			const { email, token, newPassword } = this.state;

			const payload = {
				email,
				token,
				newPassword,
			};

			/* eslint-disable no-param-reassign */
			console.log('Called UpdateYourPasswordForm handleSubmit updateYourPassword');
			actions.updateYourPassword(payload)
				.then(() => this.setState(Object.assign(this.getInitialState(), { emailSent: true })))
				.catch((error) => {
					/* Set a more friendlier error message if its a 404 */
					if (error.data.code === 404) {
						error.data.message = routes.UPDATE_YOUR_PASSWORD.MESSAGES.NOT_FOUND;
					}

					this.setState({ error });
				});
			/* eslint-enable no-param-reassign */
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	successMessage = () => (this.state.emailSent ? <Alert color="success" message={'Password was updated successfully.'} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={1} fieldRequired={true} />
				<PasswordField fieldLabel="Password" fieldName="newPassword" fieldValue={this.state.newPassword} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={2} showPasswordStrength showPasswordCommon fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-4" title={routes.UPDATE_YOUR_PASSWORD.TITLE} tabIndex="3" disabled={this.state.emailSent} block>{routes.UPDATE_YOUR_PASSWORD.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

UpdateYourPasswordForm.propTypes = propTypes;

UpdateYourPasswordForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	token: props.token,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ updateYourPassword }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateYourPasswordForm);
