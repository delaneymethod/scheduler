/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import { Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

const propTypes = {};

const defaultProps = {};

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => ({
		error: null,
		errorInfo: null,
	});

	componentDidMount = () => {};

	componentDidUpdate = prevProps => ({});

	componentDidCatch = (error, errorInfo) => this.setState({ error, errorInfo });

	render = () => {
		if (this.state.errorInfo) {
			return <Alert color="danger"><strong>{this.state.error && this.state.error.toString()}</strong><br /><br />The above error occurred:<br />{this.state.errorInfo.componentStack.split('\n').map((item, key) => <span key={key}>{item}<br/></span>)}<br />Please see the console log for more details.</Alert>;
		}

		/* Normally, just render children */
		return this.props.children;
	};
}

ErrorBoundary.propTypes = propTypes;

ErrorBoundary.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
