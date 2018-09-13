import PropTypes from 'prop-types';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import confirm from '../../helpers/confirm';

import TextField from '../fields/TextField';

import EmailField from '../fields/EmailField';

import logMessage from '../../helpers/logging';

import NumberField from '../fields/NumberField';

import { getShifts } from '../../actions/shiftActions';

import { createEmployee, updateEmployee, getEmployees, deleteEmployee, orderEmployees } from '../../actions/employeeActions';

const routes = config.APP.ROUTES;

const propTypes = {
	editMode: PropTypes.bool,
	employeeId: PropTypes.string,
	rota: PropTypes.object.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	rota: {},
	rotaType: {},
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

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleGetEmployees = this.handleGetEmployees.bind(this);

		this.handleChangeMobile = this.handleChangeMobile.bind(this);

		this.handleChangeSalary = this.handleChangeSalary.bind(this);

		this.handleChangeHourlyRate = this.handleChangeHourlyRate.bind(this);

		this.handleUpdateEmployeeOrder = this.handleUpdateEmployeeOrder.bind(this);

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
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));

		/* If employee id was passed in as a prop, make sure we also update the state... */
		if (!isEmpty(this.props.employeeId)) {
			this.setState({ employeeId: this.props.employeeId });
		}

		/* If we are in edit mode, we basically need to overwrite most of the above except for the employee id */
		if (this.props.editMode && !isEmpty(this.props.employeeId)) {
			const accountEmployee = this.props.employees.filter(data => data.employee.employeeId === this.props.employeeId).shift();

			let {
				salary,
				hourlyRate,
				weeklyContractHours,
			} = accountEmployee;

			const {
				employee: {
					email,
					mobile,
					lastName,
					firstName,
				},
			} = accountEmployee;

			salary = (salary !== 0) ? salary : null;

			hourlyRate = (hourlyRate !== 0) ? hourlyRate : null;

			weeklyContractHours = (weeklyContractHours !== 0) ? weeklyContractHours : null;

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

	handleBlur = async event => this.handleValidateFields(event.target);

	handleUpdateEmployeeOrder = () => {
		const { actions, rotaType, employees } = this.props;

		/**
		 * Employees may have a different sort positions for different rota types,
		 * so we loop over each employee and get its sort position for the current rota type.
		 */
		let orderableEmployees = employees.filter(accountEmployee => accountEmployee.rotaTypeAccountEmployees && accountEmployee.rotaTypeAccountEmployees.find(({ rotaTypeId }) => rotaType.rotaTypeId === rotaTypeId));

		orderableEmployees = orderableEmployees.sort((a, b) => a.rotaTypeAccountEmployees.find(({ rotaTypeId }) => rotaType.rotaTypeId === rotaTypeId).sortPosition - b.rotaTypeAccountEmployees.find(({ rotaTypeId }) => rotaType.rotaTypeId === rotaTypeId).sortPosition);

		/* Grab all employees without sort positions setup for rota types */
		const nonOrderableEmployees = employees.filter(accountEmployee => !accountEmployee.rotaTypeAccountEmployees || !accountEmployee.rotaTypeAccountEmployees.find(({ rotaTypeId }) => rotaType.rotaTypeId === rotaTypeId));

		/* Now that employees with sort positions have been ordered, add back in the non sort position employees */
		const orderedEmployees = concat(orderableEmployees, nonOrderableEmployees);

		const ids = orderedEmployees.map(employee => employee.accountEmployeeId);

		const order = ids.map(data => data);

		const { rotaTypeId } = rotaType;

		const payload = {
			order,
			rotaTypeId,
		};

		logMessage('info', 'Called EmployeeForm handleUpdateEmployeeOrder orderEmployees');

		return actions.orderEmployees(payload).catch(error => Promise.reject(error));
	};

	handleGetEmployees = () => {
		logMessage('info', 'Called EmployeeForm handleGetEmployees getEmployees');

		return this.props.actions.getEmployees().catch(error => Promise.reject(error));
	};

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		logMessage('info', 'Called EmployeeForm handleGetShifts getShifts');

		return actions.getShifts(payload).catch(error => Promise.reject(error));
	};

	handleDelete = (event) => {
		const { actions, employees } = this.props;

		const accountEmployee = employees.filter(data => data.employee.employeeId === this.state.employeeId).shift();

		/* Check if the user wants to delete the employee */
		let message = `<div class="text-center"><p>Please confirm that you wish to delete the Employee?</p><ul class="list-unstyled font-weight-bold"><li>Employee: ${accountEmployee.employee.firstName} ${accountEmployee.employee.lastName}</li></ul><p class="text-uppercase"><i class="pr-3 fa fa-fw fa-exclamation-triangle text-warning" aria-hidden="true"></i>Caution: This action cannot be undone.</p></div>`;

		const options = {
			message,
			labels: {
				cancel: 'Cancel',
				proceed: 'Delete',
			},
			values: {
				cancel: false,
				proceed: true,
			},
			colors: {
				proceed: 'danger',
			},
			enableEscape: false,
			title: 'Delete Employee',
			className: 'modal-dialog-warning',
		};

		/* If the user has clicked the proceed button, we delete the employee */
		/* If the user has clicked the cancel button, we do nothing */
		confirm(options)
			.then((result) => {
				const { employeeId } = this.state;

				const payload = {
					employeeId,
				};

				logMessage('info', 'Called EmployeeForm handleDelete deleteEmployees');

				actions.deleteEmployee(payload)
					/* Updating the employee will update the store with only the updated employee (as thats what the reducer passes back) so we need to do another call to get all the employees back into the store again */
					.then(() => this.handleGetEmployees())
					// .then(() => this.handleUpdateEmployeeOrder())
					/* I guess the API could return the ordered list of employees so we dont need to make this extra call */
					// .then(() => this.handleGetEmployees())
					/* Updating a shift or placement will update the store with only the shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
					.then(() => this.handleGetShifts())
					.then(() => {
						/* Close the modal */
						this.props.handleClose();

						/* FIXME - Make messages constants in config */
						message = '<p>Employee was deleted!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
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
				logMessage('info', 'Called EmployeeForm handleSubmit updateEmployee');

				actions.updateEmployee(payload)
					/* Updating the employee will update the store with only the updated employee (as thats what the reducer passes back) so we need to do another call to get all the employees back into the store again */
					.then(() => this.handleGetEmployees())
					// .then(() => this.handleUpdateEmployeeOrder())
					/* I guess the API could return the ordered list of employees so we dont need to make this extra call */
					// .then(() => this.handleGetEmployees())
					/* Updating a shift or placement will update the store with only the shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
					.then(() => this.handleGetShifts())
					.then(() => {
						/* Close the modal */
						this.props.handleClose();

						/* FIXME - Make messages constants in config */
						const message = '<p>Employee was updated!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					.catch(error => this.setState({ error }));
			} else {
				logMessage('info', 'Called EmployeeForm handleSubmit createEmployee');

				actions.createEmployee(payload)
					/* Updating the employee will update the store with only the updated employee (as thats what the reducer passes back) so we need to do another call to get all the employees back into the store again */
					.then(() => this.handleGetEmployees())
					// .then(() => this.handleUpdateEmployeeOrder())
					/* I guess the API could return the ordered list of employees so we dont need to make this extra call */
					// .then(() => this.handleGetEmployees())
					/* Updating a shift or placement will update the store with only the shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
					.then(() => this.handleGetShifts())
					.then(() => {
						/* Close the modal */
						this.props.handleClose();

						/* FIXME - Make messages constants in config */
						const message = '<p>Employee was created!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					.catch(error => this.setState({ error }));
			}
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<TextField fieldName="firstName" fieldLabel="First Name" fieldValue={this.state.firstName} fieldPlaceholder="e.g. Jane" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid first name." fieldTabIndex={1} fieldAutoComplete={'on'} fieldRequired={true} />
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<TextField fieldName="lastName" fieldLabel="Last Name" fieldValue={this.state.lastName} fieldPlaceholder="e.g. Smith" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid last name." fieldTabIndex={2} fieldAutoComplete={'on'} fieldRequired={true} />
					</Col>
				</Row>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} fieldTabIndex={3} fieldAutoComplete={'on'} fieldRequired={true} />
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="mobile" fieldLabel="Mobile" fieldValue={this.state.mobile} fieldPlaceholder="e.g. +44 (0) 777-777-7777 (optional)" handleChange={this.handleChangeMobile} handleBlur={this.handleBlur} valueMissing="Please provide a valid mobile number." fieldTabIndex={4} fieldAutoComplete={'on'} fieldRequired={false} />
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="hourlyRate" fieldLabel="Hourly Rate" fieldValue={this.state.hourlyRate} fieldPlaceholder="e.g. £7.50 (optional)" handleChange={this.handleChangeHourlyRate} handleBlur={this.handleBlur} valueMissing="Please provide a valid hourly rate." fieldTabIndex={5} fieldRequired={false} />
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="salary" fieldLabel="Salary" fieldValue={this.state.salary} fieldPlaceholder="e.g. £20,000.00 (optional)" handleChange={this.handleChangeSalary} handleBlur={this.handleBlur} valueMissing="Please provide a valid salary." fieldTabIndex={6} fieldRequired={false} />
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="weeklyContractHours" fieldLabel="Weekly Contract Hours" fieldValue={this.state.weeklyContractHours} fieldPlaceholder="e.g. 37.5 (optional)" handleChange={this.handleChangeWeeklyContractHours} handleBlur={this.handleBlur} valueMissing="Please provide a valid weekly contract hours." fieldTabIndex={7} fieldRequired={false} />
					</Col>
				</Row>
				{(this.props.editMode) ? (
					<Fragment>
						<Button type="submit" color="primary" className="mt-4" id="submitUpdateEmployee" title={routes.EMPLOYEES.UPDATE.TITLE} tabIndex="8" block>{routes.EMPLOYEES.UPDATE.TITLE}</Button>
						<Button type="button" className="mt-4 text-danger btn btn-outline-danger" id="submitDeleteEmployee" title={routes.EMPLOYEES.DELETE.TITLE} tabIndex="9" block onClick={this.handleDelete}>{routes.EMPLOYEES.DELETE.TITLE}</Button>
					</Fragment>
				) : (
					<Button type="submit" color="primary" className="mt-4" id="submitCreateEmployee" title={routes.EMPLOYEES.CREATE.TITLE} tabIndex="8" block>{routes.EMPLOYEES.CREATE.TITLE}</Button>
				)}
			</FormWithConstraints>
		</Fragment>
	);
}

EmployeeForm.propTypes = propTypes;

EmployeeForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rota: state.rota,
	rotaType: state.rotaType,
	editMode: props.editMode,
	employees: state.employees,
	employeeId: props.employeeId,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getShifts,
		getEmployees,
		createEmployee,
		updateEmployee,
		deleteEmployee,
		orderEmployees,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeForm);
