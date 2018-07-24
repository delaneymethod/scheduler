import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import constants from '../../helpers/constants';

import { addClass, removeClass } from '../../helpers/classes';

const routes = constants.APP.ROUTES;

class SiteNavBar extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick = (event) => {
		if (event.currentTarget.classList.contains('cross')) {
			removeClass(event.currentTarget, 'cross');
		} else {
			addClass(event.currentTarget, 'cross');
		}
	};

	render = () => (
		<Row className="header">
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<nav className="pl-0 pr-0 mt-0 ml-0 mr-0 pb-3 navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="navbar-collapse collapse w-100 mb-0 order-2 order-sm-2 order-md-1 order-lg-2 order-xl-2" id="navbar">
						<ul className="p-0 m-0 nav navbar-nav ml-auto w-100 justify-content-end">
							<li className="nav-item pl-1 pr-1"><a href="" title="Benefits" className="nav-link">Benefits</a></li>
							<li className="nav-item pl-1 pr-1"><a href="" title="About" className="nav-link">About</a></li>
							<li className="nav-item pl-1 pr-1"><a href="" title="Beta" className="nav-link">Beta</a></li>
							<li className="nav-item pl-1 pr-1"><a href="" title="Pricing" className="nav-link">Pricing</a></li>
							<li className="nav-item pl-1 pr-1"><a href={routes.LOGIN.URI} title={routes.LOGIN.TITLE} className="nav-link">{routes.LOGIN.TITLE}</a></li>
							<li className="nav-item pl-1 pr-1"><a href={routes.REGISTER.URI} title={routes.REGISTER.TITLE} className="nav-link">{routes.REGISTER.TITLE}</a></li>
						</ul>
					</div>
					<div className="m-0 mt-3 mt-md-1 text-center order-3 order-sm-3 order-md-2 order-lg-1 order-xl-1 col-12 col-md-auto">
						<a href={routes.HOME.URI} title={constants.APP.AUTHOR.TITLE} className="p-0 m-0 navbar-brand"><img src={constants.APP.AUTHOR.LOGO} alt={constants.APP.AUTHOR.TITLE} className="img-fluid border-0 p-0 m-0" /></a>
					</div>
					<div className="p-0 m-0 mt-1 mt-md-1 mb-0 text-center order-1 order-sm-1 order-md-3 col-12 col-md-auto">
						<button type="button" className="text-center mt-0 pt-2 pl-2 pr-2 pb-2 border-0 rounded-0 lines-button x navbar-toggler" role="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation" onClick={event => this.handleClick(event)}>
							<span className="lines"></span>
						</button>
					</div>
				</nav>
			</Col>
		</Row>
	);
}

export default SiteNavBar;
