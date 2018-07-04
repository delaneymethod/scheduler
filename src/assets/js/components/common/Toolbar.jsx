import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { orderBy, isEmpty } from 'lodash';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Col, Row, Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import Modal from './Modal';

import RotaForm from '../forms/RotaForm';

import ShiftForm from '../forms/ShiftForm';

import constants from '../../helpers/constants';

import CloseButton from '../common/CloseButton';

import Notification from '../common/Notification';

import { switchWeek } from '../../actions/weekActions';

import { getShifts } from '../../actions/shiftActions';

import { getRotas, switchRota, updateRota } from '../../actions/rotaActions';

import { getRotaTypes, switchRotaType } from '../../actions/rotaTypeActions';

const routes = constants.APP.ROUTES;

const { STATUSES } = routes.ROTAS;

const notifications = constants.APP.NOTIFICATIONS;

const propTypes = {
	rota: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	rotaType: PropTypes.object.isRequired,
	rotaTypes: PropTypes.array.isRequired,
};

const defaultProps = {
	rota: {},
	rotas: [],
	rotaType: {},
	rotaTypes: [],
};

class Toolbar extends Component {
	constructor(props) {
		super(props);

		this.toastId = null;

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handlePublishRota = this.handlePublishRota.bind(this);

		this.handleRotaTypeMenu = this.handleRotaTypeMenu.bind(this);

		this.handleSwitchRotaType = this.handleSwitchRotaType.bind(this);

		this.handleSuccessNotification = this.handleSuccessNotification.bind(this);
	}

	getInitialState = () => ({
		error: {},
		isRotaModalOpen: false,
		isErrorModalOpen: false,
		isShiftModalOpen: false,
		isRotaTypeMenuPopoverOpen: false,
	});

	handleSwitchRotaType = (event) => {
		const { actions } = this.props;

		const target = event.currentTarget;

		if (this.props.rotaTypes.length > 0) {
			const rotaType = this.props.rotaTypes.find(data => data.rotaTypeId === target.id);

			if (!isEmpty(rotaType)) {
				this.setState(this.getInitialState());

				/* Switch rota type and fetch all rotas for this type, grab latest rota and update current week */
				console.log('Called Toolbar handleSwitchRotaType switchRotaType');
				actions.switchRotaType(rotaType).then(() => {
					console.log('Called Toolbar handleSwitchRotaType getRotas');
					actions.getRotas(rotaType)
						.then(() => {
							const rotas = orderBy(this.props.rotas, 'startDate', 'desc');

							const rota = rotas[0];

							console.log('Called Toolbar handleSwitchRotaType switchRota');
							actions.switchRota(rota).then(() => {
								/* Then we use the rotas start date to set the current week start and end dates */
								const weekStartDate = moment(rota.startDate).startOf('isoWeek');

								const weekEndDate = moment(rota.startDate).endOf('isoWeek');

								const payload = {
									endDate: weekEndDate,
									startDate: weekStartDate,
								};

								/* Set the current week */
								console.log('Called Toolbar handleSwitchRotaType switchWeek');
								actions.switchWeek(payload).then(() => {
									/* Get shifts for current rota */
									console.log('Called Toolbar handleSwitchRotaType getShifts');
									actions.getShifts(rota).catch((error) => {
										this.setState({ error });

										this.handleModal();
									});
								});
							});
						})
						.catch((error) => {
							this.setState({ error });

							this.handleModal();
						});
				});
			}
		}
	};

	handlePublishRota = () => {
		const { rota, rotaType: { rotaTypeId }, actions } = this.props;

		let { startDate } = rota;

		const { rotaId, budget } = rota;

		const status = STATUSES.PUBLISHED;

		startDate = moment(startDate).format('YYYY-MM-DD');

		const payload = {
			rotaId,
			budget,
			status,
			startDate,
			rotaTypeId,
		};

		actions.updateRota(payload).catch((error) => {
			this.setState({ error });

			this.handleModal();
		});
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen });

	handleCreateRota = () => this.setState({ isRotaModalOpen: !this.state.isRotaModalOpen });

	handleCreateShift = () => this.setState({ isShiftModalOpen: !this.state.isShiftModalOpen });

	handleRotaTypeMenu = () => this.setState({ isRotaTypeMenuPopoverOpen: !this.state.isRotaTypeMenuPopoverOpen });

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
			<Row>
				<Col className="pt-3 pb-0 pt-sm-3 pb-ms-3 text-center text-sm-left" xs="12" sm="3" md="6" lg="6" xl="6">
					<button type="button" className="btn btn-rotas-popover text-dark border-0 col-12 col-sm-auto" id="rotaTypeMenu" title="Toggle Rotas" aria-label="Toggle Rotas" onClick={this.handleRotaTypeMenu}>{this.props.rotaType.rotaTypeName}<i className="pl-2 fa fa-fw fa-chevron-down" aria-hidden="true"></i></button>
					<Popover placement="bottom" isOpen={this.state.isRotaTypeMenuPopoverOpen} target="rotaTypeMenu" toggle={this.handleRotaTypeMenu}>
						<PopoverBody>
							<ul className="popover-menu">
								{(this.props.rotaTypes.length > 0) ? this.props.rotaTypes.map((rotaType, index) => <li key={index}><button type="button" title={rotaType.rotaTypeName} className="btn btn-action btn-nav border-0" id={rotaType.rotaTypeId} onClick={this.handleSwitchRotaType}>{rotaType.rotaTypeName}</button></li>) : null}
								<li><button type="button" title="Add New Rota" className="btn btn-primary btn-nav border-0" onClick={this.handleCreateRota}>Add New Rota</button></li>
							</ul>
						</PopoverBody>
					</Popover>
				</Col>
				<Col className="pt-3 pb-3 pt-sm-3 pb-ms-3 text-center text-sm-right" xs="12" sm="9" md="6" lg="6" xl="6">
					<button type="button" title="Create Shift" className="btn btn-secondary col-12 col-sm-auto mb-3 mb-sm-0 pl-5 pr-5 pl-md-4 pr-md-4 pl-lg-5 pr-lg-5 border-0" onClick={this.handleCreateShift}><i className="pr-2 fa fa-fw fa-plus" aria-hidden="true"></i>Create Shift</button>
					{(this.props.rota.status === STATUSES.DRAFT) ? (
						<button type="button" title="Publish Rota" className="btn btn-nav btn-primary col-12 col-sm-auto pl-5 pr-5 pl-md-4 pr-md-4 pl-lg-5 pr-lg-5 ml-sm-3 border-0" onClick={this.handlePublishRota}>Publish</button>
					) : (
						<button type="button" title={this.props.rota.status} className="btn btn-rotas-popover text-dark col-12 col-sm-auto pl-5 pr-5 pl-md-4 pr-md-4 pl-lg-5 pr-lg-5 ml-sm-3 border-0" disabled>{this.props.rota.status}</button>
					)}
				</Col>
			</Row>
			<Modal title="Rotas" className="modal-dialog" show={this.state.isRotaModalOpen} onClose={this.handleCreateRota}>
				<RotaForm handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateRota} />
			</Modal>
			<Modal title="Shifts" className="modal-dialog" show={this.state.isShiftModalOpen} onClose={this.handleCreateShift}>
				<ShiftForm startDate={moment().format('YYYY-MM-DD')} handleSuccessNotification={this.handleSuccessNotification} handleClose={this.handleCreateShift} />
			</Modal>
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isErrorModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
		</Fragment>
	);
}

Toolbar.propTypes = propTypes;

Toolbar.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rota: state.rota,
	rotas: state.rotas,
	rotaType: state.rotaType,
	rotaTypes: state.rotaTypes,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		getShifts,
		switchWeek,
		switchRota,
		updateRota,
		getRotaTypes,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
