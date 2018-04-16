/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import users from './usersReducer';
import userTypes from './userTypesReducer';
import userRoles from './userRolesReducer';
import companies from './companiesReducer';
import shifts from './shiftsReducer';
import rotas from './rotasReducer';
import rotaTypes from './rotaTypesReducer';
import placements from './placementsReducer';
import formStatus from './formStatusReducer';
import ajaxLoading from './ajaxLoadingReducer';

const reducers = combineReducers({
	users,
	userTypes,
	userRoles,
	companies,
	shifts,
	rotas,
	rotaTypes,
	placements,
	formStatus,
	ajaxLoading,
	form: formReducer,
});

export default reducers;
