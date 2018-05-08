import { combineReducers } from 'redux';

import user from './userReducer';
import rotas from './rotasReducer';
import shifts from './shiftsReducer';
import accounts from './accountsReducer';
import employees from './employeesReducer';
import rotaTypes from './rotaTypesReducer';
import placements from './placementsReducer';
import ajaxLoading from './ajaxLoadingReducer';
import authenticated from './authenticatedReducer';

const reducers = combineReducers({
	user,
	rotas,
	shifts,
	accounts,
	employees,
	rotaTypes,
	placements,
	ajaxLoading,
	authenticated,
});

export default reducers;
