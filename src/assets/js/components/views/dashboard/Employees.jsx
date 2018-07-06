import 'element-closest';
import moment from 'moment';
import Avatar from 'react-avatar';
import jwtDecode from 'jwt-decode';
import Orderable from 'sortablejs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { concat, isEmpty, includes, debounce } from 'lodash';
import { Form, Label, Input, Popover, FormGroup, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from '../../common/Modal';

import Header from '../../common/Header';

import Toolbar from '../../common/Toolbar';

import ShiftForm from '../../forms/ShiftForm';

import ShiftButton from '../../common/ShiftButton';

import CloseButton from '../../common/CloseButton';

import constants from '../../../helpers/constants';

import EmployeeForm from '../../forms/EmployeeForm';

import Notification from '../../common/Notification';

import AssignShiftForm from '../../forms/AssignShiftForm';

import CreateShiftButton from '../../common/CreateShiftButton';

import AssignShiftButton from '../../common/AssignShiftButton';

import { addClass, removeClass } from '../../../helpers/classes';

import UploadEmployeesForm from '../../forms/UploadEmployeesForm';

import { updatePlacement } from '../../../actions/placementActions';

import { getShifts, updateShift } from '../../../actions/shiftActions';

import { getEmployees, orderEmployees } from '../../../actions/employeeActions';

const routes = constants.APP.ROUTES;

const notifications = constants.APP.NOTIFICATIONS;

const propTypes = {
	week: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	shifts: PropTypes.array.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	user: {},
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

		let tokenExpired;

		const { history, authenticated } = this.props;

		if (!isEmpty(this.props.user)) {
			/* The tokens contains the expiry, so even though the users session storage still has authenticated as true, we need to make sure the token hasn't expired. */
			const token = jwtDecode(this.props.user.token);

			tokenExpired = moment().isAfter(moment.unix(token.exp));
		}

		if (!authenticated || tokenExpired) {
			history.push(routes.LOGIN.URI);
		}

		this.shift = null;

		this.toastId = null;

		/* this.oldDraggableCell = null; */

		this.state = this.getInitialState();

		this.handleDrop = this.handleDrop.bind(this);

		this.handleModal = this.handleModal.bind(this);

		this.handleSortBy = this.handleSortBy.bind(this);

		this.handleFilter = this.handleFilter.bind(this);

		this.handleDragEnd = this.handleDragEnd.bind(this);

		this.handleDragOver = this.handleDragOver.bind(this);

		this.handleDragStart = this.handleDragStart.bind(this);

		this.handleOrderable = this.handleOrderable.bind(this);

		this.handleDragEnter = this.handleDragEnter.bind(this);

		this.handleDragLeave = this.handleDragLeave.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleDragAndDrop = this.handleDragAndDrop.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleAssignShift = this.handleAssignShift.bind(this);

		this.handleUpdateShift = this.handleUpdateShift.bind(this);

		this.handleEditEmployee = this.handleEditEmployee.bind(this);

		this.handleSortEmployees = this.handleSortEmployees.bind(this);

		this.handleSortDirection = this.handleSortDirection.bind(this);

		this.handleCreateEmployee = this.handleCreateEmployee.bind(this);

		this.handleOrderEmployees = this.handleOrderEmployees.bind(this);

		this.handleUploadEmployees = this.handleUploadEmployees.bind(this);

		this.handleFilterEmployees = this.handleFilterEmployees.bind(this);

		this.handleInfoNotification = this.handleInfoNotification.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleUpdateEmployeeOrder = this.handleUpdateEmployeeOrder.bind(this);

		this.handleSwitchFromAssignShiftToCreateShift = this.handleSwitchFromAssignShiftToCreateShift.bind(this);
	}

	getInitialState = () => ({
		sort: {
			column: null,
			direction: 'asc',
		},
		error: {},
		tableData: {},
		employeeId: '',
		editMode: false,
		placementId: '',
		employeeName: '',
		startDate: moment(),
		isErrorModalOpen: false,
		isShiftModalOpen: false,
		isFilterPopoverOpen: false,
		isSortByPopoverOpen: false,
		isEmployeeModalOpen: false,
		isAssignShiftModalOpen: false,
		isUploadEmployeesModalOpen: false,
	});

	componentDidMount = () => {
		if (isEmpty(this.props.week)) {
			return;
		}

		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.EMPLOYEES.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);

		/* We debounce this call to wait 100ms (we do not want the leading (or "immediate") flag passed because we want to wait until all the componentDidUpdate calls have finished before loading the table data again */
		this.handleFetchData = debounce(this.handleFetchData.bind(this), 10);

		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait the user has finished ordering all rows before saving the order */
		this.handleUpdateEmployeeOrder = debounce(this.handleUpdateEmployeeOrder.bind(this), 1300);
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (isEmpty(this.props.week)) {
			return;
		}

		/* If the current week, current rota, current rota type, employees or shifts had any changes, re/load the table */
		if (prevProps.employees !== this.props.employees || prevProps.week !== this.props.week || prevProps.rota !== this.props.rota || prevProps.rotaType !== this.props.rotaType || prevProps.shifts !== this.props.shifts) {
			this.handleFetchData();
		}
	};

	handleSortEmployees = (event, column) => {
		event.preventDefault();

		const { sort, tableData } = this.state;

		let { direction } = sort;

		/* Change the sort direction if the same column is sorted. */
		if (sort.column === column) {
			direction = (direction === 'asc') ? 'desc' : 'asc';
		}

		/**
		 * This sorts strings taking into consideration numbers in strings.
		 * e.g., Account 1, Account 2, Account 10. Normal sorting would sort it Account 1, Account 10, Account 2.
		 */
		const collator = new Intl.Collator(undefined, {
			numeric: true,
			sensitivity: 'base',
		});

		/* Sort ascending */
		const sortedBodyRows = tableData.body.rows.sort((a, b) => {
			if (column === 'firstName') {
				return collator.compare(a.accountEmployee.employee.firstName, b.accountEmployee.employee.firstName);
			} else if (column === 'lastName') {
				return collator.compare(a.accountEmployee.employee.lastName, b.accountEmployee.employee.lastName);
			}

			return collator.compare(a.accountEmployee.accountEmployeeId, b.accountEmployee.accountEmployeeId);
		});

		/* Reverse the order if direction is descending */
		if (direction === 'desc') {
			sortedBodyRows.reverse();
		}

		tableData.body.rows = sortedBodyRows;

		this.setState({
			tableData,
			sort: {
				column,
				direction,
			},
		});
	};

	handleSortDirection = (column) => {
		const { sort } = this.state;

		let className = 'sort-direction';

		if (sort.column === column) {
			className = className.concat((sort.direction === 'asc') ? ' asc' : ' desc');
		}

		return className;
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen });

	handleSortBy = () => this.setState({ isSortByPopoverOpen: !this.state.isSortByPopoverOpen });

	handleFilter = () => this.setState({ isFilterPopoverOpen: !this.state.isFilterPopoverOpen });

	handleInfoNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.info(<Notification icon="fa-info-circle" title="Information" message={message} />, {
				autoClose: false,
				closeButton: <CloseButton />,
			});
		}
	};

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}
	};

	handleCreateEmployee = () => this.setState({ isEmployeeModalOpen: !this.state.isEmployeeModalOpen });

	handleUploadEmployees = () => this.setState({ isUploadEmployeesModalOpen: !this.state.isUploadEmployeesModalOpen });

	handleAssignShift = (event, employeeId, startDate) => this.setState({ startDate, employeeId, isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

	handleCreateShift = (event, employeeId, startDate) => this.setState({ startDate, employeeId, isShiftModalOpen: !this.state.isShiftModalOpen });

	handleEditEmployee = (event, employeeId) => this.setState({ editMode: true, employeeId, isEmployeeModalOpen: !this.state.isEmployeeModalOpen });

	handleFetchData = () => {
		console.log('Called Employees handleFetchData');

		const employees = this.handleOrderEmployees();

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
			/* Loop over all the shifts and get current date shifts */
			const shifts = this.props.shifts.filter(data => moment(data.startTime).format('YYYY-MM-DD') === moment(weekDate).format('YYYY-MM-DD'));

			/* Loop over all shifts for current date and total up the number of positions available */
			const total = shifts.map(data => data.numberOfPositions).reduce((prev, next) => prev + next, 0);

			tableData.header.columns.push({
				count: 0,
				total,
				weekDate,
				placementStatus: 'todo',
			});

			/* Sets some defaults as totals will be worked out in the table body loops */
			tableData.footer.columns.push({
				cost: 0,
				hours: 0,
				shifts: 0,
				last: false,
			});
		});

		/* We need an 8th footer column for the total of totals */
		tableData.footer.columns.push({
			cost: 0,
			hours: 0,
			shifts: 0,
			last: true,
		});

		/* Loop over each employee and build our table body data */
		employees.forEach((accountEmployee, accountEmployeeIndex) => {
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

			weekDates.forEach((weekDate, weekDateIndex) => {
				const shiftsPlacements = [];

				/* Loop over all the shifts and get current date shifts */
				const shifts = this.props.shifts.filter(data => moment(data.startTime).format('YYYY-MM-DD') === moment(weekDate).format('YYYY-MM-DD'));

				/* Now we have to loop over all the shifts, grabbing the shifts belong to the current employee since the shifts API has all shifts not just those assigned to employees */
				shifts.forEach((shift) => {
					/* If the shift has placements, we can assume its been assigned to an employee */
					if (shift.placements !== null) {
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

							let hours = moment.duration(moment(endTime).diff(moment(startTime))).asHours();

							/* Round the hours so 10.988888 becomes 11 hours, for example */
							hours = (Math.round(hours * 12) / 12).toFixed(2);

							const shiftPlacement = {
								cost,
								hours,
								shiftId,
								endTime,
								weekDate,
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

							/* Add shift/placement column */
							shiftsPlacements.push(shiftPlacement);

							/* This is where we total up the count of placements filled for our header info */
							tableData.header.columns[weekDateIndex].count = parseInt(tableData.header.columns[weekDateIndex].count, 10) + 1;

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

				const today = moment(weekDate).isSame(moment(), 'day');

				/* If the current week date value is in the past, e.g. today is Wednesday but the week date is Monday, we dont want users being able to drag shifts in to Monday. */
				const draggable = moment(weekDate).isBefore(moment(), 'day');

				if (tableData.header.columns[weekDateIndex].count === 0) {
					tableData.header.columns[weekDateIndex].placementStatus = 'todo';
				} else if (tableData.header.columns[weekDateIndex].count > 0 && tableData.header.columns[weekDateIndex].count < tableData.header.columns[weekDateIndex].total) {
					tableData.header.columns[weekDateIndex].placementStatus = 'doing';
				} else {
					tableData.header.columns[weekDateIndex].placementStatus = 'done';
				}

				tableData.header.columns[weekDateIndex].today = today;

				tableData.header.columns[weekDateIndex].draggable = draggable;

				/* Loop over all shifts and get the unassigned ones for current week date */
				const unassignedShifts = this.props.shifts.filter(data => (moment(data.startTime).format('YYYY-MM-DD') === moment(weekDate).format('YYYY-MM-DD')) && (data.placements === null || data.placements.length === 0));

				/* This is our column structure so we can drag and drop */
				row.columns.push({
					today,
					weekDate,
					draggable,
					accountEmployee,
					shiftsPlacements,
					unassignedShifts,
				});
			});

			tableData.body.rows.push(row);
		});

		/* Stick everything into the state */
		this.setState({ tableData });

		/* Add Orderable event listeners to table rows */
		this.handleOrderable();

		/* Adds drag and drop event listeners to table cells and shifts */
		this.handleDragAndDrop();
	};

	handleFilterEmployees = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		const tableBody = document.getElementById('tableBody');

		/* Quick and easy - loop over each table body row and hide / show rows based on employee full name values */
		Array.prototype.forEach.call(tableBody.rows, (row) => {
			const employeeFullName = row.querySelector('#fullname').textContent.toLowerCase();

			const employeeSearchName = target.value.toLowerCase();

			const display = includes(employeeFullName, employeeSearchName) ? 'display:table-row' : 'display:none';

			row.setAttribute('style', display);
		});
	};

	handleOrderEmployees = () => {
		/**
		 * Employees may have a different sort positions for different rota types,
		 * so we loop over each employee and get its sort position for the current rota type.
		 */
		let orderableEmployees = this.props.employees.filter(accountEmployee => accountEmployee.rotaTypeAccountEmployees && accountEmployee.rotaTypeAccountEmployees.find(({ rotaTypeId }) => this.props.rotaType.rotaTypeId === rotaTypeId));

		orderableEmployees = orderableEmployees.sort((a, b) => a.rotaTypeAccountEmployees.find(({ rotaTypeId }) => this.props.rotaType.rotaTypeId === rotaTypeId).sortPosition - b.rotaTypeAccountEmployees.find(({ rotaTypeId }) => this.props.rotaType.rotaTypeId === rotaTypeId).sortPosition);

		/* Grab all employees without sort positions setup for rota types */
		const nonOrderableEmployees = this.props.employees.filter(accountEmployee => !accountEmployee.rotaTypeAccountEmployees || !accountEmployee.rotaTypeAccountEmployees.find(({ rotaTypeId }) => this.props.rotaType.rotaTypeId === rotaTypeId));

		/* Now that employees with sort positions have been ordered, add back in the non sort position employees */
		return concat(orderableEmployees, nonOrderableEmployees);
	};

	handleOrderable = () => {
		Orderable.create(document.getElementById('tableBody'), {
			scroll: true,
			animation: 150,
			group: 'employees',
			dataIdAttr: 'data-account-employee-id',
			handle: '.drag-handler',
			draggable: '.draggable-row',
			ghostClass: 'draggable-row-ghost',
			store: {
				get: () => {
					const employees = this.handleOrderEmployees();

					/* The rows are sorted based on account employee id... */
					return employees.map(employee => employee.accountEmployeeId);
				},
				set: sortable => this.handleUpdateEmployeeOrder(sortable.toArray()),
			},
		});

		console.log('Called Employees handleOrderable - orderable listeners ready');
	};

	handleUpdateEmployeeOrder = (ids) => {
		const { actions } = this.props;

		/* Get the rota type id based on current rota type */
		const { rotaTypeId } = this.props.rotaType;

		const order = ids.map(data => data);

		const payload = {
			order,
			rotaTypeId,
		};

		console.log('Called Employees handleUpdateEmployeeOrder orderEmployees');
		actions.orderEmployees(payload)
			.then(() => {
				console.log('Called Employees handleUpdateEmployeeOrder getEmployees');
				actions.getEmployees().catch((error) => {
					this.setState({ error });

					this.handleModal();
				});
			})
			.catch((error) => {
				this.setState({ error });

				this.handleModal();
			});
	};

	handleUpdateShift = (shiftId, placementId, employeeId, date) => {
		const { actions } = this.props;

		/* Get the rota id based on current rota */
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

		/* We need to make sure our new start and end values are in the correct format like 2018-06-05 18:50:00 and in UTC */
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
						/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
						.then(() => this.handleGetShifts(rotaId))
						.catch((error) => {
							this.setState({ error });

							this.handleModal();
						});
				} else {
					/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
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

		const payload = {
			rotaId,
		};

		console.log('Called Employees handleGetShifts getShifts');
		actions.getShifts(payload).catch((error) => {
			this.setState({ error });

			this.handleModal();
		});
	};

	/* eslint-disable no-param-reassign */
	handleDragAndDrop = () => {
		const shifts = document.querySelectorAll('.shift');

		shifts.forEach((shift) => {
			shift.addEventListener('dragend', this.handleDragEnd);
			shift.addEventListener('dragstart', this.handleDragStart);
		});

		const draggableCells = document.querySelectorAll('.draggable-cell');

		draggableCells.forEach((draggableCell) => {
			draggableCell.addEventListener('drop', this.handleDrop);
			draggableCell.addEventListener('dragover', this.handleDragOver);
			draggableCell.addEventListener('dragenter', this.handleDragEnter);
			draggableCell.addEventListener('dragleave', this.handleDragLeave);
		});

		console.log('Called Employees handleDragAndDrop - drag and drop listeners ready');
	};

	handleDragStart = (event) => {
		const { target } = event;

		this.shift = target;

		/* this.oldDraggableCell = target.closest('.draggable-cell'); */

		addClass(target, 'shift-selected');

		/* Commented out due to non native drag and drop remove/append functionality below. See comments. */
		/* Hide the shift in the current cell when the user has selected it and dragging... */
		setTimeout(() => addClass(target, 'shift-invisible'), 0);
	};

	handleDragEnd = (event) => {
		const { target } = event;

		removeClass(target, 'shift-selected');

		removeClass(target, 'shift-invisible');
	};

	handleDragOver = event => event.preventDefault();

	handleDragEnter = (event) => {
		event.preventDefault();

		const draggableCell = event.target.closest('.draggable-cell');

		addClass(draggableCell, 'cell-highlighted');
	};

	handleDragLeave = (event) => {
		const draggableCell = event.target.closest('.draggable-cell');

		removeClass(draggableCell, 'cell-highlighted');
	};

	handleDrop = (event) => {
		event.preventDefault();

		event.stopPropagation();

		const { shift } = this;

		/* const { oldDraggableCell } = this; */

		const selectedDraggableCell = event.target.closest('.draggable-cell');

		const shiftId = shift.getAttribute('data-shift-id');

		const date = selectedDraggableCell.getAttribute('data-date');

		const placementId = shift.getAttribute('data-placement-id');

		const employeeId = selectedDraggableCell.getAttribute('data-employee-id');

		/* These next 21 lines were commented out due to a removeChild issue after calling handleUpdateShift (removeChild() on node issue). */
		/* Remove the add shift button from selected cell if it exists... */
		/*
		if (selectedDraggableCell.getElementsByClassName('add-shift').length > 0) {
			selectedDraggableCell.getElementsByClassName('add-shift')[0].remove();
		}
		*/

		/* Removes shift button from old cell */
		/* oldDraggableCell.removeChild(shift); */

		/* Moves selected shift button to new selected cell */
		/* selectedDraggableCell.append(shift); */

		/* Add our add shift button to the old cell if the cell has no shifts */
		/*
		if (oldDraggableCell.getElementsByClassName('add-shift').length === 0) {
			// FIXME - adding the add shift button component into the old cell
			oldDraggableCell.append(<DraggableCellAddShiftButton />);
		}
		*/

		const allDraggableCells = document.querySelectorAll('.draggable-cell');

		allDraggableCells.forEach(draggableCell => removeClass(draggableCell, 'cell-highlighted'));

		this.handleUpdateShift(shiftId, placementId, employeeId, date);

		this.shift = null;

		/* this.oldDraggableCell = null; */

		return false;
	};
	/* eslint-enable no-param-reassign */

	handleSwitchFromAssignShiftToCreateShift = () => this.setState({ isShiftModalOpen: true, isAssignShiftModalOpen: false });

	render = () => {
		if (isEmpty(this.props.rota)) {
			return null;
		}

		return (
			<Fragment>
				<Header history={this.props.history} />
				<Toolbar history={this.props.history} />
				{(!isEmpty(this.state.tableData)) ? (
					<Fragment>
						<div className="live__scroll border-0 mt-0 ml-0 mr-0 mb-3 p-0 u-disable-selection">
							<table className="employees p-0 m-0">
								<thead>
									<tr>
										<th className="p-2 text-left column first sortable text-uppercase">
											<div className="d-flex align-items-center p-0 m-0">
												<div className="d-inline-block p-0 mr-auto">Employees ({this.props.employees.length})</div>
												{(this.props.employees.length > 0) ? (
													<Fragment>
														<div className="d-inline-block p-0 mr-2"><button type="button" className="btn btn-dark btn-icon" id="filter" title="Filter by" aria-label="Filter by" onClick={this.handleFilter}><i className="fa fa-fw fa-filter" aria-hidden="true"></i></button></div>
														<div className="d-inline-block p-0 mr-2"><button type="button" className="btn btn-dark btn-icon" id="sortBy" title="Sort by" aria-label="Sort by" onClick={this.handleSortBy}><i className="fa fa-fw fa-sort" aria-hidden="true"></i></button></div>
													</Fragment>
												) : null}
												<div className="d-inline-block p-0 mr-2"><button type="button" className="btn btn-secondary btn-icon" title="Upload Employees" aria-label="Upload Employees" onClick={this.handleUploadEmployees}><i className="fa fa-fw fa-upload" aria-hidden="true"></i></button></div>
												<div className="d-inline-block p-0 m-0"><button type="button" className="btn btn-secondary btn-icon" title="Add New Employee" aria-label="Add New Employee" onClick={this.handleCreateEmployee}><i className="fa fa-fw fa-user-plus" aria-hidden="true"></i></button></div>
											</div>
											<Popover placement="bottom" isOpen={this.state.isFilterPopoverOpen} target="filter" toggle={this.handleFilter}>
												<PopoverBody>
													<ul className="popover-menu">
														<li><label className="pt-2 pb-1 m-0">Filter</label></li>
													</ul>
													<Form className="popover-menu">
														<FormGroup className="pl-1 pr-1 pb-1 mb-0">
															<Input type="text" name="employeeName" id="employeeName" value={this.state.employeeName} onChange={this.handleFilterEmployees} placeholder="By employee name..." autoComplete="off" tabIndex="-1" bsSize="sm" />
														</FormGroup>
													</Form>
												</PopoverBody>
											</Popover>
											<Popover placement="bottom" isOpen={this.state.isSortByPopoverOpen} target="sortBy" toggle={this.handleSortBy}>
												<PopoverBody>
													<ul className="popover-menu">
														<li><label className="pt-2 pb-1 m-0">Sort by</label></li>
														<li><button type="button" title="Sort by First Name" className="btn btn-action btn-nav border-0" onClick={event => this.handleSortEmployees(event, 'firstName')}>First Name</button></li>
														<li><button type="button" title="Sort by Last Name" className="btn btn-action btn-nav border-0" onClick={event => this.handleSortEmployees(event, 'lastName')}>Last Name</button></li>
													</ul>
												</PopoverBody>
											</Popover>
										</th>
										{this.state.tableData.header.columns.map((column, index) => (
											<th key={index} width="195" className={`p-2 m-0 text-center column${((column.draggable) ? ' non-draggable-cell' : '')}${((column.today) ? ' today' : '')}`}>
												<div className="placement-status p-0 m-0">
													<div className={`mr-2 p-0 ml-0 mr-0 mb-0 indicator ${column.placementStatus}`}></div>
													<div className="p-0 m-0 count">{column.count}/{column.total}</div>
												</div>
												<div className="p-0 m-0">{moment(column.weekDate).format('ddd Do')}</div>
											</th>
										))}
										<th className="p-2 m-0 text-center column last">Total</th>
									</tr>
								</thead>
								<tbody id="tableBody">
									{this.state.tableData.body.rows.length > 0 && this.state.tableData.body.rows.map((row, rowIndex) => (
										<tr key={rowIndex} className="draggable-row" data-account-employee-id={row.accountEmployee.accountEmployeeId}>
											<td className="p-2 align-top text-left drag-handler p-0 m-0" onClick={event => this.handleEditEmployee(event, row.accountEmployee.employee.employeeId)}>
												<div className="d-flex align-items-center p-0 m-0">
													<div className="d-inline-block p-0 mt-0 ml-0 mr-2 mb-0">
														<Avatar name={`${row.accountEmployee.employee.firstName} ${row.accountEmployee.employee.lastName}`} round={true} size="51" cache={true} />
													</div>
													<div className="d-inline-block pt-1 pl-0 pr-0 pb-0 m-0">
														<div id="fullname">{row.accountEmployee.employee.firstName} {row.accountEmployee.employee.lastName}</div>
														<div className="align-middle">
															<i className={`align-middle p-0 ml-0 fa fa-fw fa-gbp ${(row.accountEmployee.hourlyRate) || (row.accountEmployee.salary) ? 'complete' : ''}`} aria-hidden="true"></i>
															<i className={`align-middle p-0 ml-1 fa fa-fw fa-envelope ${(row.accountEmployee.employee.email) ? 'complete' : ''}`} aria-hidden="true"></i>
															<i className={`align-middle p-0 ml-1 fa fa-fw fa-phone ${(row.accountEmployee.employee.mobile) ? 'complete' : ''}`} aria-hidden="true"></i>
														</div>
													</div>
												</div>
											</td>
											{row.columns.map((column, columnIndex) => ((column.draggable) ? (
												<td key={columnIndex} className="p-0 align-top non-draggable-cell" data-date={moment(column.weekDate).format('YYYY-MM-DD')} data-employee-id={column.accountEmployee.employee.employeeId}>
													{(column.shiftsPlacements.length > 0) ? column.shiftsPlacements.map((shiftPlacement, shiftPlacementIndex) => (
														<ShiftButton key={shiftPlacementIndex} shiftPlacement={shiftPlacement} id={`shift_${rowIndex}_${columnIndex}_${shiftPlacementIndex}`} />
													)) : null}
												</td>
											) : (
												<td key={columnIndex} className="p-0 align-top draggable-cell" data-date={moment(column.weekDate).format('YYYY-MM-DD')} data-employee-id={column.accountEmployee.employee.employeeId}>
													{(column.shiftsPlacements.length > 0) ? column.shiftsPlacements.map((shiftPlacement, shiftPlacementIndex) => (
														<ShiftButton key={shiftPlacementIndex} shiftPlacement={shiftPlacement} id={`shift_${rowIndex}_${columnIndex}_${shiftPlacementIndex}`} />
													)) : (
														<Fragment>
															{(column.unassignedShifts.length > 0) ? (
																<AssignShiftButton handleAssignShift={event => this.handleAssignShift(event, column.accountEmployee.employee.employeeId, moment(column.weekDate).format('YYYY-MM-DD'))} />
															) : (
																<CreateShiftButton handleCreateShift={event => this.handleCreateShift(event, column.accountEmployee.employee.employeeId, moment(column.weekDate).format('YYYY-MM-DD'))} />
															)}
														</Fragment>
													)}
												</td>
											)))}
											<td className="p-2 align-top text-center">
												<div className="d-flex align-items-center">
													<div className="w-100">
														<div>{row.hours.toFixed(2)} hrs</div>
														<div>(&pound;{row.cost.toFixed(2)})</div>
													</div>
												</div>
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr>
										<th className="text-center">
											<div className="d-flex align-items-center">
												<div className="flex-column">
													<div className="p-2 flex-row">Total Hours</div>
													<div className="p-2 flex-row">Total Shifts</div>
												</div>
												<div className="flex-column">
													<div className="p-2 flex-row text-danger">Total Costs</div>
													<div className="p-2 flex-row">Total Budget</div>
												</div>
											</div>
										</th>
										{this.state.tableData.footer.columns.map((column, columnIndex) => (
											<th key={columnIndex} className="text-center">
												<div className="d-flex align-items-center">
													<div className="flex-column">
														<div className="p-2 flex-row">{column.hours}</div>
														<div className="p-2 flex-row">{column.shifts}</div>
													</div>
													<div className="flex-column">
														<div className="p-2 flex-row text-danger">&pound;{column.cost.toFixed(2)}</div>
														{(column.last) ? (
															<div className="p-2 flex-row">&pound;{this.props.rota.budget.toFixed(2)}</div>
														) : (
															<div className="p-2 flex-row">&nbsp;</div>
														)}
													</div>
												</div>
											</th>
										))}
									</tr>
								</tfoot>
							</table>
						</div>
					</Fragment>
				) : null}
				<Modal title="Create Shift" className="modal-dialog" show={this.state.isShiftModalOpen} onClose={event => this.handleCreateShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))}>
					<ShiftForm editMode={false} employeeId={this.state.employeeId} startDate={moment(this.state.startDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleCreateShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))} />
				</Modal>
				<Modal title="Assign Shift" className="modal-dialog" show={this.state.isAssignShiftModalOpen} onClose={event => this.handleAssignShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))}>
					<AssignShiftForm employeeId={this.state.employeeId} startDate={moment(this.state.startDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleAssignShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))} handleSwitchFromAssignShiftToCreateShift={this.handleSwitchFromAssignShiftToCreateShift} />
				</Modal>
				{(this.state.editMode) ? (
					<Modal title="Edit Employee" className="modal-dialog" show={this.state.isEmployeeModalOpen} onClose={this.handleEditEmployee}>
						<EmployeeForm editMode={true} employeeId={this.state.employeeId} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditEmployee} />
					</Modal>
				) : (
					<Modal title="Create Employee" className="modal-dialog" show={this.state.isEmployeeModalOpen} onClose={this.handleCreateEmployee}>
						<EmployeeForm editMode={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateEmployee} />
					</Modal>
				)}
				<Modal title="Upload Employees" className="modal-dialog" show={this.state.isUploadEmployeesModalOpen} onClose={this.handleUploadEmployees}>
					<UploadEmployeesForm handleInfoNotification={this.handleInfoNotification} handleClose={this.handleUploadEmployees} />
				</Modal>
				{(this.state.error.data) ? (
					<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
						<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
					</Modal>
				) : null}
			</Fragment>
		);
	};
}

Employees.propTypes = propTypes;

Employees.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
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
		getEmployees,
		orderEmployees,
		updatePlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
