import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { sortBy, isEmpty, debounce } from 'lodash';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import TextField from '../fields/TextField';

import constants from '../../helpers/constants';

import { getShifts } from '../../actions/shiftActions';

import { switchWeek } from '../../actions/weekActions';

import { getRotas, createRota, updateRota, deleteRota, switchRota } from '../../actions/rotaActions';

import { createRotaType, updateRotaType, deleteRotaType, switchRotaType } from '../../actions/rotaTypeActions';

const routes = constants.APP.ROUTES;

const { STATUSES } = routes.ROTAS;

const propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
	handleClose: PropTypes.func,
	week: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	rotaTypes: PropTypes.array.isRequired,
	handleSuccessNotification: PropTypes.func,
};

const defaultProps = {
	week: {},
	title: '',
	rotas: [],
	message: '',
	rotaTypes: [],
	handleClose: () => {},
	handleSuccessNotification: () => {},
};

class RotaForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleDelete = this.handleDelete.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);
	}

	getInitialState = () => ({
		budget: 0,
		error: {},
		rotaName: '',
		startDate: '',
		startDates: [],
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1000ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1000);

		const startDates = [];

		/* Get the start date of the week... */
		const startDate = moment().day(1);

		/* Update the state with a default start date */
		this.setState({ startDate: startDate.format('YYYY-MM-DD') });

		/* Add the start of the week to the list of start dates */
		startDates.push(startDate.toDate());

		/* Create a range big to cover 1 years worth of dates - surely customers wont be creating rotas up to 1 year away? */
		const endDate = moment().add(1, 'year');

		/* Loop over our range of dates and add each start date of the week to the list of start dates */
		while (startDate.isBefore(endDate)) {
			startDate.add(7, 'days');

			startDates.push(startDate.toDate());
		}

		/* Update the state again with the list of start dates */
		this.setState({ startDates });
	};

	handleChange = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleDelete = event => console.log('FIXME - Delete Rota');

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ error: {} });

		const { actions } = this.props;

		await this.form.validateFields();

		if (this.form.isValid()) {
			let payload;

			const { rotaName } = this.state;

			if (this.props.editMode) {
				console.log('FIXME - Update Rota');
			} else {
				payload = {
					rotaName,
				};

				/* Creates a new rota type */
				console.log('Called RotaForm handleSubmit createRotaType');
				actions.createRotaType(payload)
					.then((rotaType) => {
						/* Set the current rota type */
						console.log('Called RotaForm handleSubmit switchRotaType');
						actions.switchRotaType(rotaType).then(() => {
							const status = STATUSES.DRAFT;

							const { rotaTypeId } = rotaType;

							const { budget, startDate } = this.state;

							payload = {
								budget,
								status,
								startDate,
								rotaTypeId,
							};

							/* Now we create a new rota */
							console.log('Called RotaForm handleSubmit createRota');
							actions.createRota(payload)
								.then((rota) => {
									/* Set the current rota */
									console.log('Called RotaForm handleSubmit switchRota');
									actions.switchRota(rota).then(() => {
										/* Lets make sure we pull the latest list of rotas from the API and update the store */
										console.log('Called RotaForm handleSubmit getRotas');
										actions.getRotas(rotaType)
											.then(() => {
												/* Lets also make sure we pull the latest list of shifts from the API and update the store */
												console.log('Called RotaForm handleSubmit getShifts');
												actions.getShifts(rota)
													.then(() => {
														/* Then we use the new rotas start date to set the current week start and end dates */
														const weekStartDate = moment(startDate, 'YYYY-MM-DD').startOf('isoWeek');

														const weekEndDate = moment(startDate, 'YYYY-MM-DD').endOf('isoWeek');

														payload = {
															endDate: weekEndDate,
															startDate: weekStartDate,
														};

														/* Set the current week */
														console.log('Called RotaForm handleSubmit switchWeek');
														actions.switchWeek(payload).then(() => {
															/* Close the modal */
															this.props.handleClose();

															const message = '<p>Rota created successfully</p>';

															/* Pass a message back up the rabbit hole to the parent component */
															this.props.handleSuccessNotification(message);
														});
													})
													.catch(error => this.setState({ error }));
											})
											.catch(error => this.setState({ error }));
									});
								})
								.catch(error => this.setState({ error }));
						});
					})
					.catch(error => this.setState({ error }));
			}
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{(!isEmpty(this.props.title)) ? (<h2 className="text-center text-uppercase">{this.props.title}</h2>) : null}
			{(!isEmpty(this.props.message)) ? (<p className="lead mt-3 mb-4 pl-4 pr-4 text-center">{this.props.message}</p>) : null}
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<TextField fieldName="rotaName" fieldLabel="Rota Name" fieldValue={this.state.rotaName} fieldPlaceholder="e.g. Kitchen" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid rota name." fieldTabIndex={1} fieldRequired={true} />
				<TextField fieldName="budget" fieldLabel="Budget" fieldValue={this.state.budget} fieldPlaceholder="e.g. 1000" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid budget." fieldTabIndex={2} fieldRequired={true} />
				<FormGroup>
					<Label for="startDate">Select Start Date <span className="text-danger">&#42;</span></Label>
					<Input type="select" name="startDate" id="startDate" className="custom-select custom-select-xl" value={this.state.startDate} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="3" required={true}>
						{this.state.startDates.map((startDate, index) => <option key={index} value={moment(startDate).format('YYYY-MM-DD')} label={moment(startDate).format('dddd, Do MMMM YYYY')} />)}
					</Input>
					<FieldFeedbacks for="startDate" show="all">
						<FieldFeedback when="*">- Please provide a valid start date.</FieldFeedback>
					</FieldFeedbacks>
				</FormGroup>
				{(this.props.editMode) ? (
					<Button type="submit" color="primary" className="mt-4" title={routes.ROTAS.UPDATE.TITLE} tabIndex="4" block>{routes.ROTAS.UPDATE.TITLE}</Button>
				) : (
					<Button type="submit" color="primary" className="mt-4" title={routes.ROTAS.CREATE.TITLE} tabIndex="4" block>{routes.ROTAS.CREATE.TITLE}</Button>
				)}
			</FormWithConstraints>
		</Fragment>
	);
}

RotaForm.propTypes = propTypes;

RotaForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	week: state.week,
	rotas: state.rotas,
	rotaTypes: state.rotaTypes,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		getShifts,
		switchWeek,
		createRota,
		updateRota,
		deleteRota,
		switchRota,
		createRotaType,
		updateRotaType,
		deleteRotaType,
		switchRotaType,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RotaForm);
