import moment from 'moment';
import delay from 'lodash/delay';
import Loader from 'react-loaders';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';

import Modal from '../../common/Modal';

import Header from '../../common/Header';

import RotaForm from '../../forms/RotaForm';

import config from '../../../helpers/config';

import logMessage from '../../../helpers/logging';

import CloseButton from '../../common/CloseButton';

import Notification from '../../common/Notification';

import { getRoles } from '../../../actions/roleActions';

import { getShifts } from '../../../actions/shiftActions';

import { saveState } from '../../../store/persistedState';

import { switchWeek } from '../../../actions/weekActions';

import { getEmployees } from '../../../actions/employeeActions';

import { updateSettings } from '../../../actions/settingActions';

import { createRota, getRotas, switchRota } from '../../../actions/rotaActions';

import { getRotaTypes, switchRotaType } from '../../../actions/rotaTypeActions';

const routes = config.APP.ROUTES;

const { STATUSES } = routes.ROTAS;

const notifications = config.APP.NOTIFICATIONS;

const propTypes = {
	week: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	roles: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	shifts: PropTypes.array.isRequired,
	settings: PropTypes.object.isRequired,
	rotaTypes: PropTypes.array.isRequired,
	employees: PropTypes.array.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	week: {},
	user: {},
	rotas: [],
	roles: [],
	shifts: [],
	settings: {},
	rotaTypes: [],
	employees: [],
	authenticated: false,
};

class Dashboard extends Component {
	constructor(props) {
		super(props);

		let tokenExpired;

		const { history, authenticated } = this.props;

		if (!isEmpty(this.props.user)) {
			/* The tokens contains the expiry, so even though the users session storage still has authenticated as true, we need to make sure the token hasn't expired. */
			const token = jwtDecode(this.props.user.token);

			tokenExpired = moment().isAfter(moment.unix(token.exp));
		}

		if (!authenticated || tokenExpired) {
			history.push(routes.LOGIN.URI);
		}

		this.toastId = null;

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleGetRotas = this.handleGetRotas.bind(this);

		this.handleFetchData = this.handleFetchData.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

		this.handleSwitchRota = this.handleSwitchRota.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);
	}

	getInitialState = () => ({
		error: {},
		isRotaModalOpen: false,
		isErrorModalOpen: false,
	});

	componentDidMount = () => {
		if (isEmpty(this.props.user)) {
			return;
		}

		document.title = `${config.APP.TITLE}: ${routes.DASHBOARD.HOME.TITLE}`;

		if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			const meta = document.getElementsByTagName('meta');

			meta.description.setAttribute('content', routes.DASHBOARD.HOME.META.DESCRIPTION);
			meta.keywords.setAttribute('content', routes.DASHBOARD.HOME.META.KEYWORDS);
			meta.author.setAttribute('content', config.APP.AUTHOR.TITLE);

			document.querySelector('link[rel="home"]').setAttribute('href', `${window.location.protocol}//${window.location.host}`);
			document.querySelector('link[rel="canonical"]').setAttribute('href', `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
		}

		/* Wait 1.3 seconds before fetching data - prevents any race conditions */
		delay(() => this.handleFetchData(), 1300);
	};

	handleFetchData = () => {
		const { history, actions } = this.props;

		let payload = {};

		/* Grab all roles, employees, rota types, rotas and finally all shifts in this order. */
		logMessage('info', 'Called Dashboard handleFetchData getRoles');
		actions.getRoles()
			.then(() => {
				this.setState({ isModalOpen: false });

				logMessage('info', 'Called Dashboard handleFetchData getEmployees');
				actions.getEmployees()
					.then(() => {
						this.setState({ isModalOpen: false });

						logMessage('info', 'Called Dashboard handleFetchData getRotaTypes');
						actions.getRotaTypes()
							.then(() => {
								this.setState({ isModalOpen: false });

								if (!isEmpty(this.props.rotaTypes)) {
									/**
									 * Set the current rota type.
									 *
									 * We only want to get the first rota type rotas so we have some data by default,
									 * but use the current/previously selected rota type if one was set.
									 */
									const rotaType = (!isEmpty(this.props.rotaType)) ? this.props.rotaType : this.props.rotaTypes[0];

									logMessage('info', 'Called Dashboard handleFetchData switchRotaType');
									actions.switchRotaType(rotaType).then(() => {
										logMessage('info', 'Called Dashboard handleFetchData getRotas');
										actions.getRotas(rotaType)
											.then(() => {
												this.setState({ isModalOpen: false });

												let { settings: { firstDayOfWeek } } = this.props;

												/* We only want to get the first rotas, so we can get some shifts. Rotas sorted based on start date */
												if (!isEmpty(this.props.rotas)) {
													/* We only want to get the rota matching the current week so we have some data by default */
													let rota = this.props.rotas.filter(data => moment(data.startDate).format('YYYY-MM-DD') === moment(this.props.week.startDate).format('YYYY-MM-DD')).shift();

													/* No rotas match the current week so lets use the first rota we find */
													if (isEmpty(rota)) {
														logMessage('info', 'Called Dashboard handleFetchData - No matching rotas. Week Start Date: ', moment(this.props.week.startDate).format('YYYY-MM-DD'));
														logMessage('info', 'Called Dashboard handleFetchData - No matching rotas. Sorting rotas by start date, oldest first...');

														rota = orderBy(this.props.rotas, 'startDate', 'desc').shift();

														logMessage('info', 'Called Dashboard handleFetchData - No matching rotas. Oldest Rota Start Date:', moment(rota.startDate).format('YYYY-MM-DD'));
													} else {
														logMessage('info', 'Called Dashboard handleFetchData - Found matching rota. Rota Start Date:', moment(rota.startDate).format('YYYY-MM-DD'), 'Week Start Date:', moment(this.props.week.startDate).format('YYYY-MM-DD'));
													}

													/* Yes we have a rota but does it also match the first day of the week start day? */
													const rotaStartDay = moment(rota.startDate).day();

													if (parseInt(rotaStartDay, 10) === parseInt(firstDayOfWeek, 10)) {
														logMessage('info', 'Called Dashboard handleFetchData - Found matching rota for first day of week. Rota Start Day:', rotaStartDay, 'First Day of Week:', firstDayOfWeek);
														actions.switchRota(rota).then(() => {
															/* Then we use the current week/rota start date to set the current week start and end dates */
															const weekStartDate = moment(rota.startDate);

															const weekEndDate = moment(rota.startDate).add(6, 'days');

															payload = {
																endDate: weekEndDate,
																startDate: weekStartDate,
															};

															/* Set the current week */
															logMessage('info', 'Called Dashboard handleFetchData switchWeek');
															actions.switchWeek(payload).then(() => {
																/* Get shifts for current rota */
																logMessage('info', 'Called Dashboard handleFetchData getShifts');
																actions.getShifts(rota)
																	.then(() => history.push(routes.DASHBOARD.EMPLOYEES.URI))
																	.catch((error) => {
																		error.data.title = 'Get Shifts';

																		this.setState({ error });

																		this.handleModal();
																	});
															});
														});
													} else {
														/* No rotas match users first day of week settings but we still have a rota, so lets update th first day of the week settings to match the rota so we can display some data. User can always switch back if they want. */
														logMessage('info', 'Called Dashboard handleFetchData switchRota - updating first day of week to match');
														actions.switchRota(rota).then(() => {
															/* Then we use the current week/rota start date to set the current week start and end dates and first day of the week */
															firstDayOfWeek = moment(rota.startDate).day();

															const weekStartDate = moment(rota.startDate);

															const weekEndDate = moment(rota.startDate).add(6, 'days');

															payload = {
																endDate: weekEndDate,
																startDate: weekStartDate,
															};

															/* Set the current week */
															logMessage('info', 'Called Dashboard handleFetchData switchWeek');
															actions.switchWeek(payload).then(() => {
																/* Get shifts for current rota */
																logMessage('info', 'Called Dashboard handleFetchData getShifts');
																actions.getShifts(rota)
																	.then(() => {
																		payload = {
																			firstDayOfWeek,
																		};

																		/* Set the day of week based on start date */
																		logMessage('info', 'Called Dashboard handleFetchData updateSettings');
																		actions.updateSettings(payload);

																		logMessage('info', 'Called Dashboard handleFetchData firstDayOfWeek:', firstDayOfWeek);
																		moment.updateLocale('en', {
																			week: {
																				dow: firstDayOfWeek,
																				doy: moment.localeData('en').firstDayOfYear(),
																			},
																		});

																		history.push(routes.DASHBOARD.EMPLOYEES.URI);
																	})
																	.catch((error) => {
																		error.data.title = 'Get Shifts';

																		this.setState({ error });

																		this.handleModal();
																	});
															});
														});
													}
												} else {
													const { rotaTypeId } = rotaType;

													/* Use first day of week to get start date */
													const startDate = moment().day(firstDayOfWeek).format('YYYY-MM-DD');

													const status = STATUSES.DRAFT;

													payload = {
														status,
														budget: 0,
														startDate,
														rotaTypeId,
													};

													/* FIXME - Backend bug where you can't create rota that has a different "first day of week" starting point than previously created rota! */
													/*
													logMessage('info', 'Called Dashboard handleFetchData createRota');
													actions.createRota(payload)
														.then(newRota => this.handleSwitchRota(newRota))
														.then(() => this.handleGetRotas(rotaTypeId))
														.catch((error) => {
															error.data.title = 'Create Rota';

															this.setState({ error });

															this.handleModal();
														});
													*/
												}
											}).catch((error) => {
												error.data.title = 'Get Rotas';

												this.setState({ error });

												this.handleModal();
											});
									});
								} else {
									/* This will trigger the store to update rotas, current rota, current rota type and current week to be cleared of any values */
									logMessage('info', 'Called Dashboard handleFetchData switchRotaType but to clear all rotas, the current rota and the current rota type');
									actions.switchRotaType({});

									logMessage('info', 'Called Dashboard handleCreateRota');
									this.handleCreateRota();
								}
							}).catch((error) => {
								error.data.title = 'Get Rota Types';

								this.setState({ error });

								this.handleModal();
							});
					}).catch((error) => {
						error.data.title = 'Get Employees';

						this.setState({ error });

						this.handleModal();
					});
			}).catch((error) => {
				error.data.title = 'Get Roles';

				this.setState({ error });

				this.handleModal();
			});
	};

	handleSwitchRota = (rota) => {
		const { actions } = this.props;

		/* Set the current rota */
		logMessage('info', 'Called Dashboard handleSwitchRota switchRota');
		actions.switchRota(rota)
			.then(() => {
				const { rota: { rotaId } } = this.props;

				const payload = {
					rotaId,
				};

				/* Any time we switch rotas, we need to get a fresh list of shifts for that rota */
				logMessage('info', 'Called Dashboard handleSwitchRota getShifts');
				actions.getShifts(payload).catch((error) => {
					error.data.title = 'Get Shifts';

					this.setState({ error });

					this.handleModal();
				});
			});
	};

	handleGetRotas = (rotaTypeId) => {
		const { actions } = this.props;

		const payload = {
			rotaTypeId,
		};

		logMessage('info', 'Called Dashboard handleGetRotas getRota');
		actions.getRotas(payload).catch((error) => {
			error.data.title = 'Get Rotas';

			this.setState({ error });

			this.handleModal();
		});
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen }, () => ((!this.state.isErrorModalOpen) ? window.location.reload() : null));

	handleCreateRota = () => this.setState({ isRotaModalOpen: !this.state.isRotaModalOpen });

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}

		this.props.history.push(routes.DASHBOARD.EMPLOYEES.URI);
	};

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Row>
				<Col xs="12">
					<p className="lead m-0 pt-3 text-primary">Please wait while we load your data&hellip;</p>
				</Col>
			</Row>
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
			<Modal className="modal-dialog" show={this.state.isRotaModalOpen} onClose={this.handleCreateRota}>
				<RotaForm firstRota={true} title="Create First Rota" message={routes.ROTAS.CREATE.MESSAGE} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateRota} />
			</Modal>
		</Fragment>
	);
}

Dashboard.propTypes = propTypes;

Dashboard.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	week: state.week,
	user: state.user,
	rotas: state.rotas,
	roles: state.roles,
	shifts: state.shifts,
	settings: state.settings,
	rotaTypes: state.rotaTypes,
	employees: state.employees,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		getRoles,
		getShifts,
		createRota,
		switchWeek,
		switchRota,
		getRotaTypes,
		getEmployees,
		updateSettings,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
