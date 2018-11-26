import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const applicationUserRolesReducer = (state = combinedState.applicationUserRoles, action) => {
	switch (action.type) {
		case types.GET_APPLICATION_USER_ROLES:
			return action.applicationUserRoles;

		default:
			return state;
	}
};

export default applicationUserRolesReducer;
