import * as types from './actionTypes';

export const updateSettingsSuccess = settings => ({
	type: types.UPDATE_SETTINGS,
	settings,
});

export const updateSettings = payload => (dispatch) => {
	dispatch(updateSettingsSuccess(payload));

	return Promise.resolve(true);
};
