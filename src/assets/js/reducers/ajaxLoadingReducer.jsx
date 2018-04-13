/**
 * @link	  https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license	  https://www.giggrafter.com/license
 */
 
import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';

const ajaxLoadingReducer = (state = initialState.ajaxLoading, action) => {
	if (action.type === types.AJAX_LOADING) {
		return action.status;
	}
	
	return state;
};

export default ajaxLoadingReducer;
