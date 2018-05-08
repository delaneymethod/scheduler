import React from 'react';
import { Label, Input, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

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
