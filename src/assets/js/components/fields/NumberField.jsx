import React from 'react';
import PropTypes from 'prop-types';
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

const NumberField = ({
	fieldName,
	fieldValue,
	fieldLabel,
	valueMissing,
	handleChange,
	fieldRequired,
	fieldPlaceholder,
}) => (
	<FormGroup>
		<Label for={fieldName}>{fieldLabel} {(fieldRequired) ? (<span className="text-danger">&#42;</span>) : null}</Label>
		<Input type="number" name={fieldName} id={fieldName} value={fieldValue} placeholder={fieldPlaceholder} onChange={handleChange} required={fieldRequired} min="0" />
		<FieldFeedbacks for={fieldName} show="all">
			{(fieldName === 'budget') ? (
				<div className="info">- &pound;{fieldValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</div>
			) : null}
			<FieldFeedback when="valueMissing">- {valueMissing}</FieldFeedback>
		</FieldFeedbacks>
	</FormGroup>
);

NumberField.propTypes = propTypes;

NumberField.defaultProps = defaultProps;

export default NumberField;
