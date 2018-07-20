import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import constants from '../../helpers/constants';

const routes = constants.APP.ROUTES;

class NotFoundPage extends Component {
	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.PAGE_NOT_FOUND.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.description.setAttribute('content', routes.PAGE_NOT_FOUND.META.DESCRIPTION);
			meta.keywords.setAttribute('content', routes.PAGE_NOT_FOUND.META.KEYWORDS);
			meta.author.setAttribute('content', constants.APP.AUTHOR);
		}
	};

	render = () => (
		<Row className="d-flex flex-md-row flex-column login-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href={routes.HOME.URI} title={constants.APP.TITLE}><img src={constants.APP.LOGO} alt={constants.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{routes.REGISTER.MESSAGES.WELCOME}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<div className="card panel-page__content">
						<h2 className="h5--title-card">{routes.PAGE_NOT_FOUND.TITLE}</h2>
						<div className="text-center" dangerouslySetInnerHTML={{ __html: routes.PAGE_NOT_FOUND.MESSAGES.WELCOME }} />
					</div>
				</div>
			</Col>
		</Row>
	);
}

export default NotFoundPage;
