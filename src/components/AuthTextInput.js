import React from 'react';
import {TextInput, StyleSheet, Dimensions} from 'react-native';
import Color from '../utility/colorConstant';
import {fontMaker} from '../utility/helper';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const AuthTextInput = (props) => (
  <TextInput
    {...props}
    ref={props.inputRef}
    placeholderTextColor={Color.PLACEHOLDER}
    style={[styles.textInput, props.textStyle]}
    autoCapitalize="none"
    spellCheck
    autoCorrect
  />
);

const styles = StyleSheet.create({
  textInput: {
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 15,
    marginBottom: deviceHeight * 0.03,
    width: deviceWidth * 0.8,
    height: 50,
    ...fontMaker('regular'),
  },
});

export default AuthTextInput;
