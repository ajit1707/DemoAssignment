import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import styles from './Styles';

const CheckBox = (props) => {
  const {onSelect, text, isChecked} = props;
  return (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.checkBoxItemContainer}
        onPress={() => onSelect(text)}
        {...props}>
        {!isChecked ? (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={24}
            color="#ccc"
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={24}
            color="#00f"
          />
        )}
        <View style={styles.checkBox}>
          <Text style={[styles.checkBoxNameText, props.labelTextStyle]}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
};

CheckBox.defaultProps = {
  modalVisible: false,
  showModal: () => {},
};

CheckBox.propTypes = {
  modalVisible: PropTypes.bool,
  showModal: PropTypes.func,
};

export default CheckBox;
