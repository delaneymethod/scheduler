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

const TextField = ({
	fieldName,
	fieldValue,
	fieldLabel,
	valueMissing,
	handleChange,
	fieldPlaceholder,
}) => (
	<FormGroup>
		<Label for={fieldName}>{fieldLabel}</Label>
		<Input type="text" name={fieldName} id={fieldName} value={fieldValue} placeholder={fieldPlaceholder} onChange={handleChange} required />
		<FieldFeedbacks for={fieldName} show="all">
			<FieldFeedback when="valueMissing">- {valueMissing}</FieldFeedback>
		</FieldFeedbacks>
	</FormGroup>
);

TextField.propTypes = propTypes;

TextField.defaultProps = defaultProps;

export default TextField;
