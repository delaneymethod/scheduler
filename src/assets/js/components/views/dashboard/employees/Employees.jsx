import moment from 'moment';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import momentDurationFormat from 'moment-duration-format';
import { delay, sortBy, isEmpty, debounce } from 'lodash';

import Modal from '../../../common/Modal';

import Header from '../../../common/Header';

import Toolbar from '../../../common/Toolbar';

import ShiftForm from '../../../forms/ShiftForm';

import EmployeeForm from '../../../forms/EmployeeForm';

import constants from '../../../../helpers/constants';

import { updatePlacement } from '../../../../actions/placementActions';

import { getShifts, updateShift } from '../../../../actions/shiftActions';

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

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleShiftDrop = this.handleShiftDrop.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleUpdateShift = this.handleUpdateShift.bind(this);

		this.handleCancelEvent = this.handleCancelEvent.bind(this);

		this.handleShiftDragOver = this.handleShiftDragOver.bind(this);

		this.handleShiftDragEnter = this.handleShiftDragEnter.bind(this);

		this.handleShiftDragStart = this.handleShiftDragStart.bind(this);

		this.handleCreateEmployee = this.handleCreateEmployee.bind(this);

		this.handleUploadEmployees = this.handleUploadEmployees.bind(this);

		this.handleHoursToDuration = this.handleHoursToDuration.bind(this);
	}

	getInitialState = () => ({
		error: {},
		tableData: {},
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

		/* We debounce this call to wait 400ms (we do not want the leading (or "immediate") flag passed because we want to wait until all the componentDidUpdate calls have finished before loading the table data again) */
		this.handleFetchData = debounce(this.handleFetchData.bind(this), 500);
	};

	componentDidUpdate = (prevProps, prevState) => {
		/* If the current week, current rota, current rota type, employees or shifts had any changes, re/load the table */
		if (prevProps.week !== this.props.week || prevProps.rota !== this.props.rota || prevProps.rotaType !== this.props.rotaType || prevProps.employees !== this.props.employees || prevProps.shifts !== this.props.shifts) {
			this.handleFetchData();
		}
	};

	handleSort = () => {};

	handleFilter = () => {};

	handleUploadEmployees = () => {};

	handleHoursToDuration = (hours) => {
		let duration = 0;

		/* Converting the total hours into a better format of hours and minutes */
		if (hours > 0) {
			const hoursMinutes = hours.toString().split('.');

			if (hoursMinutes.length > 1) {
				/* Converts 75 to 0.75 */
				let minutes = parseFloat('0.'.concat(hoursMinutes[1]));

				minutes = moment.duration(minutes, 'hours').format('mm');

				duration = `${hoursMinutes[0]}hrs ${minutes}mins`;
			} else {
				duration = `${hoursMinutes[0]}hrs`;
			}
		}

		return duration;
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen });

	handleCreateEmployee = () => this.setState({ isEmployeeModalOpen: !this.state.isEmployeeModalOpen });

	handleFetchData = () => {
		console.log('Called Employees handleFetchData');

		/* All table data is based off the current week rota - from the start to the end so lets get all our day/dates for the week */
		const weekDates = [];

		const tableData = {
			body: {
				rows: [],
			},
			header: {
				columns: [],
			},
			footer: {
				columns: [],
			},
		};

		const { startDate, endDate } = this.props.week;

		const start = startDate.clone();

		while (start.isBefore(endDate)) {
			weekDates.push(start.toDate());

			start.add(1, 'days');
		}

		/* Loop over each day in the week and build our table header and footer data */
		weekDates.forEach((weekDate) => {
			/* FIXME - Hook up */
			tableData.header.columns.push({
				count: 0,
				total: 0,
				weekDate,
				placementStatus: 'todo',
			});

			/* Sets some defaults as totals will be worked out in the table body loops */
			tableData.footer.columns.push({
				cost: 0,
				hours: 0,
				shifts: 0,
			});
		});

		/* We need an 8th footer column for the total of totals */
		tableData.footer.columns.push({
			cost: 0,
			hours: 0,
			shifts: 0,
		});

		/* Loop over each employee and build our table body data */
		this.props.employees.forEach((accountEmployee) => {
			/* Each row holds employee info */
			const row = {};

			/* When we loop over each day in the week, we use this to build up our columns with shifts info */
			row.columns = [];

			/* First column has our employee info */
			row.accountEmployee = accountEmployee;

			/**
			 * Last column in each row has our totals per employee as per below.
			 * This is the total cost per employee.
			 */
			row.cost = 0;

			/* This is the total hours per employee */
			row.hours = 0;

			row.duration = 0;

			weekDates.forEach((weekDate, weekDateIndex) => {
				const shiftsPlacements = [];

				/* Loop over all the shifts and get current date shifts */
				const shifts = this.props.shifts.filter(data => moment(data.startTime).format('YYYY-MM-DD') === moment(weekDate).format('YYYY-MM-DD'));

				/* Now we have to loop over all the shifts, grabbing the shifts belong to the current employee since the shifts API has all shifts not just those assigned to employees */
				shifts.forEach((shift) => {
					/* If the shift has placements, we can assume its been assigned to an employee */
					if (shift.placements.length > 0) {
						const placement = shift.placements.filter(data => data.employee.employeeId === accountEmployee.employee.employeeId).shift();

						/* So we've found a matching placement for the current employee so lets build up the shift/placement data for the column */
						if (!isEmpty(placement)) {
							const {
								cost,
								employee: {
									employeeId,
								},
								placementId,
							} = placement;

							const {
								role: {
									roleName,
								},
								shiftId,
								endTime,
								startTime,
								isClosingShift,
								numberOfPositions,
							} = shift;

							let duration = 0;

							let hours = moment.duration(moment(endTime).diff(moment(startTime))).asHours();

							/* Round the hours so 10.988888 becomes 11 hours, for example */
							hours = (Math.round(hours * 12) / 12).toFixed(2);

							/* Converting the shift hours into a better format of hours and minutes */
							if (hours > 0) {
								duration = this.handleHoursToDuration(hours);
							}

							const shiftPlacement = {
								cost,
								hours,
								duration,
								shiftId,
								endTime,
								roleName,
								startTime,
								employeeId,
								placementId,
								isClosingShift,
								numberOfPositions,
							};

							/* Keeping track of totals per row/employee */
							row.cost = parseFloat(row.cost) + parseFloat(cost);

							row.hours = parseFloat(row.hours) + parseFloat(hours);

							/* Converting the total hours into a better format of hours and minutes */
							if (row.hours > 0) {
								row.duration = this.handleHoursToDuration(row.hours);
							}

							/* Add shift/placement column */
							shiftsPlacements.push(shiftPlacement);

							/* This is where we total up the total cost, hours and shifts per row/employee and assign to the current date to finish our footer info. */
							tableData.footer.columns[weekDateIndex].shifts = parseInt(tableData.footer.columns[weekDateIndex].shifts, 10) + 1;

							tableData.footer.columns[weekDateIndex].cost = parseFloat(tableData.footer.columns[weekDateIndex].cost) + parseFloat(cost);

							tableData.footer.columns[weekDateIndex].hours = parseFloat(tableData.footer.columns[weekDateIndex].hours) + parseFloat(hours);

							/* This is where we total up the last column with the total of totals for each days cost, hours and shifts */
							tableData.footer.columns[7].shifts = parseInt(tableData.footer.columns[7].shifts, 10) + 1;

							tableData.footer.columns[7].cost = parseFloat(tableData.footer.columns[7].cost) + parseFloat(cost);

							tableData.footer.columns[7].hours = parseFloat(tableData.footer.columns[7].hours) + parseFloat(hours);
						}
					}
				});

				/* This is our column structure so we can drag and drop */
				row.columns.push({
					weekDate,
					accountEmployee,
					shiftsPlacements,
				});
			});

			tableData.body.rows.push(row);
		});

		/* Stick everything into the state */
		this.setState({ tableData });
	};

	handleCreateShift = (employeeId, startDate) => this.setState({ startDate, employeeId, isShiftModalOpen: !this.state.isShiftModalOpen });

	handleUpdateShift = (shiftId, placementId, employeeId, date) => {
		const { actions } = this.props;

		/* Get the shifts rota id based on current rota */
		const { rotaId } = this.props.rota;

		/* Get the shift based on shift id */
		const shift = this.props.shifts.filter(data => data.shiftId === shiftId).shift();

		/* The shift start and end times dont change so we can grab these to create the new start and end time values that will be based off the new date */
		let { endTime, startTime } = shift;

		/* Deconstructing all the values we need to create our new payload that updates the shift and placement */
		const { roleName } = shift.role;

		const {
			isClosingShift,
			numberOfPositions,
		} = shift;

		/* We need to make sure our new start and end values are in the correct format like 2018-06-05 18:50:00 */
		endTime = `${date} ${moment(endTime).utc().format('HH:mm:ss')}`;

		startTime = `${date} ${moment(startTime).utc().format('HH:mm:ss')}`;

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
		actions.updateShift(payload)
			/* Check if we need to update the placement */
			.then(() => {
				/* Get the matching placement (based on the employee id) */
				const placement = shift.placements.filter(data => data.employee.employeeId === employeeId).shift();

				/**
				 * If the placement is empty, this means that no matching placement was found for the employee id for the dropped cell, so we need to update the placement.
				 * If there was a match, the shift belongs to same employee id of the dropped cell.
				 */
				if (isEmpty(placement)) {
					payload = {
						shiftId,
						employeeId,
						placementId,
					};

					/**
					 * If the employee id is the same as the shifts employee id, we can assume the user has just dragged the shift into a different day in the same employees row
					 * If the employee id is different, then we can assume the user has dragged and shift into a different employees row
					 */
					console.log('Called Employees handleUpdateShift updatePlacement');
					actions.updatePlacement(payload)
						.then(() => this.handleGetShifts(rotaId))
						.catch((error) => {
							this.setState({ error });

							this.handleModal();
						});
				} else {
					this.handleGetShifts(rotaId);
				}
			})
			.catch((error) => {
				this.setState({ error });

				this.handleModal();
			});
	};

	handleGetShifts = (rotaId) => {
		const { actions } = this.props;

		/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
		const payload = {
			rotaId,
		};

		console.log('Called Employees handleGetShifts getShifts');
		actions.getShifts(payload).catch((error) => {
			this.setState({ error });

			this.handleModal();
		});
	};

	handleShiftDrop = (event) => {
		this.handleCancelEvent(event);

		const { currentTarget } = event;

		/* Get the draggable element */
		const shift = document.getElementById(event.dataTransfer.getData('text'));

		/* Now lets grab the shifts info and the new table cell date and employee id, as we need to update the shift after dropping it */
		const shiftId = shift.getAttribute('data-shift-id');

		const placementId = shift.getAttribute('data-placement-id');

		/* This is the date of the new table cell */
		const date = event.currentTarget.getAttribute('data-date');

		const employeeId = event.currentTarget.getAttribute('data-employee-id');

		/* We wait for a result incase we have to stop the shift move */
		this.handleUpdateShift(shiftId, placementId, employeeId, date);

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
			{(!isEmpty(this.state.tableData)) ? (
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
								{this.state.tableData.header.columns.map((column, index) => (
									<th key={index} scope="col">
										<div className="placement-status">
											<div className={`indicator ${column.placementStatus}`}></div>
											<div className="count">{column.count}/{column.total}</div>
										</div>
										<div>{moment(column.weekDate).format('ddd Do')}</div>
									</th>
								))}
								<th scope="col">Total</th>
							</tr>
						</thead>
						<tbody>
							{this.state.tableData.body.rows.map((row, rowIndex) => (
								<tr key={rowIndex}>
									<td scope="row" className="cell-employee">
										<div className="d-flex align-items-center">
											<div className="flex-column cell-employee__avatar">
												<Avatar email={row.accountEmployee.employee.email} round={true} size="60" />
											</div>
											<div className="flex-column cell-employee__details">
												<div className="flex-row cell-employee__details-name">{row.accountEmployee.employee.firstName} {row.accountEmployee.employee.surname}</div>
												<div className="flex-row cell-employee__details-attr">
													<i className={`fa fa-fw fa-gbp ${(!isEmpty(row.accountEmployee.hourlyRate) || !isEmpty(row.accountEmployee.salary)) ? 'complete' : ''}`} aria-hidden="true"></i>
													<i className={`fa fa-fw fa-envelope ${(!isEmpty(row.accountEmployee.employee.email)) ? 'complete' : ''}`} aria-hidden="true"></i>
													<i className={`fa fa-fw fa-phone ${(!isEmpty(row.accountEmployee.employee.contactNumber)) ? 'complete' : ''}`} aria-hidden="true"></i>
												</div>
											</div>
										</div>
									</td>
									{row.columns.map((column, columnIndex) => (
										(moment(column.weekDate).isBefore(moment(), 'day') ? (
											<td key={columnIndex} className="cell-non-draggable">
												{(column.shiftsPlacements.length > 0) ? column.shiftsPlacements.map((shiftPlacement, shiftPlacementIndex) => (
													<button key={shiftPlacementIndex} className="shift-block" id={`shift[${columnIndex}][${shiftPlacementIndex}]`} data-shift-id={shiftPlacement.shiftId} title="Click to toggle Shift options" aria-label="Click to toggle Shift options" draggable="true" onDragStart={this.handleShiftDragStart}>
														<div className="shift-block__data-row"><strong>{shiftPlacement.roleName}</strong> {(!shiftPlacement.isClosingShift) ? `(${shiftPlacement.hours} hrs)` : null}</div>
														<div className="shift-block__data-row">{moment(shiftPlacement.startTime).utc().format('HH:mm a')} - {(shiftPlacement.isClosingShift) ? 'Closing' : moment(shiftPlacement.endTime).utc().format('HH:mm a')}</div>
													</button>
												)) : null}
											</td>
										) : (
											<td key={columnIndex} data-date={moment(column.weekDate).format('YYYY-MM-DD')} data-employee-id={column.accountEmployee.employee.employeeId} className="cell-draggable" onDrop={this.handleShiftDrop} onDragOver={this.handleShiftDragOver} onDragEnter={this.handleShiftDragEnter}>
												{(column.shiftsPlacements.length > 0) ? column.shiftsPlacements.map((shiftPlacement, shiftPlacementIndex) => (
													<button key={shiftPlacementIndex} className="shift-block" id={`shift[${columnIndex}][${shiftPlacementIndex}]`} data-shift-id={shiftPlacement.shiftId} data-placement-id={shiftPlacement.placementId} title="Click to toggle Shift options" aria-label="Click to toggle Shift options" draggable="true" onDragStart={this.handleShiftDragStart}>
														<div className="shift-block__data-row"><strong>{shiftPlacement.roleName}</strong> {(!shiftPlacement.isClosingShift) ? `(${shiftPlacement.hours} hrs)` : null}</div>
														<div className="shift-block__data-row">{moment(shiftPlacement.startTime).utc().format('HH:mm a')} - {(shiftPlacement.isClosingShift) ? 'Closing' : moment(shiftPlacement.endTime).utc().format('HH:mm a')}</div>
													</button>
												)) : (
													<button type="button" className="add-shift-block" onClick={() => this.handleCreateShift(column.accountEmployee.employee.employeeId, moment(column.weekDate).format('YYYY-MM-DD'))}><i className="fa fa-fw fa-plus" aria-hidden="true"></i></button>
												)}
											</td>
										))
									))}
									<td className="row-total">
										<div>{row.hours.toFixed(2)} hrs</div>
										<div>(&pound;{row.cost.toFixed(2)})</div>
									</td>
								</tr>
							))}
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
								{this.state.tableData.footer.columns.map((column, columnIndex) => (
									<th key={columnIndex} scope="col" className="rota-table__footer-cell">
										<div className="d-flex align-items-center">
											<div className="flex-column">
												<div className="flex-row">{column.hours}</div>
												<div className="flex-row">{column.shifts}</div>
											</div>
											<div className="flex-column text-danger">&pound;{column.cost.toFixed(2)}</div>
										</div>
									</th>
								))}
							</tr>
						</tfoot>
					</table>
				</div>
			) : null}
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
		getShifts,
		updateShift,
		updatePlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
