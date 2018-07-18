import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import ShiftForm from '../forms/ShiftForm';

import constants from '../../helpers/constants';

import CloseButton from '../common/CloseButton';

import Notification from '../common/Notification';

const notifications = constants.APP.NOTIFICATIONS;

const propTypes = {
	roleName: PropTypes.string,
	id: PropTypes.string.isRequired,
	past: PropTypes.bool.isRequired,
	shiftPlacement: PropTypes.object.isRequired,
	handleSwitchFromSelectRoleToCreateRole: PropTypes.func.isRequired,
};

const defaultProps = {
	id: '',
	past: false,
	roleName: '',
	shiftPlacement: {},
	handleSwitchFromSelectRoleToCreateRole: () => {},
};

class ShiftButton extends Component {
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
		roleName: '',
		editMode: false,
		isShiftPopoverOpen: false,
		isEditShiftModalOpen: false,
		isCreateShiftModalOpen: false,
	});

	componentDidMount = () => {
		const { roleName } = this.props;

		if (!isEmpty(roleName)) {
			this.setState({ roleName });
		}
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.roleName !== this.props.roleName) {
			const { roleName } = this.props;

			if (!isEmpty(roleName)) {
				this.setState({ roleName });
			}
		}
	};

	handleShiftMenu = () => this.setState({ isShiftPopoverOpen: !this.state.isShiftPopoverOpen });

	handleCreateShift = () => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen }, () => {
		/* If we close the modal, reset the role name state. If the user hasnt saved, but reopens the modal, we want the correct value - not the state value */
		this.setState({ roleName: '' });
	});

	handleEditShift = () => this.setState({ isEditShiftModalOpen: !this.state.isEditShiftModalOpen }, () => {
		/* If we close the modal, reset the role name state. If the user hasnt saved, but reopens the modal, we want the correct value - not the state value */
		this.setState({ roleName: '' });
	});

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}
	};

	render = () => ((!this.props.past) ? (
		<Fragment>
			<div className="p-2 mb-2 d-block text-left shift" draggable="true" id={this.props.id} data-shift-id={this.props.shiftPlacement.shiftId} data-placement-id={this.props.shiftPlacement.placementId} onClick={this.handleShiftMenu}>
				<div className="shift__data-row d-block text-truncate"><strong>{this.props.shiftPlacement.roleName}</strong> {this.props.shiftPlacement.hours} {((this.props.shiftPlacement.hours === 1) ? 'hr' : 'hrs')}</div>
				<div className="shift__data-row d-block">{moment(this.props.shiftPlacement.startTime).format('HH:mma')} - {(this.props.shiftPlacement.isClosingShift) ? 'Closing' : moment(this.props.shiftPlacement.endTime).format('HH:mma')}</div>
			</div>
			<Popover placement="right" isOpen={this.state.isShiftPopoverOpen} target={this.props.id} toggle={this.handleShiftMenu}>
				<PopoverBody>
					<div className="cell-popover">
						<button type="button" title="Edit Shift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleEditShift}>Edit Shift</button>
						<button type="button" title="Create Shift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleCreateShift}><i className="pr-2 fa fa-fw fa-plus" aria-hidden="true"></i>Create Shift</button>
					</div>
				</PopoverBody>
			</Popover>
			<Modal title="Edit Shift" className="modal-dialog" show={this.state.isEditShiftModalOpen} onClose={this.handleEditShift}>
				<ShiftForm editMode={true} roleName={(!isEmpty(this.state.roleName)) ? this.state.roleName : this.props.shiftPlacement.roleName} shiftId={this.props.shiftPlacement.shiftId} employeeId={this.props.shiftPlacement.employeeId} placementId={this.props.shiftPlacement.employeeId} startDate={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditShift} handleSwitchFromSelectRoleToCreateRole={this.props.handleSwitchFromSelectRoleToCreateRole} />
			</Modal>
			<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={this.handleCreateShift}>
				<ShiftForm editMode={false} roleName={(!isEmpty(this.state.roleName)) ? this.state.roleName : this.props.shiftPlacement.roleName} employeeId={this.props.shiftPlacement.employeeId} startDate={moment(this.props.shiftPlacement.weekDate).format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} handleSwitchFromSelectRoleToCreateRole={this.props.handleSwitchFromSelectRoleToCreateRole} />
			</Modal>
		</Fragment>
	) : (
		<div className="p-2 mb-2 d-block text-left shift" draggable="true" id={this.props.id} data-shift-id={this.props.shiftPlacement.shiftId} data-placement-id={this.props.shiftPlacement.placementId}>
			<div className="shift__data-row d-block text-truncate"><strong>{this.props.shiftPlacement.roleName}</strong> {(!this.props.shiftPlacement.isClosingShift) ? `(${this.props.shiftPlacement.hours} ${((this.props.shiftPlacement.hours === 1) ? 'hr' : 'hrs')})` : null}</div>
			<div className="shift__data-row d-block">{moment(this.props.shiftPlacement.startTime).format('HH:mma')} - {(this.props.shiftPlacement.isClosingShift) ? 'Closing' : moment(this.props.shiftPlacement.endTime).format('HH:mma')}</div>
		</div>
	));
}

ShiftButton.propTypes = propTypes;

ShiftButton.defaultProps = defaultProps;

export default ShiftButton;
