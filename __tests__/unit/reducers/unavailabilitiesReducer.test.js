import unavailabilitiesReducer from '../../../src/assets/js/reducers/unavailabilitiesReducer';

import { GET_UNAVAILABILITY, CREATE_UNAVAILABILITY, UPDATE_UNAVAILABILITY, DELETE_UNAVAILABILITY } from '../../../src/assets/js/actions/actionTypes';

const findUnavailability = (unavailabilities, unavailabilityId) => (unavailabilities.length ? unavailabilities.find(unavailability => unavailability.unavailabilityId === unavailabilityId) : null);

describe('Unavailabilities Reducer', () => {
	let mockUnavailabilities;

	beforeEach(() => {
		mockUnavailabilities = [{
			unavailabilityId: 1,
			fullDay: true,
		}];
	});

	it('should return the initial state', () => expect(unavailabilitiesReducer(undefined, [])).toEqual([]));

	it('should handle GET_UNAVAILABILITY', () => {
		const mockUnavailability = mockUnavailabilities[0];

		const action = {
			type: GET_UNAVAILABILITY,
			unavailability: mockUnavailability,
		};

		const unavailabilities = unavailabilitiesReducer(mockUnavailabilities, action);

		const unavailability = findUnavailability(unavailabilities, mockUnavailability.unavailabilityId);

		expect(unavailability).toEqual(mockUnavailability);
	});

	it('should handle CREATE_UNAVAILABILITY', () => {
		const mockUnavailability = {
			unavailabilityId: 2,
		};

		const action = {
			unavailability: mockUnavailability,
			type: CREATE_UNAVAILABILITY,
		};

		const unavailabilities = unavailabilitiesReducer(mockUnavailabilities, action);

		expect(unavailabilities.length).toEqual(1);
	});

	it('should handle UPDATE_UNAVAILABILITY', () => {
		const mockUnavailability = mockUnavailabilities[0];

		mockUnavailability.fullDay = false;

		const action = {
			unavailability: mockUnavailability,
			type: UPDATE_UNAVAILABILITY,
		};

		const unavailabilities = unavailabilitiesReducer(mockUnavailabilities, action);

		const unavailability = findUnavailability(unavailabilities, mockUnavailability.unavailabilityId);

		expect(unavailability.fullDay).toEqual(mockUnavailability.fullDay);
	});

	it('should handle DELETE_UNAVAILABILITY', () => {
		const mockUnavailability = mockUnavailabilities[0];

		const action = {
			unavailability: mockUnavailability,
			type: DELETE_UNAVAILABILITY,
		};

		const unavailabilities = unavailabilitiesReducer(mockUnavailabilities = [], action);

		expect(unavailabilities.length).toEqual(0);
	});
});
