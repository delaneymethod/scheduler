import $ from 'jquery';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

const propTypes = {
	account: PropTypes.object.isRequired,
};

const defaultProps = {
	account: {},
};

class Toolbar extends Component {
	componentDidMount = () => {
		$('.btn-rotas-popover').popover({
			html: true,
			trigger: 'focus',
			placement: 'bottom',
			content: () => $('#rotas-list').html(),
		});
	};

	render = () => (
		<Row>
			<Col className="pt-3 pb-0 pt-sm-3 pb-ms-3 text-center text-sm-left" xs="12" sm="6" md="6" lg="6" xl="6">
				<button type="button" className="btn btn-muted btn-rotas-popover text-dark border-0" aria-label="Toggle Rotas">{this.props.account.name}, Rota 1<i className="pl-2 fa fa-chevron-down" aria-hidden="true"></i></button>
				<div className="d-none" id="rotas-list">
					<ul className="popover-menu">
						<li><a href="" title="" className="btn btn-action btn-nav border-0">Rota 1</a></li>
						<li><a href="" title="" className="btn btn-action btn-nav border-0">Rota 2</a></li>
						<li><a href="" title="" className="btn btn-action btn-nav border-0">Rota 3</a></li>
						<li><a href="" title="Add New Rota" className="btn btn-primary btn-nav border-0">Add New Rota</a></li>
					</ul>
				</div>
			</Col>
			<Col className="pt-3 pb-3 pt-sm-3 pb-ms-3 text-center text-sm-right" xs="12" sm="6" md="6" lg="6" xl="6">
				<a href="" title="Add New Shift" className="btn btn-secondary pl-5 pr-5 pl-md-4 pr-md-4 pl-lg-5 pr-lg-5 border-0"><i className="pr-2 fa fa-plus" aria-hidden="true"></i>Add New Shift</a>
			</Col>
		</Row>
	);
}

Toolbar.propTypes = propTypes;

Toolbar.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	account: state.user.account,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
