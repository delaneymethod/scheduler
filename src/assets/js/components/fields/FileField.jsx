import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Label, Input, FormGroup } from 'reactstrap';
import getClassNameForExtension from 'font-awesome-filetypes';
import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

import Modal from '../common/Modal';

const propTypes = {
	fieldValue: PropTypes.any,
	fieldAccept: PropTypes.string,
	valueMissing: PropTypes.string,
	fieldPlaceholder: PropTypes.string,
	handleBlur: PropTypes.func.isRequired,
	baseColor: PropTypes.string.isRequired,
	fieldName: PropTypes.string.isRequired,
	fieldLabel: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	fieldRequired: PropTypes.bool.isRequired,
	activeColor: PropTypes.string.isRequired,
	overlayColor: PropTypes.string.isRequired,
};

const defaultProps = {
	fieldName: '',
	fieldLabel: '',
	fieldAccept: '',
	fieldValue: null,
	valueMissing: '',
	baseColor: 'gray',
	fieldRequired: false,
	fieldPlaceholder: '',
	handleBlur: () => {},
	activeColor: '#ff0000',
	handleChange: () => {},
	overlayColor: 'rgba(255, 255, 255, 0.3)',
};

class FileField extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleDrop = this.handleDrop.bind(this);

		this.handleModal = this.handleModal.bind(this);

		this.handleDragEnter = this.handleDragEnter.bind(this);

		this.handleDragLeave = this.handleDragLeave.bind(this);

		this.handleFileChange = this.handleFileChange.bind(this);

		this.handleGetFileObject = this.handleGetFileObject.bind(this);

		this.handleGetFileString = this.handleGetFileString.bind(this);

		this.handleFormatFileSize = this.handleFormatFileSize.bind(this);
	}

	getInitialState = () => ({
		error: {},
		source: '',
		file: null,
		fileIcon: '',
		active: false,
		loaded: false,
		iconColor: null,
		labelClass: null,
		borderColor: null,
		isModalOpen: false,
	});

	componentDidMount = () => {
		const labelClass = `uploader ${this.state.loaded && 'loaded'}`;

		const borderColor = this.state.active ? this.props.activeColor : this.props.baseColor;

		this.setState({ labelClass, borderColor });
	};

	handleDrop = (event) => {
		event.preventDefault();

		this.setState({ active: false });

		this.handleFileChange(event, event.dataTransfer.files);
	};

	handleGetFileString = () => this.state.source;

	handleDragOver = event => event.preventDefault();

	handleGetFileObject = () => this.refs.input.files[0];

	handleDragEnter = event => this.setState({ active: true });

	handleDragLeave = event => this.setState({ active: false });

	handleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	handleFormatFileSize = (bytes) => {
		const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(1024));

		return (!bytes && '0 Bytes') || ((bytes / (1024 ** i)).toFixed(2).concat(' ').concat(sufixes[i]));
	};

	handleFileChange = (event, files) => {
		let pattern = '';

		/* See: https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv */
		if (this.props.fieldAccept === 'image/*') {
			pattern = /image/gi;
		}

		if (this.props.fieldAccept === '.csv, text/csv') {
			pattern = 'csv.*';
		}

		const file = (files && files.length) ? files[0] : event.target.files[0];

		if (file) {
			if (!isEmpty(pattern) && !file.type.match(pattern)) {
				const error = {
					data: {
						title: 'Invalid file format',
						message: `<p>The specified file <i>${file.name}</i> could not be uploaded.</p><p class="pb-0 mb-0">Only files with the following extensions are allowed: <i>${this.props.fieldAccept}</i></p>`,
					},
				};

				this.setState({
					error,
					source: '',
					file: null,
					fileIcon: '',
					loaded: false,
				});

				/* This is the important part - passing the file back to the parent component so we can track it */
				this.props.handleChange(null);

				this.handleModal();

				return;
			}

			/* This gets the file extension and maps an icon for UX / preview purposes */
			const extension = file.name.split('.').pop();

			const fileIcon = getClassNameForExtension(extension);

			this.setState({ fileIcon, loaded: false });

			/* Since the file type is valid, we read the file - this is mainly for UX / images, to show the file preview before uploading... */
			const reader = new FileReader();

			reader.onload = () => this.setState({ file, loaded: true, source: reader.result });

			reader.readAsDataURL(file);

			/* This is the important part - passing the file back to the parent component so we can track it */
			this.props.handleChange(file);
		}
	};

	render = () => (
		<FormGroup>
			<Label for={this.props.fieldName} className={this.state.labelClass} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleDrop} style={{ outlineColor: this.state.borderColor }}>
				{(this.props.fieldAccept === 'image/*') ? (<img src={this.state.source} className={this.state.loaded && 'loaded'} />) : null}
				{(this.state.loaded && this.props.fieldAccept !== 'image/*') ? (
					<div className="text-center pl-4 pr-4 pl-md-3 pr-md-3"><i className={`fa fa-fw ${this.state.fileIcon} icon mx-auto text-dark`} aria-hidden="true"></i><br />{this.state.file.name} ({this.handleFormatFileSize(this.state.file.size)})</div>
				) : (
					<div className="text-center pl-4 pr-4 pl-md-3 pr-md-3"><i className="fa fa-fw fa-upload icon mx-auto text-dark" aria-hidden="true"></i><br />Drop a file or click to open the file picker.</div>
				)}
				<Input type="file" ref="input" name={this.props.fieldName} id={this.props.fieldName} onChange={this.handleFileChange} onBlur={this.props.handleBlur} accept={this.props.fieldAccept} required={this.props.fieldRequired} />
			</Label>
			<FieldFeedbacks for={this.props.fieldName} show="all">
				<FieldFeedback when="valueMissing" className="mt-4">- {this.props.valueMissing}</FieldFeedback>
			</FieldFeedbacks>
			{(this.state.error.data) ? (
				<Modal title={this.state.error.data.title} className="modal-dialog-error" buttonLabel="Close" show={this.state.isModalOpen} onClose={this.handleModal}>
					<div dangerouslySetInnerHTML={{ __html: this.state.error.data.message }} />
				</Modal>
			) : null}
		</FormGroup>
	);
}

FileField.propTypes = propTypes;

FileField.defaultProps = defaultProps;

export default FileField;
