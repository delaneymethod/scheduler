import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const rolesReducer = (state = combinedState.roles, action) => {
	switch (action.type) {
		case types.GET_ROLES:
			return action.roles;

		case types.GET_ROLE:
		case types.UPDATE_ROLE:
			return [
				...state.filter(role => role.id !== action.role.id),
				Object.assign({}, action.role),
			];

		case types.CREATE_ROLE:
			return [
				...state,
				Object.assign({}, action.role),
			];

		case types.DELETE_ROLE:
			return [
				...state.filter(role => role.id !== action.role.id),
			];

		default:
			return state;
	}
};

export default rolesReducer;
