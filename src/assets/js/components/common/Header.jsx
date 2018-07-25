import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, Row, Navbar, NavItem, Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import WeekPicker from './WeekPicker';

import SwitchAccount from './SwitchAccount';

import constants from '../../helpers/constants';

import { logout } from '../../actions/authenticationActions';

import { addClass, removeClass } from '../../helpers/classes';

const routes = constants.APP.ROUTES;

const dashboard = routes.DASHBOARD;

const propTypes = {
	user: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
};

const defaultProps = {
	user: {},
	rota: {},
};

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleLogout = this.handleLogout.bind(this);

		this.handleProfileMenu = this.handleProfileMenu.bind(this);

		this.handleNavigationMenu = this.handleNavigationMenu.bind(this);
	}

	getInitialState = () => ({
		rolesIsActive: false,
		overviewIsActive: false,
		employeesIsActive: false,
		isProfileMenuPopoverOpen: false,
		isNavigationMenuPopoverOpen: false,
	});

	componentDidMount = () => {
		const { pathname } = this.props.history.location;

		this.setState({
			rolesIsActive: (pathname === dashboard.ROLES.URI),
			overviewIsActive: (pathname === dashboard.OVERVIEW.URI),
			employeesIsActive: (pathname === dashboard.EMPLOYEES.URI),
		});
	};

	handleLogout = () => this.props.actions.logout().then(() => this.props.history.push(routes.LOGIN.URI));

	handleProfileMenu = () => this.setState({ isProfileMenuPopoverOpen: !this.state.isProfileMenuPopoverOpen });

	handleNavigationMenu = (event) => {
		if (event.currentTarget.classList.contains('cross')) {
			removeClass(event.currentTarget, 'cross');
		} else {
			addClass(event.currentTarget, 'cross');
		}

		this.setState({ isNavigationMenuPopoverOpen: !this.state.isNavigationMenuPopoverOpen });
	};

	render = () => (
		<Row>
			<Col className="bg-dark" xs="12" sm="12" md="12" lg="12" xl="12">
				<header className="pt-3 pl-0 pr-0 pb-3">
					<nav className="p-0 m-0">
						<Row>
							<Col className="d-flex justify-content-center justify-content-lg-start" xs="12" sm="12" md="12" lg="2" xl="2">
								<h1 className="m-0 p-0 align-self-center text-lg-left"><a className="d-block" href={routes.HOME.URI} title={constants.APP.TITLE}>{constants.APP.TITLE}<span>.</span></a></h1>
							</Col>
							<Col className="ml-lg-0 mr-lg-0 pl-lg-0 pr-lg-0 mt-3 mt-lg-0" xs="12" sm="12" md="5" lg="3" xl="2">
								<WeekPicker history={this.props.history} />
							</Col>
							<Col className="mt-3 mt-lg-0" xs="12" sm="12" md="7" lg="7" xl="8">
								<Navbar className="row p-0 m-0" color="dark" dark expand="xl">
									<button type="button" className="col-12 col-sm-12 col-md-2 btn btn-nav btn-action navbar-toggler pl-3 pr-3 border-0 lines-button x text-white font-weight-normal" id="navigationMenu" title="Navigation" aria-label="Navigation" onClick={event => this.handleNavigationMenu(event)}>
										<span className="lines"></span>
									</button>
									<Popover placement="bottom" isOpen={this.state.isNavigationMenuPopoverOpen} target="navigationMenu" toggle={this.handleNavigationMenu}>
										<PopoverBody>
											<ul className="actions popover-menu">
												{(!isEmpty(this.props.rota)) ? (
													<NavItem className={`pr-3 ml-0 ${(this.state.employeesIsActive) ? 'active' : ''}`}><a href={dashboard.EMPLOYEES.URI} title={dashboard.EMPLOYEES.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-users" aria-hidden="true"></i>{dashboard.EMPLOYEES.TITLE}</a></NavItem>
												) : null}
												<NavItem className={`pr-3 ml-0 ${(this.state.rolesIsActive) ? 'active' : ''}`}><a href={dashboard.ROLES.URI} title={dashboard.ROLES.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-th" aria-hidden="true"></i>{dashboard.ROLES.TITLE}</a></NavItem>
												<NavItem className={`pr-3 ml-0 ${(this.state.overviewIsActive) ? 'active' : ''}`}><a href={dashboard.OVERVIEW.URI} title={dashboard.OVERVIEW.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-bar-chart" aria-hidden="true"></i>{dashboard.OVERVIEW.TITLE}</a></NavItem>
											</ul>
										</PopoverBody>
									</Popover>
									<div className="collapse navbar-collapse m-0 p-0 col-lg-6 col-xl-6">
										<ul className="actions popover-menu">
											<NavItem className={`pr-3 ml-0 ${(this.state.employeesIsActive) ? 'active' : ''}`}>
												{(!isEmpty(this.props.rota)) ? (
													<a href={dashboard.EMPLOYEES.URI} title={dashboard.EMPLOYEES.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-users" aria-hidden="true"></i>{dashboard.EMPLOYEES.TITLE}</a>
												) : (
													<a href="" title={dashboard.EMPLOYEES.TITLE} className="btn btn-action btn-nav border-0 disabled" aria-disabled="true"><i className="pr-2 fa fa-fw fa-users" aria-hidden="true"></i>{dashboard.EMPLOYEES.TITLE}</a>
												)}
											</NavItem>
											<NavItem className={`pr-3 ml-0 ${(this.state.rolesIsActive) ? 'active' : ''}`}><a href={dashboard.ROLES.URI} title={dashboard.ROLES.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-th" aria-hidden="true"></i>{dashboard.ROLES.TITLE}</a></NavItem>
											<NavItem className={`pr-3 ml-0 ${(this.state.overviewIsActive) ? 'active' : ''}`}><a href={dashboard.OVERVIEW.URI} title={dashboard.OVERVIEW.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-bar-chart" aria-hidden="true"></i>{dashboard.OVERVIEW.TITLE}</a></NavItem>
										</ul>
									</div>
									<ul className="mt-3 mt-md-0 actions profile-toggle col-12 col-sm-12 col-md-10 col-lg-6 col-xl-6">
										<li className="col-12 col-sm-6 col-md-auto mr-sm-3 pl-0 pr-0 pl-sm-3 p-md-0 mb-3 mb-sm-0">
											<SwitchAccount inline history={this.props.history} />
										</li>
										<li className="col-12 col-sm-6 col-md-auto p-0 text-right">
											<button type="button" className="btn btn-nav btn-user border-0 col-12 col-sm-auto" id="profileMenu" title="Profile Menu" aria-label="Profile Menu" onClick={this.handleProfileMenu}>Hello, {this.props.user.firstName}<i className="pl-2 fa fa-fw fa-chevron-down" aria-hidden="true"></i></button>
											<Popover placement="bottom" isOpen={this.state.isProfileMenuPopoverOpen} target="profileMenu" toggle={this.handleProfileMenu}>
												<PopoverBody>
													<ul className="popover-menu">
														<li><a href={dashboard.SETTINGS.URI} title={dashboard.SETTINGS.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-cog" aria-hidden="true"></i>{dashboard.SETTINGS.TITLE}</a></li>
														<li><button type="button" title={routes.LOGOUT.TITLE} className="btn btn-action btn-nav border-0" onClick={this.handleLogout}><i className="pr-2 fa fa-fw fa-sign-out" aria-hidden="true"></i>{routes.LOGOUT.TITLE}</button></li>
													</ul>
												</PopoverBody>
											</Popover>
										</li>
									</ul>
								</Navbar>
							</Col>
						</Row>
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
	rota: state.rota,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ logout }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
