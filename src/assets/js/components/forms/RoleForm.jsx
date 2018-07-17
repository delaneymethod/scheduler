import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import TextField from '../fields/TextField';

import constants from '../../helpers/constants';

import { getRoles, createRole } from '../../actions/roleActions';

const routes = constants.APP.ROUTES;

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

		this.form = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleDelete = this.handleDelete.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);
	}

	getInitialState = () => ({
		error: {},
		roleName: '',
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1000ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1000);
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleDelete = event => console.log('FIXME - Delete Role');

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ error: {} });

		const { actions } = this.props;

		await this.form.validateFields();

		if (this.form.isValid()) {
			let payload;

			const { roleName } = this.state;

			if (this.props.editMode) {
				console.log('FIXME - Update Role');
			} else {
				payload = {
					roleName,
				};

				/* Creates a new role */
				console.log('Called RoleForm handleSubmit createRole');
				actions.createRole(payload)
					.then(() => {
						console.log('Called RoleForm handleSubmit getRoles');
						actions.getRoles()
							.then(() => {
								/* Close the modal */
								this.props.handleClose(roleName);

								const message = '<p>Role was created!</p>';

								/* Pass a message back up the rabbit hole to the parent component */
								this.props.handleSuccessNotification(message);
							})
							.catch(error => this.setState({ error }));
					})
					.catch(error => this.setState({ error }));
			}
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<TextField fieldName="roleName" fieldLabel="Role Name" fieldValue={this.state.roleName} fieldPlaceholder="e.g. Manager" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid role name." fieldTabIndex={1} fieldRequired={true} showIsDuplicate isDuplicateHaystack={this.props.roles.map(data => data.roleName)} />
				{(this.props.editMode) ? (
					<Button type="submit" color="primary" className="mt-4" title={routes.ROLES.UPDATE.TITLE} tabIndex="2" block>{routes.ROLES.UPDATE.TITLE}</Button>
				) : (
					<Button type="submit" color="primary" className="mt-4" title={routes.ROLES.CREATE.TITLE} tabIndex="2" block>{routes.ROLES.CREATE.TITLE}</Button>
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