/**
 * @link	  https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license	  https://www.giggrafter.com/license
 */
 
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import cakes from './cakesReducer';
import formStatus from './formStatusReducer';
import ajaxLoading from './ajaxLoadingReducer';

const reducers = combineReducers({
	cakes,
	formStatus,
	ajaxLoading,
	form: formReducer
});

export default reducers;
