/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import React, { Component } from 'react';

class Dashboard extends Component {
	constructor(props) {
		super(props);

		if (!this.props.authenticated) {
			this.props.history.push('/login');
		}

		this.state = this.getInitialState();
	}

	getInitialState = () => ({})

	render = () => (
		<Row>
			<Col>
				<h2>Dashboard</h2>
			</Col>
		</Row>
	);
}

Dashboard.propTypes = {};

const mapStateToProps = (state, props) => ({
	ajaxLoading: state.ajaxLoading,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
