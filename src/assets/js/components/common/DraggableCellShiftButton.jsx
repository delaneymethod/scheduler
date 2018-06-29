import 'element-closest';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import ShiftForm from '../forms/ShiftForm';

const propTypes = {
	id: PropTypes.string.isRequired,
	shiftPlacement: PropTypes.object.isRequired,
};

const defaultProps = {
	id: '',
	shiftPlacement: {},
};

class ShiftPlacementDraggable extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleShiftMenu = this.handleShiftMenu.bind(this);

		this.handleEditShift = this.handleEditShift.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);
	}

	getInitialState = () => ({
		isShiftModalOpen: false,
		isShiftPopoverOpen: false,
	});

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen });

	handleShiftMenu = () => this.setState({ isShiftPopoverOpen: !this.state.isShiftPopoverOpen });

	handleCreateShift = () => this.setState({ isShiftModalOpen: !this.state.isShiftModalOpen });

	handleEditShift = () => this.setState({ editMode: true, isShiftModalOpen: !this.state.isShiftModalOpen });

	handleSuccessNotification = message => console.log('handleSuccess - show success notification with message:', message);

	render = () => (
		<Fragment>
			<button className="p-2 mb-2 d-block text-left shift" draggable="true" id={this.props.id} data-shift-id={this.props.shiftPlacement.shiftId} data-placement-id={this.props.shiftPlacement.placementId} title="Click to toggle Shift options" aria-label="Click to toggle Shift options" onClick={this.handleShiftMenu}>
				<div className="shift__data-row d-block w-100"><strong>{this.props.shiftPlacement.roleName}</strong> {(!this.props.shiftPlacement.isClosingShift) ? `(${this.props.shiftPlacement.hours} hrs)` : null}</div>
				<div className="shift__data-row d-block w-100">{moment(this.props.shiftPlacement.startTime).utc().format('HH:mm a')} - {(this.props.shiftPlacement.isClosingShift) ? 'Closing' : moment(this.props.shiftPlacement.endTime).utc().format('HH:mm a')}</div>
			</button>
			<Popover placement="right" isOpen={this.state.isShiftPopoverOpen} target={this.props.id} toggle={this.handleShiftMenu}>
				<PopoverBody>
					<div className="cell-popover">
						<button type="button" title="Edit Shift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleEditShift}>Edit Shift</button>
						<button type="button" title="Create Shift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleCreateShift}><i className="pr-2 fa fa-plus" aria-hidden="true"></i>Create Shift</button>
					</div>
				</PopoverBody>
			</Popover>
			{(this.state.editMode) ? (
				<Modal title="Shifts" className="modal-dialog" show={this.state.isShiftModalOpen} onClose={this.handleEditShift}>
					<ShiftForm editMode={this.state.editMode} shiftId={this.props.shiftPlacement.shiftId} employeeId={this.props.shiftPlacement.employeeId} placementId={this.props.shiftPlacement.employeeId} startDate={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditShift} />
				</Modal>
			) : (
				<Modal title="Shifts" className="modal-dialog" show={this.state.isShiftModalOpen} onClose={this.handleCreateShift}>
					<ShiftForm editMode={false} employeeId={this.props.shiftPlacement.employeeId} startDate={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} />
				</Modal>
			)}
		</Fragment>
	);
}

ShiftPlacementDraggable.propTypes = propTypes;

ShiftPlacementDraggable.defaultProps = defaultProps;

export default ShiftPlacementDraggable;
