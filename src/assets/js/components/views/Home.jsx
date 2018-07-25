import moment from 'moment';
import { Col, Row } from 'reactstrap';
import React, { Fragment, Component } from 'react';

import SiteNavBar from '../common/SiteNavBar';

import constants from '../../helpers/constants';

import ServiceUpdatesForm from '../forms/ServiceUpdatesForm';

const routes = constants.APP.ROUTES;

class Home extends Component {
	componentDidMount = () => {
		document.title = constants.APP.TITLE;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.description.setAttribute('content', routes.HOME.META.DESCRIPTION);
			meta.keywords.setAttribute('content', routes.HOME.META.KEYWORDS);
			meta.author.setAttribute('content', constants.APP.AUTHOR.TITLE);
		}
	};

	render = () => (
		<Row className="home-page-container">
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<SiteNavBar />
				<Row className="introduction d-flex justify-content-center">
					<Col xs="12" sm="12" md="7" lg="7" xl="7" className="align-self-start align-self-lg-center text-center text-md-left m-0 p-4 p-lg-5">
						<h1><img src={constants.APP.LOGO} alt={constants.APP.TITLE} className="mb-4 img-fluid" /></h1>
						<p className="h2 mb-4 text-white" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.INTRODUCTION.LEAD }} />
						<div className="h5 mb-4 text-white" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.INTRODUCTION.OVERVIEW }} />
						<p className="p-0 m-0"><a href={routes.HOME.CONTENT.INTRODUCTION.CALL_TO_ACTION.URI} title={routes.HOME.CONTENT.INTRODUCTION.CALL_TO_ACTION.TITLE} className="btn btn-primary border-0 d-block d-sm-inline-block pl-5 pr-5 mb-0">{routes.HOME.CONTENT.INTRODUCTION.CALL_TO_ACTION.TITLE}</a></p>
					</Col>
					<Col xs="12" sm="12" md="5" lg="5" xl="5" className="text-center p-0 m-0 introduction-image" style={{ backgroundImage: `url('${routes.HOME.CONTENT.INTRODUCTION.IMAGE}')` }}></Col>
				</Row>
				<Row id="benefits" className="benefits create bg-white d-flex justify-content-center">
					<Col xs="12" sm="12" md="5" lg="5" xl="5" className="d-none d-md-block align-self-start align-self-lg-center m-0 p-0 p-md-4 p-lg-5 order-2 order-md-1">
						<img src={routes.HOME.CONTENT.CREATE.IMAGE} alt="Create Preview" className="p-5 pt-0 pb-0 p-md-0 m-0 img-fluid" />
					</Col>
					<Col xs="12" sm="12" md="7" lg="7" xl="7" className="align-self-start align-self-lg-center text-center text-md-left m-0 p-4 p-lg-5 order-1 order-md-2">
						<p className="lead-text h2 mt-sm-0 mt-md-3 mt-lg-3 mb-4 pb-4 position-relative text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.CREATE.LEAD }} />
						<img src={routes.HOME.CONTENT.CREATE.IMAGE} alt="Create Preview" className="d-block d-md-none p-0 pl-5 pr-5 pb-5 m-0 img-fluid" />
						<div className="h5 m-0 text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.CREATE.OVERVIEW }} />
					</Col>
				</Row>
				<Row className="publish bg-white d-flex justify-content-center">
					<Col xs="12" sm="12" md="7" lg="7" xl="7" className="align-self-start align-self-lg-center text-center text-md-left m-0 p-4 p-lg-5">
						<p className="lead-text h2 mt-sm-0 mt-md-3 mt-lg-3 mb-4 pb-4 position-relative text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.PUBLISH.LEAD }} />
						<img src={routes.HOME.CONTENT.PUBLISH.IMAGE} alt="Publish Preview" className="d-block d-md-none p-0 pl-5 pr-5 pb-5 m-0 img-fluid" />
						<div className="h5 m-0 text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.PUBLISH.OVERVIEW }} />
					</Col>
					<Col xs="12" sm="12" md="5" lg="5" xl="5" className="d-none d-md-block align-self-start align-self-lg-center m-0 p-0 p-md-4 p-lg-5">
						<img src={routes.HOME.CONTENT.PUBLISH.IMAGE} alt="Publish Preview" className="p-5 pt-0 pb-0 p-md-0 m-0 img-fluid" />
					</Col>
				</Row>
				<Row className="manage bg-white d-flex justify-content-center">
					<Col xs="12" sm="12" md="5" lg="5" xl="5" className="d-none d-md-block align-self-start align-self-lg-center m-0 p-0 p-md-4 p-lg-5 order-2 order-md-1">
						<img src={routes.HOME.CONTENT.MANAGE.IMAGE} alt="Manage Preview" className="p-5 pt-0 pb-0 p-md-0 m-0 img-fluid" />
					</Col>
					<Col xs="12" sm="12" md="7" lg="7" xl="7" className="align-self-start align-self-lg-center text-center text-md-left m-0 p-4 p-lg-5 order-1 order-md-2">
						<p className="lead-text h2 mt-sm-0 mt-md-3 mt-lg-3 mb-4 pb-4 position-relative text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.MANAGE.LEAD }} />
						<img src={routes.HOME.CONTENT.MANAGE.IMAGE} alt="Manage Preview" className="d-block d-md-none p-0 pl-5 pr-5 pb-5 m-0 img-fluid" />
						<div className="h5 m-0 text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.MANAGE.OVERVIEW }} />
					</Col>
				</Row>
				<Row className="promo d-flex justify-content-center">
					<Col xs="12" sm="12" md="6" lg="6" xl="6" className="align-self-center text-center text-md-left p-0 m-0">
						<p className="lead-text h2 ml-5 mr-5 mt-5 mt-md-0 mb-md-3 p-0 pb-4 position-relative text-white" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.PROMO.LEAD }} />
						<div className="h2 ml-5 mr-5 mb-5 mb-md-0 p-0 text-white" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.PROMO.OVERVIEW }} />
					</Col>
					<Col xs="12" sm="12" md="6" lg="6" xl="6" className="p-0 m-0 promo-image" style={{ backgroundImage: `url('${routes.HOME.CONTENT.PROMO.IMAGE}')` }}></Col>
				</Row>
				<Row id="about" className="about bg-white">
					<Col xs="12" sm="12" md="1" lg="1" xl="2" className="d-none d-md-block"></Col>
					<Col xs="12" sm="12" md="10" lg="10" xl="8" className="text-center m-0 p-4 p-lg-5">
						<p className="lead-text h2 mt-sm-0 mt-md-3 mt-lg-3 mb-4 pb-4 position-relative text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.ABOUT.LEAD }} />
						<div className="h5 m-0 text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.ABOUT.OVERVIEW }} />
					</Col>
					<Col xs="12" sm="12" md="1" lg="1" xl="2" className="d-none d-md-block"></Col>
				</Row>
				<Row className="sms d-flex justify-content-center">
					<Col xs="12" sm="12" md="6" lg="5" xl="5" className="p-5 m-0 sms-image order-2 order-md-1" style={{ backgroundImage: `url('${routes.HOME.CONTENT.SMS.IMAGE}')` }}></Col>
					<Col xs="12" sm="12" md="6" lg="7" xl="7" className="align-self-center text-center text-md-left p-0 m-0 order-1 order-md-2">
						<p className="lead-text h2 ml-5 mr-5 mt-5 mt-md-0 mb-md-3 p-0 pb-4 position-relative text-white" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.SMS.LEAD }} />
						<div className="h2 ml-5 mr-5 mb-5 mb-md-0 p-0 text-white" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.SMS.OVERVIEW }} />
					</Col>
				</Row>
				<Row id="beta" className="beta bg-light">
					<Col xs="12" sm="12" md="1" lg="1" xl="2" className="d-none d-md-block"></Col>
					<Col xs="12" sm="12" md="10" lg="10" xl="8" className="m-0 p-4 p-lg-5">
						<p className="lead-text text-center h2 mt-sm-0 mt-md-3 mt-lg-3 mb-4 pb-4 position-relative text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.BETA.LEAD }} />
						<div className="h5 m-0 text-center text-md-left text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.BETA.OVERVIEW }} />
					</Col>
					<Col xs="12" sm="12" md="1" lg="1" xl="2" className="d-none d-md-block"></Col>
				</Row>
				<Row id="pricing" className="pricing bg-white">
					<Col xs="12" sm="12" md="12" lg="12" xl="12" className="m-0 p-4 p-lg-5">
						<p className="lead-text text-center h2 position-relative text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.PRICING.LEAD }} />
						<div className="d-flex justify-content-center p-5 m-0">
							<div className="align-self-center">
								<div className="container">
									<div className="card-deck">
										{routes.HOME.CONTENT.PRICING.SUBSCRIPTIONS.map((subscription, subscriptionIndex) => (
											<div key={subscriptionIndex} className="card rounded border-0" style={{ width: '18rem' }}>
												<div className="card-header border-0 bg-secondary text-center">
													<p className="h5 text-white">{subscription.TITLE}</p>
													<p className="h1 text-white text-uppercase">{subscription.PRICE}</p>
												</div>
												<div className="card-body bg-light m-0 pb-0 text-center text-md-left text-dark" dangerouslySetInnerHTML={{ __html: subscription.DESCRIPTION }} />
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<Row>
							<Col xs="12" sm="2" md="3" lg="3" xl="3"></Col>
							<Col xs="12" sm="8" md="6" lg="6" xl="6" className="m-0 p-0">
								<div className="foot-notes pl-4 pr-4 p-sm-0 m-0 text-center text-dark" dangerouslySetInnerHTML={{ __html: routes.HOME.CONTENT.PRICING.FOOT_NOTES }} />
							</Col>
							<Col xs="12" sm="2" md="3" lg="3" xl="3"></Col>
						</Row>
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
				<Row className="footer">
					<Col xs="12" sm="12" md="12" lg="12" xl="12" className="text-center m-0 p-4 p-lg-5">
						<ul className="list-inline">
							<li className="list-inline-item pl-3 pr-3"><a href={routes.TERMS_OF_SERVICE.URI} title={routes.TERMS_OF_SERVICE.TITLE}>{routes.TERMS_OF_SERVICE.TITLE}</a></li>
							<li className="list-inline-item pl-3 pr-3"><a href={routes.PRIVACY_POLICY.URI} title={routes.PRIVACY_POLICY.TITLE}>{routes.PRIVACY_POLICY.TITLE}</a></li>
						</ul>
						<p className="p-0 m-0">&copy; {moment().format('YYYY')} {constants.APP.AUTHOR.TITLE}. All rights reserved.</p>
					</Col>
				</Row>
			</Col>
		</Row>
	);
}

export default Home;
