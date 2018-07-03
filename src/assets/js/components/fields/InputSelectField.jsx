import delay from 'lodash/delay';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Label, Input, Button, FormGroup } from 'reactstrap';
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
	fieldOptions: PropTypes.array.isRequired,
	fieldToggleButtonLabel: PropTypes.string,
	fieldTabIndex: PropTypes.number.isRequired,
};

const defaultProps = {
	fieldName: '',
	fieldValue: '',
	fieldLabel: '',
	fieldOptions: [],
	valueMissing: '',
	fieldTabIndex: '-1',
	handleBlur: () => {},
	fieldRequired: false,
	fieldPlaceholder: '',
	handleChange: () => {},
	fieldToggleButtonLabel: '',
};

class InputSelectField extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleToggle = this.handleToggle.bind(this);
	}

	getInitialState = () => ({
		mode: 'select',
		buttonLabel: 'Create',
	});

	handleToggle = () => {
		const element = document.querySelector(`#${this.props.fieldName}`);

		if (element.getAttribute('type') === 'select') {
			this.setState({ mode: 'input', buttonLabel: 'Select' });

			/* Let the DOM update before we set focus */
			delay(() => document.querySelector(`#${this.props.fieldName}`).focus(), 1000);
		} else {
			this.setState({ mode: 'select', buttonLabel: 'Create' });
		}
	};

	render = () => (
		<FormGroup>
			<Label for={this.props.fieldName}>{this.props.fieldLabel} {(this.props.fieldRequired) ? (<span className="text-danger">&#42;</span>) : null}</Label>
			<div className="input-group">
				{(this.state.mode === 'input') ? (
					<Input type="text" name={this.props.fieldName} id={this.props.fieldName} value={this.props.fieldValue} placeholder={this.props.fieldPlaceholder} tabIndex={this.props.fieldTabIndex} onChange={this.props.handleChange} onBlur={this.props.handleBlur} required={this.props.fieldRequired} />
				) : (
					<Input type="select" name={this.props.fieldName} id={this.props.fieldName} value={this.props.fieldValue} className="custom-select custom-select-xl" tabIndex={this.props.fieldTabIndex} onChange={this.props.handleChange} onBlur={this.props.handleBlur} required={this.props.fieldRequired}>
						{(this.props.fieldName === 'roleName') ? this.props.fieldOptions.map((role, index) => <option key={index} value={role.roleName} label={role.roleName} />) : this.props.fieldOptions.map((option, index) => <option key={index} value={option} label={option} />)}
					</Input>
				)}
				<div className="input-group-append">
					<Button title={`${this.state.buttonLabel} ${this.props.fieldToggleButtonLabel}`} id="btn-toggle" className="input-group-text text-white border-0 bg-dark" onClick={this.handleToggle}>{this.state.buttonLabel} {this.props.fieldToggleButtonLabel}</Button>
				</div>
			</div>
			<FieldFeedbacks for={this.props.fieldName} show="all">
				<FieldFeedback when="valueMissing">- {this.props.valueMissing}</FieldFeedback>
			</FieldFeedbacks>
		</FormGroup>
	);
}

InputSelectField.propTypes = propTypes;

InputSelectField.defaultProps = defaultProps;

export default InputSelectField;