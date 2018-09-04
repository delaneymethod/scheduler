import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import React, { Fragment, Component } from 'react';
import { Row, Col, Input, Label, Button, FormGroup } from 'reactstrap';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import config from '../../helpers/config';

import { updateSettings } from '../../actions/settingActions';

const routes = config.APP.ROUTES;

const propTypes = {
	settings: PropTypes.object.isRequired,
};

const defaultProps = {
	settings: {},
};

class SettingsForm extends Component {
	constructor(props) {
		super(props);

		this.form = null;

		this.state = this.getInitialState();

		this.handleBlur = this.handleBlur.bind(this);

		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState = () => ({
		firstDayOfWeek: 1,
	});

	componentDidMount = () => {
		/* We debounce this call to wait 1300ms (we do not want the leading (or "immediate") flag passed because we want to wait until the user has finished typing before running validation */
		this.handleValidateFields = debounce(this.handleValidateFields.bind(this), 1300);

		/* This listens for change events across the document - user typing and browser autofill */
		document.addEventListener('change', event => this.form && this.form.validateFields(event.target));

		const { settings: { firstDayOfWeek } } = this.props;

		this.setState({ firstDayOfWeek });
	};

	handleChange = (event) => {
		const target = event.currentTarget;

		this.setState({
			[target.name]: target.value,
		});
	};

	handleBlur = async event => this.handleValidateFields(event.currentTarget);

	handleSubmit = async (event) => {
		event.preventDefault();

		const { actions, history } = this.props;

		await this.form.validateFields();

		if (this.form.isValid()) {
			const { firstDayOfWeek } = this.state;

			const payload = {
				firstDayOfWeek,
			};

			console.log('Called Settings handleSubmit updateSettings');
			actions.updateSettings(payload).then(() => {
				console.log('Called Settings handleSubmit firstDayOfWeek:', firstDayOfWeek);
				/* Make sure we update moment locate and day of week config */
				moment.updateLocale('en', {
					week: {
						dow: firstDayOfWeek,
						doy: moment.localeData('en').firstDayOfYear(),
					},
				});

				/* Bring the user back to the dashboard so all the data is reloaded again based off new week start date */
				history.push(routes.DASHBOARD.HOME.URI);
			});
		}
	};

	handleValidateFields = target => ((this.form && target) ? this.form.validateFields(target) : null);

	render = () => (
		<Fragment>
			<FormWithConstraints ref={(el) => { this.form = el; }} onSubmit={this.handleSubmit} noValidate>
				<Row>
					<Col xs="12" sm="12" md="12" lg="4" xl="4">
						<FormGroup>
							<Label for="firstDayOfWeek">First Day Of Week</Label>
							<Input type="select" name="firstDayOfWeek" id="firstDayOfWeek" className="custom-select custom-select-xl" value={this.state.firstDayOfWeek} onChange={this.handleChange} onBlur={this.handleBlur} tabIndex="1" required>
								<option value="0" label="Sunday">Sunday</option>
								<option value="1" label="Monday">Monday</option>
								<option value="2" label="Tuesday">Tuesday</option>
								<option value="3" label="Wednesday">Wednesday</option>
								<option value="4" label="Thursday">Thursday</option>
								<option value="5" label="Friday">Friday</option>
								<option value="6" label="Saturday">Saturday</option>
							</Input>
							<FieldFeedbacks for="firstDayOfWeek" show="all">
								<FieldFeedback when="*">- Please select first day of week.</FieldFeedback>
							</FieldFeedbacks>
						</FormGroup>
						<Button type="submit" color="primary" className="mt-4" id="submitUpdate" title={routes.SETTINGS.UPDATE.TITLE} tabIndex="2" block>{routes.SETTINGS.UPDATE.TITLE}</Button>
					</Col>
				</Row>
			</FormWithConstraints>
		</Fragment>
	);
}

SettingsForm.propTypes = propTypes;

SettingsForm.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ updateSettings }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsForm);
