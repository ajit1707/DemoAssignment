import React, {Component} from 'react';
import {BackHandler, AppState} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import EventEmitter from 'events';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import firebase from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Root} from './Root';
import {checkNetwork} from '../modules/checkNetwork';
import {authorization} from '../modules/authorization';
import {setSideMenuItems} from '../modules/getProjects';
import Color from '../utility/colorConstant';
import {
  resetSelectedChannelItemIndex,
  channelDeselected,
  displayChannelItems,
} from '../modules/displayChannelItems';
import {clearChannelMessages} from '../modules/channelMessage';
import {socketLeaveChannel} from '../utility/phoenix-utils';
import {errorHandler} from '../modules/errorHandler';
import {postOfflineMessage} from '../modules/postOfflineMessages';
import Constant from '../utility/constant';
import {getChannelsName} from '../modules/channelsUser';
import {userSign} from '../modules/userSignIn';
import {handleDynamicLinks} from '../utility/helper';
import {mentorData, chosseYourMentorData} from '../modules/chosseAsMentor';
import Toast from 'react-native-simple-toast';
import {pushNotificationService} from '../modules/pushNotification';

let dataFlag = false;

const landingPageRouteIndex = 7;

let unsubscribe = () => {};

class AppNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      link: '',
    };
    this.emitter = new EventEmitter();
  }

  componentDidMount() {
    const {dispatch} = this.props;
    console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    AppState.addEventListener('change', this.handleAppStateChange);
    NetInfo.fetch().then((state) => {
      this.handleConnectivityChange(state === undefined ? true : state);
    });
    this.netinfoUnsubscribe = NetInfo.addEventListener(
      this.handleConnectivityChange,
    );
    unsubscribe = dynamicLinks().onLink((url) => this.handleURL(url));
    if (unsubscribe.length === 0) {
      dynamicLinks()
        .getInitialLink()
        .then((url) => this.handleURL(url));
    }
    dispatch(authorization());
    SplashScreen.hide();
  }

  componentWillUnmount() {
    if (this.netinfoUnsubscribe) {
      this.netinfoUnsubscribe();
      this.netinfoUnsubscribe = null;
    }
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    this.emitter.removeAllListeners();
    AppState.removeEventListener('change', this.handleAppStateChange);
    // unsubscribe();
  }

  /**
   * Method calls on android hardware back press.
   * Dispatched to previous screen if available.
   */
  onBackPress = () => {
    const {
      dispatch,
      nav,
      fetching,
      userData,
      backPress,
      chooseYourMentor,
      chooseAsMentor,
      screenProps,
      projectSessionPayload,
      selectedProjectPayload,
      userDetailPayload,
    } = this.props;
    if (!fetching) {
      if (
        nav.key === 'StackRouterRoot' &&
        nav.routes.length === 1 &&
        nav.routes[0].routes &&
        nav.routes[0].index === 3
      ) {
        const route = nav.routes[0].routes.find(
          (item) => item.key === 'Message',
        );
        if (route && !backPress) {
          this.channelUpdateBackPress();
        }
        return true;
      } else if (
        nav.key === 'StackRouterRoot' &&
        nav.routes.length === 1 &&
        nav.routes[0].routes &&
        nav.routes[0].index === 6
      ) {
        const route = nav.routes[0].routes.find(
          (item) => item.key === 'Message',
        );
        if (route && !nav.isTransitioning) {
          this.channelUpdateBackPress();
        }
        dispatch(channelDeselected());
        if (
          ((projectSessionPayload &&
            projectSessionPayload.data[0].attributes.typeform_enabled) ||
            (selectedProjectPayload &&
              selectedProjectPayload.data.attributes.typeform_enabled)) &&
          ((projectSessionPayload &&
            projectSessionPayload.data[0].attributes.matching_enabled ===
              false) ||
            (selectedProjectPayload &&
              selectedProjectPayload.data.attributes.matching_enabled ===
                false)) &&
          userDetailPayload.data[0].attributes.state === 'unmatched' &&
          userDetailPayload.included[1].attributes.name === 'mentee' &&
          this.props.userDetailPayload.data[0].attributes.survey_state !==
            'unstarted' &&
          this.props.userDetailPayload.data[0].attributes['has_survey?']
        ) {
          // Toast.showWithGravity(Constant.MENTOR_TOP_UP, Toast.LONG, Toast.BOTTOM);
          return true;
        } else if (
          (nav.key === 'StackRouterRoot' &&
            nav.routes.length === 1 &&
            nav.routes[0].routes &&
            nav.routes[0].index !== landingPageRouteIndex) ||
          (nav.key === 'StackRouterRoot' &&
            nav.routes[1] &&
            nav.routes[1].routeName === 'AskTheGuruScreen' &&
            !nav.routes[2])
        ) {
          const route = nav.routes[0].routes.find(
            (item) => item.key === 'Message',
          );
          if (route) {
            this.channelUpdateBackPress();
          }
        } else if (
          nav.routes &&
          nav.routes[nav.routes.length - 1].routeName === 'ProfileScreen'
        ) {
          dispatch(
            NavigationActions.navigate({
              routeName: 'LandingPage',
            }),
          );
          dispatch(userSign());
          this.emitter.emit('updateLandingPage');
        } else if (nav.index === 0) {
          dispatch(pushNotificationService(screenProps));
          return userData.back === true;
        }
        // else if (nav && (nav.routes[0].routeName === 'LoginScreen' || nav.routes[1].routeName === 'LoginScreen' || (nav && nav.routes[2].routeName === 'LoginScreen') || nav.routes[3].routeName === 'LoginScreen'
        //     || nav.routes[4].routeName === 'LoginScreen' || nav.routes[5].routeName === 'LoginScreen' || nav.routes[6].routeName === 'LoginScreen' || nav.routes[7].routeName === 'LoginScreen'
        //     || nav.routes[8].routeName === 'LoginScreen')) {
        //     dispatch(NavigationActions.navigate({
        //         routeName: 'WelcomeScreen'
        //     }));
        // }
        dispatch(errorHandler());
        if (chooseAsMentor === true && chooseAsMentor !== undefined) {
          const flag = false;
          dispatch(chosseYourMentorData(flag));
          dispatch(NavigationActions.back());
          return true;
        } else if (
          chooseYourMentor === true &&
          chooseYourMentor !== undefined
        ) {
          const flag = false;
          dispatch(mentorData(flag));
          dispatch(
            NavigationActions.navigate({
              routeName: 'LandingPage',
            }),
          );
          return true;
        }
        dispatch(NavigationActions.back());
        return true;
      }
      dispatch(errorHandler());
      return true;
    }
  };

  handleURL = (url) => {
    if (url) {
      AsyncStorage.getItem(Constant.ASYNC_KEYS.LOGGED_IN, (error, result) => {
        handleDynamicLinks(url.url, this.props, result);
      });
    }
  };

  channelUpdateBackPress = () => {
    const {
      dispatch,
      networkState: {isConnected},
      projectSessionPayload,
      selectedProjectPayload,
      userDetailPayload,
    } = this.props;
    this.emitter.emit('updateLandingPage');
    this.emitter.emit('setSideMenuItemIndex', 0);
    dispatch(resetSelectedChannelItemIndex());
    if (isConnected) {
      dispatch(clearChannelMessages());
    }
    dispatch(channelDeselected());
    if (
      ((projectSessionPayload &&
        projectSessionPayload.data[0].attributes.typeform_enabled) ||
        (selectedProjectPayload &&
          selectedProjectPayload.data.attributes.typeform_enabled)) &&
      ((projectSessionPayload &&
        projectSessionPayload.data[0].attributes.matching_enabled === false) ||
        (selectedProjectPayload &&
          selectedProjectPayload.data.attributes.matching_enabled === false)) &&
      userDetailPayload.data[0].attributes.state === 'unmatched' &&
      userDetailPayload.included[1].attributes.name === 'mentee' &&
      this.props.userDetailPayload.data[0].attributes.survey_state !==
        'unstarted' &&
      this.props.userDetailPayload.data[0].attributes['has_survey?']
    ) {
      Toast.showWithGravity(
        'Mentor Matching Tool - needs a top-up!\n' +
          "All the mentors on this project have already been snapped up! We'll allocate more amazing mentors very soon and notify you when you can try again!",
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    socketLeaveChannel();
    dispatch(NavigationActions.navigate({routeName: 'LandingPage'}));
    dispatch(userSign());
  };

  handleAppStateChange = () => {
    const {loggedInPayload, nav, dispatch} = this.props;
    if (!this.state.appState.match(/inactive|background/)) {
      if (
        loggedInPayload &&
        nav.key === 'StackRouterRoot' &&
        nav.routes.length === 1 &&
        nav.routes[0].routes &&
        nav.routes[0].index === landingPageRouteIndex
      ) {
        this.emitter.emit('updateLandingPage');
        dispatch(clearChannelMessages());
        dispatch(channelDeselected());
      }
    }
  };

  /**
   * Method to check network connectivity.
   * @param state
   */
  handleConnectivityChange = (state) => {
    const {
      dispatch,
      offlineStoredMessages,
      projects,
      fetching,
      channelUserPayload,
    } = this.props;
    if (state.isConnected && !dataFlag) {
      dataFlag = true;
      let projectId;
      if (offlineStoredMessages && offlineStoredMessages.length) {
        AsyncStorage.getItem(
          Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
          (error, response) => {
            if (response) {
              projectId = JSON.parse(response).id;
            } else {
              projectId = projects.data[0].id;
            }
            const groupBy = _(offlineStoredMessages)
              .groupBy((item) => item.channel_id)
              .map((value, key) => ({
                channel_id: parseInt(key, 10),
                channel_messages: value,
              }))
              .value();
            if (
              offlineStoredMessages &&
              offlineStoredMessages.length &&
              !fetching
            ) {
              const messageObj = {
                data: {
                  type: 'offine_messages',
                  attributes: {
                    project_id: parseInt(projectId, 10),
                    messages: groupBy,
                  },
                },
              };
              dispatch(postOfflineMessage(messageObj));
            }
          },
        );
      }
    } else if (!state.isConnected) {
      dataFlag = false;
    }
    dispatch(displayChannelItems(channelUserPayload));
    dispatch(checkNetwork(state));
  };

  render() {
    const {sideMenuItems, fetching} = this.props;
    return (
      <Root
        screenProps={{
          emitter: this.emitter,
          sideMenuColor: sideMenuItems
            ? sideMenuItems.sideMenuColor
            : Color.LOGO,
          fetching,
        }}
      />
    );
  }
}

AppNavigator.defaultProps = {
  sideMenuItems: null,
  loggedInPayload: null,
  fetching: false,
  backPress: false,
};

AppNavigator.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
  sideMenuItems: PropTypes.object,
  loggedInPayload: PropTypes.string,
  networkState: PropTypes.object.isRequired,
  fetching: PropTypes.bool,
  backPress: PropTypes.bool,
  offlineStoredMessages: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  nav: state.nav,
  sideMenuItems: setSideMenuItems(state),
  channelUserPayload: getChannelsName(state),
  loggedInPayload: state.authorization.loggedInPayload,
  fetching:
    state.profile.fetching ||
    state.uploadAttachments.fetching ||
    state.postOfflineMessage.fetching,
  networkState: state.checkNetwork.isConnected,
  offlineStoredMessages: state.offlineMessageToSend.offlineStoredMessages,
  projects: state.getProjects.projectSessionPayload,
  channelItems: state.displayChannelItemsReducer.channelItems,
  userData: state.userSignInInfoReducer.userData,
  backPress: state.getAssignmentDataReducer.backPress,
  chooseYourMentor: state.menteeMentorReducer.chooseYourMentor,
  chooseAsMentor: state.menteeMentorReducer.chooseAsMentor,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
});

export default connect(mapStateToProps)(AppNavigator);
