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

import Header from '../../Header';
import ErrorMessage from '../../ErrorMessage';

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

	/* TODO - Refactor so this is a component e.g. Users, which makes the API call and throws an error boundary component for any issues */
	getUsers = () => {
		this.props.actions.getUsers()
			.then(users => this.setState(users))
			.catch((error) => {
				const { errors } = this.state;

				errors.push(error);

				this.setState({ errors });
			});
	};

	/* TODO - Refactor so this is a component e.g. Shifts, which makes the API call and throws an error boundary component for any issues */
	getShifts = () => {
		this.props.actions.getShifts()
			.then(shifts => this.setState(shifts))
			.catch((error) => {
				const { errors } = this.state;

				errors.push(error);

				this.setState({ errors });
			});
	};

	errorMessages = () => ((this.state.errors.length) ? this.state.errors.map((error, index) => <ErrorMessage key={index} error={error.data} />) : '');

	render = () => (
		<Row>
			<Col>
				<Header />
				<Row>
					<Col>
						<h2>Dashboard</h2>
						{this.errorMessages()}
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="3" lg="3" xl="3">
						<h3>Users</h3>
						{this.state.users}
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="3" lg="3" xl="3">
						<h3>Shifts</h3>
						{this.state.shifts}
					</Col>
				</Row>
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
