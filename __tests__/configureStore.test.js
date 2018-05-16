import initialState from '../src/assets/js/store/initialState';
import configureStore from '../src/assets/js/store/configureStore';

describe('Configure Store', () => it('should initial default state', () => expect(configureStore().getState()).toEqual(initialState)));
