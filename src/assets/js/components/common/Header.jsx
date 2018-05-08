import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Nav, Col, Row, Navbar, NavItem, NavLink, Collapse, NavbarBrand, DropdownMenu, DropdownItem, NavbarToggler, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

import constants from '../../helpers/constants';

import { logout } from '../../actions/authenticationActions';

import SwitchAccountDropdown from './SwitchAccountDropdown';

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

		this.handleLogout = this.handleLogout.bind(this);

		this.handleToggle = this.handleToggle.bind(this);
	}

	getInitialState = () => ({
		isOpen: false,
	});

	handleLogout = (event) => {
		event.preventDefault();

		this.props.actions.logout().then(() => this.props.history.push(constants.APP.ROUTES.LOGIN.URI));
	};

	handleToggle = (event) => {
		event.preventDefault();

		this.setState({
			isOpen: !this.state.isOpen,
		});
	};

	render = () => (
		<Row>
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<Row>
					<Col className="bg-dark" xs="12" sm="12" md="12" lg="12" xl="12">
						<Navbar color="dark" dark expand="lg">
							<NavbarBrand href={constants.APP.ROUTES.HOME.URI} title={constants.APP.TITLE}>{constants.APP.TITLE}<span>.</span></NavbarBrand>
							<NavbarToggler onClick={this.handleToggle} />
							<Collapse isOpen={this.state.isOpen} navbar>
								<Nav className="w-100" navbar>
									<NavItem><NavLink>Calender</NavLink></NavItem>
									<NavItem><NavLink href={constants.APP.ROUTES.DASHBOARD.EMPLOYEES.URI} title={constants.APP.ROUTES.DASHBOARD.EMPLOYEES.TITLE}>{constants.APP.ROUTES.DASHBOARD.EMPLOYEES.TITLE}</NavLink></NavItem>
									<NavItem><NavLink href={constants.APP.ROUTES.DASHBOARD.SHIFTS.URI} title={constants.APP.ROUTES.DASHBOARD.SHIFTS.TITLE}>{constants.APP.ROUTES.DASHBOARD.SHIFTS.TITLE}</NavLink></NavItem>
									<NavItem><NavLink href={constants.APP.ROUTES.DASHBOARD.OVERVIEW.URI} title={constants.APP.ROUTES.DASHBOARD.OVERVIEW.TITLE}>{constants.APP.ROUTES.DASHBOARD.OVERVIEW.TITLE}</NavLink></NavItem>
									<UncontrolledDropdown nav inNavbar className="ml-auto">
										<DropdownToggle nav caret>Hello, {this.props.user.firstName}</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem title={constants.APP.ROUTES.LOGOUT.TITLE} onClick={this.handleLogout}>{constants.APP.ROUTES.LOGOUT.TITLE}</DropdownItem>
										</DropdownMenu>
									</UncontrolledDropdown>
								</Nav>
							</Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="12" lg="12" xl="12">
						<SwitchAccountDropdown account={this.props.user.account} accounts={this.props.user.accounts} />
					</Col>
				</Row>
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
