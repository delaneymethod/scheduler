import $ from 'jquery';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Nav, Col, Row, Navbar, NavItem } from 'reactstrap';

import constants from '../../helpers/constants';

import { logout } from '../../actions/authenticationActions';

const propTypes = {
	user: PropTypes.object.isRequired,
};

const defaultProps = {
	user: {},
};

class Header extends Component {
	constructor(props) {
		super(props);

		this.handleLogout = this.handleLogout.bind(this);
	}

	componentDidMount = () => {
		$('.navbar-menu-toggle').popover({
			html: true,
			trigger: 'focus',
			placement: 'bottom',
			content: () => $('#navbar-menu').html(),
		});
	}

	handleLogout = (event) => {
		event.preventDefault();

		this.props.actions.logout().then(() => this.props.history.push(constants.APP.ROUTES.LOGIN.URI));
	};

	render = () => (
		<Row>
			<Col className="bg-dark" xs="12" sm="12" md="12" lg="12" xl="12">
				<header className="pt-3 pl-0 pr-0 pb-3">
					<nav className="p-0 m-0 d-flex flex-md-row flex-column align-items-center">
						<h1 className="pt-1 pl-1 pr-1 pb-1"><a className="d-block" href={constants.APP.ROUTES.HOME.URI} title={constants.APP.TITLE}>{constants.APP.TITLE}<span>.</span></a></h1>
						<div className="week-toggle p-0 ml-md-3 mr-md-3 ml-lg-4 mr-lg-4 ml-xl-5 mr-xl-5">
							<button type="button" name="previous-week" className="btn-toggle border-0"><i className="fa fa-caret-left" aria-hidden="true"></i></button>
							<span><strong>Mon</strong>, Mar 12 - <strong>Sun</strong>, Mar 19</span>
							<button type="button"name="next-week" className="btn-toggle border-0"><i className="fa fa-caret-right" aria-hidden="true"></i></button>
						</div>
						<Navbar className="p-0 m-0" color="dark" dark expand="xl">
							<button type="button" name="" className="navbar-toggler navbar-menu-toggle btn btn-nav btn-action border-0" aria-label="Toggle Navigation"><i className="fa fa-navicon" aria-hidden="true"></i></button>
							<div className="collapse navbar-collapse" id="navbar-menu">
								<ul className="actions popover-menu">
									<NavItem className={(constants.APP.ROUTES.DASHBOARD.EMPLOYEES.URI === this.props.history.location.pathname) ? 'pr-3 ml-0 active' : 'pr-3 ml-0'}><a href={constants.APP.ROUTES.DASHBOARD.EMPLOYEES.URI} title={constants.APP.ROUTES.DASHBOARD.EMPLOYEES.TITLE} className="btn btn-action btn-nav border-0"><i className="fa fa-users" aria-hidden="true"></i> {constants.APP.ROUTES.DASHBOARD.EMPLOYEES.TITLE}</a></NavItem>
									<NavItem className={(constants.APP.ROUTES.DASHBOARD.SHIFTS.URI === this.props.history.location.pathname) ? 'pr-3 ml-0 active' : 'pr-3 ml-0'}><a href={constants.APP.ROUTES.DASHBOARD.SHIFTS.URI} title={constants.APP.ROUTES.DASHBOARD.SHIFTS.TITLE} className="btn btn-action btn-nav border-0"><i className="fa fa-th" aria-hidden="true"></i> {constants.APP.ROUTES.DASHBOARD.SHIFTS.TITLE}</a></NavItem>
									<NavItem className={(constants.APP.ROUTES.DASHBOARD.OVERVIEW.URI === this.props.history.location.pathname) ? 'pr-3 ml-0 active' : 'pr-3 ml-0'}><a href={constants.APP.ROUTES.DASHBOARD.OVERVIEW.URI} title={constants.APP.ROUTES.DASHBOARD.OVERVIEW.TITLE} className="btn btn-action btn-nav border-0"><i className="fa fa-bar-chart" aria-hidden="true"></i> {constants.APP.ROUTES.DASHBOARD.OVERVIEW.TITLE}</a></NavItem>
								</ul>
							</div>
							<ul className="actions profile-toggle ml-auto">
								<NavItem className="nav-item pr-3 ml-0"><a href="" title="Publish" className="btn btn-nav btn-primary pl-5 pr-5 pl-md-4 pr-md-4 pl-lg-5 pr-lg-5 border-0">Publish</a></NavItem>
								<li className="nav-item dropdown ml-0">
									<a href="" title={`Hello, ${this.props.user.firstName}`} className="btn btn-nav btn-user ml-r dropdown-toggle border-0" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Hello, {this.props.user.firstName}</a>
									<div className="dropdown-menu dropdown-menu-right">
										<a href="" title="" className="dropdown-item">Another action</a>
										<div className="dropdown-divider"></div>
										<a href="" title={constants.APP.ROUTES.LOGOUT.TITLE} className="dropdown-item" onClick={this.handleLogout}>{constants.APP.ROUTES.LOGOUT.TITLE}</a>
									</div>
								</li>
							</ul>
						</Navbar>
					</nav>
				</header>
			</Col>
		</Row>
	);
}

Header.propTypes = propTypes;

Header.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ logout }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
