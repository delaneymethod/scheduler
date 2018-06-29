import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	handleCreateShift: PropTypes.func.isRequired,
};

const defaultProps = {
	handleCreateShift: () => {},
};

const DraggableCellAddShiftButton = ({ handleCreateShift }) => (<button type="button" className="p-2 m-0 d-block border-0 text-left w-100 text-center add-shift" onClick={handleCreateShift}><i className="fa fa-fw fa-plus" aria-hidden="true"></i></button>);

DraggableCellAddShiftButton.propTypes = propTypes;

DraggableCellAddShiftButton.defaultProps = defaultProps;

export default DraggableCellAddShiftButton;
