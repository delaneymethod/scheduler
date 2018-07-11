import 'element-closest';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import ShiftForm from '../forms/ShiftForm';

import constants from '../../helpers/constants';

import CloseButton from '../common/CloseButton';

import Notification from '../common/Notification';

const notifications = constants.APP.NOTIFICATIONS;

const propTypes = {
	id: PropTypes.string.isRequired,
	shiftPlacement: PropTypes.object.isRequired,
};

const defaultProps = {
	id: '',
	shiftPlacement: {},
};

class ShiftPlacement extends Component {
	constructor(props) {
		super(props);

		this.toastId = null;

		this.state = this.getInitialState();

		this.handleShiftMenu = this.handleShiftMenu.bind(this);

		this.handleEditShift = this.handleEditShift.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);
	}

	getInitialState = () => ({
		editMode: false,
		isShiftModalOpen: false,
		isShiftPopoverOpen: false,
	});

	handleShiftMenu = () => this.setState({ isShiftPopoverOpen: !this.state.isShiftPopoverOpen });

	handleCreateShift = () => this.setState({ isShiftModalOpen: !this.state.isShiftModalOpen });

	handleEditShift = () => this.setState({ editMode: true, isShiftModalOpen: !this.state.isShiftModalOpen });

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
			<button className="p-2 mb-2 d-block text-left shift" draggable="true" id={this.props.id} data-shift-id={this.props.shiftPlacement.shiftId} data-placement-id={this.props.shiftPlacement.placementId} title="Click to toggle Shift options" aria-label="Click to toggle Shift options" onClick={this.handleShiftMenu}>
				<div className="shift__data-row d-block text-truncate"><strong>{this.props.shiftPlacement.roleName}</strong> {(!this.props.shiftPlacement.isClosingShift) ? `(${this.props.shiftPlacement.hours} ${((this.props.shiftPlacement.hours === 1) ? 'hr' : 'hrs')})` : null}</div>
				<div className="shift__data-row d-block">{moment(this.props.shiftPlacement.startTime).format('HH:mm a')} - {(this.props.shiftPlacement.isClosingShift) ? 'Closing' : moment(this.props.shiftPlacement.endTime).format('HH:mm a')}</div>
			</button>
			<Popover placement="right" isOpen={this.state.isShiftPopoverOpen} target={this.props.id} toggle={this.handleShiftMenu}>
				<PopoverBody>
					<div className="cell-popover">
						<button type="button" title="Edit Shift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleEditShift}>Edit Shift</button>
						<button type="button" title="Create Shift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleCreateShift}><i className="pr-2 fa fa-fw fa-plus" aria-hidden="true"></i>Create Shift</button>
					</div>
				</PopoverBody>
			</Popover>
			{(this.state.editMode) ? (
				<Modal title="Edit Shift" className="modal-dialog" show={this.state.isShiftModalOpen} onClose={this.handleEditShift}>
					<ShiftForm editMode={true} shiftId={this.props.shiftPlacement.shiftId} employeeId={this.props.shiftPlacement.employeeId} placementId={this.props.shiftPlacement.employeeId} startDate={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditShift} />
				</Modal>
			) : (
				<Modal title="Create Shift" className="modal-dialog" show={this.state.isShiftModalOpen} onClose={this.handleCreateShift}>
					<ShiftForm editMode={false} employeeId={this.props.shiftPlacement.employeeId} startDate={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} />
				</Modal>
			)}
		</Fragment>
	);
}

ShiftPlacement.propTypes = propTypes;

ShiftPlacement.defaultProps = defaultProps;

export default ShiftPlacement;
