/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

const TextField = props => (
	<FormGroup>
		<Label for={props.fieldName}>{props.fieldLabel}</Label>
		<Input type="text" name={props.fieldName} id={props.fieldName} value={props.fieldValue} placeholder={props.fieldPlaceholder} onChange={props.handleChange} required />
		<FieldFeedbacks for={props.fieldName} show="all">
			<FieldFeedback when="valueMissing">{props.valueMissing}</FieldFeedback>
		</FieldFeedbacks>
	</FormGroup>
);

export default TextField;
