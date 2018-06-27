import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import EmailField from '../fields/EmailField';

import constants from '../../helpers/constants';

import { forgottenYourPassword } from '../../actions/authenticationActions';

const routes = constants.APP.ROUTES;

const propTypes = {};

const defaultProps = {};

class ForgottenYourPasswordForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleScrollToTop = this.handleScrollToTop.bind(this);
	}

	getInitialState = () => ({
		error: {},
		email: '',
		emailSent: false,
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1000ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1000);
	};

	handleChange = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const payload = {
				email: this.state.email,
			};

			/* eslint-disable no-param-reassign */
			console.log('Called ForgottenYourPasswordForm handleSubmit forgottenYourPassword');
			actions.forgottenYourPassword(payload)
				.then(() => {
					this.setState(Object.assign(this.getInitialState(), { emailSent: true }));

					this.handleScrollToTop();
				})
				.catch((error) => {
					/* Set a more friendlier error message if its a 404 */
					if (error.data.code === 404) {
						error.data.message = routes.FORGOTTEN_YOUR_PASSWORD.MESSAGES.NOT_FOUND;
					}

					this.setState({ error });
				});
			/* eslint-enable no-param-reassign */
		}
	};

	handleScrollToTop = (event) => {
		event.preventDefault();

		const scrollToTop = window.setInterval(() => {
			const pos = window.pageYOffset;

			if (pos > 0) {
				window.scrollTo(0, pos - 20);
			} else {
				window.clearInterval(scrollToTop);
			}
		}, 16);
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	successMessage = () => (this.state.emailSent ? <Alert color="success" message={`An email has been sent to <strong>${this.state.email}</strong>. Please follow the link in this email message to set your password.`} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<EmailField fieldValue={this.state.email} handleChange={this.handleChange} handleBlur={this.handleBlur} fieldTabIndex={1} fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-4" title={routes.FORGOTTEN_YOUR_PASSWORD.TITLE} tabIndex="2" disabled={this.state.emailSent} block>{routes.FORGOTTEN_YOUR_PASSWORD.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

ForgottenYourPasswordForm.propTypes = propTypes;

ForgottenYourPasswordForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ forgottenYourPassword }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenYourPasswordForm);
