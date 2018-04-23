/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import BlockUi from 'react-block-ui';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Alert, Col, Row } from 'reactstrap';

import { getUsers } from '../../../actions/userActions';
import { getShifts } from '../../../actions/shiftActions';

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
	})

	getUsers = () => {
		this.props.actions.getUsers()
			.then(users => this.setState(users))
			.catch((error) => {
				const { errors } = this.state;

				errors.push({
					title: `${error.data.error} Getting Users`,
					message: error.data.message,
				});

				this.setState({ errors });
			});
	}

	getShifts = () => {
		this.props.actions.getShifts()
			.then(shifts => this.setState(shifts))
			.catch((error) => {
				const { errors } = this.state;

				errors.push({
					title: `${error.data.error} Getting Shifts`,
					message: error.data.message,
				});

				this.setState({ errors });
			});
	}

	componentDidMount = () => {
		if (this.props.authenticated) {
			this.getUsers();

			this.getShifts();
		}
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.authenticated) {
			if (this.props.users !== prevProps.users) {
				this.getUsers();
			}

			if (this.props.shifts !== prevProps.shifts) {
				this.getShifts();
			}
		}
	}

	errorMessages = () => {
		if (this.state.errors.length) {
			const errors = this.state.errors.map((error, index) => <Alert color="danger" key={index}><strong>{error.title}</strong><br />{error.message}</Alert>);

			return <div>{errors}</div>;
		}

		return '';
	}

	render = () => (
		<BlockUi tag="div" blocking={this.state.ajaxLoading}>
			<Row>
				<Col>
					<h2>Dashboard</h2>
					{this.errorMessages()}
					{this.state.users}
					{this.state.shifts}
				</Col>
			</Row>
		</BlockUi>
	);
}

Dashboard.propTypes = {
	ajaxLoading: PropTypes.bool.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
	ajaxLoading: state.ajaxLoading,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ getUsers, getShifts }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
