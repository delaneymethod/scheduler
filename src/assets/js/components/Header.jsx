import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Col, Row } from 'reactstrap';

import constants from '../helpers/constants';

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
					<NavbarBrand href={constants.APP.ROUTES.HOME.URI} title={constants.APP.TITLE}>{constants.APP.TITLE}<span>.</span></NavbarBrand>
					<NavbarToggler onClick={this.handleToggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						{this.props.authenticated ? (
							<Nav className="mr-auto" navbar>
								<NavItem><NavLink href={constants.APP.ROUTES.DASHBOARD.HOME.URI} title={constants.APP.ROUTES.DASHBOARD.HOME.TITLE}>{constants.APP.ROUTES.DASHBOARD.HOME.TITLE}</NavLink></NavItem>
								<NavItem><NavLink href={constants.APP.ROUTES.LOGOUT.URI} title={constants.APP.ROUTES.LOGOUT.TITLE}>{constants.APP.ROUTES.LOGOUT.TITLE}</NavLink></NavItem>
							</Nav>
						) : (
							<Nav className="mr-auto" navbar>
								<NavItem><NavLink href={constants.APP.ROUTES.LOGIN.URI} title={constants.APP.ROUTES.LOGIN.TITLE}>{constants.APP.ROUTES.LOGIN.TITLE}</NavLink></NavItem>
							</Nav>
						)}
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
