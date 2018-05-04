import { combineReducers } from 'redux';

import users from './usersReducer';
import rotas from './rotasReducer';
import shifts from './shiftsReducer';
import userTypes from './userTypesReducer';
import userRoles from './userRolesReducer';
import companies from './companiesReducer';
import rotaTypes from './rotaTypesReducer';
import placements from './placementsReducer';
import ajaxLoading from './ajaxLoadingReducer';
import authenticated from './authenticatedReducer';

const reducers = combineReducers({
	users,
	rotas,
	shifts,
	userTypes,
	userRoles,
	companies,
	rotaTypes,
	placements,
	ajaxLoading,
	authenticated,
});

export default reducers;
