import $ from 'jquery';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { sortBy, isEmpty } from 'lodash';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';

import Modal from './Modal';

import RotaForm from '../forms/RotaForm';

import ShiftForm from '../forms/ShiftForm';

import { switchWeek } from '../../actions/weekActions';

import { getRotas, switchRota } from '../../actions/rotaActions';

import { getRotaTypes, switchRotaType } from '../../actions/rotaTypeActions';

const propTypes = {
	rotas: PropTypes.array.isRequired,
	account: PropTypes.object.isRequired,
	rotaType: PropTypes.object.isRequired,
	rotaTypes: PropTypes.array.isRequired,
};

const defaultProps = {
	rotas: [],
	account: {},
	rotaType: {},
	rotaTypes: [],
};

class Toolbar extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleModal = this.handleModal.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

		this.handleCreateShift = this.handleCreateShift.bind(this);

		this.handleSwitchRotaType = this.handleSwitchRotaType.bind(this);
	}

	getInitialState = () => ({
		error: {},
		isRotaModalOpen: false,
		isErrorModalOpen: false,
		isShiftModalOpen: false,
	});

	componentDidMount = () => {
		const { actions } = this.props;

		$('.btn-rotas-popover').popover({
			html: true,
			trigger: 'focus',
			placement: 'bottom',
			content: () => $('#rotas-list').html(),
		});

		/* Bit hacky and not the "React Way" but because we are using Popovers, event handlers are not binded! */
		$(document).on('shown.bs.popover', () => {
			$('.create-rota, .switch-rota-type').bind('click');

			$('.create-rota').on('click', event => this.handleCreateRota());

			$('.switch-rota-type').on('click', event => this.handleSwitchRotaType(event));
		});
	};

	handleSwitchRotaType = (event) => {
		const { actions } = this.props;

		const target = event.currentTarget;

		if (this.props.rotaTypes.length > 0) {
			const rotaType = this.props.rotaTypes.find(type => type.rotaTypeId === target.id);

			if (!isEmpty(rotaType)) {
				/* Switch rota type and fetch all rotas for this type, grab latest rota and update current week */
				console.log('Called Toolbar handleSwitchRotaType switchRotaType');
				actions.switchRotaType(rotaType).then(() => {
					console.log('Called Toolbar handleSwitchRotaType getRotas');
					actions.getRotas(rotaType)
						.then(() => {
							let rota;

							if (this.props.rotas.length > 1) {
								const rotas = sortBy(this.props.rotas, 'startDate');

								rota = rotas.slice(0).shift();
							} else {
								rota = this.props.rotas.slice(0).shift();
							}

							console.log('Called Toolbar handleSwitchRotaType switchRota');
							actions.switchRota(rota);

							/* Then we use the rotas start date to set the current week start and end dates */
							const weekStartDate = moment(rota.startDate).startOf('isoWeek');

							const weekEndDate = moment(rota.startDate).endOf('isoWeek');

							const payload = {
								endDate: weekEndDate,
								startDate: weekStartDate,
							};

							/* Set the current week */
							console.log('Called Toolbar handleSwitchRotaType switchWeek');
							actions.switchWeek(payload);
						})
						.catch((error) => {
							this.setState({ error });

							this.handleModal();
						});
				});
			}
		}
	};

	handleModal = () => this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen });

	handleCreateRota = () => this.setState({ isRotaModalOpen: !this.state.isRotaModalOpen });

	handleCreateShift = () => this.setState({ isShiftModalOpen: !this.state.isShiftModalOpen });

	render = () => (
		<Fragment>
			<Row>
				<Col className="pt-3 pb-0 pt-sm-3 pb-ms-3 text-center text-sm-left" xs="12" sm="6" md="6" lg="6" xl="6">
					<button type="button" className="btn btn-rotas-popover text-dark border-0" aria-label="Toggle Rotas">{this.props.account.name}, {this.props.rotaType.rotaTypeName}<i className="pl-2 fa fa-chevron-down" aria-hidden="true"></i></button>
					<div className="d-none" id="rotas-list">
						<ul className="popover-menu">
							{(this.props.rotaTypes.length > 0) ? this.props.rotaTypes.map((rotaType, index) => <li key={index}><button type="button" title={rotaType.rotaTypeName} className="btn btn-action btn-nav border-0 switch-rota-type" id={rotaType.rotaTypeId}>{rotaType.rotaTypeName}</button></li>) : null}
							<li>
								<button type="button" title="Add New Rota" className="btn btn-primary btn-nav border-0 create-rota">Add New Rota</button>
								<Modal title="Rotas" className="modal-dialog" buttonLabel="Cancel" show={this.state.isRotaModalOpen} onClose={this.handleCreateRota}>
									<RotaForm />
								</Modal>
							</li>
						</ul>
					</div>
				</Col>
				<Col className="pt-3 pb-3 pt-sm-3 pb-ms-3 text-center text-sm-right" xs="12" sm="6" md="6" lg="6" xl="6">
					<button type="button" title="Add New Shift" className="btn btn-secondary pl-5 pr-5 pl-md-4 pr-md-4 pl-lg-5 pr-lg-5 border-0" onClick={this.handleCreateShift}><i className="pr-2 fa fa-plus" aria-hidden="true"></i>Add New Shift</button>
					<Modal title="Shifts" className="modal-dialog" buttonLabel="Cancel" show={this.state.isShiftModalOpen} onClose={this.handleCreateShift}>
						<ShiftForm />
					</Modal>
				</Col>
			</Row>
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
	rotas: state.rotas,
	rotaType: state.rotaType,
	rotaTypes: state.rotaTypes,
	account: state.user.account,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		switchWeek,
		switchRota,
		getRotaTypes,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
