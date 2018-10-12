import concat from 'lodash/concat';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import FileField from '../fields/FileField';

import logMessage from '../../helpers/logging';

import { getShifts } from '../../actions/shiftActions';

import { getEmployees, orderEmployees, uploadEmployees } from '../../actions/employeeActions';

const routes = config.APP.ROUTES;

const propTypes = {
	rota: PropTypes.object.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleInfoNoification: PropTypes.func.isRequired,
};

const defaultProps = {
	rota: {},
	rotaType: {},
	employees: [],
	handleClose: () => {},
	handleInfoNoification: () => {},
};

class UploadEmployeesForm extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleGetEmployees = this.handleGetEmployees.bind(this);

		this.handleUpdateEmployeeOrder = this.handleUpdateEmployeeOrder.bind(this);
	}

	getInitialState = () => ({
		error: {},
		file: null,
	});

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

		logMessage('info', 'Called UploadEmployeesForm handleUpdateEmployeeOrder orderEmployees');

		return actions.orderEmployees(payload).catch(error => Promise.reject(error));
	};

	handleGetEmployees = () => {
		logMessage('info', 'Called UploadEmployeesForm handleGetEmployees getEmployees');

		return this.props.actions.getEmployees().catch(error => Promise.reject(error));
	};

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		logMessage('info', 'Called UploadEmployeesForm handleGetShifts getShifts');

		return actions.getShifts(payload).catch(error => Promise.reject(error));
	};

	handleChange = file => this.setState({ file, error: {} });

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions } = this.props;

		this.setState({ error: {} });

		if (this.form.isValid()) {
			let message = '';

			const { file } = this.state;

			const payload = {
				file,
			};

			logMessage('info', 'Called UploadEmployeesForm handleSubmit uploadEmployees');

			actions.uploadEmployees(payload)
				.then((response) => {
					if (response.loadedEmployees.length > 0) {
						message += `<p>${response.loadedEmployees.length} employee${(response.loadedEmployees.length === 1) ? ' was' : 's were'} uploaded successfully!</p>`;
					}

					if (response.failedEmployees.length > 0) {
						message += `<p>${response.failedEmployees.length} employee${(response.failedEmployees.length === 1) ? ' was' : 's were'} not uploaded!</p>`;
						message += `<p>See reason${(response.failedEmployees.length === 1) ? '' : 's'} below:</p>`;
						message += '<ul class="list-unstyled">';

						response.failedEmployees.forEach((failedEmployee) => {
							message += `<li><i class="fa fa-fw fa-exclamation-triangle text-warning" aria-hidden="true"></i> ${failedEmployee.data[0]} ${failedEmployee.data[1]} - <i>${failedEmployee.reason}</i></li>`;
						});

						message += '</ul>';
					}

					return true;
				})
				/* Updating the employee will update the store with only the updated employee (as thats what the reducer passes back) so we need to do another call to get all the employees back into the store again */
				// .then(() => this.handleGetEmployees())
				// .then(() => this.handleUpdateEmployeeOrder())
				/* I guess the API could return the ordered list of employees so we dont need to make this extra call */
				.then(() => this.handleGetEmployees())
				.then(() => this.handleGetShifts())
				.then(() => {
					/* Close the modal */
					this.props.handleClose();

					/* Pass a message back up the rabbit hole to the parent component */
					this.props.handleInfoNotification(message);
				})
				.catch(error => this.setState({ error }));
		}
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} className="mb-5" /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<FileField fieldName="file" fieldLabel="File" handleChange={this.handleChange} valueMissing="Please provide a valid CSV file." tabIndex="1" fieldAccept=".csv, text/csv, application/vnd.ms-excel" fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-5" id="submitUploadEmployees" title={routes.EMPLOYEES.UPLOAD.TITLE} tabIndex="2" block>{routes.EMPLOYEES.UPLOAD.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

UploadEmployeesForm.propTypes = propTypes;

UploadEmployeesForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rota: state.rota,
	rotaType: state.rotaType,
	employees: state.employees,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getShifts,
		getEmployees,
		orderEmployees,
		uploadEmployees,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadEmployeesForm);
