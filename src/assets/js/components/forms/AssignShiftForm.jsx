import moment from 'moment';
import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
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

import { getRotas, switchRota } from '../../actions/rotaActions';

import { createPlacement } from '../../actions/placementActions';

import { getShifts, deleteShift } from '../../actions/shiftActions';

const routes = config.APP.ROUTES;

const propTypes = {
	shiftId: PropTypes.string,
	startDate: PropTypes.string,
	employeeId: PropTypes.string,
	rota: PropTypes.object.isRequired,
	week: PropTypes.object.isRequired,
	shifts: PropTypes.array.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
	handleSwitchFromAssignShiftToCreateShift: PropTypes.func.isRequired,
};

const defaultProps = {
	rota: {},
	week: {},
	shifts: [],
	rotaType: {},
	shiftId: null,
	employees: [],
	startDate: null,
	employeeId: null,
	handleClose: () => {},
	handleSuccessNotification: () => {},
	handleSwitchFromAssignShiftToCreateShift: () => {},
};

class AssignShiftForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleDelete = this.handleDelete.bind(this);

		this.handleGetRotas = this.handleGetRotas.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleUnassignedShifts = this.handleUnassignedShifts.bind(this);
	}

	getInitialState = () => ({
		error: {},
		shiftId: '',
		employeeId: '',
		unassignedShifts: [],
		unassignedShiftDate: '',
		unassignedShiftDates: [],
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));

		/* If employee id was passed in as a prop, make sure we use this instead and also update the state... */
		if (!isEmpty(this.props.employeeId)) {
			this.setState({ employeeId: this.props.employeeId });
		}

		/* Loop over all dates in current week and grab all unassigned shifts */
		const weekDates = [];

		/* Add the first date of the week to the range */
		weekDates.unshift(moment(this.props.week.startDate).toDate());

		/* Add every date between the start and end of the week */
		const firstDay = moment(this.props.week.startDate).startOf('day');

		const lastDay = moment(this.props.week.endDate).startOf('day');

		while (firstDay.add(1, 'days').diff(lastDay) < 0) {
			weekDates.push(firstDay.toDate());
		}

		/* Finally add the end of the week date */
		weekDates.push(moment(this.props.week.endDate).toDate());

		let unassignedShifts = [];

		/* Now that we have the week dates, we need to loop over each date and build up a list of unassigned shift dates */
		weekDates.forEach((weekDate, weekDateIndex) => {
			const shifts = this.handleUnassignedShifts(weekDate);

			unassignedShifts = unassignedShifts.concat(shifts);
		});

		if (unassignedShifts.length > 0) {
			/* Grab all start times, now that they are sorted and duplicates removed */
			const unassignedShiftDates = uniq(unassignedShifts.map(data => moment(data.startTime).format('YYYY-MM-DD')));

			/* Sets the default value to fix validation issues if user doesnt pick any dates */
			let [unassignedShiftDate] = unassignedShiftDates;

			/* Because the assign shift was passed a start date as a prop, (assign shift form was opened via employee view), we need to use the start date prop instead of the first unassigned shift start date for the current week */
			if (!isEmpty(this.props.startDate) && unassignedShiftDate !== this.props.startDate) {
				unassignedShiftDate = moment(this.props.startDate).format('YYYY-MM-DD');
			}

			/* Grab all shifts for the first unassigned shift date so we have some data on first load */
			unassignedShifts = this.handleUnassignedShifts(unassignedShiftDate);

			if (unassignedShifts.length > 0) {
				/* However, if shift id was passed in as a prop, make sure we use this instead of the state/first unassigned shift. */
				if (!isEmpty(this.props.shiftId)) {
					this.setState({ shiftId: this.props.shiftId });
				} else {
					this.setState({ shiftId: unassignedShifts[0] });
				}

				this.setState({
					unassignedShifts,
					unassignedShiftDate,
					unassignedShiftDates,
				});
			}
		}
	};

	componentDidUpdate = (prevProps, prevState) => {
		/* If the user picks another date or creates a new shift, update the shifts list */
		if (prevState.unassignedShiftDate !== this.state.unassignedShiftDate || prevProps.shifts !== this.props.shifts) {
			const unassignedShifts = this.handleUnassignedShifts(this.state.unassignedShiftDate);

			if (unassignedShifts.length > 0) {
				if (!isEmpty(this.props.shiftId)) {
					this.setState({ shiftId: this.props.shiftId, unassignedShifts });
				} else {
					this.setState({ shiftId: unassignedShifts[0], unassignedShifts });
				}
			}
		}
	};

	handleDelete = (event) => {
		const shift = this.props.shifts.filter(data => data.shiftId === this.state.shiftId).shift();

		/* Check if the user wants to delete the shift */
		let message = '<div class="text-center"><p>Please confirm that you wish to delete the Shift?</p><ul class="list-unstyled font-weight-bold">';

		if (!isEmpty(shift.role)) {
			message += `<li>Role: ${shift.role.roleName}</li>`;
		}

		message += `<li>Date: ${moment(shift.startTime).format('YYYY-MM-DD')}</li><li>Time: ${moment(shift.startTime).format('HH:mma')} - ${(shift.isClosingShift) ? 'Closing' : moment(shift.endTime).format('HH:mma')}</li></ul><p class="text-warning"><i class="pr-3 fa fa-fw fa-exclamation-triangle" aria-hidden="true"></i>Caution: This action cannot be undone.</p></div>`;

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
			title: 'Delete Shift',
			className: 'modal-dialog-warning',
		};

		/* If the user has clicked the proceed button, we delete the shift */
		/* If the user has clicked the cancel button, we do nothing */
		confirm(options)
			.then((result) => {
				const { actions } = this.props;

				const { shiftId } = this.state;

				const payload = {
					shiftId,
				};

				console.log('Called ShiftForm handleDelete deleteShifts');
				actions.deleteShift(payload)
					.then(() => this.handleGetShifts())
					.then(() => this.handleGetRotas())
					.then(() => {
						/* Close the modal */
						console.log('deleteShift handleClose', this.props);
						this.props.handleClose();

						/* FIXME - Make messages constants in config */
						message = '<p>Shift was deleted!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					.catch(error => this.setState({ error }));
			}, (result) => {
				/* We do nothing */
			});
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		console.log('Called AssignShiftForm handleGetShifts getShifts');
		return actions.getShifts(payload).catch(error => Promise.reject(error));
	};

	handleGetRotas = () => {
		const {
			rota,
			actions,
			rotaType: {
				rotaTypeId,
			},
		} = this.props;

		const payload = {
			rotaTypeId,
		};

		console.log('Called AssignShiftForm handleGetRotas getRotas');
		return actions.getRotas(payload)
			.then((allRotas) => {
				/* After we get all rotas, we need to find our current rota again and switch it so its details are also updated */
				const currentRota = allRotas.filter(data => data.rotaId === rota.rotaId).shift();

				console.log('Called ShiftForm handleGetRotas switchRota');
				return actions.switchRota(currentRota).catch(error => Promise.reject(error));
			})
			.catch(error => Promise.reject(error));
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			const { shiftId, employeeId } = this.state;

			const payload = {
				shiftId,
				employeeId,
			};

			console.log('Called AssignShiftForm handleSubmit createPlacement');
			actions.createPlacement(payload)
				/* Creating a placement will not update the store so we need to do another call to get all the shifts back into the store again */
				.then(() => this.handleGetShifts())
				.then(() => this.handleGetRotas())
				.then(() => {
					/* Close the modal */
					if (this.props.overview) {
						this.props.handleClose();
					}

					/* FIXME - Make messages constants in config */
					const message = '<p>Shift was assigned!</p>';

					/* Pass a message back up the rabbit hole to the parent component */
					this.props.handleSuccessNotification(message);
				})
				.catch(error => this.setState({ error }));
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	handleUnassignedShifts = (startDate) => {
		/* First of all, lets get all shifts that match the start date */
		let shifts = this.props.shifts.filter(data => (moment(data.startTime).format('YYYY-MM-DD') === moment(startDate).format('YYYY-MM-DD')) && (data.placements === null || data.placements.length === 0));

		/* Now we need to filter all shifts for the start date and only return those that have not pasted */
		shifts = shifts.filter(data => moment(data.startTime).isSameOrAfter(moment().format('YYYY-MM-DD')));

		/* Sort by start time */
		return orderBy(shifts, 'startTime');
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<FormGroup>
					<Label for="unassignedShiftDate">Date <span className="text-danger">&#42;</span></Label>
					<Input type="select" name="unassignedShiftDate" id="unassignedShiftDate" className="custom-select custom-select-xl" value={this.state.unassignedShiftDate} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="1" required>
						{this.state.unassignedShiftDates.map((unassignedShiftDate, index) => <option key={index} value={moment(unassignedShiftDate).format('YYYY-MM-DD')} label={moment(unassignedShiftDate).format('dddd, Do MMMM YYYY')}>{moment(unassignedShiftDate).format('dddd, Do MMMM YYYY')}</option>)}
					</Input>
					<FieldFeedbacks for="unassignedShiftDate" show="all">
						<FieldFeedback when="*">- Please select a date.</FieldFeedback>
					</FieldFeedbacks>
				</FormGroup>
				<Row>
					<Col xs="12" sm="9" md="9" lg="9" xl="9">
						<FormGroup>
							<Label for="shiftId">Shift <span className="text-danger">&#42;</span></Label>
							<Input type="select" name="shiftId" id="shiftId" className="custom-select custom-select-xl" value={this.state.shiftId} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="2" required>
								<option value="" label="Select Shift">Select Shift</option>
								{this.state.unassignedShifts.map((unassignedShift, index) => <option key={index} value={unassignedShift.shiftId} label={`${(!isEmpty(unassignedShift.role)) ? unassignedShift.role.roleName.concat(', ') : ''}${moment(unassignedShift.startTime).format('HH:mma')} to ${(unassignedShift.isClosingShift) ? 'Closing' : moment(unassignedShift.endTime).format('HH:mma')}`}>{`${(!isEmpty(unassignedShift.role)) ? unassignedShift.role.roleName.concat(', ') : ''}${moment(unassignedShift.startTime).format('HH:mma')} to ${(unassignedShift.isClosingShift) ? 'Closing' : moment(unassignedShift.endTime).format('HH:mma')}`}</option>)}
							</Input>
							<FieldFeedbacks for="shiftId" show="all">
								<FieldFeedback when="valueMissing">- Please select a shift.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
					<Col className="text-right" xs="12" sm="3" md="3" lg="3" xl="3">
						<FormGroup>
							<Label className="text-white">Create Shift</Label>
							<Button type="button" title="Create Shift" className="btn btn-create-select btn-toggle-fields" onClick={this.props.handleSwitchFromAssignShiftToCreateShift}>Create Shift</Button>
						</FormGroup>
					</Col>
				</Row>
				{(this.props.employees.length > 0) ? (
					<FormGroup>
						<Label for="employeeId">Employee <span className="text-danger">&#42;</span></Label>
						<Input type="select" name="employeeId" id="employeeId" className="custom-select custom-select-xl" value={this.state.employeeId} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="3" required>
							<option value="" label="Select Employee">Select Employee</option>
							{this.props.employees.map(({ employee }, index) => <option key={index} value={employee.employeeId} label={`${employee.firstName} ${employee.lastName}`}>{employee.firstName} ${employee.lastName}</option>)}
						</Input>
						<FieldFeedbacks for="employeeId" show="all">
							<FieldFeedback when="*">- Please select an employee.</FieldFeedback>
						</FieldFeedbacks>
					</FormGroup>
				) : null}
				<Button type="submit" color="primary" className="mt-4" title={routes.SHIFTS.ASSIGN.TITLE} tabIndex="4" block>{routes.SHIFTS.ASSIGN.TITLE}</Button>
				<Button type="button" className="mt-4 text-danger btn btn-outline-danger" title={routes.SHIFTS.DELETE.TITLE} tabIndex="5" block onClick={this.handleDelete}>{routes.SHIFTS.DELETE.TITLE}</Button>
			</FormWithConstraints>
		</Fragment>
	);
}

AssignShiftForm.propTypes = propTypes;

AssignShiftForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rota: state.rota,
	week: state.week,
	shifts: state.shifts,
	shiftId: props.shiftId,
	rotaType: state.rotaType,
	overview: props.overview,
	startDate: props.startDate,
	employees: state.employees,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		getShifts,
		switchRota,
		deleteShift,
		createPlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignShiftForm);
