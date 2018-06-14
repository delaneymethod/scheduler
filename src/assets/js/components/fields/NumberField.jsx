import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Label, Input, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

const propTypes = {
	fieldValue: PropTypes.number,
	valueMissing: PropTypes.string,
	fieldPlaceholder: PropTypes.string,
	fieldName: PropTypes.string.isRequired,
	fieldLabel: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	fieldRequired: PropTypes.bool.isRequired,
};

const defaultProps = {
	fieldName: '',
	fieldValue: 0,
	fieldLabel: '',
	valueMissing: '',
	fieldRequired: false,
	fieldPlaceholder: '',
	handleChange: () => {},
};

class NumberField extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick = (event) => {
		const target = event.currentTarget;

		target.select(0, target.value.length);
	};

	render = () => (
		<FormGroup>
			<Label for={this.props.fieldName}>{this.props.fieldLabel} {(this.props.fieldRequired) ? (<span className="text-danger">&#42;</span>) : null}</Label>
			<Input type="number" name={this.props.fieldName} id={this.props.fieldName} value={this.props.fieldValue} placeholder={this.props.fieldPlaceholder} onClick={this.handleClick} onChange={this.props.handleChange} required={this.props.fieldRequired} min="0" />
			<FieldFeedbacks for={this.props.fieldName} show="all">
				{(this.props.fieldName === 'budget' || this.props.fieldName === 'hourlyRate') ? (
					<div className="info">- &pound;{this.props.fieldValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</div>
				) : null}
				<FieldFeedback when="valueMissing">- {this.props.valueMissing}</FieldFeedback>
			</FieldFeedbacks>
		</FormGroup>
	);
}

NumberField.propTypes = propTypes;

NumberField.defaultProps = defaultProps;

export default NumberField;
