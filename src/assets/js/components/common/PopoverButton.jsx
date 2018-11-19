import React from 'react';
import PropTypes from 'prop-types';

const PopoverButton = ({
	onClick, isEnabled, id, title, text,
}) => (
	<button type="button"
		title={title}
		id={id}
		className={`d-block border-0 m-0 text-uppercase  ${isEnabled ? '' : 'disabled'}`}
		onClick={onClick}>
		{text}
	</button>
);

PopoverButton.propTypes = {
	isEnabled: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export default PopoverButton;
