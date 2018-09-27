import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';
import { Tooltip, Popover, PopoverBody, PopoverHeader } from 'reactstrap';

const propTypes = {
	id: PropTypes.string.isRequired,
	unavailability: PropTypes.object.isRequired,
	handleEditUnavailability: PropTypes.func.isRequired,
};

const defaultProps = {
	id: '',
	unavailability: {},
	handleEditUnavailability: () => {},
};

class UnavailabilityDetails extends Component {
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleTooltipDetails = this.handleTooltipDetails.bind(this);

		this.handleUnavailabilityMenu = this.handleUnavailabilityMenu.bind(this);

		this.handleUnavailabilityTooltip = this.handleUnavailabilityTooltip.bind(this);

		this.handleUnavailabilityStartEndTime = this.handleUnavailabilityStartEndTime.bind(this);
	}

	getInitialState = () => ({
		isUnavailabilityPopoverOpen: false,
		isUnavailabilityTooltipOpen: false,
	});

	handleUnavailabilityMenu = () => this.setState({ isUnavailabilityPopoverOpen: !this.state.isUnavailabilityPopoverOpen });

	handleUnavailabilityTooltip = () => this.setState({ isUnavailabilityTooltipOpen: !this.state.isUnavailabilityTooltipOpen });

	handleUnavailabilityStartEndTime = () => {
		let endTime = '';

		let endDate = '';

		const endParts = this.props.unavailability.endDate.split('T');

		if (!isEmpty(endParts[1])) {
			endTime = moment(endParts[1], 'HH:mm:ss').format('HH:mm');
		}

		if (!isEmpty(endParts[0])) {
			endDate = moment(endParts[0], 'YYYY-MM-DD').format('YYYY-MM-DD');
		}

		let startTime = '';

		const startParts = this.props.unavailability.startDate.split('T');

		if (!isEmpty(startParts[1])) {
			startTime = moment(startParts[1], 'HH:mm:ss').format('HH:mm');
		}

		const startDate = moment(startParts[0], 'YYYY-MM-DD').format('YYYY-MM-DD');

		if (startDate === endDate) {
			return `${startTime} - ${endTime}`;
		}

		if (startDate === this.props.weekDate) {
			return `From: ${startTime}`;
		}

		if (endDate === this.props.weekDate) {
			return `To: ${endTime}`;
		}

		return '&nbsp;';
	};

	handleTooltipDetails = () => {
		if (this.props.unavailability.fullDay) {
			if (moment(this.props.unavailability.startDate, 'YYYY-MM-DD').isSame(moment(this.props.unavailability.endDate, 'YYYY-MM-DD'))) {
				return (`${this.props.unavailability.unavailabilityType.unavailabilityTypeName} on<br />${moment(this.props.unavailability.startDate).format('ddd Do')}, All day.${((!isEmpty(this.props.unavailability.reason)) ? '<br />'.concat(this.props.unavailability.reason) : '')}`);
			}

			return (`${this.props.unavailability.unavailabilityType.unavailabilityTypeName} from<br />${moment(this.props.unavailability.startDate).format('ddd Do')} to ${moment(this.props.unavailability.endDate).format('ddd Do')}, All day.${((!isEmpty(this.props.unavailability.reason)) ? '<br />'.concat(this.props.unavailability.reason) : '')}`);
		}

		if (moment(this.props.unavailability.startDate, 'YYYY-MM-DD').isSame(moment(this.props.unavailability.endDate, 'YYYY-MM-DD'))) {
			return (`${this.props.unavailability.unavailabilityType.unavailabilityTypeName} on<br />${moment(this.props.unavailability.startDate).format('ddd Do HH:mm')} to ${moment(this.props.unavailability.startDate).format('HH:mm')} ${((!isEmpty(this.props.unavailability.reason)) ? '<br />'.concat(this.props.unavailability.reason) : '')}`);
		}

		return (`${this.props.unavailability.unavailabilityType.unavailabilityTypeName} from<br />${moment(this.props.unavailability.startDate).format('ddd Do HH:mm')} to ${moment(this.props.unavailability.endDate).format('HH:mm ddd Do')} ${((!isEmpty(this.props.unavailability.reason)) ? '<br />'.concat(this.props.unavailability.reason) : '')}`);
	};

	render = () => (
		<Fragment>
			<div className="p-2 p-lg-1 pl-lg-2 pr-lg-2 mb-2 mb-lg-1 d-block text-left font-weight-light unavailability" id={`unavailability_${this.props.unavailability.unavailabilityId}_${this.props.id}`} onClick={this.handleUnavailabilityMenu}>
				<div className="unavailability__data-row d-block text-truncate"><i className="fa fa-info-circle" aria-hidden="true" id={`unavailability_${this.props.id}_${this.props.unavailability.unavailabilityId}_information`}></i> {this.props.unavailability.unavailabilityType.unavailabilityTypeName}</div>
				<div className="unavailability__data-row d-block text-truncate" dangerouslySetInnerHTML={{ __html: (this.props.unavailability.fullDay) ? 'All Day' : this.handleUnavailabilityStartEndTime() }} />
			</div>
			<Tooltip placement="auto" isOpen={this.state.isUnavailabilityTooltipOpen} target={`unavailability_${this.props.id}_${this.props.unavailability.unavailabilityId}_information`} toggle={this.handleUnavailabilityTooltip}>
				<div className="p-0 m-0" dangerouslySetInnerHTML={{ __html: this.handleTooltipDetails() }} />
			</Tooltip>
			<Popover placement="right" isOpen={this.state.isUnavailabilityPopoverOpen} target={`unavailability_${this.props.unavailability.unavailabilityId}_${this.props.id}`} toggle={this.handleUnavailabilityMenu}>
				<PopoverBody>
					<div className="cell-popover">
						<button type="button" title="Edit Time Off" id="editUnavailability" className="d-block border-0 m-0 text-uppercase" onClick={event => this.props.handleEditUnavailability(event, this.props.unavailability.unavailabilityId)}>Edit Time Off</button>
					</div>
				</PopoverBody>
			</Popover>
		</Fragment>
	);
}

UnavailabilityDetails.propTypes = propTypes;

UnavailabilityDetails.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	id: props.id,
	unavailability: props.unavailability,
	handleEditUnavailability: props.handleEditUnavailability,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UnavailabilityDetails);
