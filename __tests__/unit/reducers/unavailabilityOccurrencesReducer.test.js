import unavailabilityOccurrencesReducer from '../../../src/assets/js/reducers/unavailabilityOccurrencesReducer';

import { GET_UNAVAILABILITY_OCCURRENCES } from '../../../src/assets/js/actions/actionTypes';

describe('Unavailability Occurrences Reducer', () => {
	let mockUnavailabilityOccurrences;

	beforeEach(() => {
		mockUnavailabilityOccurrences = [{
			id: 1,
		}];
	});

	it('should return the initial state', () => expect(unavailabilityOccurrencesReducer(undefined, [])).toEqual([]));

	it('should handle GET_UNAVAILABILITY_OCCURRENCES', () => {
		const action = {
			type: GET_UNAVAILABILITY_OCCURRENCES,
			unavailabilityOccurrences: mockUnavailabilityOccurrences,
		};

		expect(unavailabilityOccurrencesReducer(mockUnavailabilityOccurrences, action)).toEqual(mockUnavailabilityOccurrences);
	});
});
