import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import React, { Component } from 'react';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {
	children: null,
};

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => ({
		error: null,
		errorInfo: null,
	});

	componentDidCatch = (error, errorInfo) => this.setState({ error, errorInfo });

	render = () => {
		if (this.state.errorInfo) {
			return <Alert color="danger"><strong>{this.state.error && this.state.error.toString()}</strong><br /><br />The above error occurred:<br />{this.state.errorInfo.componentStack.split('\n').map((item, key) => <span key={key}>{item}<br/></span>)}<br />Please see the console log for more details.</Alert>;
		}

		/* No issues so just render the children */
		return this.props.children;
	};
}

ErrorBoundary.propTypes = propTypes;

ErrorBoundary.defaultProps = defaultProps;

export default ErrorBoundary;
