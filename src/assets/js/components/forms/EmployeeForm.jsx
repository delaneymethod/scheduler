import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
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
	handleClose: PropTypes.func,
	employeeId: PropTypes.string,
	employees: PropTypes.array.isRequired,
	handleSuccessNotification: PropTypes.func,
};

const defaultProps = {
	employees: [],
	editMode: false,
	employeeId: null,
	handleClose: () => {},
	handleSuccessNotification: () => {},
};

class EmployeeForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleDelete = this.handleDelete.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleChangeMobile = this.handleChangeMobile.bind(this);

		this.handleChangeSalary = this.handleChangeSalary.bind(this);

		this.handleChangeHourlyRate = this.handleChangeHourlyRate.bind(this);

		this.handleChangeWeeklyContractHours = this.handleChangeWeeklyContractHours.bind(this);
	}

	getInitialState = () => ({
		error: {},
		email: '',
		salary: '',
		mobile: '',
		lastName: '',
		firstName: '',
		hourlyRate: '',
		weeklyContractHours: '',
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1000ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1000);
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleChangeMobile = (event, values) => this.setState({ mobile: values.value });

	handleChangeSalary = (event, values) => this.setState({ salary: values.floatValue });

	handleChangeHourlyRate = (event, values) => this.setState({ hourlyRate: values.floatValue });

	handleChangeWeeklyContractHours = (event, values) => this.setState({ weeklyContractHours: values.floatValue });

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleDelete = event => console.log('FIXME - Delete Employee');

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
				const {
					email,
					salary,
					mobile,
					lastName,
					firstName,
					hourlyRate,
					weeklyContractHours,
				} = this.state;

				payload = {
					email,
					salary,
					mobile,
					lastName,
					firstName,
					hourlyRate,
					weeklyContractHours,
				};

				console.log('Called EmployeeForm handleSubmit createEmployee');
				actions.createEmployee(payload)
					.then(() => {
						/* Close the modal */
						this.props.handleClose();

						const message = '<p>Employee created successfully</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					.catch(error => this.setState({ error }));
			}
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<TextField fieldName="firstName" fieldLabel="First Name" fieldValue={this.state.firstName} fieldPlaceholder="e.g. Barry" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid first name." fieldTabIndex={1} fieldRequired={true} />
				<TextField fieldName="lastName" fieldLabel="Last Name" fieldValue={this.state.lastName} fieldPlaceholder="e.g. Lynch" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid last name." fieldTabIndex={2} fieldRequired={true} />
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} fieldTabIndex={3} fieldRequired={true} />
				<NumberField fieldName="mobile" fieldLabel="Mobile" fieldValue={this.state.mobile} fieldPlaceholder="e.g. +44 (0) 777-777-7777" handleChange={this.handleChangeMobile} handleBlur={this.handleBlur} valueMissing="Please provide a valid mobile number." fieldTabIndex={4} fieldRequired={true} />
				<NumberField fieldName="hourlyRate" fieldLabel="Hourly Rate" fieldValue={this.state.hourlyRate} fieldPlaceholder="e.g. £7.83" handleChange={this.handleChangeHourlyRate} handleBlur={this.handleBlur} valueMissing="Please provide a valid hourly rate." fieldTabIndex={5} fieldRequired={true} />
				<NumberField fieldName="salary" fieldLabel="Salary" fieldValue={this.state.salary} fieldPlaceholder="e.g. £7.83" handleChange={this.handleChangeSalary} handleBlur={this.handleBlur} valueMissing="Please provide a valid salary." fieldTabIndex={6} fieldRequired={false} />
				<NumberField fieldName="weeklyContractHours" fieldLabel="Weekly Contract Hours" fieldValue={this.state.weeklyContractHours} fieldPlaceholder="e.g. 37.5" handleChange={this.handleChangeWeeklyContractHours} handleBlur={this.handleBlur} valueMissing="Please provide a valid weekly contract hours." fieldTabIndex={7} fieldRequired={false} />
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
