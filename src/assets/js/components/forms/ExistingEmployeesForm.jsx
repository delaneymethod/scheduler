import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import differenceBy from 'lodash/differenceBy';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import logMessage from '../../helpers/logging';

import { getShifts } from '../../actions/shiftActions';

import { getEmployees } from '../../actions/employeeActions';

import { getRotaEmployees } from '../../actions/rotaEmployeeActions';

import { createRotaTypeEmployees } from '../../actions/rotaTypeEmployeeActions';

const routes = config.APP.ROUTES;

const propTypes = {
	rota: PropTypes.object.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	rotaEmployees: PropTypes.array.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	rota: {},
	rotaType: {},
	employees: [],
	rotaEmployees: [],
	handleClose: () => {},
	handleSuccessNotification: () => {},
};

class ExistingEmployeesForm extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleSelectAll = this.handleSelectAll.bind(this);

		this.handleGetEmployees = this.handleGetEmployees.bind(this);

		this.handleGetRotaEmployees = this.handleGetRotaEmployees.bind(this);

		this.handleChangeToggleSwitch = this.handleChangeToggleSwitch.bind(this);
	}

	getInitialState = () => ({
		error: {},
		selectAll: false,
		accountEmployeeIds: differenceBy(this.props.employees, this.props.rotaEmployees, 'accountEmployeeId').reduce((state, accountEmployee) => ({
			...state,
			[`account_employee_id_${accountEmployee.accountEmployeeId}`]: false,
		}), []),
	});

	handleSelectAll = () => this.setState({ selectAll: !this.state.selectAll }, () => this.setState({
		accountEmployeeIds: differenceBy(this.props.employees, this.props.rotaEmployees, 'accountEmployeeId').reduce((state, accountEmployee) => ({
			...state,
			[`account_employee_id_${accountEmployee.accountEmployeeId}`]: this.state.selectAll,
		}), []),
	}));

	handleChangeToggleSwitch = (event) => {
		const { name, checked } = event.currentTarget;

		this.setState(prevState => ({
			...prevState,
			accountEmployeeIds: {
				...prevState.accountEmployeeIds,
				[name]: checked,
			},
		}));
	};

	handleGetRotaEmployees = () => {
		const { rota, actions } = this.props;

		logMessage('info', 'Called ExistingEmployeesForm handleGetRotaEmployees getRotaEmployees');

		return actions.getRotaEmployees(rota).catch(error => Promise.reject(error));
	};

	handleGetEmployees = () => {
		logMessage('info', 'Called ExistingEmployeesForm handleGetEmployees getEmployees');

		return this.props.actions.getEmployees().catch(error => Promise.reject(error));
	};

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		logMessage('info', 'Called ExistingEmployeesForm handleGetShifts getShifts');

		return actions.getShifts(payload).catch(error => Promise.reject(error));
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions, rotaType: { rotaTypeId } } = this.props;

		this.setState({ error: {} });

		if (this.form.isValid()) {
			let message = '';

			const { accountEmployeeIds } = this.state;

			const employees = Object.keys(accountEmployeeIds)
				.filter(accountEmployee => accountEmployeeIds[accountEmployee])
				.map(accountEmployeeId => accountEmployeeId.replace('account_employee_id_', ''));

			const payload = {
				employees,
				rotaTypeId,
			};

			logMessage('info', 'Called ExistingEmployeesForm handleSubmit createRotaTypeEmployees');

			actions.createRotaTypeEmployees(payload)
				/* I guess the API could return the ordered list of employees so we dont need to make this extra call */
				.then(() => this.handleGetEmployees())
				.then(() => this.handleGetRotaEmployees())
				.then(() => this.handleGetShifts())
				.then(() => {
					/* Close the modal */
					this.props.handleClose();

					/* FIXME - Make messages constants in config */
					message = '<p>Rota was updated!</p>';

					/* Pass a message back up the rabbit hole to the parent component */
					this.props.handleSuccessNotification(message);
				})
				.catch(error => this.setState({ error }));
		}
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} className="mb-5" /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<Row>
					<Col xs="12" sm="12" md="12" lg="12" xl="12">
						<Row className="d-flex justify-content-center">
							<Col className="align-self-center text-left" xs="8" sm="8" md="6" lg="6" xl="6">
								<Label check className="mt-2 mb-2">Select All</Label>
							</Col>
							<Col className="align-self-center text-right" xs="4" sm="4" md="6" lg="6" xl="6">
								<Label check className="switch mt-2 mb-2">
									<input type="checkbox" name="toggle_all_switches" onChange={this.handleSelectAll} checked={this.state.selectAll} />
									<span className="slider round"></span>
								</Label>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row>
					{differenceBy(this.props.employees, this.props.rotaEmployees, 'accountEmployeeId').map((accountEmployee, accountEmployeeIndex) => (
						<Col key={accountEmployeeIndex} xs="12" sm="12" md="12" lg="12" xl="12">
							<Row className="d-flex justify-content-center">
								<Col className="align-self-center text-left" xs="8" sm="8" md="6" lg="6" xl="6">
									<Label check className="mt-2 mb-2">{accountEmployee.employee.firstName} {accountEmployee.employee.lastName}</Label>
								</Col>
								<Col className="align-self-center text-right" xs="4" sm="4" md="6" lg="6" xl="6">
									<Label check className="switch mt-2 mb-2">
										<input type="checkbox" name={`account_employee_id_${accountEmployee.accountEmployeeId}`} onChange={this.handleChangeToggleSwitch} checked={(this.state.accountEmployeeIds[`account_employee_id_${accountEmployee.accountEmployeeId}`])} />
										<span className="slider round"></span>
									</Label>
								</Col>
							</Row>
						</Col>
					))}
				</Row>
				<Button type="submit" color="primary" className="mt-5" id="submitExistingEmployees" title={routes.EMPLOYEES.EXISTING.TITLE} tabIndex="2" block>{routes.EMPLOYEES.EXISTING.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

ExistingEmployeesForm.propTypes = propTypes;

ExistingEmployeesForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rota: state.rota,
	rotaType: state.rotaType,
	employees: state.employees,
	rotaEmployees: state.rotaEmployees,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getShifts,
		getEmployees,
		getRotaEmployees,
		createRotaTypeEmployees,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExistingEmployeesForm);
