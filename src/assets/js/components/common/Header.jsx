import $ from 'jquery';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, Row, Navbar, NavItem } from 'reactstrap';

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
	}

	getInitialState = () => ({
		isModalOpen: false,
		shiftsIsActive: false,
		overviewIsActive: false,
		employeesIsActive: false,
	});

	componentDidMount = () => {
		const { pathname } = this.props.history.location;

		this.setState({
			shiftsIsActive: (pathname === dashboard.SHIFTS.URI),
			overviewIsActive: (pathname === dashboard.OVERVIEW.URI),
			employeesIsActive: (pathname === dashboard.EMPLOYEES.URI),
		});

		$('.btn-navigation-popover').popover({
			html: true,
			trigger: 'focus',
			placement: 'bottom',
			content: () => $('#navigation-list').html(),
		});

		$('.btn-profile-popover').popover({
			html: true,
			trigger: 'focus',
			placement: 'bottom',
			content: () => $('#profile-list').html(),
		});

		/* Bit hacky and not the "React Way" but because we are using Popovers, event handlers are not binded! */
		$(document).on('shown.bs.popover', () => {
			$('.logout, .switch-account').bind('click');

			$('.logout').on('click', () => this.handleLogout());

			$('.switch-account').on('click', () => this.handleModal());
		});
	};

	handleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	handleLogout = () => this.props.actions.logout().then(() => this.props.history.push(routes.LOGIN.URI));

	render = () => (
		<Row>
			<Col className="bg-dark" xs="12" sm="12" md="12" lg="12" xl="12">
				<header className="pt-3 pl-0 pr-0 pb-3">
					<nav className="p-0 m-0 d-flex flex-md-row flex-column align-items-center">
						<h1 className="pt-1 pl-1 pr-1 pb-1"><a className="d-block" href={routes.HOME.URI} title={constants.APP.TITLE}>{constants.APP.TITLE}<span>.</span></a></h1>
						<WeekPicker />
						<Navbar className="p-0 m-0" color="dark" dark expand="xl">
							<button type="button" className="btn btn-nav btn-action btn-navigation-popover navbar-toggler border-0 text-white" aria-label="Toggle Navigation"><i className="fa fa-navicon" aria-hidden="true"></i></button>
							<div className="collapse navbar-collapse" id="navigation-list">
								<ul className="actions popover-menu">
									<NavItem className={(this.state.employeesIsActive) ? 'pr-3 ml-0 active' : 'pr-3 ml-0'}><a href={dashboard.EMPLOYEES.URI} title={dashboard.EMPLOYEES.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-users" aria-hidden="true"></i>{dashboard.EMPLOYEES.TITLE}</a></NavItem>
									<NavItem className={(this.state.shiftsIsActive) ? 'pr-3 ml-0 active' : 'pr-3 ml-0'}><a href={dashboard.SHIFTS.URI} title={dashboard.SHIFTS.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-th" aria-hidden="true"></i>{dashboard.SHIFTS.TITLE}</a></NavItem>
									<NavItem className={(this.state.overviewIsActive) ? 'pr-3 ml-0 active' : 'pr-3 ml-0'}><a href={dashboard.OVERVIEW.URI} title={dashboard.OVERVIEW.TITLE} className="btn btn-action btn-nav border-0"><i className="pr-2 fa fa-bar-chart" aria-hidden="true"></i>{dashboard.OVERVIEW.TITLE}</a></NavItem>
								</ul>
							</div>
							<ul className="actions profile-toggle ml-auto">
								<NavItem className="nav-item pr-3 ml-0"><a href="" title="Publish" className="btn btn-nav btn-primary pl-5 pr-5 pl-md-4 pr-md-4 pl-lg-5 pr-lg-5 border-0">Publish</a></NavItem>
								<li className="nav-item ml-0">
									<button type="button" className="btn btn-nav btn-user btn-profile-popover ml-r border-0" aria-label="Toggle Profile Options">Hello, {this.props.user.firstName}<i className="pl-2 fa fa-chevron-down" aria-hidden="true"></i></button>
									<div className="d-none" id="profile-list">
										<ul className="popover-menu">
											<li><button type="button" title="Switch Account" className="btn btn-action btn-nav border-0 switch-account">Switch Account</button></li>
											<li><button type="button" title={routes.LOGOUT.TITLE} className="btn btn-action btn-nav border-0 logout">{routes.LOGOUT.TITLE}</button></li>
										</ul>
									</div>
								</li>
							</ul>
						</Navbar>
						<Modal title="Switch Account" className="modal-dialog" buttonLabel="Cancel" show={this.state.isModalOpen} onClose={this.handleModal}>
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
