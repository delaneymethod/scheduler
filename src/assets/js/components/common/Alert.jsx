import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Alert as AlertCore } from 'reactstrap';

const propTypes = {
	title: PropTypes.any,
	className: PropTypes.string,
	color: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
};

const defaultProps = {
	color: '',
	title: null,
	message: '',
	className: '',
};

const Alert = ({
	color,
	title,
	message,
	className,
}) => (
	<AlertCore color={color} className={className}>
		{(!isEmpty(title)) ? (
			<h5>{title}</h5>
		) : null}
		<div dangerouslySetInnerHTML={{ __html: message }} />
	</AlertCore>
);

Alert.propTypes = propTypes;

Alert.defaultProps = defaultProps;

export default Alert;
