import React from 'react';
import { Alert } from 'reactstrap';

const SuccessMessage = props => <Alert color="success">{(props.title) ? <h5 dangerouslySetInnerHTML={{ __html: props.title }} /> : '' }<div dangerouslySetInnerHTML={{ __html: props.message }} /></Alert>;

export default SuccessMessage;
