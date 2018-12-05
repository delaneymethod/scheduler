import moment from 'moment';
import { Col, Row } from 'reactstrap';
import React, { Fragment } from 'react';

import Intercom from './Intercom';

import config from '../../helpers/config';

import CookieBanner from './CookieBanner';

import GoogleTagManager from './GoogleTagManager';

const routes = config.APP.ROUTES;

const SiteFooter = () => (
	<Fragment>
		<Row className="footer">
			<Col xs="12" sm="12" md="12" lg="12" xl="12" className="text-center m-0 p-4 p-lg-5">
				<ul className="list-inline">
					<li className="list-inline-item pl-3 pr-3"><a href={routes.TERMS_OF_SERVICE.URI} id="termsOfService" title={routes.TERMS_OF_SERVICE.TITLE}>{routes.TERMS_OF_SERVICE.TITLE}</a></li>
					<li className="list-inline-item pl-3 pr-3"><a href={routes.COOKIES_POLICY.URI} id="cookiesPolicy" title={routes.COOKIES_POLICY.TITLE}>{routes.COOKIES_POLICY.TITLE}</a></li>
					<li className="list-inline-item pl-3 pr-3"><a href={routes.END_USER_LICENSE_AGREEMENT.URI} id="endUserLicenseAgreement" title={routes.END_USER_LICENSE_AGREEMENT.TITLE}>{routes.END_USER_LICENSE_AGREEMENT.TITLE}</a></li>
				</ul>
				<p className="p-0 m-0">&copy; {moment().format('YYYY')} {config.APP.AUTHOR.TITLE}. All rights reserved.</p>
			</Col>
		</Row>
		<CookieBanner />
		<GoogleTagManager />
		<Intercom />
	</Fragment>
);

export default SiteFooter;
