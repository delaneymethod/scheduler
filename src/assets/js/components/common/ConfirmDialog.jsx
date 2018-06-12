import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import { Modal, Button, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

const propTypes = {
	show: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	options: PropTypes.object.isRequired,
	dismiss: PropTypes.func.isRequired,
	cancel: PropTypes.func.isRequired,
	proceed: PropTypes.func.isRequired,
};

const defaultProps = {
	show: false,
	message: '',
	options: {},
	cancel: () => {},
	dismiss: () => {},
	proceed: () => {},
};

const ConfirmDialog = ({
	show,
	cancel,
	message,
	options,
	dismiss,
	proceed,
}) => (
	<Modal backdrop="static" keyboard={false} centered={true} isOpen={show} toggle={dismiss} className={options.className}>
		<ModalHeader toggle={dismiss}>{options.title}</ModalHeader>
		<ModalBody className="p-4 p-sm-4 p-md-5 p-lg-5 p-xl-5">
			<div dangerouslySetInnerHTML={{ __html: message }} />
		</ModalBody>
		<ModalFooter className="text-center">
			<Button color="primary" title={options.labels.proceed} className="pl-5 pr-5 ml-auto" onClick={() => proceed(options.values.proceed)}>{options.labels.proceed}</Button>
			<Button color="secondary" title={options.labels.cancel} className="pl-5 pr-5 mr-auto" onClick={() => cancel(options.values.cancel)}>{options.labels.cancel}</Button>
		</ModalFooter>
	</Modal>
);

ConfirmDialog.propTypes = propTypes;

ConfirmDialog.defaultProps = defaultProps;

export default confirmable(ConfirmDialog);
