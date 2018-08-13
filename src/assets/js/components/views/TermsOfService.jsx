import { Col, Row } from 'reactstrap';
import React, { Fragment, Component } from 'react';

import config from '../../helpers/config';

import SiteNavBar from '../common/SiteNavBar';

import SiteFooter from '../common/SiteFooter';

import ServiceUpdatesForm from '../forms/ServiceUpdatesForm';

const routes = config.APP.ROUTES;

class TermsOfService extends Component {
	componentDidMount = () => {
		document.title = config.APP.TITLE;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);
			meta.keywords.setAttribute('content', routes.TERMS_OF_SERVICE.META.KEYWORDS);
			meta.description.setAttribute('content', routes.TERMS_OF_SERVICE.META.DESCRIPTION);

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
						<h1 className="lead-text h2 font-weight-bold mt-sm-0 mt-md-3 mt-lg-3 mb-4 pb-4 position-relative">GIG GRAFTER BETA RELEASE - BUSINESS TERMS AND CONDITIONS</h1>
						<div className="p-0 m-0" dangerouslySetInnerHTML={{ __html: routes.TERMS_OF_SERVICE.CONTENT.WELCOME }} />
					</Col>
				</Row>
				<Row className="bg-white d-flex justify-content-center border-top">
					<Col xs="12" sm="12" md="10" lg="10" xl="10" className="terms align-self-start align-self-lg-center text-left m-0 p-4 p-lg-5">
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(A)</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">DISCLAIMER: THE GIG GRAFTER SERVICES ARE PROVIDED TO THE CUSTOMER &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY WARRANTY OF MERCHANTABILITY, NON-INFRINGEMENT OR FITNESS FOR A PARTICULAR PURPOSE. PLEASE REFER TO CLAUSE 7 OF THIS AGREEMENT.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(B)</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">GIG GRAFTER LIMITED HAVE EXCLUDED ALL LEGAL AND FINANCIAL LIABILITY TO THE CUSTOMER EXCLUDABLE BY LAW, SAVE IN RESPECT OF LIABILITY IN RELATION TO DATA PROTECTION. PLEASE REFER TO CLAUSE 12 OF THIS AGREEMENT.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(C)</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">USE OF THE SERVICES IS ENTIRELY AT THE CUSTOMER&#39;S OWN RISK. SHOULD THE SERVICES PROVE DEFECTIVE, THE CUSTOMER ASSUMES THE COST OF ALL NECESSARY MAINTENANCE, SERVICING OR REPAIR. IT IS THE CUSTOMER&#39;S RESPONSIBILITY TO TAKE ADEQUATE PRECAUTION AGAINST POSSIBLE DAMAGES RESULTING FROM THE USE OF THE GIG GRAFTER SERVICES. THE GIG GRAFTER SERVICES SHOULD UNDER NO CIRCUMSTANCES BE USED ON SENSITIVE AND/OR VALUABLE DATA. IF THE CUSTOMER IS IN ANY DOUBT, PLEASE DO NOT ACCESS AND/OR USE THE GIG GRAFTER SERVICES.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">BETA USER CONDITIONS</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">1.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer&#39;s use of the Services is governed by these terms and conditions (the &quot;Agreement&quot;) which the Customer should read carefully before using the Services. This Agreement represents a binding contract between the Supplier and the Customer. If the Customer does not agree with this Agreement, please do not use Services.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">1.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">By clicking the accept button prior to accessing to the Services and in consideration of the mutual obligations contained herein, the receipt and sufficiency of which the parties hereby acknowledge, the Customer hereby agrees to comply with the terms and conditions of this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">INTERPRETATION</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The definitions and rules of interpretation in this clause apply in this Agreement.</Col>
						</Row>
						<dl className="row">
							<dt className="col-3 mb-4">&quot;Authorised Users&quot;</dt>
							<dd className="col-9 mb-4">means those employees, agents and independent contractors of the Customer who are authorised by the Customer to use the Services and the Documentation, as further described in clause 4.</dd>
							<dt className="col-3 mb-4">&quot;Business Day&quot;</dt>
							<dd className="col-9 mb-4">means a day other than a Saturday, Sunday or public holiday in Northern Ireland when banks in Belfast are open for business.</dd>
							<dt className="col-3 mb-4">&quot;Confidential Information&quot;</dt>
							<dd className="col-9 mb-4">means information that is proprietary or confidential and is either clearly labelled as such or identified as Confidential Information in clause 11.6 or clause 11.7.</dd>
							<dt className="col-3 mb-4">&quot;Customer&quot;</dt>
							<dd className="col-9 mb-4">the person who utilises the Services from the Supplier.</dd>
							<dt className="col-3 mb-4">&quot;Customer Data&quot;</dt>
							<dd className="col-9 mb-4">means the data inputted by the Customer, Authorised Users, or the Supplier on the Customer&#39;s behalf for the purpose of using the Services or facilitating the Customer&#39;s use of the Services.</dd>
							<dt className="col-3 mb-4">&quot;Data Protection Legislation&quot;</dt>
							<dd className="col-9 mb-4">means unless and until the General Data Protection Regulation ((EU) 2016/679) (GDPR) is no longer directly applicable in the UK, the GDPR and any national implementing laws, regulations and secondary legislation, as amended or updated from time to time, in the UK; and then any successor legislation to the GDPR or the Data Protection Act 1998.</dd>
							<dt className="col-3 mb-4">&quot;Documentation&quot;</dt>
							<dd className="col-9 mb-4">means any documentation made available to the Customer by the Supplier online or such other location notified by the Supplier to the Customer from time to time which sets out a description of the Services and the user instructions for the Services.</dd>
							<dt className="col-3 mb-4">&quot;Effective Date&quot;</dt>
							<dd className="col-9 mb-4">means the date upon which the Customer first clicks the accept button prior to accessing the Services.</dd>
							<dt className="col-3 mb-4">&quot;Employee Services&quot;</dt>
							<dd className="col-9 mb-4">means the employee interface services which may be provided by the Supplier to the Customer for use by the Customer&#39;s employees and/or workers in association with the Employer Services, at a website notified to the Customer from time to time, which may be more particularly described in the Documentation.</dd>
							<dt className="col-3 mb-4">&quot;Employee Terms of Use&quot;</dt>
							<dd className="col-9 mb-4">means the terms as set out in Schedule 1.</dd>
							<dt className="col-3 mb-4">&quot;Employer Services&quot;</dt>
							<dd className="col-9 mb-4">means the employer interface subscription services provided by the Supplier to the Customer under this Agreement via www.giggrafter.com or any other website notified to the Customer by the Supplier from time to time, which may be more particularly described in the Documentation.</dd>
							<dt className="col-3 mb-4">&quot;Improvement&quot;</dt>
							<dd className="col-9 mb-4">means any improvement, development, enhancement, modification or derivative of the Software and/or Services, or its design, which would make the Software and/or Services cheaper, more effective, more useful or more valuable, or would in any other way render the Software and/or Services more commercially competitive.</dd>
							<dt className="col-3 mb-4">&quot;Intellectual Property Rights&quot;</dt>
							<dd className="col-9 mb-4">means patents, utility models, rights to inventions, copyright and neighbouring and related rights, trade marks, business names and domain names, rights in get-up and trade dress, goodwill and the right to sue for passing off, rights in designs, rights in computer software, database rights, rights to use, and protect the confidentiality of, confidential information (including know-how and trade secrets), and all other intellectual property rights, in each case whether registered or unregistered and including all applications and rights to apply for and be granted, renewals or extensions of, and rights to claim priority from, any rights and all similar or equivalent rights or forms of protection that subsist or will subsist now or in the future in any part of the world.</dd>
							<dt className="col-3 mb-4">&quot;Services&quot;</dt>
							<dd className="col-9 mb-4">means the Employee Services and Employer Services together.</dd>
							<dt className="col-3 mb-4">&quot;Software&quot;</dt>
							<dd className="col-9 mb-4">means the online software applications provided by the Supplier as part of the Services.</dd>
							<dt className="col-3 mb-4">&quot;Subscription Term&quot;</dt>
							<dd className="col-9 mb-4">has the meaning given in clause 3.1.</dd>
							<dt className="col-3 mb-4">&quot;Supplier&quot;</dt>
							<dd className="col-9 mb-4">means Gig Grafter Limited a company registered in Northern Ireland with registration number NI636735 and located at 20a Upper Water Street, Newry, Down, Northern Ireland, BT34 1DJ.</dd>
							<dt className="col-3 mb-4">&quot;User Subscriptions&quot;</dt>
							<dd className="col-9 mb-4">means the user subscriptions provided by the Supplier to the Customer pursuant to clause 4 which entitle Authorised Users to access and use the Services and the Documentation in accordance with this Agreement.</dd>
							<dt className="col-3 mb-4">&quot;Virus&quot;</dt>
							<dd className="col-9 mb-4">means any thing or device (including any software, code, file or programme) which may: prevent, impair or otherwise adversely affect the operation of any computer software, hardware or network, any telecommunications service, equipment or network or any other service or device; prevent, impair or otherwise adversely affect access to or the operation of any programme or data, including the reliability of any programme or data (whether by re-arranging, altering or erasing the programme or data in whole or part or otherwise); or adversely affect the user experience, including worms, trojan horses, viruses and other similar things or devices.</dd>
						</dl>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Clause, schedule and paragraph headings shall not affect the interpretation of this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">A person includes an individual, corporate or unincorporated body (whether or not having separate legal personality).</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">A reference to a company shall include any company, corporation or other body corporate, wherever and however incorporated or established.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.5</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Unless the context otherwise requires, words in the singular shall include the plural and in the plural shall include the singular.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.6</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Unless the context otherwise requires, a reference to one gender shall include a reference to the other genders.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.7</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">A reference to a statute or statutory provision is a reference to it as it is in force as at the date of this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.8</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">A reference to a statute or statutory provision shall include all subordinate legislation made as at the date of this Agreement under that statute or statutory provision.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.9</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">A reference to writing or written includes email but not fax.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">2.10</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">References to clauses and schedules are to the clauses and schedules of this Agreement; references to paragraphs are to paragraphs of the relevant schedule to this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">BETA RELEASE DURATION</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">3.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">This Agreement shall continue from the Effective Date until terminated:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">3.1.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">by the Customer on giving not less than 20 Business Days&#39; prior written notice to the Supplier; or</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">3.1.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">immediately upon the parties entering into a new contract for the purchase of the Services; or</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">3.1.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">in accordance with clause 10 (termination) of this Agreement,</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">being the &quot;<strong>Subscription Term</strong>&quot;.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">5</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">USER SUBSCRIPTIONS</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Supplier hereby grants to the Customer a non-exclusive, non-transferable right, without the right to grant sub-licences, to permit the Authorised Users to use the Services during the Subscription Term solely for the Customer&#39;s internal business operations.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">In relation to the Authorised Users, the Customer undertakes that:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.2.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">the maximum number of Authorised Users that it authorises to access and use the Services shall not exceed the number of User Subscriptions it has been granted from time to time;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.2.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">it will not allow or suffer any User Subscription to be used by more than one individual Authorised User unless it has been reassigned in its entirety to another individual Authorised User, in which case the prior Authorised User shall no longer have any right to access or use the Services and/or Documentation;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.2.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">each Authorised User shall keep a secure password for his use of the Services that each Authorised User shall keep his password confidential;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.2.4</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">it shall ensure that use of the Employee Services is at all times in accordance with the Employee Terms of Use.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer shall not access, store, distribute or transmit any Viruses, or any material during the course of its use of the Services that:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.3.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">is unlawful, harmful, threatening, defamatory, obscene, infringing, harassing or racially or ethnically offensive;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.3.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">facilitates illegal activity;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.3.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">depicts sexually explicit images;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.3.4</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">promotes unlawful violence;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.3.5</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">is discriminatory based on race, gender, colour, religious belief, sexual orientation, disability; or</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.3.6</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">is otherwise illegal or causes damage or injury to any person or property;</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0"></Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">and the Supplier reserves the right, without liability or prejudice to its other rights to the Customer, to disable the Customer&#39;s access to any material that breaches the provisions of this clause.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer shall not:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.4.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">except as may be allowed by any applicable law which is incapable of exclusion by agreement between the parties and except to the extent expressly permitted under this Agreement:</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
										<Row className="no-gutters mb-4">
											<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(a)</Col>
											<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">attempt to copy, modify, duplicate, create derivative works from, frame, mirror, republish, download, display, transmit, or distribute all or any portion of the Software and/or Documentation (as applicable) in any form or media or by any means; or</Col>
										</Row>
										<Row className="no-gutters mb-4">
											<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(b)</Col>
											<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">attempt to de-compile, reverse compile, disassemble, reverse engineer or otherwise reduce to human-perceivable form all or any part of the Software; or</Col>
										</Row>
									</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.4.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">access all or any part of the Services and Documentation in order to build a product or service which competes with the Services and/or the Documentation; or</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.4.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">use the Services and/or Documentation to provide services to third parties; or</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.4.4</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">subject to clause 13.10, license, sell, rent, lease, transfer, assign, distribute, display, disclose, or otherwise commercially exploit, or otherwise make the Services and/or Documentation available to any third party except the Authorised Users, or</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.4.5</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">attempt to obtain, or assist third parties in obtaining, access to the Services and/or Documentation, other than as provided under this clause 4.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.5</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer shall use all reasonable endeavours to prevent any unauthorised access to, or use of, the Services and/or the Documentation and, in the event of any such unauthorised access or use, promptly notify the Supplier.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">5.6</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The rights provided under this clause 4 are granted to the Customer only, and shall not be considered granted to any subsidiary or holding company of the Customer.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">6</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">FEEDBACK AND REPORTING</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">6.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Supplier may from time to time request or the Customer may from time to time voluntarily supply feedback about the Services consisting of, without limitation, the Customer&#39;s suggestions, comments or any other feedback  (&quot;<strong>Feedback</strong>&quot;). If the Customer provides the Supplier with any Feedback, as part of the testing and evaluation of the Services, the Customer agrees that: (a) the Supplier may freely use, disclose, reproduce, license, distribute and otherwise utilise the Feedback in any Supplier product, specification or other documentation; and (b) the Customer will not give the Supplier any Feedback (i) that the Customer has reason to believe is subject to any Intellectual Property Right of any third party; or (ii) that is subject to licence terms that seek to require any Supplier product incorporating or derived from any Feedback, or other Supplier Intellectual Property Right, to be licensed to or otherwise shared with any third party.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">7</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">CUSTOMER DATA</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer shall own all right, title and interest in and to all of the Customer Data that is not personal data and shall have sole responsibility for the legality, reliability, integrity, accuracy and quality of all such Customer Data.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Both parties will comply with all applicable requirements of the Data Protection Legislation. This clause 6 is in addition to, and does not relieve, remove or replace, a party&#39;s obligations under the Data Protection Legislation.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The parties acknowledge that:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.3.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">if the Supplier processes any personal data on the Customer&#39;s behalf when performing its obligations under this Agreement, the Customer is the data controller and the Supplier is the data processor for the purposes of the Data Protection Legislation (where <strong>Data Controller</strong> and <strong>Data Processor</strong> have the meanings as defined in the Data Protection Legislation).</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.3.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Schedule 2 sets out the scope, nature and purpose of processing by the Supplier, the duration of the processing and the types of personal data (as defined in the Data Protection Legislation, <strong>Personal Data</strong>) and categories of Data Subject.</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.3.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">the personal data may be transferred or stored outside the EEA or the country where the Customer and the Authorised Users are located in order to carry out the Services and the Supplier&#39;s other obligations under this Agreement.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Without prejudice to the generality of clause 6.2, the Customer will ensure that it has all necessary appropriate consents and notices in place to enable lawful transfer of the Personal Data to the Supplier for the duration and purposes of this Agreement so that the Supplier may lawfully use, process and transfer the Personal Data in accordance with this Agreement on the Customer&#39;s behalf.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.5</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Without prejudice to the generality of clause 6.2, the Supplier shall, in relation to any Personal Data processed in connection with the performance by the Supplier of its obligations under this Agreement:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.5.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">process that Personal Data only on the written instructions of the Customer unless the Supplier is required by the laws of any member of the European Union or by the laws of the European Union applicable to the Supplier to process Personal Data (<strong>Applicable Laws</strong>). Where the Supplier is relying on laws of a member of the European Union or European Union law as the basis for processing Personal Data, the Supplier shall promptly notify the Customer of this before performing the processing required by the Applicable Laws unless those Applicable Laws prohibit the Supplier from so notifying the Customer;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.5.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">not transfer any Personal Data outside of the European Economic Area and the United Kingdom unless the following conditions are fulfilled:</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
										<Row className="no-gutters mb-4">
											<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(a)</Col>
											<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">the Customer or the Supplier has provided appropriate safeguards in relation to the transfer;</Col>
										</Row>
										<Row className="no-gutters mb-4">
											<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(b)</Col>
											<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">the data subject has enforceable rights and effective legal remedies;</Col>
										</Row>
										<Row className="no-gutters mb-4">
											<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(c)</Col>
											<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">the Supplier complies with its obligations under the Data Protection Legislation by providing an adequate level of protection to any Personal Data that is transferred; and</Col>
										</Row>
										<Row className="no-gutters mb-4">
											<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(d)</Col>
											<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">the Supplier complies with reasonable instructions notified to it in advance by the Customer with respect to the processing of the Personal Data;</Col>
										</Row>
									</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.5.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">assist the Customer, at the Customer&#39;s cost, in responding to any request from a Data Subject and in ensuring compliance with its obligations under the Data Protection Legislation with respect to security, breach notifications, impact assessments and consultations with supervisory authorities or regulators;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.5.4</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">notify the Customer without undue delay on becoming aware of a Personal Data breach;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.5.5</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">at the written direction of the Customer, delete or return Personal Data and copies thereof to the Customer on termination of the agreement unless required by Applicable Law to store the Personal Data; and</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.5.6</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">maintain complete and accurate records and information to demonstrate its compliance with this clause 6.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.6</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Each party shall ensure that it has in place appropriate technical and organisational measures to protect against unauthorised or unlawful processing of Personal Data and against accidental loss or destruction of, or damage to, Personal Data, appropriate to the harm that might result from the unauthorised or unlawful processing or accidental loss, destruction or damage and the nature of the data to be protected, having regard to the state of technological development and the cost of implementing any measures (those measures may include, where appropriate, pseudonymising and encrypting Personal Data, ensuring confidentiality, integrity, availability and resilience of its systems and services, ensuring that availability of and access to Personal Data can be restored in a timely manner after an incident, and regularly assessing and evaluating the effectiveness of the technical and organisational measures adopted by it).</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">7.7</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer consents to the Supplier appointing Amazon Web Services, Twilio Inc. and any other required third party supplier to enable the Supplier to provide the Services in accordance with this Agreement, as third-party processors of Personal Data under this Agreement. The Supplier confirms that it has entered or (as the case may be) will enter with the third-party processor into a written agreement incorporating terms which are substantially similar to those set out in this clause 6. As between the Customer and the Supplier, the Supplier shall remain fully liable for all acts or omissions of any third-party processor appointed by it pursuant to this clause 6.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">8</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">DISCLAIMER OF WARRANTIES</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">THE SERVICES ARE PROVIDED TO THE CUSTOMER &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY WARRANTY OF MERCHANTABILITY, NON-INFRINGEMENT OR FITNESS FOR A PARTICULAR PURPOSE.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">THE CUSTOMER ACKNOWLEDGES AND AGREES THAT THE SERVICES ARE NOT A FINISHED PRODUCT AND ARE STILL BEING DEVELOPED, TESTED AND EVALUATED AND SHALL NOT BE AVAILABLE 24 HOURS A DAY, SEVEN DAYS A WEEK.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">THE CUSTOMER ACKNOWLEDGES AND AGREES THAT THE SUPPLIER:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.3.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">EXPRESSLY REPRESENTS THAT THE SERVICES ARE NOT A FINAL PRODUCT AND, AS SUCH, MAY CONTAIN VARIOUS ERRORS, DEFECTS AND MAY BE UNSTABLE;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.3.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">SHALL FROM TIME TO TIME UPDATE THE SERVICES OR PERFORM PLANNED OR UNSCHEDULED MAINTENANCE AT NO COST TO THE CUSTOMER;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.3.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">SHALL NOT PROVIDE ANY TECHNICAL SUPPORT SERVICES IN RELATION TO THE SOFTWARE AND SERVICES. THE CUSTOMER MAY SUBMIT GENERAL ENQUIRIES TO THE SUPPLIER AND THE SUPPLIER SHALL TAKE REASONABLE STEPS TO ANSWER SUCH ENQUIRIES AND MAY, AT ITS SOLE DISCRETION, PROVIDE SUPPORT IN RELATION TO SUCH ENQUIRIES;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.3.4</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">GIVES NO REPRESENTATIONS THAT THE SOFTWARE WILL MEET THE CUSTOMER&#39;S REQUIREMENTS, BE COMPATIBLE WITH THE CUSTOMER&#39;S SYSTEMS OR BE FIT FOR ANY PARTICULAR PURPOSE;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.3.5</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">DOES NOT WARRANT THAT THE CUSTOMER&#39;S USE OF THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE; OR THAT THE SERVICES, DOCUMENTATION AND/OR THE INFORMATION OBTAINED BY THE CUSTOMER THROUGH THE SERVICES WILL MEET THE CUSTOMER&#39;S REQUIREMENTS; AND</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.3.6</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">IS NOT RESPONSIBLE FOR ANY DELAYS, DELIVERY FAILURES, OR ANY OTHER LOSS OR DAMAGE RESULTING FROM THE TRANSFER OF DATA OVER COMMUNICATIONS NETWORKS AND FACILITIES, INCLUDING THE INTERNET, AND THE CUSTOMER ACKNOWLEDGES THAT THE SERVICES AND DOCUMENTATION MAY BE SUBJECT TO LIMITATIONS, DELAYS AND PROBLEMS INHERENT IN THE USE OF SUCH COMMUNICATIONS FACILITIES.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">8.4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">This Agreement shall not prevent the Supplier from entering into similar agreements with third parties, or from independently developing, using, selling or licensing documentation, products and/or services which are similar to those provided under this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">9</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">CUSTOMER&#39;S OBLIGATIONS</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer shall:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.1.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">provide the Supplier with:</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
										<Row className="no-gutters mb-4">
											<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(a)</Col>
											<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">all necessary co-operation in relation to this Agreement; and</Col>
										</Row>
										<Row className="no-gutters mb-4">
											<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">(b)</Col>
											<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">all necessary access to such information as may be required by the Supplier; in order to provide the Services, including but not limited to Customer Data, security access information and configuration services;</Col>
										</Row>
									</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.1.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">without affecting its other obligations under this Agreement, comply with all applicable laws and regulations with respect to its activities under this Agreement;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.1.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">carry out all other Customer responsibilities set out in this Agreement in a timely and efficient manner. In the event of any delays in the Customer&#39;s provision of such assistance as agreed by the parties, the Supplier may adjust any agreed timetable or delivery schedule as reasonably necessary;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.1.4</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">ensure that the Authorised Users use the Services and the Documentation in accordance with the terms and conditions of this Agreement and shall be responsible for any Authorised User&#39;s breach of this Agreement;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.1.5</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">obtain and shall maintain all necessary licences, consents, and permissions necessary for the Supplier, its contractors and agents to perform their obligations under this Agreement, including without limitation the Services; and</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.1.6</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">be, to the extent permitted by law and except as otherwise expressly provided in this Agreement, solely responsible for procuring, maintaining and securing its network connections and telecommunications links from its systems to the Supplier&#39;s data centres, and all problems, conditions, delays, delivery failures and all other loss or damage arising from or relating to the Customer&#39;s network connections or telecommunications links or caused by the internet.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">INTELLECTUAL PROPERTY RIGHTS</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer acknowledges and agrees that the Supplier and/or its licensors own all Intellectual Property Rights in the Services and the Documentation. Except as expressly stated herein, this Agreement does not grant the Customer any rights to, under or in, any Intellectual Property Rights in respect of the Services or the Documentation.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">9.4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">All Intellectual Property Rights in relation to any Improvement shall belong to the Supplier.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">10</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">TERMINATION</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">10.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Without affecting any other right or remedy available to it, the Supplier may, at its sole discretion suspend the Customer&#39;s access to the Services or terminate this Agreement with immediate effect upon written notice to the Customer.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">10.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">On termination of this Agreement for any reason:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">10.2.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">all licences granted under this Agreement shall immediately terminate and the Customer shall immediately cease all use of the Services and/or the Documentation;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">10.2.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">each party shall return and make no further use of any equipment, property, Documentation and other items (and all copies of them) belonging to the other party;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">10.2.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">the Supplier may destroy or otherwise dispose of any of the Customer Data in its possession in accordance with clause 6.5.3, unless the Supplier receives, no later than ten days after the effective date of the termination of this Agreement, a written request for the delivery to the Customer of the then most recent back-up of the Customer Data. The Supplier shall use reasonable commercial endeavours to deliver the back-up to the Customer within 30 days of its receipt of such a written request, provided that the Customer has, at that time, paid all fees and charges outstanding at and resulting from termination (whether or not due at the date of termination). The Customer shall pay all reasonable expenses incurred by the Supplier in returning or disposing of Customer Data; and</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">10.2.4</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">any rights, remedies, obligations or liabilities of the parties that have accrued up to the date of termination, including the right to claim damages in respect of any breach of the agreement which existed at or before the date of termination shall not be affected or prejudiced.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">11</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">CONFIDENTIALITY</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Each party may be given access to Confidential Information from the other party in order to perform its obligations under this Agreement. A party&#39;s Confidential Information shall not be deemed to include information that:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.1.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">is or becomes publicly known other than through any act or omission of the receiving party;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.1.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">was in the other party&#39;s lawful possession before the disclosure;</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.1.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">is lawfully disclosed to the receiving party by a third party without restriction on disclosure; or</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.1.4</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">is independently developed by the receiving party, which independent development can be shown by written evidence.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Subject to clause 11.4, each party shall hold the other&#39;s Confidential Information in confidence and not make the other&#39;s Confidential Information available to any third party, or use the other&#39;s Confidential Information for any purpose other than the implementation of this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Each party shall take all reasonable steps to ensure that the other&#39;s Confidential Information to which it has access is not disclosed or distributed by its employees or agents in violation of the terms of this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">A party may disclose Confidential Information to the extent such Confidential Information is required to be disclosed by law, by any governmental or other regulatory authority or by a court or other authority of competent jurisdiction, provided that, to the extent it is legally permitted to do so, it gives the other party as much notice of such disclosure as possible and, where notice of disclosure is not prohibited and is given in accordance with this clause 11.4, it takes into account the reasonable requests of the other party in relation to the content of such disclosure.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.5</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Neither party shall be responsible for any loss, destruction, alteration or disclosure of Confidential Information caused by any third party.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.6</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer acknowledges that details of the Services, and the results of any performance tests of the Services, constitute the Supplier&#39;s Confidential Information.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.7</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Supplier acknowledges that the Customer Data is the Confidential Information of the Customer.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.8</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">No party shall make, or permit any person to make, any public announcement concerning this Agreement without the prior written consent of the other parties (such consent not to be unreasonably withheld or delayed), except as required by law, any governmental or regulatory authority (including, without limitation, any relevant securities exchange), any court or other authority of competent jurisdiction.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">11.9</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The above provisions of this clause 11 shall survive termination of this Agreement, however arising.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">12</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">LIMITATION OF LIABILITY</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">12.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">THE CUSTOMER ASSUMES SOLE RESPONSIBILITY FOR THE USE OF AND RESULTS OBTAINED FROM THE USE OF THE SERVICES AND THE DOCUMENTATION BY THE CUSTOMER, AND FOR CONCLUSIONS DRAWN FROM SUCH USE. THE SUPPLIER SHALL HAVE NO LIABILITY FOR ANY DAMAGE CAUSED BY ERRORS OR OMISSIONS IN ANY INFORMATION, INSTRUCTIONS OR SCRIPTS PROVIDED TO THE SUPPLIER BY THE CUSTOMER IN CONNECTION WITH THE SERVICES, OR ANY ACTIONS TAKEN BY THE SUPPLIER AT THE CUSTOMER&#39;S DIRECTION.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">12.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">ALL WARRANTIES, REPRESENTATIONS, CONDITIONS AND ALL OTHER TERMS OF ANY KIND WHATSOEVER IMPLIED BY STATUTE OR COMMON LAW ARE, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, EXCLUDED FROM THIS AGREEMENT.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">12.3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">NOTHING IN THIS AGREEMENT EXCLUDES THE LIABILITY OF THE SUPPLIER FOR DEATH OR PERSONAL INJURY CAUSED BY THE SUPPLIER&#39;S NEGLIGENCE OR FOR FRAUD OR FRAUDULENT MISREPRESENTATION.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">12.4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">SUBJECT TO CLAUSE 12.1, 12.2 AND 12.3:</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">&nbsp;</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">12.4.1</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">THE SUPPLIER SHALL NOT BE LIABLE WHETHER IN TORT (INCLUDING FOR BREACH OF STATUTORY DUTY), CONTRACT, MISREPRESENTATION, RESTITUTION OR OTHERWISE FOR ANY LOSS OF PROFITS, LOSS OF BUSINESS, DEPLETION OF GOODWILL AND/OR SIMILAR LOSSES OR LOSS OR CORRUPTION OF DATA OR INFORMATION, OR PURE ECONOMIC LOSS, OR FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL LOSS, COSTS, DAMAGES, CHARGES OR EXPENSES HOWEVER ARISING UNDER THIS AGREEMENT; AND</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">12.4.2</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">THE PARTIES&#39; TOTAL FINANCIAL LIABILITY HOWSOEVER ARISING IN CONNECTION WITH THE PERFORMANCE OF CLAUSE 6 OF THE AGREEEMENT SHALL BE LIMITED TO AN AMOUNT PAID OUT TO THAT PARTY UNDER A RELEVANT CYBER SECURITY OR DATA PROTECTION INSURANCE POLICY (THE SUPPLIER SHALL TAKE REASONABLE ENDEAVOURS TO ENSURE THAT THEY HAVE A CYBER SECURITY POLICY IN PLACE TO THE MAXIMUM AMOUNT OF &pound;250,000).</Col>
								</Row>
								<Row className="no-gutters mb-4">
									<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">12.4.3</Col>
									<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">SUBJECT TO CLAUSES 12.4.1 AND 12.4.2, THE SUPPLIER&#39;S TOTAL FINANCIAL LIABILITY IN CONTRACT, TORT (INCLUDING NEGLIGENCE OR BREACH OF STATUTORY DUTY), MISREPRESENTATION, RESTITUTION OR OTHERWISE, ARISING IN CONNECTION WITH THE PERFORMANCE OR CONTEMPLATED PERFORMANCE OF THIS AGREEMENT SHALL BE LIMITED TO NIL.</Col>
								</Row>
							</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0 font-weight-bold">13</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0 font-weight-bold">GENERAL</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.1</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">If there is an inconsistency between any of the provisions in the main body of this Agreement and the Schedules, the provisions in the main body of this Agreement shall prevail.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.2</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">No variation of this Agreement shall be effective unless it is in writing and signed by the parties (or their authorised representatives).</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.3</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">No failure or delay by a party to exercise any right or remedy provided under this Agreement or by law shall constitute a waiver of that or any other right or remedy, nor shall it prevent or restrict the further exercise of that or any other right or remedy. No single or partial exercise of such right or remedy shall prevent or restrict the further exercise of that or any other right or remedy.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.4</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Except as expressly provided in this Agreement, the rights and remedies provided under this Agreement are in addition to, and not exclusive of, any rights or remedies provided by law.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.5</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">If any provision or part-provision of this Agreement is or becomes invalid, illegal or unenforceable, it shall be deemed deleted, but that shall not affect the validity and enforceability of the rest of this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.6</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">If any provision or part-provision of this Agreement is deemed deleted under clause 13.5 the parties shall negotiate in good faith to agree a replacement provision that, to the greatest extent possible, achieves the intended commercial result of the original provision.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.7</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">This Agreement constitutes the entire agreement between the parties and supersedes and extinguishes all previous agreements, promises, assurances, warranties, representations and understandings between them, whether written or oral, relating to its subject matter.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.8</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Each party acknowledges that in entering into this Agreement it does not rely on, and shall have no remedies in respect of, any statement, representation, assurance or warranty (whether made innocently or negligently) that is not set out in this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.9</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Nothing in this clause shall limit or exclude any liability for fraud.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.10</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Customer shall not, without the prior written consent of the Supplier, assign, transfer, charge, sub-contract or deal in any other manner with all or any of its rights or obligations under this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.11</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">The Supplier may at any time assign, transfer, charge, sub-contract or deal in any other manner with all or any of its rights or obligations under this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.12</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Nothing in this Agreement is intended to or shall operate to create a partnership between the parties, or authorise either party to act as agent for the other, and neither party shall have the authority to act in the name or on behalf of or otherwise to bind the other in any way (including, but not limited to, the making of any representation or warranty, the assumption of any obligation or liability and the exercise of any right or power).</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.13</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">This Agreement does not confer any rights on any person or party (other than the parties to this Agreement and, where applicable, their successors and permitted assigns) pursuant to the Contracts (Rights of Third Parties) Act 1999.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.14</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Any notice required to be given under this Agreement shall be in writing and shall be delivered by hand or sent by pre-paid first-class post or recorded delivery post to the other party at its address set out in this Agreement, or such other address as may have been notified by that party for such purposes, or sent by fax to the other party&#39;s fax number as set out in this Agreement.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.15</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">A notice delivered by hand shall be deemed to have been received when delivered (or if delivery is not in business hours, at 9 am on the first business day following delivery). A correctly addressed notice sent by pre-paid first-class post or recorded delivery post shall be deemed to have been received at the time at which it would have been delivered in the normal course of post. A notice sent by fax shall be deemed to have been received at the time of transmission (as shown by the timed printout obtained by the sender).</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.16</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">This Agreement and any dispute or claim arising out of or in connection with it or its subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the law of Northern Ireland.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0">13.17</Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">Each party irrevocably agrees that the courts of Northern Ireland shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with this Agreement or its subject matter or formation (including non-contractual disputes or claims).</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="1" sm="1" md="1" lg="1" xl="1" className="p-0 m-0"></Col>
							<Col xs="11" sm="11" md="11" lg="11" xl="11" className="p-0 m-0">This Agreement has been entered into on the Effective Date.</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-0 m-0">&nbsp;</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-0 m-0">
								<p className="text-center font-weight-bold">SCHEDULE 1</p>
								<p className="text-center font-weight-bold">EMPLOYEE TERMS OF USE</p>
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
						<Row className="no-gutters mb-4">
							<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-0 m-0">&nbsp;</Col>
						</Row>
						<Row className="no-gutters mb-4">
							<Col xs="12" sm="12" md="12" lg="12" xl="12" className="p-0 m-0">
								<p className="text-center font-weight-bold">SCHEDULE 2</p>
								<p className="text-center font-weight-bold">PROCESSING OF PERSONAL DATA</p>
								<p className="font-weight-bold">1. PROCESSING BY THE SUPPLIER</p>
								<p>1.1 The Customer has requested that the Supplier provide it with the Online Rota Management and Shift Scheduling platform service that enables the Customer to match shifts with available workers in real-time, under the terms of the Agreement.</p>
								<p>1.2 The Supplier shall only process the Personal Data upon the Customer&#39;s instructions. In relation to the Services this shall involve the use, storage and other related processing activities as outlined in the Documentation in order to provide the on-demand shift allocation platform service.</p>
								<p>The processing shall only last for the duration of this Agreement, namely for the period of beta testing provided to the Customer.</p>
								<p className="font-weight-bold">2. CATEGORIES OF DATA SUBJECT</p>
								<p>2.1 The Supplier shall only process the Personal Data of the Customer&#39;s employees and/or workers as inputted into the Software by the Customer or provided to the Supplier to input on the Customer&#39;s behalf.</p>
								<p className="font-weight-bold">3. TYPES OF PERSONAL DATA</p>
								<p>3.1 The Supplier shall only process the types of Personal Data as inputted into the Software by the Customer, which may include:</p>
								<ul>
									<li>Name;</li>
									<li>Email address;</li>
									<li>Job description;</li>
									<li>Hourly wage;</li>
									<li>Salary and weekly contracted hours;</li>
									<li>Shift availability;</li>
									<li>Work rota.</li>
								</ul>
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

export default TermsOfService;
