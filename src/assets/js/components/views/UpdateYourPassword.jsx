import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import constants from '../../helpers/constants';

import UpdateYourPasswordForm from '../forms/UpdateYourPasswordForm';

const routes = constants.APP.ROUTES;

class UpdateYourPassword extends Component {
	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.UPDATE_YOUR_PASSWORD.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.UPDATE_YOUR_PASSWORD.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.UPDATE_YOUR_PASSWORD.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	};

	render = () => (
		<Row className="d-flex flex-md-row flex-column update-your-password-page-container">
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center bg-dark py-5">
				<div className="panel-welcome">
					<h1><a href={routes.HOME.URI} title={constants.APP.TITLE}><img src={constants.APP.LOGO} alt={constants.APP.TITLE} className="mb-4" /></a></h1>
					<p className="h5 mb-0">{routes.UPDATE_YOUR_PASSWORD.MESSAGES.WELCOME}</p>
				</div>
			</Col>
			<Col xs="12" sm="12" md="6" lg="6" xl="6" className="d-flex align-items-center py-5">
				<div className="panel-page">
					<a href={routes.LOGIN.URI} title={routes.LOGIN.TITLE} className="panel-page__link">Back to {routes.LOGIN.TITLE}</a>
					<div className="card panel-page__content">
						<h2 className="h5--title-card">{routes.UPDATE_YOUR_PASSWORD.TITLE}</h2>
						<UpdateYourPasswordForm token={this.props.match.params.token} history={this.props.history} />
					</div>
				</div>
			</Col>
		</Row>
	);
}

export default UpdateYourPassword;
