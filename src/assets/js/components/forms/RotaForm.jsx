import moment from 'moment';
import Select from 'react-select';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import TextField from '../fields/TextField';

import NumberField from '../fields/NumberField';

import constants from '../../helpers/constants';

import { getShifts } from '../../actions/shiftActions';

import { switchWeek } from '../../actions/weekActions';

import { getRotas, createRota, updateRota, deleteRota, switchRota } from '../../actions/rotaActions';

import { createRotaType, updateRotaType, deleteRotaType, switchRotaType } from '../../actions/rotaTypeActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	onClose: PropTypes.func,
	title: PropTypes.string,
	message: PropTypes.string,
	week: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	rotaTypes: PropTypes.array.isRequired,
};

const defaultProps = {
	week: {},
	title: '',
	rotas: [],
	message: '',
	rotaTypes: [],
	onClose: () => {},
};

class RotaForm extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleDelete = this.handleDelete.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleChangeBudget = this.handleChangeBudget.bind(this);

		this.handleCreateOption = this.handleCreateOption.bind(this);

		this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
	}

	getInitialState = () => ({
		budget: 0,
		error: {},
		rotaName: '',
		startDate: '',
		created: false,
		updated: false,
		deleted: false,
		startDateOptions: [],
		selectedStartDate: '',
	});

	componentDidMount = () => {
		const now = moment();

		const startDates = [];

		/* Sets the default value to fix validation issues if user doesnt pick any dates */
		let selectedStartDate;

		const startDateOptions = [];

		/* Lets create and range big to cover a years worth - surely customers wont be creating rotas for up to a year away...? */
		const end = moment().add(360, 'days');

		/* Get the start day of the week... */
		const startDate = now.clone().day(1);

		/* If the current day of the week is also the start day of the week, then use the current day (1 = Monday, 2 = Tuesday ... ), otherwise step forward 7 days to next week */
		if (startDate.day() === now.day()) {
			selectedStartDate = this.handleCreateOption(startDate.format('dddd, Do MMMM YYYY'));

			startDates.push(now.format('dddd, Do MMMM YYYY'));
		} else {
			selectedStartDate = this.handleCreateOption(startDate.add(7, 'days').format('dddd, Do MMMM YYYY'));
		}

		/* Add all our start dates to an array and create a options list */
		if (startDate.isAfter(now, 'day')) {
			startDates.push(startDate.format('dddd, Do MMMM YYYY'));
		}

		while (startDate.isBefore(end)) {
			startDate.add(7, 'days');

			startDates.push(startDate.format('dddd, Do MMMM YYYY'));
		}

		startDates.forEach((date) => {
			const startDateOption = this.handleCreateOption(date);

			startDateOptions.push(startDateOption);
		});

		this.setState({ startDateOptions, selectedStartDate, startDate: selectedStartDate.value });
	};

	handleChange = async (event) => {
		this.setState({ created: false, updated: false, deleted: false });

		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		await this.form.validateFields(target);
	};

	handleChangeBudget = async (event) => {
		this.setState({ created: false, updated: false, deleted: false });

		const target = event.currentTarget;

		target.value = (!target.value) ? 0 : target.value;

		const budget = parseInt(target.value, 10);

		this.setState({
			[target.name]: budget,
		});

		await this.form.validateFields(target);
	};

	handleChangeStartDate = async (startDate) => {
		this.setState({ created: false, updated: false, deleted: false });

		if (isEmpty(startDate)) {
			this.setState({ startDate: '' });
		} else {
			this.setState({ startDate: startDate.value });
		}

		this.setState({ selectedStartDate: startDate });

		await this.form.validateFields('startDate');
	};

	handleCreateOption = label => ({
		label,
		value: moment(label, 'dddd, Do MMMM YYYY').format('YYYY-MM-DD'),
	});

	handleDelete = async event => console.log('FIXME - Delete Rota');

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({
			error: {},
			created: false,
			updated: false,
			deleted: false,
		});

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
							const { rotaTypeId } = rotaType;

							const { budget, startDate } = this.state;

							payload = {
								budget,
								startDate,
								rotaTypeId,
							};

							/* Now we create a new rota */
							console.log('Called RotaForm handleSubmit createRota', payload);
							actions.createRota(payload)
								.then((rota) => {
									/* Set the current rota */
									console.log('Called RotaForm handleSubmit switchRota');
									actions.switchRota(rota).then(() => {
										/* Lets make sure we pull the latest list of rotas from the API and update the store */
										actions.getRotas(rotaType)
											.then(rotas => sortBy(rotas, 'startDate'))
											.then((rotas) => {
												const firstRota = rotas.slice(0).shift();

												/* Lets also make sure we pull the latest list of shifts from the API and update the store */
												console.log('Called RotaForm handleSubmit getShifts');
												actions.getShifts(firstRota)
													.then(() => {
														/* Then we use the new rotas start date to set the current week start and end dates */
														const weekStartDate = moment(startDate, 'YYYY-MM-DD');

														const weekEndDate = moment(startDate, 'YYYY-MM-DD').add(7, 'days');

														payload = {
															endDate: weekEndDate,
															startDate: weekStartDate,
														};

														/* Set the current week */
														console.log('Called RotaForm handleSubmit switchWeek');
														actions.switchWeek(payload).then(() => this.setState({ budget: 0, rotaName: '', created: true }));
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

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	successMessage = () => {
		const { created, updated, deleted } = this.state;

		if (created) {
			return (<Alert color="success" message="Rota was created successfully." />);
		} else if (updated) {
			return (<Alert color="success" message="Rota was updated successfully." />);
		} else if (deleted) {
			return (<Alert color="success" message="Rota was deleted successfully." />);
		}

		return null;
	};

	render = () => (
		<Fragment>
			{(!isEmpty(this.props.title)) ? (<h2 className="text-center text-uppercase">{this.props.title}</h2>) : null}
			{(!isEmpty(this.props.message)) ? (<p className="lead mb-4 pl-4 pr-4 text-center">{this.props.message}</p>) : null}
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<TextField fieldName="rotaName" fieldLabel="Rota Name" fieldValue={this.state.rotaName} fieldPlaceholder="e.g. Kitchen" handleChange={this.handleChange} valueMissing="Please provide a valid rota name." tabIndex="1" fieldRequired />
				<NumberField fieldName="budget" fieldLabel="Budget" fieldValue={this.state.budget} fieldPlaceholder="e.g. 1000" handleChange={this.handleChangeBudget} valueMissing="Please provide a valid budget." tabIndex="2" fieldRequired />
				<FormGroup>
					<Label for="startDate">Select Start Date <span className="text-danger">&#42;</span></Label>
					<Select name="startDate" id="startDate" className="select-autocomplete-container" classNamePrefix="select-autocomplete" onChange={this.handleChangeStartDate} value={this.state.selectedStartDate} options={this.state.startDateOptions} tabIndex="3" required={true} />
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
