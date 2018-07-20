import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import constants from '../../helpers/constants';

const routes = constants.APP.ROUTES;

class Home extends Component {
	componentDidMount = () => {
		document.title = constants.APP.TITLE;
		console.log('navigator.userAgent:', navigator.userAgent);
		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			console.log('Called Home - Found desktop/laptop browser');

			const meta = document.getElementsByTagName('meta');

			meta.description.setAttribute('content', routes.HOME.META.DESCRIPTION);
			meta.keywords.setAttribute('content', routes.HOME.META.KEYWORDS);
			meta.author.setAttribute('content', constants.APP.AUTHOR);
		} else {
			console.log('Called Home - Found handheld device');
		}
	};

	render = () => (
		<Row>
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<h2>{routes.HOME.TITLE}</h2>
				<ul>
					<li><a href={routes.LOGIN.URI} title={routes.LOGIN.TITLE} className="btn btn-primary">{routes.LOGIN.TITLE}</a></li>
				</ul>
			</Col>
		</Row>
	);
}

export default Home;
