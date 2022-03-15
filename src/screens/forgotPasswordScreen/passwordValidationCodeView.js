import React, {Component} from 'react';
import {View, Text, Image, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {AuthTextInput, AuthButton, BackButton, Form} from '../../components';
import Icon from '../../utility/icons';
import {forgotPassword} from '../../modules/forgotPassword';
import {passwordValidationCode} from '../../modules/passwordValidationCode';
import {errorHandler} from '../../modules/errorHandler';
import SignupStyles from '../signupScreen/Styles';
import styles from './Styles';
import Constant from '../../utility/constant';

class PasswordValidationCodeScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super();
    this.state = {
      validationCode: '',
      username: props.navigation.state
        ? props.navigation.state.params.username
        : '',
    };
  }

  componentDidUpdate(prevProps) {
    const {
      navigation: {navigate},
      validationCodePayload,
      dispatch,
    } = this.props;
    if (prevProps.validationCodePayload !== validationCodePayload) {
      if (validationCodePayload.data.length === 0) {
        dispatch(errorHandler(Constant.INVALID_VALIDATION_CODE));
      } else {
        navigate('ResetPasswordScreen');
      }
    }
  }

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text.trim();
    this.setState(newState);
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  resendCode = () => {
    const {username} = this.state;
    const {dispatch} = this.props;
    Keyboard.dismiss();
    const userData = {
      data: {
        type: 'password_resets',
        attributes: {
          email_or_phone_number: username,
        },
      },
    };
    dispatch(forgotPassword(userData));
  };

  handleSubmit = () => {
    const {validationCode} = this.state;
    const {dispatch} = this.props;
    Keyboard.dismiss();
    if (!validationCode) {
      dispatch(errorHandler(Constant.VALIDATION_CODE_ERROR));
    } else {
      dispatch(passwordValidationCode(validationCode));
    }
  };

  render() {
    const {fetching} = this.props;
    const {validationCode} = this.state;
    return (
      <Form fetching={fetching}>
        <BackButton goBack={this.goBack} />
        <View style={styles.screenContainer}>
          <Image
            source={Icon.FOOTER_LOGO}
            style={styles.logoImage}
            accessible
            accessibilityLabel={
              Constant.ACCESSIBILITY.BRIGHTSIDE_LOGO.accessibilityLabel
            }
            accessibilityRole={
              Constant.ACCESSIBILITY.BRIGHTSIDE_LOGO.accessibilityRole
            }
          />
          <View style={styles.linkContainer}>
            <Text style={styles.forgotPasswordText}>
              We’ve sent you a link in an email or a 5 digit code to your
              mobile. Haven’t received anything?
            </Text>
            <Text
              accessibilityRole="link"
              onPress={this.resendCode}
              style={[styles.forgotPasswordText, SignupStyles.link]}>
              Resend Code
            </Text>
          </View>
          <AuthTextInput
            accessibilityLabel={Constant.PLACEHOLDER.VALIDATION_CODE}
            onChangeText={this.handleTextChange('validationCode')}
            placeholder={Constant.PLACEHOLDER.VALIDATION_CODE}
            maxLength={5}
            value={validationCode}
            onSubmitEditing={this.handleSubmit}
          />
          <AuthButton
            accessibilityLabel={`${
              !validationCode ? 'Disabled' : 'Enabled'
            } Send`}
            accessibilityRole="button"
            disabled={!validationCode}
            onPress={this.handleSubmit}>
            <Text style={styles.authButtonText}>Send</Text>
          </AuthButton>
        </View>
      </Form>
    );
  }
}

PasswordValidationCodeScreen.defaultProps = {
  validationCodePayload: null,
};

PasswordValidationCodeScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  validationCodePayload: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching:
    state.passwordValidationCode.fetching || state.forgotPassword.fetching,
  validationCodePayload: state.passwordValidationCode.validationCodePayload,
});

export default connect(mapStateToProps)(PasswordValidationCodeScreen);
