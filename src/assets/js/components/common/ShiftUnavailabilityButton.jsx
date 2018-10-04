import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import config from '../../helpers/config';

import ShiftForm from '../forms/ShiftForm';

import UnavailabilityForm from '../forms/UnavailabilityForm';

const propTypes = {
	id: PropTypes.string.isRequired,
	weekDate: PropTypes.string.isRequired,
	employeeId: PropTypes.string.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	id: '',
	weekDate: '',
	employeeId: '',
	handleSuccessNotification: () => {},
};

class ShiftUnavailabilityButton extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleCreateUnavailability = this.handleCreateUnavailability.bind(this);

		this.handleShiftUnavailabilityMenu = this.handleShiftUnavailabilityMenu.bind(this);
	}

	getInitialState = () => ({
		editMode: false,
		isCreateShiftModalOpen: false,
		isCreateUnavailabilityModalOpen: false,
		isShiftUnavailabilityPopoverOpen: false,
	});

	handleCreateShift = () => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleCreateUnavailability = () => this.setState({ isCreateUnavailabilityModalOpen: !this.state.isCreateUnavailabilityModalOpen });

	handleShiftUnavailabilityMenu = () => this.setState({ isShiftUnavailabilityPopoverOpen: !this.state.isShiftUnavailabilityPopoverOpen });

	render = () => (
		<Fragment>
			<button type="button" className="p-2 m-0 d-block border-0 text-left w-100 text-center add-shift" id={this.props.id} onClick={this.handleShiftUnavailabilityMenu}><i className="fa fa-fw fa-plus" aria-hidden="true"></i></button>
			<Popover placement="auto" isOpen={this.state.isShiftUnavailabilityPopoverOpen} target={this.props.id} toggle={this.handleShiftUnavailabilityMenu}>
				<PopoverBody>
					<div className="cell-popover">
						<button type="button" title="Add Time Off" id="createUnavailability" className="d-block border-0 m-0 text-uppercase" onClick={this.handleCreateUnavailability}>Add Time Off</button>
						<button type="button" title="Create Shift" id="createShift" className="d-block border-0 m-0 text-uppercase" onClick={this.handleCreateShift}>Create Shift</button>
					</div>
				</PopoverBody>
			</Popover>
			<Modal title="Create Time Off" className="modal-dialog" show={this.state.isCreateUnavailabilityModalOpen} onClose={this.handleCreateUnavailability}>
				<UnavailabilityForm editMode={false} employeeId={this.props.employeeId} weekDate={this.props.weekDate} handleSuccessNotification={this.props.handleSuccessNotification} handleClose={this.handleCreateUnavailability} />
			</Modal>
			<Modal title="Create Shift" className="modal-dialog" show={this.state.isCreateShiftModalOpen} onClose={this.handleCreateShift}>
				<ShiftForm overview={false} editMode={false} employeeId={this.props.employeeId} startDate={this.props.weekDate} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} />
			</Modal>
		</Fragment>
	);
}

ShiftUnavailabilityButton.propTypes = propTypes;

ShiftUnavailabilityButton.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	id: props.id,
	weekDate: props.weekDate,
	employeeId: props.employeeId,
	handleSuccessNotification: props.handleSuccessNotification,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ShiftUnavailabilityButton);
