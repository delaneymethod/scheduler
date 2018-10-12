import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import EmployeeForm from '../forms/EmployeeForm';

import UnavailabilityForm from '../forms/UnavailabilityForm';

import { showEditHandler, hideEditHandler } from '../../helpers/toggleClasses';

const propTypes = {
	rowIndex: PropTypes.number.isRequired,
	employeeId: PropTypes.string.isRequired,
	accountEmployeeId: PropTypes.string.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	rowIndex: 0,
	employeeId: '',
	accountEmployeeId: '',
	handleSuccessNotification: () => {},
};

class UpdateEmployeeButton extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleEditEmployee = this.handleEditEmployee.bind(this);

		this.handleUpdateEmployee = this.handleUpdateEmployee.bind(this);

		this.handleCreateUnavailability = this.handleCreateUnavailability.bind(this);
	}

	getInitialState = () => ({
		isEditEmployeeModalOpen: false,
		isUpdateEmployeePopoverOpen: false,
		isCreateUnavailabilityModalOpen: false,
	});

	handleUpdateEmployee = () => {
		this.setState({ isUpdateEmployeePopoverOpen: !this.state.isUpdateEmployeePopoverOpen }, () => {
			/* Find the edit handler and set its display so it stays on screen */
			if (this.state.isUpdateEmployeePopoverOpen) {
				/* Find the edit handler for employee row and show it */
				showEditHandler(this.props.accountEmployeeId);
			} else {
				/* Find the edit handler for employee row and hide it */
				hideEditHandler(this.props.accountEmployeeId);
			}
		});
	};

	handleEditEmployee = () => {
		hideEditHandler(this.props.accountEmployeeId);

		this.setState({ isUpdateEmployeePopoverOpen: false, isEditEmployeeModalOpen: !this.state.isEditEmployeeModalOpen });
	};

	handleCreateUnavailability = () => {
		hideEditHandler(this.props.accountEmployeeId);

		this.setState({ isUpdateEmployeePopoverOpen: false, isCreateUnavailabilityModalOpen: !this.state.isCreateUnavailabilityModalOpen });
	};

	render = () => (
		<Fragment>
			<button type="button" className="btn border-0 btn-secondary btn-icon" id={`updateEmployee${this.props.rowIndex}`} title="Update employee" aria-label="Update employee" onClick={this.handleUpdateEmployee}><i className="fa fa-fw fa-bars" aria-hidden="true"></i></button>
			<Popover placement="bottom" isOpen={this.state.isUpdateEmployeePopoverOpen} target={`updateEmployee${this.props.rowIndex}`} toggle={this.handleUpdateEmployee}>
				<PopoverBody>
					<ul className="popover-menu">
						<li><button type="button" title="Edit Employee" id="editEmployee" className="btn btn-action btn-nav border-0" onClick={this.handleEditEmployee}>Edit Employee</button></li>
						<li><button type="button" title="Add Time Off" id="createUnavailability" className="btn btn-action btn-nav border-0" onClick={this.handleCreateUnavailability}>Add Time Off</button></li>
					</ul>
				</PopoverBody>
			</Popover>
			<Modal title="Create Time Off" className="modal-dialog" show={this.state.isCreateUnavailabilityModalOpen} onClose={this.handleCreateUnavailability}>
				<UnavailabilityForm editMode={false} employeeId={this.props.employeeId} handleSuccessNotification={this.props.handleSuccessNotification} handleClose={this.handleCreateUnavailability} />
			</Modal>
			<Modal title="Edit Employee" className="modal-dialog" show={this.state.isEditEmployeeModalOpen} onClose={this.handleEditEmployee}>
				<EmployeeForm editMode={true} employeeId={this.props.employeeId} handleSuccessNotification={this.props.handleSuccessNotification} handleClose={this.handleEditEmployee} />
			</Modal>
		</Fragment>
	);
}

UpdateEmployeeButton.propTypes = propTypes;

UpdateEmployeeButton.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rowIndex: props.rowIndex,
	employeeId: props.employeeId,
	accountEmployeeId: props.accountEmployeeId,
	handleSuccessNotification: props.handleSuccessNotification,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEmployeeButton);
