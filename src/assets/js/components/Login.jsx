/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const Login = () => (
	<Form>
		<FormGroup>
			<Label for="username">Username</Label>
			<Input type="text" name="username" id="username" placeholder="e.g. joebloggs" />
		</FormGroup>
		<FormGroup>
			<Label for="password">Password</Label>
			<Input type="password" name="password" id="password" placeholder="e.g. y1Fwc]_C" />
		</FormGroup>
		<Button>Submit</Button>
	</Form>
);

Login.propTypes = {};

export default hot(module)(Login);
