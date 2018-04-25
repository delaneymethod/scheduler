/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import BlockUi from 'react-block-ui';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Switch, Route } from 'react-router-dom';

import Home from './views/Home';
import Login from './views/Login';
import Logout from './views/Logout';
import Register from './views/Register';
import NotFoundPage from './views/NotFoundPage';
import ForgottenYourPassword from './views/ForgottenYourPassword';

import Dashboard from './views/dashboard/Dashboard';
import Welcome from './views/dashboard/Welcome';
import Overview from './views/dashboard/Overview';
import Shifts from './views/dashboard/shifts/Shifts';
import Employees from './views/dashboard/employees/Employees';

const propTypes = {
	ajaxLoading: PropTypes.bool.isRequired,
};

const defaultProps = {
	ajaxLoading: false,
};

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => ({});

	componentDidMount = () => {};

	componentDidUpdate = prevProps => ({});

	render = () => (
		<BlockUi tag="main" blocking={this.props.ajaxLoading}>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/logout' component={Logout} />
				<Route exact path='/register' component={Register} />
				<Route exact path='/forgotten-your-password' component={ForgottenYourPassword} />
				<Route exact path='/dashboard' component={Dashboard} />
				<Route exact path='/dashboard/welcome' component={Welcome} />
				<Route exact path='/dashboard/overview' component={Overview} />
				<Route exact path='/dashboard/shifts' component={Shifts} />
				<Route exact path='/dashboard/employees' component={Employees} />
				<Route component={NotFoundPage} />
			</Switch>
		</BlockUi>
	);
}

Main.propTypes = propTypes;

Main.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	ajaxLoading: state.ajaxLoading,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
