import React, {Component} from 'react';
import {NavigationActions, StackActions} from 'react-navigation';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {updatePreservedMessageText} from '../modules/preserveMessageText';
import {get} from 'lodash';
//import firebase from 'react-native-firebase';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {Container} from '../components';
import {getProjects} from '../modules/getProjects';
import {getUserDetails} from '../modules/getUserDetail';
import {getSelectedProject} from '../modules/getSelectedProject';
import {channelsUser, getChannelsName} from '../modules/channelsUser';
import {displayChannelItems} from '../modules/displayChannelItems';
import NoInternetConnection from './NoInternetConnection';
import Constant from '../utility/constant';
import {openLink, handleDynamicLinks, resetNavigation} from '../utility/helper';
import {appUpdateCheck} from '../modules/appUpdate';
import Alert from '../components/Alert';
import {setBugsnagMetaData} from '../utility/bugsnag-utils';

class SplashScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });
  constructor() {
    super();
    this.state = {
      alertVisible: false,
      alertRoute: null,
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    this.appUpdateCheck();
    // Analytics.logEvent('articleHits', { article: 'Data' });
  }

  getProjectData = async () => {
    const {dispatch} = this.props;
    const projectSwitcherSelectedData = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
      () => {},
    );
    const parsedProjectData = JSON.parse(projectSwitcherSelectedData);
    if (parsedProjectData) {
      dispatch(getSelectedProject()).then(() => {
        this.getChannelsPayload();
      });
    } else {
      dispatch(getProjects()).then(() => {
        this.getChannelsPayload();
      });
    }
  };

  getChannelsPayload = () => {
    const {
      navigation: {dispatch},
    } = this.props;
    dispatch(getUserDetails()).then(() => {
      dispatch(channelsUser()).then(() => {
        const {channelUserPayload} = this.props;
        dispatch(updatePreservedMessageText());
        dispatch(displayChannelItems(channelUserPayload)).then(() => {
          const resetNavigator = StackActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: 'DrawerNavigator',
              }),
            ],
          });
          setBugsnagMetaData();
          dispatch(resetNavigator);
          resetNavigation('DrawerNavigator', this.props);
        });
      });
    });
  };

  alertHandleSubmit = () => {
    const {dispatch, appUpdatePayload} = this.props;
    if (
      appUpdatePayload &&
      appUpdatePayload.android_store_link &&
      appUpdatePayload.android_store_link.includes('play.google.com') &&
      appUpdatePayload.ios_store_link &&
      appUpdatePayload.ios_store_link.includes('apps.apple.com')
    ) {
      const storeUrl =
        Platform.OS === 'android'
          ? appUpdatePayload.android_store_link
          : appUpdatePayload.ios_store_link;
      openLink(storeUrl, dispatch);
    }
  };

  alertHandleDismiss = () => {
    const {isLoggedIn} = this.state;
    this.setState(
      {
        alertVisible: false,
      },
      () => {
        setTimeout(() => {
          if (isLoggedIn) {
            this.getProjectData();
          } else {
            resetNavigation('WelcomeScreen', this.props);
          }
        }, 100);
      },
    );
  };

  appUpdateCheck = async () => {
    const {
      dispatch,
      isConnected: {isConnected},
      logoutData,
      disableDeepLink,
    } = this.props;
    if (isConnected) {
      AsyncStorage.getItem(Constant.ASYNC_KEYS.LOGGED_IN, (error, result) => {
        dispatch(appUpdateCheck()).then((res) => {
          const appVersion = DeviceInfo.getVersion().toString();
          const apiAppVersion =
            Platform.OS === 'android' ? res.android_version : res.ios_version;
          const isForceUpdate =
            Platform.OS === 'android'
              ? res.is_android_force_update
              : res.is_ios_force_update;
          if (apiAppVersion.toString() > appVersion) {
            let alertRoute = null;
            if (!isForceUpdate) {
              alertRoute = 'splashScreen';
            }
            this.setState({
              alertVisible: true,
              alertRoute,
              isLoggedIn: result,
            });
          } else {
            this.setState({
              alertVisible: false,
            });
            dynamicLinks()
              .getInitialLink()
              .then((url) => {
                if (url && !logoutData && !disableDeepLink) {
                  handleDynamicLinks(
                    url,
                    this.props,
                    result,
                    this.getProjectData,
                  );
                } else if (result) {
                  this.getProjectData();
                } else {
                  const route = get(logoutData, 'screen', 'WelcomeScreen');
                  resetNavigation(route, this.props);
                }
              });
          }
        });
      });
    } else {
      this.getProjectData();
    }
  };

  render() {
    const {
      fetching,
      error,
      loggedInPayload,
      isConnected: {isConnected},
    } = this.props;
    const {alertVisible, alertRoute} = this.state;
    return (
      <React.Fragment>
        {(!fetching && error === Constant.NETWORK_ERROR) ||
        (!fetching && loggedInPayload === null && !isConnected) ? (
          <NoInternetConnection handleSubmit={this.appUpdateCheck} />
        ) : (
          <Container fetching={fetching} />
        )}
        <Alert
          handleDismiss={this.alertHandleDismiss}
          handleSubmit={this.alertHandleSubmit}
          route={alertRoute}
          alertTitle="App Update"
          firstButtonText="Update"
          secondButtonText="Continue"
          content={Constant.APP_UPDATE_MESSAGE}
          isVisible={alertVisible}
        />
      </React.Fragment>
    );
  }
}

SplashScreen.defaultProps = {
  projectSessionPayload: null,
  selectedProjectPayload: null,
  userDetailPayload: null,
  channelUserPayload: null,
  appUpdatePayload: null,
  isConnected: null,
  fetching: false,
  error: '',
  logoutData: null,
};

SplashScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  projectSessionPayload: PropTypes.object,
  selectedProjectPayload: PropTypes.object,
  userDetailPayload: PropTypes.object,
  channelUserPayload: PropTypes.array,
  appUpdatePayload: PropTypes.object,
  isConnected: PropTypes.object,
  logoutData: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  disableDeepLink: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fetching:
    state.getProjects.fetching ||
    state.getUserDetail.fetching ||
    state.channelsUser.fetching ||
    state.appUpdate.fetching,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  appUpdatePayload: state.appUpdate.appUpdatePayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  channelUserPayload: getChannelsName(state),
  channelItems: state.displayChannelItemsReducer.channelItems,
  error:
    state.getProjects.error ||
    state.getUserDetail.error ||
    state.channelsUser.error ||
    state.getSelectedProjectReducer.error,
  isConnected: state.checkNetwork.isConnected,
  loggedInPayload: state.authorization.loggedInPayload,
  logoutData: state.logOut.logoutData,
  disableDeepLink: state.deepLinkHandler.disableDeepLink,
});

export default connect(mapStateToProps)(SplashScreen);
