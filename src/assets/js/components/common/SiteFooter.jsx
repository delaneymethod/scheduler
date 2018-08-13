import React from 'react';
import moment from 'moment';
import { Col, Row } from 'reactstrap';

import config from '../../helpers/config';

const routes = config.APP.ROUTES;

const SiteFooter = () => (
	<Row className="footer">
		<Col xs="12" sm="12" md="12" lg="12" xl="12" className="text-center m-0 p-4 p-lg-5">
			<ul className="list-inline">
				<li className="list-inline-item pl-3 pr-3"><a href={routes.TERMS_OF_SERVICE.URI} title={routes.TERMS_OF_SERVICE.TITLE}>{routes.TERMS_OF_SERVICE.TITLE}</a></li>
				<li className="list-inline-item pl-3 pr-3"><a href={routes.END_USER_LICENSE_AGREEMENT.URI} title={routes.END_USER_LICENSE_AGREEMENT.TITLE}>{routes.END_USER_LICENSE_AGREEMENT.TITLE}</a></li>
			</ul>
			<p className="p-0 m-0">&copy; {moment().format('YYYY')} {config.APP.AUTHOR.TITLE}. All rights reserved.</p>
		</Col>
	</Row>
);

export default SiteFooter;
