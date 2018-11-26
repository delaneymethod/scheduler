import moment from 'moment';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import concat from 'lodash/concat';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Form, Input, Popover, FormGroup, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from '../../common/Modal';

import Header from '../../common/Header';

import Footer from '../../common/Footer';

import Toolbar from '../../common/Toolbar';

import config from '../../../helpers/config';

import logMessage from '../../../helpers/logging';

import { confirm } from '../../../helpers/confirm';

import EmployeeForm from '../../forms/EmployeeForm';

import Notification from '../../common/Notification';

import { getShifts } from '../../../actions/shiftActions';

import UnavailabilityForm from '../../forms/UnavailabilityForm';

import ManageAccountAccessButton from '../../common/ManageAccountAccessButton';

import { getRotaEmployees } from '../../../actions/rotaEmployeeActions';

import { getApplicationUserRoles } from '../../../actions/applicationUserRolesActions';

import { getEmployees, updateEmployee, deleteEmployee } from '../../../actions/employeeActions';

const routes = config.APP.ROUTES;

const notifications = config.APP.NOTIFICATIONS;

const propTypes = {
	week: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	settings: PropTypes.object.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	user: {},
	week: {},
	rota: {},
	rotas: [],
	rotaType: {},
	settings: {},
	employees: [],
	authenticated: false,
};

/**
 * This sorts strings taking into consideration numbers in strings.
 * e.g., Account 1, Account 2, Account 10. Normal sorting would sort it Account 1, Account 10, Account 2.
 */
const collator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: 'base',
});

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

		this.toastId = null;

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleSortBy = this.handleSortBy.bind(this);

		this.handleFilter = this.handleFilter.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleEditEmployee = this.handleEditEmployee.bind(this);

		this.handleSortDirection = this.handleSortDirection.bind(this);

		this.handleDeleteEmployee = this.handleDeleteEmployee.bind(this);

		this.handleFilterEmployees = this.handleFilterEmployees.bind(this);

		this.handleNoEnterKeySubmit = this.handleNoEnterKeySubmit.bind(this);

		this.handleInfoNotification = this.handleInfoNotification.bind(this);

		this.handleGetRotaEmployees = this.handleGetRotaEmployees.bind(this);

		this.handleClearSortEmployees = this.handleClearSortEmployees.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleCreateUnavailability = this.handleCreateUnavailability.bind(this);
	}

	getInitialState = () => ({
		sort: {
			column: null,
			direction: 'asc',
		},
		error: {},
		employees: [],
		employeeId: '',
		employeeName: '',
		totalEmployees: 0,
		isErrorModalOpen: false,
		isFilterPopoverOpen: false,
		isSortByPopoverOpen: false,
		isEditEmployeeModalOpen: false,
		isCreateUnavailabilityModalOpen: false,
	});

	componentDidMount = () => {
		if (isEmpty(this.props.week)) {
			return;
		}

		document.title = `${config.APP.TITLE}: ${routes.DASHBOARD.EMPLOYEES.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.KEYWORDS);
			meta.description.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.DESCRIPTION);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}

		/* We debounce this call to wait 500ms (we do not want the leading (or "immediate") flag passed because we want to wait until all the componentDidUpdate calls have finished before loading the table data again */
		this.handleFetchData = debounce(this.handleFetchData.bind(this), 500);
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (isEmpty(this.props.week)) {
			return;
		}

		/* If the employees had any changes, re/load the table */
		if (prevProps.employees !== this.props.employees || prevProps.week !== this.props.week || prevProps.rota !== this.props.rota || prevProps.rotaType !== this.props.rotaType || prevProps.settings !== this.props.settings) {
			this.setState({ totalEmployees: this.props.employees.length }, () => this.handleFetchData());
		}
	};

	handleFetchData = () => {
		logMessage('info', 'Called Employees handleFetchData');

		let { employees } = this.props;

		this.props.actions.getApplicationUserRoles().catch((error) => {
			this.handleErrorNotification('Unable to load Application User Roles');
		});

		employees = sortBy(employees, ['employee.firstName', 'employee.lastName', 'employee.email']);

		/* Stick everything into the state */
		this.setState({ employees });
	};

	handleEditEmployee = (event, employeeId) => this.setState({ employeeId, isEditEmployeeModalOpen: !this.state.isEditEmployeeModalOpen });

	handleCreateUnavailability = (event, employeeId) => this.setState({ employeeId, isCreateUnavailabilityModalOpen: !this.state.isCreateUnavailabilityModalOpen });

	handleNoEnterKeySubmit = (event) => {
		const key = event.charCode || event.keyCode || 0;

		if (key === 13) {
			event.preventDefault();
		}
	};

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		logMessage('info', 'Called Employees handleGetShifts getShifts');

		return actions.getShifts(payload).catch(error => Promise.reject(error));
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen }, () => ((!this.state.isErrorModalOpen) ? this.props.history.push(routes.DASHBOARD.HOME.URI) : null));

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

	handleErrorNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.error(<Notification icon="fa-info-circle" title="Error" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
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


	handleDeleteEmployee = (event, employeeId) => {
		const { actions, employees } = this.props;

		const accountEmployee = employees.filter(data => data.employee.employeeId === employeeId).shift();

		/* Check if the user wants to delete the employee */
		let message = `<div class="text-center"><ul class="list-unstyled font-weight-bold text-uppercase"><li>Employee: ${accountEmployee.employee.firstName} ${accountEmployee.employee.lastName}</li></ul><p>Please confirm that you wish to delete this employee?</p><p class="text-uppercase"><i class="pr-3 fa fa-fw fa-exclamation-triangle text-warning" aria-hidden="true"></i>Caution: This action cannot be undone.</p></div>`;

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
			className: 'modal-dialog-danger',
		};

		/* If the user has clicked the proceed button, we delete the employee */
		/* If the user has clicked the cancel button, we do nothing */
		confirm(options)
			.then((result) => {
				const payload = {
					employeeId,
				};

				logMessage('info', 'Called Employees handleDeleteEmployee deleteEmployee');

				actions.deleteEmployee(payload)
					/* Updating the employee will update the store with only the updated employee (as thats what the reducer passes back) so we need to do another call to get all the employees back into the store again */
					.then(() => this.handleGetEmployees())
					.then(() => this.handleGetRotaEmployees())
					/* Updating a shift or placement will update the store with only the shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
					.then(() => this.handleGetShifts())
					.then(() => {
						/* FIXME - Make messages constants in config */
						message = '<p>Employee was deleted!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.handleSuccessNotification(message);
					})
					.catch((error) => {
						error.data.title = 'Delete Employee';

						this.setState({ error });

						this.handleModal();
					});
			}, (result) => {
				/* We do nothing */
			});
	};

	handleSortEmployees = (event, column) => {
		event.preventDefault();

		const { sort } = this.state;

		let { direction } = sort;

		/* Change the sort direction if the same column is sorted. */
		if (sort.column === column) {
			direction = (direction === 'asc') ? 'desc' : 'asc';
		}

		/* Grab all draggable rows */
		let draggableRows = document.querySelectorAll('.draggable-row');

		if ([...draggableRows].length > 0) {
			/* We only want to use the visible rows as the user could have filtered */
			draggableRows = [...draggableRows].filter(draggableRow => draggableRow.style.display !== 'none');

			/* Now do our sorting */
			draggableRows = draggableRows.sort((a, b) => {
				if (column === 'firstName') {
					return collator.compare(a.dataset.firstName, b.dataset.firstName);
				} else if (column === 'lastName') {
					return collator.compare(a.dataset.lastName, b.dataset.lastName);
				}

				return collator.compare(a.dataset.accountEmployeeId, b.dataset.accountEmployeeId);
			});

			/* Reverse the order if direction is descending */
			if (direction === 'desc') {
				draggableRows.reverse();
			}
		}

		/* Update our table */
		[...draggableRows].forEach(draggableRow => document.getElementById('tableBody').appendChild(draggableRow));

		this.setState({
			sort: {
				column,
				direction,
			},
		});
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
			}

			/* Quick and easy - loop over each table body row and hide / show rows based on employee full name values */
			let totalEmployees = 0;

			const draggableRows = document.querySelectorAll('.draggable-row');

			if ([...draggableRows].length > 0) {
				[...draggableRows].forEach((draggableRow) => {
					const employeeFullName = draggableRow.querySelector('#fullname').textContent.toLowerCase();

					const employeeSearchName = employeeName.toLowerCase();

					const display = includes(employeeFullName, employeeSearchName) ? 'display:table-row' : 'display:none';

					if (display === 'display:table-row') {
						totalEmployees += 1;
					}

					draggableRow.setAttribute('style', display);
				});

				this.setState({ totalEmployees });
			}
		});
	};

	handleClearSortEmployees = () => {
		this.setState({
			sort: {
				column: null,
				direction: 'asc',
			},
		});
		/* , () => window.location.reload()); */
	};

	handleSortDirection = (column) => {
		const { sort } = this.state;

		let className = 'sort-direction';

		if (sort.column === column) {
			className = className.concat((sort.direction === 'asc') ? ' asc' : ' desc');
		}

		return className;
	};

	handleGetEmployees = () => {
		logMessage('info', 'Called Employees handleGetEmployees getEmployees');

		return this.props.actions.getEmployees().catch(error => Promise.reject(error));
	};

	handleGetRotaEmployees = () => {
		const { rota, actions } = this.props;

		logMessage('info', 'Called Employees handleGetRotaEmployees getRotaEmployees');

		return actions.getRotaEmployees(rota).catch(error => Promise.reject(error));
	};

	renderAccountAccessText = (accountEmployee) => {
		const role = accountEmployee.accountAccess.applicationUserRoles[0];

		if (role) {
			return role.roleName;
		}

		const invite = accountEmployee.accountAccess.applicationUserRoleInvites[0];

		if (invite) {
			if (invite.status === 'SENT') {
				return `${invite.roleName} (INVITED)`;
			}
		}

		return 'NONE';
	};

	/* Don't render if the account employee is the owner OR the current logged in user -
	to prevent removing their own access */
	renderManageAccountAccessButton = (accountEmployee) => {
		const role = accountEmployee.accountAccess.applicationUserRoles[0];

		if (role) {
			if (role.roleName === 'OWNER') {
				return false;
			}
		}

		if (this.props.user.email === accountEmployee.employee.email) {
			return false;
		}
		return true;
	}

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Toolbar history={this.props.history} />
			{(!isEmpty(this.state.employees)) ? (
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
														<div className="d-inline-block p-0 m-0 mr-1 mr-xl-1"><button type="button" className={`btn btn-dark border-0 btn-icon${!isEmpty(this.state.employeeName) ? ' btn-filter-active' : ''}`} id="filter" title="Filter by" aria-label="Filter by" onClick={this.handleFilter}><i className="fa fa-fw fa-filter" aria-hidden="true"></i></button></div>
														<div className="d-inline-block p-0 m-0 mr-1 mr-xl-1"><button type="button" className={`btn btn-dark border-0 btn-icon${!isEmpty(this.state.sort.column) ? ' btn-filter-active' : ''}`} id="sortBy" title="Sort by" aria-label="Sort by" onClick={this.handleSortBy}><i className="fa fa-fw fa-sort" aria-hidden="true"></i></button></div>
													</Fragment>
												) : null}
											</div>
											{(this.props.employees.length > 0) ? (
												<Fragment>
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
																	<button type="button" className="btn btn-action m-0 border-0" id="filterClear" onClick={event => this.handleFilterEmployees(event, '')}>Clear</button>
																	<button type="button" className="btn btn-action m-0 border-0" id="filterClose" onClick={this.handleFilter}>Close</button>
																</div>
															</Form>
														</PopoverBody>
													</Popover>
													<Popover placement="bottom" isOpen={this.state.isSortByPopoverOpen} target="sortBy" toggle={this.handleSortBy}>
														<PopoverBody>
															<ul className="popover-menu">
																<li><label className="pt-2 pb-1 m-0">Sort by</label></li>
																<li><button type="button" title="Sort by First Name" id="sortByFirstName" className={`btn btn-action btn-nav border-0${(this.state.sort.column === 'firstName') ? ' text-warning' : ''}`} onClick={event => this.handleSortEmployees(event, 'firstName')}>First Name {(this.state.sort.column === 'firstName') ? <i className={`fa fa-sort-alpha-${this.state.sort.direction}`} aria-hidden="true"></i> : null}</button></li>
																<li><button type="button" title="Sort by Last Name" id="sortByLastName" className={`btn btn-action btn-nav border-0${(this.state.sort.column === 'lastName') ? ' text-warning' : ''}`} onClick={event => this.handleSortEmployees(event, 'lastName')}>Last Name {(this.state.sort.column === 'lastName') ? <i className={`fa fa-sort-alpha-${this.state.sort.direction}`} aria-hidden="true"></i> : null}</button></li>
																{(!isEmpty(this.state.sort.column)) ? (
																	<li className="filter-buttons">
																		<button type="button" title="Clear Sort by" id="clearSortBy" className="btn btn-action m-0 border-0 mb-2" style={{ borderRadius: '4px' }} onClick={event => this.handleClearSortEmployees(event)}>Clear</button>
																		<button type="button" title="Close Sort by" id="closeSortBy" className="btn btn-action m-0 border-0" style={{ borderRadius: '4px' }} onClick={this.handleSortBy}>Close</button>
																	</li>
																) : null}
															</ul>
														</PopoverBody>
													</Popover>
												</Fragment>
											) : null}
										</th>
										<th className="p-2 m-0 text-center column numeric">Account Access</th>
										<th className="p-2 m-0 text-center column">Email</th>
										<th className="p-2 m-0 text-center column">Mobile</th>
										<th className="p-2 m-0 text-center column">Hourly Rate</th>
										<th className="p-2 m-0 text-center column">Salary</th>
										<th className="p-2 m-0 text-center column">Hours</th>
										<th className="p-2 m-0 text-center column last">&nbsp;</th>
									</tr>
								</thead>
								<tbody id="tableBody">
									{this.state.employees.map((accountEmployee, accountEmployeeIndex) => (
										<tr key={accountEmployeeIndex} className="draggable-row" data-account-employee-id={accountEmployee.accountEmployeeId} data-first-name={accountEmployee.employee.firstName} data-last-name={accountEmployee.employee.lastName}>
											<td className="p-2 align-middle text-left p-0 m-0 edit-employee column first">
												<div className="d-flex align-items-center p-0 m-0 wrap-words position-relative">
													<div className="d-inline-block p-0 mt-0 ml-0 mr-2 mb-0">
														<div className="avatar-circle text-center bg-secondary">
															<span className="avatar-initials position-relative text-white">{(`${accountEmployee.employee.firstName} ${accountEmployee.employee.lastName}`).split(' ').map(n => n[0]).join('')}</span>
														</div>
													</div>
													<div className="d-inline-block pt-0 pl-0 pr-0 pb-0 m-0">
														<div id="fullname">{accountEmployee.employee.firstName} {accountEmployee.employee.lastName}</div>
													</div>
												</div>
											</td>
											<td className="p-2 align-middle text-center wrap-words column account-access">
												<div className="d-flex align-items-center p-0 m-0">
													<div className="d-inline-block p-0 mr-auto">{this.renderAccountAccessText(accountEmployee)}</div>
													<div className="m-2">
														{this.renderManageAccountAccessButton(accountEmployee) ? (
															<ManageAccountAccessButton accountEmployee={accountEmployee} rowIndex={accountEmployeeIndex} roleIds={this.state.roleIds} handleSuccessNotification={this.handleSuccessNotification} handleErrorNotification={this.handleErrorNotification} />
														) : null}
													</div>
												</div>
											</td>
											<td className="p-2 align-middle text-center wrap-words column">{accountEmployee.employee.email}</td>
											<td className="p-2 align-middle text-center wrap-words column">{accountEmployee.employee.mobile}</td>
											<td className="p-2 align-middle text-center wrap-words column">&pound;{(accountEmployee.hourlyRate).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
											<td className="p-2 align-middle text-center wrap-words column">&pound;{(accountEmployee.salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
											<td className="p-2 align-middle text-center wrap-words column">{(accountEmployee.weeklyContractHours).toFixed(2)}</td>
											<td className="p-2 align-middle text-center column last">
												<button type="button" className="btn border-0 btn-secondary text-white btn-icon ml-1" id={`editEmployee${accountEmployee.accountEmployeeId}`} title="Edit Employee" onClick={event => this.handleEditEmployee(event, accountEmployee.employee.employeeId)}><i className="fa fa-fw fa-pencil" aria-hidden="true"></i></button>
												<button type="button" className="btn border-0 btn-secondary text-white btn-icon ml-1" id={`createUnavailability${accountEmployee.accountEmployeeId}`} title="Add Time Off" onClick={event => this.handleCreateUnavailability(event, accountEmployee.employee.employeeId)}>Add Time Off</button>
												<button type="button" className="btn border-0 btn-danger text-white btn-icon ml-1" id={`deleteEmployee${accountEmployee.accountEmployeeId}`} title="Delete Employee" aria-label="Delete Employee" onClick={event => this.handleDeleteEmployee(event, accountEmployee.employee.employeeId)}><i className="fa fa-fw fa-trash" aria-hidden="true"></i></button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<Modal title="Create Time Off" className="modal-dialog" show={this.state.isCreateUnavailabilityModalOpen} onClose={this.handleCreateUnavailability}>
						<UnavailabilityForm editMode={false} employeeId={this.state.employeeId} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateUnavailability} />
					</Modal>
					<Modal title="Edit Employee" className="modal-dialog" show={this.state.isEditEmployeeModalOpen} onClose={this.handleEditEmployee}>
						<EmployeeForm editMode={true} employeeId={this.state.employeeId} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditEmployee} />
					</Modal>
				</Fragment>
			) : null}
			<Footer history={this.props.history} />
		</Fragment>
	);
}

Employees.propTypes = propTypes;

Employees.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
	week: state.week,
	rota: state.rota,
	rotas: state.rotas,
	roles: state.roles,
	rotaType: state.rotaType,
	settings: state.settings,
	employees: state.employees,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getShifts,
		getEmployees,
		updateEmployee,
		deleteEmployee,
		getRotaEmployees,
		getApplicationUserRoles,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
