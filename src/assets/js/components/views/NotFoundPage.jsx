import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import config from '../../helpers/config';

const routes = config.APP.ROUTES;

class NotFoundPage extends Component {
	componentDidMount = () => {
		document.title = `${config.APP.TITLE}: ${routes.PAGE_NOT_FOUND.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.PAGE_NOT_FOUND.META.KEYWORDS);
			meta.description.setAttribute('content', routes.PAGE_NOT_FOUND.META.DESCRIPTION);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}
	};

	render = () => (
		<Row className="d-flex flex-md-row flex-column general-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href={routes.HOME.URI} title={config.APP.TITLE}><img src={config.APP.LOGO} alt={config.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{routes.REGISTER.CONTENT.WELCOME}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<a href={routes.HOME.URI} title={routes.HOME.TITLE} className="panel-page__link"><i className="fa fa-fw fa-arrow-circle-left" aria-hidden="true"></i> Back to {routes.HOME.TITLE}</a>
					<div className="card panel-page__content">
						<h2 className="h5--title-card">{routes.PAGE_NOT_FOUND.TITLE}</h2>
						<div className="text-center" dangerouslySetInnerHTML={{ __html: routes.PAGE_NOT_FOUND.CONTENT.WELCOME }} />
					</div>
				</div>
			</Col>
		</Row>
	);
}

export default NotFoundPage;
