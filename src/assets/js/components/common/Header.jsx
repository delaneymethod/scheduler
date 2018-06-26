import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, Row, Navbar, NavItem, Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import WeekPicker from './WeekPicker';

import SwitchAccount from './SwitchAccount';

import constants from '../../helpers/constants';

import { logout } from '../../actions/authenticationActions';

const routes = constants.APP.ROUTES;

const dashboard = routes.DASHBOARD;

const propTypes = {
	user: PropTypes.object.isRequired,
};

const defaultProps = {
	user: {},
};

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleLogout = this.handleLogout.bind(this);

		this.handleProfileMenu = this.handleProfileMenu.bind(this);

		this.handleNavigationMenu = this.handleNavigationMenu.bind(this);
	}

	getInitialState = () => ({
		isModalOpen: false,
		shiftsIsActive: false,
		overviewIsActive: false,
		employeesIsActive: false,
		isProfileMenuPopoverOpen: false,
		isNavigationMenuPopoverOpen: false,
	});

	componentDidMount = () => {
		const { pathname } = this.props.history.location;

		this.setState({
			shiftsIsActive: (pathname === dashboard.SHIFTS.URI),
			overviewIsActive: (pathname === dashboard.OVERVIEW.URI),
			employeesIsActive: (pathname === dashboard.EMPLOYEES.URI),
		});
	};

	handleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	handleLogout = () => this.props.actions.logout().then(() => this.props.history.push(routes.LOGIN.URI));

	handleProfileMenu = () => this.setState({ isProfileMenuPopoverOpen: !this.state.isProfileMenuPopoverOpen });

	handleNavigationMenu = () => this.setState({ isNavigationMenuPopoverOpen: !this.state.isNavigationMenuPopoverOpen });

	render = () => (
		<Row>
			<Col className="bg-dark" xs="12" sm="12" md="12" lg="12" xl="12">
				<header className="pt-3 pl-0 pr-0 pb-3">
					<nav className="p-0 m-0 d-flex flex-md-row flex-column align-items-center">
						<h1 className="pt-1 pl-1 pr-1 pb-1"><a className="d-block" href={routes.HOME.URI} title={constants.APP.TITLE}>{constants.APP.TITLE}<span>.</span></a></h1>
						<WeekPicker history={this.props.history} />
						<Navbar className="p-0 m-0" color="dark" dark expand="xl">
							<button type="button" className="btn btn-nav btn-action navbar-toggler border-0 text-white" id="navigationMenu" title="Navigation" aria-label="Navigation" onClick={this.handleNavigationMenu}><i className="fa fa-fw fa-navicon" aria-hidden="true"></i></button>
							<div className="collapse navbar-collapse">
								<ul className="actions popover-menu">
									<NavItem className={`pr-3 ml-0 ${(this.state.employeesIsActive) ? 'active' : ''}`}><a href={dashboard.EMPLOYEES.URI} title={dashboard.EMPLOYEES.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-users" aria-hidden="true"></i>{dashboard.EMPLOYEES.TITLE}</a></NavItem>
									<NavItem className={`pr-3 ml-0 ${(this.state.shiftsIsActive) ? 'active' : ''}`}><a href={dashboard.SHIFTS.URI} title={dashboard.SHIFTS.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-th" aria-hidden="true"></i>{dashboard.SHIFTS.TITLE}</a></NavItem>
									<NavItem className={`pr-3 ml-0 ${(this.state.overviewIsActive) ? 'active' : ''}`}><a href={dashboard.OVERVIEW.URI} title={dashboard.OVERVIEW.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-bar-chart" aria-hidden="true"></i>{dashboard.OVERVIEW.TITLE}</a></NavItem>
								</ul>
							</div>
							<Popover placement="bottom" isOpen={this.state.isNavigationMenuPopoverOpen} target="navigationMenu" toggle={this.handleNavigationMenu}>
								<PopoverBody>
									<ul className="actions popover-menu">
										<NavItem className={`pr-3 ml-0 ${(this.state.employeesIsActive) ? 'active' : ''}`}><a href={dashboard.EMPLOYEES.URI} title={dashboard.EMPLOYEES.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-users" aria-hidden="true"></i>{dashboard.EMPLOYEES.TITLE}</a></NavItem>
										<NavItem className={`pr-3 ml-0 ${(this.state.shiftsIsActive) ? 'active' : ''}`}><a href={dashboard.SHIFTS.URI} title={dashboard.SHIFTS.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-th" aria-hidden="true"></i>{dashboard.SHIFTS.TITLE}</a></NavItem>
										<NavItem className={`pr-3 ml-0 ${(this.state.overviewIsActive) ? 'active' : ''}`}><a href={dashboard.OVERVIEW.URI} title={dashboard.OVERVIEW.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-fw fa-bar-chart" aria-hidden="true"></i>{dashboard.OVERVIEW.TITLE}</a></NavItem>
									</ul>
								</PopoverBody>
							</Popover>
							<ul className="actions profile-toggle ml-auto">
								<li className="nav-item ml-0">
									<button type="button" className="btn btn-nav btn-user ml-r border-0" id="profileMenu" title="Profile Menu" aria-label="Profile Menu" onClick={this.handleProfileMenu}>Hello, {this.props.user.firstName}<i className="pl-2 fa fa-fw fa-chevron-down" aria-hidden="true"></i></button>
									<Popover placement="bottom" isOpen={this.state.isProfileMenuPopoverOpen} target="profileMenu" toggle={this.handleProfileMenu}>
										<PopoverBody>
											<ul className="popover-menu">
												<li><button type="button" title="Switch Account" className="btn btn-action btn-nav border-0" onClick={this.handleModal}>Switch Account</button></li>
												<li><button type="button" title={routes.LOGOUT.TITLE} className="btn btn-action btn-nav border-0" onClick={this.handleLogout}>{routes.LOGOUT.TITLE}</button></li>
											</ul>
										</PopoverBody>
									</Popover>
								</li>
							</ul>
						</Navbar>
						<Modal title="Switch Account" className="modal-dialog" show={this.state.isModalOpen} onClose={this.handleModal}>
							<SwitchAccount />
						</Modal>
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
