import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const propTypes = {
	ajaxLoading: PropTypes.bool.isRequired,
};

const defaultProps = {
	ajaxLoading: true,
};

const AjaxLoading = ({ ajaxLoading }) => (<BlockUi tag="main" blocking={ajaxLoading} loader={<Loader active type="ball-beat" color="#90BC47" />} />);

AjaxLoading.propTypes = propTypes;

AjaxLoading.defaultProps = defaultProps;

const mapStateToProps = (state, props) => ({
	ajaxLoading: state.ajaxLoading,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AjaxLoading);
