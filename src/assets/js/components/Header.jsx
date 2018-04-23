/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleToggle = this.handleToggle.bind(this);
	}

	getInitialState = () => ({
		isOpen: false,
	})

	handleToggle = () => {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}

	render = () => (
		<header>
			<Navbar color="light" light expand="lg">
				<NavbarBrand href="/" title="Home">Home</NavbarBrand>
				<NavbarToggler onClick={this.handleToggle} />
				<Collapse isOpen={this.state.isOpen} navbar>
					<Nav className="mr-auto" navbar>
						{(!this.props.authenticated) ? <NavItem><NavLink href="/login" title="Login">Login</NavLink></NavItem> : ''}
						{(this.props.authenticated) ? <NavItem><NavLink href="/dashboard" title="Dashboard">Dashboard</NavLink></NavItem> : ''}
						{(this.props.authenticated) ? <NavItem><NavLink href="/logout" title="Logout">Logout</NavLink></NavItem> : ''}
					</Nav>
				</Collapse>
			</Navbar>
		</header>
	);
}

Header.propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
