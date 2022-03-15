import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import ModalDropdown from 'react-native-modal-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import Color from '../utility/colorConstant';
import {testID, fontMaker} from '../utility/helper';

export default class Dropdown extends Component {
  setHeight = () => {
    const {data} = this.props;
    return data && data.length > 4 ? (33 + StyleSheet.hairlineWidth) * 5 : -1;
  };
  renderDropdownRow = (rowData, index) => {
    const {accessibilityId} = this.props;
    return (
      <TouchableHighlight
        accessible={false}
        {...testID(
          accessibilityId
            ? `${accessibilityId}_${index}`
            : rowData.key || rowData,
        )}
        underlayColor="transparent">
        <View style={[styles.dropDownView]}>
          <Text style={[styles.input]} accessible>
            {rowData.key || rowData}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const {
      defaultValue,
      isDisabled,
      data,
      dropDownStyle,
      onChangeHandler,
      accessibilityId,
    } = this.props;
    return (
      <View accessible={false}>
        <ModalDropdown
          accessible={false}
          {...testID(accessibilityId)}
          style={[styles.modalDropDownStyle]}
          disabled={isDisabled}
          defaultValue={defaultValue}
          renderRow={(option, index) => this.renderDropdownRow(option, index)}
          dropdownTextStyle={styles.input}
          dropdownStyle={[
            styles.dropDownStyle,
            dropDownStyle,
            {height: this.setHeight()},
          ]}
          options={data}
          onSelect={onChangeHandler}>
          <View accessible style={styles.dropDownContainer}>
            <Text style={styles.defaultText}>{defaultValue}</Text>
            <View style={styles.iconStyleView}>
              <Entypo name="chevron-small-down" size={24} color="#ccc" />
            </View>
          </View>
        </ModalDropdown>
      </View>
    );
  }
}

Dropdown.defaultProps = {
  dropView: null,
  imageStyle: null,
  textStyle: null,
  dropDownStyle: null,
  style: null,
  data: null,
  isDisabled: false,
  accessibilityId: null,
  hightlightedOptionIndex: null,
  wrapperMode: true,
};

Dropdown.propTypes = {
  dropView: ViewPropTypes.style,
  style: ViewPropTypes.style,
  imageStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  dropDownStyle: ViewPropTypes.style,
  onChangeHandler: PropTypes.func.isRequired,
  data: PropTypes.array,
  isDisabled: PropTypes.bool,
  defaultValue: PropTypes.string.isRequired,
  accessibilityId: PropTypes.string,
  hightlightedOptionIndex: PropTypes.number,
  wrapperMode: PropTypes.bool,
};

const styles = StyleSheet.create({
  inputBox: {
    height: 50,
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.10196078431372549)',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
  },
  iconStyleView: {
    marginTop: 10,
    marginRight: 5,
  },
  input: {
    fontSize: 14,
    color: '#000',
    paddingLeft: '5%',
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
  },
  formTextInputStyle: {
    color: '#444',
    fontSize: 12,
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    alignSelf: 'flex-start',
  },
  iconStyle: {
    width: 18,
    height: 22,
    marginLeft: 13,
    marginRight: 16,
  },
  dropDownContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '5%',
  },
  dropDownView: {
    paddingVertical: 13,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dropDownTitle: {
    fontSize: 15,
    paddingTop: 7,
    paddingBottom: 7,
  },
  dropDownImageIconStyle: {
    width: 16,
    height: 9,
    marginRight: '2%',
  },
  dropDownStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    marginTop: 10,
  },
  defaultText: {
    backgroundColor: 'transparent',
    width: '95%',
    alignSelf: 'center',
    fontSize: 18,
  },
  modalDropDownStyle: {
    justifyContent: 'center',
    height: 50,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderColor: '#E5E5E5',
    width: '100%',
  },
  boldText: {
    color: Color.ACTIVE,
    fontWeight: '800',
  },
  disabledOptionColor: {
    backgroundColor: '#cc0',
  },
});
