/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import * as types from './actionTypes';
import schedulerApi from '../api/schedulerApi';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

export const getPlacementsSuccess = placements => ({
	type: types.GET_PLACEMENTS_SUCCESS,
	placements,
});

/* GET ALL PLACEMENTS */
export const getPlacements = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.getPlacements()
		.then((placements) => {
			dispatch(getPlacementsSuccess(placements));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const getPlacementSuccess = placement => ({
	type: types.GET_PLACEMENT_SUCCESS,
	placement,
});

/* GET SPECIFIC PLACEMENT */
export const getPlacement = placement => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.getPlacement(placement)
		.then((data) => {
			dispatch(getPlacementSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const createPlacementSuccess = placement => ({
	type: types.CREATE_PLACEMENT_SUCCESS,
	placement,
});

/* CREATE NEW PLACEMENT */
export const createPlacement = placement => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.createPlacement(placement)
		.then((data) => {
			dispatch(createPlacementSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const updatePlacementSuccess = placement => ({
	type: types.UPDATE_PLACEMENT_SUCCESS,
	placement,
});

/* UPDATE SPECIFIC PLACEMENT */
export const updatePlacement = placement => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.updatePlacement(placement)
		.then((data) => {
			dispatch(updatePlacementSuccess(data));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

export const deletePlacementSuccess = placement => ({
	type: types.DELETE_PLACEMENT_SUCCESS,
	placement,
});

/* DELETE SPECIFIC PLACEMENT */
export const deletePlacement = placement => (dispatch) => {
	dispatch(ajaxLoading(true));

	return schedulerApi.deletePlacement(placement)
		.then(() => {
			dispatch(deletePlacementSuccess(placement));

			dispatch(ajaxLoading(false));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
