import moment from 'moment';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sortBy, isEmpty } from 'lodash';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';

import Modal from '../../../common/Modal';

import Header from '../../../common/Header';

import Toolbar from '../../../common/Toolbar';

import ShiftForm from '../../../forms/ShiftForm';

import EmployeeForm from '../../../forms/EmployeeForm';

import constants from '../../../../helpers/constants';

import { updateShift } from '../../../../actions/shiftActions';

import { updatePlacement } from '../../../../actions/placementActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	week: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	shifts: PropTypes.array.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	week: {},
	rota: {},
	rotas: [],
	shifts: [],
	rotaType: {},
	employees: [],
	authenticated: false,
};

class Employees extends Component {
	constructor(props) {
		super(props);

		const { history, authenticated } = this.props;

		if (!authenticated) {
			history.push(routes.LOGIN.URI);
		}

		this.state = this.getInitialState();

		this.handleSort = this.handleSort.bind(this);

		this.handleModal = this.handleModal.bind(this);

		this.handleFilter = this.handleFilter.bind(this);

		this.handleShiftDrop = this.handleShiftDrop.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleUpdateShift = this.handleUpdateShift.bind(this);

		this.handleCancelEvent = this.handleCancelEvent.bind(this);

		this.handleShiftDragOver = this.handleShiftDragOver.bind(this);

		this.handleShiftDragEnter = this.handleShiftDragEnter.bind(this);

		this.handleShiftDragStart = this.handleShiftDragStart.bind(this);

		this.handleCreateEmployee = this.handleCreateEmployee.bind(this);

		this.handleUploadEmployees = this.handleUploadEmployees.bind(this);
	}

	getInitialState = () => ({
		error: {},
		employeeId: '',
		startDate: moment(),
		isErrorModalOpen: false,
		isShiftModalOpen: false,
		isEmployeeModalOpen: false,
	});

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.EMPLOYEES.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	};

	handleSort = () => {};

	handleFilter = () => {};

	handleUploadEmployees = () => {};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen });

	handleCreateEmployee = () => this.setState({ isEmployeeModalOpen: !this.state.isEmployeeModalOpen });

	handleCreateShift = (employeeId, startDate) => this.setState({ startDate, employeeId, isShiftModalOpen: !this.state.isShiftModalOpen });

	handleUpdateShift = (shiftId, employeeId, date) => {
		const { actions } = this.props;

		/* Get the shifts rota id based on current rota */
		const { rotaId } = this.props.rota;

		/* Get the shift based on shift id */
		const shift = this.props.shifts.filter(kiss => kiss.shiftId === shiftId).shift();

		/* The shift start and end times dont change so we can grab these to create the new start and end time values that will be based off the new date */
		let { endTime, startTime } = shift;

		/* Deconstructing all the values we need to create our new payload that updates the shift and placement */
		const { roleName } = shift.role;

		const {
			isClosingShift,
			numberOfPositions,
		} = shift;

		/* We need to make sure our new start and end values are in the correct format like 2018-06-05 18:50:00 */
		endTime = `${date} ${moment(endTime).format('HH:mm:ss')}`;

		startTime = `${date} ${moment(startTime).format('HH:mm:ss')}`;

		/* Put together our payload */
		let payload = {
			rotaId,
			shiftId,
			endTime,
			roleName,
			startTime,
			isClosingShift,
			numberOfPositions,
		};

		console.log('Called Employees handleUpdateShift updateShift');
		return actions.updateShift(payload)
			.then((updatedShift) => {
				console.log('Updated Shift:', updatedShift);

				/**
				 * If the employee id is the same as the shifts employee id, we can assume the user has just dragged the shift into a different day in the same employees row
				 * If the employee id is different, then we can assume the user has dragged and shift into a different employees row
				 */
				payload = {
					shiftId,
					employeeId,
				};

				console.log('Called Employees handleUpdateShift updatePlacement');
				return actions.updatePlacement(payload)
					.then((placement) => {
						console.log('Updated Placement: ', placement);

						/* So we return true so the drop action is completed */
						return true;
					})
					.catch((error) => {
						this.setState({ error });

						this.handleModal();

						/* So we return false so the drop action is not completed */
						return false;
					});
			})
			.catch((error) => {
				this.setState({ error });

				this.handleModal();

				/* So we return false so the drop action is not completed */
				return false;
			});
	};

	handleShiftDrop = async (event) => {
		this.handleCancelEvent(event);

		const { target } = event;

		/* Get the draggable element */
		const shift = document.getElementById(event.dataTransfer.getData('text'));

		/* Now lets grab the shifts info and the new table cell date and employee id, as we need to update the shift after dropping it */
		const shiftId = shift.getAttribute('data-shift-id');

		/* This is the date of the new table cell */
		const date = event.target.getAttribute('data-date');

		const employeeId = event.target.getAttribute('data-employee-id');

		/* We wait for a result incase we have to stop the shift move */
		const updated = await this.handleUpdateShift(shiftId, employeeId, date);

		if (updated) {
			/* Attach to its new table cell */
			target.appendChild(shift);
		}

		return false;
	};

	handleCancelEvent = event => event.preventDefault();

	handleShiftDragOver = event => this.handleCancelEvent(event);

	handleShiftDragEnter = event => this.handleCancelEvent(event);

	handleShiftDragStart = event => event.dataTransfer.setData('text', event.target.id);

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Toolbar />
			<ul>
				<li>Rota Name: {this.props.rotaType.rotaTypeName}</li>
				<li>Rota Budget: {this.props.rota.budget}</li>
				<li>Rota Status: {this.props.rota.status}</li>
			</ul>
			<div className="table-responsive u-disable-selection">
				<table className="table rota-table p-0 mb-0 bg-light">
					<thead>
						<tr className="thead-bg">
							<th scope="col" className="cell-employee table-config text-uppercase">
								<div>Employees ({this.props.employees.length})</div>
								<div className="btn-wrap">
									<button type="button" className="btn btn-dark btn-icon mr-2" title="Filter by" aria-label="Filter by"><i className="fa fa-fw fa-filter" aria-hidden="true"></i></button>
									<button type="button" className="btn btn-dark btn-icon mr-2" title="Sort by" aria-label="Sort by"><i className="fa fa-fw fa-sort" aria-hidden="true"></i></button>
									<button type="button" className="btn btn-secondary btn-icon mr-2" title="Upload Employees" aria-label="Upload Employees" onClick={this.handleUploadEmployees}><i className="fa fa-fw fa-upload" aria-hidden="true"></i></button>
									<button type="button" className="btn btn-secondary btn-icon" title="Add New Employee" aria-label="Add New Employee" onClick={this.handleCreateEmployee}><i className="fa fa-fw fa-user-plus" aria-hidden="true"></i></button>
								</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/0</div>
								</div>
								<div>Mon 11th</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/0</div>
								</div>
								<div>Tue 12th</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/0</div>
								</div>
								<div>Wed 13rd</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/0</div>
								</div>
								<div>Thu 14th</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/0</div>
								</div>
								<div>Fri 15th</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/0</div>
								</div>
								<div>Sat 16th</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/0</div>
								</div>
								<div>Sun 17th</div>
							</th>
							<th scope="col">Total</th>
						</tr>
					</thead>
					<tbody>
						{(this.props.employees.length > 0) ? this.props.employees.map((accountEmployee, accountEmployeeIndex) => (
							<tr key={accountEmployeeIndex}>
								<td scope="row" className="cell-employee">
									<div className="d-flex align-items-center">
										<div className="flex-column cell-employee__avatar">
											<Avatar email={accountEmployee.employee.email} round={true} size="60" />
										</div>
										<div className="flex-column cell-employee__details">
											<div className="flex-row cell-employee__details-name">{accountEmployee.employee.firstName} {accountEmployee.employee.surname}</div>
											<div className="flex-row cell-employee__details-attr">
												<i className={`fa fa-fw fa-gbp ${(!isEmpty(accountEmployee.hourlyRate) || !isEmpty(accountEmployee.salary)) ? 'complete' : ''}`} aria-hidden="true"></i>
												<i className={`fa fa-fw fa-envelope ${(!isEmpty(accountEmployee.employee.email)) ? 'complete' : ''}`} aria-hidden="true"></i>
												<i className={`fa fa-fw fa-phone ${(!isEmpty(accountEmployee.employee.telephone)) ? 'complete' : ''}`} aria-hidden="true"></i>
											</div>
										</div>
									</div>
								</td>
								<td className="cell-draggable" data-date="2018-06-11" data-employee-id={accountEmployee.employee.employeeId} onDrop={this.handleShiftDrop} onDragOver={this.handleShiftDragOver} onDragEnter={this.handleShiftDragEnter}>
									<button type="button" className="add-shift-block" onClick={() => this.handleCreateShift(accountEmployee.employee.employeeId, '2018-06-11')}><i className="fa fa-fw fa-plus" aria-hidden="true"></i></button>
								</td>
								<td className="cell-draggable" data-date="2018-06-12" data-employee-id={accountEmployee.employee.employeeId} onDrop={this.handleShiftDrop} onDragOver={this.handleShiftDragOver} onDragEnter={this.handleShiftDragEnter}>
								</td>
								<td className="cell-draggable" data-date="2018-06-13" data-employee-id={accountEmployee.employee.employeeId} onDrop={this.handleShiftDrop} onDragOver={this.handleShiftDragOver} onDragEnter={this.handleShiftDragEnter}>
									<button className="shift-block" id={`shift[${accountEmployeeIndex}][0]`} data-shift-id="55776768-da61-4b60-aecb-5c09863ff740" title="Toggle Shift Options" aria-label="Toggle Shift Options" draggable="true" onDragStart={this.handleShiftDragStart}>
										<div className="shift-block__data-row"><strong>Cleaner</strong> (5 hrs)</div>
										<div className="shift-block__data-row">10:00am - 15:00pm</div>
									</button>
								</td>
								<td className="cell-draggable" data-date="2018-06-14" data-employee-id={accountEmployee.employee.employeeId} onDrop={this.handleShiftDrop} onDragOver={this.handleShiftDragOver} onDragEnter={this.handleShiftDragEnter}>
								</td>
								<td className="cell-draggable" data-date="2018-06-15" data-employee-id={accountEmployee.employee.employeeId} onDrop={this.handleShiftDrop} onDragOver={this.handleShiftDragOver} onDragEnter={this.handleShiftDragEnter}>
								</td>
								<td className="cell-draggable" data-date="2018-06-16" data-employee-id={accountEmployee.employee.employeeId} onDrop={this.handleShiftDrop} onDragOver={this.handleShiftDragOver} onDragEnter={this.handleShiftDragEnter}>
								</td>
								<td className="cell-draggable" data-date="2018-06-17" data-employee-id={accountEmployee.employee.employeeId} onDrop={this.handleShiftDrop} onDragOver={this.handleShiftDragOver} onDragEnter={this.handleShiftDragEnter}>
								</td>
								<td className="row-total">
									<div>0.00 hrs</div>
									<div>(&pound;0.00)</div>
								</td>
							</tr>
						)) : null}
					</tbody>
					<tfoot>
						<tr>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">Total Hours</div>
										<div className="flex-row">Total Shifts</div>
									</div>
									<div className="flex-column text-danger">Total Costs</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">&pound;0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">&pound;0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">&pound;0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">&pound;0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">&pound;0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">&pound;0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">&pound;0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">&pound;0.00</div>
								</div>
							</th>
						</tr>
					</tfoot>
				</table>
			</div>
			<Modal title="Shifts" className="modal-dialog" buttonLabel="Cancel" show={this.state.isShiftModalOpen} onClose={this.handleCreateShift}>
				<ShiftForm employeeId={this.state.employeeId} startDate={this.state.startDate} />
			</Modal>
			<Modal title="Employees" className="modal-dialog" buttonLabel="Cancel" show={this.state.isEmployeeModalOpen} onClose={this.handleCreateEmployee}>
				<EmployeeForm />
			</Modal>
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
		</Fragment>
	);
}

Employees.propTypes = propTypes;

Employees.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	week: state.week,
	rota: state.rota,
	rotas: state.rotas,
	shifts: state.shifts,
	rotaType: state.rotaType,
	employees: state.employees,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		updateShift,
		updatePlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
