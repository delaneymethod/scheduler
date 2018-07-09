import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { uniq, orderBy, isEmpty, debounce } from 'lodash';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import constants from '../../helpers/constants';

import { getShifts } from '../../actions/shiftActions';

import { createPlacement } from '../../actions/placementActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	startDate: PropTypes.string,
	employeeId: PropTypes.string,
	rota: PropTypes.object.isRequired,
	week: PropTypes.object.isRequired,
	shifts: PropTypes.array.isRequired,
	employees: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
	handleSwitchFromAssignShiftToCreateShift: PropTypes.func.isRequired,
};

const defaultProps = {
	rota: {},
	week: {},
	shifts: [],
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
		console.log('this.props.startDate:', this.props.startDate);

		/* We debounce this call to wait 1000ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1000);

		/* Sets the default value to fix validation issues if user doesnt pick any employee */
		/* However, if employee id was passed in as a prop, make sure we use this instead and also update the state... */
		if (!isEmpty(this.props.employeeId)) {
			this.setState({ employeeId: this.props.employeeId });
		} else {
			this.setState({ employeeId: this.props.employees[0].employee.employeeId });
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
				const { shiftId } = unassignedShifts[0];

				this.setState({
					shiftId,
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
				const { shiftId } = unassignedShifts[0];

				this.setState({ shiftId, unassignedShifts });
			}
		}
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
		actions.getShifts(payload).catch(error => this.setState({ error }));
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
				.then(() => {
					/* Close the modal */
					this.props.handleClose();

					const message = '<p>Shift was assigned!</p>';

					/* Pass a message back up the rabbit hole to the parent component */
					this.props.handleSuccessNotification(message);
				})
				.then(() => this.handleGetShifts())
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

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<FormGroup>
					<Label for="unassignedShiftDate">Date <span className="text-danger">&#42;</span></Label>
					<Input type="select" name="unassignedShiftDate" id="unassignedShiftDate" className="custom-select custom-select-xl" value={this.state.unassignedShiftDate} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="1" required>
						{this.state.unassignedShiftDates.map((unassignedShiftDate, index) => <option key={index} value={moment(unassignedShiftDate).format('YYYY-MM-DD')} label={moment(unassignedShiftDate).format('dddd, Do MMMM YYYY')} />)}
					</Input>
					<FieldFeedbacks for="unassignedShiftDate" show="all">
						<FieldFeedback when="*">- Please select a date.</FieldFeedback>
					</FieldFeedbacks>
				</FormGroup>
				<FormGroup>
					<Label for="shiftId">Shift <span className="text-danger">&#42;</span></Label>
					<div className="input-group">
						<Input type="select" name="shiftId" id="shiftId" className="custom-select custom-select-xl" value={this.state.shiftId} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="2" required>
							{this.state.unassignedShifts.map((unassignedShift, index) => <option key={index} value={unassignedShift.shiftId} label={`${unassignedShift.role.roleName}, ${moment(unassignedShift.startTime).format('HH:mm a')} to ${(unassignedShift.isClosingShift) ? 'Closing' : moment(unassignedShift.endTime).format('HH:mm a')}`} />)}
						</Input>
						<div className="input-group-append">
							<Button title="Create Shift" id="btn-toggle" className="input-group-text border-0 btn-toggle-fields" onClick={this.props.handleSwitchFromAssignShiftToCreateShift}>Create Shift</Button>
						</div>
					</div>
					<FieldFeedbacks for="shiftId" show="all">
						<FieldFeedback when="valueMissing">- Please select a shift.</FieldFeedback>
					</FieldFeedbacks>
				</FormGroup>
				{(this.props.employees.length > 0) ? (
					<FormGroup>
						<Label for="employeeId">Employee <span className="text-danger">&#42;</span></Label>
						<Input type="select" name="employeeId" id="employeeId" className="custom-select custom-select-xl" value={this.state.employeeId} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="3" required>
							{this.props.employees.map(({ employee }, index) => <option key={index} value={employee.employeeId} label={`${employee.firstName} ${employee.lastName}`} />)}
						</Input>
						<FieldFeedbacks for="employeeId" show="all">
							<FieldFeedback when="*">- Please select an employee.</FieldFeedback>
						</FieldFeedbacks>
					</FormGroup>
				) : null}
				<Button type="submit" color="primary" className="mt-4" title={routes.SHIFTS.ASSIGN.TITLE} tabIndex="4" block>{routes.SHIFTS.ASSIGN.TITLE}</Button>
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
	employees: state.employees,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getShifts,
		createPlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignShiftForm);
