import React from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import Color from '../utility/colorConstant';
import Styles from './Styles';

export default function PaginationSpinner(props) {
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
}

PaginationSpinner.defaultProps = {
  sideMenuItems: null,
};

PaginationSpinner.propTypes = {
  sideMenuItems: PropTypes.object,
  animating: PropTypes.bool.isRequired,
};
