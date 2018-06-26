import moment from 'moment';
import Orderable from 'sortablejs';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { concat, isEmpty, includes, debounce } from 'lodash';
import { Form, Label, Input, Popover, FormGroup, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from '../../common/Modal';

import Header from '../../common/Header';

import Toolbar from '../../common/Toolbar';

import ShiftForm from '../../forms/ShiftForm';

import constants from '../../../helpers/constants';

import EmployeeForm from '../../forms/EmployeeForm';

import UploadEmployeesForm from '../../forms/UploadEmployeesForm';

import { updatePlacement } from '../../../actions/placementActions';

import { getShifts, updateShift } from '../../../actions/shiftActions';

import ShiftPlacementDraggable from '../../common/ShiftPlacementDraggable';

import { getEmployees, orderEmployees } from '../../../actions/employeeActions';

import ShiftPlacementNonDraggable from '../../common/ShiftPlacementNonDraggable';

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

		this.handleDrop = this.handleDrop.bind(this);

		this.handleModal = this.handleModal.bind(this);

		this.handleSortBy = this.handleSortBy.bind(this);

		this.handleFilter = this.handleFilter.bind(this);

		this.handleDragEnd = this.handleDragEnd.bind(this);

		this.handleDragOver = this.handleDragOver.bind(this);

		this.handleOrderable = this.handleOrderable.bind(this);

		this.handleDragEnter = this.handleDragEnter.bind(this);

		this.handleDragLeave = this.handleDragLeave.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleUpdateShift = this.handleUpdateShift.bind(this);

		this.handleSortEmployees = this.handleSortEmployees.bind(this);

		this.handleSortDirection = this.handleSortDirection.bind(this);

		this.handleCreateEmployee = this.handleCreateEmployee.bind(this);

		this.handleOrderEmployees = this.handleOrderEmployees.bind(this);

		this.handleUploadEmployees = this.handleUploadEmployees.bind(this);

		this.handleFilterEmployees = this.handleFilterEmployees.bind(this);

		this.handleInfoNotification = this.handleInfoNotification.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleUpdateEmployeeOrder = this.handleUpdateEmployeeOrder.bind(this);
	}

	getInitialState = () => ({
		sort: {
			column: null,
			direction: 'asc',
		},
		error: {},
		tableData: {},
		employeeId: '',
		placementId: '',
		employeeName: '',
		startDate: moment(),
		isErrorModalOpen: false,
		isShiftModalOpen: false,
		isFilterPopoverOpen: false,
		isSortByPopoverOpen: false,
		isCreateEmployeeModalOpen: false,
		isUploadEmployeesModalOpen: false,
	});

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.EMPLOYEES.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);

		/* We debounce this call to wait 300ms (we do not want the leading (or "immediate") flag passed because we want to wait until all the componentDidUpdate calls have finished before loading the table data again */
		this.handleFetchData = debounce(this.handleFetchData.bind(this), 300);

		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait the user has finished ordering all rows before saving the order */
		this.handleUpdateEmployeeOrder = debounce(this.handleUpdateEmployeeOrder.bind(this), 1300);
	};

	componentDidUpdate = (prevProps, prevState) => {
		/* If the current week, current rota, current rota type, employees or shifts had any changes, re/load the table */
		if (prevProps.employees !== this.props.employees || prevProps.week !== this.props.week || prevProps.rota !== this.props.rota || prevProps.rotaType !== this.props.rotaType || prevProps.shifts !== this.props.shifts) {
			this.handleFetchData();
		}
	};

	handleDragOver = (event) => {
		event.preventDefault();

		/* eslint-disable no-param-reassign */
		event.dataTransfer.dropEffect = 'move';
		/* eslint-enable no-param-reassign */

		return false;
	};

	handleDragEnd = (event) => {
		const cells = document.querySelectorAll('.cell-draggable');

		Array.prototype.forEach.call(cells, cell => cell.classList.remove('over'));
	};

	handleDragEnter = (event) => {
		event.target.classList.add('over');
	};

	handleDragLeave = (event) => {
		event.target.classList.remove('over');
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

	handleInfoNotification = message => console.log('handleInfo - show info notification with message:', message);

	handleSuccessNotification = message => console.log('handleSuccess - show success notification with message:', message);

	handleCreateEmployee = () => this.setState({ isCreateEmployeeModalOpen: !this.state.isCreateEmployeeModalOpen });

	handleUploadEmployees = () => this.setState({ isUploadEmployeesModalOpen: !this.state.isUploadEmployeesModalOpen });

	handleCreateShift = (event, employeeId, startDate) => this.setState({ startDate, employeeId, isShiftModalOpen: !this.state.isShiftModalOpen });

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
		employees.forEach((accountEmployee) => {
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

				/* If the current week date value is in the past, e.g. today is Wednesday but the week date is Monday, we dont want users being able to drag shifts in to Monday. */
				const draggable = moment(weekDate).isBefore(moment(), 'day');

				/* This is our column structure so we can drag and drop */
				row.columns.push({
					weekDate,
					draggable,
					accountEmployee,
					shiftsPlacements,
				});
			});

			tableData.body.rows.push(row);
		});

		/* Stick everything into the state */
		this.setState({ tableData });

		/* Order employees */
		this.handleOrderable();
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
		/* Third party Javascript library to allow sorting of data */
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

	handleDrop = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { currentTarget } = event;

		/* eslint-disable no-param-reassign */
		event.target.style.opacity = '1.0';
		/* eslint-enable no-param-reassign */

		/* Get the draggable element */
		const shift = document.getElementById(event.dataTransfer.getData('text'));

		/* Now lets grab the shifts info and the new table cell date and employee id, as we need to update the shift after dropping it */
		const shiftId = shift.getAttribute('data-shift-id');

		/* This is the date of the new table cell */
		const date = event.currentTarget.getAttribute('data-date');

		const placementId = shift.getAttribute('data-placement-id');

		const employeeId = event.currentTarget.getAttribute('data-employee-id');

		/* We wait for a result incase we have to stop the shift move */
		this.handleUpdateShift(shiftId, placementId, employeeId, date);

		return false;
	};

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Toolbar />
			{(!isEmpty(this.state.tableData)) ? (
				<Fragment>
					<div className="live__scroll u-disable-selection">
						<table className="row rota-table p-0 mb-0 bg-light">
							<thead>
								<tr className="">
									<th scope="col" width="336" height="60" className="pt-2 live__scroll--box sortable cell-employee text-uppercase text-left">
										<div className="d-flex align-items-center p-0 m-0">
											<div className="ml-2 mr-auto align-middle">Employees ({this.props.employees.length})</div>
											{(this.props.employees.length > 0) ? (
												<Fragment>
													<div className="mr-2 align-middle"><button type="button" className="btn btn-dark btn-icon" id="filter" title="Filter by" aria-label="Filter by" onClick={this.handleFilter}><i className="fa fa-fw fa-filter" aria-hidden="true"></i></button></div>
													<div className="mr-2 align-middle"><button type="button" className="btn btn-dark btn-icon" id="sortBy" title="Sort by" aria-label="Sort by" onClick={this.handleSortBy}><i className="fa fa-fw fa-sort" aria-hidden="true"></i></button></div>
												</Fragment>
											) : null}
											<div className="mr-2 align-middle"><button type="button" className="btn btn-secondary btn-icon" title="Upload Employees" aria-label="Upload Employees" onClick={this.handleUploadEmployees}><i className="fa fa-fw fa-upload" aria-hidden="true"></i></button></div>
											<div className="mr-2 align-middle"><button type="button" className="btn btn-secondary btn-icon" title="Add New Employee" aria-label="Add New Employee" onClick={this.handleCreateEmployee}><i className="fa fa-fw fa-user-plus" aria-hidden="true"></i></button></div>
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
										</div>
									</th>
									{this.state.tableData.header.columns.map((column, index) => (
										<th key={index} scope="col" width="195" height="60" className="align-middle p-3 live__scroll--box">
											<div className="placement-status d-none">
												<div className={`indicator ${column.placementStatus}`}></div>
												<div className="count">{column.count}/{column.total}</div>
											</div>
											<div>{moment(column.weekDate).format('ddd Do')}</div>
										</th>
									))}
									<th scope="col" width="185" height="60" className="align-middle p-3 live__scroll--box">Total</th>
								</tr>
							</thead>
							<tbody id="tableBody">
								{this.state.tableData.body.rows.length > 0 && this.state.tableData.body.rows.map((row, rowIndex) => (
									<tr key={rowIndex} data-account-employee-id={row.accountEmployee.accountEmployeeId} className="draggable-row">
										<td scope="row" width="336" className="p-0 live__scroll--box drag-handler">
											<div className="d-flex align-items-center p-0 m-0">
												<div className="mr-2 align-middle pt-2 pb-2 pl-2 pr-2">
													<Avatar email={row.accountEmployee.employee.email} round={true} size="50" cache={false} />
												</div>
												<div className="mr-auto align-middle">
													<div id="fullname" className="">{row.accountEmployee.employee.firstName} {row.accountEmployee.employee.lastName}</div>
													<div className="align-middle">
														<i className={`align-middle p-0 ml-0 fa fa-fw fa-gbp ${(row.accountEmployee.hourlyRate) || (row.accountEmployee.salary) ? 'complete' : ''}`} aria-hidden="true"></i>
														<i className={`align-middle p-0 ml-1 fa fa-fw fa-envelope ${(row.accountEmployee.employee.email) ? 'complete' : ''}`} aria-hidden="true"></i>
														<i className={`align-middle p-0 ml-1 fa fa-fw fa-phone ${(row.accountEmployee.employee.mobile) ? 'complete' : ''}`} aria-hidden="true"></i>
													</div>
												</div>
											</div>
										</td>
										{row.columns.map((column, columnIndex) => ((column.draggable) ? (
											<td key={columnIndex} width="195" className="p-0 live__scroll--box cell-non-draggable">
												{(column.shiftsPlacements.length > 0) ? column.shiftsPlacements.map((shiftPlacement, shiftPlacementIndex) => (
													<ShiftPlacementNonDraggable key={shiftPlacementIndex} shiftPlacement={shiftPlacement} />
												)) : null}
											</td>
										) : (
											<td key={columnIndex} width="195" className="p-0 live__scroll--box cell-draggable" data-date={moment(column.weekDate).format('YYYY-MM-DD')} data-employee-id={column.accountEmployee.employee.employeeId} onDrop={event => this.handleDrop(event)} onDragOver={event => this.handleDragOver(event)} onDragLeave={event => this.handleDragLeave(event)} onDragEnd={event => this.handleDragEnd(event)} onDragEnter={event => this.handleDragEnter(event)}>
												{(column.shiftsPlacements.length > 0) ? column.shiftsPlacements.map((shiftPlacement, shiftPlacementIndex) => (
													<ShiftPlacementDraggable key={shiftPlacementIndex} shiftPlacement={shiftPlacement} id={`shift_${columnIndex}_${shiftPlacementIndex}`} />
												)) : (
													<button type="button" className="add-shift-block" onClick={event => this.handleCreateShift(event, column.accountEmployee.employee.employeeId, moment(column.weekDate).format('YYYY-MM-DD'))}><i className="fa fa-fw fa-plus" aria-hidden="true"></i></button>
												)}
											</td>
										)))}
										<td width="185" className="p-0 live__scroll--box text-center">
											<div className="d-flex align-items-center pt-2 pb-2 pl-2 pr-2 text-center">
												<div className="align-middle w-100">
													<div className="">{row.hours.toFixed(2)} hrs</div>
													<div>(&pound;{row.cost.toFixed(2)})</div>
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr>
									<th scope="col" width="336" className="live__scroll--box p-0 rota-table__footer-cell">
										<div className="d-flex align-items-center">
											<div className="flex-column">
												<div className="flex-row">Total Hours</div>
												<div className="flex-row">Total Shifts</div>
											</div>
											<div className="flex-column">
												<div className="flex-row text-danger">Total Costs</div>
												<div className="flex-row">Total Budget</div>
											</div>
										</div>
									</th>
									{this.state.tableData.footer.columns.map((column, columnIndex) => (
										<th key={columnIndex} scope="col" width={(column.last) ? '185' : '195'} className="live__scroll--box p-0 rota-table__footer-cell">
											<div className="d-flex align-items-center">
												<div className="flex-column">
													<div className="flex-row">{column.hours}</div>
													<div className="flex-row">{column.shifts}</div>
												</div>
												<div className="flex-column">
													<div className="flex-row text-danger">&pound;{column.cost.toFixed(2)}</div>
													{(column.last) ? (
														<div className="flex-row">&pound;{this.props.rota.budget.toFixed(2)}</div>
													) : (
														<div className="flex-row">&nbsp;</div>
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
			<Modal title="Shifts" className="modal-dialog" show={this.state.isShiftModalOpen} onClose={event => this.handleCreateShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))}>
				<ShiftForm editMode={false} employeeId={this.state.employeeId} startDate={moment(this.state.startDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleCreateShift(event, this.state.employeeId, moment(this.state.startDate).format('YYYY-MM-DD'))} />
			</Modal>
			<Modal title="Employees" className="modal-dialog" show={this.state.isCreateEmployeeModalOpen} onClose={this.handleCreateEmployee}>
				<EmployeeForm handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateEmployee} />
			</Modal>
			<Modal title="Employees" className="modal-dialog" show={this.state.isUploadEmployeesModalOpen} onClose={this.handleUploadEmployees}>
				<UploadEmployeesForm handleInfoNotification={this.handleInfoNotification} handleClose={this.handleUploadEmployees} />
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
		getEmployees,
		orderEmployees,
		updatePlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
