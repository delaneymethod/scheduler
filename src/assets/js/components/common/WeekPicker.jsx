import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { bindActionCreators } from 'redux';

import { updateWeek } from '../../actions/weekActions';

const propTypes = {
	week: PropTypes.object.isRequired,
};

const defaultProps = {
	week: {},
};

class WeekPicker extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleNext = this.handleNext.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleToggle = this.handleToggle.bind(this);

		this.handleConvert = this.handleConvert.bind(this);

		this.handlePrevious = this.handlePrevious.bind(this);

		this.handleHighlight = this.handleHighlight.bind(this);
	}

	getInitialState = () => ({
		week: {},
		highlightedDates: [],
		isCalenderOpen: false,
	});

	componentDidMount = () => {
		let { week } = this.props;

		const { actions } = this.props;

		if (isEmpty(week)) {
			week.endDate = moment().endOf('isoWeek');

			week.startDate = moment().startOf('isoWeek');
		} else {
			/* Since the dates have come from the store/sessionStorage (and stored as strings), we need to convert them back again! */
			week = this.handleConvert(week);
		}

		/* Save the date as a string instead of the moment object */
		const payload = {
			endDate: week.endDate.format(),
			startDate: week.startDate.format(),
		};

		actions.updateWeek(payload).then(() => {
			this.setState({ week });

			this.handleHighlight(week);
		});
	};

	handleChange = (date) => {
		const { inline } = date;

		const { week, actions } = this.props;

		week.startDate = moment(date).startOf('isoWeek');

		week.endDate = moment(date).endOf('isoWeek');

		/* Save the date as a string instead of the moment object */
		const payload = {
			endDate: week.endDate.format(),
			startDate: week.startDate.format(),
		};

		actions.updateWeek(payload).then(() => {
			this.setState({ week });

			this.handleHighlight(week);

			if (!inline) {
				this.handleToggle();
			}
		});
	};

	/* eslint-disable no-mixed-operators */
	handleNext = () => {
		let { week } = this.props;

		/* Since the dates have come from the store/sessionStorage (and stored as strings), we need to convert them back again! */
		week = this.handleConvert(week);

		/* Because we know the start date is always a Monday, we can simplily add 8 days to it to get next Monday's date */
		const nextWeekDate = week.startDate.add(8, 'days');

		/* Extra flag to keep the calendar closed */
		nextWeekDate.inline = true;

		this.handleChange(nextWeekDate);
	};

	handlePrevious = () => {
		let { week } = this.props;

		/* Since the dates have come from the store/sessionStorage (and stored as strings), we need to convert them back again! */
		week = this.handleConvert(week);

		/* Because we know the start date is always a Monday, we can simplily subtract 1 day from it to get last Monday's date */
		const previousWeekDate = week.startDate.subtract(8, 'days');

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
			<button type="button" name="previous-week" className="btn btn-toggle border-0 font-weight-normal text-dark" onClick={this.handlePrevious}><i className="fa fa-caret-left" aria-hidden="true"></i></button>
			<button type="button" name="current-week" className="btn btn-toggle btn-week-picker text-dark font-weight-normal rounded-0 border-0" onClick={this.handleToggle}><strong>{moment(this.state.week.startDate).format('ddd')}</strong>, {moment(this.state.week.startDate).format('MMM')} {moment(this.state.week.startDate).format('D')} - <strong>{moment(this.state.week.endDate).format('ddd')}</strong>, {moment(this.state.week.endDate).format('MMM')} {moment(this.state.week.endDate).format('D')}</button>
			<button type="button" name="next-week" className="btn btn-toggle border-0 font-weight-normal text-dark" onClick={this.handleNext}><i className="fa fa-caret-right" aria-hidden="true"></i></button>
			{(this.state.isCalenderOpen) ? (
				<DatePicker withPortal inline autoFocus fixedHeight locale="en-gb" tabIndex={-1} selected={this.state.week.startDate} onChange={this.handleChange} onClickOutside={this.handleToggle} highlightDates={this.state.highlightedDates} />
			) : null}
		</div>
	);
}

WeekPicker.propTypes = propTypes;

WeekPicker.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	week: state.week,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ updateWeek }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(WeekPicker);
