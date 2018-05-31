import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';

import Header from '../../common/Header';

import constants from '../../../helpers/constants';

const routes = constants.APP.ROUTES;

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Overview extends Component {
	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.OVERVIEW.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.DASHBOARD.OVERVIEW.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.DASHBOARD.OVERVIEW.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	};

	componentWillReceiveProps = (nextProps) => {
		const { history, authenticated } = nextProps;

		if (!authenticated) {
			history.push(routes.LOGIN.URI);
		}
	};

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
		</Fragment>
	);
}

Overview.propTypes = propTypes;

Overview.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
