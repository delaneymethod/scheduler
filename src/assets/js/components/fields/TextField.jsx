import React from 'react';
import { Label, Input, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

const TextField = props => (
	<FormGroup>
		<Label for={props.fieldName}>{props.fieldLabel}</Label>
		<Input type="text" name={props.fieldName} id={props.fieldName} value={props.fieldValue} placeholder={props.fieldPlaceholder} onChange={props.handleChange} required />
		<FieldFeedbacks for={props.fieldName} show="all">
			<FieldFeedback when="valueMissing">- {props.valueMissing}</FieldFeedback>
		</FieldFeedbacks>
	</FormGroup>
);

export default TextField;
