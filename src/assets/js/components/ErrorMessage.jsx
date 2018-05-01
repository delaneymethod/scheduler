/**
 * @link https://www.giggrafter.com
 * @copyright Copyright (c) Gig Grafter
 * @license https://www.giggrafter.com/license
 */

import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessage = props => <Alert color="danger"><strong dangerouslySetInnerHTML={{ __html: props.error.title }} /><span className="d-block" dangerouslySetInnerHTML={{ __html: props.error.message }} /></Alert>;

export default ErrorMessage;
