import moment from 'moment';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import Notification from './Notification';

import ShiftForm from '../forms/ShiftForm';

import constants from '../../helpers/constants';

import AssignShiftForm from '../forms/AssignShiftForm';

const routes = constants.APP.ROUTES;

const notifications = constants.APP.NOTIFICATIONS;

const propTypes = {
	past: PropTypes.bool.isRequired,
	total: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
	shifts: PropTypes.array.isRequired,
	employees: PropTypes.array.isRequired,
	weekDate: PropTypes.object.isRequired,
	placementStatus: PropTypes.string.isRequired,
};

const defaultProps = {
	count: 0,
	total: 0,
	shifts: [],
	past: false,
	weekDate: {},
	employees: [],
	placementStatus: '',
};

class ShiftsOverview extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleOverview = this.handleOverview.bind(this);

		this.handleEditShift = this.handleEditShift.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleAssignShift = this.handleAssignShift.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleSwitchFromAssignShiftToCreateShift = this.handleSwitchFromAssignShiftToCreateShift.bind(this);
	}

	getInitialState = () => ({
		shiftId: '',
		employeeId: '',
		editMode: false,
		assignedShifts: [],
		unassignedShifts: [],
		isEditShiftModalOpen: false,
		isOverviewPopoverOpen: false,
		isAssignShiftModalOpen: false,
	});

	/* eslint-disable no-param-reassign */
	componentDidMount = () => {
		if (this.props.count > 0) {
			const assignedShifts = this.props.shifts.filter(data => (moment(data.startTime).format('YYYY-MM-DD') === moment(this.props.weekDate).format('YYYY-MM-DD')) && data.placements.length > 0);

			assignedShifts.map((assignedShift) => {
				const hours = moment.duration(moment(assignedShift.endTime).diff(moment(assignedShift.startTime))).asHours();

				/* Round the hours so 10.988888 becomes 11 hours, for example */
				assignedShift.hours = (Math.round(hours * 12) / 12);

				return assignedShift;
			});

			this.setState({ assignedShifts });
		}

		if (this.props.total > 0) {
			const unassignedShifts = this.props.shifts.filter(data => (moment(data.startTime).format('YYYY-MM-DD') === moment(this.props.weekDate).format('YYYY-MM-DD')) && (data.placements === null || data.placements.length === 0));

			unassignedShifts.map((unassignedShift) => {
				const hours = moment.duration(moment(unassignedShift.endTime).diff(moment(unassignedShift.startTime))).asHours();

				/* Round the hours so 10.988888 becomes 11 hours, for example */
				unassignedShift.hours = (Math.round(hours * 12) / 12);

				return unassignedShift;
			});

			this.setState({ unassignedShifts });
		}
		/* eslint-enable no-param-reassign */
	};

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}
	};

	handleEditShift = (event, shiftId, employeeId) => this.setState({
		shiftId,
		employeeId,
		editMode: true,
		isEditShiftModalOpen: !this.state.isEditShiftModalOpen,
	});

	handleOverview = () => this.setState({ isOverviewPopoverOpen: !this.state.isOverviewPopoverOpen });

	handleCreateShift = event => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleAssignShift = event => this.setState({ isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

	handleSwitchFromAssignShiftToCreateShift = () => this.setState({ isCreateShiftModalOpen: true, isAssignShiftModalOpen: false });

	render = () => ((!this.props.past && this.props.total > 0) ? (
		<Fragment>
			<div className="placements-status p-0 m-0">
				<button type="button" className="btn btn-icon border-0 p-0 m-0 bg-transparent" title="View Overview" aria-label="View Overview" id={`overview-${moment(this.props.weekDate).format('YYYYMMDD')}`} onClick={this.handleOverview}>
					<div className={`mr-2 p-0 ml-0 mr-0 mb-0 indicator ${this.props.placementStatus}`}></div>
					<div className="p-0 m-0 count">{this.props.count}/{this.props.total}</div>
				</button>
				<Popover placement="bottom" isOpen={this.state.isOverviewPopoverOpen} target={`overview-${moment(this.props.weekDate).format('YYYYMMDD')}`} toggle={this.handleOverview}>
					<PopoverBody>
						<ul className="popover-menu">
							<li style={{ minWidth: '264px' }}><label className="pt-2 pb-1 m-0">Overview</label></li>
							{this.state.unassignedShifts.map((unassignedShift, unassignedShiftIndex) => (
								<li key={unassignedShiftIndex} className="p-0" style={{ minWidth: '264px' }}>
									<button type="button" title="Assign Shift" className="btn btn-action border-0 p-0 font-weight-normal" style={{ lineHeight: 'normal', fontSize: '0.7rem' }} onClick={this.handleAssignShift}>
										<div className="d-flex align-items-center pt-1 pl-2 pr-2 pb-1 m-0">
											<div className="d-inline-block p-0 mr-2 mb-0">
												<Avatar name="" round={true} size="31" />
											</div>
											<div className="d-inline-block w-100 p-0 m-0">
												<div className="text-truncate text-right"><span className="pull-left font-italic">Unassigned</span> {moment(unassignedShift.startTime).format('HH:mm a')} - {(unassignedShift.isClosingShift) ? 'Closing' : moment(unassignedShift.endTime).format('HH:mm a')}</div>
												<div className="text-right"><span className="pull-left">{unassignedShift.role.roleName}</span> {(!unassignedShift.isClosingShift) ? `${unassignedShift.hours} ${((unassignedShift.hours === 1) ? 'hr' : 'hrs')}` : null}</div>
											</div>
										</div>
									</button>
								</li>
							))}
							{this.state.assignedShifts.map((assignedShift, assignedShiftIndex) => assignedShift.placements.map((placement, placementIndex) => (
								<li key={`${assignedShiftIndex}_${placementIndex}`} className="p-0" style={{ minWidth: '264px' }}>
									<button type="button" title="Edit Shift" className="btn btn-action border-0 p-0 font-weight-normal" style={{ lineHeight: 'normal', fontSize: '0.7rem' }} onClick={event => this.handleEditShift(event, assignedShift.shiftId, placement.employee.employeeId)}>
										<div className="d-flex align-items-center pt-1 pl-2 pr-2 pb-1 m-0">
											<div className="d-inline-block p-0 mr-2 mb-0">
												<Avatar name={`${placement.employee.firstName} ${placement.employee.lastName}`} round={true} size="31" />
											</div>
											<div className="d-inline-block w-100 p-0 m-0">
												<div className="text-truncate text-right"><span className="pull-left">{placement.employee.firstName} {placement.employee.lastName}</span> {moment(assignedShift.startTime).format('HH:mm a')} - {(assignedShift.isClosingShift) ? 'Closing' : moment(assignedShift.endTime).format('HH:mm a')}</div>
												<div className="text-right"><span className="pull-left">{assignedShift.role.roleName}</span> {(!assignedShift.isClosingShift) ? `${assignedShift.hours} ${((assignedShift.hours === 1) ? 'hr' : 'hrs')}` : null}</div>
											</div>
										</div>
									</button>
								</li>
							)))}
						</ul>
					</PopoverBody>
				</Popover>
			</div>
			{(this.state.editMode) ? (
				<Modal title="Edit Shift" className="modal-dialog" show={this.state.isEditShiftModalOpen} onClose={event => this.handleEditShift(event, this.state.employeeId, moment(this.props.weekDate).format('YYYY-MM-DD'))}>
					<ShiftForm editMode={true} shiftId={this.state.shiftId} employeeId={this.state.employeeId} startDate={moment(this.props.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleEditShift(event, this.state.employeeId, moment(this.props.weekDate).format('YYYY-MM-DD'))} />
				</Modal>
			) : (
				<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={event => this.handleCreateShift(event, null, moment(this.props.weekDate).format('YYYY-MM-DD'))}>
					<ShiftForm editMode={false} startDate={moment(this.props.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleCreateShift(event, null, moment(this.props.weekDate).format('YYYY-MM-DD'))} />
				</Modal>
			)}
			<Modal title="Assign Shift" className="modal-dialog" show={this.state.isAssignShiftModalOpen} onClose={event => this.handleAssignShift(event, this.state.employeeId, moment(this.props.weekDate).format('YYYY-MM-DD'))}>
				<AssignShiftForm startDate={moment(this.props.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleAssignShift(event, this.state.employeeId, moment(this.props.weekDate).format('YYYY-MM-DD'))} handleSwitchFromAssignShiftToCreateShift={this.handleSwitchFromAssignShiftToCreateShift} />
			</Modal>
		</Fragment>
	) : (
		<div className="placements-status p-0 m-0">
			<div className={`mr-2 p-0 ml-0 mr-0 mb-0 indicator ${this.props.placementStatus}`}></div>
			<div className="p-0 m-0 count">{this.props.count}/{this.props.total}</div>
		</div>
	));
}

ShiftsOverview.propTypes = propTypes;

ShiftsOverview.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	shifts: state.shifts,
	employees: state.employees,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShiftsOverview);
