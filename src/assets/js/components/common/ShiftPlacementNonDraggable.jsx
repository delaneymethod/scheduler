import moment from 'moment';
import PropTypes from 'prop-types';

const propTypes = {
	shiftPlacement: PropTypes.object.isRequired,
};

const defaultProps = {
	shiftPlacement: {},
};

const ShiftPlacementNonDraggable = ({
	hours,
	endTime,
	roleName,
	startTime,
	isClosingShift,
}) => (
	<button className="shift-block">
		<div className="shift-block__data-row"><strong>{roleName}</strong> {(!isClosingShift) ? `(${hours} hrs)` : null}</div>
		<div className="shift-block__data-row">{moment(startTime).utc().format('HH:mm a')} - {(isClosingShift) ? 'Closing' : moment(endTime).utc().format('HH:mm a')}</div>
	</button>
);

ShiftPlacementNonDraggable.propTypes = propTypes;

ShiftPlacementNonDraggable.defaultProps = defaultProps;

export default ShiftPlacementNonDraggable;
