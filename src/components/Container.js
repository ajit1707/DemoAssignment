import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  View,
  Keyboard,
  ViewPropTypes,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Styles from './Styles';

const Container = (props) => {
  const {containerStyle} = props;
  return (
    <React.Fragment>
      {Platform.OS === 'ios' ? (
        <StatusBar
          barStyle={props.barStyle || 'light-content'}
          hidden={false}
          backgroundColor="transparent"
        />
      ) : null}
      <SafeAreaView
        style={{flex: 1, backgroundColor: props.safeAreaViewColor}}
        {...props}>
        <View
          onStartShouldSetResponder={() => Keyboard.dismiss()}
          style={[Styles.safeAreaConatiner, containerStyle]}>
          {props.children}
        </View>
        <Alert {...props} />
        {<Spinner animating={props.fetching || props.logoutFetching} />}
      </SafeAreaView>
    </React.Fragment>
  );
};

Container.defaultProps = {
  logoutFetching: false,
  fetching: false,
  safeAreaViewColor: '#fff',
  barStyle: 'light-content',
  isTabBar: false,
  containerStyle: null,
};

Container.propTypes = {
  fetching: PropTypes.bool,
  logoutFetching: PropTypes.bool,
  safeAreaViewColor: PropTypes.string,
  barStyle: PropTypes.string,
  isTabBar: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
};

const mapStateToProps = (state) => ({
  logoutFetching: state.logOut.fetching,
});

export default connect(mapStateToProps)(Container);
