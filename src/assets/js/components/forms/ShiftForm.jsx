import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, debounce } from 'lodash';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import confirm from '../../helpers/confirm';

import constants from '../../helpers/constants';

import { getRoles } from '../../actions/roleActions';

import InputSelectField from '../fields/InputSelectField';

import { getShifts, createShift, updateShift, deleteShift } from '../../actions/shiftActions';

import { createPlacement, updatePlacement, deletePlacement } from '../../actions/placementActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	editMode: PropTypes.bool,
	shiftId: PropTypes.string,
	startDate: PropTypes.string,
	employeeId: PropTypes.string,
	placementId: PropTypes.string,
	week: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
	roles: PropTypes.array.isRequired,
	shifts: PropTypes.array.isRequired,
	employees: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	week: {},
	rota: {},
	roles: [],
	shifts: [],
	shiftId: null,
	employees: [],
	editMode: false,
	startDate: null,
	employeeId: null,
	placementId: null,
	handleClose: () => {},
	handleSuccessNotification: () => {},
};

class ShiftForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.times = [];

		this.timeInterval = 15;

		this.maxNumberOfPositions = 1;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleDelete = this.handleDelete.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleGetRoles = this.handleGetRoles.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleChangeTime = this.handleChangeTime.bind(this);
	}

	getInitialState = () => ({
		error: {},
		shift: {},
		shiftId: '',
		endTime: '',
		roleName: '',
		startDate: '',
		startTime: '',
		startDates: [],
		employeeId: '',
		placementId: '',
		numberOfPositions: 1,
		isClosingShift: false,
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1000ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1000);

		/* If employee id was passed in as a prop, make sure we also update the state... */
		if (!isEmpty(this.props.employeeId)) {
			this.setState({ employeeId: this.props.employeeId });
		}

		/* If placement id was passed in as a prop, make sure we also update the state... Used when editing a shift */
		if (!isEmpty(this.props.placementId)) {
			this.setState({ placementId: this.props.placementId });
		}

		/* If shift id was passed in as a prop, make sure we also update the state... Used when editing a shift */
		if (!isEmpty(this.props.shiftId)) {
			this.setState({ shiftId: this.props.shiftId });
		}

		/* Sets the default value to fix validation issues if user doesnt pick any role */
		if (this.props.roles.length > 0) {
			this.setState({ roleName: this.props.roles[0].roleName });
		}

		/* 24 hours * 60 mins in an hour */
		let hours = 24 * 60;

		if (this.timeInterval === 15) {
			/* 24 hours * 15 mins in an hour (DO NOT EDIT. Edit this.timeInterval instead). */
			hours = 24 * 4;
		} else if (this.timeInterval === 30) {
			/* 24 hours * 30 mins in an hour (DO NOT EDIT. Edit this.timeInterval instead). */
			hours = 24 * 2;
		}

		/* Set default start and end times, to nearest time intervals */
		const start = moment().startOf('day');

		const remainder = this.timeInterval - (moment().minute() % this.timeInterval);

		let startTime = moment().add(remainder, 'minutes').format('HH:mm A');

		let endTime = moment().add(1, 'hour').add(remainder, 'minutes').format('HH:mm A');

		this.setState({ startTime, endTime });

		for (let i = 0; i < hours; i += 1) {
			const time = moment(start).add(this.timeInterval * i, 'minutes').format('HH:mm A');

			this.times.push(time);
		}

		/* Because the shift was passed a start date as a prop, (shift form was opened via employee view), we need to hide times in the past so user can pick 2pm if its currently 4pm */
		if (!isEmpty(this.props.startDate) && moment(this.props.startDate).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
			this.times = this.times.filter(time => moment(time, 'HH:mm A').isSameOrAfter(moment()));
		}

		/* Added 23:59 PM to the list as a midnight option */
		const midnight = moment(start).endOf('day').format('HH:mm A');

		this.times.push(midnight);

		/* Sets the default value to fix validation issues if user doesnt pick any dates */
		let startDate;

		/* Because the shift was passed a start date as a prop, (shift form was opened via employee view), we need to use the start date prop instead of the current week start date */
		if (!isEmpty(this.props.startDate)) {
			startDate = moment(this.props.startDate).format('YYYY-MM-DD');
		} else {
			startDate = moment(this.props.week.startDate).format('YYYY-MM-DD');
		}

		/* Our range will be the current week */
		const startDates = [];

		/* Add the first date of the week to the range */
		startDates.unshift(moment(this.props.week.startDate).toDate());

		/* Add every date between the start and end of the week */
		const firstDay = moment(this.props.week.startDate).startOf('day');

		const lastDay = moment(this.props.week.endDate).startOf('day');

		while (firstDay.add(1, 'days').diff(lastDay) < 0) {
			startDates.push(firstDay.toDate());
		}

		/* Finally add the end of the week date */
		startDates.push(moment(this.props.week.endDate).toDate());

		this.setState({ startDate, startDates });

		/* If we are in edit mode, we basically need to overwrite most of the above except for the shift id, placement id, employee id */
		if (this.props.editMode && !isEmpty(this.props.shiftId)) {
			const shift = this.props.shifts.filter(data => data.shiftId === this.props.shiftId).shift();

			/* Override role name */
			const { roleName } = shift.role;

			const { isClosingShift, numberOfPositions } = shift;

			endTime = moment(shift.endTime).format('HH:mm A');

			startTime = moment(shift.startTime).format('HH:mm A');

			/* We already have the start date passed in as a prop, but lets set it again, just to be safe */
			startDate = moment(shift.startTime).format('YYYY-MM-DD');

			/* Update the state with all the edit shift details */
			this.setState({
				endTime,
				roleName,
				startTime,
				startDate,
				isClosingShift,
				numberOfPositions,
			});
		}
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleChangeTime = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		await this.form.validateFields('startTime', 'endTime');
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		console.log('Called ShiftForm handleGetShifts getShifts');
		actions.getShifts(payload).catch(error => this.setState({ error }));
	};

	handleGetRoles = () => {
		console.log('Called ShiftForm handleGetRoles getRoles');
		this.props.actions.getRoles().catch(error => this.setState({ error }));
	};

	handleDelete = (event) => {
		const shift = this.props.shifts.filter(data => data.shiftId === this.state.shiftId).shift();

		const accountEmployee = this.props.employees.filter(data => data.employee.employeeId === this.state.employeeId).shift();

		/* Check if the user wants to delete the shift */
		let message = `<div class="text-center"><p>Please confirm that you wish to delete the Shift?</p><ul class="list-unstyled font-weight-bold"><li>Employee: ${accountEmployee.employee.firstName} ${accountEmployee.employee.lastName}</li><li>Role: ${shift.role.roleName}</li><li>Date: ${moment(shift.startTime).format('YYYY-MM-DD')}</li><li>Time: ${moment(shift.startTime).format('HH:mm a')} - ${(shift.isClosingShift) ? 'Closing' : moment(shift.endTime).format('HH:mm a')}</li></ul><p class="text-warning"><i class="pr-3 fa fa-fw fa-exclamation-triangle" aria-hidden="true"></i>Caution: This action cannot be undone.</p></div>`;

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
					.then(() => {
						/* Close the modal */
						this.props.handleClose(event, '', moment());

						message = '<p>Shift was deleted!</p>';

						/* Pass a message back up the rabbit hole to the parent component */
						this.props.handleSuccessNotification(message);
					})
					.then(() => this.handleGetShifts())
					.catch(error => this.setState({ error }));
			}, (result) => {
				/* We do nothing */
			});
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		const { shifts, actions, rota: { rotaId } } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			let { endTime, startTime, isClosingShift } = this.state;

			const {
				shiftId,
				roleName,
				startDate,
				employeeId,
				placementId,
				numberOfPositions,
			} = this.state;

			/* We need to make sure our start and end values are in the format like 2018-06-05 18:50:00 and if its a closing shift, force the end time to be midnight */
			endTime = `${startDate} ${moment(endTime, 'HH:mm A').format('HH:mm:ss')}`;

			startTime = `${startDate} ${moment(startTime, 'HH:mm A').format('HH:mm:ss')}`;

			/* Makes sure we are working with proper booleans and not boolean strings */
			isClosingShift = (isClosingShift === 'true');

			if (isClosingShift) {
				endTime = `${startDate} 23:59:00`;
			}

			let payload = {
				rotaId,
				shiftId,
				endTime,
				roleName,
				startTime,
				isClosingShift,
				numberOfPositions,
			};

			if (this.props.editMode) {
				/* Keep track of old shifts before updating so we can do checks on the employee/placement */
				const oldShifts = shifts;

				console.log('Called ShiftForm handleSubmit updateShift');
				actions.updateShift(payload)
					.then(() => {
						/* Get the edit shift again based on shift id. Updated shift doesnt have placments included */
						const oldShift = oldShifts.filter(data => data.shiftId === shiftId).shift();

						/* Get the matching placement (based on the employee id) */
						const oldPlacement = oldShift.placements.filter(data => data.employee.employeeId === employeeId).shift();

						/**
						 * If the placement is empty, this means that no matching placement was found for the employee id, so we need to update the placement.
						 * If there was a match, the shift belongs to same employee id.
						 */
						if (isEmpty(oldPlacement)) {
							if (isEmpty(employeeId)) {
								payload = {
									placementId,
								};

								/* Employee Id was unselected so lets delete the placement for the shift */
								console.log('Called ShiftForm handleSubmit deletePlacement');
								actions.deletePlacement(payload)
									/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
									.then(() => {
										/* Close the modal */
										this.props.handleClose(event, '', moment());

										const message = '<p>Shift was updated!</p>';

										/* Pass a message back up the rabbit hole to the parent component */
										this.props.handleSuccessNotification(message);
									})
									/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
									.then(() => this.handleGetShifts())
									.catch(error => this.setState({ error }));
							} else {
								payload = {
									shiftId,
									employeeId,
									placementId,
								};

								/**
								 * If the employee id is the same as the shifts employee id, we can assume the user has just dragged the shift into a different day in the same employees row
								 * If the employee id is different, then we can assume the user has dragged and shift into a different employees row
								 */
								console.log('Called ShiftForm handleSubmit updatePlacement');
								actions.updatePlacement(payload)
									/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
									.then(() => {
										/* Close the modal */
										this.props.handleClose(event, '', moment());

										const message = '<p>Shift was updated!</p>';

										/* Pass a message back up the rabbit hole to the parent component */
										this.props.handleSuccessNotification(message);
									})
									/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
									.then(() => this.handleGetShifts())
									.catch(error => this.setState({ error }));
							}
						} else {
							/* Close the modal */
							this.props.handleClose(event, '', moment());

							const message = '<p>Shift was updated!</p>';

							/* Pass a message back up the rabbit hole to the parent component */
							this.props.handleSuccessNotification(message);

							/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
							this.handleGetShifts();
						}
					})
					/* The user can select or create a role so we need to get roles each time we update or create a shift */
					.then(() => this.handleGetRoles())
					.catch(error => this.setState({ error }));
			} else {
				console.log('Called ShiftForm handleSubmit createShift');
				actions.createShift(payload)
					.then((shift) => {
						if (!isEmpty(employeeId)) {
							payload = {
								employeeId,
								shiftId: shift.shiftId,
							};

							console.log('Called ShiftForm handleSubmit createPlacement');
							actions.createPlacement(payload)
								.then(() => {
									/* Close the modal */
									this.props.handleClose(event, '', moment());

									const message = '<p>Shift was created!</p>';

									/* Pass a message back up the rabbit hole to the parent component */
									this.props.handleSuccessNotification(message);
								})
								.then(() => this.handleGetShifts())
								.catch(error => this.setState({ error }));
						} else {
							/* Close the modal */
							this.props.handleClose(event, '', moment());

							const message = '<p>Shift was created!</p>';

							/* Pass a message back up the rabbit hole to the parent component */
							this.props.handleSuccessNotification(message);

							this.handleGetShifts();
						}
					})
					/* The user can select or create a role so we need to get roles each time we update or create a shift */
					.then(() => this.handleGetRoles())
					.catch(error => this.setState({ error }));
			}
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<FormGroup>
					<Label for="startDate">Date <span className="text-danger">&#42;</span></Label>
					<Input type="select" name="startDate" id="startDate" className="custom-select custom-select-xl" value={this.state.startDate} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="1" required={true}>
						{this.state.startDates.map((startDate, index) => <option key={index} value={moment(startDate).format('YYYY-MM-DD')} label={moment(startDate).format('dddd, Do MMMM YYYY')} />)}
					</Input>
					<FieldFeedbacks for="startDate" show="all">
						<FieldFeedback when="*">- Please select a start date.</FieldFeedback>
					</FieldFeedbacks>
				</FormGroup>
				<InputSelectField fieldName="roleName" fieldLabel="Role Name" fieldValue={this.state.roleName} fieldPlaceholder="e.g Manager" handleChange={this.handleChange} handleBlur={this.handleBlur} valueMissing="Please provide a valid role name." fieldTabIndex={2} fieldRequired={true} fieldToggleButtonLabel="Role" fieldOptions={this.props.roles} />
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="startTime">Start Time</Label>
							<Input type="select" name="startTime" id="startTime" className="custom-select custom-select-xl" value={this.state.startTime} onChange={this.handleChangeTime} onBlur={this.handleBlur} tabIndex="3" required>
								{this.times.map((time, index) => <option key={index} value={time} label={time} />)}
							</Input>
							<FieldFeedbacks for="startTime" show="all">
								<FieldFeedback when="*" />
								<FieldFeedback when={value => (!(moment(value, 'HH:mm A').isBefore(moment(this.state.endTime, 'HH:mm A'))))}>- Please select a valid start time.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="endTime">End Time</Label>
							<Input type="select" name="endTime" id="endTime" className="custom-select custom-select-xl" value={this.state.endTime} onChange={this.handleChangeTime} onBlur={this.handleBlur} tabIndex="4" required>
								{this.times.map((time, index) => <option key={index} value={time} label={time} />)}
							</Input>
							<FieldFeedbacks for="endTime" show="all">
								<FieldFeedback when="*" />
								<FieldFeedback when={value => (!(moment(value, 'HH:mm A').isAfter(moment(this.state.startTime, 'HH:mm A'))))}>- Please select a valid end time.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="numberOfPositions">Number Of Positions</Label>
							<Input type="select" name="numberOfPositions" id="numberOfPositions" className="custom-select custom-select-xl" value={this.state.numberOfPositions} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="5" required>
								{Array.from({ length: this.maxNumberOfPositions }, (key, value) => value + 1).map((position, index) => <option key={index} value={position} label={position} />)}
							</Input>
							<FieldFeedbacks for="numberOfPositions" show="all">
								<FieldFeedback when="*">- Please select the number of positions.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="isClosingShift">Is Closing Shift</Label>
							<Input type="select" name="isClosingShift" id="isClosingShift" className="custom-select custom-select-xl" value={this.state.isClosingShift} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="6" required>
								<option value="false" label="No" />
								<option value="true" label="Yes" />
							</Input>
							<FieldFeedbacks for="isClosingShift" show="all">
								<FieldFeedback when="*">- Please select if this shift is a closing shift.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
				</Row>
				{(this.props.employees.length > 0) ? (
					<FormGroup>
						<Label for="employeeId">Assign Employee</Label>
						<Input type="select" name="employeeId" id="employeeId" className="custom-select custom-select-xl" value={this.state.employeeId} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="7">
							<option value="" label="" />
							{this.props.employees.map(({ employee }, index) => <option key={index} value={employee.employeeId} label={`${employee.firstName} ${employee.lastName}`} />)}
						</Input>
						<FieldFeedbacks for="employeeId" show="all">
							<FieldFeedback when="*">- Please select an employee.</FieldFeedback>
						</FieldFeedbacks>
					</FormGroup>
				) : null}
				{(this.props.editMode) ? (
					<Fragment>
						<Button type="submit" color="primary" className="mt-4" title={routes.SHIFTS.UPDATE.TITLE} tabIndex="8" block>{routes.SHIFTS.UPDATE.TITLE}</Button>
						<Button type="button" className="mt-4 text-danger btn btn-outline-danger" title={routes.SHIFTS.DELETE.TITLE} tabIndex="9" block onClick={this.handleDelete}>{routes.SHIFTS.DELETE.TITLE}</Button>
					</Fragment>
				) : (
					<Button type="submit" color="primary" className="mt-4" title={routes.SHIFTS.CREATE.TITLE} tabIndex="8" block>{routes.SHIFTS.CREATE.TITLE}</Button>
				)}
			</FormWithConstraints>
		</Fragment>
	);
}

ShiftForm.propTypes = propTypes;

ShiftForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	week: state.week,
	rota: state.rota,
	roles: state.roles,
	shifts: state.shifts,
	shiftId: props.shiftId,
	editMode: props.editMode,
	startDate: props.startDate,
	employees: state.employees,
	employeeId: props.employeeId,
	placementId: props.placementId,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRoles,
		getShifts,
		createShift,
		updateShift,
		deleteShift,
		createPlacement,
		updatePlacement,
		deletePlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShiftForm);
