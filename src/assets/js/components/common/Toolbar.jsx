import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import { saveAs } from 'file-saver/FileSaver';
import React, { Fragment, Component } from 'react';
import { delay, orderBy, isEmpty, includes, debounce } from 'lodash';
import { Col, Row, Tooltip, Button, Popover, ButtonGroup, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import config from '../../helpers/config';

import RotaForm from '../forms/RotaForm';

import RoleForm from '../forms/RoleForm';

import ShiftForm from '../forms/ShiftForm';

import confirm from '../../helpers/confirm';

import CloseButton from '../common/CloseButton';

import Notification from '../common/Notification';

import AssignShiftForm from '../forms/AssignShiftForm';

import { switchWeek } from '../../actions/weekActions';

import { updateSettings } from '../../actions/settingActions';

import { getShifts, downloadShifts } from '../../actions/shiftActions';

import { getRotaTypes, switchRotaType } from '../../actions/rotaTypeActions';

import { getRota, getRotas, switchRota, updateRota, publishRota } from '../../actions/rotaActions';

const routes = config.APP.ROUTES;

const { STATUSES } = routes.ROTAS;

const dashboard = routes.DASHBOARD;

const notifications = config.APP.NOTIFICATIONS;

const propTypes = {
	week: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	shifts: PropTypes.array.isRequired,
	rotaType: PropTypes.object.isRequired,
	rotaTypes: PropTypes.array.isRequired,
};

const defaultProps = {
	week: {},
	rota: {},
	rotas: [],
	shifts: [],
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

		this.handleCreateRole = this.handleCreateRole.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleAssignShift = this.handleAssignShift.bind(this);

		this.handlePublishRota = this.handlePublishRota.bind(this);

		this.handleDownloadRota = this.handleDownloadRota.bind(this);

		this.handleRotaTypeMenu = this.handleRotaTypeMenu.bind(this);

		this.handleSwitchRotaType = this.handleSwitchRotaType.bind(this);

		this.handleEditRotaTooltip = this.handleEditRotaTooltip.bind(this);

		this.handleRotaBudgetTooltip = this.handleRotaBudgetTooltip.bind(this);

		this.handleDownloadRotaTooltip = this.handleDownloadRotaTooltip.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleSwitchFromSelectRoleToCreateRole = this.handleSwitchFromSelectRoleToCreateRole.bind(this);

		this.handleSwitchFromAssignShiftToCreateShift = this.handleSwitchFromAssignShiftToCreateShift.bind(this);
	}

	getInitialState = () => ({
		error: {},
		rotaId: '',
		roleName: '',
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
		isCreateRoleModalOpen: false,
		isCreateShiftModalOpen: false,
		isAssignShiftModalOpen: false,
		isRotaBudgetTooltipOpen: false,
		hasRotaUnassignedShifts: false,
		isDownloadRotaTooltipOpen: false,
		isRotaTypeMenuPopoverOpen: false,
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

	/* If we close the modal, reset the role name state. If the user hasnt saved, but reopens the modal, we want the correct value - not the state value */
	componentWillUnmount = () => this.setState({ roleName: '' });

	handleGetRota = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		console.log('Called Toolbar handleGetRota getRota');
		console.log('Called Toolbar handleGetRota switchRota');
		return actions.getRota(payload)
			.then(rota => actions.switchRota(rota))
			.catch(error => Promise.reject(error));
	};

	handleGetRotas = () => {
		const { actions, rotaType: { rotaTypeId } } = this.props;

		const payload = {
			rotaTypeId,
		};

		console.log('Called Toolbar handleGetRotas getRotas');
		return actions.getRotas(payload).catch(error => Promise.reject(error));
	};

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		console.log('Called Toolbar handleGetShifts getShifts');
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
				console.log('Called Toolbar handleSwitchRotaType switchRotaType');
				actions.switchRotaType(rotaType).then(() => {
					console.log('Called Toolbar handleSwitchRotaType getRotas');
					actions.getRotas(rotaType)
						.then(() => {
							/* We only want to get the rota matching the current week so we have some data by default */
							let rota = this.props.rotas.filter(data => moment(data.startDate).format('YYYY-MM-DD') === moment(this.props.week.startDate).format('YYYY-MM-DD')).shift();

							/* No rotas match the current week so lets use the first rota we find */
							if (isEmpty(rota)) {
								rota = orderBy(this.props.rotas, 'startDate').shift();
							}

							console.log('Called Toolbar handleSwitchRotaType switchRota');
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
								console.log('Called Toolbar handleSwitchRotaType switchWeek');
								actions.switchWeek(payload).then(() => {
									/* Get shifts for current rota */
									console.log('Called Toolbar handleSwitchRotaType getShifts');
									actions.getShifts(rota)
										.then(() => {
											payload = {
												firstDayOfWeek,
											};

											/* Set the day of week based on start date */
											console.log('Called Toolbar handleSwitchRotaType updateSettings');
											actions.updateSettings(payload);

											console.log('Called Toolbar handleSwitchRotaType firstDayOfWeek:', firstDayOfWeek);
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

				console.log('Called Toolbar handleSwitchRota publishRota');
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

	handleCreateRota = () => this.setState({ isCreateRotaModalOpen: !this.state.isCreateRotaModalOpen });

	handleCreateRole = () => this.setState({ isCreateRoleModalOpen: !this.state.isCreateRoleModalOpen });

	handleEditRotaTooltip = () => this.setState({ isEditRotaTooltipOpen: !this.state.isEditRotaTooltipOpen });

	handleRotaBudgetTooltip = () => this.setState({ isRotaBudgetTooltipOpen: !this.state.isRotaBudgetTooltipOpen });

	handleDownloadRotaTooltip = () => this.setState({ isDownloadRotaTooltipOpen: !this.state.isDownloadRotaTooltipOpen });

	handleEditRota = (event, rotaId) => this.setState({ rotaId, isEditRotaModalOpen: !this.state.isEditRotaModalOpen });

	handleCreateShift = () => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleAssignShift = () => this.setState({ isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

	handleRotaTypeMenu = () => this.setState({ isRotaTypeMenuPopoverOpen: !this.state.isRotaTypeMenuPopoverOpen });

	handleSwitchFromSelectRoleToCreateRole = roleName => this.setState({ roleName, isCreateRoleModalOpen: !this.state.isCreateRoleModalOpen, isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

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
				<Col className="pt-3 pb-0 pt-sm-3 pb-ms-3 text-center text-md-left" xs="12" sm="12" md="4" lg="4" xl="4">
					<button type="button" className="btn btn-rotas-popover text-dark border-0 col-12 col-sm-auto" id="rotaTypeMenu" title="Toggle Rotas" aria-label="Toggle Rotas" onClick={this.handleRotaTypeMenu}>{this.props.rotaType.rotaTypeName}<i className="pl-2 fa fa-fw fa-chevron-down" aria-hidden="true"></i></button>
					<Popover placement="bottom" isOpen={this.state.isRotaTypeMenuPopoverOpen} target="rotaTypeMenu" toggle={this.handleRotaTypeMenu}>
						<PopoverBody>
							<ul className="popover-menu">
								{(this.props.rotaTypes.length > 0) ? orderBy(this.props.rotaTypes, 'rotaTypeName').map((rotaType, index) => (<li key={index}><button type="button" title={rotaType.rotaTypeName} className="btn btn-action btn-nav border-0 text-truncate" id={rotaType.rotaTypeId} onClick={this.handleSwitchRotaType}>{rotaType.rotaTypeName}</button></li>)) : null}
								<li><button type="button" title="Add New Rota" className="btn btn-primary btn-nav border-0" onClick={this.handleCreateRota}>Add New Rota</button></li>
							</ul>
						</PopoverBody>
					</Popover>
				</Col>
				<Col className="pt-3 pb-3 pt-sm-3 pb-ms-3 text-center text-md-right" xs="12" sm="12" md="8" lg="8" xl="8">
					{(this.state.employeesIsActive || this.state.overviewIsActive) ? (
						<Fragment>
							{(this.state.hasUnassignedShifts) ? (
								<button type="button" title="Assign Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-4 pr-4 border-0" disabled={!this.state.enableShiftButton} onClick={this.handleAssignShift}><i className="pr-2 fa fa-fw fa-plus d-sm-inline-block d-md-none d-lg-inline-block" aria-hidden="true"></i>Assign Shift</button>
							) : (
								<button type="button" title="Create Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-4 pr-4 border-0" disabled={!this.state.enableShiftButton} onClick={this.handleCreateShift}><i className="pr-2 fa fa-fw fa-plus d-sm-inline-block d-md-none d-lg-inline-block" aria-hidden="true"></i>Create Shift</button>
							)}
						</Fragment>
					) : (
						<button type="button" title="Create Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-4 pr-4 pl-md-4 pr-md-4 border-0" disabled={!this.state.enableShiftButton} onClick={this.handleCreateShift}><i className="pr-2 fa fa-fw fa-plus d-sm-inline-block d-md-none d-lg-inline-block" aria-hidden="true"></i>Create Shift</button>
					)}
					{(this.state.rotaStatus === STATUSES.DRAFT) ? (
						<button type="button" title="Publish Rota" className="btn btn-nav btn-primary col-12 col-sm-auto pl-4 pr-4 pl-md-4 pr-md-4 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled={!this.state.enableShiftButton} onClick={this.handlePublishRota}>Publish<span className="d-sm-inline-block d-md-none d-lg-inline-block">&nbsp;Rota</span></button>
					) : null}
					{(this.state.rotaStatus === STATUSES.PUBLISHED) ? (
						<button type="button" title="Rota Published" className="btn btn-nav btn-primary col-12 col-sm-auto pl-4 pr-4 pl-md-4 pr-md-4 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled>Publish<span className="d-sm-inline-block d-md-none d-lg-inline-block">&nbsp;Rota</span></button>
					) : null}
					{(this.state.rotaStatus === STATUSES.EDITED) ? (
						<button type="button" title="Publish Rota Changes" className="btn btn-nav btn-primary col-12 col-sm-auto pl-4 pr-4 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled={!this.state.enableShiftButton} onClick={this.handlePublishRota}>Publish<span className="d-sm-inline-block d-md-none d-lg-inline-block">&nbsp;Rota&nbsp;</span>Changes</button>
					) : null}
					<ButtonGroup className="d-none d-sm-inline-block p-0 pl-sm-3 pl-md-3 pl-lg-3 pl-xl-3 m-0">
						<button type="button" title="Download Rota" id="download-rota" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3" onClick={event => this.handleDownloadRota(event, this.props.rota.rotaId)}><i className="fa fa-fw fa-cloud-download" aria-hidden="true"></i></button>
						<button type="button" title="Edit Rota" id="edit-rota" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3" onClick={event => this.handleEditRota(event, this.props.rota.rotaId)}><i className="fa fa-fw fa-pencil" aria-hidden="true"></i></button>
						<button type="button" title="Rota Budget" id="rota-budget" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3" style={{ cursor: 'default' }}>&pound;{this.state.rotaBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</button>
					</ButtonGroup>
					<div className="d-block d-sm-none">
						<button type="button" title="Download Rota" id="download-rota" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3 col-12 col-sm-auto mb-3" onClick={event => this.handleDownloadRota(event, this.props.rota.rotaId)}><i className="fa fa-fw fa-cloud-download" aria-hidden="true"></i> Download Rota</button>
						<button type="button" title="Edit Rota" id="edit-rota" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3 col-12 col-sm-auto mb-3" onClick={event => this.handleEditRota(event, this.props.rota.rotaId)}><i className="fa fa-fw fa-pencil" aria-hidden="true"></i> Edit Rota</button>
						<button type="button" title="Rota Budget" id="rota-budget" className="btn btn-rotas-popover text-dark border-0 pl-3 pr-3 col-12 col-sm-auto mb-0" style={{ cursor: 'default' }}>Rota Budget: &pound;{this.state.rotaBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</button>
					</div>
					<Tooltip placement="bottom" isOpen={this.state.isDownloadRotaTooltipOpen} target="download-rota" toggle={this.handleDownloadRotaTooltip}>Creates a PDF of the current Rota</Tooltip>
					<Tooltip placement="bottom" isOpen={this.state.isEditRotaTooltipOpen} target="edit-rota" toggle={this.handleEditRotaTooltip}>Edit the current Rota</Tooltip>
					<Tooltip placement="bottom" isOpen={this.state.isRotaBudgetTooltipOpen} target="rota-budget" toggle={this.handleRotaBudgetTooltip}>Rota&#39;s Budget</Tooltip>
				</Col>
			</Row>
			<Modal title="Create Rota" className="modal-dialog" show={this.state.isCreateRotaModalOpen} onClose={this.handleCreateRota}>
				<RotaForm editMode={false} firstRota={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateRota} />
			</Modal>
			<Modal title="Edit Rota" className="modal-dialog" show={this.state.isEditRotaModalOpen} onClose={this.handleEditRota}>
				<RotaForm rotaId={this.state.rotaId} editMode={true} firstRota={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditRota} />
			</Modal>
			<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={this.handleCreateShift}>
				<ShiftForm startDate={moment(this.props.rota.startDate).format('YYYY-MM-DD')} roleName={this.state.roleName} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} handleSwitchFromSelectRoleToCreateRole={this.handleSwitchFromSelectRoleToCreateRole} />
			</Modal>
			<Modal title="Assign Shift" className="modal-dialog" show={this.state.isAssignShiftModalOpen} onClose={this.handleAssignShift}>
				<AssignShiftForm handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleAssignShift} handleSwitchFromAssignShiftToCreateShift={this.handleSwitchFromAssignShiftToCreateShift} />
			</Modal>
			<Modal title="Create Role" className="modal-dialog" show={this.state.isCreateRoleModalOpen} onClose={this.handleSwitchFromSelectRoleToCreateRole}>
				<RoleForm handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleSwitchFromSelectRoleToCreateRole} />
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
	rotaType: state.rotaType,
	rotaTypes: state.rotaTypes,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRota,
		getRotas,
		getShifts,
		switchWeek,
		switchRota,
		updateRota,
		publishRota,
		getRotaTypes,
		downloadShifts,
		updateSettings,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
