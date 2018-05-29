import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

const propTypes = {
	fieldValue: PropTypes.string,
	valueMissing: PropTypes.string,
	fieldPlaceholder: PropTypes.string,
	fieldName: PropTypes.string.isRequired,
	fieldLabel: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
};

const defaultProps = {
	fieldName: '',
	fieldValue: '',
	fieldLabel: '',
	valueMissing: '',
	fieldPlaceholder: '',
	handleChange: () => {},
};

const TextField = props => (
	<FormGroup>
		<Label for={props.fieldName}>{props.fieldLabel}</Label>
		<Input type="text" name={props.fieldName} id={props.fieldName} value={props.fieldValue} placeholder={props.fieldPlaceholder} onChange={props.handleChange} required />
		<FieldFeedbacks for={props.fieldName} show="all">
			<FieldFeedback when="valueMissing">- {props.valueMissing}</FieldFeedback>
		</FieldFeedbacks>
	</FormGroup>
);

TextField.propTypes = propTypes;

TextField.defaultProps = defaultProps;

export default TextField;
