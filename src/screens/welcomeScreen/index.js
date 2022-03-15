import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import {userSignInInfo} from '../../modules/userSignIn';
import {signIn} from '../../modules/signIn';
import Icon from '../../utility/icons';
import {logEventForAnalytics} from '../../utility/firebase-utils';
import {setBugsnagMetaData} from '../../utility/bugsnag-utils';
import {Container} from '../../components';
import Style from './style';
import Constant from '../../utility/constant';
import {pushNotificationService} from '../../modules/pushNotification';

class WelcomeScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor() {
    super();
    this.state = {
      fadeAnimation: new Animated.Value(0), // Initial value for opacity: 0
    };
  }
  componentDidMount() {
    const {dispatch, screenProps} = this.props;
    dispatch(pushNotificationService(screenProps));
    Animated.timing(
      // Animate over time
      this.state.fadeAnimation, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 2000, // 2000ms
        useNativeDriver: true,
      },
    ).start(); // Starts the animation
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
  handleSubmit = async () => {
    const {
      userData,
      dispatch,
      pushNotificationToken,
      navigation: {
        state: {params},
      },
    } = this.props;
    const {username, password} = userData;
    const user = {
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
          project_invitation_id: '',
          project_code_id: params ? params.projectCode : '',
          partner_id: '1',
        },
      },
    };
    dispatch(signIn(user));
    const userInfo = {
      username: userData.username,
      password: userData.password,
      image: userData.image,
      fullName: userData.fullName,
      rememberMe: userData.rememberMe,
      back: true,
      pushNotificationToken: userData.pushNotificationToken,
    };
    dispatch(userSignInInfo(userInfo));
  };
  render() {
    const {fadeAnimation} = this.state;
    const {navigation, userData, fetching} = this.props;
    const check_value = !userData.rememberMe;
    return (
      <Container
        barStyle="dark-content"
        style={Style.container}
        fetching={fetching}>
        <View style={Style.subContainer}>
          <View style={Style.contentContainer}>
            <Animated.View
              accessible
              style={{
                opacity: fadeAnimation,
              }}>
              <Image
                accessibilityLabel={
                  Constant.ACCESSIBILITY.BRIGHTSIDE_LOGO.accessibilityLabel
                }
                accessibilityRole={
                  Constant.ACCESSIBILITY.BRIGHTSIDE_LOGO.accessibilityRole
                }
                source={Icon.FOOTER_LOGO}
                style={Style.imageLogo}
              />
            </Animated.View>
            <View>
              <View style={{marginTop: 30}}>
                <Text style={Style.textStyle}>
                  Using this app, volunteer mentors from all professions share
                  their knowledge and experience with young people in order to
                  help them make informed decisions about their future.
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={Style.textStyle}>
                  The app also provides interesting and useful information about
                  university life, careers, money, jobs and much more.
                </Text>
              </View>
            </View>
            {userData.rememberMe && userData.fullName ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.handleSubmit}
                accessible={false}>
                <View style={Style.rememberBox}>
                  <View
                    style={Style.leftImageContainer}
                    accessible
                    accessibilityLabel={`Profile picture of ${userData.fullName}`}
                    accessibilityRole="image">
                    <Image
                      style={Style.profileImage}
                      source={{uri: userData.image}}
                    />
                  </View>
                  <View
                    style={Style.rightContainer}
                    accessible
                    accessibilityLabel={`Login with ${userData.fullName}`}
                    accessibilityRole="button">
                    <Text style={Style.boldTextTitle} numberOfLines={1}>
                      Login with {userData.fullName}{' '}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {userData.rememberMe && userData.fullName ? (
          <View style={{flex: 0.15}}>
            <View style={Style.buttonContainer}>
              <TouchableOpacity
                accessibilityLabel="Sign up"
                accessibilityRole="button"
                activeOpacity={0.7}
                style={[Style.button, Style.signInButton]}
                onPress={() => {
                  navigation.navigate('ProjectCodeScreen');
                }}>
                <Text style={Style.buttonText}>Sign up </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Sign in"
                accessibilityRole="button"
                onPress={() => {
                  navigation.navigate('LoginScreen', {check_value});
                }}
                activeOpacity={0.7}
                style={[Style.button, Style.signUpButton]}>
                <Text style={Style.buttonText}>Switch account </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{flex: 0.15}}>
            <View style={Style.buttonContainer}>
              <TouchableOpacity
                accessibilityLabel="Sign up"
                accessibilityRole="button"
                activeOpacity={0.7}
                style={[Style.button, Style.signInButton]}
                onPress={() => {
                  navigation.navigate('ProjectCodeScreen');
                }}>
                <Text style={Style.buttonText}>Sign up </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Switch account"
                accessibilityRole="button"
                onPress={() => {
                  navigation.navigate('LoginScreen', {});
                }}
                activeOpacity={0.7}
                style={[Style.button, Style.signUpButton]}>
                <Text style={Style.buttonText}>Sign in </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Container>
    );
  }
}

WelcomeScreen.defaultProps = {
  signInPayload: null,
  userData: null,
  fetching: false,
  channelUserPayload: null,
  pushNotificationToken: null,
};

WelcomeScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  signInPayload: PropTypes.object,
  userData: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  channelUserPayload: PropTypes.object,
  pushNotificationToken: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fetching:
    state.signIn.fetching ||
    // state.getProjects.fetching ||
    state.getUserDetail.fetching ||
    state.channelsUser.fetching,
  signInPayload: state.signIn.signInPayload,
  payLoad: state.signIn.payLoad,
  userData: state.userSignInInfoReducer.userData,
  // projectSessionPayload: state.getProjects.projectSessionPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  channelUserPayload: state.channelsUser.channelsUserPayload,
  pushNotificationToken: state.pushNotificationReducer.pushNotificationToken,
});

export default connect(mapStateToProps)(WelcomeScreen);
