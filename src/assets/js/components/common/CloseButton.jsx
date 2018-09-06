import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	closeToast: PropTypes.func.isRequired,
};

const defaultProps = {
	closeToast: () => {},
};

const CloseButton = ({ closeToast }) => (<button type="button" className="toast-close-button" id="closeToast" onClick={closeToast} aria-label="Close"><span aria-hidden="true">&times;</span></button>);

CloseButton.propTypes = propTypes;

CloseButton.defaultProps = defaultProps;

export default CloseButton;
