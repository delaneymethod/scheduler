/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Alert, Col, Row } from 'reactstrap';

import { getUsers } from '../../../actions/userActions';
import { getShifts } from '../../../actions/shiftActions';

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Dashboard extends Component {
	constructor(props) {
		super(props);

		if (!this.props.authenticated) {
			this.props.history.push('/login');
		}

		this.state = this.getInitialState();
	}

	getInitialState = () => ({
		users: [],
		shifts: [],
		errors: [],
	});

	componentDidMount = () => {
		document.title = 'Scheduler: Dashboard';

		/*
		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/

		if (this.props.authenticated) {
			this.getUsers();

			this.getShifts();
		}
	};

	componentDidUpdate = (prevProps) => {
		if (this.props.authenticated) {
			if (this.props.users !== prevProps.users) {
				this.getUsers();
			}

			if (this.props.shifts !== prevProps.shifts) {
				this.getShifts();
			}
		}
	};

	getUsers = () => {
		this.props.actions.getUsers()
			.then(users => this.setState(users))
			.catch((error) => {
				const { errors } = this.state;

				errors.push({
					title: `GET /users ${error.data.error}`,
					message: error.data.message,
				});

				this.setState({ errors });
			});
	};

	getShifts = () => {
		this.props.actions.getShifts()
			.then(shifts => this.setState(shifts))
			.catch((error) => {
				const { errors } = this.state;

				errors.push({
					title: `GET /shifts ${error.data.error}`,
					message: error.data.message,
				});

				this.setState({ errors });
			});
	};

	errorMessages = () => {
		if (this.state.errors.length) {
			const errors = this.state.errors.map((error, index) => <Alert color="danger" key={index}><strong>{error.title}</strong><br />{error.message}</Alert>);

			return <div>{errors}</div>;
		}

		return '';
	};

	render = () => (
		<Row>
			<Col>
				<h2>Dashboard</h2>
				{this.errorMessages()}
				{this.state.users}
				{this.state.shifts}
			</Col>
		</Row>
	);
}

Dashboard.propTypes = propTypes;

Dashboard.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ getUsers, getShifts }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
