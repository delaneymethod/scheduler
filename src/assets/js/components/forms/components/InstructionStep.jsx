import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

const propTypes = {
	onClick: PropTypes.func,
	iconSize: PropTypes.string,
	text: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	stepNumberFontSize: PropTypes.string,
	stepNumber: PropTypes.string.isRequired,
};

const defaultProps = {
	iconSize: '3x',
	stepNumberFontSize: '26px',
};

const InstructionStep = props => (
	<Col className={`col-sm ${props.onClick ? 'modal-item-clickable' : ''}`} onClick={() => props.onClick()}>
		<Row>
			<Col style={{ fontSize: props.stepNumberFontSize }}>
				{props.stepNumber}.
			</Col>
			<Col className="text-center">
				<i className={`fa fa-${props.iconSize} ${props.icon}`}></i>
			</Col>
			<Col></Col>
		</Row>
		<Row className="mt-2">
			<Col>
				{props.text}
			</Col>
		</Row>
	</Col>
);

InstructionStep.propTypes = propTypes;

InstructionStep.defaultProps = defaultProps;

export default InstructionStep;
