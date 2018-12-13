import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

const InstructionStep = props => (
	<Col className={`col-sm ${props.onClick ? 'modal-item-clickable' : ''}`} onClick={() => props.onClick()}>
		<Row>
			<Col style={{ fontSize: props.stepNumberFontSize }}>
				{props.stepNumber}.
			</Col>
			<Col className="text-center">
				<i className={`fa fa-${props.iconSize} ${props.icon}`}></i>
			</Col>
			<Col>
			</Col>
		</Row>
		<Row className="mt-2">
			<Col>
				{props.text}
			</Col>
		</Row>
	</Col>);

InstructionStep.propTypes = {
	text: PropTypes.string.isRequired,
	stepNumber: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	stepNumberFontSize: PropTypes.string,
	iconSize: PropTypes.string,
};

InstructionStep.defaultProps = {
	stepNumberFontSize: '26px',
	iconSize: '3x',

};

export default InstructionStep;
