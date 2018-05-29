import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET ALL SUBSCRIPTION LEVELS */
export const getSubscriptionLevelsSuccess = subscriptionLevels => ({
	type: types.GET_SUBSCRIPTION_LEVELS,
	subscriptionLevels,
});

export const getSubscriptionLevels = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getSubscriptionLevels()
		.then((subscriptionLevels) => {
			dispatch(ajaxLoading(false));

			dispatch(getSubscriptionLevelsSuccess(subscriptionLevels));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
