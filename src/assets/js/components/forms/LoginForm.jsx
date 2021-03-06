import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import EmailField from '../fields/EmailField';

import logMessage from '../../helpers/logging';

import PasswordField from '../fields/PasswordField';

import { updateUser } from '../../actions/userActions';

import { login } from '../../actions/authenticationActions';

const routes = config.APP.ROUTES;

const propTypes = {
	user: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	user: {},
	employees: [],
	authenticated: false,
};

class LoginForm extends Component {
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
	});

	componentDidMount = () => {
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
			const { email, password } = this.state;

			const payload = {
				email,
				password,
			};

			logMessage('info', 'Called Login handleSubmit login');

			actions.login(payload)
				.then((user) => {
					/* The tokens subject contains the users Id */
					const token = jwtDecode(user.token);

					user.userId = token.sub;

					/* Use the first account as the selected account */
					const [account] = user.accounts;

					user.account = account;

					/* Update the user state and then go to the dashboard */
					logMessage('info', 'Called Login handleSubmit updateUser');

					actions.updateUser(user).then(() => history.push(routes.DASHBOARD.HOME.URI));
				})
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
				<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={2} fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-4" id="submitLogin" title={routes.LOGIN.TITLE} tabIndex="3" block>{routes.LOGIN.TITLE}</Button>
				<a href={routes.FORGOTTEN_YOUR_PASSWORD.URI} title={routes.FORGOTTEN_YOUR_PASSWORD.TITLE} id="forgot" className="panel-page__forgot" tabIndex="-1">{routes.FORGOTTEN_YOUR_PASSWORD.TITLE}</a>
			</FormWithConstraints>
		</Fragment>
	);
}

LoginForm.propTypes = propTypes;

LoginForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
	employees: state.employees,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ login, updateUser }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
