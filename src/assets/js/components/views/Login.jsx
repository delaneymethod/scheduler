import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Alert, Col, Row, Button, FormGroup, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import constants from '../../helpers/constants';
import { saveState } from '../../store/persistedState';
import { login } from '../../actions/authenticationActions';

import ErrorMessage from '../ErrorMessage';

import EmailField from '../fields/EmailField';
import PasswordField from '../fields/PasswordField';

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Login extends Component {
	constructor(props) {
		super(props);

		if (this.props.authenticated) {
			this.props.history.push(constants.APP.ROUTES.DASHBOARD.HOME.URI);
		}

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState = () => ({
		email: '',
		errors: [],
		password: '',
	});

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${constants.APP.ROUTES.LOGIN.TITLE}`;

		/*
		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.form.validateFields(target);

		this.setState({
			[target.name]: target.value,
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();

		this.setState({ errors: [] });

		this.form.validateFields();

		if (this.form.isValid()) {
			const payload = {
				email: this.state.email,
				password: this.state.password,
			};

			this.props.actions.login(payload)
				.then((response) => {
					const token = jwtDecode(response.token);

					/* FIXME - Remove conditions once API has been updated with new responses */
					const user = {
						email: (response.email) ? response.email : 'barry.lynch@giggrafter.com',
						userId: (token.sub) ? token.sub : 2,
						firstName: (response.firstName) ? response.firstName : 'Barry',
						accountIds: (response.accountIds) ? response.accountIds : [2],
						/* We select the first account Id as default */
						accountId: (response.accountIds) ? response.accountIds[0] : 2,
					};

					saveState('token', response.token);

					saveState('user', user);

					this.props.history.push(constants.APP.ROUTES.DASHBOARD.HOME.URI);
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
					<h1><a href={constants.APP.ROUTES.HOME.URI} title={constants.APP.TITLE}><img src={constants.APP.LOGO} alt={constants.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{constants.APP.ROUTES.LOGIN.MESSAGE}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<a href={constants.APP.ROUTES.REGISTER.URI} title={constants.APP.ROUTES.REGISTER.TITLE} className="panel-page__link">Back to {constants.APP.ROUTES.REGISTER.TITLE}</a>
					<div className="card panel-page__content">
						<h2 className="h5--title-card">{constants.APP.ROUTES.LOGIN.TITLE}</h2>
						{this.errorMessages()}
						<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
							<EmailField emailValue={this.state.email} handleChange={this.handleChange} />
							<PasswordField fieldLabel="Password" fieldName="password" fieldValue={this.state.password} handleChange={this.handleChange} />
							<Button type="submit" color="primary" className="mt-4" title={constants.APP.ROUTES.LOGIN.TITLE} block>{constants.APP.ROUTES.LOGIN.TITLE}</Button>
							<a href={constants.APP.ROUTES.FORGOTTEN_YOUR_PASSWORD.URI} title={constants.APP.ROUTES.FORGOTTEN_YOUR_PASSWORD.TITLE} className="panel-page__forgot">{constants.APP.ROUTES.FORGOTTEN_YOUR_PASSWORD.TITLE}</a>
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
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ login }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
