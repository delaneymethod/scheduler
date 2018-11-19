import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody, Tooltip } from 'reactstrap';
import { bindActionCreators } from 'redux';

import Modal from './Modal';

import ShiftForm from '../forms/ShiftForm';

import UnavailabilityForm from '../forms/UnavailabilityForm';

import PopoverButton from './PopoverButton';

const propTypes = {
	id: PropTypes.string.isRequired,
	weekDate: PropTypes.string.isRequired,
	employeeId: PropTypes.string.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
	handleErrorNotification: PropTypes.func.isRequired,
	pasteShift: PropTypes.func.isRequired,
};

const defaultProps = {
	id: '',
	weekDate: '',
	employeeId: '',
	handleSuccessNotification: () => { },
	handleErrorNotification: () => { },
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
		isPasteShiftTooltipOpen: false,
	});

	handleCreateShift = () => this.setState({ isCreateShiftModalOpen: !this.state.isCreateShiftModalOpen });

	handleCreateUnavailability = () => this.setState({ isCreateUnavailabilityModalOpen: !this.state.isCreateUnavailabilityModalOpen });

	handleShiftUnavailabilityMenu = () => this.setState({ isShiftUnavailabilityPopoverOpen: !this.state.isShiftUnavailabilityPopoverOpen });

	handlePasteShiftTooltip = () => this.setState({ isPasteShiftTooltipOpen: !this.state.isPasteShiftTooltipOpen });

	render = () => (
		<Fragment>
			<button type="button" className="p-2 m-0 d-block border-0 text-left w-100 text-center add-shift" id={this.props.id} onClick={this.handleShiftUnavailabilityMenu}><i className="fa fa-fw fa-plus" aria-hidden="true"></i></button>
			<Popover id="popover" placement="left" isOpen={this.state.isShiftUnavailabilityPopoverOpen} target={this.props.id} toggle={this.handleShiftUnavailabilityMenu}>
				<PopoverBody>
					<div className="cell-popover">
						<PopoverButton id="createShift" title="Create Shift" text="Create Shift" isEnabled={true} onClick={this.handleCreateShift}/>
						<PopoverButton id="createUnavailability" title="Add Time Off" text="Add Time Off" isEnabled={true} onClick={this.handleCreateUnavailability}/>
						{(this.props.copiedShift) ? (
							<PopoverButton id="pasteShift" title="Paste Shift" text="Paste Shift" isEnabled={true} onClick={() => { this.props.pasteShift(); this.handleShiftUnavailabilityMenu(); }}/>
						) : (
							<PopoverButton id="pasteShift" title="Paste Shift" text="Paste Shift" isEnabled={false} />
						)}
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
	copiedShift: state.clipboard.copiedShift,
	handleSuccessNotification: props.handleSuccessNotification,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ShiftUnavailabilityButton);
