import { Col, Row } from 'reactstrap';
import React, { Component } from 'react';

import config from '../../helpers/config';

import SiteNavBar from '../common/SiteNavBar';

import SiteFooter from '../common/SiteFooter';

import ServiceUpdatesForm from '../forms/ServiceUpdatesForm';

const routes = config.APP.ROUTES;

class EndUserLicenseAgreement extends Component {
	componentDidMount = () => {
		document.title = config.APP.TITLE;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.END_USER_LICENSE_AGREEMENT.META.KEYWORDS);
			meta.description.setAttribute('content', routes.END_USER_LICENSE_AGREEMENT.META.DESCRIPTION);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}
	};

	render = () => (
		<Row className="general-page-container">
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
				<SiteNavBar />
				<Row className="introduction bg-white d-flex justify-content-center">
					<Col xs="12" sm="12" md="10" lg="10" xl="10" className="align-self-start align-self-lg-center text-center text-md-left m-0 p-4 p-lg-5">
						<h1 className="lead-text h2 font-weight-bold mt-sm-0 mt-md-3 mt-lg-3 mb-4 pb-4 position-relative">GIG GRAFTER BETA RELEASE - EMPLOYEE TERMS OF USE</h1>
						<div className="p-0 m-0" dangerouslySetInnerHTML={{ __html: routes.END_USER_LICENSE_AGREEMENT.CONTENT.WELCOME }} />
					</Col>
				</Row>
				<Row className="bg-white d-flex justify-content-center border-top">
					<Col xs="12" sm="12" md="10" lg="10" xl="10" className="terms align-self-start align-self-lg-center text-left m-0 p-4 p-lg-5">
						<Row className="no-gutters mb-4">
							<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-0 m-0">
								<p className="font-weight-bold">Please read these terms and conditions carefully before using this service.</p>
								<p>These terms tell you the rules for using our website www.giggrafter.com (our &quot;<strong>service</strong>&quot;).</p>
								<p>Our service is operated by Gig Grafter Limited (&quot;We&quot; or &quot;us&quot;). We are a limited company registered in Northern Ireland under company number NI636735 and have our registered office at 20a Upper Water Street, Newry, Down, Northern Ireland, BT34 1DJ.</p>
								<p>Your employer has contracted with us to provide an on-demand Online Rota Management and Shift Scheduling platform that enables your employer to assign shifts to its available workers (&quot;<strong>platform</strong>&quot;).</p>
								<p>The platform is currently in a pre-release, beta-testing format and your employer may agree to provide us with feedback on the functionality of our platform. Our service is the interface by which you, an employee, can view your shift allocations in relation to your specific employment.</p>
								<p>If you have any questions regarding our service, please revert these to your employer in the first instance as they have requested that we offer our service to you.</p>
								<p>However, in the event that your employer is unable to assist, please contact us via email to our customer services team support@giggrafter.com.</p>
								<p className="font-weight-bold">1. Your acceptance of our terms</p>
								<p>By using our service, you confirm that you accept these terms of use and that you agree to comply with them.</p>
								<p>If you do not agree to these terms, you must not use our service.</p>
								<p>We recommend that you print a copy of these terms for future reference.</p>
								<p>We amend these terms from time to time. Every time you wish to use our service, please check these terms to ensure you understand the terms that apply at that time. These terms were most recently updated on 10 August 2018.</p>
								<p className="font-weight-bold">2. We may make changes to our service</p>
								<p>We may update and change our service from time to time to reflect changes to our functionality, our users&#39; needs and our business priorities. We will try to give you reasonable notice of any major changes.</p>
								<p>Our service is made available free of charge to you.</p>
								<p>We do not guarantee that our service, or any content on it, will always be available or be uninterrupted. We may suspend or withdraw or restrict the availability of all or any part of our service for business and operational reasons. We will try to give you reasonable notice of any suspension or withdrawal.</p>
								<p>If you become aware of any issues with the performance of the service please notify your employer and explain to them the defects, bugs or errors within the service.</p>
								<p>You are also responsible for ensuring that all persons who access our service through your internet connection are aware of these terms of use and other applicable terms and conditions, and that they comply with them.</p>
								<p className="font-weight-bold">3. Our service is only for use by employees</p>
								<p>Our service is solely directed to people whose employer has contracted with us to provide the service to you. If your employer has not contracted with us to provide the service you will not be able to use the service and must exit the service.</p>
								<p className="font-weight-bold">4. You must keep your account details safe</p>
								<p>If you create or are provided with, a username, password or any other piece of information as part of our security procedures, you must treat such information as confidential. You must not disclose it to any third party.</p>
								<p>We have the right to disable any user identification code or password, whether chosen by you or allocated by us, at any time, if in our reasonable opinion you have failed to comply with any of the provisions of these terms of use.</p>
								<p>If you know or suspect that anyone other than you knows your user identification code or password, you must promptly notify you employer.</p>
								<p className="font-weight-bold">5. How you may use material on our service</p>
								<p>We are the owner or the licensee of all intellectual property rights in our service, and in the material published on it.  Those works are protected by copyright laws and treaties around the world. All such rights are reserved.</p>
								<p>You may print off one copy, and may download extracts, of any page(s) from our service for your personal use and you may draw the attention of others within your organisation to content posted on our service.</p>
								<p>You must not modify the paper or digital copies of any materials you have printed off or downloaded in any way, and you must not use any illustrations, photographs, video or audio sequences or any graphics separately from any accompanying text.</p>
								<p>You must not use any part of the content on our service for commercial purposes without obtaining a licence to do so from us or our licensors.</p>
								<p>If you print off, copy or download any part of our service in breach of these terms of use, your right to use our service will cease immediately and you must, at our option, return or destroy any copies of the materials you have made.</p>
								<p className="font-weight-bold">6. Do not rely on information on this service</p>
								<p>The content relating to your employment (for example your work rota, schedule details, payment details, personal details etc.) on our service is at all times provided and under the control of your employer. Whilst we take reasonable steps to encourage your employer to upload accurate details, we make no representations, warranties or guarantees, whether express or implied, that the content on our service is accurate, complete or up to date.</p>
								<p className="font-weight-bold">7. We are not responsible for websites we link to</p>
								<p>Where our service contains links to other website and resources provided by third parties, these links are provided for your information only. Such links should not be interpreted as approval by us of those linked websites or information you may obtain from them.</p>
								<p>We have no control over the contents of those websites or resources.</p>
								<p className="font-weight-bold">8. Our responsibility for loss or damage suffered by you</p>
								<ul>
									<li>We do not exclude or limit in any way our liability to you where it would be unlawful to do so. This includes liability for death or personal injury caused by our negligence or the negligence of our employees, agents or subcontractors and for fraud or fraudulent misrepresentation.</li>
									<li>Different limitations and exclusions of liability will apply to liability arising as a result of the supply of any products to you, which will be set out in our Terms and conditions of Sale.</li>
									<li>Please note that we only provide our service for domestic and private use. You agree not to use our service for any commercial or business purposes, and we have no liability to you for any loss of profit, loss of business, business interruption, or loss of business opportunity.</li>
									<li>If defective digital content that we have supplied, damages a device or digital content belonging to you and this is caused by our failure to use reasonable care and skill, we will either repair the damage or pay you compensation. However, we will not be liable for damage that you could have avoided by following our advice to apply an update offered to you free of charge or for damage that was caused by you failing to correctly follow installation instructions or to have in place the minimum system requirements advised by us.</li>
								</ul>
								<p className="font-weight-bold">9. How we may use your personal information</p>
								<p>We take the privacy of your personal data very seriously and will only use your personal information in accordance with data protection laws.</p>
								<p>In this regard your employer is at all times the data controller and we are the data processor for all your personal data processed by the service. Accordingly, we will only process your personal information in the manner and for the purposes instructed by your employer.</p>
								<p>Please refer to your employer&#39;s employee privacy notice for details of how your employer processes your personal data.</p>
								<p className="font-weight-bold">10. We are not responsible for viruses and you must not introduce them</p>
								<p>We do not guarantee that our service will be secure or free from bugs or viruses.</p>
								<p>You are responsible for configuring your information technology, computer programmes and platform to access our service. You should use your own virus protection software.</p>
								<p>You must not misuse our service by knowingly introducing viruses, trojans, worms, logic bombs or other material that is malicious or technologically harmful. You must not attempt to gain unauthorised access to our service, the server on which our service is stored or any server, computer or database connected to our service. You must not attack our service via a denial-of-service attack or a distributed denial-of service attack. By breaching this provision, you would commit a criminal offence under the Computer Misuse Act 1990. We will report any such breach to the relevant law enforcement authorities and we will co-operate with those authorities by disclosing your identity to them. In the event of such a breach, your right to use our service will cease immediately.</p>
								<p className="font-weight-bold">11. Rules about linking to our service</p>
								<p>You may link not to our home page or any other page on our service.</p>
								<p className="font-weight-bold">12. Which country&#39;s laws apply to any disputes?</p>
								<p>If you are a consumer, please note that these terms of use, their subject matter and their formation, are governed by Northern Irish law. You and we both agree that the courts of Northern Ireland will have exclusive jurisdiction except that if you are a resident of England you may also bring proceedings in England, and if you are resident of Scotland, you may also bring proceedings in Scotland.</p>
								<p>If you are a business, these terms of use, their subject matter and their formation (and any non-contractual disputes or claims) are governed by Northern Irish law. We both agree to the exclusive jurisdiction of the courts of Northern Ireland.</p>
							</Col>
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
				<SiteFooter />
			</Col>
		</Row>
	);
}

export default EndUserLicenseAgreement;
