import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import gtmParts from 'react-google-tag-manager';

import config from '../../helpers/config';

import logMessage from '../../helpers/logging';

const gtm = gtmParts({
	scheme: 'https:',
	id: config.APP.TRACKING.GOOGLE,
});

const propTypes = {
	cookieConsent: PropTypes.bool.isRequired,
};

const defaultProps = {
	cookieConsent: false,
};

class GoogleTagManager extends Component {
	constructor(props) {
		super(props);

		this.handleLoadScript = debounce(this.handleLoadScript.bind(this), 1500);
	}

	componentDidMount = () => ((this.props.cookieConsent) ? this.handleLoadScript() : {});

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.cookieConsent !== prevProps.cookieConsent) {
			if (this.props.cookieConsent) {
				this.handleLoadScript();
			}
		}
	};

	handleLoadScript = () => {
		logMessage('info', 'Called GoogleTagManager handleLoadScript');

		/* eslint-disable no-eval */
		eval(gtm.scriptAsHTML().replace(/<\/?script>/g, ''));
		/* eslint-enable no-eval */
	};

	render = () => '';
}

GoogleTagManager.propTypes = propTypes;

GoogleTagManager.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	cookieConsent: state.cookieConsent,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GoogleTagManager);
