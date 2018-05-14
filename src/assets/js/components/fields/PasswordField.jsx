import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Label, Input, Button, FormGroup } from 'reactstrap';
import { Async, FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

import PasswordStrengthMeter from '../common/PasswordStrengthMeter';

import isPasswordCommon from '../../helpers/isPasswordCommon';

const propTypes = {
	minLength: PropTypes.number,
	showPasswordCommon: PropTypes.any,
	showPasswordStrength: PropTypes.any,
	fieldName: PropTypes.string.isRequired,
	fieldValue: PropTypes.string.isRequired,
	fieldLabel: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
};

const defaultProps = {
	minLength: 3,
	fieldName: '',
	fieldValue: '',
	fieldLabel: '',
	handleChange: () => {},
	showPasswordCommon: null,
	showPasswordStrength: null,
};

class PasswordField extends Component {
	constructor(props) {
		super(props);

		this.handleToggle = this.handleToggle.bind(this);
	}

	handleToggle = (event) => {
		const input = document.querySelector(`input[id=${this.props.fieldName}]`);

		const icon = document.querySelector(`i[id=${this.props.fieldName}-fa]`);

		if (input.getAttribute('type') === 'password') {
			input.setAttribute('type', 'text');

			icon.classList.add('fa-eye');
			icon.classList.remove('fa-eye-slash');
		} else {
			input.setAttribute('type', 'password');

			icon.classList.remove('fa-eye');
			icon.classList.add('fa-eye-slash');
		}
	};

	render = () => (
		<FormGroup>
			<Label for={this.props.fieldName}>{this.props.fieldLabel}</Label>
			<div className="input-group">
				<Input type="password" name={this.props.fieldName} id={this.props.fieldName} value={this.props.fieldValue} placeholder="e.g. y1Fwc]_C" autoComplete="off" onChange={this.props.handleChange} required pattern={`.{${this.props.minLength},}`} />
				<div className="input-group-append">
					<Button color="light" title="Toggle Value" className="input-group-text" onClick={this.handleToggle}><i className="fa fa-eye-slash text-primary" id={this.props.fieldName.concat('-fa')} aria-hidden="true"></i></Button>
				</div>
			</div>
			{(this.props.showPasswordStrength && this.props.fieldName === 'password' && this.props.fieldValue.length >= this.props.minLength) ? (
				<PasswordStrengthMeter password={this.props.fieldValue} />
			) : null}
			<FieldFeedbacks for={this.props.fieldName} show="all">
				<FieldFeedback when="valueMissing">- Please provide a valid password.</FieldFeedback>
				<FieldFeedback when="patternMismatch">- Should be at least {this.props.minLength} characters long.</FieldFeedback>
			</FieldFeedbacks>
			{(this.props.showPasswordCommon && this.props.fieldName === 'password') ? (
				<FieldFeedbacks for="password" show="all">
					<Async promise={isPasswordCommon} then={commonPassword => (commonPassword ? <FieldFeedback warning>- Password is very common.</FieldFeedback> : null)} />
				</FieldFeedbacks>
			) : null}
			{(this.props.fieldName === 'confirmPassword') ? (
				<FieldFeedbacks for="confirmPassword" show="all">
					<FieldFeedback when={value => value !== document.getElementById('password').value}>- Passwords must match.</FieldFeedback>
				</FieldFeedbacks>
			) : null}
		</FormGroup>
	);
}

PasswordField.propTypes = propTypes;

PasswordField.defaultProps = defaultProps;

export default PasswordField;
