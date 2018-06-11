import * as types from './actionTypes';

/* SWITCH BETWEEN WEEKS */
export const switchWeekSuccess = week => ({
	type: types.SWITCH_WEEK,
	week,
});

export const switchWeek = payload => dispatch => Promise.resolve(dispatch(switchWeekSuccess(payload)));
