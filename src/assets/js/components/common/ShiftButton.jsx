import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import config from '../../helpers/config';

import ShiftForm from '../forms/ShiftForm';

import CloseButton from '../common/CloseButton';

import Notification from '../common/Notification';

import AssignShiftForm from '../forms/AssignShiftForm';

const notifications = config.APP.NOTIFICATIONS;

const propTypes = {
	id: PropTypes.string.isRequired,
	past: PropTypes.bool.isRequired,
	unassigned: PropTypes.bool.isRequired,
	shiftPlacement: PropTypes.object.isRequired,
};

const defaultProps = {
	id: '',
	past: false,
	unassigned: false,
	shiftPlacement: {},
};

class ShiftButton extends Component {
	constructor(props) {
		super(props);

		this.toastId = null;

		this.state = this.getInitialState();

		this.handleShiftMenu = this.handleShiftMenu.bind(this);

		this.handleEditShift = this.handleEditShift.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleAssignShift = this.handleAssignShift.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);

		this.handleSwitchFromAssignShiftToCreateShift = this.handleSwitchFromAssignShiftToCreateShift.bind(this);
	}

	getInitialState = () => ({
		editMode: false,
		isShiftPopoverOpen: false,
		isEditShiftModalOpen: false,
		isCreateShiftModalOpen: false,
		isAssignShiftModalOpen: false,
	});

	handleShiftMenu = () => this.setState({ isShiftPopoverOpen: !this.state.isShiftPopoverOpen });

	handleEditShift = () => this.setState({ isEditShiftModalOpen: !this.state.isEditShiftModalOpen });

	handleCreateShift = () => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleAssignShift = () => this.setState({ isAssignShiftModalOpen: !this.state.isAssignShiftModalOpen });

	handleSwitchFromAssignShiftToCreateShift = () => this.setState({ isCreateShiftModalOpen: true, isAssignShiftModalOpen: false });

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}
	};

	render = () => (
		<Fragment>
			{(!this.props.past) ? (
				<Fragment>
					<div className="p-2 p-lg-1 pl-lg-2 pr-lg-2 mb-2 mb-lg-1 d-block text-left font-weight-light shift" draggable="true" id={this.props.id} data-shift-id={this.props.shiftPlacement.shiftId} data-placement-id={this.props.shiftPlacement.placementId} onClick={this.handleShiftMenu}>
						{(this.props.unassigned) ? (
							<Fragment>
								<div className="shift__data-row d-block font-weight-bold text-truncate"><strong>{(this.props.shiftPlacement.role ? this.props.shiftPlacement.role.roleName : '')}</strong> {this.props.shiftPlacement.hours} {((this.props.shiftPlacement.hours === 1) ? 'hr' : 'hrs')}</div>
								<div className="shift__data-row d-block text-truncate">{moment(this.props.shiftPlacement.startTime).format('HH:mm')} - {(this.props.shiftPlacement.isClosingShift) ? 'Closing' : moment(this.props.shiftPlacement.endTime).format('HH:mm')}</div>
							</Fragment>
						) : (
							<Fragment>
								<div className="shift__data-row d-block font-weight-bold text-truncate"><strong>{this.props.shiftPlacement.roleName}</strong> {this.props.shiftPlacement.hours} {((this.props.shiftPlacement.hours === 1) ? 'hr' : 'hrs')}</div>
								<div className="shift__data-row d-block text-truncate">{moment(this.props.shiftPlacement.startTime).format('HH:mm')} - {(this.props.shiftPlacement.isClosingShift) ? 'Closing' : moment(this.props.shiftPlacement.endTime).format('HH:mm')}</div>
							</Fragment>
						)}
					</div>
					<Popover placement="right" isOpen={this.state.isShiftPopoverOpen} target={this.props.id} toggle={this.handleShiftMenu}>
						<PopoverBody>
							<div className="cell-popover">
								{(this.props.unassigned) ? (
									<button type="button" title="Assign Shift" id="assignShift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleAssignShift}>Assign Shift</button>
								) : (
									<Fragment>
										<button type="button" title="Edit Shift" id="editShift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleEditShift}>Edit Shift</button>
										<button type="button" title="Create Shift" id="createShift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleCreateShift}><i className="pr-2 fa fa-fw fa-plus" aria-hidden="true"></i>Create Shift</button>
									</Fragment>
								)}
							</div>
						</PopoverBody>
					</Popover>
					<Modal title="Edit Shift" className="modal-dialog" show={this.state.isEditShiftModalOpen} onClose={this.handleEditShift}>
						<ShiftForm overview={false} editMode={true} shiftId={this.props.shiftPlacement.shiftId} employeeId={this.props.shiftPlacement.employeeId} placementId={this.props.shiftPlacement.placementId} startDateClone={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} startDate={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditShift} />
					</Modal>
					<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={this.handleCreateShift}>
						<ShiftForm overview={false} editMode={false} employeeId={this.props.shiftPlacement.employeeId} startDate={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} />
					</Modal>
				</Fragment>
			) : (
				<div className="p-2 p-lg-1 pl-lg-2 pr-lg-2 mb-2 mb-lg-1 d-block text-left shift" draggable="true" id={this.props.id} data-shift-id={this.props.shiftPlacement.shiftId} data-placement-id={this.props.shiftPlacement.placementId}>
					<div className="shift__data-row d-block font-weight-bold text-truncate"><strong>{this.props.shiftPlacement.roleName}</strong> {(!this.props.shiftPlacement.isClosingShift) ? `(${this.props.shiftPlacement.hours} ${((this.props.shiftPlacement.hours === 1) ? 'hr' : 'hrs')})` : null}</div>
					<div className="shift__data-row d-block text-truncate">{moment(this.props.shiftPlacement.startTime).format('HH:mm')} - {(this.props.shiftPlacement.isClosingShift) ? 'Closing' : moment(this.props.shiftPlacement.endTime).format('HH:mm')}</div>
				</div>
			)}
			{(this.props.unassigned) ? (
				<Modal title="Assign Shift" className="modal-dialog" show={this.state.isAssignShiftModalOpen} onClose={this.handleAssignShift}>
					<AssignShiftForm overview={false} shiftId={this.props.shiftPlacement.shiftId} startDate={moment(this.props.shiftPlacement.startTime).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleAssignShift} handleSwitchFromAssignShiftToCreateShift={this.handleSwitchFromAssignShiftToCreateShift} />
				</Modal>
			) : null}
		</Fragment>
	);
}

ShiftButton.propTypes = propTypes;

ShiftButton.defaultProps = defaultProps;

export default ShiftButton;
