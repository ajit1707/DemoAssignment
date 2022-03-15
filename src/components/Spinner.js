import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';
import styles from './Styles';
import {setSideMenuItems} from '../modules/getProjects';
import Color from '../utility/colorConstant';

/* Activity Loader component for iOS and android */
class Spinner extends Component {
  render() {
    const {sideMenuItems} = this.props;
    return (
      this.props.animating && (
        <ActivityIndicator
          animating={this.props.animating}
          style={styles.spinnerStyle}
          size="large"
          color={
            (sideMenuItems && sideMenuItems.sideMenuColor) || this.props.color
          }
        />
      )
    );
  }
}

Spinner.defaultProps = {
  color: Color.LOGO,
  sideMenuItems: null,
};

Spinner.propTypes = {
  animating: PropTypes.bool.isRequired,
  color: PropTypes.string,
  sideMenuItems: PropTypes.object,
};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
});

export default connect(mapStateToProps)(Spinner);
