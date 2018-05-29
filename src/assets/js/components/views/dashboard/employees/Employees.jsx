import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';

import Header from '../../../common/Header';

import Toolbar from '../../../common/Toolbar';

import constants from '../../../../helpers/constants';

const routes = constants.APP.ROUTES;

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Employees extends Component {
	constructor(props) {
		super(props);

		if (!this.props.authenticated) {
			this.props.history.push(routes.LOGIN.URI);
		}

		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.EMPLOYEES.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	}

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Toolbar />
		</Fragment>
	);
}

Employees.propTypes = propTypes;

Employees.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
