import React from 'react';
import PropTypes from 'prop-types';
import {IconButton} from '../../components';
import Constant from '../../utility/constant';
import DatePicker from '../../components/DatePicker';

const ProfileForm = (props) => {
  const {
    handleTextChange,
    getDate,
    state: {
      firstName,
      lastName,
      email,
      phoneNumber,
      postalCode,
      dob,
      initialDate,
      datePickerVisible,
    },
  } = props;

  let {lastNameRef, emailRef, phoneNumberRef, postCodeRef} = React.createRef();
  return (
    <React.Fragment>
      <IconButton
        placeholder={Constant.PLACEHOLDER.FIRST_NAME}
        iconAccessibilityLabel={`${Constant.PLACEHOLDER.FIRST_NAME} icon`}
        accessibilityLabel={Constant.PLACEHOLDER.FIRST_NAME}
        icon="user-o"
        iconSize={22}
        onChangeText={handleTextChange('firstName')}
        value={firstName}
        returnKeyType="next"
        onSubmitEditing={() => {
          lastNameRef.focus();
        }}
      />
      <IconButton
        ref={(el) => {
          lastNameRef = el;
        }}
        iconAccessibilityLabel={`${Constant.PLACEHOLDER.LAST_NAME} icon`}
        placeholder={Constant.PLACEHOLDER.LAST_NAME}
        accessibilityLabel={Constant.PLACEHOLDER.LAST_NAME}
        icon="user-o"
        iconSize={22}
        onChangeText={handleTextChange('lastName')}
        value={lastName}
        returnKeyType="next"
        onSubmitEditing={() => {
          emailRef.focus();
        }}
      />
      <IconButton
        ref={(el) => {
          emailRef = el;
        }}
        iconAccessibilityLabel="Email icon"
        placeholder="Email"
        accessibilityLabel="Email"
        icon="envelope-o"
        onChangeText={handleTextChange('email')}
        returnKeyType="next"
        iconSize={22}
        value={email}
        onSubmitEditing={() => {
          phoneNumberRef.focus();
        }}
        keyboardType="email-address"
      />
      <IconButton
        ref={(el) => {
          phoneNumberRef = el;
        }}
        iconAccessibilityLabel="Phone number icon"
        placeholder="Phone number"
        accessibilityLabel="Phone number"
        icon="mobile-phone"
        returnKeyType="next"
        keyboardType="phone-pad"
        iconSize={30}
        onChangeText={handleTextChange('phoneNumber')}
        value={phoneNumber}
        onSubmitEditing={() => {
          postCodeRef.focus();
        }}
      />
      <IconButton
        ref={(el) => {
          postCodeRef = el;
        }}
        iconAccessibilityLabel={`${Constant.PLACEHOLDER.POST_CODE} icon`}
        placeholder={Constant.PLACEHOLDER.POST_CODE}
        accessibilityLabel={Constant.PLACEHOLDER.POST_CODE}
        icon="map-marker"
        returnKeyType="done"
        onChangeText={handleTextChange('postalCode')}
        iconSize={25}
        value={postalCode}
      />
      <DatePicker
        icon="calendar-o"
        iconAccessibilityLabel="Date of birth icon"
        iconSize={22}
        iconDatePicker
        initialDate={initialDate}
        visible={datePickerVisible}
        format="DD/MM/YYYY"
        getDate={(date) => getDate(date)}
        placeHolder={dob}
        maximumDate={initialDate}
      />
    </React.Fragment>
  );
};

ProfileForm.defaultProps = {};

ProfileForm.propTypes = {
  handleTextChange: PropTypes.func.isRequired,
  getDate: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};

export default ProfileForm;
