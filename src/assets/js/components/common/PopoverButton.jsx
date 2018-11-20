import React from 'react';
import PropTypes from 'prop-types';

const PopoverButton = ({
	id,
	text,
	title,
	onClick,
	isEnabled,
}) => (<button type="button" title={title} id={id} className={`d-block border-0 m-0 text-uppercase	${isEnabled ? '' : 'disabled non-clickable'}`} onClick={onClick}>{text}</button>);

PopoverButton.propTypes = {
	id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	isEnabled: PropTypes.bool.isRequired,
};

export default PopoverButton;
