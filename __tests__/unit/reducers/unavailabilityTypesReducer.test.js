import unavailabilityTypesReducer from '../../../src/assets/js/reducers/unavailabilityTypesReducer';

import { GET_UNAVAILABILITY_TYPES } from '../../../src/assets/js/actions/actionTypes';

describe('Unavailability Types Reducer', () => {
	let mockUnavailabilityTypes;

	beforeEach(() => {
		mockUnavailabilityTypes = [{
			id: 1,
		}];
	});

	it('should return the initial state', () => expect(unavailabilityTypesReducer(undefined, [])).toEqual([]));

	it('should handle GET_UNAVAILABILITY_TYPES', () => {
		const action = {
			type: GET_UNAVAILABILITY_TYPES,
			unavailabilityTypes: mockUnavailabilityTypes,
		};

		expect(unavailabilityTypesReducer(mockUnavailabilityTypes, action)).toEqual(mockUnavailabilityTypes);
	});
});
