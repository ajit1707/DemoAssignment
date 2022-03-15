import React, {Component} from 'react';
import {View, Text, Image, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {AuthTextInput, AuthButton, BackButton, Form} from '../../components';
import Icon from '../../utility/icons';
import {forgotPassword} from '../../modules/forgotPassword';
import {errorHandler} from '../../modules/errorHandler';
import styles from './Styles';
import Constant from '../../utility/constant';
import {validate} from '../../utility/validator';
import Toast from 'react-native-simple-toast';
// import {logEventForAnalytics} from "../../utility/firebase-utils";

class ForgotPasswordScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor() {
    super();
    this.state = {
      username: '',
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    if (
      navigation &&
      navigation.hasOwnProperty('state') &&
      navigation.state.hasOwnProperty('params') &&
      navigation.state.params !== undefined
    ) {
      if (
        navigation.state.params.hasOwnProperty('showToastMessage') &&
        navigation.state.params.showToastMessage === true
      ) {
        Toast.showWithGravity(
          Constant.PASSWORD_RESET_LINK_MESSAGE,
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    }
  }
  componentDidUpdate(prevProps) {
    const {forgotPasswordPayload} = this.props;
    if (prevProps.forgotPasswordPayload !== forgotPasswordPayload) {
      this.navigateToScreen();
      // logEventForAnalytics('forgetPassword',{})
    }
  }

  navigateToScreen = () => {
    const {
      navigation: {navigate},
    } = this.props;
    const {username} = this.state;
    let route = 'PasswordValidationCodeScreen';
    if (!validate('email', username.trim())) {
      route = 'LoginScreen';
    }
    navigate(route, {username});
    this.resetForm();
  };

  resetForm = () => {
    this.setState({username: ''});
  };

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text.trim();
    this.setState(newState);
  };

  handleButtonDisability = () => {
    const {username} = this.state;
    return !username;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  handleSubmit = () => {
    const {username} = this.state;
    const {dispatch} = this.props;
    Keyboard.dismiss();
    const validationError = validate('username', username.trim());
    if (validationError) {
      dispatch(errorHandler(validationError));
    } else {
      const userData = {
        data: {
          type: 'password_resets',
          attributes: {
            email_or_phone_number: username,
          },
        },
      };
      dispatch(forgotPassword(userData));
    }
  };

  render() {
    const {fetching} = this.props;
    const {username} = this.state;
    return (
      <Form fetching={fetching}>
        <BackButton goBack={this.goBack} />
        <View style={styles.container}>
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
                Forgotten your password? Enter the email address or mobile
                number you used to register your account and we will send you a
                password reset link.
              </Text>
            </View>
            <AuthTextInput
              accessibilityLabel={Constant.PLACEHOLDER.USERNAME}
              onChangeText={this.handleTextChange('username')}
              placeholder={Constant.PLACEHOLDER.USERNAME}
              value={username}
              returnKeyType="go"
              onSubmitEditing={this.handleSubmit}
            />
            <AuthButton
              accessibilityLabel={`${
                this.handleButtonDisability() ? 'Disabled' : 'Enabled'
              } Send`}
              accessibilityRole="button"
              disabled={this.handleButtonDisability()}
              onPress={this.handleSubmit}>
              <Text style={styles.authButtonText}>Send</Text>
            </AuthButton>
          </View>
        </View>
      </Form>
    );
  }
}

ForgotPasswordScreen.defaultProps = {
  forgotPasswordPayload: null,
};

ForgotPasswordScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  forgotPasswordPayload: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching: state.forgotPassword.fetching,
  forgotPasswordPayload: state.forgotPassword.forgotPasswordPayload,
});

export default connect(mapStateToProps)(ForgotPasswordScreen);
