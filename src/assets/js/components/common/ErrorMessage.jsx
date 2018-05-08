import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessage = props => <Alert color="danger"><h5 dangerouslySetInnerHTML={{ __html: props.error.title }} /><div dangerouslySetInnerHTML={{ __html: props.error.message }} /></Alert>;

export default ErrorMessage;
