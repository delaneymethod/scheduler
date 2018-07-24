import moment from 'moment';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';

import Header from '../../common/Header';

import Toolbar from '../../common/Toolbar';

import constants from '../../../helpers/constants';

const routes = constants.APP.ROUTES;

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

class Roles extends Component {
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

		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.ROLES.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.description.setAttribute('content', routes.DASHBOARD.ROLES.META.DESCRIPTION);
			meta.keywords.setAttribute('content', routes.DASHBOARD.ROLES.META.KEYWORDS);
			meta.author.setAttribute('content', constants.APP.AUTHOR.TITLE);
		}
	};

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Toolbar history={this.props.history} />
		</Fragment>
	);
}

Roles.propTypes = propTypes;

Roles.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
	week: state.week,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Roles);
