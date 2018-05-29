import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

const propTypes = {
	title: PropTypes.any,
	color: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
};

const defaultProps = {
	color: '',
	title: null,
	message: '',
};

const NotificationAlert = props => (
	<Alert color={props.color}>
		{(props.title) ? (
			<h5>{props.title}</h5>
		) : null}
		<div dangerouslySetInnerHTML={{ __html: props.message }} />
	</Alert>
);

NotificationAlert.propTypes = propTypes;

NotificationAlert.defaultProps = defaultProps;

export default NotificationAlert;
