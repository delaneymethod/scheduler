import React from 'react';
import PropTypes from 'prop-types';
import { Label, FormGroup } from 'reactstrap';
import NumberFormat from 'react-number-format';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

const propTypes = {
	fieldValue: PropTypes.any,
	valueMissing: PropTypes.string,
	fieldPlaceholder: PropTypes.string,
	handleBlur: PropTypes.func.isRequired,
	fieldName: PropTypes.string.isRequired,
	fieldLabel: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	fieldRequired: PropTypes.bool.isRequired,
	fieldTabIndex: PropTypes.number.isRequired,
};

const defaultProps = {
	fieldName: '',
	fieldValue: '',
	fieldLabel: '',
	valueMissing: '',
	fieldTabIndex: '-1',
	handleBlur: () => {},
	fieldRequired: false,
	fieldPlaceholder: '',
	handleChange: () => {},
};

const NumberField = ({
	fieldName,
	fieldValue,
	fieldLabel,
	handleBlur,
	valueMissing,
	handleChange,
	fieldRequired,
	fieldTabIndex,
	fieldPlaceholder,
}) => (
	<FormGroup>
		<Label for={fieldName}>{fieldLabel} {(fieldRequired) ? (<span className="text-danger">&#42;</span>) : null}</Label>
		{(fieldName === 'budget') ? (
			<NumberFormat name={fieldName} id={fieldName} value={fieldValue} className="form-control" placeholder={fieldPlaceholder} tabIndex={fieldTabIndex} onValueChange={(values, event) => handleChange(event, values)} onBlur={handleBlur} required={fieldRequired} displayType={'input'} thousandSeparator={true} prefix={'£'} />
		) : null}
		{(fieldName === 'mobile') ? (
			<NumberFormat name={fieldName} id={fieldName} value={fieldValue} className="form-control" placeholder={fieldPlaceholder} tabIndex={fieldTabIndex} onValueChange={handleChange} onBlur={handleBlur} required={fieldRequired} displayType={'input'} format="+44 ##-####-####" mask="_" />
		) : null}
		<FieldFeedbacks for={fieldName} show="all">
			<FieldFeedback when="valueMissing">- {valueMissing}</FieldFeedback>
		</FieldFeedbacks>
	</FormGroup>
);

NumberField.propTypes = propTypes;

NumberField.defaultProps = defaultProps;

export default NumberField;
