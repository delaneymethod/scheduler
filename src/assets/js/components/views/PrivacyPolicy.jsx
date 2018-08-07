import { Col, Row } from 'reactstrap';
import React, { Fragment, Component } from 'react';

import config from '../../helpers/config';

import SiteNavBar from '../common/SiteNavBar';

import SiteFooter from '../common/SiteFooter';

import ServiceUpdatesForm from '../forms/ServiceUpdatesForm';

const routes = config.APP.ROUTES;

class PrivacyPolicy extends Component {
	componentDidMount = () => {
		document.title = config.APP.TITLE;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.PRIVACY_POLICY.META.KEYWORDS);
			meta.description.setAttribute('content', routes.PRIVACY_POLICY.META.DESCRIPTION);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}
	};

	render = () => (
		<Row className="home-page-container">
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<SiteNavBar />
				<Row className="introduction bg-white d-flex justify-content-center">
					<Col xs="12" sm="12" md="10" lg="10" xl="10" className="align-self-start align-self-lg-center text-center text-md-left m-0 p-4 p-lg-5">
						<h1 className="p-0 pt-3 pb-4">{routes.PRIVACY_POLICY.TITLE}</h1>
						<div className="p-0 m-0" dangerouslySetInnerHTML={{ __html: routes.PRIVACY_POLICY.CONTENT.WELCOME }} />
					</Col>
				</Row>
				<Row className="service-updates">
					<Col xs="12" sm="2" md="3" lg="4" xl="4" className="d-none d-sm-block"></Col>
					<Col xs="12" sm="8" md="6" lg="4" xl="4" className="m-0 p-4 p-lg-5">
						<div className="h5 m-0 mb-4 text-center text-white" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.SERVICE_UPDATES.OVERVIEW }} />
						<ServiceUpdatesForm />
					</Col>
					<Col xs="12" sm="2" md="3" lg="4" xl="4" className="d-none d-sm-block"></Col>
				</Row>
				<SiteFooter />
			</Col>
		</Row>
	);
}

export default PrivacyPolicy;
