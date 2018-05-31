import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Alert as AlertCore } from 'reactstrap';

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

const Alert = ({ color, title, message }) => (
	<AlertCore color={color}>
		{(!isEmpty(title)) ? (
			<h5>{title}</h5>
		) : null}
		<div dangerouslySetInnerHTML={{ __html: message }} />
	</AlertCore>
);

Alert.propTypes = propTypes;

Alert.defaultProps = defaultProps;

export default Alert;
