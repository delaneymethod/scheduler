import * as types from '../actions/actionTypes';
import initialState from '../store/initialState';
import { getStates } from '../store/persistedState';

const persistedState = getStates();

const combinedState = Object.assign(initialState, persistedState);

const shiftsReducer = (state = combinedState.shifts, action) => {
	switch (action.type) {
		case types.GET_SHIFTS:
			return action.shifts;

		case types.COPY_SHIFTS:
			return state;

		case types.GET_SHIFT:
		case types.UPDATE_SHIFT:
			return [
				...state.filter(shift => shift.id !== action.shift.id),
				Object.assign({}, action.shift),
			];

		case types.CREATE_SHIFT:
			return [
				...state,
				Object.assign({}, action.shift),
			];

		case types.DELETE_SHIFT:
			return [
				...state.filter(shift => shift.id !== action.shift.id),
			];

		default:
			return state;
	}
};

export default shiftsReducer;
