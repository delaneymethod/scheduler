import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, Row, Button } from 'reactstrap';
import { FormWithConstraints } from 'react-form-with-constraints';

import EmailField from '../fields/EmailField';

import constants from '../../helpers/constants';

import PasswordField from '../fields/PasswordField';

import { updateUser } from '../../actions/userActions';

import { login } from '../../actions/authenticationActions';

import NotificationAlert from '../common/NotificationAlert';

const routes = constants.APP.ROUTES;

const propTypes = {
	user: PropTypes.object.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	user: {},
	authenticated: false,
};

class Login extends Component {
	constructor(props) {
		super(props);

		if (this.props.authenticated) {
			this.props.history.push(routes.DASHBOARD.HOME.URI);
		}

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		document.title = `${constants.APP.TITLE}: ${routes.LOGIN.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.LOGIN.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.LOGIN.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	}

	getInitialState = () => ({
		error: {},
		email: '',
		password: '',
	});

	componentWillReceiveProps = (nextProps) => {
		/* Used to update the user info in the store after the login action has completed */
		const { user } = nextProps;

		if (user) {
			/* The tokens subject contains the users Id */
			const token = jwtDecode(user.token);

			user.userId = token.sub;

			/* Use the first account as the selected account */
			const [account] = user.accounts;

			user.account = account;

			/* Update the user state and then go to the dashboard */
			nextProps.actions.updateUser(user).then(() => nextProps.history.push(routes.DASHBOARD.HOME.URI));
		}
	};

	handleChange = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		await this.form.validateFields(target);
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const payload = {
				email: this.state.email,
				password: this.state.password,
			};

			this.props.actions.login(payload)
				.then(() => this.setState(this.getInitialState()))
				.catch(error => this.setState({ error }));
		}
	};

	errorMessage = () => (this.state.error.data ? <NotificationAlert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	render = () => (
		<Row className="d-flex flex-md-row flex-column login-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href={routes.HOME.URI} title={constants.APP.TITLE}><img src={constants.APP.LOGO} alt={constants.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{routes.LOGIN.MESSAGE}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<a href={routes.REGISTER.URI} title={routes.REGISTER.TITLE} className="panel-page__link">Back to {routes.REGISTER.TITLE}</a>
					<div className="card panel-page__content">
						<h2 className="h5--title-card">{routes.LOGIN.TITLE}</h2>
						{this.errorMessage()}
						<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
							<EmailField fieldValue={this.state.email} handleChange={this.handleChange} />
							<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChange} />
							<Button type="submit" color="primary" className="mt-4" title={routes.LOGIN.TITLE} block>{routes.LOGIN.TITLE}</Button>
							<a href={routes.FORGOTTEN_YOUR_PASSWORD.URI} title={routes.FORGOTTEN_YOUR_PASSWORD.TITLE} className="panel-page__forgot">{routes.FORGOTTEN_YOUR_PASSWORD.TITLE}</a>
						</FormWithConstraints>
					</div>
				</div>
			</Col>
		</Row>
	);
}

Login.propTypes = propTypes;

Login.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ login, updateUser }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
