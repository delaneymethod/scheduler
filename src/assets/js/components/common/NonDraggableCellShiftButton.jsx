import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const propTypes = {
	shiftPlacement: PropTypes.object.isRequired,
};

const defaultProps = {
	shiftPlacement: {},
};

const NonDraggableCellShiftButton = ({
	shiftPlacement: {
		hours,
		endTime,
		roleName,
		startTime,
		isClosingShift,
	},
}) => (
	<button className="p-2 mb-2 d-block text-left shift" draggable="false">
		<div className="shift__data-row d-block w-100"><strong>{roleName}</strong> {(!isClosingShift) ? `(${hours} hrs)` : null}</div>
		<div className="shift__data-row d-block w-100">{moment(startTime).utc().format('HH:mm a')} - {(isClosingShift) ? 'Closing' : moment(endTime).utc().format('HH:mm a')}</div>
	</button>
);

NonDraggableCellShiftButton.propTypes = propTypes;

NonDraggableCellShiftButton.defaultProps = defaultProps;

export default NonDraggableCellShiftButton;
