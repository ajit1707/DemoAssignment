// //////// FIRST AND LAST NAME
import React, {Component} from 'react';
import {
  View,
  Keyboard,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import moment from 'moment';
import {connect} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {NavigationActions, StackActions} from 'react-navigation';
import {AuthTextInput, AuthButton, BackButton, Form} from '../../components';
import Icon from '../../utility/icons';
import {signUp} from '../../modules/signUp';
import {errorHandler} from '../../modules/errorHandler';
import {
  validate,
  checkNullOrWhiteSpaces,
  checkWhiteSpaces,
} from '../../utility/validator';
import styles from './Styles';
import Constant from '../../utility/constant';
import DatePicker from '../../components/DatePicker';
import {signIn} from '../../modules/signIn';
import {setBugsnagMetaData} from '../../utility/bugsnag-utils';
import AgreementModal from './agreementModal';
import {userSignInInfo} from '../../modules/userSignIn';
import truncate from 'truncate-html';
import HTML from 'react-native-render-html';
import {openLink} from '../../utility/helper';

const agreementPayload = [
  {
    agreementName: 'Terms and Conditions',
    key: 'terms',
  },
  {
    agreementName: 'Privacy Notice',
    key: 'policy',
  },
];

class SignUpScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.projectInvitationData
        ? props.projectInvitationData.data.attributes.first_name
        : '',
      lastName: props.projectInvitationData
        ? props.projectInvitationData.data.attributes.last_name
        : '',
      username: props.projectInvitationData
        ? props.projectInvitationData.data.attributes.email
        : '',
      password: '',
      postalCode: '',
      dob: '',
      datePickerVisible: false,
      initialDate: moment().subtract(5, 'year').toDate(),
      modalVisible: false,
    };
  }

  async componentDidUpdate(prevProps) {
    const {
      dispatch,
      signInPayload,
      signUpPayload,
      pushNotificationToken,
      userData,
    } = this.props;
    const {username, password} = this.state;
    if (prevProps.signUpPayload !== signUpPayload) {
      const user = {
        data: {
          type: 'sessions',
          attributes: {
            email_or_phone_number: username,
            password,
            ip_address:
              Platform.OS === 'ios'
                ? DeviceInfo.getUniqueId()
                : await DeviceInfo.getMacAddress(),
            push_token: pushNotificationToken,
            user_agent: Platform.OS,
            project_invitation_id: '',
            project_code_id: '',
            partner_id: '1',
          },
        },
      };
      dispatch(signIn(user));
      const userInfo = {
        user: prevProps.userData.username,
        pass: prevProps.userData.password,
        image: prevProps.userData.image,
        fullName: prevProps.userData.fullName,
        rememberMe: false,
      };
      dispatch(userSignInInfo(userInfo));
    } else if (prevProps.signInPayload !== signInPayload) {
      AsyncStorage.setItem(
        Constant.ASYNC_KEYS.USER_DATA,
        JSON.stringify(signInPayload),
      );
      AsyncStorage.setItem(
        Constant.ASYNC_KEYS.LOGGED_IN,
        JSON.stringify(signInPayload),
      );
      setBugsnagMetaData();
      const resetNavigator = StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: 'SplashScreen',
          }),
        ],
      });
      dispatch(resetNavigator);
    }
  }

  getDate = (date) => {
    this.setState({dob: date});
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  handleTextChange = (field) => (text) => {
    const newState = {};
    if (field === 'password') {
      newState[field] = text.trim();
    } else {
      newState[field] = text;
    }
    this.setState(newState);
  };

  handleButtonDisability = () => {
    const {
      username,
      password,
      firstName,
      lastName,
      postalCode,
      dob,
    } = this.state;
    return (
      checkNullOrWhiteSpaces(firstName) ||
      checkNullOrWhiteSpaces(lastName) ||
      checkNullOrWhiteSpaces(username) ||
      checkNullOrWhiteSpaces(password) ||
      checkNullOrWhiteSpaces(postalCode) ||
      checkNullOrWhiteSpaces(dob)
    );
  };

  showDatePicker = () => {
    const {datePickerVisible} = this.state;
    this.setState({
      datePickerVisible: !datePickerVisible,
    });
  };

  handleLinkPress = (key) => {
    const {
      navigation: {navigate},
    } = this.props;
    let url = Constant.PRIVACY_POLICY_LINK;
    let title = 'Privacy Notice';
    if (key === 'terms') {
      url = Constant.TERMS_AND_CONDITION_LINK;
      title = 'Terms and Condition';
    }
    this.setState({modalVisible: false}, () => {
      navigate('PolicyScreen', {url, title});
    });
  };

  navigateToLogin = () => {
    const {
      navigation: {navigate},
      projectCodeData,
    } = this.props;
    navigate('LoginScreen', {
      projectCode: projectCodeData ? projectCodeData.data.id : '',
    });
  };

  handleSubmit = () => {
    const {
      firstName,
      lastName,
      username,
      password,
      postalCode,
      dob,
    } = this.state;
    const {
      dispatch,
      projectCodeData,
      userData,
      projectInvitationData,
    } = this.props;
    Keyboard.dismiss();
    const validationError =
      validate('username', username.trim()) ||
      validate('password', password) ||
      validate('postalCode', postalCode);
    if (checkWhiteSpaces(username)) {
      dispatch(errorHandler(Constant.INVALID_USERNAME_PHONE_NUMBER));
    } else if (validationError) {
      dispatch(errorHandler(validationError));
    } else {
      const user = {
        data: {
          type: 'users',
          attributes: {
            dob,
            email_or_phone_number: username.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            password,
            postcode: postalCode,
            project_code_id: get(projectCodeData, 'data.id', ''),
            project_invitation_id: get(projectInvitationData, 'data.id', ''),
          },
        },
      };
      dispatch(signUp(user));
      const userInfo = {
        user: userData.username,
        pass: userData.password,
        image: userData.image,
        fullName: userData.fullName,
        rememberMe: false,
      };
      dispatch(userSignInInfo(userInfo));
    }
  };

  onAgreementModalPress = () => {
    const {modalVisible} = this.state;
    this.setState({modalVisible: !modalVisible});
  };

  render() {
    const {
      firstName,
      lastName,
      username,
      password,
      postalCode,
      initialDate,
      datePickerVisible,
      modalVisible,
    } = this.state;
    let privacyCheck = false;
    let privacyText = '';
    const {
      fetching,
      navigation: {navigate},
      projectCodeData,
      projectInvitationData,
    } = this.props;

    if (projectCodeData) {
      const {
        data: {
          attributes: {
            partner_privacy: {privacy_check, privacy_text},
          },
        },
      } = projectCodeData;
      privacyCheck = privacy_check;
      privacyText = privacy_text;
    } else {
      const {
        data: {
          attributes: {
            partner_privacy: {privacy_check, privacy_text},
          },
        },
      } = projectInvitationData;
      privacyCheck = privacy_check;
      privacyText = privacy_text;
    }

    return (
      <Form fetching={fetching}>
        <BackButton goBack={this.goBack} />
        <View style={styles.container}>
          <View style={styles.subContainer}>
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
            <AuthTextInput
              accessibilityLabel={Constant.PLACEHOLDER.FIRST_NAME}
              onChangeText={this.handleTextChange('firstName')}
              placeholder={Constant.PLACEHOLDER.FIRST_NAME}
              value={firstName}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.lastName.focus();
              }}
            />
            <AuthTextInput
              accessibilityLabel={Constant.PLACEHOLDER.LAST_NAME}
              inputRef={(el) => {
                this.lastName = el;
              }}
              onChangeText={this.handleTextChange('lastName')}
              placeholder={Constant.PLACEHOLDER.LAST_NAME}
              value={lastName}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.username.focus();
              }}
            />
            <AuthTextInput
              accessibilityLabel={Constant.PLACEHOLDER.USERNAME}
              inputRef={(el) => {
                this.username = el;
              }}
              onChangeText={this.handleTextChange('username')}
              placeholder={Constant.PLACEHOLDER.USERNAME}
              value={username}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.password.focus();
              }}
            />
            <AuthTextInput
              accessibilityLabel={Constant.PLACEHOLDER.PASSWORD}
              inputRef={(el) => {
                this.password = el;
              }}
              onChangeText={this.handleTextChange('password')}
              placeholder={Constant.PLACEHOLDER.PASSWORD}
              secureTextEntry
              value={password}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.postalcode.focus();
              }}
            />
            <AuthTextInput
              accessibilityLabel={Constant.PLACEHOLDER.POST_CODE}
              inputRef={(el) => {
                this.postalcode = el;
              }}
              onChangeText={this.handleTextChange('postalCode')}
              placeholder={Constant.PLACEHOLDER.POST_CODE}
              value={postalCode}
              returnKeyType="next"
            />
            <DatePicker
              initialDate={initialDate}
              visible={datePickerVisible}
              handleModal={this.showDatePicker}
              placeHolder={Constant.PLACEHOLDER.DOB}
              format="DD/MM/YYYY"
              getDate={(date) => this.getDate(date)}
              maximumDate={initialDate}
            />
            <AuthButton
              accessibilityLabel={`${
                this.handleButtonDisability() ? 'Disabled' : 'Enabled'
              } Create account`}
              accessibilityRole="button"
              disabled={this.handleButtonDisability()}
              onPress={this.handleSubmit}>
              <Text style={styles.authButtonText}>Create account</Text>
            </AuthButton>
          </View>
          <View style={{marginTop: 7}}>
            <TouchableOpacity
              accessibilityRole="link"
              activeOpacity={0.7}
              style={styles.forgotButtonContainer}
              onPress={this.navigateToLogin}>
              <Text style={styles.alreadyAccountText}>
                Already have an account?{' '}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            // onPress={this.onAgreementModalPress}
            disable={privacyCheck ? privacyCheck : false}
            activeOpacity={0.9}
            style={styles.linkContainer}>
            {privacyCheck ? (
              <HTML
                onLinkPress={(event, href) => {
                  return navigate('PolicyScreen', {url: href});
                }}
                baseFontStyle={styles.textStyle}
                html={privacyText
                  .replace(/<\/p>/gim, '</div>')
                  .replace(/(<p)/gim, '<div')}
                textAlign="center"
              />
            ) : (
              <HTML
                onLinkPress={(event, href) => {
                  return navigate('PolicyScreen', {url: href});
                }}
                baseFontStyle={styles.textStyle}
                html={'<p>By clicking &quot;Create account&rdquo; you accept our <a href="https://brightsidementoring.org/terms">Terms and Conditions</a> and agree that we may collect and process your personal information as described in our <a href="https://brightsidementoring.org/privacy">Privacy Notice</a></p>'
                  .replace(/<\/p>/gim, '</div>')
                  .replace(/(<p)/gim, '<div')}
                textAlign="center"
              />
            )}
          </TouchableOpacity>
        </View>
        <AgreementModal
          onAgreementModalPress={this.onAgreementModalPress}
          agreementPayload={agreementPayload}
          modalVisible={modalVisible}
          handleLinkPress={(key) => this.handleLinkPress(key)}
        />
      </Form>
    );
  }
}

SignUpScreen.defaultProps = {
  signUpPayload: null,
  signInPayload: null,
  projectCodeData: null,
  projectInvitationData: null,
  fetching: false,
};

SignUpScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  signInPayload: PropTypes.object,
  signUpPayload: PropTypes.object,
  projectCodeData: PropTypes.object,
  projectInvitationData: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching: state.signUp.fetching,
  signUpPayload: state.signUp.signUpPayload,
  userData: state.userSignInInfoReducer.userData,
  projectCodeData: state.projectCode.projectCodePayload,
  signInPayload: state.signIn.signInPayload,
  projectInvitationData: state.checkProjectToken.projectInvitationData,
  pushNotificationToken: state.pushNotificationReducer.pushNotificationToken,
});

export default connect(mapStateToProps)(SignUpScreen);
