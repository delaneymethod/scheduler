import PropTypes from 'prop-types';
import delay from 'lodash/delay';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import EmailField from '../fields/EmailField';

import logMessage from '../../helpers/logging';

import { serviceUpdates } from '../../actions/userActions';

const routes = config.APP.ROUTES;

const propTypes = {};

const defaultProps = {};

class ServiceUpdatesForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState = () => ({
		error: {},
		email: '',
		emailSent: false,
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions, history } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const { email } = this.state;

			const payload = {
				email,
			};

			logMessage('info', 'Called ServiceUpdateForm handleSubmit registerServiceUpdates');

			actions.serviceUpdates(payload)
				.then(() => this.setState(Object.assign(this.getInitialState(), { email, emailSent: true }), () => delay(() => this.form.reset(), 30)))
				.catch(error => this.setState({ error }));
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	successMessage = () => (this.state.emailSent ? <Alert color="success" message="Thank you for signing up to service updates!" /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={1} fieldAutoComplete="on" fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-4" id="submit" title={routes.HOME.CONTENT.SERVICE_UPDATES.CALL_TO_ACTION.TITLE} tabIndex="2" block>{routes.HOME.CONTENT.SERVICE_UPDATES.CALL_TO_ACTION.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

ServiceUpdatesForm.propTypes = propTypes;

ServiceUpdatesForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ serviceUpdates }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceUpdatesForm);
