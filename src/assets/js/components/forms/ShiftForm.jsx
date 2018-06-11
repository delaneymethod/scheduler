import moment from 'moment';
import Select from 'react-select';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import { Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import Alert from '../common/Alert';

import constants from '../../helpers/constants';

import { createRole } from '../../actions/roleActions';

import { createPlacement } from '../../actions/placementActions';

import { createShift, updateShift, deleteShift } from '../../actions/shiftActions';

const routes = constants.APP.ROUTES;

const propTypes = {
	editMode: PropTypes.bool,
	shiftId: PropTypes.string,
	week: PropTypes.object.isRequired,
	rota: PropTypes.object.isRequired,
	roles: PropTypes.array.isRequired,
	shifts: PropTypes.array.isRequired,
	employees: PropTypes.array.isRequired,
};

const defaultProps = {
	week: {},
	rota: {},
	roles: [],
	shifts: [],
	shiftId: null,
	employees: [],
	editMode: false,
};

class ShiftForm extends Component {
	constructor(props) {
		super(props);

		this.times = [];

		this.timeInterval = 15;

		this.maxNumberOfPositions = 1;

		this.state = this.getInitialState();

		this.handleDelete = this.handleDelete.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleChangeTime = this.handleChangeTime.bind(this);

		this.handleChangeRoleName = this.handleChangeRoleName.bind(this);

		this.handleCreateRoleName = this.handleCreateRoleName.bind(this);

		this.handleChangeStartDate = this.handleChangeStartDate.bind(this);

		this.handleCreateRoleOption = this.handleCreateRoleOption.bind(this);

		this.handleCreateStartDateOption = this.handleCreateStartDateOption.bind(this);
	}

	getInitialState = () => ({
		error: {},
		endTime: '',
		roleName: '',
		startTime: '',
		startDate: '',
		employeeId: '',
		created: false,
		updated: false,
		deleted: false,
		roleOptions: [],
		selectedRole: '',
		numberOfPositions: 1,
		startDateOptions: [],
		isClosingShift: false,
		selectedStartDate: '',
	});

	componentDidMount = () => {
		/* 24 hours * 60 mins in an hour */
		let hours = 24 * 60;

		if (this.timeInterval === 15) {
			/* 24 hours * 15 mins in an hour (DO NOT EDIT. Edit this.timeInterval instead). */
			hours = 24 * 4;
		} else if (this.timeInterval === 30) {
			/* 24 hours * 30 mins in an hour (DO NOT EDIT. Edit this.timeInterval instead). */
			hours = 24 * 2;
		}

		const startDates = [];

		const startDateOptions = [];

		const start = moment().startOf('day');

		/* Set default start and end times, to nearest time intervals */
		const remainder = this.timeInterval - (moment().minute() % this.timeInterval);

		const startTime = moment().add(remainder, 'minutes').format('HH:mm A');

		const endTime = moment().add(1, 'hour').add(remainder, 'minutes').format('HH:mm A');

		this.setState({ startTime, endTime });

		/* Build our start and end time ranges in time interval segments */
		for (let i = 0; i < hours; i += 1) {
			const time = moment(start).add(this.timeInterval * i, 'minutes').format('HH:mm A');

			this.times.push(time);
		}

		if (this.props.roles.length > 0) {
			const roleOptions = [];

			let selectedRole = '';

			this.props.roles.forEach((role, index) => {
				const roleOption = this.handleCreateRoleOption(role.roleName);

				/* Sets the default value to fix validation issues if user doesnt pick any roles */
				if (index === 0) {
					selectedRole = roleOption;
				}

				roleOptions.push(roleOption);
			});

			this.setState({ roleOptions, selectedRole, roleName: selectedRole.label });
		}

		/* Sets the default value to fix validation issues if user doesnt pick any dates */
		const selectedStartDate = this.handleCreateStartDateOption(moment(this.props.week.startDate).format('dddd, Do MMMM YYYY'));

		/* Our range will be the current week */
		startDates.unshift(moment(this.props.week.startDate).format('dddd, Do MMMM YYYY'));

		const firstDay = moment(this.props.week.startDate).startOf('day');

		const lastDay = moment(this.props.week.endDate).startOf('day');

		while (firstDay.add(1, 'days').diff(lastDay) < 0) {
			startDates.push(firstDay.clone().format('dddd, Do MMMM YYYY'));
		}

		startDates.push(moment(this.props.week.endDate).format('dddd, Do MMMM YYYY'));

		startDates.forEach((date) => {
			const startDateOption = this.handleCreateStartDateOption(date);

			startDateOptions.push(startDateOption);
		});

		this.setState({ startDateOptions, selectedStartDate, startDate: selectedStartDate.value });
	};

	handleChange = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		await this.form.validateFields(target);
	};

	handleChangeTime = async (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});

		await this.form.validateFields('startTime', 'endTime');
	};

	handleChangeStartDate = async (startDate) => {
		if (isEmpty(startDate)) {
			this.setState({ startDate: '' });
		} else {
			this.setState({ startDate: startDate.value });
		}

		this.setState({ selectedStartDate: startDate });

		await this.form.validateFields('startDate');
	};

	handleCreateStartDateOption = label => ({
		label,
		value: moment(label, 'dddd, Do MMMM YYYY').format('YYYY-MM-DD'),
	});

	handleCreateRoleOption = label => ({
		label,
		value: label.toLowerCase().replace(/\W/g, '-'),
	});

	handleChangeRoleName = async (newRole) => {
		if (isEmpty(newRole)) {
			this.setState({ roleName: '' });
		} else {
			this.setState({ roleName: newRole.label });
		}

		this.setState({ selectedRole: newRole });

		await this.form.validateFields('roleName');
	};

	handleCreateRoleName = (roleName) => {
		this.setState({ error: {} });

		const payload = {
			roleName,
		};

		const { actions } = this.props;

		const { roleOptions } = this.state;

		const newRole = this.handleCreateRoleOption(roleName);

		console.log('Called ShiftForm handleCreateRoleName createRole');
		actions.createRole(payload)
			.then(() => {
				this.setState({
					selectedRole: newRole,
					roleName: newRole.label,
					roleOptions: [...roleOptions, newRole],
				});
			})
			.catch(error => this.setState({ error }));
	};

	handleDelete = async event => console.log('FIXME - Delete Shift');

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions } = this.props;

		const { rotaId } = this.props.rota;

		this.setState({ error: {} });

		await this.form.validateFields();

		if (this.form.isValid()) {
			let payload;

			if (this.props.editMode) {
				console.log('FIXME - Update Shift');
			} else {
				let { endTime, startTime } = this.state;

				const {
					roleName,
					startDate,
					employeeId,
					isClosingShift,
					numberOfPositions,
				} = this.state;

				/* We need to make sure our start and end values are in the format like 2018-06-05 18:50:00 */
				endTime = `${startDate} ${moment(endTime, 'HH:mm A').format('HH:mm:ss')}`;

				startTime = `${startDate} ${moment(startTime, 'HH:mm A').format('HH:mm:ss')}`;

				payload = {
					rotaId,
					endTime,
					roleName,
					startTime,
					isClosingShift,
					numberOfPositions,
				};

				console.log('Called ShiftForm handleSubmit createShift');
				actions.createShift(payload)
					.then((shift) => {
						const { shiftId } = shift;

						if (!isEmpty(employeeId)) {
							payload = {
								shiftId,
								employeeId,
							};

							console.log('Called ShiftForm handleSubmit createPlacement');
							actions.createPlacement(payload)
								.then(() => this.setState({ created: true }))
								.catch(error => this.setState({ error }));
						} else {
							this.setState({ created: true });
						}
					})
					.catch(error => this.setState({ error }));
			}
		}
	};

	errorMessage = () => (this.state.error.data ? <Alert color="danger" title={this.state.error.data.title} message={this.state.error.data.message} /> : null);

	successMessage = () => {
		const { created, updated, deleted } = this.state;

		if (created) {
			return (<Alert color="success" message="Shift was created successfully." />);
		} else if (updated) {
			return (<Alert color="success" message="Shift was updated successfully." />);
		} else if (deleted) {
			return (<Alert color="success" message="Shift was deleted successfully." />);
		}

		return null;
	};

	render = () => (
		<Fragment>
			{this.errorMessage()}
			{this.successMessage()}
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<FormGroup>
					<Label for="startDate">Select Date <span className="text-danger">&#42;</span></Label>
					<Select name="startDate" id="startDate" className="select-autocomplete-container" classNamePrefix="select-autocomplete" onChange={this.handleChangeStartDate} value={this.state.selectedStartDate} options={this.state.startDateOptions} tabIndex="1" required />
					<FieldFeedbacks for="startDate" show="all">
						<FieldFeedback when="*">- Please provide a valid start date.</FieldFeedback>
					</FieldFeedbacks>
				</FormGroup>
				<FormGroup>
					<Label for="roleName">Role</Label>
					<CreatableSelect name="roleName" id="roleName" className="select-autocomplete-container" classNamePrefix="select-autocomplete" onChange={this.handleChangeRoleName} onCreateOption={this.handleCreateRoleName} value={this.state.selectedRole} options={this.state.roleOptions} tabIndex="2" isClearable required />
					<div className="info">- Please select or create a role by typing and pressing enter.</div>
					<FieldFeedbacks for="roleName" show="all">
						<FieldFeedback when="*">- Please select or create a role.</FieldFeedback>
					</FieldFeedbacks>
				</FormGroup>
				<Row>
					<Col xs="12" sm="12" md="12" lg="6" xl="6">
						<FormGroup>
							<Label for="startTime">Start Time</Label>
							<Input type="select" name="startTime" id="startTime" className="custom-select custom-select-xl" value={this.state.startTime} onChange={this.handleChangeTime} tabIndex="3" required>
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
							<Input type="select" name="endTime" id="endTime" className="custom-select custom-select-xl" value={this.state.endTime} onChange={this.handleChangeTime} tabIndex="4" required>
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
							<Input type="select" name="numberOfPositions" id="numberOfPositions" className="custom-select custom-select-xl" value={this.state.numberOfPositions} onChange={this.handleChange} tabIndex="5" required>
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
							<Input type="select" name="isClosingShift" id="isClosingShift" className="custom-select custom-select-xl" value={this.state.isClosingShift} onChange={this.handleChange} tabIndex="6" required>
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
						<Input type="select" name="employeeId" id="employeeId" className="custom-select custom-select-xl" onChange={this.handleChange} tabIndex="7">
							<option value="" label="" />
							{this.props.employees.map(({ employee }, index) => <option key={index} value={employee.employeeId} label={`${employee.firstName} ${employee.surname}`} />)}
						</Input>
						<FieldFeedbacks for="employeeId" show="all">
							<FieldFeedback when="*">- Please select an employee.</FieldFeedback>
						</FieldFeedbacks>
					</FormGroup>
				) : null}
				{(this.props.editMode) ? (
					<Button type="submit" color="primary" className="mt-4" title={routes.SHIFTS.UPDATE.TITLE} tabIndex="8" block>{routes.SHIFTS.UPDATE.TITLE}</Button>
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
	employees: state.employees,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		createRole,
		createShift,
		updateShift,
		deleteShift,
		createPlacement,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShiftForm);
