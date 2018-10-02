import moment from 'moment';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import config from '../../helpers/config';

import Notification from './Notification';

import ShiftForm from '../forms/ShiftForm';

import AssignShiftForm from '../forms/AssignShiftForm';

const routes = config.APP.ROUTES;

const notifications = config.APP.NOTIFICATIONS;

const propTypes = {
	past: PropTypes.bool.isRequired,
	weekDate: PropTypes.object.isRequired,
	unassignedShifts: PropTypes.array.isRequired,
};

const defaultProps = {
	past: false,
	weekDate: {},
	unassignedShifts: [],
};

class UnassignedShiftsOverview extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleOverview = this.handleOverview.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleAssignShift = this.handleAssignShift.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleSwitchFromAssignShiftToCreateShift = this.handleSwitchFromAssignShiftToCreateShift.bind(this);
	}

	getInitialState = () => ({
		shiftId: '',
		unassignedShifts: [],
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

	handleCreateShift = () => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleAssignShift = (event, shiftId) => this.setState({ shiftId, isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

	handleSwitchFromAssignShiftToCreateShift = () => this.setState({ isCreateShiftModalOpen: true, isAssignShiftModalOpen: false });

	render = () => ((!this.props.past) ? (
		<Fragment>
			<div className="p-2 p-lg-1 pl-lg-2 pr-lg-2 mb-2 mb-lg-1 d-block text-left font-weight-bold shift wrap-words" id={`unassigned-overview-${moment(this.props.weekDate).format('YYYYMMDD')}`} onClick={this.handleOverview}>{this.props.unassignedShifts.length} Unassigned<br />Shift{(this.props.unassignedShifts.length === 1) ? '' : 's'}</div>
			<Popover placement="bottom" isOpen={this.state.isOverviewPopoverOpen} target={`unassigned-overview-${moment(this.props.weekDate).format('YYYYMMDD')}`} toggle={this.handleOverview}>
				<PopoverBody>
					<ul className="popover-menu" style={{ minWidth: '264px' }}>
						<li style={{ minWidth: '264px' }}><label className="pt-2 pb-1 m-0">Overview - {moment(this.props.weekDate).format('ddd, Do')}</label></li>
						{(this.props.unassignedShifts.length > 0) ? (<li style={{ minWidth: '264px' }}>Unassigned Shifts</li>) : null}
						{sortBy(this.props.unassignedShifts, ['startTime', 'endTime']).map((unassignedShift, unassignedShiftIndex) => (
							<li key={unassignedShiftIndex} className="p-0" style={{ minWidth: '264px' }}>
								<button type="button" className="btn btn-action border-0 p-0 font-weight-normal" id={`unassigned-shift-${unassignedShiftIndex}`} style={{ lineHeight: 'normal', fontSize: '0.7rem' }} onClick={event => this.handleAssignShift(event, unassignedShift.shiftId)}>
									<div className="d-flex align-items-start pt-1 pl-2 pr-2 pb-1 m-0">
										<div className="d-inline-block p-0 mr-2 mb-0">
											<Avatar name="" textSizeRatio={3} color="#1CA3AE" fgColor="#ffffff" round={true} size="27" />
										</div>
										<div className="d-inline-block w-100 p-0 m-0">
											<div className="wrap-words text-right"><span className="pull-left text-left w-50 p-0 ml-0 mt-0 mb-0 mr-1">Unassigned</span> {moment(unassignedShift.startTime).format('HH:mm')} - {(unassignedShift.isClosingShift) ? 'Closing' : moment(unassignedShift.endTime).format('HH:mm')}</div>
											<div className="text-right"><span className="pull-left font-italic text-left w-50 p-0 ml-0 mt-0 mb-0 mr-1">{(!isEmpty(unassignedShift.role)) ? unassignedShift.role.roleName : 'No role assigned'}</span>{(!unassignedShift.isClosingShift) ? `${unassignedShift.hours} ${((unassignedShift.hours === 1) ? 'hr' : 'hrs')}` : null}</div>
										</div>
									</div>
								</button>
							</li>
						))}
					</ul>
				</PopoverBody>
			</Popover>
			<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={this.handleCreateShift}>
				<ShiftForm overview={true} editMode={false} startDate={moment(this.props.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} />
			</Modal>
			<Modal title="Assign Shift" className="modal-dialog" show={this.state.isAssignShiftModalOpen} onClose={this.handleAssignShift}>
				<AssignShiftForm overview={true} shiftId={this.state.shiftId} startDate={moment(this.props.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleAssignShift} handleSwitchFromAssignShiftToCreateShift={this.handleSwitchFromAssignShiftToCreateShift} />
			</Modal>
		</Fragment>
	) : (
		<div className="p-2 p-lg-1 pl-lg-2 pr-lg-2 mb-2 mb-lg-1 d-block text-left font-weight-bold shift past wrap-words" id={`unassigned-overview-${moment(this.props.weekDate).format('YYYYMMDD')}`}>{this.props.unassignedShifts.length} Unassigned<br />Shift{(this.props.unassignedShifts.length === 1) ? '' : 's'}</div>
	));
}

UnassignedShiftsOverview.propTypes = propTypes;

UnassignedShiftsOverview.defaultProps = defaultProps;

export default UnassignedShiftsOverview;
