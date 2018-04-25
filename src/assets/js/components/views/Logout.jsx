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

import { logout } from '../../actions/authenticationActions';

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Logout extends Component {
	constructor(props) {
		super(props);

		if (!this.props.authenticated) {
			this.props.history.push('/login');
		}

		this.state = this.getInitialState();

		this.props.actions.logout()
			.then(() => this.props.history.push('/login'))
			.catch((error) => {
				const { errors } = this.state;

				errors.push({
					title: 'Error logging out',
					message: `${error.data.error}: ${error.data.message}`,
				});

				this.setState({ errors });
			});
	}

	getInitialState = () => ({
		errors: [],
	});

	componentDidMount = () => {
		document.title = 'Scheduler';

		/*
		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	};

	componentDidUpdate = prevProps => ({});

	errorMessages = () => {
		if (this.state.errors.length) {
			const errors = this.state.errors.map((error, index) => <Alert color="danger" key={index}><span className="alert-heading">{error.title}</span>{error.message}</Alert>);

			return <div>{errors}</div>;
		}

		return '';
	};

	render = () => (
		<Row>
			<Col>
				<h2>Logging Out&hellip;</h2>
				{this.errorMessages()}
			</Col>
		</Row>
	);
}

Logout.propTypes = propTypes;

Logout.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ logout }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
