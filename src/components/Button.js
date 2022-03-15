import React from 'react';
import {TouchableOpacity} from 'react-native';
import Styles from './Styles';

const Button = (props) => (
  <TouchableOpacity style={[Styles.button, props.style]} {...props}>
    {props.children}
  </TouchableOpacity>
);

export default Button;
