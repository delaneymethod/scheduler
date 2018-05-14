import mailcheck from 'mailcheck';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Label, Input, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

const propTypes = {
	fieldValue: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
};

const defaultProps = {
	fieldValue: '',
	handleChange: () => {},
};

class EmailField extends Component {
	constructor(props) {
		super(props);

		this.handleBlur = this.handleBlur.bind(this);

		this.handleUpdateEmail = this.handleUpdateEmail.bind(this);

		mailcheck.defaultDomains.push('giggrafter.com');
		mailcheck.defaultSecondLevelDomains.push('giggrafter');
	}

	handleUpdateEmail = (event) => {
		event.preventDefault();

		const emailField = document.getElementById('email');

		const didYouMean = document.getElementById('did-you-mean');

		emailField.value = document.getElementById('suggestion').innerText;

		emailField.onchange = () => {};

		didYouMean.classList.add('d-none');
		didYouMean.classList.remove('d-block');
	};

	handleBlur = (event) => {
		const didYouMean = document.getElementById('did-you-mean');

		const suggestion = document.getElementById('suggestion');

		mailcheck.run({
			email: this.props.fieldValue,
			suggested: (suggested) => {
				didYouMean.classList.add('d-block');
				didYouMean.classList.remove('d-none');

				suggestion.innerText = suggested.full;
			},
			empty: () => {
				didYouMean.classList.add('d-none');
				didYouMean.classList.remove('d-block');

				suggestion.innerText = '';
			},
		});
	};

	render = () => (
		<FormGroup>
			<Label for="email">Email Address</Label>
			<Input type="email" name="email" id="email" value={this.props.fieldValue} placeholder="e.g. hello@giggrafter.com" onBlur={this.handleBlur} onChange={this.props.handleChange} required />
			<FieldFeedbacks for="email" show="all">
				<FieldFeedback when="*">- Please provide a valid email address.</FieldFeedback>
			</FieldFeedbacks>
			<div id="did-you-mean" className="d-none text-primary mt-2">- Did you mean <a href="#" title="Did you mean..." id="suggestion" onClick={this.handleUpdateEmail}></a>?</div>
		</FormGroup>
	);
}

EmailField.propTypes = propTypes;

EmailField.defaultProps = defaultProps;

export default EmailField;
