import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

import constants from '../../helpers/constants';

import { switchAccount } from '../../actions/accountActions';

import ErrorMessage from './ErrorMessage';

const propTypes = {
	account: PropTypes.object.isRequired,
	accounts: PropTypes.array.isRequired,
};

const defaultProps = {
	account: {
		title: '',
	},
	accounts: [],
};

class SwitchAccountDropdown extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleChange = this.handleChange.bind(this);

		this.handleToggle = this.handleToggle.bind(this);
	}

	getInitialState = () => ({
		errors: [],
		isOpen: false,
	});

	handleChange = (event, accountId) => {
		this.setState({ errors: [] });

		this.props.actions.switchAccount({ accountId })
			.then(() => this.props.history.push(constants.APP.ROUTES.DASHBOARD.HOME.URI))
			.catch((error) => {
				const { errors } = this.state;

				errors.push(error);

				this.setState({ errors });
			});
	};

	handleToggle = (event) => {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	};

	errorMessages = () => ((this.state.errors.length) ? this.state.errors.map((error, index) => <ErrorMessage key={index} error={error.data} />) : '');

	render = () => (
		<div>
			{this.errorMessages()}
			<Dropdown isOpen={this.state.isOpen} toggle={this.handleToggle}>
				<DropdownToggle caret>{this.props.account.title}</DropdownToggle>
				<DropdownMenu>
					{this.props.accounts.filter(account => account.id !== this.props.account.id).map((account, index) => <DropdownItem key={index} title={account.title} onClick={event => this.handleChange(event, account.id)}>{account.title}</DropdownItem>)}
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}

SwitchAccountDropdown.propTypes = propTypes;

SwitchAccountDropdown.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ switchAccount }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchAccountDropdown);
