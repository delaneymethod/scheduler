import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Form, Label, Input, FormGroup, Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import constants from '../../helpers/constants';

import { updateUser } from '../../actions/userActions';

import { switchAccount } from '../../actions/accountActions';

import truncateText from '../../helpers/stringManipulations';

const routes = constants.APP.ROUTES;

const propTypes = {
	inline: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
};

const defaultProps = {
	user: {},
	inline: false,
};

class SwitchAccount extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleSwitchAccount = this.handleSwitchAccount.bind(this);

		this.handleSwitchAccountMenu = this.handleSwitchAccountMenu.bind(this);
	}

	getInitialState = () => ({
		error: {},
		isErrorModalOpen: false,
		isSwitchAccountMenuPopoverOpen: false,
	});

	handleSwitchAccount = (event, accountId) => {
		const { actions, history } = this.props;

		console.log('Called SwitchAccount handleChange switchAccount');
		actions.switchAccount({ accountId })
			.then(() => {
				const { user } = this.props;

				user.account = user.accounts.filter(data => data.id === accountId).shift();

				console.log('Called SwitchAccount handleChange updateUser');
				actions.updateUser(user).then(() => history.push(routes.DASHBOARD.HOME.URI));
			})
			.catch((error) => {
				error.data.title = 'Switch Account';

				this.setState({ error });

				this.handleModal();
			});
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen }, () => ((!this.state.isErrorModalOpen) ? this.props.history.push(routes.DASHBOARD.HOME.URI) : null));

	handleSwitchAccountMenu = () => this.setState({ isSwitchAccountMenuPopoverOpen: !this.state.isSwitchAccountMenuPopoverOpen });

	render = () => {
		if (isEmpty(this.props.user)) {
			return null;
		}

		return (
			<Fragment>
				{(this.props.inline) ? (
					<Fragment>
						{(this.props.user.accounts.length > 1) ? (
							<Fragment>
								<button type="button" className="btn btn-nav btn-action ml-r border-0 col-12 col-sm-auto" id="switchAccountMenu" title="Switch Account Menu" aria-label="Switch Account Menu" onClick={this.handleSwitchAccountMenu}>
									<span className="d-inline-block d-sm-none d-md-inline-block d-lg-none">{truncateText(this.props.user.account.name)}<i className="pl-2 fa fa-fw fa-chevron-down" aria-hidden="true"></i></span>
									<span className="d-none d-sm-inline-block d-md-none d-lg-inline-block">{this.props.user.account.name}<i className="pl-2 fa fa-fw fa-chevron-down" aria-hidden="true"></i></span>
								</button>
								<Popover placement="bottom" isOpen={this.state.isSwitchAccountMenuPopoverOpen} target="switchAccountMenu" toggle={this.handleSwitchAccountMenu}>
									<PopoverBody>
										<ul className="popover-menu">
											{this.props.user.accounts.map((account, index) => (<li key={index}><button type="button" title={`Switch to ${account.name}`} aria-label={`Switch to ${account.name}`} className="btn btn-action btn-nav border-0" onClick={event => this.handleSwitchAccount(event, account.id)}>{account.name}</button></li>))}
										</ul>
									</PopoverBody>
								</Popover>
							</Fragment>
						) : (
							<Fragment>
								{(this.props.user.account) ? (
									<button type="button" className="btn btn-nav btn-user btn-no-click ml-r border-0 col-12 col-sm-auto" title={this.props.user.account.name} aria-label={this.props.user.account.name}>
										<span className="d-none d-sm-none d-md-inline-block d-lg-none">{truncateText(this.props.user.account.name)}</span>
										<span className="d-inline-block d-sm-inline-block d-md-none d-lg-inline-block">{this.props.user.account.name}</span>
									</button>
								) : null}
							</Fragment>
						)}
					</Fragment>
				) : (
					<Form>
						<FormGroup>
							<Label for="accountId">Account</Label>
							<Input type="select" name="accountId" id="accountId" className="custom-select custom-select-md custom-select-lg custom-select-xl" onChange={this.handleChange} defaultValue={this.props.user.account.id}>
								{this.props.user.accounts.map((account, index) => <option key={index} value={account.id} label={account.name}>{account.name}</option>)}
							</Input>
						</FormGroup>
					</Form>
				)}
				{(this.state.error.data) ? (
					<Modal title={this.state.error.data.title} className="modal-dialog-error" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
						<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
					</Modal>
				) : null}
			</Fragment>
		);
	};
}

SwitchAccount.propTypes = propTypes;

SwitchAccount.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ updateUser, switchAccount }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchAccount);
