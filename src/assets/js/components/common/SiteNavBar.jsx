import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import config from '../../helpers/config';

import { addClass, removeClass } from '../../helpers/classes';

const routes = config.APP.ROUTES;

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
			<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-3 m-0">
				<nav className="fixed row no-gutters p-0 m-0 navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="navbar-collapse collapse w-100 p-0 m-0 order-2 order-sm-2 order-md-1 order-lg-2 order-xl-2" id="navbar">
						<ul className="p-0 m-0 nav navbar-nav ml-auto w-100 justify-content-end">
							<li className="nav-item p-0 m-0"><a href="#benefits" title="Benefits" className="nav-link pt-0 pb-0 pl-sm-3 pr-sm-3 m-0 ml-md-2 btn btn-dark border-0">Benefits</a></li>
							<li className="nav-item p-0 m-0"><a href="#about" title="About" className="nav-link pt-0 pb-0 pl-sm-3 pr-sm-3 m-0 ml-md-2 btn btn-dark border-0">About</a></li>
							<li className="nav-item p-0 m-0"><a href="#beta" title="Beta" className="nav-link pt-0 pb-0 pl-sm-3 pr-sm-3 m-0 ml-md-2 btn btn-dark border-0">Beta</a></li>
							<li className="nav-item p-0 m-0"><a href="#pricing" title="Pricing" className="nav-link pt-0 pb-0 pl-sm-3 pr-sm-3 m-0 ml-md-2 btn btn-dark border-0">Pricing</a></li>
							<li className="d-block d-sm-none nav-item p-0 m-0 spacer">&nbsp;</li>
							<li className="nav-item p-0 m-0"><a href={routes.LOGIN.URI} title={routes.LOGIN.TITLE} className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-primary border-0">{routes.LOGIN.TITLE}</a></li>
							<li className="nav-item p-0 m-0"><a href={routes.REGISTER.URI} title={routes.REGISTER.TITLE} className="nav-link pt-0 pb-0 pl-3 pr-3 m-0 ml-md-2 btn btn-primary border-0">{routes.REGISTER.TITLE}</a></li>
							<li className="d-block d-sm-none nav-item p-0 m-0 spacer">&nbsp;</li>
							<li className="d-block d-sm-none nav-item p-0 m-0 spacer">&nbsp;</li>
						</ul>
					</div>
					<div className="p-0 pt-3 p-md-0 m-0 text-center order-3 order-sm-3 order-md-2 order-lg-1 order-xl-1 col-12 col-md-auto">
						<a href={routes.HOME.URI} title={config.APP.AUTHOR.TITLE} className="p-0 m-0 navbar-brand"><img src={config.APP.AUTHOR.LOGO} alt={config.APP.AUTHOR.TITLE} className="img-fluid border-0 p-0 m-0" /></a>
					</div>
					<div className="p-0 m-0 text-center order-1 order-sm-1 order-md-3 col-12 col-md-auto">
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
