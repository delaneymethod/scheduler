import moment from 'moment';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { bindActionCreators } from 'redux';

import Modal from './Modal';

import { switchWeek } from '../../actions/weekActions';

import { createRota, switchRota } from '../../actions/rotaActions';

const propTypes = {
	rota: PropTypes.object.isRequired,
	week: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	rotaType: PropTypes.object.isRequired,
};

const defaultProps = {
	rota: {},
	week: {},
	rotas: [],
	rotaType: {},
};

class WeekPicker extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleNext = this.handleNext.bind(this);

		this.handleModal = this.handleModal.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleToggle = this.handleToggle.bind(this);

		this.handleConvert = this.handleConvert.bind(this);

		this.handlePrevious = this.handlePrevious.bind(this);

		this.handleHighlight = this.handleHighlight.bind(this);

		this.handleCreateRota = this.handleCreateRota.bind(this);

		this.handleSwitchRota = this.handleSwitchRota.bind(this);
	}

	getInitialState = () => ({
		week: {},
		error: {},
		isModalOpen: false,
		highlightedDates: [],
		isCalenderOpen: false,
		earliestRotaStartDate: null,
	});

	componentDidMount = () => {
		let week = {};

		const { actions } = this.props;

		if (isEmpty(this.props.week)) {
			/* Get the current rota start date and create and range based off that */
			week.endDate = moment(this.props.rota.startDate).endOf('isoWeek');

			week.startDate = moment(this.props.rota.startDate).startOf('isoWeek');
		} else {
			/* Since the dates have come from the store/sessionStorage (and stored as strings), we need to convert them back again! */
			week = this.handleConvert(this.props.week);
		}

		/* Save the date as a string instead of the moment object */
		const payload = {
			endDate: week.endDate,
			startDate: week.startDate,
		};

		console.log('Called WeekPicker componentDidMount switchWeek');
		actions.switchWeek(payload).then(() => {
			/* We are setting moment objects in the component state compared to moment strings in the session storage */
			this.setState({ week });

			this.handleHighlight(week);
		});

		/* Now sort the rotas and pick the first one so we can enable / disable the previous button. */
		const earliestRota = sortBy(this.props.rotas, 'startDate').shift();

		const earliestRotaStartDate = moment(earliestRota.startDate);

		this.setState({ earliestRotaStartDate });

		/**
		 * This should never happen - user is viewing the current week but there are no rota for the current week and then current week start date is after the earliest rota start date.
		 * Rotas can be deleted via the API so the frontend needs to check. Like I said this "should" never happen!!
		 */
		const currentRota = this.props.rotas.filter(rota => moment(rota.startDate).format('YYYY-MM-DD') === week.startDate.format('YYYY-MM-DD')).shift();

		/* So if there are no rotas for the current week, let create a new rota! Something bad has happening if this logic is ever ran but its our fail safe so we always have a rota for the current week! */
		if (isEmpty(currentRota) && (week.startDate.isAfter(this.state.earliestRotaStartDate) || week.startDate.isSame(this.state.earliestRotaStartDate))) {
			this.handleCreateRota(week.startDate);
		}
	};

	/* I dont like using this one as it runs everytime an update is made in this component but because the week in store/storage can be changed by other components we need to listen so we can update this component to match */
	componentDidUpdate = (prevProps) => {
		if (prevProps.week.startDate !== this.props.week.startDate) {
			const week = this.handleConvert(this.props.week);

			/* We are setting moment objects in the component state compared to moment strings in the session storage */
			this.setState({ week });

			this.handleHighlight(week);
		}
	};

	handleChange = (date) => {
		/* TODO - get rota based on start date. If no rota exists, create a new rota and update week start/end dates */

		const week = {};

		const { inline } = date;

		const { actions } = this.props;

		week.endDate = moment(date).endOf('isoWeek');

		week.startDate = moment(date).startOf('isoWeek');

		/* Save the date as a string instead of the moment object */
		const payload = {
			endDate: week.endDate,
			startDate: week.startDate,
		};

		console.log('Called WeekPicker handleChange switchWeek');
		actions.switchWeek(payload).then(() => {
			/* We are setting moment objects in the component state compared to moment strings in the session storage */
			this.setState({ week });

			this.handleHighlight(week);

			if (!inline) {
				this.handleToggle();
			}
		});
	};

	handleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	handleCreateRota = (nextStartDate) => {
		/* TODO - Show model asking if you want to copy current week rotas */

		const { actions } = this.props;

		const { rotaTypeId } = this.props.rotaType;

		const startDate = nextStartDate.format('YYYY-MM-DD');

		const payload = {
			budget: 0,
			startDate,
			rotaTypeId,
		};

		console.log('Called WeekPicker handleNext createRota');
		actions.createRota(payload)
			.then(rota => this.handleSwitchRota(rota))
			.catch((error) => {
				this.setState({ error });

				this.handleModal();
			});
	};

	handleSwitchRota = (rota) => {
		const { actions } = this.props;

		/* Set the current rota */
		console.log('Called WeekPicker handleSwitchRota switchRota');
		actions.switchRota(rota);
	};

	/* eslint-disable no-mixed-operators */
	handleNext = () => {
		/* Now we can continue... Because we know the start date is always the first day of the week, we can simplily add 7 days to it to get next week's start date */
		const nextWeekDate = moment(this.props.week.startDate).add(7, 'days');

		const nextRota = this.props.rotas.filter(rota => moment(rota.startDate).format('YYYY-MM-DD') === nextWeekDate.format('YYYY-MM-DD')).shift();

		/* If we don't have a rota that matches the start date of the week, then lets create a new rota but only if the start date is after the earliest rota start date */
		if (isEmpty(nextRota)) {
			if (nextWeekDate.isAfter(this.state.earliestRotaStartDate)) {
				this.handleCreateRota(nextWeekDate);
			}
		} else {
			this.handleSwitchRota(nextRota);
		}

		/* Extra flag to keep the calendar closed */
		nextWeekDate.inline = true;

		this.handleChange(nextWeekDate);
	};

	handlePrevious = () => {
		/* Because we know the start date is always the first day of the week, we can simplily subtract 1 day from it to get last week's start date */
		const previousWeekDate = moment(this.props.week.startDate).subtract(7, 'days');

		const previousRota = this.props.rotas.filter(rota => moment(rota.startDate).format('YYYY-MM-DD') === previousWeekDate.format('YYYY-MM-DD')).shift();

		/* If we don't have a rota that matches the start date of the week, then lets create a new rota, but again only if the week start date is after the earliest rota start date */
		if (isEmpty(previousRota)) {
			if (previousWeekDate.isAfter(this.state.earliestRotaStartDate) || previousWeekDate.isSame(this.state.earliestRotaStartDate)) {
				this.handleCreateRota(previousWeekDate);
			}
		} else {
			this.handleSwitchRota(previousRota);
		}

		/* Extra flag to keep the calendar closed */
		previousWeekDate.inline = true;

		this.handleChange(previousWeekDate);
	};
	/* eslint-enable no-mixed-operators */

	handleConvert = (week) => {
		/* eslint-disable no-param-reassign */
		week.endDate = moment(week.endDate).endOf('isoWeek');

		week.startDate = moment(week.startDate).startOf('isoWeek');
		/* eslint-enable no-param-reassign */

		return week;
	};

	handleToggle = () => this.setState({ isCalenderOpen: !this.state.isCalenderOpen });

	handleHighlight = (week) => {
		const dates = [];

		const { startDate, endDate } = week;

		dates.unshift(startDate);

		const firstDay = moment(startDate).startOf('day');

		const lastDay = moment(endDate).startOf('day');

		while (firstDay.add(1, 'days').diff(lastDay) < 0) {
			dates.push(firstDay.clone());
		}

		dates.push(endDate);

		const highlightedDates = [{ 'react-datepicker__day--highlighted': dates }];

		this.setState({ highlightedDates });
	};

	render = () => (
		<div className="week-toggle text-dark p-0 ml-md-3 mr-md-3 ml-lg-4 mr-lg-4 ml-xl-5 mr-xl-5">
			<button type="button" name="previous-week" className="btn btn-toggle border-0 font-weight-normal text-dark" onClick={this.handlePrevious}><i className="fa fa-fw fa-caret-left" aria-hidden="true"></i></button>
			<button type="button" name="current-week" className="btn btn-toggle btn-week-picker text-dark font-weight-normal rounded-0 border-0" onClick={this.handleToggle}><strong>{moment(this.state.week.startDate).format('ddd')}</strong>, {moment(this.state.week.startDate).format('MMM')} {moment(this.state.week.startDate).format('D')} - <strong>{moment(this.state.week.endDate).format('ddd')}</strong>, {moment(this.state.week.endDate).format('MMM')} {moment(this.state.week.endDate).format('D')}</button>
			<button type="button" name="next-week" className="btn btn-toggle border-0 font-weight-normal text-dark" onClick={this.handleNext}><i className="fa fa-fw fa-caret-right" aria-hidden="true"></i></button>
			{(this.state.isCalenderOpen) ? (
				<DatePicker withPortal inline autoFocus fixedHeight locale="en-gb" tabIndex={-1} selected={this.state.week.startDate} onChange={this.handleChange} onClickOutside={this.handleToggle} highlightDates={this.state.highlightedDates}>
					<div className="p-3 text-right">
						<button type="button" title="Cancel" className="mt-2 btn btn-secondary" onClick={this.handleToggle}>Cancel</button>
					</div>
				</DatePicker>
			) : null}
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
		</div>
	);
}

WeekPicker.propTypes = propTypes;

WeekPicker.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rota: state.rota,
	week: state.week,
	rotas: state.rotas,
	rotaType: state.rotaType,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ createRota, switchRota, switchWeek }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(WeekPicker);
