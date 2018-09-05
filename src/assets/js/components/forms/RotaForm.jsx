import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import confirm from '../../helpers/confirm';

import TextField from '../fields/TextField';

import logMessage from '../../helpers/logging';

import NumberField from '../fields/NumberField';

import { getShifts } from '../../actions/shiftActions';

import { switchWeek } from '../../actions/weekActions';

import { updateSettings } from '../../actions/settingActions';

import { getRotas, createRota, updateRota, switchRota } from '../../actions/rotaActions';

import { getRotaTypes, createRotaType, updateRotaType, deleteRotaType, switchRotaType } from '../../actions/rotaTypeActions';

const routes = config.APP.ROUTES;

const { STATUSES } = routes.ROTAS;

const propTypes = {
	title: PropTypes.string,
	rotaId: PropTypes.string,
	message: PropTypes.string,
	user: PropTypes.object.isRequired,
	week: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	shifts: PropTypes.array.isRequired,
	firstRota: PropTypes.bool.isRequired,
	settings: PropTypes.object.isRequired,
	rotaTypes: PropTypes.array.isRequired,
	rotaType: PropTypes.object.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	user: {},
	week: {},
	title: '',
	rotas: [],
	shifts: [],
	rotaId: '',
	message: '',
	settings: {},
	rotaType: {},
	rotaTypes: [],
	firstRota: false,
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

		this.handleGetRotas = this.handleGetRotas.bind(this);

		this.handleChangeBudget = this.handleChangeBudget.bind(this);

		this.handleGetRotaTypes = this.handleGetRotaTypes.bind(this);
	}

	getInitialState = () => ({
		error: {},
		budget: '',
		rotaId: '',
		status: '',
		message: '',
		rotaName: '',
		startDate: '',
		rotaTypeId: '',
		startDates: [],
		haystackRotaTypes: [],
		startDateReadOnly: false,
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));

		/* If shift id was passed in as a prop, make sure we also update the state... Used when editing a shift */
		if (!isEmpty(this.props.rotaId)) {
			this.setState({ rotaId: this.props.rotaId });
		}

		/* Do a bit of string replacement here - replacing FIRST_NAME with the users real first name value */
		let { message } = this.props;

		const { firstName } = this.props.user;

		message = message.replace('<FIRST_NAME>', firstName);

		this.setState({ message });

		let startDates = [];

		/* Get the start date of the week... */
		let startDate = moment().startOf('week');

		/* Update the state with a default start date */
		this.setState({ startDate: startDate.format('YYYY-MM-DD') });

		/* Add the start of the week to the list of start dates */
		startDates.push(startDate.toDate());

		/* Create a range big to cover 1 years worth of dates - surely customers wont be creating rotas up to 1 year away? */
		const endDate = moment().add(1, 'year');

		/* Loop over our range of dates and add each start date of the week to the list of start dates */
		while (startDate.isBefore(endDate)) {
			/* Set to 1 day so rota start dates can be any day of the week */
			startDate.add(1, 'days');

			startDates.push(startDate.toDate());
		}

		let haystackRotaTypes = this.props.rotaTypes;

		/* Update the state again with the list of start dates */
		this.setState({ startDates, haystackRotaTypes });

		/* If we are in edit mode, we basically need to overwrite most of the above except for the rota id */
		if (this.props.editMode && !isEmpty(this.props.rotaId)) {
			const rota = this.props.rotas.filter(data => data.rotaId === this.props.rotaId).shift();

			const { status, budget } = rota;

			const rotaStartDate = moment(rota.startDate);

			startDate = rotaStartDate.format('YYYY-MM-DD');

			const { rotaTypeId, rotaTypeName } = this.props.rotaType;

			startDates = [];

			/* Add the start of the week to the list of start dates */
			startDates.push(rotaStartDate.toDate());

			/* Loop over our range of dates and add each start date of the week to the list of start dates */
			while (rotaStartDate.isBefore(endDate)) {
				/* Set to 1 day so rota start dates can be any day of the week */
				rotaStartDate.add(1, 'days');

				startDates.push(rotaStartDate.toDate());
			}

			/* Removes current rota type name from duplicate list so we dont trigger a duplicate in edit mode */
			haystackRotaTypes = haystackRotaTypes.filter(data => data.rotaTypeId !== rotaTypeId);

			/* Business Rule - Users can only change a rotas start date if there is only 1 rota and it has no shifts. In all other circumstances, the start date is readonly. */
			let { startDateReadOnly } = this.state;

			if (this.props.rotas.length === 1) {
				startDateReadOnly = false;

				if (this.props.shifts.length > 0) {
					startDateReadOnly = true;
				}
			} else {
				startDateReadOnly = true;
			}

			/* Update the state with all the edit rota details */
			this.setState({
				status,
				startDate,
				rotaTypeId,
				startDates,
				haystackRotaTypes,
				startDateReadOnly,
				rotaName: rotaTypeName,
				budget: (budget === '' || budget === undefined) ? 0 : budget,
			});
		}
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleChangeBudget = (event, values) => this.setState({ budget: values.floatValue });

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleGetRotaTypes = () => {
		logMessage('info', 'Called RotaForm handleGetRotaTypes getRotaTypes');

		return this.props.actions.getRotaTypes().catch(error => Promise.reject(error));
	};

	handleGetRotas = () => {
		const { rotaType: { rotaTypeId }, actions } = this.props;

		const payload = {
			rotaTypeId,
		};

		logMessage('info', 'Called RotaForm handleGetRotas getRotas');

		return actions.getRotas(payload).catch(error => Promise.reject(error));
	};

	handleDelete = (event) => {
		const rotaType = this.props.rotaTypes.filter(data => data.rotaTypeId === this.state.rotaTypeId).shift();

		/* Check if the user wants to delete the shift */
		let message = '<div class="text-center"><p>Please confirm that you wish to delete the Rota?</p><p class="text-uppercase"><i class="pr-3 fa fa-fw fa-exclamation-triangle text-warning" aria-hidden="true"></i>This will permanently delete all shifts, past and present for the rota!</p><p class="text-uppercase"><i class="pr-3 fa fa-fw fa-exclamation-triangle text-warning" aria-hidden="true"></i>Caution: This action cannot be undone.</p></div>';

		const options = {
			message,
			labels: {
				cancel: 'Cancel',
				proceed: 'Delete',
			},
			values: {
				cancel: false,
				process: true,
			},
			colors: {
				proceed: 'danger',
			},
			title: 'Delete Rota',
			className: 'modal-dialog-warning',
		};

		/* If the user has clicked the proceed button, we delete the rota type */
		/* If the user has clicked the cancel button, we do nothing */
		confirm(options)
			.then((result) => {
				const { actions, history } = this.props;

				const { rotaTypeId } = this.state;

				const payload = {
					rotaTypeId,
				};

				logMessage('info', 'Called RotaForm handleDelete deleteRotaType');

				actions.deleteRotaType(payload)
					.then(() => this.handleGetRotaTypes())
					.then(() => this.handleGetRotas())
					.then(() => {
						/* Close the modal */
						this.props.handleClose();

						/* FIXME - Make messages constants in config */
						message = '<p>Rota was deleted!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					.catch(error => this.setState({ error }));
			}, (result) => {
				/* We do nothing */
			});
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ error: {} });

		const { actions } = this.props;

		await this.form.validateFields();

		if (this.form.isValid()) {
			const { rotaName, rotaTypeId } = this.state;

			let payload = {
				rotaName,
				rotaTypeId,
			};

			if (this.props.editMode) {
				logMessage('info', 'Called RotaForm handleSubmit updateRotaType');

				actions.updateRotaType(payload)
					.then((updatedRotaType) => {
						/* Set the current rota type */
						logMessage('info', 'Called RotaForm handleSubmit switchRotaType');

						actions.switchRotaType(updatedRotaType).then(() => {
							let { startDate } = this.state;

							const { status, rotaId, budget } = this.state;

							startDate = moment(startDate).format('YYYY-MM-DD');

							payload = {
								status,
								rotaId,
								startDate,
								rotaTypeId,
								budget: (budget === '' || budget === undefined) ? 0 : budget,
							};

							/* Now we create a new rota */
							logMessage('info', 'Called RotaForm handleSubmit updateRota');

							actions.updateRota(payload)
								.then((updatedRota) => {
									/* Set the current rota */
									logMessage('info', 'Called RotaForm handleSubmit switchRota');

									actions.switchRota(updatedRota).then(() => {
										/* Lets make sure we pull the latest list of rota types and rotas from the API and update the store */
										logMessage('info', 'Called RotaForm handleSubmit getRotaTypes');

										actions.getRotaTypes()
											.then(() => {
												logMessage('info', 'Called RotaForm handleSubmit getRotas');

												actions.getRotas(updatedRotaType)
													.then(() => {
														/* Lets also make sure we pull the latest list of shifts from the API and update the store */
														logMessage('info', 'Called RotaForm handleSubmit getShifts');

														actions.getShifts(updatedRota)
															.then(() => {
																/* Then we use the new rotas start date to set the current week start and end dates */
																const firstDayOfWeek = moment(startDate).day();

																const weekStartDate = moment(startDate, 'YYYY-MM-DD');

																const weekEndDate = moment(startDate, 'YYYY-MM-DD').add(6, 'days');

																payload = {
																	endDate: weekEndDate,
																	startDate: weekStartDate,
																};

																/* Set the current week */
																logMessage('info', 'Called RotaForm handleSubmit switchWeek');

																actions.switchWeek(payload).then(() => {
																	payload = {
																		firstDayOfWeek,
																	};

																	/* Set the day of week based on start date */
																	logMessage('info', 'Called RotaForm handleSubmit updateSettings');

																	actions.updateSettings(payload).then(() => {
																		logMessage('info', 'Called RotaForm handleSubmit firstDayOfWeek:', firstDayOfWeek);

																		moment.updateLocale('en', {
																			week: {
																				dow: firstDayOfWeek,
																				doy: moment.localeData('en').firstDayOfYear(),
																			},
																		});

																		/* Close the modal */
																		this.props.handleClose();

																		/* FIXME - Make messages constants in config */
																		const message = '<p>Rota was updated!</p>';

																		/* Pass a message back up the rabbit hole to the parent component */
																		this.props.handleSuccessNotification(message);
																	});
																});
															})
															.catch(error => this.setState({ error }));
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
			} else {
				/* Creates a new rota type */
				logMessage('info', 'Called RotaForm handleSubmit createRotaType');

				actions.createRotaType(payload)
					.then((rotaType) => {
						/* Set the current rota type */
						logMessage('info', 'Called RotaForm handleSubmit switchRotaType');

						actions.switchRotaType(rotaType).then(() => {
							const status = STATUSES.DRAFT;

							const { budget, startDate } = this.state;

							payload = {
								status,
								startDate,
								rotaTypeId: rotaType.rotaTypeId,
								budget: (budget === '' || budget === undefined) ? 0 : budget,
							};

							/* Now we create a new rota */
							logMessage('info', 'Called RotaForm handleSubmit createRota');

							actions.createRota(payload)
								.then((rota) => {
									/* Set the current rota */
									logMessage('info', 'Called RotaForm handleSubmit switchRota');

									actions.switchRota(rota).then(() => {
										/* Lets make sure we pull the latest list of rotas from the API and update the store */
										logMessage('info', 'Called RotaForm handleSubmit getRotas');

										actions.getRotas(rotaType)
											.then(() => {
												/* Lets also make sure we pull the latest list of shifts from the API and update the store */
												logMessage('info', 'Called RotaForm handleSubmit getShifts');

												actions.getShifts(rota)
													.then(() => {
														/* Then we use the new rotas start date to set the current week start and end dates */
														const firstDayOfWeek = moment(startDate).day();

														const weekStartDate = moment(startDate, 'YYYY-MM-DD');

														const weekEndDate = moment(startDate, 'YYYY-MM-DD').add(6, 'days');

														payload = {
															endDate: weekEndDate,
															startDate: weekStartDate,
														};

														/* Set the current week */
														logMessage('info', 'Called RotaForm handleSubmit switchWeek');

														actions.switchWeek(payload).then(() => {
															payload = {
																firstDayOfWeek,
															};

															/* Set the day of week based on start date */
															logMessage('info', 'Called RotaForm handleSubmit updateSettings');

															actions.updateSettings(payload).then(() => {
																logMessage('info', 'Called RotaForm handleSubmit firstDayOfWeek:', firstDayOfWeek);

																moment.updateLocale('en', {
																	week: {
																		dow: firstDayOfWeek,
																		doy: moment.localeData('en').firstDayOfYear(),
																	},
																});

																/* Close the modal */
																this.props.handleClose();

																/* FIXME - Make messages constants in config */
																const message = '<p>Rota was updated!</p>';

																/* Pass a message back up the rabbit hole to the parent component */
																this.props.handleSuccessNotification(message);
															});
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

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{(!isEmpty(this.props.title)) ? (<h2 className="text-center text-uppercase">{this.props.title}</h2>) : null}
			{(!isEmpty(this.state.message)) ? (<div className="lead mt-3 mb-4 pl-4 pr-4 text-center" dangerouslySetInnerHTML={{ __html: this.state.message }} />) : null}
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<TextField fieldName="rotaName" fieldLabel="Rota Name" fieldValue={this.state.rotaName} fieldPlaceholder="e.g. Bar" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid rota name." fieldTabIndex={1} fieldRequired={true} showIsDuplicate isDuplicateHaystack={this.state.haystackRotaTypes.map(data => data.rotaTypeName)} />
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="startDate">Start Date {(this.state.startDateReadOnly) ? <small className="text-muted">Readonly</small> : <span className="text-danger">&#42;</span>}</Label>
							{(this.state.startDateReadOnly) ? (
								<Input type="text" name="startDate" id="startDate" value={moment(this.state.startDate).format('dddd, Do MMMM YYYY')} tabIndex={3} readOnly />
							) : (
								<Input type="select" name="startDate" id="startDate" className="custom-select custom-select-xl" value={this.state.startDate} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="3" required={true}>
									{this.state.startDates.map((startDate, index) => <option key={index} value={moment(startDate).format('YYYY-MM-DD')} label={moment(startDate).format('dddd, Do MMMM YYYY')}>{moment(startDate).format('dddd, Do MMMM YYYY')}</option>)}
								</Input>
							)}
							<FieldFeedbacks for="startDate" show="all">
								<FieldFeedback when="*">- Please select a start date.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<NumberField fieldName="budget" fieldLabel="Budget" fieldValue={this.state.budget} fieldPlaceholder="e.g. £2,000 (optional)" handleChange={this.handleChangeBudget} handleBlur={this.handleBlur} valueMissing="Please provide a valid budget." fieldTabIndex={2} fieldRequired={false} />
					</Col>
				</Row>
				{(this.props.editMode) ? (
					<Fragment>
						<Button type="submit" color="primary" className="mt-4" id="submitUpdate" title={routes.ROTAS.UPDATE.TITLE} tabIndex="4" block>{routes.ROTAS.UPDATE.TITLE}</Button>
						<Button type="button" className="mt-4 text-danger btn btn-outline-danger" title={routes.ROTAS.DELETE.TITLE} tabIndex="5" block onClick={this.handleDelete}>{routes.ROTAS.DELETE.TITLE}</Button>
					</Fragment>
				) : (
					<Button type="submit" color="primary" className="mt-4" id="submitCreate" title={routes.ROTAS.CREATE.TITLE} tabIndex="4" block>{routes.ROTAS.CREATE.TITLE}</Button>
				)}
			</FormWithConstraints>
		</Fragment>
	);
}

RotaForm.propTypes = propTypes;

RotaForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	user: state.user,
	week: state.week,
	rotas: state.rotas,
	rotaId: props.rotaId,
	shifts: state.shifts,
	settings: state.settings,
	editMode: props.editMode,
	rotaType: state.rotaType,
	rotaTypes: state.rotaTypes,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		getShifts,
		switchWeek,
		createRota,
		updateRota,
		switchRota,
		getRotaTypes,
		createRotaType,
		updateRotaType,
		deleteRotaType,
		switchRotaType,
		updateSettings,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RotaForm);
