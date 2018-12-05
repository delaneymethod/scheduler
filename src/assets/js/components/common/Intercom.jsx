import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import logMessage from '../../helpers/logging';

import { updateCookieConsent } from '../../actions/cookieConsentActions';

const propTypes = {
	user: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	authenticated: PropTypes.bool.isRequired,
	cookieConsent: PropTypes.bool.isRequired,
};

const defaultProps = {
	user: {},
	employees: [],
	cookieConsent: false,
	authenticated: false,
};

class Intercom extends Component {
	constructor(props) {
		super(props);

		this.handlePing = this.handlePing.bind(this);

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
		logMessage('info', 'Called Intercom handleLoadScript');

		/* eslint-disable no-eval */
		eval(`(function() {var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${window.intercomSettings.app_id}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}l();}})()`);
		/* eslint-enable no-eval */

		this.handlePing();
	};

	handlePing = () => {
		logMessage('info', 'Called Intercom handlePing');

		if (this.props.authenticated && this.props.employees.length > 0) {
			logMessage('info', 'Called Intercom handlePing - Logged In');

			const {
				email,
				account,
				accounts,
				intercomUserHash,
			} = this.props.user;

			/* Lets try and match up the logged in user against the list of employees to find additional user details */
			const accountEmployee = this.props.employees.filter(data => data.employee.email === email)
				.shift();

			const { mobile, firstName, lastName } = accountEmployee.employee;

			if (!isEmpty(intercomUserHash)) {
				window.intercomSettings = Object.assign(window.intercomSettings, {
					email,
					user_hash: intercomUserHash,
				});
			}

			window.Intercom('boot', {
				email,
				phone: mobile,
				company: account,
				companies: accounts,
				name: `${firstName} ${lastName}`,
				app_id: window.intercomSettings.app_id,
			});
		} else {
			logMessage('info', 'Called Intercom handlePing - Guest');

			window.Intercom('boot', {
				app_id: window.intercomSettings.app_id,
			});
		}
	};

	render = () => '';
}

Intercom.propTypes = propTypes;

Intercom.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
	employees: state.employees,
	cookieConsent: state.cookieConsent,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		updateCookieConsent,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Intercom);
