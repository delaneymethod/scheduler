/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, Row, Button, FormGroup, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import * as authenticationActions from '../actions/authenticationActions';

class Login extends Component {
	constructor(props) {
		super(props);

		if (this.props.authenticated) {
			this.props.history.push('/dashboard');
		}

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState = () => ({
		username: '',
		password: '',
		errorMessage: '',
	})

	handleChange = (event) => {
		const target = event.currentTarget;

		this.form.validateFields(target);

		this.setState({
			[target.name]: target.value,
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();

		this.form.validateFields();

		if (this.form.isValid()) {
			const credentials = {
				username: this.state.username,
				password: this.state.password,
			};

			this.props.actions.login(credentials)
				.then((response) => {
					this.setState(this.getInitialState());

					// FIXME: This should really contain the authenticated users details - id, first name, account info etc etc.
					// - TODO: save the authenticated users details

					// -- TODO: Grab the access token, refresh token and expires values from the response
					// -- sessionStorage.addItem('access_token', response.access_token);

					// TODO: Redirect to dashboard
					this.props.history.push('/dashboard');
				})
				.catch(error => this.setState({ errorMessage: error.data.message }));
		}
	}

	errorMessage = () => (this.state.errorMessage ? <p className="text-danger">{this.state.errorMessage}</p> : '');

	render = () => (
		<Row>
			<Col>
				<h2>Login</h2>
				{this.errorMessage()}
				<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
					<FormGroup>
						<Label for="username">Username</Label>
						<Input type="text" name="username" id="username" value={this.state.username} placeholder="e.g. giggrafter" onChange={this.handleChange} required />
						<FieldFeedbacks for="username" show="all">
							<FieldFeedback when="valueMissing" />
						</FieldFeedbacks>
					</FormGroup>
					<FormGroup>
						<Label for="password">Password</Label>
						<Input type="password" name="password" id="password" value={this.state.password} placeholder="e.g. y1Fwc]_C" onChange={this.handleChange} required pattern=".{10,}" />
						<FieldFeedbacks for="password" show="all">
							<FieldFeedback when="valueMissing" />
							<FieldFeedback when="patternMismatch">Should be at least 10 characters long</FieldFeedback>
						</FieldFeedbacks>
					</FormGroup>
					<Button>Submit</Button>
				</FormWithConstraints>
			</Col>
		</Row>
	);
}

Login.propTypes = {
	ajaxLoading: PropTypes.bool.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
	ajaxLoading: state.ajaxLoading,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(authenticationActions, dispatch),
});

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Login));
