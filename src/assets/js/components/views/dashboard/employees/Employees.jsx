import $ from 'jquery';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Fragment, Component } from 'react';

import Modal from '../../../common/Modal';

import Header from '../../../common/Header';

import Toolbar from '../../../common/Toolbar';

import ShiftForm from '../../../forms/ShiftForm';

import constants from '../../../../helpers/constants';

const routes = constants.APP.ROUTES;

const propTypes = {
	rota: PropTypes.object.isRequired,
	rotas: PropTypes.array.isRequired,
	rotaType: PropTypes.object.isRequired,
	employees: PropTypes.array.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const defaultProps = {
	rota: {},
	rotas: [],
	rotaType: {},
	employees: [],
	authenticated: false,
};

class Employees extends Component {
	constructor(props) {
		super(props);

		const { history, authenticated } = this.props;

		if (!authenticated) {
			history.push(routes.LOGIN.URI);
		}

		this.state = this.getInitialState();

		this.handleSort = this.handleSort.bind(this);

		this.handleModal = this.handleModal.bind(this);

		this.handleFilter = this.handleFilter.bind(this);
	}

	getInitialState = () => ({
		isModalOpen: false,
	});

	componentDidMount = () => {
		document.title = `${constants.APP.TITLE}: ${routes.DASHBOARD.EMPLOYEES.TITLE} - ${routes.DASHBOARD.HOME.TITLE}`;

		const meta = document.getElementsByTagName('meta');

		meta.description.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.DESCRIPTION);
		meta.keywords.setAttribute('content', routes.DASHBOARD.EMPLOYEES.META.KEYWORDS);
		meta.author.setAttribute('content', constants.APP.AUTHOR);

		$('.btn-filter-sort-popover').popover({
			html: true,
			trigger: 'focus',
			placement: 'bottom',
			content: () => $('#filter-sort-list').html(),
		});

		/* Bit hacky and not the "React Way" but because we are using Popovers, event handlers are not binded! */
		$(document).on('shown.bs.popover', () => {
			$('.sort, .filter').bind('click');

			$('.sort').on('click', event => this.handleSort(event));

			$('.filter').on('click', event => this.handleFilter(event));
		});
	};

	handleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	handleSort = (event) => {
		const target = event.currentTarget;

		const { key } = target;

		console.log(key);
	};

	handleFilter = (event) => {
		const target = event.currentTarget;

		const { key } = target;

		console.log(key);
	};

	render = () => (
		<Fragment>
			<Header history={this.props.history} />
			<Toolbar />
			{this.props.rotaType.rotaTypeName} - {this.props.rota.budget}
			<div className="table-responsive u-disable-selection">
				<table className="table rota-table p-0 mb-0 bg-light">
					<thead>
						<tr className="thead-bg">
							<th scope="col" className="cell-employee table-config text-uppercase">
								<div>Employees ({this.props.employees.length})</div>
								<div className="btn-wrap">
									<button type="button" className="btn btn-dark btn-icon btn-filter-sort-popover mr-2" aria-label="Toggle Filter & Sorting Options"><i className="fa fa-fw fa-filter" aria-hidden="true"></i></button>
									<button type="button" className="btn btn-secondary btn-icon mr-2"><i className="fa fa-fw fa-upload" aria-hidden="true"></i></button>
									<button type="button" className="btn btn-secondary btn-icon"><i className="fa fa-fw fa-user-plus" aria-hidden="true"></i></button>
									<div className="d-none" id="filter-sort-list">
										<ul className="popover-menu">
											<li><label className="p-3 pb-0">Sort by</label></li>
											<li><button type="button" title="First Name" className="btn btn-action btn-nav border-0 sort" key="first-name">First Name</button></li>
											<li><button type="button" title="Last Name" className="btn btn-action btn-nav border-0 sort" key="last-name">Last Name</button></li>
										</ul>
									</div>
								</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/0</div>
								</div>
								<div>Mon 13</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator doing"></div>
									<div className="count">2/12</div>
								</div>
								<div>Tue 14</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator done"></div>
									<div className="count">15/15</div>
								</div>
								<div>Wed 15</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator done"></div>
									<div className="count">15/15</div>
								</div>
								<div>Thur 16</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator todo"></div>
									<div className="count">0/13</div>
								</div>
								<div>Fri 17</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator doing"></div>
									<div className="count">19/25</div>
								</div>
								<div>Sat 18</div>
							</th>
							<th scope="col">
								<div className="placement-status">
									<div className="indicator doing"></div>
									<div className="count">4/18</div>
								</div>
								<div>Sun 19</div>
							</th>
							<th scope="col">Total</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td scope="row" className="cell-employee">
								<div className="d-flex align-items-center">
									<div className="flex-column cell-employee__avatar">
										<img src="https://d3iw72m71ie81c.cloudfront.net/female-16.jpeg" alt="" />
									</div>
									<div className="flex-column cell-employee__details">
										<div className="flex-row cell-employee__details-name">
											Carol McHugh
										</div>
										<div className="flex-row cell-employee__details-attr">
											<i className="fa fa-fw fa-gbp" aria-hidden="true"></i>
											<i className="fa fa-fw fa-envelope complete" aria-hidden="true"></i>
											<i className="fa fa-fw fa-phone complete" aria-hidden="true"></i>
										</div>
									</div>
								</div>
							</td>
							<td className="cell-draggable">
								<button className="shift-block" id="shift1" draggable="true" data-content="<div className='cell-popover'><a href='/'>Edit Shift</a><a href='/'><i className='fa fa-fw fa-plus' aria-hidden='true'></i> Add New Shift</a></div>">
									<div className="shift-block__data-row"><b>Bartender</b> (9 hrs)</div>
									<div className="shift-block__data-row">12:00pm - 9:00pm</div>
								</button>
							</td>
							<td className="cell-draggable">
								<button className="add-shift-block" data-toggle="modal" data-target=".form-modal"><i className='fa fa-fw fa-plus' aria-hidden='true'></i></button>
							</td>
							<td className="cell-draggable"></td>
							<td className="cell-draggable"></td>
							<td className="cell-draggable"></td>
							<td className="cell-draggable"></td>
							<td className="cell-draggable"></td>
							<td className="row-total">
								<div>11.00 hrs</div>
								<div>(£146.00)</div>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">Total Hours</div>
										<div className="flex-row">Total Shifts</div>
									</div>
									<div className="flex-column text-danger">Total Costs</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">£0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">£0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">£0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">£0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">£0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">£0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">0</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">£0.00</div>
								</div>
							</th>
							<th scope="col" className="rota-table__footer-cell">
								<div className="d-flex align-items-center">
									<div className="flex-column">
										<div className="flex-row">20</div>
										<div className="flex-row">0</div>
									</div>
									<div className="flex-column text-danger">£266.00</div>
								</div>
							</th>
						</tr>
					</tfoot>
				</table>
			</div>
			<Modal title="Shifts" className="modal-dialog" buttonLabel="Cancel" show={this.state.isModalOpen} onClose={this.handleModal}>
				<ShiftForm />
			</Modal>
		</Fragment>
	);
}

Employees.propTypes = propTypes;

Employees.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	rota: state.rota,
	rotas: state.rotas,
	rotaType: state.rotaType,
	employees: state.employees,
	authenticated: state.authenticated,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
