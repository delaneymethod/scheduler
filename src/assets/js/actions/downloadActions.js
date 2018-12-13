import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const downloadEmployeeUploadTemplate = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.downloadEmployeeUploadTemplate()
		.then((stream) => {
			dispatch(ajaxLoading(false));

			return stream;
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			return Promise.reject(error);
		});
};
