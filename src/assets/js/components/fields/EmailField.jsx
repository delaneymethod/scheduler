import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

const EmailField = props => (
	<FormGroup>
		<Label for="email">Email Address</Label>
		<Input type="email" name="email" id="email" value={props.fieldValue} placeholder="e.g. hello@giggrafter.com" onChange={props.handleChange} required />
		<FieldFeedbacks for="email" show="all">
			<FieldFeedback when="valueMissing">Please provide a valid email address.</FieldFeedback>
		</FieldFeedbacks>
	</FormGroup>
);

export default EmailField;
