import moment from 'moment';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';

import Header from '../../common/Header';

import Footer from '../../common/Footer';

import Toolbar from '../../common/Toolbar';

import config from '../../../helpers/config';

const routes = config.APP.ROUTES;

const propTypes = {
	week: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	user: {},
	week: {},
	authenticated: false,
};

class Overview extends Component {
	constructor(props) {
		super(props);

		let tokenExpired;

		const { history, authenticated } = this.props;

		if (!isEmpty(this.props.user)) {
			/* The tokens contains the expiry, so even though the users session storage still has authenticated as true, we need to make sure the token hasn't expired. */
			const token = jwtDecode(this.props.user.token);

			tokenExpired = moment().isAfter(moment.unix(token.exp));
		}

		if (!authenticated || tokenExpired) {
			history.push(routes.LOGIN.URI);
		}
	}

	componentDidMount = () => {
		if (isEmpty(this.props.week)) {
			return;
		}

		document.title = `${config.APP.TITLE}: ${routes.DASHBOARD.OVERVIEW.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.description.setAttribute('content', routes.DASHBOARD.OVERVIEW.META.DESCRIPTION);
			meta.keywords.setAttribute('content', routes.DASHBOARD.OVERVIEW.META.KEYWORDS);
			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}
	};

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Toolbar history={this.props.history} />
			<Footer history={this.props.history} />
		</Fragment>
	);
}

Overview.propTypes = propTypes;

Overview.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
	week: state.week,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
