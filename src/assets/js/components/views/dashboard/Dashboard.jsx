import moment from 'moment';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import { delay, isEmpty, orderBy } from 'lodash';
import React, { Fragment, Component } from 'react';

import Modal from '../../common/Modal';

import Header from '../../common/Header';

import RotaForm from '../../forms/RotaForm';

import CloseButton from '../../common/CloseButton';

import constants from '../../../helpers/constants';

import Notification from '../../common/Notification';

import { getRoles } from '../../../actions/roleActions';

import { getShifts } from '../../../actions/shiftActions';

import { saveState } from '../../../store/persistedState';

import { switchWeek } from '../../../actions/weekActions';

import { getEmployees } from '../../../actions/employeeActions';

import { getRotas, switchRota } from '../../../actions/rotaActions';

import { getRotaTypes, switchRotaType } from '../../../actions/rotaTypeActions';

const routes = constants.APP.ROUTES;

const notifications = constants.APP.NOTIFICATIONS;

const propTypes = {
	week: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	roles: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	shifts: PropTypes.array.isRequired,
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

		this.handleFetchData = this.handleFetchData.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

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

		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.HOME.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.DASHBOARD.HOME.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.DASHBOARD.HOME.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);

		/* Wait 1.3 seconds before fetching data - prevents any race conditions */
		delay(() => this.handleFetchData(), 1300);
	};

	handleFetchData = () => {
		const { actions } = this.props;

		/* Grab all roles, employees, rota types, rotas and finally all shifts in this order. */
		console.log('Called Dashboard handleFetchData getRoles');
		actions.getRoles()
			.then(() => {
				this.setState({ isModalOpen: false });

				console.log('Called Dashboard handleFetchData getEmployees');
				actions.getEmployees()
					.then(() => {
						this.setState({ isModalOpen: false });

						console.log('Called Dashboard handleFetchData getRotaTypes');
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

									console.log('Called Dashboard handleFetchData switchRotaType');
									actions.switchRotaType(rotaType).then(() => {
										console.log('Called Dashboard handleFetchData getRotas');
										actions.getRotas(rotaType)
											.then(() => {
												this.setState({ isModalOpen: false });

												/* We only want to get the first rotas shifts too, sorted based on start date, again so we have some data by default */
												if (!isEmpty(this.props.rotas)) {
													/* We only want to get the rota matching the current week so we have some data by default */
													const rota = this.props.rotas.filter(data => moment(data.startDate).format('YYYY-MM-DD') === moment(this.props.week.startDate).format('YYYY-MM-DD')).shift();

													console.log('Called Dashboard handleFetchData switchRota');
													actions.switchRota(rota).then(() => {
														/* Then we use the current week/rota start date to set the current week start and end dates */
														const weekStartDate = moment(rota.startDate).startOf('isoWeek');

														const weekEndDate = moment(rota.startDate).endOf('isoWeek');

														const payload = {
															endDate: weekEndDate,
															startDate: weekStartDate,
														};

														/* Set the current week */
														console.log('Called Dashboard handleFetchData switchWeek');
														actions.switchWeek(payload).then(() => {
															/* Get shifts for current rota */
															console.log('Called Dashboard handleFetchData getShifts');
															actions.getShifts(rota).catch((error) => {
																this.setState({ error });

																this.handleModal();
															});
														});
													});
												}
											}).catch((error) => {
												this.setState({ error });

												this.handleModal();
											});
									});
								} else {
									/* This will trigger the store to update rotas, current rota, current rota type and current week to be cleared of any values */
									console.log('Called Dashboard handleFetchData switchRotaType but to clear all rotas, the current rota and the current rota type');
									actions.switchRotaType({});

									this.handleCreateRota();
								}
							}).catch((error) => {
								this.setState({ error });

								this.handleModal();
							});
					}).catch((error) => {
						this.setState({ error });

						this.handleModal();
					});
			}).catch((error) => {
				this.setState({ error });

				this.handleModal();
			});
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen });

	handleCreateRota = () => this.setState({ isRotaModalOpen: !this.state.isRotaModalOpen });

	handleSuccessNotification = (message) => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast.success(<Notification icon="fa-check-circle" title="Success" message={message} />, {
				closeButton: false,
				autoClose: notifications.TIMEOUT,
			});
		}
	};

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
			<Modal className="modal-dialog" show={this.state.isRotaModalOpen} onClose={this.handleCreateRota}>
				<RotaForm title="Create First Rota" message={routes.ROTAS.CREATE.MESSAGE} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateRota} />
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
	rotaTypes: state.rotaTypes,
	employees: state.employees,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		getRoles,
		getShifts,
		switchWeek,
		switchRota,
		getRotaTypes,
		getEmployees,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
