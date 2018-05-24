import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

import constants from '../../helpers/constants';

import { switchAccount } from '../../actions/accountActions';

import Notification from './Notification';

const routes = constants.APP.ROUTES;

const propTypes = {
	account: PropTypes.object.isRequired,
	accounts: PropTypes.array.isRequired,
};

const defaultProps = {
	account: {
		id: 1,
		name: 'Account 1',
	},
	accounts: [
		{
			id: 1,
			name: 'Account 1',
		}, {
			id: 2,
			name: 'Account 2',
		},
	],
};

class SwitchAccount extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleSwitchAccount = this.handleSwitchAccount.bind(this);

		this.handleDropdownToggle = this.handleDropdownToggle.bind(this);

		this.handleNotificationToggle = this.handleNotificationToggle.bind(this);
	}

	getInitialState = () => ({
		error: '',
		isDropdownOpen: false,
		isNotificationOpen: false,
	});

	handleSwitchAccount = (event, accountId) => {
		this.props.actions.switchAccount({ accountId })
			.then(() => this.props.history.push(routes.DASHBOARD.HOME.URI))
			.catch(error => this.handleNotificationToggle(error));
	};

	handleDropdownToggle = (event) => {
		event.preventDefault();

		this.setState({
			isDropdownOpen: !this.state.isDropdownOpen,
		});
	};

	handleNotificationToggle = (error) => {
		this.setState({
			error,
			isNotificationOpen: !this.state.isNotificationOpen,
		});
	};

	render = () => (
		<Fragment>
			<Dropdown isOpen={this.state.isDropdownOpen} toggle={this.handleDropdownToggle}>
				<DropdownToggle caret>{this.props.account.name}</DropdownToggle>
				<DropdownMenu>
					{this.props.accounts.filter(account => account.id !== this.props.account.id).map((account, index) => <DropdownItem key={index} title={account.name} onClick={event => this.handleSwitchAccount(event, account.id)}>{account.name}</DropdownItem>)}
				</DropdownMenu>
			</Dropdown>
			{(this.state.error.data) ? (
				<Notification title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isNotificationOpen} onClose={this.handleNotificationToggle}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Notification>
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
