import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import constants from '../../../helpers/constants';

const propTypes = {};

const defaultProps = {};

class Overview extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => ({});

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${constants.APP.ROUTES.DASHBOARD.OVERVIEW.TITLE} - ${constants.APP.ROUTES.DASHBOARD.HOME.TITLE}`;

		/*
		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	};

	componentDidUpdate = prevProps => ({});

	render = () => (
		<Row>
			<Col>
				<h2>{constants.APP.ROUTES.DASHBOARD.OVERVIEW.TITLE}</h2>
			</Col>
		</Row>
	);
}

Overview.propTypes = propTypes;

Overview.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
