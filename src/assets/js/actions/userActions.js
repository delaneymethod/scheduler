import * as types from './actionTypes';

export const getUserSuccess = user => ({
	type: types.GET_USER,
	user,
});

export const updateUser = payload => (dispatch) => {
	dispatch(getUserSuccess(payload));

	return Promise.resolve(true);
};
