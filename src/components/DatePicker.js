import React, {Component} from 'react';
import {
  DatePickerAndroid,
  Modal,
  View,
  Text,
  TouchableOpacity,
  DatePickerIOS,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import Color from '../utility/colorConstant';
import Constant from '../utility/constant';
import {fontMaker} from '../utility/helper';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerVisible: false,
      currentDate: '',
      dateText: '',
      placeHolder: props.icon,
      maximumDate: moment('12/31/2014').toDate(),
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.placeHolder && !nextProps.placeHolder) {
      return {
        dateText: '',
        currentDate: '',
      };
    }

    if (prevState.placeHolder && nextProps.placeHolder && !prevState.dateText) {
      return {
        dateText: nextProps.placeHolder,
        currentDate: '',
      };
    }

    return null;
  }

  setDate = (newDate) => {
    this.setState({currentDate: newDate});
  };

  openAndroidDatePicker = async () => {
    const {initialDate, getDate, format} = this.props;
    const {currentDate, maximumDate} = this.state;
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: currentDate || initialDate,
        maxDate: maximumDate,
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const selectedDate = new Date(year, month, day);
        this.setState(
          {
            currentDate: selectedDate,
            dateText: selectedDate,
          },
          () => {
            getDate(this.formatDate(this.state.dateText, format));
          },
        );
      }
    } catch ({code, message}) {
      // Error Handling
    }
  };

  handleModal = () => {
    const {pickerVisible} = this.state;
    this.setState({pickerVisible: !pickerVisible});
  };

  handleDone = () => {
    const {getDate, format} = this.props;
    const {pickerVisible, currentDate} = this.state;
    this.setState(
      {
        pickerVisible: !pickerVisible,
        dateText: !currentDate ? new Date() : currentDate,
      },
      () => {
        getDate(this.formatDate(this.state.dateText, format));
      },
    );
  };

  formatDate = (date, format) => moment(date).format(format);

  render() {
    const {pickerVisible, currentDate, dateText, maximumDate} = this.state;
    const {
      initialDate,
      format,
      iconDatePicker,
      icon,
      iconSize,
      iconAccessibilityLabel,
    } = this.props;
    const date = dateText
      ? this.formatDate(dateText, format)
      : Constant.PLACEHOLDER.DOB;
    return (
      <React.Fragment>
        {iconDatePicker ? (
          <View style={styles.iconDatePickerContainer}>
            <FontAwesome
              accessibilityLabel={iconAccessibilityLabel}
              name={icon}
              size={iconSize}
              color="#ccc"
            />
            <TouchableOpacity
              style={styles.iconDatePickerButtonContainer}
              activeOpacity={0.8}
              onPress={
                Platform.OS === 'android'
                  ? this.openAndroidDatePicker
                  : this.handleModal
              }>
              <Text
                accessibilityLabel={`Date of birth ${date} `}
                style={[styles.iconDatePickerText]}
                includeFontPadding>
                {date}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={
              Platform.OS === 'android'
                ? this.openAndroidDatePicker
                : this.handleModal
            }
            style={styles.button}>
            <Text
              style={[
                styles.placeholderText,
                dateText && styles.dateText,
                Platform.OS === 'android'
                  ? dateText
                    ? styles.dateTextOpacity
                    : styles.dateTextOpacityNew
                  : null,
              ]}
              includeFontPadding={false}>
              {date}
            </Text>
          </TouchableOpacity>
        )}
        <Modal
          animationType="slide"
          transparent
          visible={pickerVisible}
          onRequestClose={() => {}}>
          <View style={[styles.overlay]}>
            <View style={[styles.modal]}>
              <View style={[styles.modalBtnContainer]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={this.handleModal}>
                  <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={this.handleDone}>
                  <Text style={styles.optionText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DatePickerIOS
                mode="date"
                date={currentDate || initialDate}
                onDateChange={this.setDate}
                {...this.props}
                maximumDate={maximumDate}
              />
            </View>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

DatePicker.defaultProps = {
  iconDatePicker: false,
  icon: '',
  iconSize: 0,
  maximumDate: '',
  placeHolder: '',
  iconAccessibilityLabel: '',
};

DatePicker.propTypes = {
  initialDate: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  getDate: PropTypes.func.isRequired,
  format: PropTypes.string.isRequired,
  iconDatePicker: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  maximumDate: PropTypes.object,
  placeHolder: PropTypes.string,
  iconAccessibilityLabel: PropTypes.string,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dateTextOpacity: {
    opacity: 0.9,
  },
  dateTextOpacityNew: {
    opacity: 0.6,
  },
  dateText: {
    color: '#000',
    fontWeight: '400',
  },
  modal: {
    backgroundColor: '#fff',
    height: 260,
    width: '100%',
  },
  modalBtnContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  optionText: {
    color: Color.LOGO,
    fontSize: 16,
    ...fontMaker('regular'),
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 15,
    marginBottom: deviceHeight * 0.03,
    width: deviceWidth * 0.8,
    height: 50,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: Color.PLACEHOLDER,
    ...fontMaker('regular'),
  },
  iconDatePickerText: {
    color: '#000',
    fontSize: 14,
    ...fontMaker('regular'),
  },
  iconDatePickerContainer: {
    marginTop: 10,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconDatePickerButtonContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: deviceWidth * 0.8,
    paddingLeft: 13,
  },
});

export default DatePicker;
