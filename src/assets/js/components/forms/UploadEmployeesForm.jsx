import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import FileField from '../fields/FileField';

import constants from '../../helpers/constants';

import { getEmployees, uploadEmployees } from '../../actions/employeeActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	handleClose: PropTypes.func.isRequired,
	handleInfoNoification: PropTypes.func.isRequired,
};

const defaultProps = {
	handleClose: () => {},
	handleInfoNoification: () => {},
};

class UploadEmployeesForm extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);
	}

	getInitialState = () => ({
		error: {},
		file: null,
	});

	handleChange = file => this.setState({ file, error: {} });

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions } = this.props;

		this.setState({ error: {} });

		if (this.form.isValid()) {
			const { file } = this.state;

			const payload = {
				file,
			};

			console.log('Called UploadEmployeesForm handleSubmit uploadEmployees');
			actions.uploadEmployees(payload)
				.then(() => {
					console.log('Called UploadEmployeesForm handleSubmit getEmployees');
					actions.getEmployees().catch(error => this.setState({ error }));
				})
				.then((response) => {
					/* Close the modal */
					this.props.handleClose();

					let message = '';

					message += `<p>${response.loadedEmployees.length} Employees were uploaded!</p>`;

					if (response.failedEmployees.length > 0) {
						message += `<p>${response.failedEmployees.length} Employees upload failed!</p><ul>`;

						message += response.failedEmployees.map((failedEmployee, index) => `<li key="${index}">${failedEmployee.data[0]} ${failedEmployee.data[1]}: <i>${failedEmployee.reason}</i></li>`);

						message += '</ul>';
					}

					/* Pass a message back up the rabbit hole to the parent component */
					this.props.handleInfoNotification(message);
				})
				.catch(error => this.setState({ error }));
		}
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} className="mb-5" /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<FileField fieldName="file" fieldLabel="File" handleChange={this.handleChange} valueMissing="Please provide a valid CSV file." tabIndex="1" fieldAccept=".csv, text/csv" fieldRequired={true} />
				<Button type="submit" color="primary" className="mt-5" title={routes.EMPLOYEES.UPLOAD.TITLE} tabIndex="2" block>{routes.EMPLOYEES.UPLOAD.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

UploadEmployeesForm.propTypes = propTypes;

UploadEmployeesForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getEmployees,
		uploadEmployees,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadEmployeesForm);
