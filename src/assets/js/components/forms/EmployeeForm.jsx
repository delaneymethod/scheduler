import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, debounce } from 'lodash';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import confirm from '../../helpers/confirm';

import TextField from '../fields/TextField';

import EmailField from '../fields/EmailField';

import NumberField from '../fields/NumberField';

import constants from '../../helpers/constants';

import { createEmployee, updateEmployee, getEmployees, deleteEmployee } from '../../actions/employeeActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	editMode: PropTypes.bool,
	employeeId: PropTypes.string,
	employees: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
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
		employeeId: '',
		weeklyContractHours: '',
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1000ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1000);

		/* If employee id was passed in as a prop, make sure we also update the state... */
		if (!isEmpty(this.props.employeeId)) {
			this.setState({ employeeId: this.props.employeeId });
		}

		/* If we are in edit mode, we basically need to overwrite most of the above except for the employee id */
		if (this.props.editMode && !isEmpty(this.props.employeeId)) {
			const accountEmployee = this.props.employees.filter(data => data.employee.employeeId === this.props.employeeId).shift();

			const {
				salary,
				employee,
				hourlyRate,
				weeklyContractHours,
			} = accountEmployee;

			const {
				email,
				mobile,
				lastName,
				firstName,
			} = employee;

			/* Update the state with all the edit shift details */
			this.setState({
				email,
				salary,
				mobile,
				lastName,
				firstName,
				hourlyRate,
				weeklyContractHours,
			});
		}
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

	handleGetEmployees = () => {
		console.log('Called EmployeeForm handleGetEmployees getEmployees');
		this.props.actions.getEmployees().catch(error => this.setState({ error }));
	};

	handleDelete = (event) => {
		const accountEmployee = this.props.employees.filter(data => data.employee.employeeId === this.state.employeeId).shift();

		/* Check if the user wants to delete the employee */
		let message = `<div class="text-center"><p>Please confirm that you wish to delete the Employee?</p><ul class="list-unstyled font-weight-bold"><li>Employee: ${accountEmployee.employee.firstName} ${accountEmployee.employee.lastName}</li></ul><p class="text-warning"><i class="pr-3 fa fa-fw fa-exclamation-triangle" aria-hidden="true"></i>Caution: This action cannot be undone.</p></div>`;

		const options = {
			message,
			labels: {
				cancel: 'Cancel',
				proceed: 'Delete',
			},
			values: {
				cancel: false,
				process: true,
			},
			colors: {
				proceed: 'danger',
			},
			title: 'Delete Employee',
			className: 'modal-dialog-warning',
		};

		/* If the user has clicked the proceed button, we delete the employee */
		/* If the user has clicked the cancel button, we do nothing */
		confirm(options)
			.then((result) => {
				const { actions } = this.props;

				const { employeeId } = this.state;

				const payload = {
					employeeId,
				};

				console.log('Called EmployeeForm handleDelete deleteEmployees');
				actions.deleteEmployee(payload)
					.then(() => {
						/* Close the modal */
						this.props.handleClose();

						message = '<p>Employee was deleted!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					.then(() => this.handleGetEmployees())
					.catch(error => this.setState({ error }));
			}, (result) => {
				/* We do nothing */
			});
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const {
				email,
				salary,
				mobile,
				lastName,
				firstName,
				hourlyRate,
				employeeId,
				weeklyContractHours,
			} = this.state;

			const payload = {
				email,
				salary,
				mobile,
				lastName,
				firstName,
				hourlyRate,
				employeeId,
				weeklyContractHours,
			};

			if (this.props.editMode) {
				console.log('Called EmployeeForm handleSubmit updateEmployee');
				actions.updateEmployee(payload)
					.then(() => {
						/* Close the modal */
						this.props.handleClose();

						const message = '<p>Employee was updated!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					/* Updating the employee will update the store with only the updated employee (as thats what the reducer passes back) so we need to do another call to get all the employees back into the store again */
					.then(() => this.handleGetEmployees())
					.catch(error => this.setState({ error }));
			} else {
				console.log('Called EmployeeForm handleSubmit createEmployee');
				actions.createEmployee(payload)
					.then(() => {
						/* Close the modal */
						this.props.handleClose();

						const message = '<p>Employee was created!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					/* Updating the employee will update the store with only the updated employee (as thats what the reducer passes back) so we need to do another call to get all the employees back into the store again */
					.then(() => this.handleGetEmployees())
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
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<TextField fieldName="firstName" fieldLabel="First Name" fieldValue={this.state.firstName} fieldPlaceholder="e.g. Barry" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid first name." fieldTabIndex={1} fieldRequired={true} />
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<TextField fieldName="lastName" fieldLabel="Last Name" fieldValue={this.state.lastName} fieldPlaceholder="e.g. Lynch" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid last name." fieldTabIndex={2} fieldRequired={true} />
					</Col>
				</Row>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} fieldTabIndex={3} fieldRequired={true} />
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="mobile" fieldLabel="Mobile" fieldValue={this.state.mobile} fieldPlaceholder="e.g. +44 (0) 777-777-7777" handleChange={this.handleChangeMobile} handleBlur={this.handleBlur} valueMissing="Please provide a valid mobile number." fieldTabIndex={4} fieldRequired={true} />
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="hourlyRate" fieldLabel="Hourly Rate" fieldValue={this.state.hourlyRate} fieldPlaceholder="e.g. £7.83" handleChange={this.handleChangeHourlyRate} handleBlur={this.handleBlur} valueMissing="Please provide a valid hourly rate." fieldTabIndex={5} fieldRequired={true} />
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="salary" fieldLabel="Salary" fieldValue={this.state.salary} fieldPlaceholder="e.g. £7.83" handleChange={this.handleChangeSalary} handleBlur={this.handleBlur} valueMissing="Please provide a valid salary." fieldTabIndex={6} fieldRequired={false} />
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="weeklyContractHours" fieldLabel="Weekly Contract Hours" fieldValue={this.state.weeklyContractHours} fieldPlaceholder="e.g. 37.5" handleChange={this.handleChangeWeeklyContractHours} handleBlur={this.handleBlur} valueMissing="Please provide a valid weekly contract hours." fieldTabIndex={7} fieldRequired={false} />
					</Col>
				</Row>
				{(this.props.editMode) ? (
					<Fragment>
						<Button type="submit" color="primary" className="mt-4" title={routes.EMPLOYEES.UPDATE.TITLE} tabIndex="8" block>{routes.EMPLOYEES.UPDATE.TITLE}</Button>
						<Button type="button" className="mt-4 text-danger btn btn-outline-danger" title={routes.EMPLOYEES.DELETE.TITLE} tabIndex="9" block onClick={this.handleDelete}>{routes.EMPLOYEES.DELETE.TITLE}</Button>
					</Fragment>
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
		getEmployees,
		createEmployee,
		updateEmployee,
		deleteEmployee,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeForm);
