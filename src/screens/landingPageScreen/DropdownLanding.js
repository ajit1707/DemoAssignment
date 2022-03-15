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
import Color from '../../utility/colorConstant';
import {testID, fontMaker} from '../../utility/helper';

export default class DropdownLanding extends Component {
  setHeight = () => {
    const {data} = this.props;
    return data && data.length > 1 ? 100 : -1;
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
          <Text style={[styles.input]}>{rowData.key || rowData}</Text>
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
      // onChangeHandler,
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
            <View style={{alignItems: 'flex-end', paddingLeft: 10}}>
              <Entypo name="chevron-small-up" size={18} color="#000" />
              <Entypo name="chevron-small-down" size={18} color="#000" />
            </View>
          </View>
        </ModalDropdown>
      </View>
    );
  }
}

DropdownLanding.defaultProps = {
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

DropdownLanding.propTypes = {
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
  input: {
    fontSize: 17,
    color: '#000',
    paddingLeft: '5%',
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
  },
  dropDownContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '70%',
    paddingLeft: '10%',
  },
  dropDownView: {
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
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
    width: '35%',
    marginTop: 10,
  },
  defaultText: {
    backgroundColor: 'transparent',
    width: '95%',
    alignSelf: 'center',
    fontSize: 18,
    color: '#000',
  },
  modalDropDownStyle: {
    justifyContent: 'center',
    height: 35,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    width: '70%',
  },
  boldText: {
    color: Color.ACTIVE,
    fontWeight: '800',
  },
  disabledOptionColor: {
    backgroundColor: '#cc0',
  },
});
