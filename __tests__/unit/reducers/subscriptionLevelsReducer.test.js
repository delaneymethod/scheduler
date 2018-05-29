import { GET_SUBSCRIPTION_LEVELS } from '../../../src/assets/js/actions/actionTypes';

import subscriptionLevelsReducer from '../../../src/assets/js/reducers/subscriptionLevelsReducer';

describe('Subscription Levels Reducer', () => {
	it('should return the initial state', () => expect(subscriptionLevelsReducer(undefined, {})).toEqual({}));

	it('should handle GET_SUBSCRIPTION_LEVELS', () => {
		const subscriptionLevels = {
			object: 'list',
			total_count: 1,
			url: '/api/v1/subscription-levels',
			data: [
				{
					object: 'subscriptionLevel',
					subscriptionLevelName: 'FREEMIUM',
					subscriptionLevelId: '1eaf7eb7-4996-4b95-8593-8b18a6bff6b9',
				},
			],
		};

		const action = {
			type: GET_SUBSCRIPTION_LEVELS,
			subscriptionLevels,
		};

		expect(subscriptionLevelsReducer({}, action)).toEqual(subscriptionLevels);
	});
});
