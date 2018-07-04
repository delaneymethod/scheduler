import ReactDOM from 'react-dom';
import mailcheck from 'mailcheck';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Label, Input, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

import { addClass, removeClass } from '../../helpers/classes';

const propTypes = {
	handleBlur: PropTypes.func.isRequired,
	fieldValue: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	fieldRequired: PropTypes.bool.isRequired,
	fieldTabIndex: PropTypes.number.isRequired,
	fieldAutoComplete: PropTypes.string.isRequired,
};

const defaultProps = {
	fieldValue: '',
	fieldTabIndex: '-1',
	fieldRequired: false,
	handleBlur: () => {},
	handleChange: () => {},
	fieldAutoComplete: 'off',
};

class EmailField extends Component {
	constructor(props) {
		super(props);

		this.handleBlur = this.handleBlur.bind(this);

		mailcheck.defaultDomains.push('giggrafter.com');

		mailcheck.defaultSecondLevelDomains.push('giggrafter');
	}

	handleBlur = (event) => {
		const { didYouMean, suggestion } = this.refs;

		console.log('Called EmailField handleBlur mailcheck');
		mailcheck.run({
			email: this.props.fieldValue,
			suggested: (suggested) => {
				addClass(didYouMean, 'd-block');

				removeClass(didYouMean, 'd-none');

				suggestion.innerText = suggested.full;
			},
			empty: () => {
				addClass(didYouMean, 'd-none');

				removeClass(didYouMean, 'd-block');

				suggestion.innerText = '';
			},
		});

		/* This is the important part - passing the event back to the parent component so we can track it */
		this.props.handleBlur(event);
	};

	render = () => (
		<FormGroup>
			<Label for="email">Email Address {(this.props.fieldRequired) ? (<span className="text-danger">&#42;</span>) : null}</Label>
			<Input type="email" name="email" id="email" value={this.props.fieldValue} ref="input" placeholder="e.g. hello@giggrafter.com" tabIndex={this.props.fieldTabIndex} autoComplete={this.props.fieldAutoComplete} onChange={this.props.handleChange} onBlur={this.handleBlur} required={this.props.fieldRequired} />
			<FieldFeedbacks for="email" show="all">
				<FieldFeedback when="*">- Please provide a valid email address.</FieldFeedback>
			</FieldFeedbacks>
			<div id="did-you-mean" className="d-none mt-2" ref="didYouMean">- Did you mean <strong id="suggestion" ref="suggestion"></strong>?</div>
		</FormGroup>
	);
}

EmailField.propTypes = propTypes;

EmailField.defaultProps = defaultProps;

export default EmailField;
