import 'element-closest';
import Moment from 'moment';
import Avatar from 'react-avatar';
import jwtDecode from 'jwt-decode';
import Orderable from 'sortablejs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import { polyfill } from 'mobile-drag-drop';
import { extendMoment } from 'moment-range';
import React, { Fragment, Component } from 'react';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import { has, omitBy, delay, concat, sortBy, isEmpty, isString, includes, debounce } from 'lodash';
import { Row, Col, Form, Label, Input, Popover, FormGroup, InputGroup, InputGroupAddon, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from '../../common/Modal';

import Header from '../../common/Header';

import Toolbar from '../../common/Toolbar';

import RoleForm from '../../forms/RoleForm';

import ShiftForm from '../../forms/ShiftForm';

import ShiftButton from '../../common/ShiftButton';

import CloseButton from '../../common/CloseButton';

import config from '../../../helpers/config';

import EmployeeForm from '../../forms/EmployeeForm';

import Notification from '../../common/Notification';

import ShiftsOverview from '../../common/ShiftsOverview';

import AssignShiftForm from '../../forms/AssignShiftForm';

import CreateShiftButton from '../../common/CreateShiftButton';

import AssignShiftButton from '../../common/AssignShiftButton';

import { addClass, removeClass } from '../../../helpers/classes';

import UploadEmployeesForm from '../../forms/UploadEmployeesForm';

import { getRotas, switchRota } from '../../../actions/rotaActions';

import { updatePlacement } from '../../../actions/placementActions';

import { getShifts, updateShift } from '../../../actions/shiftActions';

import { getEmployees, orderEmployees } from '../../../actions/employeeActions';

const routes = config.APP.ROUTES;

const moment = extendMoment(Moment);

const notifications = config.APP.NOTIFICATIONS;

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

		this.oldShift = {
			endTime: '',
			roleName: '',
			startTime: '',
			numberOfPositions: 1,
			isClosingShift: false,
		};

		this.state = this.getInitialState();

		this.handleDrop = this.handleDrop.bind(this);

		this.handleModal = this.handleModal.bind(this);

		this.handleSortBy = this.handleSortBy.bind(this);

		this.handleFilter = this.handleFilter.bind(this);

		this.handleDragEnd = this.handleDragEnd.bind(this);

		this.handleGetRotas = this.handleGetRotas.bind(this);

		this.handleDragOver = this.handleDragOver.bind(this);

		this.handleDragStart = this.handleDragStart.bind(this);

		this.handleOrderable = this.handleOrderable.bind(this);

		this.handleDragEnter = this.handleDragEnter.bind(this);

		this.handleDragLeave = this.handleDragLeave.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleCreateRole = this.handleCreateRole.bind(this);

		this.handleDragAndDrop = this.handleDragAndDrop.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleAssignShift = this.handleAssignShift.bind(this);

		this.handleUpdateShift = this.handleUpdateShift.bind(this);

		this.handleEditEmployee = this.handleEditEmployee.bind(this);

		this.handleSetShiftHours = this.handleSetShiftHours.bind(this);

		this.handleSortEmployees = this.handleSortEmployees.bind(this);

		this.handleSortDirection = this.handleSortDirection.bind(this);

		this.handleCreateEmployee = this.handleCreateEmployee.bind(this);

		this.handleOrderEmployees = this.handleOrderEmployees.bind(this);

		this.handleUploadEmployees = this.handleUploadEmployees.bind(this);

		this.handleFilterEmployees = this.handleFilterEmployees.bind(this);

		this.handleInfoNotification = this.handleInfoNotification.bind(this);

		this.handleNoEnterKeySubmit = this.handleNoEnterKeySubmit.bind(this);

		this.handleRemoveCellStyles = this.handleRemoveCellStyles.bind(this);

		this.handleShiftConflictModal = this.handleShiftConflictModal.bind(this);

		this.handleClearSortEmployees = this.handleClearSortEmployees.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleUpdateEmployeeOrder = this.handleUpdateEmployeeOrder.bind(this);

		this.handleRemoveCellHighlight = this.handleRemoveCellHighlight.bind(this);

		this.handleSwitchFromSelectRoleToCreateRole = this.handleSwitchFromSelectRoleToCreateRole.bind(this);

		this.handleSwitchFromAssignShiftToCreateShift = this.handleSwitchFromAssignShiftToCreateShift.bind(this);
	}

	getInitialState = () => ({
		sort: {
			column: null,
			direction: 'asc',
		},
		error: {},
		roleName: '',
		tableData: {},
		employeeId: '',
		placementId: '',
		employeeName: '',
		shiftConflict: {},
		totalEmployees: 0,
		startDate: moment(),
		isErrorModalOpen: false,
		isFilterPopoverOpen: false,
		isSortByPopoverOpen: false,
		isCreateRoleModalOpen: false,
		isAssignShiftModalOpen: false,
		isCreateShiftModalOpen: false,
		isEditEmployeeModalOpen: false,
		isShiftConflictModalOpen: false,
		isCreateEmployeeModalOpen: false,
		isUploadEmployeesModalOpen: false,
	});

	componentDidMount = () => {
		if (isEmpty(this.props.week)) {
			return;
		}

		document.title = `${config.APP.TITLE}: ${routes.DASHBOARD.EMPLOYEES.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.description.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.DESCRIPTION);
			meta.keywords.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.KEYWORDS);
			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
		}

		window.addEventListener('touchmove', () => {}, { passive: false });

		polyfill({
			dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
		});

		/* We debounce this call to wait 100ms (we do not want the leading (or "immediate") flag passed because we want to wait until all the componentDidUpdate calls have finished before loading the table data again */
		this.handleFetchData = debounce(this.handleFetchData.bind(this), 100);

		/* We debounce this call to wait 10ms (we do not want the leading (or "immediate") flag passed because we want to wait the user has finished ordering all rows before saving the order */
		this.handleUpdateEmployeeOrder = debounce(this.handleUpdateEmployeeOrder.bind(this), 10);

		this.setState({ totalEmployees: this.props.employees.length });
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (isEmpty(this.props.week)) {
			return;
		}

		/* If the current week, current rota, current rota type, employees, settings or shifts had any changes, re/load the table */
		if (prevProps.employees !== this.props.employees || prevProps.week !== this.props.week || prevProps.rota !== this.props.rota || prevProps.rotaType !== this.props.rotaType || prevProps.shifts !== this.props.shifts || prevProps.settings !== this.props.settings) {
			this.handleFetchData();
		}

		if (prevState.roleName !== this.state.roleName) {
			const { roleName } = this.state;

			this.setState({ roleName });
		}
	};

	handleClearSortEmployees = () => {
		this.handleOrderable();

		this.setState({
			sort: {
				column: null,
				direction: 'asc',
			},
		});
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

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen }, () => ((!this.state.isErrorModalOpen) ? this.props.history.push(routes.DASHBOARD.HOME.URI) : null));

	handleSortBy = () => this.setState({ isSortByPopoverOpen: !this.state.isSortByPopoverOpen });

	handleFilter = () => this.setState({ isFilterPopoverOpen: !this.state.isFilterPopoverOpen });

	handleShiftConflictModal = () => this.setState({ isShiftConflictModalOpen: !this.state.isShiftConflictModalOpen });

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

	handleSetShiftHours = (shift) => {
		const hours = moment.duration(moment(shift.endTime).diff(moment(shift.startTime))).asHours();

		/* Round the hours so 10.988888 becomes 11 hours, for example */
		shift.hours = (Math.round(hours * 12) / 12);

		return shift;
	};

	handleCreateRole = () => this.setState({ isCreateRoleModalOpen: !this.state.isCreateRoleModalOpen });

	handleCreateEmployee = () => this.setState({ isCreateEmployeeModalOpen: !this.state.isCreateEmployeeModalOpen });

	handleUploadEmployees = () => this.setState({ isUploadEmployeesModalOpen: !this.state.isUploadEmployeesModalOpen });

	handleAssignShift = (event, employeeId, startDate) => this.setState({ startDate, employeeId, isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen }, () => {
		/* If we close the modal, reset the role name state. If the user hasnt saved, but reopens the modal, we want the correct value - not the state value */
		this.setState({ roleName: '' });
	});

	handleCreateShift = (event, employeeId, startDate) => this.setState({ startDate, employeeId, isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen }, () => {
		/* If we close the modal, reset the role name state. If the user hasnt saved, but reopens the modal, we want the correct value - not the state value */
		this.setState({ roleName: '' });
	});

	handleEditEmployee = (event, employeeId) => this.setState({ employeeId, isEditEmployeeModalOpen: !this.state.isEditEmployeeModalOpen });

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

		while (start.isSameOrBefore(endDate)) {
			weekDates.push(start.toDate());

			start.add(1, 'days');
		}

		/* Loop over each day in the week and build our table header and footer data */
		weekDates.forEach((weekDate) => {
			/* Loop over all the shifts and get current date shifts */
			const shifts = this.props.shifts.filter(data => moment(data.startTime).format('YYYY-MM-DD') === moment(weekDate).format('YYYY-MM-DD'));

			/* Loop over all shifts for current date and total up the number of positions available */
			const total = shifts.map(data => data.numberOfPositions).reduce((prev, next) => prev + next, 0);

			const assignedShifts = shifts.filter(data => !(data.placements === null || data.placements.length === 0));

			assignedShifts.map(data => this.handleSetShiftHours(data));

			const unassignedShifts = shifts.filter(data => (data.placements === null || data.placements.length === 0));

			unassignedShifts.map(data => this.handleSetShiftHours(data));

			tableData.header.columns.push({
				total,
				count: 0,
				weekDate,
				assignedShifts,
				unassignedShifts,
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
				const shifts = sortBy(this.props.shifts, 'startTime').filter(data => moment(data.startTime).format('YYYY-MM-DD') === moment(weekDate).format('YYYY-MM-DD'));

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
								shiftId,
								endTime,
								startTime,
								isClosingShift,
								numberOfPositions,
							} = shift;

							const { roleName } = (!isEmpty(shift.role)) ? shift.role : '';

							let hours = moment.duration(moment(endTime).diff(moment(startTime))).asHours();

							/* Round the hours so 10.988888 becomes 11 hours, for example */
							hours = (Math.round(hours * 12) / 12);

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

	handleFilterEmployees = (event, name) => {
		let employeeName = name;

		const target = event.currentTarget;

		if (isEmpty(employeeName)) {
			employeeName = target.value;
		}

		this.setState({ employeeName }, () => {
			if (isEmpty(this.state.employeeName)) {
				document.getElementById('employeeName').value = '';

				this.setState({ totalEmployees: this.props.employees.length });
			}

			const tableBody = document.getElementById('tableBody');

			/* Quick and easy - loop over each table body row and hide / show rows based on employee full name values */
			let totalEmployees = 0;

			Array.prototype.forEach.call(tableBody.rows, (row) => {
				if (row.classList.contains('draggable-row')) {
					const employeeFullName = row.querySelector('#fullname').textContent.toLowerCase();

					const employeeSearchName = employeeName.toLowerCase();

					const display = includes(employeeFullName, employeeSearchName) ? 'display:table-row' : 'display:none';

					if (display === 'display:table-row') {
						totalEmployees += 1;
					}

					row.setAttribute('style', display);
				}
			});

			this.setState({ totalEmployees });
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
		if (document.getElementById('tableBody')) {
			Orderable.create(document.getElementById('tableBody'), {
				scroll: true,
				animation: 150,
				group: 'employees',
				dataIdAttr: 'data-account-employee-id',
				handle: '.drag-handler',
				draggable: '.draggable-row',
				dragClass: 'draggable-row-drag',
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
		}
	};

	handleGetEmployees = () => {
		console.log('Called Employee handleGetEmployees getEmployees');
		return this.props.actions.getEmployees().catch(error => Promise.reject(error));
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
			.then(() => this.handleGetEmployees())
			.catch((error) => {
				error.data.title = 'Order Employees';

				this.setState({ error });

				this.handleModal();
			});
	};

	handleUpdateShift = (shiftId, placementId, employeeId, date) => {
		this.setState({ shiftConflict: {} });

		const {
			shifts,
			actions,
			rota: {
				rotaId,
			},
			rotaType: {
				rotaTypeId,
			},
		} = this.props;

		/* Get the shift based on shift id */
		const shift = shifts.filter(data => data.shiftId === shiftId).shift();

		/* The shift start and end times dont change so we can grab these to create the new start and end time values that will be based off the new date */
		let { endTime, startTime } = shift;

		/* Deconstructing all the values we need to create our new payload that updates the shift and placement */
		const { roleName } = (!isEmpty(shift.role)) ? shift.role : '';

		const {
			isClosingShift,
			numberOfPositions,
		} = shift;

		const shiftPlacement = shift.placements.filter(data => data.placementId === placementId).shift();

		/* Lets create our old shift object so we can compare changes */
		this.oldShift = {
			roleName,
			endTime,
			startTime,
			isClosingShift,
			numberOfPositions,
			employeeId: shiftPlacement.employee.employeeId,
		};

		/**
		 * Get date only part from both start and end times.
		 * Shifts can be dragged back, forward, up and down. The latter two actions is moving a shift between employees within the same day.
		 * Shifts can also flow over to the following day (E.g start at 6pm Tuesday and finish 2am Wednesday).
		 * If the date parts are the same, this means the shift starts and ends on the same day and was dragged up or down.
		 * If the date parts are different, means the shift finishes on the following day and if dragged forward increase the end time date by 1 day and if dragged back, decrease the end time date by 1 day.
		 */
		const endTimeDateOnly = moment(endTime).format('YYYY-MM-DD');

		const startTimeDateOnly = moment(startTime).format('YYYY-MM-DD');

		/* Append new cells date to the times */
		endTime = `${date} ${moment(endTime).format('HH:mm:ss')}`;

		startTime = `${date} ${moment(startTime).format('HH:mm:ss')}`;

		if (moment(startTimeDateOnly).isSame(date)) {
			if (startTimeDateOnly !== endTimeDateOnly) {
				/* Shift was dragged up or down within same column and ends the following day - adding 1 day to the end time in order to keep the end time in the following day */
				endTime = moment(endTime).add(1, 'day');
			}
			/* else.... Shift was dragged up or down within same column and starts and ends in the same day */
		}

		if (moment(startTimeDateOnly).isBefore(date)) {
			if (startTimeDateOnly !== endTimeDateOnly) {
				/* Shift was dragged forward and ends the following day - adding 1 day to the end time in order to keep the end time in the following day */
				endTime = moment(endTime).add(1, 'day');
			}
			/* else.... Shift was dragged forward and starts and ends in the same day */
		}

		if (moment(startTimeDateOnly).isAfter(date)) {
			if (startTimeDateOnly !== endTimeDateOnly) {
				/* Shift was dragged backwards and ends the following day - adding 1 day to the end time in order to keep the end time in the following day */
				endTime = moment(endTime).add(1, 'day');
			}
			/* else.... Shift was dragged backwards and starts and ends in the same day */
		}

		endTime = moment(endTime).seconds(0).format('YYYY-MM-DD HH:mm:ss');

		startTime = moment(startTime).seconds(0).format('YYYY-MM-DD HH:mm:ss');

		/* Check for conflicts - We need to grab all shifts for selected date and check that they dont overlap */
		let totalConflicts = 0;

		/* This gets all shifts for selected date */
		let currentDateShifts = shifts.filter(data => (moment(data.startTime).format('YYYY-MM-DD') === date));

		if (currentDateShifts.length > 0) {
			/* For each shift found for the current date, check its employee id against the cells employee id */
			currentDateShifts = currentDateShifts.filter(currentDateShiftData => (currentDateShiftData.placements && currentDateShiftData.placements.filter(placementData => placementData.employee.employeeId === employeeId).length));

			/* For the remaining shifts in the current date, loop over and check start / end time ranges */
			currentDateShifts.forEach((currentDateShift, currentDateShiftIndex) => {
				/* The startTime and endTime are belong to the shift we are dragging! */
				if (moment.range(startTime, endTime).overlaps(moment.range(currentDateShift.startTime, currentDateShift.endTime), { adjacent: false })) {
					totalConflicts += 1;
				}
			});
		}

		if (totalConflicts === 0) {
			/* Put together our payload */
			let payload = {
				rotaId,
				shiftId,
				endTime,
				startTime,
				isClosingShift,
				numberOfPositions,
				roleName: ((!isEmpty(roleName)) ? roleName : ''),
			};

			/* This logic is used to decide which API calls we need to make since there were changes found */
			const tempPayload = {
				endTime,
				startTime,
				employeeId,
				isClosingShift,
				numberOfPositions,
				roleName: ((!isEmpty(roleName)) ? roleName : ''),
			};

			const payloadDifferences = omitBy(tempPayload, (value, key) => this.oldShift[key] === value);

			let updateBoth = false;

			let updateShiftOnly = false;

			let updatePlacementOnly = false;

			/* If the total differences is only 1 */
			if (Object.keys(payloadDifferences).length === 1) {
				/* and if the only different is the employee then we only need to update the placement */
				if (has(payloadDifferences, 'employeeId')) {
					updateBoth = false;

					updateShiftOnly = false;

					updatePlacementOnly = true;
				/* and if the only different but its not the employee then we only need to update the shift */
				} else {
					updateBoth = false;

					updateShiftOnly = true;

					updatePlacementOnly = false;
				}
			/* else if the total differences are more than 1 and includes the employee then we need to update both */
			} else if (Object.keys(payloadDifferences).length > 1) {
				if (has(payloadDifferences, 'employeeId')) {
					updateBoth = true;

					updateShiftOnly = false;

					updatePlacementOnly = false;
				/* and does not include the employee, then we only need to update shift */
				} else {
					updateBoth = false;

					updateShiftOnly = true;

					updatePlacementOnly = false;
				}
			}

			if (updateBoth) {
				console.log('Called Employees handleUpdateShift updateBoth');
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
								placementId,
								employeeId,
							};

							/**
							 * If the employee id is the same as the shifts employee id, we can assume the user has just dragged the shift into a different day in the same employees row
							 * If the employee id is different, then we can assume the user has dragged and shift into a different employees row
							 */
							console.log('Called Employees handleUpdateShift updatePlacement');
							return actions.updatePlacement(payload).catch(error => Promise.reject(error));
						}

						return true;
					})
					/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
					.then(() => this.handleGetShifts(rotaId))
					.then(() => this.handleGetRotas(rotaTypeId))
					.catch((error) => {
						error.data.title = 'Edit Shift';

						this.setState({ error });

						this.handleModal();
					});
			} else if (updateShiftOnly) {
				console.log('Called Employees handleUpdateShift updateShiftOnly');
				console.log('Called Employees handleUpdateShift updateShift');
				actions.updateShift(payload)
					/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
					.then(() => this.handleGetShifts(rotaId))
					.then(() => this.handleGetRotas(rotaTypeId))
					.catch((error) => {
						error.data.title = 'Edit Shift';

						this.setState({ error });

						this.handleModal();
					});
			} else if (updatePlacementOnly) {
				console.log('Called Employees handleUpdateShift updatePlacementOnly');
				/* Get the matching placement (based on the employee id) */
				const placement = shift.placements.filter(data => data.employee.employeeId === employeeId).shift();

				/**
				 * If the placement is empty, this means that no matching placement was found for the employee id for the dropped cell, so we need to update the placement.
				 * If there was a match, the shift belongs to same employee id of the dropped cell.
				 */
				if (isEmpty(placement)) {
					payload = {
						shiftId,
						placementId,
						employeeId,
					};

					/**
					 * If the employee id is the same as the shifts employee id, we can assume the user has just dragged the shift into a different day in the same employees row
					 * If the employee id is different, then we can assume the user has dragged and shift into a different employees row
					 */
					console.log('Called Employees handleUpdateShift updatePlacement');
					actions.updatePlacement(payload)
						/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
						.then(() => this.handleGetShifts(rotaId))
						.then(() => this.handleGetRotas(rotaTypeId))
						.catch((error) => {
							error.data.title = 'Edit Shift';

							this.setState({ error });

							this.handleModal();
						});
				}
			}
		} else {
			/* Show conflict error */
			const shiftConflict = {
				data: {
					title: 'Edit Shift',
					/* FIXME - Make messages constants in config */
					message: '<p><strong>The following error occurred:</strong></p><ul><li>The employee is already placed in another shift at this time.</li></ul>',
				},
			};

			this.setState({ shiftConflict });

			this.handleShiftConflictModal();
		}
	};

	handleGetShifts = (rotaId) => {
		const { actions } = this.props;

		const payload = {
			rotaId,
		};

		console.log('Called Employees handleGetShifts getShifts');
		return actions.getShifts(payload).catch(error => Promise.reject(error));
	};

	handleGetRotas = (rotaTypeId) => {
		const { rota, actions } = this.props;

		const payload = {
			rotaTypeId,
		};

		console.log('Called Employees handleGetRotas getRotas');
		return actions.getRotas(payload)
			.then((allRotas) => {
				/* After we get all rotas, we need to find our current rota again and switch it so its details are also updated */
				const currentRota = allRotas.filter(data => data.rotaId === rota.rotaId).shift();

				console.log('Called Employees handleGetRotas switchRota');
				return actions.switchRota(currentRota);
			})
			.catch(error => Promise.reject(error));
	};

	handleAddCellHighlight = (element) => {
		const targetElement = (!element.tagName) ? element.parentElement : element;

		const draggableCell = targetElement.closest('.draggable-cell');

		addClass(draggableCell, 'cell-highlighted');
	};

	handleRemoveCellHighlight = () => {
		const allDraggableCells = document.querySelectorAll('.draggable-cell');

		[...allDraggableCells].forEach(draggableCell => removeClass(draggableCell, 'cell-highlighted'));
	};

	handleRemoveCellStyles = () => {
		const allDraggableCells = document.querySelectorAll('.draggable-cell');

		[...allDraggableCells].forEach(draggableCell => draggableCell.setAttribute('style', ''));
	};

	handleDragAndDrop = () => {
		const shifts = document.querySelectorAll('.shift');

		if (shifts.length > 0) {
			[...shifts].forEach((shift) => {
				shift.addEventListener('dragend', this.handleDragEnd);
				shift.addEventListener('dragstart', this.handleDragStart);
			});

			const draggableCells = document.querySelectorAll('.draggable-cell');

			[...draggableCells].forEach((draggableCell) => {
				draggableCell.addEventListener('drop', this.handleDrop);
				draggableCell.addEventListener('dragover', this.handleDragOver);
				draggableCell.addEventListener('dragenter', this.handleDragEnter);
				draggableCell.addEventListener('dragleave', this.handleDragLeave);
			});

			console.log('Called Employees handleDragAndDrop - drag and drop listeners ready');
		}
	};

	handleDragStart = (event) => {
		this.shift = event.target || event.srcElement;

		this.shift.setAttribute('style', 'cursor: move; cursor: grab; cursor:-moz-grab; cursor:-webkit-grab;');

		event.dataTransfer.dropEffect = 'move';

		event.dataTransfer.effectAllowed = 'move';

		event.dataTransfer.setData('text', this.shift.id);

		/* this.oldDraggableCell = target.closest('.draggable-cell'); */

		addClass(this.shift, 'shift-selected');

		/* Commented out due to non native drag and drop remove/append functionality below. See comments. */
		/* Hide the shift in the current cell when the user has selected it and dragging... */
		setTimeout(() => addClass(this.shift, 'shift-invisible'), 0);
	};

	handleDragEnd = (event) => {
		const element = event.target || event.srcElement;

		removeClass(element, 'shift-selected');

		removeClass(element, 'shift-invisible');

		element.setAttribute('style', 'cursor: move; cursor: grab; cursor:-moz-grab; cursor:-webkit-grab;');
	};

	handleDragOver = (event) => {
		/* Necessary. Allows us to drop */
		if (event.preventDefault) {
			event.preventDefault();
		}

		this.shift.setAttribute('style', 'cursor: move; cursor: -webkit-grabbing; cursor: -moz-grabbing; cursor: -o-grabbing; cursor: -ms-grabbing; cursor: grabbing;');

		event.dataTransfer.dropEffect = 'move';

		return false;
	};

	handleDragEnter = (event) => {
		/* Necessary. Allows us to drop */
		if (event.preventDefault) {
			event.preventDefault();
		}

		event.dataTransfer.dropEffect = 'move';

		const element = event.target || event.srcElement;

		element.setAttribute('style', 'cursor: move; cursor: -webkit-grabbing; cursor: -moz-grabbing; cursor: -o-grabbing; cursor: -ms-grabbing; cursor: grabbing;');

		this.handleRemoveCellHighlight();

		/* We wait so DOM can update before we start adding cell highlight class as otherwise it will be cleared before UI is refreshed */
		setTimeout(() => this.handleAddCellHighlight(element), 0);

		return false;
	};

	handleDragLeave = (event) => {
		const element = event.target || event.srcElement;

		element.setAttribute('style', 'cursor: move; cursor: -webkit-grabbing; cursor: -moz-grabbing; cursor: -o-grabbing; cursor: -ms-grabbing; cursor: grabbing;');

		const targetElement = (!element.tagName) ? element.parentElement : element;

		const draggableCell = targetElement.closest('.draggable-cell');

		removeClass(draggableCell, 'cell-highlighted');
	};

	handleDrop = (event) => {
		if (event.preventDefault) {
			event.preventDefault();
		}

		/* Stops some browsers from redirecting */
		if (event.stopPropagation) {
			event.stopPropagation();
		}

		const element = event.target || event.srcElement;

		let { shift } = this;

		/* Set the source cell HTML to the HTML of the cell we dropped on */
		shift = document.getElementById(event.dataTransfer.getData('text'));

		/* const { oldDraggableCell } = this; */

		const shiftId = shift.getAttribute('data-shift-id');

		const placementId = shift.getAttribute('data-placement-id');

		const selectedDraggableCell = element.closest('.draggable-cell');

		const date = selectedDraggableCell.getAttribute('data-date');

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

		this.handleRemoveCellHighlight();

		this.handleRemoveCellStyles();

		this.handleUpdateShift(shiftId, placementId, employeeId, date);

		this.shift = null;

		/* this.oldDraggableCell = null; */

		return false;
	};

	handleSwitchFromSelectRoleToCreateRole = (roleName) => {
		if (isString(roleName)) {
			this.setState({ roleName });
		}

		this.setState({ isCreateRoleModalOpen: !this.state.isCreateRoleModalOpen, isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen }, () => {
			/* If we close the modal, reset the role name state. If the user hasnt saved, but reopens the modal, we want the correct value - not the state value */
			if (!this.state.isCreateShiftModalOpen) {
				this.setState({ roleName: '' });
			}
		});
	};

	handleSwitchFromAssignShiftToCreateShift = () => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen, isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

	handleNoEnterKeySubmit = (event) => {
		const key = event.charCode || event.keyCode || 0;

		if (key === 13) {
			event.preventDefault();
		}
	};

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
						<div className="table-wrapper">
							<div className="table-scroller border-0 mt-0 mr-0 mb-3 p-0 u-disable-selection">
								<table className="employees p-0 m-0">
									<thead>
										<tr>
											<th className="p-2 text-left column first sortable text-uppercase">
												<div className="d-flex align-items-center p-0 m-0">
													<div className="d-inline-block p-0 mr-auto">Employees ({this.state.totalEmployees})</div>
													{(this.props.employees.length > 0) ? (
														<Fragment>
															<div className="d-inline-block p-0 mr-1 mr-xl-2"><button type="button" className={`btn btn-dark btn-icon${!isEmpty(this.state.employeeName) ? ' btn-filter-active' : ''}`} id="filter" title="Filter by" aria-label="Filter by" onClick={this.handleFilter}><i className="fa fa-fw fa-filter" aria-hidden="true"></i></button></div>
															<div className="d-inline-block p-0 mr-1 mr-xl-2"><button type="button" className={`btn btn-dark btn-icon${!isEmpty(this.state.sort.column) ? ' btn-filter-active' : ''}`} id="sortBy" title="Sort by" aria-label="Sort by" onClick={this.handleSortBy}><i className="fa fa-fw fa-sort" aria-hidden="true"></i></button></div>
														</Fragment>
													) : null}
													<div className="d-none d-md-inline-block p-0 mr-1 mr-xl-2"><button type="button" className="btn btn-secondary btn-icon" title="Upload Employees" aria-label="Upload Employees" onClick={this.handleUploadEmployees}><i className="fa fa-fw fa-upload" aria-hidden="true"></i></button></div>
													<div className="d-inline-block p-0 m-0"><button type="button" className="btn btn-secondary btn-icon" title="Add New Employee" aria-label="Add New Employee" onClick={this.handleCreateEmployee}><i className="fa fa-fw fa-user-plus" aria-hidden="true"></i></button></div>
												</div>
												<Popover placement="bottom" isOpen={this.state.isFilterPopoverOpen} target="filter" toggle={this.handleFilter}>
													<PopoverBody>
														<ul className="popover-menu">
															<li><label className="pt-2 pb-1 m-0">Filter</label></li>
														</ul>
														<Form className="popover-menu">
															<FormGroup className="pl-1 pr-1 pb-1 mb-1">
																<Input type="text" name="employeeName" id="employeeName" className="border-0" value={this.state.employeeName} onChange={event => this.handleFilterEmployees(event)} onKeyPress={event => this.handleNoEnterKeySubmit(event)} placeholder="By employee name..." autoComplete="off" tabIndex="-1" bsSize="sm" />
															</FormGroup>
															<div className="filter-buttons">
																<button type="button" className="btn btn-action m-0 border-0" onClick={event => this.handleFilterEmployees(event, '')}>Clear</button>
																<button type="button" className="btn btn-action m-0 border-0" onClick={this.handleFilter}>Close</button>
															</div>
														</Form>
													</PopoverBody>
												</Popover>
												<Popover placement="bottom" isOpen={this.state.isSortByPopoverOpen} target="sortBy" toggle={this.handleSortBy}>
													<PopoverBody>
														<ul className="popover-menu">
															<li><label className="pt-2 pb-1 m-0">Sort by</label></li>
															<li><button type="button" title="Sort by First Name" className={`btn btn-action btn-nav border-0${(this.state.sort.column === 'firstName') ? ' text-warning' : ''}`} onClick={event => this.handleSortEmployees(event, 'firstName')}>First Name</button></li>
															<li><button type="button" title="Sort by Last Name" className={`btn btn-action btn-nav border-0${(this.state.sort.column === 'lastName') ? ' text-warning' : ''}`} onClick={event => this.handleSortEmployees(event, 'lastName')}>Last Name</button></li>
															{(!isEmpty(this.state.sort.column)) ? (
																<li className="filter-buttons"><button type="button" title="Clear Sort by" className="btn btn-action m-0 border-0" style={{ borderRadius: '4px' }} onClick={this.handleClearSortEmployees}>Reset</button></li>
															) : null}
														</ul>
													</PopoverBody>
												</Popover>
											</th>
											{this.state.tableData.header.columns.map((column, index) => (
												<th key={index} width="195" className={`p-2 m-0 text-center column${((column.draggable) ? ' non-draggable-cell' : '')}${((column.today) ? ' today' : '')}`}>
													<ShiftsOverview past={column.draggable} weekDate={column.weekDate} count={column.count} total={column.total} placementStatus={column.placementStatus} assignedShifts={column.assignedShifts} unassignedShifts={column.unassignedShifts} />
													<div className="p-0 m-0">{moment(column.weekDate).format('ddd Do')}</div>
												</th>
											))}
											<th className="p-2 m-0 text-center column last">Total</th>
										</tr>
									</thead>
									<tbody id="tableBody">
										{this.state.tableData.body.rows.length > 0 && this.state.tableData.body.rows.map((row, rowIndex) => (
											<tr key={rowIndex} className="draggable-row" data-account-employee-id={row.accountEmployee.accountEmployeeId}>
												<td className="p-2 align-top text-left p-0 m-0 edit-employee" onClick={event => this.handleEditEmployee(event, row.accountEmployee.employee.employeeId)}>
													<div className="d-flex align-items-start p-0 m-0 wrap-words">
														<div className="d-inline-block p-0 mt-0 ml-0 mr-2 mb-0 drag-handler">
															<Avatar name={`${row.accountEmployee.employee.firstName} ${row.accountEmployee.employee.lastName}`} round={true} size="39" />
														</div>
														<div className="d-inline-block pt-0 pl-0 pr-0 pb-0 m-0">
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
															<ShiftButton key={shiftPlacementIndex} past={true} shiftPlacement={shiftPlacement} id={`shift_${rowIndex}_${columnIndex}_${shiftPlacementIndex}`} roleName={this.state.roleName} handleSwitchFromSelectRoleToCreateRole={this.handleSwitchFromSelectRoleToCreateRole} />
														)) : null}
													</td>
												) : (
													<td key={columnIndex} className="p-0 align-top draggable-cell" data-date={moment(column.weekDate).format('YYYY-MM-DD')} data-employee-id={column.accountEmployee.employee.employeeId}>
														{(column.shiftsPlacements.length > 0) ? column.shiftsPlacements.map((shiftPlacement, shiftPlacementIndex) => (
															<ShiftButton key={shiftPlacementIndex} past={false} shiftPlacement={shiftPlacement} id={`shift_${rowIndex}_${columnIndex}_${shiftPlacementIndex}`} roleName={this.state.roleName} handleSwitchFromSelectRoleToCreateRole={this.handleSwitchFromSelectRoleToCreateRole} />
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
											<th className="text-center column first">
												<div className="d-flex align-items-center">
													<div className="flex-column">
														<div className="p-2 flex-row">Total Hours</div>
														<div className="p-2 flex-row">Total Shifts</div>
													</div>
													<div className="flex-column text-danger">Total Costs</div>
												</div>
											</th>
											{this.state.tableData.footer.columns.map((column, columnIndex) => (
												<th key={columnIndex} className="text-center">
													<div className="d-flex align-items-center">
														<div className="flex-column">
															<div className="p-2 flex-row">{column.hours}</div>
															<div className="p-2 flex-row">{column.shifts}</div>
														</div>
														<div className="flex-column text-danger">&pound;{column.cost.toFixed(2)}</div>
													</div>
												</th>
											))}
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</Fragment>
				) : null}
				<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={event => this.handleCreateShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))}>
					<ShiftForm overview={false} editMode={false} roleName={this.state.roleName} employeeId={this.state.employeeId} startDate={moment(this.state.startDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleCreateShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))} handleSwitchFromSelectRoleToCreateRole={this.handleSwitchFromSelectRoleToCreateRole} />
				</Modal>
				<Modal title="Assign Shift" className="modal-dialog" show={this.state.isAssignShiftModalOpen} onClose={event => this.handleAssignShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))}>
					<AssignShiftForm employeeId={this.state.employeeId} startDate={moment(this.state.startDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleAssignShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))} handleSwitchFromAssignShiftToCreateShift={this.handleSwitchFromAssignShiftToCreateShift} />
				</Modal>
				<Modal title="Create Role" className="modal-dialog" show={this.state.isCreateRoleModalOpen} onClose={this.handleSwitchFromSelectRoleToCreateRole}>
					<RoleForm handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleSwitchFromSelectRoleToCreateRole} />
				</Modal>
				<Modal title="Edit Employee" className="modal-dialog" show={this.state.isEditEmployeeModalOpen} onClose={this.handleEditEmployee}>
					<EmployeeForm editMode={true} employeeId={this.state.employeeId} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditEmployee} />
				</Modal>
				<Modal title="Create Employee" className="modal-dialog" show={this.state.isCreateEmployeeModalOpen} onClose={this.handleCreateEmployee}>
					<EmployeeForm editMode={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateEmployee} />
				</Modal>
				<Modal title="Upload Employees" className="modal-dialog" show={this.state.isUploadEmployeesModalOpen} onClose={this.handleUploadEmployees}>
					<UploadEmployeesForm handleInfoNotification={this.handleInfoNotification} handleClose={this.handleUploadEmployees} />
				</Modal>
				{(this.state.error.data) ? (
					<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
						<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
					</Modal>
				) : null}
				{(this.state.shiftConflict.data) ? (
					<Modal title={this.state.shiftConflict.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isShiftConflictModalOpen} onClose={this.handleShiftConflictModal}>
						<div dangerouslySetInnerHTML={{ __html: this.state.shiftConflict.data.message }} />
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
		getRotas,
		getShifts,
		switchRota,
		updateShift,
		getEmployees,
		orderEmployees,
		updatePlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
