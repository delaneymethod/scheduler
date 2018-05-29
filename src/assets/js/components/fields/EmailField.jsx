import ReactDOM from 'react-dom';
import mailcheck from 'mailcheck';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Label, Input, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

import { addClass, removeClass } from '../../helpers/classes';

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

		mailcheck.defaultDomains.push('giggrafter.com');
		mailcheck.defaultSecondLevelDomains.push('giggrafter');
	}

	handleBlur = () => {
		mailcheck.run({
			email: this.props.fieldValue,
			suggested: (suggested) => {
				addClass(this.refs.didYouMean, 'd-block');

				removeClass(this.refs.didYouMean, 'd-none');

				this.refs.suggestion.innerText = suggested.full;
			},
			empty: () => {
				addClass(this.refs.didYouMean, 'd-none');

				removeClass(this.refs.didYouMean, 'd-block');

				this.refs.suggestion.innerText = '';
			},
		});
	};

	render = () => (
		<FormGroup>
			<Label for="email">Email Address</Label>
			<Input type="email" name="email" id="email" value={this.props.fieldValue} ref="input" placeholder="e.g. hello@giggrafter.com" onBlur={this.handleBlur} onChange={this.props.handleChange} required />
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
