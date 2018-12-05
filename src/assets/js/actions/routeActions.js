import * as types from './actionTypes';

/* SWITCH BETWEEN ROUTES */
export const switchRouteSuccess = route => ({
	type: types.SWITCH_ROUTE,
	route,
});

export const switchRoute = payload => (dispatch) => {
	dispatch(switchRouteSuccess(payload));

	return Promise.resolve(true);
};
