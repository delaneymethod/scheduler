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
	email: PropTypes.string.isRequired,
};

const defaultProps = {
	token: '',
	email: '',
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
		password: '',
		confirmPassword: '',
	});

	componentDidMount = () => {
		const { token, email } = this.props;

		this.setState({ token, email });

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

		const { actions, history } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const { email, token, password } = this.state;

			const payload = {
				email,
				token,
				password,
			};

			console.log('Called UpdateYourPasswordForm handleSubmit updateYourPassword');
			actions.updateYourPassword(payload)
				.then(() => history.push(`${routes.UPDATE_YOUR_PASSWORD.URI}/login`))
				.catch(error => this.setState({ error }));
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={1} fieldAutoComplete={'on'} fieldRequired={true} />
				<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={2} showPasswordStrength showPasswordCommon fieldRequired={true} />
				<PasswordField fieldLabel="Confirm Password" fieldName="confirmPassword" fieldValue={this.state.confirmPassword} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={3} fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-4" title={routes.UPDATE_YOUR_PASSWORD.TITLE} tabIndex="3" block>{routes.UPDATE_YOUR_PASSWORD.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

UpdateYourPasswordForm.propTypes = propTypes;

UpdateYourPasswordForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	token: props.token,
	email: props.email,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ updateYourPassword }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateYourPasswordForm);
