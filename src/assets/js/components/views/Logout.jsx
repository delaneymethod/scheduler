import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Alert, Col, Row } from 'reactstrap';

import constants from '../../helpers/constants';
import { logout } from '../../actions/authenticationActions';

import Header from '../Header';
import ErrorMessage from '../ErrorMessage';

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
			this.props.history.push(constants.APP.ROUTES.LOGIN.URI);
		}

		this.state = this.getInitialState();

		this.props.actions.logout()
			.then(() => this.props.history.push(constants.APP.ROUTES.LOGIN.URI))
			.catch((error) => {
				const { errors } = this.state;

				errors.push(error);

				this.setState({ errors });
			});
	}

	getInitialState = () => ({
		errors: [],
	});

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${constants.APP.ROUTES.LOGOUT.TITLE}`;

		/*
		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	};

	errorMessages = () => ((this.state.errors.length) ? this.state.errors.map((error, index) => <ErrorMessage key={index} error={error.data} />) : '');

	render = () => (
		<Row>
			<Col>
				<Header />
				<Row>
					<Col>
						<h2>{constants.APP.ROUTES.LOGOUT.TITLE}</h2>
						{this.errorMessages()}
					</Col>
				</Row>
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
