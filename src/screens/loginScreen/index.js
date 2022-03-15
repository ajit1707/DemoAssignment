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
import {get} from 'lodash';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import {NavigationActions, StackActions} from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {pushNotificationService} from '../../modules/pushNotification';
import {AuthTextInput, AuthButton, BackButton, Form} from '../../components';
import Icon from '../../utility/icons';
import {signIn} from '../../modules/signIn';
import {errorHandler} from '../../modules/errorHandler';
import {validate} from '../../utility/validator';
import styles from './Styles';
import Constant from '../../utility/constant';
import {setBugsnagMetaData} from '../../utility/bugsnag-utils';
import {logEventForAnalytics} from '../../utility/firebase-utils';
import {userSignInInfo} from '../../modules/userSignIn';
import checkProjectToken from '../../modules/checkProjectToken';

class LoginScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      check: false,
    };
  }

  componentDidMount() {
    const {dispatch, screenProps} = this.props;
    dispatch(pushNotificationService(screenProps));
    this.resetForm();
  }

  componentDidUpdate(prevProps) {
    const {
      signInPayload,
      channelUserPayload,
      navigation: {dispatch},
    } = this.props;
    if (prevProps.signInPayload !== signInPayload) {
      AsyncStorage.setItem(
        Constant.ASYNC_KEYS.USER_DATA,
        JSON.stringify(signInPayload),
      );
      AsyncStorage.setItem(
        Constant.ASYNC_KEYS.LOGGED_IN,
        JSON.stringify(channelUserPayload),
      );
      logEventForAnalytics('signIn', {});
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

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text.trim();
    this.setState(newState);
  };

  handleForgotPassword = () => {
    const {
      navigation: {navigate},
    } = this.props;
    navigate('ForgotPasswordScreen');
    this.resetForm();
  };

  handleButtonDisability = () => {
    const {username, password} = this.state;
    return !username || !password;
  };

  goBack = () => {
    const {
      navigation: {navigate},
    } = this.props;
    // this.props.navigation.goBack();
    navigate('WelcomeScreen');
  };

  resetForm = () => {
    const {resetPasswordPayload, projectInvitationData} = this.props;
    if (resetPasswordPayload || projectInvitationData) {
      this.setState({
        // username: get(resetPasswordPayload, 'data.attributes.email_or_phone_number') || get(projectInvitationData, 'data.attributes.email')
        username: get(projectInvitationData, 'data.attributes.email'),
      });
    }
  };

  handleSubmit = async () => {
    const {username, password, check} = this.state;
    const {
      dispatch,
      pushNotificationToken,
      navigation: {
        state: {params},
      },
      projectInvitationData,
    } = this.props;
    Keyboard.dismiss();
    const validationError =
      validate('username', username.trim()) || validate('password', password);
    if (validationError) {
      dispatch(errorHandler(validationError));
    } else {
      const userData = {
        data: {
          type: 'sessions',
          attributes: {
            email_or_phone_number: username,
            password,
            push_token: pushNotificationToken,
            ip_address:
              Platform.OS === 'ios'
                ? DeviceInfo.getUniqueId()
                : await DeviceInfo.getMacAddress(),
            user_agent: Platform.OS,
            project_code_id: params ? params.projectCode : '',
            project_invitation_id: get(projectInvitationData, 'data.id', ''),
            partner_id: '1',
          },
        },
      };
      const userInfo = {
        username,
        password,
        rememberMe: check,
        back: true,
      };
      dispatch(userSignInInfo(userInfo));
      dispatch(signIn(userData));
    }
  };

  checkbox = () => {
    const {check} = this.state;
    this.setState({check: !check});
  };

  render() {
    const {username, password, check} = this.state;
    const {fetching} = this.props;
    return (
      <Form fetching={fetching}>
        <BackButton goBack={this.goBack} />
        <View style={styles.container}>
          <View style={styles.loginScreenContainer}>
            <Image
              accessible
              accessibilityLabel={
                Constant.ACCESSIBILITY.BRIGHTSIDE_LOGO.accessibilityLabel
              }
              accessibilityRole={
                Constant.ACCESSIBILITY.BRIGHTSIDE_LOGO.accessibilityRole
              }
              source={Icon.FOOTER_LOGO}
              style={styles.logoImage}
            />
            <AuthTextInput
              accessibilityLabel={Constant.PLACEHOLDER.USERNAME}
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
              returnKeyType="go"
              onChangeText={this.handleTextChange('password')}
              placeholder={Constant.PLACEHOLDER.PASSWORD}
              secureTextEntry
              value={password}
              onSubmitEditing={this.handleSubmit}
            />
            <View
              style={{
                flex: 1,
                marginLeft: -15,
                marginTop: -15,
                flexDirection: 'row',
                marginBottom: 2,
              }}
              accessibilityLabel={` Remember Me checkbox ${
                check ? 'checked' : 'unchecked'
              }`}>
              <TouchableOpacity
                accessible={false}
                activeOpacity={0.6}
                style={styles.itemContainer}
                onPress={this.checkbox}>
                {!check ? (
                  <MaterialCommunityIcons
                    accessible
                    accessibilityLabel="unchecked checkbox"
                    name="checkbox-blank-outline"
                    size={24}
                    color="#000"
                    style={styles.vectorIcons}
                  />
                ) : (
                  <MaterialCommunityIcons
                    accessibilityLabel="checked checkbox"
                    name="checkbox-marked"
                    size={24}
                    color="#00f"
                    style={styles.vectorIcons}
                  />
                )}
                <Text style={styles.nameText}>Remember Me?</Text>
              </TouchableOpacity>
            </View>
            <AuthButton
              accessibilityLabel={`${
                this.handleButtonDisability() ? 'Disabled' : 'Enabled'
              } Sign in`}
              accessibilityRole="button"
              disabled={this.handleButtonDisability()}
              onPress={this.handleSubmit}>
              <Text style={styles.authButtonText}>Sign in</Text>
            </AuthButton>
          </View>
          <View style={{marginTop: 15}}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.forgotButtonContainer}
              onPress={() => this.handleForgotPassword()}>
              <Text style={styles.forgotPasswordText}>
                Forgot your logging details?{' '}
              </Text>
              <Text style={styles.forgotPasswordText2}>
                Get help signing in.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Form>
    );
  }
}

LoginScreen.defaultProps = {
  signInPayload: null,
  userData: null,
  screenProps: null,
  fetching: false,
  channelUserPayload: null,
  projectInvitationData: null,
  pushNotificationToken: null,
  resetPasswordPayload: null,
  invitationData: null,
};

LoginScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  signInPayload: PropTypes.object,
  userData: PropTypes.object,
  screenProps: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  channelUserPayload: PropTypes.object,
  projectInvitationData: PropTypes.object,
  resetPasswordPayload: PropTypes.object,
  invitationData: PropTypes.object,
  pushNotificationToken: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fetching:
    state.signIn.fetching ||
    // state.getProjects.fetching ||
    state.getUserDetail.fetching ||
    state.channelsUser.fetching,
  signInPayload: state.signIn.signInPayload,
  userData: state.userSignInInfoReducer.userData,
  // projectSessionPayload: state.getProjects.projectSessionPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  channelUserPayload: state.channelsUser.channelsUserPayload,
  projectInvitationData: state.checkProjectToken.projectInvitationData,
  pushNotificationToken: state.pushNotificationReducer.pushNotificationToken,
  resetPasswordPayload: state.resetPassword.resetPasswordPayload,
});

export default connect(mapStateToProps)(LoginScreen);
