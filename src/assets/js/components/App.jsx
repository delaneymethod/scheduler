import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';

import config from '../helpers/config';

import AjaxLoading from './AjaxLoading';

import ErrorBoundary from './ErrorBoundary';

import News from './views/News';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import NotFoundPage from './views/NotFoundPage';
import CookiesPolicy from './views/CookiesPolicy';
import TermsOfService from './views/TermsOfService';
import UpdateYourPassword from './views/UpdateYourPassword';
import ForgottenYourPassword from './views/ForgottenYourPassword';
import EndUserLicenseAgreement from './views/EndUserLicenseAgreement';

import Settings from './views/dashboard/Settings';
import Dashboard from './views/dashboard/Dashboard';
import Employees from './views/dashboard/Employees';

const routes = config.APP.ROUTES;

const App = () => (
	<ErrorBoundary>
		<Switch context="router">
			<Route exact path={routes.NEWS.URI} component={News} />
			<Route exact path={routes.HOME.URI} component={Home} />
			<Route exact path={routes.LOGIN.URI} component={Login} />
			<Route exact path={routes.REGISTER.URI} component={Register} />
			<Route exact path={routes.COOKIES_POLICY.URI} component={CookiesPolicy} />
			<Route exact path={routes.TERMS_OF_SERVICE.URI} component={TermsOfService} />
			<Route exact path={routes.END_USER_LICENSE_AGREEMENT.URI} component={EndUserLicenseAgreement} />
			<Route exact path={`${routes.UPDATE_YOUR_PASSWORD.URI}/:token`} component={UpdateYourPassword} />
			<Route exact path={routes.FORGOTTEN_YOUR_PASSWORD.URI} component={ForgottenYourPassword} />
			<Route exact path={routes.DASHBOARD.HOME.URI} component={Dashboard} />
			<Route exact path={routes.DASHBOARD.EMPLOYEES.URI} component={Employees} />
			<Route exact path={routes.DASHBOARD.SETTINGS.URI} component={Settings} />
			<Route path="*" component={NotFoundPage} />
		</Switch>
		<AjaxLoading />
		<ToastContainer className="p-0" draggable={false} newestOnTop={true} transition={Slide} hideProgressBar={true} />
	</ErrorBoundary>
);

export default hot(module)(App);
