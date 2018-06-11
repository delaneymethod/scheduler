import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';

import Modal from '../../common/Modal';

import Header from '../../common/Header';

import RotaForm from '../../forms/RotaForm';

import constants from '../../../helpers/constants';

import { getRoles } from '../../../actions/roleActions';

import { getShifts } from '../../../actions/shiftActions';

import { saveState } from '../../../store/persistedState';

import { getEmployees } from '../../../actions/employeeActions';

import { getRotas, switchRota } from '../../../actions/rotaActions';

import { getRotaTypes, switchRotaType } from '../../../actions/rotaTypeActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	rotas: PropTypes.array.isRequired,
	roles: PropTypes.array.isRequired,
	shifts: PropTypes.array.isRequired,
	rotaTypes: PropTypes.array.isRequired,
	account: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	rotas: [],
	roles: [],
	shifts: [],
	account: {},
	rotaTypes: [],
	employees: [],
	authenticated: false,
};

class Dashboard extends Component {
	constructor(props) {
		super(props);

		const { history, authenticated } = this.props;

		if (!authenticated) {
			history.push(routes.LOGIN.URI);
		}

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleFetchData = this.handleFetchData.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

		this.handleFetchData();
	}

	getInitialState = () => ({
		error: {},
		isRotaModalOpen: false,
		isErrorModalOpen: false,
	});

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.HOME.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.DASHBOARD.HOME.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.DASHBOARD.HOME.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);
	};

	handleFetchData = () => {
		const { actions } = this.props;

		/* Grab all roles, employees, rota types, rotas and finally all shifts in this order. */
		console.log('Called Dashboard componentDidMount getRoles');
		actions.getRoles().then(() => {
			this.setState({ isModalOpen: false });

			console.log('Called Dashboard componentDidMount getEmployees');
			actions.getEmployees().then(() => {
				this.setState({ isModalOpen: false });

				console.log('Called Dashboard componentDidMount getRotaTypes');
				actions.getRotaTypes().then(() => {
					this.setState({ isModalOpen: false });

					if (this.props.rotaTypes.length > 0) {
						/* Set the current rota type */
						/* We only want to get the first rota type rotas so we have some data by default */
						const rotaType = this.props.rotaTypes.slice(0).shift();

						console.log('Called Dashboard componentDidMount switchRotaType');
						actions.switchRotaType(rotaType).then(() => {
							console.log('Called Dashboard componentDidMount getRotas');
							actions.getRotas(rotaType).then(() => {
								this.setState({ isModalOpen: false });

								/* We only want to get the first rotas shifts too, sorted based on start date, again so we have some data by default */
								if (this.props.rotas.length > 0) {
									let rota;

									if (this.props.rotas.length > 1) {
										const rotas = sortBy(this.props.rotas, 'startDate');

										rota = rotas.slice(0).shift();
									} else {
										rota = this.props.rotas.slice(0).shift();
									}

									/* Set the current rota */
									console.log('Called Dashboard componentDidMount switchRota');
									actions.switchRota(rota).then(() => {
										console.log('Called Dashboard componentDidMount getShifts');
										actions.getShifts(rota).catch((error) => {
											this.setState({ error });

											this.handleModal();
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
						console.log('Called Dashboard componentDidMount switchRotaType but to clear all rotas, the current rota and the current rota type');
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

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
			<Modal isStatic={true} className="modal-dialog" show={this.state.isRotaModalOpen} onClose={this.handleCreateRota}>
				<RotaForm title="Create First Rota" message={routes.ROTAS.CREATE.MESSAGE} onClose={this.handleCreateRota} />
			</Modal>
		</Fragment>
	);
}

Dashboard.propTypes = propTypes;

Dashboard.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rotas: state.rotas,
	roles: state.roles,
	shifts: state.shifts,
	rotaTypes: state.rotaTypes,
	employees: state.employees,
	account: state.user.account,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		getRoles,
		getShifts,
		switchRota,
		getRotaTypes,
		getEmployees,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
