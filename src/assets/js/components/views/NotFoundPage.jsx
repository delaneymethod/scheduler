import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import constants from '../../helpers/constants';

const routes = constants.APP.ROUTES;

class NotFoundPage extends Component {
	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.PAGE_NOT_FOUND.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.PAGE_NOT_FOUND.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.PAGE_NOT_FOUND.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	};

	render = () => (
		<Row>
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<h2>Not Found Page</h2>
			</Col>
		</Row>
	);
}

export default NotFoundPage;
