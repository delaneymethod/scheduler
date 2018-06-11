import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Form, Label, Input, FormGroup } from 'reactstrap';

import Modal from './Modal';

import constants from '../../helpers/constants';

import { updateUser } from '../../actions/userActions';

import { switchAccount } from '../../actions/accountActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	account: PropTypes.object.isRequired,
	accounts: PropTypes.array.isRequired,
};

const defaultProps = {
	account: {},
	accounts: [],
};

class SwitchAccount extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleChange = this.handleChange.bind(this);
	}

	getInitialState = () => ({
		error: {},
		isModalOpen: false,
	});

	handleChange = (event) => {
		const { actions } = this.props;

		const accountId = event.target.value;

		if (accountId !== this.props.account.id) {
			console.log('Called SwitchAccount handleChange switchAccount');
			actions.switchAccount({ accountId })
				.then(() => {
					this.props.user.account = this.props.accounts.map(({ id }) => accountId);

					console.log('Called SwitchAccount handleChange updateUser');
					actions.updateUser(this.props.user).then(() => window.location.reload());
				})
				.catch((error) => {
					this.setState({ error });

					this.handleModal();
				});
		}
	};

	handleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	render = () => (
		<Fragment>
			<Form>
				<FormGroup>
					<Label for="accountId">Account</Label>
					<Input type="select" name="accountId" id="accountId" className="custom-select custom-select-md custom-select-lg custom-select-xl" onChange={this.handleChange} defaultValue={this.props.account.id}>
						{this.props.accounts.map((account, index) => <option key={index} value={account.id} label={account.name} />)}
					</Input>
				</FormGroup>
			</Form>
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
		</Fragment>
	);
}

SwitchAccount.propTypes = propTypes;

SwitchAccount.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	account: state.user.account,
	accounts: state.user.accounts,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ updateUser, switchAccount }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchAccount);
