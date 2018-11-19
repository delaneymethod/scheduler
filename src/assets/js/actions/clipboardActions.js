import * as types from './actionTypes';

/* COPY SHIFT - Saves the shift the user selects to copy */
export const copyShiftToClipBoardSuccess = shift => ({
	type: types.COPY_SHIFT_TO_CLIPBOARD,
	shift,
});

export const copyShiftToClipBoard = shift => (dispatch) => {
	dispatch(copyShiftToClipBoardSuccess(shift));
};
