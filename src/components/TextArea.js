import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextInput} from 'react-native';
import styles from './Styles';

export default class TextArea extends Component {
  render() {
    return (
      <TextInput
        ref={this.props.textAreaRef}
        spellCheck
        autoCorrect
        placeholderTextColor="#CBCBCB"
        style={styles.textAreaStyle}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        multiline
        {...this.props}
      />
    );
  }
}

TextArea.propTypes = {
  placeholder: PropTypes.string.isRequired,
};
