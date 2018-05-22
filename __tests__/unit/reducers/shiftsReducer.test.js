import shiftsReducer from '../../../src/assets/js/reducers/shiftsReducer';

import { GET_SHIFT, GET_SHIFTS, CREATE_SHIFT, UPDATE_SHIFT, DELETE_SHIFT } from '../../../src/assets/js/actions/actionTypes';

const findShift = (shifts, id) => (shifts.length ? shifts.find(shift => shift.id === id) : null);

describe('Shifts Reducer', () => {
	let mockShifts;

	beforeEach(() => {
		mockShifts = [{
			id: 1,
			account_id: 2,
			rota_id: 1,
			role_id: null,
			start_time: '2019-03-08 17:00:00',
			end_time: '2019-03-08 22:00:00',
			no_of_positions: 1,
			is_closing_shift: 0,
			created_date: '2018-04-24 09:32:33',
			last_updated: '2018-04-24 09:32:32',
		}];
	});

	it('should return the initial state', () => expect(shiftsReducer(undefined, {})).toEqual([]));

	it('should handle GET_SHIFT', () => {
		const mockShift = mockShifts[0];

		const action = {
			type: GET_SHIFT,
			shift: mockShift,
		};

		const shifts = shiftsReducer(mockShifts, action);

		const shift = findShift(shifts, mockShift.id);

		expect(shift).toEqual(mockShift);
	});

	it('should handle GET_SHIFTS', () => {
		const action = {
			type: GET_SHIFTS,
			shifts: mockShifts,
		};

		expect(shiftsReducer(mockShifts, action)).toEqual(mockShifts);
	});

	it('should handle CREATE_SHIFT', () => {
		const mockShift = {
			id: 2,
			account_id: 2,
			rota_id: 2,
			role_id: null,
			start_time: '2019-03-08 17:00:00',
			end_time: '2019-03-08 22:00:00',
			no_of_positions: 1,
			is_closing_shift: 0,
			created_date: '2018-04-24 09:32:33',
			last_updated: '2018-04-24 09:32:32',
		};

		const action = {
			shift: mockShift,
			type: CREATE_SHIFT,
		};

		const shifts = shiftsReducer(mockShifts, action);

		expect(shifts.length).toEqual(2);
	});

	it('should handle UPDATE_SHIFT', () => {
		const mockShift = mockShifts[0];

		mockShift.last_updated = '2018-05-16 16:40:32';

		const action = {
			shift: mockShift,
			type: UPDATE_SHIFT,
		};

		const shifts = shiftsReducer(mockShifts, action);

		const shift = findShift(shifts, mockShift.id);

		expect(shift.last_updated).toEqual(mockShift.last_updated);
	});

	it('should handle DELETE_SHIFT', () => {
		const mockShift = mockShifts[0];

		const action = {
			shift: mockShift,
			type: DELETE_SHIFT,
		};

		const shifts = shiftsReducer(mockShifts, action);

		expect(shifts.length).toEqual(0);
	});
});
