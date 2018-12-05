import { combineReducers } from 'redux';

import week from './weekReducer';
import user from './userReducer';
import rota from './rotaReducer';
import route from './routeReducer';
import roles from './rolesReducer';
import rotas from './rotasReducer';
import shifts from './shiftsReducer';
import accounts from './accountsReducer';
import rotaCost from './rotaCostReducer';
import rotaType from './rotaTypeReducer';
import settings from './settingsReducer';
import employees from './employeesReducer';
import clipboard from './clipboardReducer';
import rotaTypes from './rotaTypesReducer';
import placements from './placementsReducer';
import ajaxLoading from './ajaxLoadingReducer';
import authenticated from './authenticatedReducer';
import rotaEmployees from './rotaEmployeesReducer';
import cookieConsent from './cookieConsentReducer';
import unavailabilities from './unavailabilitiesReducer';
import rotaTypeEmployees from './rotaTypeEmployeesReducer';
import subscriptionLevels from './subscriptionLevelsReducer';
import unavailabilityTypes from './unavailabilityTypesReducer';
import applicationUserRoles from './applicationUserRolesReducer';
import unavailabilityOccurrences from './unavailabilityOccurrencesReducer';

const reducers = combineReducers({
	week,
	user,
	rota,
	roles,
	rotas,
	route,
	shifts,
	accounts,
	rotaCost,
	rotaType,
	settings,
	employees,
	clipboard,
	rotaTypes,
	placements,
	ajaxLoading,
	cookieConsent,
	authenticated,
	rotaEmployees,
	unavailabilities,
	rotaTypeEmployees,
	subscriptionLevels,
	unavailabilityTypes,
	applicationUserRoles,
	unavailabilityOccurrences,
});

export default reducers;
