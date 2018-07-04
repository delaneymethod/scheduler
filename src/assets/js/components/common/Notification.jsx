import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

const propTypes = {
	icon: PropTypes.string,
	string: PropTypes.string,
	message: PropTypes.string.isRequired,
};

const defaultProps = {
	icon: '',
	title: '',
	message: '',
};

const Notification = ({ icon, title, message }) => (
	<div className="p-0 m-3">
		{(!isEmpty(title)) ? (
			<h5>{(!isEmpty(icon)) ? (<i className={`m-0 pr-1 fa ${icon}`} aria-hidden="true"></i>) : null}{title}</h5>
		) : null}
		<div dangerouslySetInnerHTML={{ __html: message }} />
	</div>
);

Notification.propTypes = propTypes;

Notification.defaultProps = defaultProps;

export default Notification;
