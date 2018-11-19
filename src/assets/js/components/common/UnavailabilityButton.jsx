import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import React, { Fragment, Component } from 'react';

import Modal from './Modal';

import config from '../../helpers/config';

import Notification from '../common/Notification';

import UnavailabilityDetails from './UnavailabilityDetails';

import UnavailabilityForm from '../forms/UnavailabilityForm';

const notifications = config.APP.NOTIFICATIONS;

const propTypes = {
	id: PropTypes.string.isRequired,
	weekDate: PropTypes.string.isRequired,
	employeeId: PropTypes.string.isRequired,
	unavailability: PropTypes.object.isRequired,
	unavailabilities: PropTypes.array.isRequired,
	pasteShift: PropTypes.func.isRequired,
};

const defaultProps = {
	id: '',
	weekDate: '',
	employeeId: '',
	unavailability: {},
	unavailabilities: [],
};

class UnavailabilityButton extends Component {
	constructor(props) {
		super(props);

		this.toastId = null;

		this.state = this.getInitialState();

		this.handleEditUnavailability = this.handleEditUnavailability.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);
	}

	getInitialState = () => ({
		unavailabilityId: '',
		isEditUnavailabilityModalOpen: false,
	});

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}
	};

	handleEditUnavailability = (event, unavailabilityId) => this.setState({ unavailabilityId, isEditUnavailabilityModalOpen: !this.state.isEditUnavailabilityModalOpen });

	render = () => (
		<Fragment>
			{(this.props.unavailabilities.length > 0) ? (this.props.unavailabilities.map((unavailability, unavailabilityIndex) => (
				<UnavailabilityDetails key={`${this.props.id}_${unavailabilityIndex}`}
					id={this.props.id} weekDate={this.props.weekDate}
					unavailability={unavailability}
					employeeId={this.props.employeeId}
					pasteShift={this.props.pasteShift}
					handleEditUnavailability={this.handleEditUnavailability}
					handleSuccessNotification={this.handleSuccessNotification} />
			))) : (
				<UnavailabilityDetails key={`${this.props.id}_${this.props.unavailability.unavailabilityId}`}
					id={this.props.id}
					weekDate={this.props.weekDate}
					unavailability={this.props.unavailability}
					employeeId={this.props.employeeId}
					pasteShift={this.props.pasteShift}
					handleEditUnavailability={this.handleEditUnavailability}
					handleSuccessNotification={this.handleSuccessNotification} />
			)}
			<Modal title="Edit Time Off" className="modal-dialog" show={this.state.isEditUnavailabilityModalOpen} onClose={this.handleEditUnavailability}>
				<UnavailabilityForm editMode={true} unavailabilityId={this.state.unavailabilityId} weekDate={this.props.weekDate} employeeId={this.props.employeeId} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleEditUnavailability} />
			</Modal>
		</Fragment>
	);
}

UnavailabilityButton.propTypes = propTypes;

UnavailabilityButton.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	id: props.id,
	weekDate: props.weekDate,
	employeeId: props.employeeId,
	unavailability: props.unavailability,
	unavailabilities: props.unavailabilities,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UnavailabilityButton);
