import React from 'react';
import {Platform, SafeAreaView, StatusBar} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const Form = (props) => (
  <React.Fragment>
    {Platform.OS === 'ios' ? (
      <StatusBar
        barStyle={props.barStyle || 'dark-content'}
        hidden={false}
        backgroundColor="transparent"
      />
    ) : null}
    <SafeAreaView style={{flex: 1}} {...props}>
      <KeyboardAwareScrollView bounces={false}>
        {props.children}
      </KeyboardAwareScrollView>
      <Alert {...props} />
      <Spinner animating={props.fetching} />
    </SafeAreaView>
  </React.Fragment>
);

Form.defaultProps = {
  fetching: false,
  barStyle: 'dark-content',
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool,
  barStyle: PropTypes.string,
};

export default Form;
