import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { delay, orderBy, isEmpty, includes, debounce } from 'lodash';
import { Col, Row, Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import RotaForm from '../forms/RotaForm';

import RoleForm from '../forms/RoleForm';

import ShiftForm from '../forms/ShiftForm';

import confirm from '../../helpers/confirm';

import constants from '../../helpers/constants';

import CloseButton from '../common/CloseButton';

import Notification from '../common/Notification';

import AssignShiftForm from '../forms/AssignShiftForm';

import { switchWeek } from '../../actions/weekActions';

import { getShifts } from '../../actions/shiftActions';

import { updateSettings } from '../../actions/settingActions';

import { getRotas, switchRota, updateRota } from '../../actions/rotaActions';

import { getRotaTypes, switchRotaType } from '../../actions/rotaTypeActions';

const routes = constants.APP.ROUTES;

const { STATUSES } = routes.ROTAS;

const dashboard = routes.DASHBOARD;

const notifications = constants.APP.NOTIFICATIONS;

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

		this.handleEditRota = this.handleEditRota.bind(this);

		this.handleCreateRole = this.handleCreateRole.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleAssignShift = this.handleAssignShift.bind(this);

		this.handlePublishRota = this.handlePublishRota.bind(this);

		this.handleRotaTypeMenu = this.handleRotaTypeMenu.bind(this);

		this.handleSwitchRotaType = this.handleSwitchRotaType.bind(this);

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
		isCreateRotaModalOpen: false,
		isCreateRoleModalOpen: false,
		isCreateShiftModalOpen: false,
		isAssignShiftModalOpen: false,
		hasRotaUnassignedShifts: false,
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
				const { rota, rotaType: { rotaTypeId }, actions } = this.props;

				let { startDate } = rota;

				const { rotaId, budget } = rota;

				const status = STATUSES.PUBLISHED;

				startDate = moment(startDate).format('YYYY-MM-DD');

				const payload = {
					rotaId,
					budget,
					status,
					startDate,
					rotaTypeId,
				};

				console.log('Called Toolbar handleSwitchRota updateRota');
				console.log('Called Toolbar handleSwitchRota switchRota');
				actions.updateRota(payload)
					/* We switch the rota again even though its not really updating anything related to it - e.g week, shifts, first day of week etc. Only change is the status which we need to reflect below hence this call. */
					.then((updatedRota) => {
						actions.switchRota(updatedRota);

						/* FIXME - Make messages constant */
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

	handleEditRota = (event, rotaId) => this.setState({ rotaId, isEditRotaModalOpen: !this.state.isEditRotaModalOpen });

	handleCreateRota = () => this.setState({ isCreateRotaModalOpen: !this.state.isCreateRotaModalOpen });

	handleCreateRole = () => this.setState({ isCreateRoleModalOpen: !this.state.isCreateRoleModalOpen });

	handleCreateShift = (event, startDate) => this.setState({ startDate, isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleAssignShift = (event, startDate) => this.setState({ startDate, isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

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

		/* FIXME - Make messages constant */
		/* If the message has come from deleting a rota, we need to redirect back to dashboard to reload all data again */
		if (message === '<p>Rota was deleted!</p>') {
			this.props.history.push(routes.DASHBOARD.HOME.URI);
		}
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen }, () => ((!this.state.isErrorModalOpen) ? this.props.history.push(routes.DASHBOARD.HOME.URI) : null));

	render = () => (
		<Fragment>
			<Row>
				<Col className="pt-3 pb-0 pt-sm-3 pb-ms-3 text-center text-md-left" xs="12" sm="12" md="5" lg="4" xl="4">
					<button type="button" className="btn btn-rotas-popover text-dark border-0 col-12 col-sm-auto" id="rotaTypeMenu" title="Toggle Rotas" aria-label="Toggle Rotas" onClick={this.handleRotaTypeMenu}>{this.props.rotaType.rotaTypeName}<i className="pl-2 fa fa-fw fa-chevron-down" aria-hidden="true"></i></button>
					<Popover placement="bottom" isOpen={this.state.isRotaTypeMenuPopoverOpen} target="rotaTypeMenu" toggle={this.handleRotaTypeMenu}>
						<PopoverBody>
							<ul className="popover-menu">
								{(this.props.rotaTypes.length > 0) ? this.props.rotaTypes.map((rotaType, index) => (<li key={index}><button type="button" title={rotaType.rotaTypeName} className="btn btn-action btn-nav border-0 text-truncate" id={rotaType.rotaTypeId} onClick={this.handleSwitchRotaType}>{rotaType.rotaTypeName}</button></li>)) : null}
								<li><button type="button" title="Add New Rota" className="btn btn-primary btn-nav border-0" onClick={this.handleCreateRota}>Add New Rota</button></li>
							</ul>
						</PopoverBody>
					</Popover>
				</Col>
				<Col className="pt-3 pb-3 pt-sm-3 pb-ms-3 text-center text-md-right" xs="12" sm="12" md="7" lg="8" xl="8">
					{(this.state.employeesIsActive || this.state.overviewIsActive) ? (
						<Fragment>
							{(this.state.hasUnassignedShifts) ? (
								<button type="button" title="Assign Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-4 pr-4 border-0" disabled={!this.state.enableShiftButton} onClick={event => this.handleAssignShift(event, '')}><i className="pr-2 fa fa-fw fa-plus d-sm-inline-block d-md-none d-lg-inline-block" aria-hidden="true"></i>Assign Shift</button>
							) : (
								<button type="button" title="Create Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-4 pr-4 border-0" disabled={!this.state.enableShiftButton} onClick={event => this.handleCreateShift(event, moment().format('YYYY-MM-DD'))}><i className="pr-2 fa fa-fw fa-plus d-sm-inline-block d-md-none d-lg-inline-block" aria-hidden="true"></i>Create Shift</button>
							)}
						</Fragment>
					) : (
						<button type="button" title="Create Shift" className="btn btn-nav btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 mb-md-0 pl-4 pr-4 pl-md-4 pr-md-4 border-0" disabled={!this.state.enableShiftButton} onClick={this.handleCreateShift}><i className="pr-2 fa fa-fw fa-plus d-sm-inline-block d-md-none d-lg-inline-block" aria-hidden="true"></i>Create Shift</button>
					)}
					{(this.state.rotaStatus === STATUSES.DRAFT) ? (
						<button type="button" title="Publish Rota" className="btn btn-nav btn-primary col-12 col-sm-auto pl-4 pr-4 pl-md-4 pr-md-4 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled={!this.state.enableShiftButton} onClick={this.handlePublishRota}>Publish</button>
					) : null}
					{(this.state.rotaStatus === STATUSES.PUBLISHED) ? (
						<button type="button" title="Rota Published" className="btn btn-nav btn-primary col-12 col-sm-auto pl-4 pr-4 pl-md-4 pr-md-4 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled>Publish</button>
					) : null}
					{(this.state.rotaStatus === STATUSES.EDITED) ? (
						<button type="button" title="Publish Rota Changes" className="btn btn-nav btn-primary col-12 col-sm-auto pl-4 pr-4 ml-sm-3 mb-3 mb-sm-0 mb-md-0 border-0" disabled={!this.state.enableShiftButton} onClick={this.handlePublishRota}>Publish Changes</button>
					) : null}
					<button type="button" title="Edit Rota" className="btn btn-rotas-popover text-dark border-0 col-12 col-sm-auto pl-4 pr-4 ml-sm-3 mb-3 mb-sm-0 mt-md-0" onClick={event => this.handleEditRota(event, this.props.rota.rotaId)}>Edit</button>
					<button type="button" title="Rota Budget" className="btn bg-white text-dark col-12 col-sm-auto pl-4 pr-4 ml-sm-3 mb-sm-0 mb-md-0 border-0"><span className="d-sm-inline-block d-md-none d-lg-inline-block">Budget:&nbsp;</span>&pound;{this.state.rotaBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</button>
				</Col>
			</Row>
			<Modal title="Create Rota" className="modal-dialog" show={this.state.isCreateRotaModalOpen} onClose={this.handleCreateRota}>
				<RotaForm editMode={false} firstRota={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateRota} />
			</Modal>
			<Modal title="Edit Rota" className="modal-dialog" show={this.state.isEditRotaModalOpen} onClose={this.handleEditRota}>
				<RotaForm rotaId={this.state.rotaId} editMode={true} firstRota={false} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditRota} />
			</Modal>
			<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={event => this.handleCreateShift(event, this.state.startDate)}>
				<ShiftForm startDate={this.state.startDate} roleName={this.state.roleName} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleCreateShift(event, this.state.startDate)} handleSwitchFromSelectRoleToCreateRole={this.handleSwitchFromSelectRoleToCreateRole} />
			</Modal>
			<Modal title="Assign Shift" className="modal-dialog" show={this.state.isAssignShiftModalOpen} onClose={event => this.handleAssignShift(event, this.state.startDate)}>
				<AssignShiftForm startDate={this.state.startDate} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleAssignShift(event, this.state.startDate)} handleSwitchFromAssignShiftToCreateShift={this.handleSwitchFromAssignShiftToCreateShift} />
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
		getRotas,
		getShifts,
		switchWeek,
		switchRota,
		updateRota,
		getRotaTypes,
		updateSettings,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
