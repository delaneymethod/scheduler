import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Modal as ModalCore, Button, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

const propTypes = {
	show: PropTypes.bool,
	title: PropTypes.string,
	children: PropTypes.node,
	className: PropTypes.string,
	onClose: PropTypes.func.isRequired,
};

const defaultProps = {
	title: null,
	show: false,
	className: '',
	children: null,
	onClose: () => {},
};

class Modal extends Component {
	render = () => {
		if (!this.props.show) {
			return null;
		}

		return (
			<ModalCore backdrop="static" keyboard={true} centered={true} isOpen={this.props.show} toggle={this.props.onClose} className={this.props.className}>
				{(!isEmpty(this.props.title)) ? (
					<ModalHeader toggle={this.props.onClose}>{this.props.title}</ModalHeader>
				) : null}
				<ModalBody className="p-4 p-sm-4 p-md-5 p-lg-5 p-xl-5">
					{this.props.children}
				</ModalBody>
			</ModalCore>
		);
	};
}

Modal.propTypes = propTypes;

Modal.defaultProps = defaultProps;

export default Modal;
