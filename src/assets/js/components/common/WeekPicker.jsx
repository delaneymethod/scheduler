import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sortBy, isEmpty } from 'lodash';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { bindActionCreators } from 'redux';

import Modal from './Modal';

import confirm from '../../helpers/confirm';

import constants from '../../helpers/constants';

import { switchWeek } from '../../actions/weekActions';

import { getShifts, copyShifts } from '../../actions/shiftActions';

import { createRota, switchRota } from '../../actions/rotaActions';

const routes = constants.APP.ROUTES;

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

		this.handleSwitchOrCreateRota = this.handleSwitchOrCreateRota.bind(this);
	}

	getInitialState = () => ({
		week: {},
		error: {},
		isModalOpen: false,
		highlightedDates: [],
		isCalenderOpen: false,
		copyRotaShifts: false,
		earliestRotaStartDate: null,
	});

	componentDidMount = () => {
		let week = {};

		const { actions } = this.props;

		if (isEmpty(this.props.week)) {
			const { rota } = this.props;

			/* Get the current rota start date and create and range based off that */
			week.endDate = moment(rota.startDate).endOf('isoWeek');

			week.startDate = moment(rota.startDate).startOf('isoWeek');
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

		/* We have rotas but there are no rota for the current week! */
		if (this.props.rotas.length > 0) {
			const { rotas } = this.props;

			/* Now sort the rotas and pick the first one so we can enable / disable the previous button. */
			const earliestRota = sortBy(rotas, 'startDate').shift();

			const earliestRotaStartDate = moment(earliestRota.startDate);

			this.setState({ earliestRotaStartDate });

			/**
			 * Again, this should never happen - user is viewing the current week but there are no rota for the current week and then current week start date is after the earliest rota start date.
			 * Rotas can be deleted via the API so the frontend needs to check. Like I said this "should" never happen!!
			 */
			const currentRota = rotas.filter(rota => moment(rota.startDate).format('YYYY-MM-DD') === week.startDate.format('YYYY-MM-DD')).shift();

			/* So if there are no rotas for the current week, let create a new rota! Something bad has happening if this logic is ever ran but its our fail safe so we always have a rota for the current week! */
			if (isEmpty(currentRota) && (week.startDate.isAfter(earliestRotaStartDate) || week.startDate.isSame(earliestRotaStartDate))) {
				this.handleCreateRota(week.startDate);
			}
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

				/* We need to check if the selected week has a rota? */
				this.handleSwitchOrCreateRota(week.startDate);
			}
		});
	};

	handleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	handleCreateRota = (nextStartDate) => {
		const { actions } = this.props;

		const { rotaTypeId } = this.props.rotaType;

		const startDate = nextStartDate.format('YYYY-MM-DD');

		const payload = {
			budget: 0,
			startDate,
			rotaTypeId,
		};

		console.log('Called WeekPicker handleCreateRota createRota');
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
		actions.switchRota(rota)
			.then(() => {
				const { rota: { rotaId } } = this.props;

				const payload = {
					rotaId,
				};

				/* Any time we switch rotas, we need to get a fresh list of shifts for that rota */
				console.log('Called WeekPicker handleSwitchRota getShifts');
				actions.getShifts(payload).catch((error) => {
					this.setState({ error });

					this.handleModal();
				});
			});
	};

	handleSwitchOrCreateRota = (weekStartDate) => {
		const { actions, history } = this.props;

		/* Find the rota for the week start date */
		const matchingRota = this.props.rotas.filter(rota => moment(rota.startDate).format('YYYY-MM-DD') === weekStartDate.format('YYYY-MM-DD')).shift();

		/* If we don't have a rota that matches the start date of the week, then lets create a new rota but only if the start date is after the earliest rota start date. (FYI, If the dates where the same, we'd have a rota...) */
		if (isEmpty(matchingRota)) {
			if (weekStartDate.isAfter(this.state.earliestRotaStartDate)) {
				/* Check if the user wants to copy the previous current rota shifts into the new rota we just created */
				const message = `<p>There was no Rota for week beginning ${moment(weekStartDate).format('dddd, Do MMMM')}, so we created one for you.</p><p>Would you like to copy the shifts from the Rota week beginning ${moment(this.props.rota.startDate).format('dddd, Do MMMM')} into the new Rota?</p>`;

				const options = {
					message,
					labels: {
						cancel: 'No',
						proceed: 'Yes',
					},
					values: {
						cancel: false,
						process: true,
					},
					colors: {
						proceed: 'primary',
					},
					title: 'Copy Rota Shifts',
					className: 'modal-dialog',
				};

				/* If the user has clicked the proceed button, we copy the shifts from current rota and then switch to the new rota (copy shifts also create a rota) and then redirect to the shifts view */
				/* If the user has clicked the cancel button, we create the rota and which switches to the new rota */
				confirm(options)
					.then((result) => {
						console.log('Called WeekPicker handleSwitchOrCreateRota copyShifts');
						actions.copyShifts(this.props.rota)
							.then(rota => this.handleSwitchRota(rota))
							.then(() => history.push(routes.DASHBOARD.SHIFTS.URI))
							.catch((error) => {
								this.setState({ error });

								this.handleModal();
							});
					}, result => this.handleCreateRota(weekStartDate));
			}
		} else {
			this.handleSwitchRota(matchingRota);
		}
	};

	/* eslint-disable no-mixed-operators */
	handleNext = () => {
		const { actions } = this.props;

		/* Now we can continue... Because we know the start date is always the first day of the week, we can simplily add 7 days to it to get next week's start date */
		const nextStartDate = moment(this.props.week.startDate).add(7, 'days');

		/* Extra flag to keep the calendar closed */
		nextStartDate.inline = true;

		this.handleChange(nextStartDate);

		/* We need to check if the selected week has a rota? */
		this.handleSwitchOrCreateRota(nextStartDate);
	};

	handlePrevious = () => {
		const { actions } = this.props;

		/* Because we know the start date is always the first day of the week, we can simplily subtract 1 day from it to get last week's start date */
		const previousStartDate = moment(this.props.week.startDate).subtract(7, 'days');

		/* Extra flag to keep the calendar closed */
		previousStartDate.inline = true;

		this.handleChange(previousStartDate);

		/* We need to check if the selected week has a rota? */
		this.handleSwitchOrCreateRota(previousStartDate);
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
		<div className="row week-toggle text-dark p-0 m-0">
			<button type="button" name="previous-week" className="col-2 col-sm-2 col-md-2 btn btn-toggle p-0 border-0 font-weight-normal text-dark" onClick={this.handlePrevious}><i className="fa fa-fw fa-caret-left" aria-hidden="true"></i></button>
			<button type="button" name="current-week" className="col-8 col-sm-8 col-md-8 btn btn-toggle p-0 btn-week-picker text-dark font-weight-normal rounded-0 border-0" onClick={this.handleToggle}><strong>{moment(this.state.week.startDate).format('ddd')}</strong>, {moment(this.state.week.startDate).format('MMM')} {moment(this.state.week.startDate).format('D')} - <strong>{moment(this.state.week.endDate).format('ddd')}</strong>, {moment(this.state.week.endDate).format('MMM')} {moment(this.state.week.endDate).format('D')}</button>
			<button type="button" name="next-week" className="col-2 col-sm-2 col-md-2 btn btn-toggle p-0 border-0 font-weight-normal text-dark" onClick={this.handleNext}><i className="fa fa-fw fa-caret-right" aria-hidden="true"></i></button>
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
	actions: bindActionCreators({
		getShifts,
		copyShifts,
		createRota,
		switchRota,
		switchWeek,
	}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(WeekPicker);
