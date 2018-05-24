import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';

import constants from '../../../helpers/constants';

import Header from '../../common/Header';

const routes = constants.APP.ROUTES;

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Overview extends Component {
	constructor(props) {
		super(props);

		if (!this.props.authenticated) {
			this.props.history.push(routes.LOGIN.URI);
		}

		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.OVERVIEW.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		/*
		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	}

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
