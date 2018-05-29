import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

import constants from '../../helpers/constants';

import NotificationModal from './NotificationModal';

import { switchAccount } from '../../actions/accountActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	account: PropTypes.object.isRequired,
	accounts: PropTypes.array.isRequired,
};

const defaultProps = {
	account: {},
	accounts: {},
};

class SwitchAccount extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleSwitchAccount = this.handleSwitchAccount.bind(this);

		this.handleDropdownToggle = this.handleDropdownToggle.bind(this);

		this.handleNotificationModalToggle = this.handleNotificationModalToggle.bind(this);
	}

	getInitialState = () => ({
		error: {},
		isDropdownOpen: false,
		isNotificationModalOpen: false,
	});

	handleSwitchAccount = accountId => this.props.actions.switchAccount({ accountId }).then(() => this.props.history.push(routes.DASHBOARD.HOME.URI)).catch((error) => {
		this.setState({ error });

		this.handleNotificationModalToggle();
	});

	handleDropdownToggle = () => this.setState({ isDropdownOpen: !this.state.isDropdownOpen });

	handleNotificationModalToggle = () => this.setState({ isNotificationModalOpen: !this.state.isNotificationModalOpen });

	render = () => (
		<Fragment>
			{(this.props.accounts.object === 'list' && this.props.accounts.total_count > 0) ? (
				<Dropdown isOpen={this.state.isDropdownOpen} toggle={this.handleDropdownToggle}>
					<DropdownToggle caret>{this.props.account.name}</DropdownToggle>
					<DropdownMenu>
						{this.props.accounts.data.filter(account => account.id !== this.props.account.id).map((account, index) => <DropdownItem key={index} title={account.name} onClick={() => this.handleSwitchAccount(account.id)}>{account.name}</DropdownItem>)}
					</DropdownMenu>
				</Dropdown>
			) : null}
			{(this.state.error.data) ? (
				<NotificationModal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isNotificationModalOpen} onClose={this.handleNotificationModalToggle}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</NotificationModal>
			) : null}
		</Fragment>
	);
}

SwitchAccount.propTypes = propTypes;

SwitchAccount.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ switchAccount }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchAccount);
