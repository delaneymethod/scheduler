import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

const propTypes = {
	fieldName: PropTypes.string.isRequired,
	fieldValue: PropTypes.string.isRequired,
	fieldLabel: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
};

const defaultProps = {
	fieldName: '',
	fieldValue: '',
	fieldLabel: '',
	handleChange: () => {},
};

class PasswordField extends Component {
	constructor(props) {
		super(props);

		this.togglePasswordReveal = this.togglePasswordReveal.bind(this);
	}

	togglePasswordReveal = (event, field) => {
		event.preventDefault();

		const input = document.querySelector(`.password-reveal input[id=${field}]`);

		const icon = document.querySelector(`.password-reveal i[id=${field}Fa]`);

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
			<div className="input-group password-reveal">
				<Input type="password" name={this.props.fieldName} id={this.props.fieldName} value={this.props.fieldValue} placeholder="e.g. y1Fwc]_C" onChange={this.props.handleChange} required pattern=".{10,}" />
				<div className="input-group-append">
					<Button color="light" title="Toggle Password Reveal" className="input-group-text" onClick={event => this.togglePasswordReveal(event, this.props.fieldName)}><i className="fa fa-eye-slash text-primary" id={this.props.fieldName.concat('Fa')} aria-hidden="true"></i></Button>
				</div>
			</div>
			<FieldFeedbacks for={this.props.fieldName} show="all">
				<FieldFeedback when="valueMissing">Please provide a valid password.</FieldFeedback>
				<FieldFeedback when="patternMismatch">Should be at least 10 characters long.</FieldFeedback>
			</FieldFeedbacks>
		</FormGroup>
	);
}

PasswordField.propTypes = propTypes;

PasswordField.defaultProps = defaultProps;

export default PasswordField;
