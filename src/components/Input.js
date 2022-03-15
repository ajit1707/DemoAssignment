import React from 'react';
import {TextInput} from 'react-native';
import Styles from './Styles';

const Input = (props) => (
  <TextInput
    style={Styles.inputStyle}
    underlineColorAndroid="transparent"
    spellCheck
    autoCorrect
    autoCapitalize="none"
    placeholderTextColor="#828B99"
    blurOnSubmit={false}
    ref={props.inputRef}
    returnKeyType="next"
    {...props}
  />
);

export default Input;
