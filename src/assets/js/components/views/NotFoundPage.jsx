import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import constants from '../../helpers/constants';

class NotFoundPage extends Component {
	constructor(props) {
		super(props);

		document.title = `${constants.APP.TITLE}: Not Found Page`;

		/*
		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', '');
		meta.keywords.setAttribute('content', '');
		meta.author.setAttribute('content', '');
		*/
	}

	render = () => (
		<Row>
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<h2>Not Found Page</h2>
			</Col>
		</Row>
	);
}

export default NotFoundPage;
