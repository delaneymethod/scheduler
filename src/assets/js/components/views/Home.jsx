import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

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
		const meta = document.getElementsByTagName('meta');

		document.title = constants.APP.TITLE;

		/*
		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	};

	componentDidUpdate = prevProps => ({});

	render = () => (
		<Row>
			<Col>
				<h2>{constants.APP.ROUTES.HOME.TITLE}</h2>
				<ul className="list-unstyled">
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
