import moment from 'moment';
import delay from 'lodash/delay';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import { saveAs } from 'file-saver/FileSaver';
import React, { Fragment, Component } from 'react';
import { Col, Row, Tooltip, Button, Popover, ButtonGroup, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import config from '../../helpers/config';

import RotaForm from '../forms/RotaForm';

import ShiftForm from '../forms/ShiftForm';

import confirm from '../../helpers/confirm';

import logMessage from '../../helpers/logging';

import CloseButton from '../common/CloseButton';

import EmployeeForm from '../forms/EmployeeForm';

import Notification from '../common/Notification';

import AssignShiftForm from '../forms/AssignShiftForm';

import { switchWeek } from '../../actions/weekActions';

import { updateSettings } from '../../actions/settingActions';

import { getRotaTypes, switchRotaType } from '../../actions/rotaTypeActions';

import { getShifts, copyShifts, downloadShifts } from '../../actions/shiftActions';

import { getRota, getRotas, deleteRota, switchRota, updateRota, publishRota } from '../../actions/rotaActions';

const routes = config.APP.ROUTES;

const { STATUSES } = routes.ROTAS;

const dashboard = routes.DASHBOARD;

const notifications = config.APP.NOTIFICATIONS;

const propTypes = {
	week: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	shifts: PropTypes.array.isRequired,
	rotaCost: PropTypes.number.isRequired,
	rotaType: PropTypes.object.isRequired,
	rotaTypes: PropTypes.array.isRequired,
};

const defaultProps = {
	week: {},
	rota: {},
	rotas: [],
	shifts: [],
	rotaCost: 0,
	rotaType: {},
	rotaTypes: [],
};

class Toolbar extends Component {
	constructor(props) {
		super(props);

		this.toastId = null;

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleGetRota = this.handleGetRota.bind(this);

		this.handleEditRota = this.handleEditRota.bind(this);

		this.handleGetRotas = this.handleGetRotas.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleCopyShifts = this.handleCopyShifts.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

		this.handleDeleteRota = this.handleDeleteRota.bind(this);

		this.handleSwitchRota = this.handleSwitchRota.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleAssignShift = this.handleAssignShift.bind(this);

		this.handlePublishRota = this.handlePublishRota.bind(this);

		this.handleDownloadRota = this.handleDownloadRota.bind(this);

		this.handleRotaTypeMenu = this.handleRotaTypeMenu.bind(this);

		this.handleSwitchRotaType = this.handleSwitchRotaType.bind(this);

		this.handleCreateEmployee = this.handleCreateEmployee.bind(this);

		this.handleEditRotaTooltip = this.handleEditRotaTooltip.bind(this);

		this.handleRotaBudgetTooltip = this.handleRotaBudgetTooltip.bind(this);

		this.handleCreateShiftTooltip = this.handleCreateShiftTooltip.bind(this);

		this.handlePublishRotaTooltip = this.handlePublishRotaTooltip.bind(this);

		this.handleDownloadRotaTooltip = this.handleDownloadRotaTooltip.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleCreateEmployeeTooltip = this.handleCreateEmployeeTooltip.bind(this);

		this.handleCopyLastWeeksRotaShifts = this.handleCopyLastWeeksRotaShifts.bind(this);

		this.handleCopyLastWeeksRotaShiftsTooltip = this.handleCopyLastWeeksRotaShiftsTooltip.bind(this);

		this.handleSwitchFromAssignShiftToCreateShift = this.handleSwitchFromAssignShiftToCreateShift.bind(this);
	}

	getInitialState = () => ({
		error: {},
		rotaId: '',
		startDate: '',
		rotaBudget: 0,
		rotaStatus: 'DRAFT',
		rolesIsActive: false,
		isErrorModalOpen: false,
		overviewIsActive: false,
		employeesIsActive: false,
		enableShiftButton: false,
		isEditRotaModalOpen: false,
		isEditRotaTooltipOpen: false,
		isCreateRotaModalOpen: false,
		isCreateShiftModalOpen: false,
		isAssignShiftModalOpen: false,
		isRotaBudgetTooltipOpen: false,
		hasRotaUnassignedShifts: false,
		isCreateShiftTooltipOpen: false,
		isPublishRotaTooltipOpen: false,
		isDownloadRotaTooltipOpen: false,
		isRotaTypeMenuPopoverOpen: false,
		isCreateEmployeeModalOpen: false,
		isCreateEmployeeTooltipOpen: false,
		isCopyLastWeeksRotaShiftsTooltipOpen: false,
	});

	componentDidMount = () => {
		/* We debounce this call to wait 10ms (we do not want the leading (or "immediate") flag passed because we want to wait until all the componentDidUpdate calls have finished before loading the button states again */
		this.handleToggleButtonStates = debounce(this.handleToggleButtonStates.bind(this), 10);
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (isEmpty(this.props.week)) {
			return;
		}

		/* If the current week/rota or shifts have changes, re/check the shift button state and update label to reflect available actions */
		if (prevProps.week !== this.props.week || prevProps.shifts !== this.props.shifts || prevProps.rotaType !== this.props.rotaType || prevProps.rota !== this.props.rota || prevProps.settings !== this.props.settings) {
			this.handleToggleButtonStates();
		}
	};

	handleGetRota = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		logMessage('info', 'Called Toolbar handleGetRota getRota');
		logMessage('info', 'Called Toolbar handleGetRota switchRota');

		return actions.getRota(payload)
			.then(rota => actions.switchRota(rota))
			.catch(error => Promise.reject(error));
	};

	handleDeleteRota = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		logMessage('info', 'Called Toolbar handleDeleteRota deleteRota');

		return actions.deleteRota(payload).catch(error => Promise.reject(error));
	};

	handleSwitchRota = (rota) => {
		const { actions } = this.props;

		/* Set the current rota */
		logMessage('info', 'Called Toolbar handleSwitchRota switchRota');

		actions.switchRota(rota)
			.then(() => {
				const { rota: { rotaId } } = this.props;

				const payload = {
					rotaId,
				};

				/* Any time we switch rotas, we need to get a fresh list of shifts for that rota */
				logMessage('info', 'Called Toolbar handleSwitchRota getShifts');

				actions.getShifts(payload).catch((error) => {
					error.data.title = 'Get Shifts';

					this.setState({ error });

					this.handleModal();
				});
			});
	};

	handleGetRotas = () => {
		const { actions, rotaType: { rotaTypeId } } = this.props;

		const payload = {
			rotaTypeId,
		};

		logMessage('info', 'Called Toolbar handleGetRotas getRotas');

		return actions.getRotas(payload).catch(error => Promise.reject(error));
	};

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		logMessage('info', 'Called Toolbar handleGetShifts getShifts');

		return actions.getShifts(payload).catch(error => Promise.reject(error));
	};

	handleToggleButtonStates = () => {
		const { pathname } = this.props.history.location;

		const firstDayOfCurrentWeekDate = moment().startOf('week').format('YYYY-MM-DD');

		const currentWeekDate = moment(this.props.week.startDate).format('YYYY-MM-DD');

		const currentRotaDate = moment(this.props.rota.startDate).format('YYYY-MM-DD');

		/* By default hide the shift button */
		let enableShiftButton = false;

		/* By default if no unassigned shifts, show the create shift button */
		let hasUnassignedShifts = false;

		/* However if the current rota/week start date is not in the current week e.g today/this week (not the week that the user is viewing) then disabled the shift button again (we also change the label to reflect the approiate action, although this doesnt really matter TBH as button is disabled) */
		const currentWeekRange = [];

		const startOfCurrentWeek = moment(currentWeekDate);

		const endOfCurrentWeek = moment(currentWeekDate).add(7, 'days');

		currentWeekRange.push(startOfCurrentWeek.format('YYYY-MM-DD'));

		while (startOfCurrentWeek.add(1, 'days').diff(endOfCurrentWeek) < 0) {
			currentWeekRange.push(startOfCurrentWeek.format('YYYY-MM-DD'));
		}

		/**
		 * if first day of current week date is same or before current week date, enable
		 * if first day of current week date is in current week range, enable
		 */
		if (moment(firstDayOfCurrentWeekDate).isSameOrBefore(moment(currentWeekDate))) {
			enableShiftButton = true;
		}

		if (includes(currentWeekRange, moment())) {
			enableShiftButton = true;
		}

		/* Loop over all shifts and get the unassigned ones */
		let unassignedShifts = this.props.shifts.filter(data => (data.placements === null || data.placements.length === 0));

		/* Filter all unassigned shifts and return those that have not yet pasted. E.g if date was 6th July and an unassigned shifts start date was 5th July, it would not be returned... */
		unassignedShifts = unassignedShifts.filter(data => moment(data.startTime).isSameOrAfter(moment().format('YYYY-MM-DD')));

		/* If we have unassigned shifts, show the assign shift button */
		if (unassignedShifts.length > 0) {
			hasUnassignedShifts = true;
		}

		/* Business rule decided on 3rd August 2018 by CL to always show Create Shift button for beta release/until we get Roles view completed */
		hasUnassignedShifts = false;

		const { status, budget } = this.props.rota;

		this.setState({
			enableShiftButton,
			rotaBudget: budget,
			rotaStatus: status,
			hasUnassignedShifts,
			rolesIsActive: (pathname === dashboard.ROLES.URI),
			overviewIsActive: (pathname === dashboard.OVERVIEW.URI),
			employeesIsActive: (pathname === dashboard.EMPLOYEES.URI),
		});
	};

	handleSwitchRotaType = (event) => {
		const { actions } = this.props;

		const target = event.currentTarget;

		if (this.props.rotaTypes.length > 0) {
			const rotaType = this.props.rotaTypes.find(data => data.rotaTypeId === target.id);

			if (!isEmpty(rotaType)) {
				this.setState(this.getInitialState());

				/* Switch rota type and fetch all rotas for this type, grab latest rota and update current week */
				logMessage('info', 'Called Toolbar handleSwitchRotaType switchRotaType');

				actions.switchRotaType(rotaType).then(() => {
					logMessage('info', 'Called Toolbar handleSwitchRotaType getRotas');

					actions.getRotas(rotaType)
						.then(() => {
							/* We only want to get the rota matching the current week so we have some data by default */
							let rota = this.props.rotas.filter(data => moment(data.startDate).format('YYYY-MM-DD') === moment(this.props.week.startDate).format('YYYY-MM-DD')).shift();

							/* No rotas match the current week so lets use the first rota we find */
							if (isEmpty(rota)) {
								rota = orderBy(this.props.rotas, 'startDate').shift();
							}

							logMessage('info', 'Called Toolbar handleSwitchRotaType switchRota');

							actions.switchRota(rota).then(() => {
								/* Then we use the rotas start date to set the current week start and end dates */
								const firstDayOfWeek = moment(rota.startDate).day();

								const weekStartDate = moment(rota.startDate);

								const weekEndDate = moment(rota.startDate).add(6, 'days');

								let payload = {
									endDate: weekEndDate,
									startDate: weekStartDate,
								};

								/* Set the current week */
								logMessage('info', 'Called Toolbar handleSwitchRotaType switchWeek');

								actions.switchWeek(payload).then(() => {
									/* Get shifts for current rota */
									logMessage('info', 'Called Toolbar handleSwitchRotaType getShifts');

									actions.getShifts(rota)
										.then(() => {
											payload = {
												firstDayOfWeek,
											};

											/* Set the day of week based on start date */
											logMessage('info', 'Called Toolbar handleSwitchRotaType updateSettings');

											actions.updateSettings(payload);

											logMessage('info', 'Called Toolbar handleSwitchRotaType firstDayOfWeek:', firstDayOfWeek);

											moment.updateLocale('en', {
												week: {
													dow: firstDayOfWeek,
													doy: moment.localeData('en').firstDayOfYear(),
												},
											});
										})
										.catch((error) => {
											error.data.title = 'Get Shifts';

											this.setState({ error });

											this.handleModal();
										});
								});
							});
						})
						.catch((error) => {
							error.data.title = 'Get Rotas';

							this.setState({ error });

							this.handleModal();
						});
				});
			}
		}
	};

	handlePublishRota = () => {
		/* Check if the user wants to publish the rota */
		let message = '<div class="text-center"><p>Please confirm that you wish to publish the Rota?</p></div>';

		const options = {
			message,
			labels: {
				cancel: 'Cancel',
				proceed: 'Publish',
			},
			values: {
				cancel: false,
				process: true,
			},
			colors: {
				proceed: 'primary',
			},
			title: 'Publish Rota',
			className: 'modal-dialog',
		};

		/* If the user has clicked the proceed button, we publish the rota */
		/* If the user has clicked the cancel button, we do nothing */
		confirm(options)
			.then((result) => {
				const { rota: { rotaId }, actions } = this.props;

				const payload = {
					rotaId,
				};

				logMessage('info', 'Called Toolbar handleSwitchRota publishRota');

				actions.publishRota(payload)
					.then(() => this.handleGetRota())
					.then(() => this.handleGetRotas())
					.then(() => this.handleGetShifts())
					.then(() => {
						/* FIXME - Make messages constants in config */
						message = '<p>Rota was published!</p>';

						this.handleSuccessNotification(message);
					})
					.catch((error) => {
						error.data.title = 'Publish Rota';

						this.setState({ error });

						this.handleModal();
					});
			}, (result) => {
				/* We do nothing */
			});
	};

	handleDownloadRota = () => {
		const { rota: { rotaId }, actions } = this.props;

		const payload = {
			rotaId,
		};

		actions.downloadShifts(payload)
			.then(response => saveAs(response, `rota-shifts-${moment(this.props.rota.startDate).format('YYYY-MM-DD')}.pdf`))
			.catch((error) => {
				error.data.title = 'Download Rota';

				this.setState({ error });

				this.handleModal();
			});
	};

	handleCopyShifts = (rota) => {
		const { actions, rotaType: { rotaTypeId } } = this.props;

		logMessage('info', 'Called Toolbar handleCopyShifts copyShifts');

		actions.copyShifts(rota)
			.then(newRota => this.handleSwitchRota(newRota))
			.then(() => this.handleGetRotas())
			.then(() => {
				/* FIXME - bug with setState somewhere when calling history.push(routes.DASHBOARD.ROLES.URI); */
			})
			.catch((error) => {
				error.data.title = 'Copy Shifts';

				this.setState({ error });

				this.handleModal();
			});
	};

	handleCreateRota = () => this.setState({ isCreateRotaModalOpen: !this.state.isCreateRotaModalOpen });

	handleCreateShift = () => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleAssignShift = () => this.setState({ isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

	handleEditRotaTooltip = () => this.setState({ isEditRotaTooltipOpen: !this.state.isEditRotaTooltipOpen });

	handleRotaTypeMenu = () => this.setState({ isRotaTypeMenuPopoverOpen: !this.state.isRotaTypeMenuPopoverOpen });

	handleRotaBudgetTooltip = () => this.setState({ isRotaBudgetTooltipOpen: !this.state.isRotaBudgetTooltipOpen });

	handleCreateEmployee = () => this.setState({ isCreateEmployeeModalOpen: !this.state.isCreateEmployeeModalOpen });

	handleCreateShiftTooltip = () => this.setState({ isCreateShiftTooltipOpen: !this.state.isCreateShiftTooltipOpen });

	handlePublishRotaTooltip = () => this.setState({ isPublishRotaTooltipOpen: !this.state.isPublishRotaTooltipOpen });

	handleEditRota = (event, rotaId) => this.setState({ rotaId, isEditRotaModalOpen: !this.state.isEditRotaModalOpen });

	handleDownloadRotaTooltip = () => this.setState({ isDownloadRotaTooltipOpen: !this.state.isDownloadRotaTooltipOpen });

	handleCreateEmployeeTooltip = () => this.setState({ isCreateEmployeeTooltipOpen: !this.state.isCreateEmployeeTooltipOpen });

	handleCopyLastWeeksRotaShifts = () => {
		logMessage('info', 'Called Toolbar handleCopyLastWeeksRotaShifts');

		/* Check if the user wants to copy the previous weeks rota shifts into the new rota */
		const message = '<p>Please confirm that you would like to copy all of previous week&#39;s shifts into this rota?</p>';

		const options = {
			message,
			labels: {
				cancel: 'No',
				proceed: 'Yes',
			},
			values: {
				cancel: false,
				process: true,
			},
			colors: {
				proceed: 'primary',
			},
			title: 'Copy Previous Week\'s Rota Shifts',
			className: 'modal-dialog',
		};

		/**
		 * If the user has clicked the proceed button, we copy the shifts
		 * If the user has clicked the cancel button, we do nothing.
		 */
		confirm(options)
			.then((result) => {
				const previousStartDate = moment(this.props.week.startDate).subtract(7, 'days');

				/* Find the rota for the previous week */
				const matchingRota = this.props.rotas.filter(rota => moment(rota.startDate).format('YYYY-MM-DD') === previousStartDate.format('YYYY-MM-DD')).shift();

				logMessage('info', 'Called Toolbar handleCopyLastWeeksRotaShifts - matching rota:', matchingRota);

				this.handleDeleteRota().then(() => this.handleCopyShifts(matchingRota));
			}, () => {});
	};

	handleCopyLastWeeksRotaShiftsTooltip = () => this.setState({ isCopyLastWeeksRotaShiftsTooltipOpen: !this.state.isCopyLastWeeksRotaShiftsTooltipOpen });

	handleSwitchFromAssignShiftToCreateShift = () => this.setState({ isCreateShiftModalOpen: true, isAssignShiftModalOpen: false });

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}

		/* FIXME - Make messages constants in config */
		/* If the message has come from deleting a rota, we need to redirect back to dashboard to reload all data again */
		if (message === '<p>Rota was deleted!</p>') {
			this.props.history.push(routes.DASHBOARD.HOME.URI);
		}
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen }, () => ((!this.state.isErrorModalOpen) ? this.props.history.push(routes.DASHBOARD.HOME.URI) : null));

	render = () => (
		<Fragment>
			<Row>
				<Col className={`bg-light-danger pt-3 pb-3 pt-sm-3 pb-ms-3 text-center text-md-left ${(this.props.rota.budget > 0 && this.props.rotaCost > this.props.rota.budget) ? 'd-block' : 'd-none'}`} xs="12" sm="12" md="12" lg="12" xl="12">
					<ul className="list-unstyled list-inline m-0 p-0">
						<li className="list-inline-item">Rota Budget: <strong>&pound;{this.state.rotaBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></li>
						<li className="list-inline-item">Rota Cost: <strong className="text-danger">&pound;{this.props.rotaCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></li>
						<li className="list-inline-item">Extra Cost: <strong className="text-danger">&#43;&pound;{(this.props.rotaCost - this.state.rotaBudget).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></li>
					</ul>
				</Col>
			</Row>
			<Row>
				<Col className="pt-3 pb-3 pt-sm-3 pb-ms-3 text-center text-md-left" xs="12" sm="12" md="7" lg="7" xl="6">
					<button type="button" className="btn btn-rotas-popover text-dark border-0 col-12 col-sm-auto" id="rotaTypeMenu" title="Toggle Rotas" aria-label="Toggle Rotas" onClick={this.handleRotaTypeMenu}>{this.props.rotaType.rotaTypeName}<i className="pl-2 fa fa-fw fa-chevron-down" aria-hidden="true"></i></button>
					<ButtonGroup className="d-none d-sm-inline-block p-0 pl-sm-3 pl-md-3 pl-lg-3 pl-xl-3 m-0">
						<button type="button" id="download-rota" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3" onClick={event => this.handleDownloadRota(event, this.props.rota.rotaId)}><i className="fa fa-fw fa-file-pdf-o" aria-hidden="true"></i></button>
						<button type="button" id="edit-rota" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3" onClick={event => this.handleEditRota(event, this.props.rota.rotaId)}><i className="fa fa-fw fa-pencil" aria-hidden="true"></i></button>
						<button type="button" id="rota-budget" className={`btn btn-rotas-popover text-dark border-0 pl-3 pr-3 ${(this.props.shifts.length === 0) ? '' : 'rounded-right'}`} style={{ cursor: 'default' }}>&pound;{this.state.rotaBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</button>
						<button type="button" id="copy-last-weeks-rota-shifts" className={`btn btn-rotas-popover text-dark border-0 pl-3 pr-3 ${(this.props.shifts.length === 0) ? 'd-inline-block' : 'd-none'}`} onClick={this.handleCopyLastWeeksRotaShifts}><i className="fa fa-fw fa-files-o" aria-hidden="true"></i></button>
					</ButtonGroup>
					<div className="d-block d-sm-none">
						<button type="button" id="download-rota" className="btn btn-rotas-popover text-dark border-0 mt-3 mt-sm-auto pl-3 pr-3 col-12 col-sm-auto mb-3" onClick={event => this.handleDownloadRota(event, this.props.rota.rotaId)}><i className="fa fa-fw fa-file-pdf-o" aria-hidden="true"></i> PDF Rota</button>
						<button type="button" id="edit-rota" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3 col-12 col-sm-auto mb-3" onClick={event => this.handleEditRota(event, this.props.rota.rotaId)}><i className="fa fa-fw fa-pencil" aria-hidden="true"></i> Edit Rota</button>
						<button type="button" id="rota-budget" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3 col-12 col-sm-auto mb-3" style={{ cursor: 'default' }}>Rota Budget: &pound;{this.state.rotaBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</button>
						{(this.props.shifts.length === 0) ? (
							<button type="button" id="copy-last-weeks-rota-shifts" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3 col-12 col-sm-auto mb-0" onClick={this.handleCopyLastWeeksRotaShifts}><i className="fa fa-fw fa-files-o" aria-hidden="true"></i> Copy last weeks Rota shifts</button>
						) : null}
					</div>
					<Tooltip placement="bottom" isOpen={this.state.isDownloadRotaTooltipOpen} target="download-rota" toggle={this.handleDownloadRotaTooltip}>Creates a PDF of the current Rota</Tooltip>
					<Tooltip placement="bottom" isOpen={this.state.isEditRotaTooltipOpen} target="edit-rota" toggle={this.handleEditRotaTooltip}>Edit the current Rota</Tooltip>
					<Tooltip placement="bottom" isOpen={this.state.isRotaBudgetTooltipOpen} target="rota-budget" toggle={this.handleRotaBudgetTooltip}>Rota Budget</Tooltip>
					<Tooltip placement="bottom" isOpen={this.state.isCopyLastWeeksRotaShiftsTooltipOpen} target="copy-last-weeks-rota-shifts" toggle={this.handleCopyLastWeeksRotaShiftsTooltip}>Copy last weeks Rota shifts</Tooltip>
					<Popover placement="bottom" isOpen={this.state.isRotaTypeMenuPopoverOpen} target="rotaTypeMenu" toggle={this.handleRotaTypeMenu}>
						<PopoverBody>
							<ul className="popover-menu">
								{(this.props.rotaTypes.length > 0) ? orderBy(this.props.rotaTypes, 'rotaTypeName').map((rotaType, index) => (<li key={index}><button type="button" title={rotaType.rotaTypeName} className="btn btn-action btn-nav border-0 text-truncate" id={rotaType.rotaTypeId} onClick={this.handleSwitchRotaType}>{rotaType.rotaTypeName}</button></li>)) : null}
								<li><button type="button" title="Add New Rota" className="btn btn-primary btn-nav border-0" onClick={this.handleCreateRota}>Add New Rota</button></li>
							</ul>
						</PopoverBody>
					</Popover>
				</Col>
				<Col className="pt-0 pb-0 pt-sm-0 pt-md-3 pb-sm-3 text-center text-md-right" xs="12" sm="12" md="5" lg="5" xl="6">
					<div className="d-block d-sm-inline-block d-md-none d-lg-inline-block">
						{(this.state.employeesIsActive || this.state.overviewIsActive) ? (
							<Fragment>
								{(this.state.hasUnassignedShifts) ? (
									<button type="button" title="Assign Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-3 pr-3 border-0" disabled={!this.state.enableShiftButton} onClick={this.handleAssignShift}><i className="fa fa-fw fa-plus d-none d-sm-none d-md-inline-block d-lg-none" aria-hidden="true"></i><span className="d-sm-inline-block d-md-none d-lg-inline-block">Assign</span> Shift</button>
								) : (
									<button type="button" title="Create Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-3 pr-3 border-0" disabled={!this.state.enableShiftButton} onClick={this.handleCreateShift}><i className="fa fa-fw fa-plus d-none d-sm-none d-md-inline-block d-lg-none" aria-hidden="true"></i><span className="d-sm-inline-block d-md-none d-lg-inline-block">Create</span> Shift</button>
								)}
							</Fragment>
						) : (
							<button type="button" title="Create Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-3 pr-3 border-0" disabled={!this.state.enableShiftButton} onClick={this.handleCreateShift}><i className="fa fa-fw fa-plus d-none d-sm-none d-md-inline-block d-lg-none" aria-hidden="true"></i><span className="d-sm-inline-block d-md-none d-lg-inline-block">Create</span> Shift</button>
						)}
						{(this.state.rotaStatus === STATUSES.DRAFT) ? (
							<button type="button" title="Publish Rota" className="btn btn-nav btn-primary col-12 col-sm-auto pl-3 pr-3 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled={!this.state.enableShiftButton} onClick={this.handlePublishRota}>Publish<span className="d-sm-inline-block d-md-none d-lg-inline-block">&nbsp;Rota</span></button>
						) : null}
						{(this.state.rotaStatus === STATUSES.PUBLISHED) ? (
							<button type="button" title="Rota Published" className="btn btn-nav btn-primary col-12 col-sm-auto pl-3 pr-3 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled>Publish<span className="d-sm-inline-block d-md-none d-lg-inline-block">&nbsp;Rota</span></button>
						) : null}
						{(this.state.rotaStatus === STATUSES.EDITED) ? (
							<button type="button" title="Publish Rota Changes" className="btn btn-nav btn-primary col-12 col-sm-auto pl-3 pr-3 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled={!this.state.enableShiftButton} onClick={this.handlePublishRota}>Publish&nbsp;<span className="d-sm-inline-block d-md-none d-lg-inline-block">Rota&nbsp;</span>Changes</button>
						) : null}
						<button type="button" title="Create Employee" className="d-inline-block d-lg-none btn btn-nav btn-primary col-12 col-sm-auto pl-3 pr-3 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" onClick={this.handleCreateEmployee}><i className="fa fa-fw fa-plus d-none d-sm-none d-md-inline-block d-lg-none" aria-hidden="true"></i><span className="d-sm-inline-block d-md-none d-lg-inline-block">Create</span> Employee</button>
					</div>
					<ButtonGroup className="d-none d-md-inline-block d-lg-none p-0 m-0 mr-3">
						{(this.state.employeesIsActive || this.state.overviewIsActive) ? (
							<Fragment>
								{(this.state.hasUnassignedShifts) ? (
									<Fragment>
										<button type="button" title="Assign Shift" id="assign-shift" className="btn btn-nav btn-secondary border-0 pl-3 pr-3" disabled={!this.state.enableShiftButton} onClick={this.handleAssignShift}><i className="fa fa-fw fa-plus d-sm-none d-md-inline-block d-lg-none" aria-hidden="true"></i><span className="d-sm-inline-block d-md-none d-lg-inline-block">Assign</span> Shift</button>
										<Tooltip placement="bottom" isOpen={this.state.isCreateShiftTooltipOpen} target="assign-shift" toggle={this.handleCreateShiftTooltip}>Assign Shift</Tooltip>
									</Fragment>
								) : (
									<Fragment>
										<button type="button" title="Create Shift" id="create-shift" className="btn btn-nav btn-secondary border-0 pl-3 pr-3" disabled={!this.state.enableShiftButton} onClick={this.handleCreateShift}><i className="fa fa-fw fa-plus d-sm-none d-md-inline-block d-lg-none" aria-hidden="true"></i><span className="d-sm-inline-block d-md-none d-lg-inline-block">Create</span> Shift</button>
										<Tooltip placement="bottom" isOpen={this.state.isCreateShiftTooltipOpen} target="create-shift" toggle={this.handleCreateShiftTooltip}>Create Shift</Tooltip>
									</Fragment>
								)}
							</Fragment>
						) : (
							<Fragment>
								<button type="button" title="Create Shift" id="create-shift" className="btn btn-nav btn-secondary border-0 pl-3 pr-3" disabled={!this.state.enableShiftButton} onClick={this.handleCreateShift}><i className="fa fa-fw fa-plus d-sm-none d-md-inline-block d-lg-none" aria-hidden="true"></i><span className="d-sm-inline-block d-md-none d-lg-inline-block">Create</span> Shift</button>
								<Tooltip placement="bottom" isOpen={this.state.isCreateShiftTooltipOpen} target="create-shift" toggle={this.handleCreateShiftTooltip}>Create Shift</Tooltip>
							</Fragment>
						)}
						{(this.state.rotaStatus === STATUSES.DRAFT) ? (
							<Fragment>
								<button type="button" title="Publish Rota" id="publish-rota" className="btn btn-nav btn-primary border-0 pl-3 pr-3" disabled={!this.state.enableShiftButton} onClick={this.handlePublishRota}>Publish<span className="d-sm-inline-block d-md-none d-lg-inline-block">&nbsp;Rota</span></button>
								<Tooltip placement="bottom" isOpen={this.state.isPublishRotaTooltipOpen} target="publish-rota" toggle={this.handlePublishRotaTooltip}>Publish Rota</Tooltip>
							</Fragment>
						) : null}
						{(this.state.rotaStatus === STATUSES.PUBLISHED) ? (
							<Fragment>
								<button type="button" title="Rota Published" id="publish-rota" className="btn btn-nav btn-primary border-0 pl-3 pr-3" disabled>Publish<span className="d-sm-inline-block d-md-none d-lg-inline-block">&nbsp;Rota</span></button>
								<Tooltip placement="bottom" isOpen={this.state.isPublishRotaTooltipOpen} target="publish-rota" toggle={this.handlePublishRotaTooltip}>Rota Published</Tooltip>
							</Fragment>
						) : null}
						{(this.state.rotaStatus === STATUSES.EDITED) ? (
							<Fragment>
								<button type="button" title="Publish Rota Changes" id="publish-rota" className="btn btn-nav btn-primary border-0 pl-3 pr-3" disabled={!this.state.enableShiftButton} onClick={this.handlePublishRota}>Publish</button>
								<Tooltip placement="bottom" isOpen={this.state.isPublishRotaTooltipOpen} target="publish-rota" toggle={this.handlePublishRotaTooltip}>Publish Rota Changes</Tooltip>
							</Fragment>
						) : null}
					</ButtonGroup>
					<ButtonGroup className="d-none d-md-inline-block d-lg-none p-0 m-0">
						<button type="button" title="Create Employee" id="create-employee" className="d-inline-block d-lg-none btn btn-nav btn-primary border-0 pl-3 pr-3" onClick={this.handleCreateEmployee}><i className="fa fa-user-plus d-sm-none d-md-inline-block" aria-hidden="true"></i><span className="d-sm-inline-block d-md-none d-lg-inline-block">Create Employee</span></button>
					</ButtonGroup>
					<Tooltip placement="bottom" isOpen={this.state.isCreateEmployeeTooltipOpen} target="create-employee" toggle={this.handleCreateEmployeeTooltip}>Create Employee</Tooltip>
				</Col>
			</Row>
			<Modal title="Create Rota" className="modal-dialog" show={this.state.isCreateRotaModalOpen} onClose={this.handleCreateRota}>
				<RotaForm editMode={false} firstRota={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateRota} />
			</Modal>
			<Modal title="Edit Rota" className="modal-dialog" show={this.state.isEditRotaModalOpen} onClose={this.handleEditRota}>
				<RotaForm rotaId={this.state.rotaId} editMode={true} firstRota={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditRota} />
			</Modal>
			<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={this.handleCreateShift}>
				<ShiftForm overview={false} startDate={moment(this.props.rota.startDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} />
			</Modal>
			<Modal title="Assign Shift" className="modal-dialog" show={this.state.isAssignShiftModalOpen} onClose={this.handleAssignShift}>
				<AssignShiftForm overview={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleAssignShift} handleSwitchFromAssignShiftToCreateShift={this.handleSwitchFromAssignShiftToCreateShift} />
			</Modal>
			<Modal title="Create Employee" className="modal-dialog" show={this.state.isCreateEmployeeModalOpen} onClose={this.handleCreateEmployee}>
				<EmployeeForm editMode={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateEmployee} />
			</Modal>
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
		</Fragment>
	);
}

Toolbar.propTypes = propTypes;

Toolbar.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	week: state.week,
	rota: state.rota,
	rotas: state.rotas,
	shifts: state.shifts,
	rotaCost: state.rotaCost,
	rotaType: state.rotaType,
	rotaTypes: state.rotaTypes,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRota,
		getRotas,
		getShifts,
		copyShifts,
		switchWeek,
		switchRota,
		updateRota,
		deleteRota,
		publishRota,
		getRotaTypes,
		downloadShifts,
		updateSettings,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
