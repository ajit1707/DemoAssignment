import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from '../components/LinearGradient';

const deviceWidth = Dimensions.get('window').width;

const AuthButton = (props) => (
  <LinearGradient
    style={[
      styles.linearGradientStyle,
      props.disabled && styles.linearGradientStyleOpacity,
    ]}
    colors={['#DD870D', '#444F53']}
    start={{x: 0.1, y: 0.5}}
    end={{x: 0.6, y: 1}}
    locations={[0.3, 1]}>
    <TouchableOpacity style={styles.button} {...props}>
      {props.children}
    </TouchableOpacity>
  </LinearGradient>
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
    shadowOpacity: 1,
    width: deviceWidth * 0.8,
  },
  linearGradientStyle: {
    borderRadius: 5,
    marginBottom: 15,
  },
  linearGradientStyleOpacity: {
    opacity: 0.5,
  },
});

export default AuthButton;
