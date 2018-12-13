import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Popover, PopoverBody } from 'reactstrap';
import React, { Fragment, Component } from 'react';
import { sendAdminAccessInvite, revokeAdminAccessInvite, resendAdminAccessInvite, removeAdminAccess } from '../../actions/employeeActions';

const propTypes = {
	rowIndex: PropTypes.number.isRequired,
	accountEmployee: PropTypes.object.isRequired,
	handleErrorNotification: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	rowIndex: 0,
	accountEmployee: '',
	handleErrorNotification: () => {},
	handleSuccessNotification: () => {},
};

class ManageAccountAccessButton extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => ({
		isAccountAccessPopoverOpen: false,
	});

	handleAccountAccessClick = () => this.setState({ isAccountAccessPopoverOpen: !this.state.isAccountAccessPopoverOpen });

	handleMakeAdminClick = () => {
		const { accountEmployee } = this.props;

		const applicationUserRoleId = this.props.applicationUserRoles.find(data => data.roleName === 'ADMINISTRATOR').userRoleId;

		const payload = {
			accountEmployee,
			applicationUserRoleId,
		};

		this.props.actions.sendAdminAccessInvite(payload)
			.then(() => {
				this.handleAccountAccessClick();

				/* FIXME - Make messages constants in config */
				const message = '<p>User has been sent an invitation to become an administrator</p>';

				this.props.handleSuccessNotification();
			}).catch(error => this.handleRequestError(error));
	};

	handleRevokeAdminAccessClick = () => {
		const { accountEmployee } = this.props;

		const applicationUserRoleId = this.props.applicationUserRoles.find(data => data.roleName === 'ADMINISTRATOR').userRoleId;

		const payload = {
			accountEmployee,
			applicationUserRoleId,
		};

		this.props.actions.removeAdminAccess(payload)
			.then(() => {
				this.handleAccountAccessClick();

				/* FIXME - Make messages constants in config */
				const message = '<p>Administrator access has been removed successfully</p>';

				this.props.handleSuccessNotification(message);
			}).catch(error => this.handleRequestError(error));
	};

	handleResendInviteClick = () => {
		const { accountEmployee } = this.props;

		const payload = {
			accountEmployee,
		};

		this.props.actions.resendAdminAccessInvite(payload)
			.then(() => {
				this.handleAccountAccessClick();

				/* FIXME - Make messages constants in config */
				const message = '<p>User has been re-sent an invitation to become an administrator</p>';

				this.props.handleSuccessNotification(message);
			})
			.catch(error => this.handleRequestError(error));
	};

	handleRevokeAdminInviteClick = () => {
		const { accountEmployee } = this.props;

		const payload = {
			accountEmployee,
		};

		this.props.actions.revokeAdminAccessInvite(payload)
			.then(() => {
				this.handleAccountAccessClick();

				/* FIXME - Make messages constants in config */
				const message = '<p>Administrator access has been removed successfully</p>';

				this.props.handleSuccessNotification(message);
			})
			.catch(error => this.handleRequestError(error));
	};

	handleRequestError = (error) => {
		this.handleAccountAccessClick();

		this.props.handleErrorNotification(error.data.message);

		return Promise.reject(error);
	};

	renderPopoverOptions = (accountEmployee) => {
		const role = accountEmployee.accountAccess.applicationUserRoles[0];

		/* Check roles to determine which options to display */
		if (role) {
			if (role.roleName === 'ADMINISTRATOR') {
				return (<li><button type="button" title="Remove Admin Access" id="removeAdminAccessButton" className="btn btn-danger btn-nav border-0" onClick={this.handleRevokeAdminAccessClick}>Remove Administrator Access</button></li>);
			}
		}

		// if employee does not have any roles, check for invites to determine which options to display
		const invite = accountEmployee.accountAccess.applicationUserRoleInvites[0];

		if (invite) {
			if (invite.status === 'SENT') {
				return (
					<div>
						<li key="resendInvite"><button type="button" title="Resend Invite" id="resendInviteButton" className="btn btn-action btn-nav border-0" onClick={this.handleResendInviteClick}>Resend Invite</button></li>
						<li key="revokeInvite"><button type="button" title="Revoke Invite" id="revokeInviteButton" className="btn btn-danger btn-nav border-0" onClick={this.handleRevokeAdminInviteClick}>Revoke Invite</button></li>
					</div>
				);
			}
		}

		return (<li><button type="button" title="Make Administrator" id="makeAdministratorButton" className="btn btn-action btn-nav border-0" onClick={this.handleMakeAdminClick}>Make Administrator</button></li>);
	};

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
		removeAdminAccess,
		sendAdminAccessInvite,
		revokeAdminAccessInvite,
		resendAdminAccessInvite,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccountAccessButton);
