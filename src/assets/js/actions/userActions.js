import * as types from './actionTypes';

export const updateUserSuccess = user => ({
	type: types.UPDATE_USER,
	user,
});

export const updateUser = payload => (dispatch) => {
	dispatch(updateUserSuccess(payload));

	return Promise.resolve(true);
};
