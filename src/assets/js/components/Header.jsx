/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Col, Row } from 'reactstrap';

const propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	authenticated: false,
};

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleToggle = this.handleToggle.bind(this);
	}

	getInitialState = () => ({
		isOpen: false,
	});

	handleToggle = () => {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	};

	render = () => (
		<Row>
			<Col>
				<Navbar color="dark" dark expand="lg">
					<NavbarBrand href="/" title="Scheduler">Scheduler<span>.</span></NavbarBrand>
					<NavbarToggler onClick={this.handleToggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="mr-auto" navbar>
							{(!this.props.authenticated) ? <NavItem><NavLink href="/login" title="Login">Login</NavLink></NavItem> : ''}
							{(this.props.authenticated) ? <NavItem><NavLink href="/dashboard" title="Dashboard">Dashboard</NavLink></NavItem> : ''}
							{(this.props.authenticated) ? <NavItem><NavLink href="/logout" title="Logout">Logout</NavLink></NavItem> : ''}
						</Nav>
					</Collapse>
				</Navbar>
			</Col>
		</Row>
	);
}

Header.propTypes = propTypes;

Header.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
