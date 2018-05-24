import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { FormWithConstraints } from 'react-form-with-constraints';
import { Col, Row, Label, Input, Button, FormGroup } from 'reactstrap';

import constants from '../../helpers/constants';

import { updateUser } from '../../actions/userActions';

import { login } from '../../actions/authenticationActions';

import ErrorMessage from '../common/ErrorMessage';

import EmailField from '../fields/EmailField';

import PasswordField from '../fields/PasswordField';

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

		/*
		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	}

	getInitialState = () => ({
		email: '',
		errors: [],
		password: '',
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

		this.setState({ errors: [] });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const payload = {
				email: this.state.email,
				password: this.state.password,
			};

			this.props.actions.login(payload)
				.then(() => {
					/* The tokens subject contains the users Id */
					const token = jwtDecode(this.props.user.token);

					this.props.user.userId = token.sub;

					/* Use the first account as the selected account */
					const [account] = this.props.user.accounts;

					this.props.user.account = account;

					/* Update the user state and then go to the dashboard */
					this.props.actions.updateUser(this.props.user).then(() => this.props.history.push(routes.DASHBOARD.HOME.URI));
				})
				.catch((error) => {
					const { errors } = this.state;

					errors.push(error);

					this.setState({ errors });
				});
		}
	};

	errorMessages = () => ((this.state.errors.length) ? this.state.errors.map((error, index) => <ErrorMessage key={index} error={error.data} />) : '');

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
						{this.errorMessages()}
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
