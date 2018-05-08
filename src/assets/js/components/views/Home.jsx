import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';

import constants from '../../helpers/constants';

const propTypes = {};

const defaultProps = {};

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => ({});

	componentDidMount = () => {
		document.title = constants.APP.TITLE;

		/*
		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	};

	render = () => (
		<Row>
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<h2>{constants.APP.ROUTES.HOME.TITLE}</h2>
				<ul>
					<li><Link to={constants.APP.ROUTES.LOGIN.URI} title={constants.APP.ROUTES.LOGIN.TITLE} className="btn btn-primary">{constants.APP.ROUTES.LOGIN.TITLE}</Link></li>
				</ul>
			</Col>
		</Row>
	);
}

Home.propTypes = propTypes;

Home.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
