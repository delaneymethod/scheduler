import moment from 'moment';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
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
	weekDate: PropTypes.object.isRequired,
	assignedShifts: PropTypes.array.isRequired,
	unassignedShifts: PropTypes.array.isRequired,
	placementStatus: PropTypes.string.isRequired,
};

const defaultProps = {
	count: 0,
	total: 0,
	past: false,
	weekDate: {},
	assignedShifts: [],
	placementStatus: '',
	unassignedShifts: [],
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
		placementId: '',
		assignedShifts: [],
		unassignedShifts: [],
		isEditShiftModalOpen: false,
		isOverviewPopoverOpen: false,
		isAssignShiftModalOpen: false,
	});

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}
	};

	handleOverview = () => this.setState({ isOverviewPopoverOpen: !this.state.isOverviewPopoverOpen });

	handleCreateShift = event => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleAssignShift = event => this.setState({ isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

	handleSwitchFromAssignShiftToCreateShift = () => this.setState({ isCreateShiftModalOpen: true, isAssignShiftModalOpen: false });

	handleEditShift = (event, shiftId, employeeId, placementId, startDate) => this.setState({
		shiftId,
		startDate,
		employeeId,
		placementId,
		isEditShiftModalOpen: !this.state.isEditShiftModalOpen,
	});

	render = () => ((!this.props.past && this.props.total > 0) ? (
		<Fragment>
			<div className="placements-status p-0 m-0">
				<button type="button" className="btn btn-overview border-0 p-0 m-0 bg-transparent" id={`overview-${moment(this.props.weekDate).format('YYYYMMDD')}`} onClick={this.handleOverview}>
					<div className={`mr-2 p-0 ml-0 mr-0 mb-0 indicator ${this.props.placementStatus}`}></div>
					<div className="p-0 m-0 count">{this.props.count}/{this.props.total}</div>
				</button>
				<Popover placement="bottom" isOpen={this.state.isOverviewPopoverOpen} target={`overview-${moment(this.props.weekDate).format('YYYYMMDD')}`} toggle={this.handleOverview}>
					<PopoverBody>
						<ul className="popover-menu" style={{ minWidth: '264px' }}>
							<li style={{ minWidth: '264px' }}><label className="pt-2 pb-1 m-0">Overview - {moment(this.props.weekDate).format('ddd, Do')}</label></li>
							{this.props.unassignedShifts.map((unassignedShift, unassignedShiftIndex) => (
								<li key={unassignedShiftIndex} className="p-0" style={{ minWidth: '264px' }}>
									<button type="button" className="btn btn-action border-0 p-0 font-weight-normal" id={`unassigned-shift-${unassignedShiftIndex}`} style={{ lineHeight: 'normal', fontSize: '0.7rem' }} onClick={this.handleAssignShift}>
										<div className="d-flex align-items-start pt-1 pl-2 pr-2 pb-1 m-0">
											<div className="d-inline-block p-0 mr-2 mb-0">
												<Avatar name="" round={true} size="27" />
											</div>
											<div className="d-inline-block w-100 p-0 m-0">
												<div className="wrap-words text-right"><span className="pull-left text-left w-50 p-0 ml-0 mt-0 mb-0 mr-1">Unassigned</span> {moment(unassignedShift.startTime).format('HH:mm')} - {(unassignedShift.isClosingShift) ? 'Closing' : moment(unassignedShift.endTime).format('HH:mm')}</div>
												<div className="text-right"><span className="pull-left font-italic text-left w-50 p-0 ml-0 mt-0 mb-0 mr-1">{(!isEmpty(unassignedShift.role)) ? unassignedShift.role.roleName : 'No role assigned'}</span>{(!unassignedShift.isClosingShift) ? `${unassignedShift.hours} ${((unassignedShift.hours === 1) ? 'hr' : 'hrs')}` : null}</div>
											</div>
										</div>
									</button>
								</li>
							))}
							{this.props.assignedShifts.map((assignedShift, assignedShiftIndex) => assignedShift.placements.map((placement, placementIndex) => (
								<li key={`${assignedShiftIndex}_${placementIndex}`} className="p-0" style={{ minWidth: '264px' }}>
									<button type="button" className="btn btn-action border-0 p-0 font-weight-normal" id={`assigned-shift-${assignedShiftIndex}-${placementIndex}`} style={{ lineHeight: 'normal', fontSize: '0.7rem' }} onClick={event => this.handleEditShift(event, assignedShift.shiftId, placement.employee.employeeId, placement.placementId, moment(this.props.weekDate).format('YYYY-MM-DD'))}>
										<div className="d-flex align-items-start pt-1 pl-2 pr-2 pb-1 m-0">
											<div className="d-inline-block p-0 mr-2 mb-0">
												<Avatar name={`${placement.employee.firstName} ${placement.employee.lastName}`} round={true} size="27" />
											</div>
											<div className="d-inline-block w-100 p-0 m-0">
												<div className="wrap-words text-right"><span className="pull-left text-left w-50 p-0 ml-0 mt-0 mb-0 mr-1">{placement.employee.firstName} {placement.employee.lastName}</span> {moment(assignedShift.startTime).format('HH:mm')} - {(assignedShift.isClosingShift) ? 'Closing' : moment(assignedShift.endTime).format('HH:mm')}</div>
												<div className="text-right"><span className="pull-left font-italic text-left w-50 p-0 ml-0 mt-0 mb-0 mr-1">{(!isEmpty(assignedShift.role)) ? assignedShift.role.roleName : 'No role assigned'}</span>{(!assignedShift.isClosingShift) ? `${assignedShift.hours} ${((assignedShift.hours === 1) ? 'hr' : 'hrs')}` : null}</div>
											</div>
										</div>
									</button>
								</li>
							)))}
						</ul>
					</PopoverBody>
				</Popover>
			</div>
			<Modal title="Edit Shift" className="modal-dialog" show={this.state.isEditShiftModalOpen} onClose={event => this.handleEditShift(event, this.state.shiftId, this.state.employeeId, this.state.placementId, moment(this.props.weekDate).format('YYYY-MM-DD'))}>
				<ShiftForm overview={true} editMode={true} shiftId={this.state.shiftId} employeeId={this.state.employeeId} placementId={this.state.placementId} startDate={moment(this.props.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleEditShift(event, this.state.shiftId, this.state.employeeId, this.state.placementId, moment(this.props.weekDate).format('YYYY-MM-DD'))} />
			</Modal>
			<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={event => this.handleCreateShift(event, null, moment(this.props.weekDate).format('YYYY-MM-DD'))}>
				<ShiftForm overview={true} editMode={false} startDate={moment(this.props.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={event => this.handleCreateShift(event, null, moment(this.props.weekDate).format('YYYY-MM-DD'))} />
			</Modal>
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

export default ShiftsOverview;
