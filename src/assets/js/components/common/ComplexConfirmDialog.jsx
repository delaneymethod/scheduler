import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import { Modal, Button, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

const propTypes = {
	show: PropTypes.bool.isRequired,
	cancel: PropTypes.func.isRequired,
	dismiss: PropTypes.func.isRequired,
	proceed: PropTypes.func.isRequired,
	options: PropTypes.object.isRequired,
};

const defaultProps = {
	show: false,
	options: {},
	cancel: () => {},
	dismiss: () => {},
	proceed: () => {},
};

const ComplexConfirmDialog = ({
	show,
	cancel,
	options,
	dismiss,
	proceed,
}) => (
	<Modal backdrop={options.enableEscape ? true : 'static'} keyboard={options.enableEscape} centered={true} isOpen={show} toggle={dismiss} className={options.className}>
		<ModalHeader toggle={() => cancel(options.cancel.value)}>{options.title}</ModalHeader>
		<ModalBody className="p-4 p-sm-4 p-md-5 p-lg-5 p-xl-5">
			<div dangerouslySetInnerHTML={{ __html: options.message }} />
		</ModalBody>
		<ModalFooter className="text-center">
			{options.buttons.map((button, buttonIndex) => (
				<Button key={buttonIndex} color={button.color} title={button.label} id={button.id} className="pl-5 pr-5" onClick={() => proceed(button.value)}>{button.label}</Button>
			))}
			<Button color="light" title={options.cancel.label} id="cancel" className="text-dark pl-5 pr-5 ml-auto" onClick={() => cancel(options.cancel.value)}>{options.cancel.label}</Button>
		</ModalFooter>
	</Modal>
);

ComplexConfirmDialog.propTypes = propTypes;

ComplexConfirmDialog.defaultProps = defaultProps;

export default confirmable(ComplexConfirmDialog);
