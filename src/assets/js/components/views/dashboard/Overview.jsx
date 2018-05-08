import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import constants from '../../../helpers/constants';

import Header from '../../common/Header';

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Overview extends Component {
	constructor(props) {
		super(props);

		if (!this.props.authenticated) {
			this.props.history.push(constants.APP.ROUTES.LOGIN.URI);
		}

		this.state = this.getInitialState();
	}

	getInitialState = () => ({});

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${constants.APP.ROUTES.DASHBOARD.OVERVIEW.TITLE} - ${constants.APP.ROUTES.DASHBOARD.HOME.TITLE}`;

		/*
		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	};

	render = () => (
		<Row>
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<Header history={this.props.history} />
				<Row>
					<Col xs="12" sm="12" md="12" lg="12" xl="12">
						<h2>{constants.APP.ROUTES.DASHBOARD.OVERVIEW.TITLE}</h2>
					</Col>
				</Row>
			</Col>
		</Row>
	);
}

Overview.propTypes = propTypes;

Overview.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
