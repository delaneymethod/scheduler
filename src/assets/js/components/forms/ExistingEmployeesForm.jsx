import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import config from '../../helpers/config';

const routes = config.APP.ROUTES;

const propTypes = {
	handleClose: PropTypes.func.isRequired,
	handleInfoNoification: PropTypes.func.isRequired,
};

const defaultProps = {
	handleClose: () => {},
	handleInfoNoification: () => {},
};

class ExistingEmployeesForm extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => ({
		error: {},
	});

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} className="mb-5" /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<Button type="submit" color="primary" className="mt-5" id="submitExistingEmployees" title={routes.EMPLOYEES.EXISTING.TITLE} tabIndex="2" block>{routes.EMPLOYEES.EXISTING.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

ExistingEmployeesForm.propTypes = propTypes;

ExistingEmployeesForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExistingEmployeesForm);
