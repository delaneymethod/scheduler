import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Modal as ModalCore, Button, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

const propTypes = {
	show: PropTypes.bool,
	title: PropTypes.string,
	children: PropTypes.node,
	isStatic: PropTypes.bool,
	className: PropTypes.string,
	buttonLabel: PropTypes.string,
	onClose: PropTypes.func.isRequired,
};

const defaultProps = {
	title: null,
	show: false,
	className: '',
	children: null,
	isStatic: false,
	buttonLabel: null,
	onClose: () => {},
};

class Modal extends Component {
	render = () => {
		if (!this.props.show) {
			return null;
		}

		return (
			<ModalCore backdrop={(this.props.isStatic) ? 'static' : true} keyboard={this.props.isStatic} centered={true} isOpen={this.props.show} toggle={this.props.onClose} className={this.props.className}>
				{(!isEmpty(this.props.title)) ? (
					<ModalHeader toggle={this.props.onClose}>{this.props.title}</ModalHeader>
				) : null}
				<ModalBody className="p-4 p-sm-4 p-md-5 p-lg-5 p-xl-5">
					{this.props.children}
				</ModalBody>
				{(!isEmpty(this.props.buttonLabel)) ? (
					<ModalFooter className="text-sm-center text-md-right">
						<Button color="secondary" className="btn-block-sm-only" onClick={this.props.onClose}>{this.props.buttonLabel}</Button>
					</ModalFooter>
				) : null}
			</ModalCore>
		);
	};
}

Modal.propTypes = propTypes;

Modal.defaultProps = defaultProps;

export default Modal;
