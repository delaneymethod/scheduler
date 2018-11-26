import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { sendAdminAccessInvite, revokeAdminAccessInvite, resendAdminAccessInvite, removeAdminAccess } from '../../actions/employeeActions';

const propTypes = {
	rowIndex: PropTypes.number.isRequired,
	accountEmployee: PropTypes.object.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
	handleErrorNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	rowIndex: 0,
	accountEmployee: '',
	handleSuccessNotification: () => { },
	handleErrorNotification: () => { },
};

class ManageAccountAccessButton extends Component {
	constructor(props) {
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState = () => ({
		isAccountAccessPopoverOpen: false,
	});

	handleAccountAccessClick = () => {
		this.setState({ isAccountAccessPopoverOpen: !this.state.isAccountAccessPopoverOpen });
	};

	handleMakeAdminClick = () => {
		const payload = {
			accountEmployee: this.props.accountEmployee,
			applicationUserRoleId: this.props.applicationUserRoles.find(obj => obj.roleName === 'ADMINISTRATOR').userRoleId,
		};

		this.props.actions.sendAdminAccessInvite(payload).then(() => {
			const message = 'User has been sent an invitation to become an administrator';
			this.props.handleSuccessNotification(message);

			this.handleAccountAccessClick();
		}).catch((error) => {
			this.handleRequestError(error);
		});
	}

	handleRevokeAdminAccessClick = () => {
		const payload = {
			accountEmployee: this.props.accountEmployee,
			applicationUserRoleId: this.props.applicationUserRoles.find(obj => obj.roleName === 'ADMINISTRATOR').userRoleId,
		};

		this.props.actions.removeAdminAccess(payload).then(() => {
			const message = 'Administrator access has been removed successfully';
			this.props.handleSuccessNotification(message);

			this.handleAccountAccessClick();
		}).catch((error) => {
			this.handleRequestError(error);
		});
	}

	handleResendInviteClick = () => {
		const payload = {
			accountEmployee: this.props.accountEmployee,
		};

		this.props.actions.resendAdminAccessInvite(payload).then(() => {
			const message = 'User has been re-sent an invitation to become an administrator';
			this.props.handleSuccessNotification(message);

			this.handleAccountAccessClick();
		}).catch((error) => {
			this.handleRequestError(error);
		});
	}

	handleRevokeAdminInviteClick = () => {
		const payload = {
			accountEmployee: this.props.accountEmployee,
		};

		this.props.actions.revokeAdminAccessInvite(payload).then(() => {
			const message = 'Administrator access has been removed successfully';
			this.props.handleSuccessNotification(message);

			this.handleAccountAccessClick();
		}).catch((error) => {
			this.handleRequestError(error);
		});
	}

	handleRequestError = (error) => {
		this.props.handleErrorNotification(error.data.message);
		this.handleAccountAccessClick();
		Promise.reject(error);
	}

	renderPopoverOptions = (accountEmployee) => {
		const role = accountEmployee.accountAccess.applicationUserRoles[0];

		// check roles to determine which options to display
		if (role) {
			if (role.roleName === 'ADMINISTRATOR') {
				return <li><button type="button" title="Remove Admin Access" id="removeAdminAccessButton" className="btn btn-danger btn-nav border-0" onClick={this.handleRevokeAdminAccessClick}>Remove Administrator Access</button></li>;
			}
		}

		// if employee does not have any roles, check for invites to determine which options to display
		const invite = accountEmployee.accountAccess.applicationUserRoleInvites[0];

		if (invite) {
			if (invite.status === 'SENT') {
				return [<li key="resendInvite"><button type="button" title="Resend Invite" id="resendInviteButton" className="btn btn-action btn-nav border-0" onClick={this.handleResendInviteClick}>Resend Invite</button></li>,
					<li key="revokeInvite"><button type="button" title="Revoke Invite" id="revokeInviteButton" className="btn btn-danger btn-nav border-0" onClick={this.handleRevokeAdminInviteClick}>Revoke Invite</button></li>];
			}
		}
		return <li><button type="button" title="Make Administator" id="makeAdministratorButton" className="btn btn-action btn-nav border-0" onClick={this.handleMakeAdminClick}>Make Administrator</button></li>;
	}

	render = () => (
		<Fragment>
			<button type="button" className="btn border-0 btn-secondary btn-icon" id={`accountAccess${this.props.rowIndex}`} title="Update Account Access" aria-label="Update Account Access" onClick={this.handleAccountAccessClick}><i className="fa fa-fw fa-bars" aria-hidden="true"></i></button>
			<Popover placement="bottom" isOpen={this.state.isAccountAccessPopoverOpen} target={`accountAccess${this.props.rowIndex}`} toggle={this.handleAccountAccessClick}>
				<PopoverBody>
					<ul className="popover-menu">
						{this.renderPopoverOptions(this.props.accountEmployee)}
					</ul>
				</PopoverBody>
			</Popover>
		</Fragment>
	);
}

ManageAccountAccessButton.propTypes = propTypes;

ManageAccountAccessButton.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rowIndex: props.rowIndex,
	accountEmployee: props.accountEmployee,
	applicationUserRoles: state.applicationUserRoles,
	handleSuccessNotification: props.handleSuccessNotification,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		sendAdminAccessInvite,
		revokeAdminAccessInvite,
		resendAdminAccessInvite,
		removeAdminAccess,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccountAccessButton);
