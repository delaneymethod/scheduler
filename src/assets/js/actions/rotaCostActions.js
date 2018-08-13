import * as types from './actionTypes';

/* SWITCH BETWEEN ROTA COSTS */
export const switchRotaCostSuccess = rotaCost => ({
	type: types.SWITCH_ROTA_COST,
	rotaCost,
});

export const switchRotaCost = payload => (dispatch) => {
	dispatch(switchRotaCostSuccess(payload));

	return Promise.resolve(true);
};
