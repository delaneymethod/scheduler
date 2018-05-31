import * as types from './actionTypes';

export const updateWeekSuccess = week => ({
	type: types.UPDATE_WEEK,
	week,
});

export const updateWeek = payload => (dispatch) => {
	dispatch(updateWeekSuccess(payload));

	return Promise.resolve(true);
};
