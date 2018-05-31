import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal as ModalCore, Button, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

const propTypes = {
	show: PropTypes.bool,
	children: PropTypes.node,
	className: PropTypes.string,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	buttonLabel: PropTypes.string.isRequired,
};

const defaultProps = {
	title: '',
	show: false,
	className: '',
	children: null,
	buttonLabel: '',
	onClose: () => {},
};

class Modal extends Component {
	render = () => {
		if (!this.props.show) {
			return null;
		}

		return (
			<ModalCore isOpen={this.props.show} toggle={this.props.onClose} className={this.props.className}>
				<ModalHeader toggle={this.props.onClose}>{this.props.title}</ModalHeader>
				<ModalBody className="p-4 p-sm-4 p-md-5 p-lg-5 p-xl-5">
					{this.props.children}
				</ModalBody>
				<ModalFooter className="text-sm-center text-md-right">
					<Button color="secondary" className="btn-block-sm-only" onClick={this.props.onClose}>{this.props.buttonLabel}</Button>
				</ModalFooter>
			</ModalCore>
		);
	};
}

Modal.propTypes = propTypes;

Modal.defaultProps = defaultProps;

export default Modal;
