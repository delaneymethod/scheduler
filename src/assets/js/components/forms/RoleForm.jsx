import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import TextField from '../fields/TextField';

import logMessage from '../../helpers/logging';

import { getRoles, createRole } from '../../actions/roleActions';

const routes = config.APP.ROUTES;

const propTypes = {
	roles: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	roles: [],
	handleClose: () => {},
	handleSuccessNotification: () => {},
};

class RoleForm extends Component {
	constructor(props) {
		super(props);

		this.roleForm = null;

		this.state = this.getInitialState();

		this.handleRoleBlur = this.handleRoleBlur.bind(this);

		this.handleGetRoles = this.handleGetRoles.bind(this);

		this.handleRoleDelete = this.handleRoleDelete.bind(this);

		this.handleRoleSubmit = this.handleRoleSubmit.bind(this);

		this.handleRoleChange = this.handleRoleChange.bind(this);
	}

	getInitialState = () => ({
		error: {},
		roleName: '',
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleRoleValidateFields = debounce(this.handleRoleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.roleForm && this.roleForm.validateFields(event.target));
	};

	handleRoleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleRoleBlur = async event => this.handleRoleValidateFields(event.currentTarget);

	handleGetRoles = () => {
		logMessage('info', 'Called RoleForm handleGetRoles getRoles');

		return this.props.actions.getRoles().catch(error => Promise.reject(error));
	};

	handleRoleDelete = event => logMessage('info', 'FIXME - Delete Role');

	handleRoleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ error: {} });

		const { actions } = this.props;

		await this.roleForm.validateFields();

		if (this.roleForm.isValid()) {
			let payload;

			const { roleName } = this.state;

			if (this.props.editMode) {
				logMessage('info', 'FIXME - Update Role');
			} else {
				payload = {
					roleName,
				};

				/* Creates a new role */
				logMessage('info', 'Called RoleForm handleSubmit createRole');

				actions.createRole(payload)
					.then(() => this.handleGetRoles())
					.then(() => {
						/* Close the modal */
						this.props.handleClose(roleName);

						/* FIXME - Make messages constants in config */
						const message = '<p>Role was created!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					.catch(error => this.setState({ error }));
			}
		}
	};

	handleRoleValidateFields = target => ((this.roleForm && target) ? this.roleForm.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.roleForm = el; }} noValidate>
				<TextField fieldName="roleName" fieldLabel="Role Name" fieldValue={this.state.roleName} fieldPlaceholder="e.g. Manager" handleChange={this.handleRoleChange} handleBlur={this.handleRoleBlur} valueMissing="Please provide a valid role name." fieldTabIndex={1} fieldRequired={true} showIsDuplicate isDuplicateHaystack={this.props.roles.map(data => data.roleName)} />
				{(this.props.editMode) ? (
					<Button type="button" color="primary" className="mt-4" id="submitUpdateRole" title={routes.ROLES.UPDATE.TITLE} tabIndex="2" onClick={this.handleRoleSubmit} block>{routes.ROLES.UPDATE.TITLE}</Button>
				) : (
					<Button type="button" color="primary" className="mt-4" id="submitCreateRole" title={routes.ROLES.CREATE.TITLE} tabIndex="2" onClick={this.handleRoleSubmit} block>{routes.ROLES.CREATE.TITLE}</Button>
				)}
			</FormWithConstraints>
		</Fragment>
	);
}

RoleForm.propTypes = propTypes;

RoleForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	roles: state.roles,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRoles,
		createRole,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleForm);
