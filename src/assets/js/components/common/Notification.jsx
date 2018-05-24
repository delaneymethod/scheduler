import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Button, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

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

class Notification extends Component {
	render = () => {
		if (!this.props.show) {
			return null;
		}

		return (
			<Modal isOpen={this.props.show} toggle={this.props.onClose} className={this.props.className}>
				<ModalHeader toggle={this.props.onClose}>{this.props.title}</ModalHeader>
				<ModalBody>
					{this.props.children}
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.onClose}>{this.props.buttonLabel}</Button>
				</ModalFooter>
			</Modal>
		);
	};
}

Notification.propTypes = propTypes;

Notification.defaultProps = defaultProps;

export default Notification;
