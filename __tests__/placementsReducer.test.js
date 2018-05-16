import placementsReducer from '../src/assets/js/reducers/placementsReducer';
import { GET_PLACEMENT, GET_PLACEMENTS, CREATE_PLACEMENT, UPDATE_PLACEMENT, DELETE_PLACEMENT } from '../src/assets/js/actions/actionTypes';

const findPlacement = (placements, id) => (placements.length ? placements.find(placement => placement.id === id) : null);

describe('Placements Reducer', () => {
	let mockPlacements;

	beforeEach(() => {
		mockPlacements = [{
			id: 1,
			account_id: 2,
			shift_id: 1,
			employee_id: 2,
			cost: 70.50,
			created_date: '2018-04-24 09:33:11',
			last_updated: '2018-04-24 09:33:11',
		}];
	});

	it('should return the initial state', () => expect(placementsReducer(undefined, {})).toEqual([]));

	it('should handle GET_PLACEMENT', () => {
		const mockPlacement = mockPlacements[0];

		const action = {
			type: GET_PLACEMENT,
			placement: mockPlacement,
		};

		const placements = placementsReducer(mockPlacements, action);

		const placement = findPlacement(placements, mockPlacement.id);

		expect(placement).toEqual(mockPlacement);
	});

	it('should handle GET_PLACEMENTS', () => {
		const action = {
			type: GET_PLACEMENTS,
			placements: mockPlacements,
		};

		expect(placementsReducer(mockPlacements, action)).toEqual(mockPlacements);
	});

	it('should handle CREATE_PLACEMENT', () => {
		const mockPlacement = {
			id: 1,
			account_id: 2,
			shift_id: 1,
			employee_id: 3,
			cost: 38,
			created_date: '2018-04-24 09:33:11',
			last_updated: '2018-04-24 09:33:11',
		};

		const action = {
			type: CREATE_PLACEMENT,
			placement: mockPlacement,
		};

		const placements = placementsReducer(mockPlacements, action);

		expect(placements.length).toEqual(2);
	});

	it('should handle UPDATE_PLACEMENT', () => {
		const mockPlacement = mockPlacements[0];

		mockPlacement.last_updated = '2018-05-16 16:40:32';

		const action = {
			type: UPDATE_PLACEMENT,
			placement: mockPlacement,
		};

		const placements = placementsReducer(mockPlacements, action);

		const placement = findPlacement(placements, mockPlacement.id);

		expect(placement.last_updated).toEqual(mockPlacement.last_updated);
	});

	it('should handle DELETE_PLACEMENT', () => {
		const mockPlacement = mockPlacements[0];

		const action = {
			type: DELETE_PLACEMENT,
			placement: mockPlacement,
		};

		const placements = placementsReducer(mockPlacements, action);

		expect(placements.length).toEqual(0);
	});
});
