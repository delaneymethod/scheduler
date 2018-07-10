import { combineReducers } from 'redux';

import week from './weekReducer';
import user from './userReducer';
import rota from './rotaReducer';
import roles from './rolesReducer';
import rotas from './rotasReducer';
import shifts from './shiftsReducer';
import accounts from './accountsReducer';
import rotaType from './rotaTypeReducer';
import settings from './settingsReducer';
import employees from './employeesReducer';
import rotaTypes from './rotaTypesReducer';
import placements from './placementsReducer';
import ajaxLoading from './ajaxLoadingReducer';
import authenticated from './authenticatedReducer';
import subscriptionLevels from './subscriptionLevelsReducer';

const reducers = combineReducers({
	week,
	user,
	rota,
	roles,
	rotas,
	shifts,
	accounts,
	rotaType,
	settings,
	employees,
	rotaTypes,
	placements,
	ajaxLoading,
	authenticated,
	subscriptionLevels,
});

export default reducers;
