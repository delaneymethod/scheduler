/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import BlockUi from 'react-block-ui';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Alert, Col, Row, Button, FormGroup, Label, Input } from 'reactstrap';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import { login } from '../../actions/authenticationActions';

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
		errors: [],
		username: '',
		password: '',
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
				.then((token) => {
					this.setState(this.getInitialState());

					/* FIXME - Replace with value from response body */
					localStorage.setItem('scheduler:jwt', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiYXJyeS5seW5jaEBnaWdncmFmdGVyLmNvbSIsImV4cCI6MTUyNTM1MjMzN30.9f-vjX7f9VZNT0llfbJl3WFfWwXlKd00zAN9GR89m4U0OVhoXDwixhnz5DKJeba-wZj9XXih0Q7_tdU_Jww_sw');

					this.props.history.push('/dashboard');
				})
				.catch((error) => {
					const { errors } = this.state;

					errors.push({
						title: error.data.error,
						message: error.data.message,
					});

					this.setState({ errors });
				});
		}
	}

	errorMessages = () => {
		if (this.state.errors.length) {
			const errors = this.state.errors.map((error, index) => <Alert color="danger" key={index}><strong>{error.title}</strong><br />{error.message}</Alert>);

			return <div>{errors}</div>;
		}

		return '';
	}

	render = () => (
		<BlockUi tag="div" blocking={this.state.ajaxLoading}>
			<Row>
				<Col>
					<h2>Login</h2>
					{this.errorMessages()}
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
		</BlockUi>
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
	actions: bindActionCreators({ login }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
