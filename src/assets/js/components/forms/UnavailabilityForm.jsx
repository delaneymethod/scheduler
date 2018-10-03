import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import DatePicker from 'react-datepicker';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Input, Label, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import config from '../../helpers/config';

import logMessage from '../../helpers/logging';

import { confirm } from '../../helpers/confirm';

import scrollToTop from '../../helpers/animations';

import { getUnavailabilityOccurrences } from '../../actions/unavailabilityOccurrenceActions';

import { getUnavailability, createUnavailability, updateUnavailability, deleteUnavailability } from '../../actions/unavailabilityActions';

const routes = config.APP.ROUTES;

const propTypes = {
	week: PropTypes.object.isRequired,
	unavailabilityId: PropTypes.string,
	editMode: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	accountEmployee: PropTypes.object.isRequired,
	unavailabilityTypes: PropTypes.array.isRequired,
	handleSuccessNotification: PropTypes.func.isRequired,
};

const defaultProps = {
	week: {},
	editMode: false,
	accountEmployee: {},
	unavailabilityId: '',
	handleClose: () => {},
	unavailabilityTypes: [],
	handleSuccessNotification: () => {},
};

class UnavailabilityForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.timeInterval = 15;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleDelete = this.handleDelete.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChangeDate = this.handleChangeDate.bind(this);

		this.handleChangeTime = this.handleChangeTime.bind(this);

		this.handleGetUnavailability = this.handleGetUnavailability.bind(this);

		this.handleNearestFutureMinutes = this.handleNearestFutureMinutes.bind(this);

		this.handleGetUnavailabilityOccurrences = this.handleGetUnavailabilityOccurrences.bind(this);
	}

	getInitialState = () => ({
		error: {},
		reason: '',
		fullDay: true,
		employeeId: '',
		unavailabilityId: 0,
		startTime: moment(),
		startDate: moment(),
		unavailabilityTypeId: 0,
		endTime: moment().add(15, 'm'),
		endDate: moment().add(15, 'm'),
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));

		const endTime = this.handleNearestFutureMinutes(this.state.endTime);

		const startTime = this.handleNearestFutureMinutes(this.state.startTime);

		/* If employee id was passed in as a prop, make sure we also update the state... */
		this.setState({ endTime, startTime, employeeId: this.props.accountEmployee.employee.employeeId });

		/* If unavailability id was passed in as a prop, make sure we also update the state... */
		if (!isEmpty(this.props.unavailabilityId)) {
			this.setState({ unavailabilityId: this.props.unavailabilityId });
		}

		if (this.props.editMode && !isEmpty(this.props.unavailabilityId)) {
			this.handleGetUnavailability(this.props.unavailabilityId)
				.then((unavailability) => {
					const {
						reason,
						fullDay,
						unavailabilityId,
						unavailabilityTypeId,
						firstOccurrenceEndDate,
						firstOccurrenceStartDate,
					} = unavailability;

					if (!isEmpty(firstOccurrenceEndDate)) {
						const endDate = moment(firstOccurrenceEndDate);

						this.setState({ endDate, endTime: endDate });
					}

					const startDate = moment(firstOccurrenceStartDate);

					this.setState({
						reason,
						fullDay,
						startDate,
						unavailabilityId,
						startTime: startDate,
						unavailabilityTypeId,
					});
				});
		}
	};

	handleChangeDate = (date, id) => {
		/* If we change the start date and not in edit mode, lets set the end date to match */
		if (id === 'startDate' && !this.props.editMode) {
			this.setState({ [id]: date, endDate: date });

		/* If we change the start date and in edit mode, leave the end date as it was */
		} else if (id === 'startDate' && this.props.editMode) {
			this.setState({ [id]: date }, () => {
				/* If the end date is before the new start date, set the end date to match */
				if (moment(this.state.endDate).isBefore(moment(this.state.startDate))) {
					this.setState({ endDate: date });
				}
			});

		/* we've changed the end date... */
		} else {
			this.setState({ [id]: date });
		}
	};

	handleChangeTime = (time, id) => this.setState({ [id]: time });

	handleNearestFutureMinutes = (date) => {
		const minutes = Math.ceil(date.minute() / this.timeInterval) * this.timeInterval;

		return date.clone().minute(minutes).second(0);
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleGetUnavailability = (unavailabilityId) => {
		const payload = {
			unavailabilityId,
		};

		logMessage('info', 'Called UnavailabilityForm handleGetUnavailability getUnavailability');

		return this.props.actions.getUnavailability(payload).catch(error => Promise.reject(error));
	};

	handleGetUnavailabilityOccurrences = () => {
		const { week, actions } = this.props;

		const payload = {
			endDate: moment(week.endDate).format('YYYY-MM-DDT23:59:59'),
			startDate: moment(week.startDate).format('YYYY-MM-DDT00:00:00'),
		};

		logMessage('info', 'Called UnavailabilityForm handleGetUnavailabilityOccurrences getUnavailabilityOccurrences');

		return actions.getUnavailabilityOccurrences(payload).catch(error => Promise.reject(error));
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleDelete = () => {
		/* Check if the user wants to delete the unavailability */
		let message = '<div class="text-center"><p>Please confirm that you wish to delete the Time Off?</p><p class="text-uppercase"><i class="pr-3 fa fa-fw fa-exclamation-triangle text-warning" aria-hidden="true"></i>Caution: This action cannot be undone.</p></div>';

		const options = {
			message,
			labels: {
				cancel: 'Cancel',
				proceed: 'Delete',
			},
			values: {
				cancel: false,
				proceed: true,
			},
			colors: {
				proceed: 'danger',
			},
			enableEscape: false,
			title: 'Delete Time Off',
			className: 'modal-dialog-warning',
		};

		/* If the user has clicked the proceed button, we delete the shift */
		/* If the user has clicked the cancel button, we do nothing */
		confirm(options)
			.then((result) => {
				const { actions } = this.props;

				const { unavailabilityId } = this.state;

				const payload = {
					unavailabilityId,
				};

				logMessage('info', 'Called UnavailabilityForm handleDelete deleteUnavailability');

				actions.deleteUnavailability(payload)
					/* Updating the unavailabilities will update the store with only the updated unavailability (as thats what the reducer passes back) so we need to do another call to get all the unavailability occurrences back into the store again */
					.then(() => this.handleGetUnavailabilityOccurrences())
					.then(() => {
						this.props.handleClose();

						/* FIXME - Make messages constants in config */
						message = '<p>Time Off was deleted!</p>';

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

		await this.form.validateFields();

		if (this.form.isValid()) {
			const { actions, history } = this.props;

			const { accountEmployeeId } = this.props.accountEmployee;

			const {
				reason,
				unavailabilityId,
				unavailabilityTypeId,
			} = this.state;

			let {
				fullDay,
				endDate,
				endTime,
				startDate,
				startTime,
			} = this.state;

			fullDay = (fullDay === true || fullDay === 'true');

			endTime = moment(endTime).format('HH:mm');

			if (endTime === '23:59') {
				endTime = `${endTime}:59`;
			} else {
				endTime = `${endTime}:00`;
			}

			endDate = moment(endDate).format('YYYY-MM-DD');

			startTime = moment(startTime).format('HH:mm');

			if (startTime === '23:59') {
				startTime = `${startTime}:59`;
			} else {
				startTime = `${startTime}:00`;
			}

			startDate = moment(startDate).format('YYYY-MM-DD');

			if (fullDay) {
				endTime = moment(endTime, 'HH:mm:ss').startOf('day').format('HH:mm:ss');

				startTime = moment(startTime, 'HH:mm:ss').startOf('day').format('HH:mm:ss');
			}

			const end = `${endDate} ${endTime}`;

			const start = `${startDate} ${startTime}`;

			if (moment(end).isBefore(moment(start))) {
				const error = {
					data: {
						message: 'Please select a valid end date.',
					},
				};

				this.setState({ error });

				scrollToTop();
			} else {
				this.setState({ error: {} });

				const firstOccurrenceEndDate = `${endDate}T${endTime}.000Z`;

				const firstOccurrenceStartDate = `${startDate}T${startTime}.000Z`;

				const payload = {
					reason,
					fullDay,
					accountEmployeeId,
					unavailabilityTypeId,
					firstOccurrenceEndDate,
					firstOccurrenceStartDate,
				};

				if (this.props.editMode) {
					logMessage('info', 'Called UnavailabilityForm handleSubmit updateUnavailability');

					payload.unavailabilityId = unavailabilityId;

					actions.updateUnavailability(payload)
						.then(() => this.handleGetUnavailabilityOccurrences())
						.then(() => {
							/* Close the modal */
							this.props.handleClose();

							/* FIXME - Make messages constants in config */
							const message = '<p>Time Off was updated!</p>';

							/* Pass a message back up the rabbit hole to the parent component */
							this.props.handleSuccessNotification(message);
						})
						.catch(error => this.setState({ error }));
				} else {
					logMessage('info', 'Called UnavailabilityForm handleSubmit createUnavailability');

					actions.createUnavailability(payload)
						.then(() => this.handleGetUnavailabilityOccurrences())
						.then(() => {
							/* Close the modal */
							this.props.handleClose();

							/* FIXME - Make messages constants in config */
							const message = '<p>Time Off was created!</p>';

							/* Pass a message back up the rabbit hole to the parent component */
							this.props.handleSuccessNotification(message);
						})
						.catch(error => this.setState({ error }));
				}
			}
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	errorMessage = () => (this.state.error.data ? <Alert color="danger" message={this.state.error.data.message} /> : null);

	render = () => (
		<Fragment>
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<Row>
					<Col xs="12" sm="12" md="12" lg="12" xl="12">
						<FormGroup>
							<Label for="employeeId">Employee <small className="text-muted">Readonly</small></Label>
							<Input type="text" name="employeeId" id="employeeId" value={`${this.props.accountEmployee.employee.firstName} ${this.props.accountEmployee.employee.lastName}`} readOnly tabIndex="1" />
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="12" lg="12" xl="12">
						<FormGroup>
							<Label for="unavailabilityTypeId">Type <span className="text-danger">&#42;</span></Label>
							<Input type="select" name="unavailabilityTypeId" id="unavailabilityTypeId" className="custom-select custom-select-xl" value={this.state.unavailabilityTypeId} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="2" required>
								<option value="" label="Select Type">Select Type</option>
								{this.props.unavailabilityTypes.map((unavailabilityType, index) => <option key={index} value={unavailabilityType.unavailabilityTypeId} label={unavailabilityType.unavailabilityTypeName}>{unavailabilityType.unavailabilityTypeName}</option>)}
							</Input>
							<FieldFeedbacks for="unavailabilityTypeId" show="all">
								<FieldFeedback when="*">- Please select a valid type.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col xs="4" sm="4" md="4" lg="4" xl="4">
						<FormGroup>
							<Label className="d-block" for="startDate">Start Date</Label>
							<DatePicker className="form-control" id="startDate" dateFormat="YYYY-MM-DD" selectsStart selected={this.state.startDate} startDate={this.state.startDate} endDate={this.state.endDate} onChange={date => this.handleChangeDate(date, 'startDate')} tabIndex={3} required />
						</FormGroup>
					</Col>
					<Col xs="4" sm="4" md="4" lg="4" xl="4">
						<FormGroup>
							<Label className="d-block" for="endDate">End Date</Label>
							<DatePicker className="form-control" id="endDate" dateFormat="YYYY-MM-DD" selectsEnd selected={this.state.endDate} startDate={this.state.startDate} endDate={this.state.endDate} onChange={date => this.handleChangeDate(date, 'endDate')} tabIndex={4} required />
						</FormGroup>
					</Col>
					<Col xs="4" sm="4" md="4" lg="4" xl="4">
						<FormGroup>
							<Label for="fullDay">Is Full Day</Label>
							<Input type="select" name="fullDay" id="fullDay" className="custom-select custom-select-xl" value={this.state.fullDay} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="5">
								<option value="true" label="Yes">Yes</option>
								<option value="false" label="No">No</option>
							</Input>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col xs="4" sm="4" md="4" lg="4" xl="4">
						<FormGroup>
							<Label className="d-block" for="startTime">Start Time</Label>
							<DatePicker className="form-control" id="startTime" showTimeSelect showTimeSelectOnly timeIntervals={this.timeInterval} timeFormat="HH:mm" timeCaption="Time" dateFormat="HH:mm" selected={this.state.startTime} injectTimes={[moment().hours(23).minutes(59)]} onChange={time => this.handleChangeTime(time, 'startTime')} tabIndex={6} disabled={(this.state.fullDay === true || this.state.fullDay === 'true')} />
						</FormGroup>
					</Col>
					<Col xs="4" sm="4" md="4" lg="4" xl="4">
						<FormGroup>
							<Label className="d-block" for="endTime">End Time</Label>
							<DatePicker className="form-control" id="endTime" showTimeSelect showTimeSelectOnly timeIntervals={this.timeInterval} timeFormat="HH:mm" timeCaption="Time" dateFormat="HH:mm" selected={this.state.endTime} injectTimes={[moment().hours(23).minutes(59)]} onChange={time => this.handleChangeTime(time, 'endTime')} tabIndex={7} disabled={(this.state.fullDay === true || this.state.fullDay === 'true')} />
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12" md="12" lg="12" xl="12">
						<FormGroup>
							<Label for="reason">Reason</Label>
							<Input type="textarea" name="reason" id="reason" value={this.state.reason} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="8" />
						</FormGroup>
					</Col>
				</Row>
				{this.errorMessage()}
				{(this.props.editMode) ? (
					<Fragment>
						<Button type="submit" color="primary" className="mt-4" id="submitUpdateUnavailability" title={routes.UNAVAILABILITIES.UPDATE.TITLE} tabIndex="9" block>{routes.UNAVAILABILITIES.UPDATE.TITLE}</Button>
						<Button type="button" className="mt-4 text-danger btn btn-outline-danger" id="submitDeleteUnavailability" title={routes.UNAVAILABILITIES.DELETE.TITLE} tabIndex="10" block onClick={this.handleDelete}>{routes.UNAVAILABILITIES.DELETE.TITLE}</Button>
					</Fragment>
				) : (
					<Button type="submit" color="primary" className="mt-4" id="submitCreateUnavailability" title={routes.UNAVAILABILITIES.CREATE.TITLE} tabIndex="9" block>{routes.UNAVAILABILITIES.CREATE.TITLE}</Button>
				)}
			</FormWithConstraints>
		</Fragment>
	);
}

UnavailabilityForm.propTypes = propTypes;

UnavailabilityForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	week: state.week,
	editMode: props.editMode,
	unavailabilityId: props.unavailabilityId,
	unavailabilityTypes: state.unavailabilityTypes,
	accountEmployee: state.employees.find(accountEmployee => accountEmployee.employee.employeeId === props.employeeId),
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		getUnavailability,
		createUnavailability,
		updateUnavailability,
		deleteUnavailability,
		getUnavailabilityOccurrences,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnavailabilityForm);
