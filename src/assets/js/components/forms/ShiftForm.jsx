import Moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { extendMoment } from 'moment-range';
import React, { Fragment, Component } from 'react';
import { delay, isEmpty, includes, orderBy, debounce } from 'lodash';
import { Row, Col, Label, Input, Button, Tooltip, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import confirm from '../../helpers/confirm';

import config from '../../helpers/config';

import { getRoles } from '../../actions/roleActions';

import { getRotas, switchRota } from '../../actions/rotaActions';

import { getShifts, createShift, updateShift, deleteShift } from '../../actions/shiftActions';

import { createPlacement, updatePlacement, deletePlacement } from '../../actions/placementActions';

const routes = config.APP.ROUTES;

const { STATUSES } = routes.SHIFTS;

const moment = extendMoment(Moment);

const propTypes = {
	roleName: PropTypes.any,
	shiftId: PropTypes.string,
	startDate: PropTypes.string,
	employeeId: PropTypes.string,
	placementId: PropTypes.string,
	week: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
	roles: PropTypes.array.isRequired,
	shifts: PropTypes.array.isRequired,
	overview: PropTypes.bool.isRequired,
	editMode: PropTypes.bool.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
	handleSwitchFromSelectRoleToCreateRole: PropTypes.func.isRequired,
};

const defaultProps = {
	week: {},
	rota: {},
	roles: [],
	shifts: [],
	rotaType: {},
	shiftId: null,
	employees: [],
	roleName: null,
	overview: false,
	editMode: false,
	startDate: null,
	employeeId: null,
	placementId: null,
	handleClose: () => {},
	handleSuccessNotification: () => {},
	handleSwitchFromSelectRoleToCreateRole: () => {},
};

class ShiftForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.endTimes = {};

		this.startTimes = {};

		this.timeInterval = 15;

		this.maxNumberOfPositions = 1;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleDelete = this.handleDelete.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleGetRotas = this.handleGetRotas.bind(this);

		this.handleGetRoles = this.handleGetRoles.bind(this);

		this.handleGetShifts = this.handleGetShifts.bind(this);

		this.handleSetEndTimes = this.handleSetEndTimes.bind(this);

		this.handleChangeEndTime = this.handleChangeEndTime.bind(this);

		this.handleSetStartTimes = this.handleSetStartTimes.bind(this);

		this.handleChangeStartTime = this.handleChangeStartTime.bind(this);

		this.handleChangeStartDate = this.handleChangeStartDate.bind(this);

		this.handleIsClosingShiftTooltip = this.handleIsClosingShiftTooltip.bind(this);
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
		endTimeWasChanged: false,
		startTimeWasChanged: false,
		isClosingShiftTooltipOpen: false,
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));

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

		/* If role name was passed in as a prop, make sure we also update the state... */
		if (!isEmpty(this.props.roleName)) {
			this.setState({ roleName: this.props.roleName });
		}

		/* Sets the default value to fix validation issues if user doesnt pick any dates */
		let startDate;

		/* Because the shift was passed a start date as a prop, (shift form was opened via employee view), we need to use the start date prop instead of the current week start date */
		if (!isEmpty(this.props.startDate)) {
			startDate = moment(this.props.startDate).format('YYYY-MM-DD');
		} else {
			startDate = moment(this.props.week.startDate).format('YYYY-MM-DD');
		}

		/* Our range will be the current week */
		let startDates = [];

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

		/* Remove past dates */
		startDates = startDates.filter(data => moment(data).isSameOrAfter(moment().format('YYYY-MM-DD')));

		/* If start dates does not contain start date, swap to first start date in the list... This fixes start time issues when originally selected assign shift and then clicking create shift - start date prop is empty so the current week start date is what the start times list is based off even though the start date list is correct... */
		if (isEmpty(this.props.startDate) && !includes(startDates, moment(startDate))) {
			startDate = moment(startDates[0]).format('YYYY-MM-DD');
		}

		this.setState({ startDate, startDates }, () => this.handleSetStartTimes());

		/* If we are in edit mode, we basically need to overwrite most of the above except for the shift id, placement id, employee id */
		if (this.props.editMode && !isEmpty(this.props.shiftId)) {
			const shift = this.props.shifts.filter(data => (data.shiftId === this.props.shiftId) && (data.status !== STATUSES.DELETED)).shift();

			/* Override role name */
			if (!isEmpty(shift.role)) {
				const { roleName } = shift.role;

				this.setState({ roleName });
			}

			const { isClosingShift, numberOfPositions } = shift;

			const endTime = moment(shift.endTime).seconds(0).format('YYYY-MM-DD HH:mm:ss');

			const startTime = moment(shift.startTime).seconds(0).format('YYYY-MM-DD HH:mm:ss');

			/* We already have the start date passed in as a prop, but lets set it again, just to be safe */
			startDate = moment(shift.startTime).format('YYYY-MM-DD');

			/* Update the state with all the edit shift details */
			this.setState({
				startTime,
				startDate,
				isClosingShift,
				numberOfPositions,
			}, () => {
				this.endTimes = [];

				this.startTimes = [];

				document.getElementById('endTime').innerHTML = '';

				document.getElementById('startTime').innerHTML = '';

				document.getElementById('endTime').disabled = false;

				this.handleSetStartTimes();

				this.handleSetEndTimes();

				this.setState({ endTime, startTime });
			});
		}
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.roleName !== this.props.roleName) {
			const { roleName } = this.props;

			this.setState({ roleName });
		}
	};

	handleIsClosingShiftTooltip = () => this.setState({ isClosingShiftTooltipOpen: !this.state.isClosingShiftTooltipOpen });

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleSetStartTimes = () => {
		this.startTimes = [];

		/* 24 hours * 60 mins in an hour */
		let startTimeHours = 24 * 60;

		if (this.timeInterval === 15) {
			/* 24 hours * 15 mins in an hour (DO NOT EDIT. Edit this.timeInterval instead). */
			startTimeHours = 24 * 4;
		} else if (this.timeInterval === 30) {
			/* 24 hours * 30 mins in an hour (DO NOT EDIT. Edit this.timeInterval instead). */
			startTimeHours = 24 * 2;
		}

		/* Set default start and end times, to nearest time intervals so we have some default times */
		const start = moment(this.state.startDate, 'YYYY-MM-DD').startOf('day');

		/* Dont forget to add the shifts start time that we are editing to the list */
		if (this.props.editMode) {
			const option = {
				label: moment(this.state.startTime).format('HH:mm'),
				day: moment(this.state.startTime).format('ddd, Do MMMM'),
				value: moment(this.state.startTime).format('YYYY-MM-DD HH:mm:ss'),
			};

			this.startTimes[option.day] = this.startTimes[option.day] || [];

			this.startTimes[option.day].push(option);
		}

		/* Loop over the hours, creating a start time range from current day 00:00 to next day midnight */
		for (let i = 0; i < startTimeHours; i += 1) {
			const minutes = moment(start).add(this.timeInterval * i, 'minutes').seconds(0);

			const option = {
				label: minutes.format('HH:mm'),
				day: minutes.format('ddd, Do MMMM'),
				value: minutes.format('YYYY-MM-DD HH:mm:ss'),
			};

			/* If not in edit more, define our array */
			if (!this.props.editMode) {
				/* Add the day if it doesn't exist */
				this.startTimes[option.day] = this.startTimes[option.day] || [];
			}

			/* Now add the time but removing past times e.g we dont want the user being able to select 2pm, Thur 19th July if its 4pm, Thur 19th July */
			/* But if we are in edit mode, show all times so the shift start time is picked correctly. E.g start time might be 6:15pm but if you edit at 6:20, 6:15 will not longer be available... */
			if (moment(option.value, 'YYYY-MM-DD').isSame(moment().format('YYYY-MM-DD'))) {
				if (moment(option.label, 'HH:mm').isSameOrAfter(moment())) {
					this.startTimes[option.day].push(option);
				}
				/* This just makes sure we dont add the shift we are editing to the list twice */
			} else if (moment(this.state.startTime).format('HH:mm') !== option.label) {
				this.startTimes[option.day].push(option);
			}
		}

		/* Make sure the start times are ordered correctly. In edit mode, we add in the shifts start time even though its time might be in the past */
		this.startTimes[moment(this.state.startTime).format('ddd, Do MMMM')] = orderBy(this.startTimes[moment(this.state.startTime).format('ddd, Do MMMM')], 'label');

		/* Create our select with optgroup and options */
		Object.entries(this.startTimes).forEach((day) => {
			/* Set the optgroup label to be the day - e.g Thur 19th July */
			const [label] = day;

			const optGroup = document.createElement('optgroup');

			optGroup.label = label;

			day[1].forEach(data => optGroup.appendChild(new Option(data.label, data.value)));

			document.getElementById('startTime').appendChild(optGroup);
		});

		return Promise.resolve(true);
	};

	handleSetEndTimes = () => {
		this.endTimes = [];

		/* 24 hours * 60 mins in an hour */
		let endTimeHours = 24 * 60;

		if (this.timeInterval === 15) {
			/* 24 hours * 15 mins in an hour (DO NOT EDIT. Edit this.timeInterval instead). */
			endTimeHours = 24 * 4;
		} else if (this.timeInterval === 30) {
			/* 24 hours * 30 mins in an hour (DO NOT EDIT. Edit this.timeInterval instead). */
			endTimeHours = 24 * 2;
		}

		/* We take the start time and add time interval to it to create or base end time */
		const endTime = moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss').add(this.timeInterval, 'minutes').seconds(0);

		/* Loop over the hours, creating a end time range from the start time plus 24 hours */
		for (let i = 0; i < endTimeHours; i += 1) {
			const minutes = moment(endTime).add(this.timeInterval * i, 'minutes').seconds(0);

			const option = {
				label: minutes.format('HH:mm'),
				day: minutes.format('ddd, Do MMMM'),
				value: minutes.format('YYYY-MM-DD HH:mm:ss'),
			};

			/* This is to dyanmically update the label value if the selected end time if in the next day - allows better UX for the user */
			if (moment(option.value, 'YYYY-MM-DD').isAfter(moment(this.state.startDate).format('YYYY-MM-DD'))) {
				option.label = moment(option.value).format('HH:mm (ddd, Do)');
			}

			/* Add the day if it doesn't exist */
			this.endTimes[option.day] = this.endTimes[option.day] || [];

			this.endTimes[option.day].push(option);
		}

		/* Create our select with optgroup and options */
		Object.entries(this.endTimes).forEach((day) => {
			/* Set the optgroup label to be the day - e.g Thur 19th July */
			const [label] = day;

			const optGroup = document.createElement('optgroup');

			optGroup.label = label;

			day[1].forEach(data => optGroup.appendChild(new Option(data.label, data.value)));

			document.getElementById('endTime').appendChild(optGroup);
		});

		this.setState({ endTime });

		return Promise.resolve(true);
	};

	handleChangeStartDate = (event) => {
		const target = event.currentTarget;

		/* If the user changes the start date, we need to redo all start and end times again so reset the states and start time and clear the end times array. We also need to reset the forms validation listeners */
		this.setState({
			endTime: '',
			startTime: '',
			[target.name]: target.value,
		}, () => {
			this.endTimes = [];

			this.startTimes = [];

			document.getElementById('endTime').innerHTML = '';

			document.getElementById('endTime').disabled = true;

			document.getElementById('startTime').innerHTML = '';

			document.getElementById('startTime').appendChild(new Option('', ''));

			this.handleSetStartTimes();

			const field = this.form.fieldsStore.getField('startTime');

			field.validations = [];

			this.form.forceUpdate();

			this.form.reset();
		});
	};

	handleChangeStartTime = (event) => {
		const oldEndTime = this.state.endTime;

		const oldStartTime = this.state.startTime;

		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		}, () => {
			if (oldStartTime !== target.value) {
				this.setState({ startTimeWasChanged: !this.state.startTimeWasChanged });
			}

			if (isEmpty(target.value)) {
				this.endTimes = [];

				this.setState({ endTime: '' });

				document.getElementById('endTime').innerHTML = '';

				document.getElementById('endTime').disabled = true;
			} else {
				/* We set the end times based on the start times */
				document.getElementById('endTime').innerHTML = '';

				document.getElementById('endTime').disabled = false;

				this.handleSetEndTimes().then(() => {
					if (!isEmpty(oldEndTime) && this.props.editMode) {
						this.setState({ endTime: oldEndTime });
					}
				});
			}
		});
	};

	handleChangeEndTime = (event) => {
		const target = event.currentTarget;

		const oldEndTime = this.state.endTime;

		this.setState({
			[target.name]: target.value,
		}, () => {
			if (oldEndTime !== target.value) {
				this.setState({ endTimeWasChanged: !this.state.endTimeWasChanged });
			}
		});
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleGetShifts = () => {
		const { actions, rota: { rotaId } } = this.props;

		const payload = {
			rotaId,
		};

		console.log('Called ShiftForm handleGetShifts getShifts');
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

		console.log('Called ShiftForm handleGetRotas getRotas');
		return actions.getRotas(payload)
			.then((allRotas) => {
				/* After we get all rotas, we need to find our current rota again and switch it so its details are also updated */
				const currentRota = allRotas.filter(data => data.rotaId === rota.rotaId).shift();

				console.log('Called ShiftForm handleGetRotas switchRota');
				return actions.switchRota(currentRota).catch(error => Promise.reject(error));
			})
			.catch(error => Promise.reject(error));
	};

	handleGetRoles = () => {
		console.log('Called ShiftForm handleGetRoles getRoles');
		return this.props.actions.getRoles().catch(error => Promise.reject(error));
	};

	handleDelete = (event) => {
		const shift = this.props.shifts.filter(data => (data.shiftId === this.state.shiftId) && (data.status !== STATUSES.DELETED)).shift();

		const accountEmployee = this.props.employees.filter(data => data.employee.employeeId === this.state.employeeId).shift();

		/* Check if the user wants to delete the shift */
		let message = '<div class="text-center"><p>Please confirm that you wish to delete the Shift?</p><ul class="list-unstyled font-weight-bold">';

		if (!isEmpty(accountEmployee)) {
			message += `<li>Employee: ${accountEmployee.employee.firstName} ${accountEmployee.employee.lastName}</li>`;
		}

		if (!isEmpty(shift.role)) {
			message += `<li>Role: ${shift.role.roleName}</li>`;
		}

		message += `<li>Date: ${moment(shift.startTime).format('YYYY-MM-DD')}</li><li>Time: ${moment(shift.startTime).format('HH:mma')} - ${(shift.isClosingShift) ? 'Closing' : moment(shift.endTime).format('HH:mma')}</li></ul><p class="text-uppercase"><i class="pr-3 fa fa-fw fa-exclamation-triangle text-warning" aria-hidden="true"></i>Caution: This action cannot be undone.</p></div>`;

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
					/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
					.then(() => this.handleGetShifts())
					/* The user can select or create a role so we need to get roles each time we update or create a shift */
					.then(() => this.handleGetRoles())
					/* Updating a shift or placement updates a rotas status so we need to refresh our rotas list too */
					.then(() => this.handleGetRotas())
					.then(() => {
						/**
						 * Seems to be a flow issue somewhere - editing shift from shift button, closes this form without calling handleClose.
						 * However editing the shift from the shiftoverview required this handleClose call.
						 */
						if (this.props.overview) {
							/* Close the modal */
							this.props.handleClose(event, '', '', '', moment());
						}

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

	handleSubmit = async (event) => {
		event.preventDefault();

		const { shifts, actions, rota: { rotaId } } = this.props;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			let { endTime, startTime } = this.state;

			const {
				shiftId,
				roleName,
				startDate,
				employeeId,
				placementId,
				isClosingShift,
				numberOfPositions,
			} = this.state;

			/* We are just renforcing the formats */
			endTime = moment(endTime).seconds(0).format('YYYY-MM-DD HH:mm:ss');

			startTime = moment(startTime).seconds(0).format('YYYY-MM-DD HH:mm:ss');

			/* Check for conflicts - We need to grab all shifts for selected date and check that they dont overlap */
			let totalConflicts = 0;

			/* This gets all shifts for selected date, minus the shift we are editing - we dont want to compare the edit shift with with edit shift */
			let currentDateShifts = shifts.filter(data => data.shiftId !== shiftId).filter(shiftData => (moment(shiftData.startTime).format('YYYY-MM-DD') === startDate) && (shiftData.status !== STATUSES.DELETED));

			if (currentDateShifts.length > 0) {
				/* For each shift found for the current date, check its employee id against the cells employee id */
				currentDateShifts = currentDateShifts.filter(currentDateShiftData => (currentDateShiftData.placements && currentDateShiftData.placements.filter(placementData => (placementData.employee.employeeId === employeeId) && (placementData.status !== STATUSES.DELETED)).length));

				/* For the remaining shifts in the current date, loop over and check start / end time ranges */
				currentDateShifts.forEach((currentDateShift, currentDateShiftIndex) => {
					/* The startTime and endTime are belong to the shift we are dragging! */
					if (moment.range(startTime, endTime).overlaps(moment.range(currentDateShift.startTime, currentDateShift.endTime), { adjacent: false })) {
						totalConflicts += 1;
					}
				});
			}

			if (totalConflicts === 0) {
				let payload = {
					rotaId,
					shiftId,
					endTime,
					startTime,
					isClosingShift,
					numberOfPositions,
					roleName: ((!isEmpty(roleName)) ? roleName : ''),
				};

				if (this.props.editMode) {
					/* Keep track of old shifts before updating so we can do checks on the employee/placement */
					const oldShifts = shifts;

					console.log('Called ShiftForm handleSubmit updateShift');
					actions.updateShift(payload)
						.then(() => {
							/* Get the edit shift again based on shift id. Updated shift doesnt have placments included */
							const oldShift = oldShifts.filter(data => (data.shiftId === shiftId) && (data.status !== STATUSES.DELETED)).shift();

							/* Get the matching placement (based on the employee id) */
							const oldPlacement = oldShift.placements.filter(data => (data.employee.employeeId === employeeId) && (data.status !== STATUSES.DELETED)).shift();

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
									return actions.deletePlacement(payload).catch(error => Promise.reject(error));
								}

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
								return actions.updatePlacement(payload).catch(error => Promise.reject(error));
							}

							return true;
						})
						/* Updating the shift and or placement will update the store with only the updated shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
						.then(() => this.handleGetShifts())
						/* The user can select or create a role so we need to get roles each time we update or create a shift */
						.then(() => this.handleGetRoles())
						/* Updating a shift or placement updates a rotas status so we need to refresh our rotas list too */
						.then(() => this.handleGetRotas())
						.then(() => {
							/**
							 * Seems to be a flow issue somewhere - editing shift from shift button, closes this form without calling handleClose.
							 * However editing the shift from the shiftoverview required this handleClose call.
							 */
							if (this.props.overview) {
								/* Close the modal */
								this.props.handleClose(event, '', '', '', moment());
							}

							/* FIXME - Make messages constants in config */
							const message = '<p>Shift was updated!</p>';

							/* Pass a message back up the rabbit hole to the parent component */
							this.props.handleSuccessNotification(message);
						})
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
								return actions.createPlacement(payload).catch(error => Promise.reject(error));
							}

							return true;
						})
						/* Creating a shift will update the store with only the shift (as thats what the reducer passes back) so we need to do another call to get all the shifts back into the store again */
						.then(() => this.handleGetShifts())
						/* Creating a shift updates a rotas status so we need to refresh our rotas list too */
						.then(() => this.handleGetRotas())
						/* The user can select or create a role so we need to get roles each time we update or create a shift */
						.then(() => this.handleGetRoles())
						.then(() => {
							/* Close the modal */
							this.props.handleClose(event, '', '', '', moment());

							/* FIXME - Make messages constants in config */
							const message = '<p>Shift was created!</p>';

							/* Pass a message back up the rabbit hole to the parent component */
							this.props.handleSuccessNotification(message);
						})
						.catch(error => this.setState({ error }));
				}
			} else {
				/* Show conflict error */
				const error = {
					data: {
						/* FIXME - Make messages constants in config */
						message: '<p><strong>The following error occurred:</strong></p><ul><li>The employee is already placed in another shift at this time.</li></ul>',
					},
				};

				this.setState({ error });
			}
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			{this.errorMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<FormGroup>
					<Label for="startDate">Date <span className="text-danger">&#42;</span></Label>
					<Input type="select" name="startDate" id="startDate" className="custom-select custom-select-xl" value={this.state.startDate} onChange={this.handleChangeStartDate} onBlur={this.handleBlur} tabIndex="1" required={true}>
						{this.state.startDates.map((startDate, index) => <option key={index} value={moment(startDate).format('YYYY-MM-DD')} label={moment(startDate).format('dddd, Do MMMM YYYY')}>{moment(startDate).format('dddd, Do MMMM YYYY')}</option>)}
					</Input>
					<FieldFeedbacks for="startDate" show="all">
						<FieldFeedback when="*">- Please select a start date.</FieldFeedback>
					</FieldFeedbacks>
				</FormGroup>
				<Row>
					<Col xs="12" sm="9" md="9" lg="9" xl="9">
						<FormGroup>
							<Label for="roleName">Role</Label>
							<Input type="select" name="roleName" id="roleName" className="custom-select custom-select-xl" value={this.state.roleName} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="2">
								<option value="" label=""></option>
								{this.props.roles.map((role, index) => <option key={index} value={role.roleName} label={role.roleName}>{role.roleName}</option>)}
							</Input>
							<FieldFeedbacks for="roleName" show="all">
								<FieldFeedback when="*">- Please select a valid role.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
					<Col className="text-right" xs="12" sm="3" md="3" lg="3" xl="3">
						<FormGroup>
							<Label className="text-white">Create Role</Label>
							<Button type="button" title="Create Role" className="btn btn-create-select btn-toggle-fields" onClick={this.props.handleSwitchFromSelectRoleToCreateRole}>Create Role</Button>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="startTime">Start Time</Label>
							<Input type="select" name="startTime" id="startTime" className="custom-select custom-select-xl" value={this.state.startTime} onChange={this.handleChangeStartTime} onBlur={this.handleBlur} tabIndex="3" required>
								<option value="" label=""></option>
							</Input>
							<FieldFeedbacks for="startTime" show="all">
								<FieldFeedback when="*">- Please select a valid start time.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="endTime">End Time</Label>
							<Input type="select" name="endTime" id="endTime" className="custom-select custom-select-xl" value={this.state.endTime} onChange={this.handleChangeEndTime} onBlur={this.handleBlur} tabIndex="4" required disabled />
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="numberOfPositions">Number Of Positions</Label>
							<Input type="select" name="numberOfPositions" id="numberOfPositions" className="custom-select custom-select-xl" value={this.state.numberOfPositions} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="5" required>
								{Array.from({ length: this.maxNumberOfPositions }, (key, value) => value + 1).map((position, index) => <option key={index} value={position} label={position}>{position}</option>)}
							</Input>
							<FieldFeedbacks for="numberOfPositions" show="all">
								<FieldFeedback when="*">- Please select the number of positions.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="isClosingShift">Is Closing Shift<i className="fa fa-fw fa-info-circle" id="isClosingShiftHint" aria-hidden="true"></i></Label>
							<Input type="select" name="isClosingShift" id="isClosingShift" className="custom-select custom-select-xl" value={this.state.isClosingShift} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="6" required>
								<option value="false" label="No">No</option>
								<option value="true" label="Yes">Yes</option>
							</Input>
							<FieldFeedbacks for="isClosingShift" show="all">
								<FieldFeedback when="*">- Please select if this shift is a closing shift.</FieldFeedback>
							</FieldFeedbacks>
							<Tooltip placement="auto" isOpen={this.state.isClosingShiftTooltipOpen} target="isClosingShiftHint" toggle={this.handleIsClosingShiftTooltip}>If you&#39;ve ever worked in bar, the closing shifts might say 6pm - close. You might expect to finish at 2am but the cleanup on a busy night might take to 3am.</Tooltip>
						</FormGroup>
					</Col>
				</Row>
				{(this.props.employees.length > 0) ? (
					<FormGroup>
						<Label for="employeeId">Assign Employee</Label>
						<Input type="select" name="employeeId" id="employeeId" className="custom-select custom-select-xl" value={this.state.employeeId} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="7">
							<option value="" label="" />
							{this.props.employees.map(({ employee }, index) => <option key={index} value={employee.employeeId} label={`${employee.firstName} ${employee.lastName}`}>{employee.firstName} {employee.lastName}</option>)}
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
	rotaType: state.rotaType,
	overview: props.overview,
	editMode: props.editMode,
	roleName: props.roleName,
	startDate: props.startDate,
	employees: state.employees,
	employeeId: props.employeeId,
	placementId: props.placementId,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getRotas,
		getRoles,
		getShifts,
		switchRota,
		createShift,
		updateShift,
		deleteShift,
		createPlacement,
		updatePlacement,
		deletePlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShiftForm);
