import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	handleAssignShift: PropTypes.func.isRequired,
};

const defaultProps = {
	handleAssignShift: () => {},
};

const AssignShiftButton = ({ handleAssignShift }) => (<button type="button" id="assignShift" className="p-2 m-0 d-block border-0 text-left w-100 text-center add-shift" onClick={handleAssignShift}><i className="fa fa-fw fa-plus" aria-hidden="true"></i></button>);

AssignShiftButton.propTypes = propTypes;

AssignShiftButton.defaultProps = defaultProps;

export default AssignShiftButton;
