import React, {useState} from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TextInput, StyleSheet, Dimensions, View} from 'react-native';
import Color from '../utility/colorConstant';
import {fontMaker} from '../utility/helper';

const deviceWidth = Dimensions.get('window').width;
const IconButton = React.forwardRef((props, ref) => {
  const [isFocused, setFocus] = useState(false);
  return (
    <View style={styles.textInputContainer}>
      <FontAwesome
        accessibilityLabel={props.iconAccessibilityLabel}
        name={props.icon}
        size={props.iconSize}
        color={isFocused ? '#A9A9A9' : '#ccc'}
      />
      <TextInput
        ref={ref}
        placeholderTextColor={Color.PLACEHOLDER}
        style={[styles.textInput, isFocused && styles.borderBottom]}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        autoCapitalize="none"
        spellCheck
        autoCorrect
        {...props}
      />
    </View>
  );
});

IconButton.defaultProps = {
  inputRef: '',
  iconSize: 22,
  icon: '',
  iconAccessibilityLabel: '',
};

IconButton.propTypes = {
  inputRef: PropTypes.string,
  iconSize: PropTypes.number,
  icon: PropTypes.string,
  iconAccessibilityLabel: PropTypes.string,
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingLeft: 15,
    width: deviceWidth * 0.8,
    height: 50,
    ...fontMaker('regular'),
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  borderBottom: {
    borderBottomColor: '#A9A9A9',
  },
});

export default IconButton;
