import React from 'react';
import moment from 'moment';
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
	fieldRequired: PropTypes.bool.isRequired,
};

const defaultProps = {
	fieldName: '',
	fieldValue: '',
	fieldLabel: '',
	valueMissing: '',
	fieldRequired: false,
	fieldPlaceholder: '',
	handleChange: () => {},
};

const DateField = ({
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
		<Input type="date" name={fieldName} id={fieldName} value={fieldValue} placeholder={fieldPlaceholder} onChange={handleChange} required={fieldRequired} min={moment().format('Y-MM-DD')} pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" />
		<FieldFeedbacks for={fieldName} show="all">
			<FieldFeedback when="valueMissing">- {valueMissing}</FieldFeedback>
		</FieldFeedbacks>
	</FormGroup>
);

DateField.propTypes = propTypes;

DateField.defaultProps = defaultProps;

export default DateField;
