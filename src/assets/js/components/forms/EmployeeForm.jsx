import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import TextField from '../fields/TextField';

import EmailField from '../fields/EmailField';

import NumberField from '../fields/NumberField';

import constants from '../../helpers/constants';

import { createEmployee, updateEmployee, deleteEmployee } from '../../actions/employeeActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	editMode: PropTypes.bool,
	employeeId: PropTypes.string,
	employees: PropTypes.array.isRequired,
};

const defaultProps = {
	employees: [],
	editMode: false,
	employeeId: null,
};

class EmployeeForm extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleDelete = this.handleDelete.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleChangeHourlyRate = this.handleChangeHourlyRate.bind(this);
	}

	getInitialState = () => ({
		error: {},
		email: '',
		lastName: '',
		firstName: '',
		hourlyRate: 0,
		created: false,
		updated: false,
		deleted: false,
		contactNumber: '',
	});

	handleChange = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		await this.form.validateFields(target);
	};

	handleChangeHourlyRate = async (event) => {
		this.setState({ created: false, updated: false, deleted: false });

		const target = event.currentTarget;

		target.value = (!target.value) ? 0 : target.value;

		const hourlyRate = parseInt(target.value, 10);

		this.setState({
			[target.name]: hourlyRate,
		});

		await this.form.validateFields(target);
	};

	handleDelete = async event => console.log('FIXME - Delete Employee');

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			let payload;

			if (this.props.editMode) {
				console.log('FIXME - Update Employee');
			} else {
				payload = {
				};

				console.log('Called EmployeeForm handleSubmit createEmployee');
				actions.createEmployee(payload)
					.then((employee) => {
						console.log('Employee:', employee);
					})
					.catch(error => this.setState({ error }));
			}
		}
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	successMessage = () => {
		const { created, updated, deleted } = this.state;

		if (created) {
			return (<Alert color="success" message="Employee was created successfully." />);
		} else if (updated) {
			return (<Alert color="success" message="Employee was updated successfully." />);
		} else if (deleted) {
			return (<Alert color="success" message="Employee was deleted successfully." />);
		}

		return null;
	};

	render = () => (
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<TextField fieldName="firstName" fieldLabel="First Name" fieldValue={this.state.firstName} fieldPlaceholder="e.g. Barry" handleChange={this.handleChange} valueMissing="Please provide a valid first name." tabIndex="1" fieldRequired={true} />
				<TextField fieldName="lastName" fieldLabel="Last Name" fieldValue={this.state.lastName} fieldPlaceholder="e.g. Lynch" handleChange={this.handleChange} valueMissing="Please provide a valid last name." tabIndex="2" fieldRequired={true} />
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} tabIndex="3" fieldRequired={true} />
				<TextField fieldName="contactNumber" fieldLabel="Contact Number" fieldValue={this.state.contactNumber} fieldPlaceholder="e.g. 077..." handleChange={this.handleChange} valueMissing="Please provide a valid contact number." tabIndex="4" fieldRequired={true} />
				<NumberField fieldName="hourlyRate" fieldLabel="Hourly Rate" fieldValue={this.state.hourlyRate} fieldPlaceholder="e.g. 7.50" handleChange={this.handleChangeHourlyRate} valueMissing="Please provide a valid hourly rate." tabIndex="5" fieldRequired={true} />
				{(this.props.editMode) ? (
					<Button type="submit" color="primary" className="mt-4" title={routes.EMPLOYEES.UPDATE.TITLE} tabIndex="8" block>{routes.EMPLOYEES.UPDATE.TITLE}</Button>
				) : (
					<Button type="submit" color="primary" className="mt-4" title={routes.EMPLOYEES.CREATE.TITLE} tabIndex="8" block>{routes.EMPLOYEES.CREATE.TITLE}</Button>
				)}
			</FormWithConstraints>
		</Fragment>
	);
}

EmployeeForm.propTypes = propTypes;

EmployeeForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	editMode: props.editMode,
	employees: state.employees,
	employeeId: props.employeeId,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		createEmployee,
		updateEmployee,
		deleteEmployee,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeForm);
