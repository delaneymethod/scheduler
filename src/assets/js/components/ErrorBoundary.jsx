/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import { Alert } from 'reactstrap';
import React, { Component } from 'react';

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

export default ErrorBoundary;
