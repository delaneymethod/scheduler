/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

const propTypes = {};

const defaultProps = {};

class NotFoundPage extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	getInitialState = () => ({});

	componentDidMount = () => {
		document.title = 'Scheduler: Not Found Page';

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
				<h2>Not Found Page</h2>
			</Col>
		</Row>
	);
}

NotFoundPage.propTypes = propTypes;

NotFoundPage.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NotFoundPage);
