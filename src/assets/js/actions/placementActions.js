import * as api from '../api';
import * as types from './actionTypes';

export const ajaxLoading = status => ({
	type: types.AJAX_LOADING,
	status,
});

/* GET ALL PLACEMENTS */
export const getPlacementsSuccess = placements => ({
	type: types.GET_PLACEMENTS,
	placements,
});

export const getPlacements = () => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getPlacements()
		.then((placements) => {
			dispatch(ajaxLoading(false));

			dispatch(getPlacementsSuccess(placements));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* GET SPECIFIC PLACEMENT */
export const getPlacementSuccess = placement => ({
	type: types.GET_PLACEMENT,
	placement,
});

export const getPlacement = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.getPlacement(payload)
		.then((placement) => {
			dispatch(ajaxLoading(false));

			dispatch(getPlacementSuccess(placement));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* CREATE NEW PLACEMENT */
export const createPlacementSuccess = placement => ({
	type: types.CREATE_PLACEMENT,
	placement,
});

export const createPlacement = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.createPlacement(payload)
		.then((placement) => {
			dispatch(ajaxLoading(false));

			dispatch(createPlacementSuccess(placement));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* UPDATE SPECIFIC PLACEMENT */
export const updatePlacementSuccess = placement => ({
	type: types.UPDATE_PLACEMENT,
	placement,
});

export const updatePlacement = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.updatePlacement(payload)
		.then((placement) => {
			dispatch(ajaxLoading(false));

			dispatch(updatePlacementSuccess(placement));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};

/* DELETE SPECIFIC PLACEMENT */
export const deletePlacementSuccess = placement => ({
	type: types.DELETE_PLACEMENT,
	placement,
});

export const deletePlacement = payload => (dispatch) => {
	dispatch(ajaxLoading(true));

	return api.deletePlacement(payload)
		.then((placement) => {
			dispatch(ajaxLoading(false));

			dispatch(deletePlacementSuccess(placement));
		})
		.catch((error) => {
			dispatch(ajaxLoading(false));

			/* Bubble the error back up the rabbit hole */
			return Promise.reject(error);
		});
};
