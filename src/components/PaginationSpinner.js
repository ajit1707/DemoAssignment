import React from 'react';
import {ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Color from '../utility/colorConstant';
import Styles from './Styles';
import {setSideMenuItems} from '../modules/getProjects';

const PaginationSpinner = (props) => {
  const {sideMenuItems, animating} = props;
  return (
    animating && (
      <ActivityIndicator
        style={Styles.paginationSpinner}
        color={
          (sideMenuItems && sideMenuItems.sideMenuColor) ||
          Color.PAGINATION_SPINNER
        }
        size="large"
      />
    )
  );
};

PaginationSpinner.defaultProps = {
  sideMenuItems: null,
};

PaginationSpinner.propTypes = {
  sideMenuItems: PropTypes.object,
  animating: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
});

export default connect(mapStateToProps)(PaginationSpinner);
