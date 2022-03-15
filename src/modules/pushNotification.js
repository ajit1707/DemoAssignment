import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {NavigationActions} from 'react-navigation';
import Config from '../utility/config';
import {getChannels} from '../modules/getChannels';
import {errorHandler} from '../modules/errorHandler';
import {channelsUser, getChannelsName} from '../modules/channelsUser';
import {channelMessage, clearChannelMessages} from '../modules/channelMessage';
import {
  channelDeselected,
  channelSelected,
  displayChannelItems,
  resetSelectedChannelItemIndex,
  setSelectedChannelItemIndex,
} from '../modules/displayChannelItems';
import Constant from '../utility/constant';
import {
  availableBatch,
  badgeData,
  earnedBatch,
  messageStreak,
} from './achievement';
import {socketLeaveChannel} from '../utility/phoenix-utils';
import {getProjectUser} from './profile';
import {checkData, routeNameOfScreens} from './chosseAsMentor';

const PUSH_NOTIFICATION_SUCCESS = 'PUSH_NOTIFICATION_SUCCESS';
const PUSH_NOTIFICATION_RECEIVED = 'PUSH_NOTIFICATION_RECEIVED';
const PUSH_NOTIFICATION_READ = 'PUSH_NOTIFICATION_READ';

function onNotification(notification, screenProps) {
  return (dispatch, getState) => {
    const {
      channelMessage: {currentChannelData},
      menteeMentorReducer: {screenName},
      displayChannelItemsReducer: {channelItems},
      getUserDetail: {
        userDetailPayload: {data, included},
      },
      getProjects: {projectSessionPayload},
      getSelectedProjectReducer: {selectedProjectPayload},
    } = getState();
    const {emitter} = screenProps;
    const channelsPayloadCopy = channelItems;
    let projectUserId = '';
    let notificationData;
    if (Platform.OS === 'android') {
      if (notification.foreground === true) {
        notificationData = JSON.parse(notification.data.payload);
      } else {
        notificationData = JSON.parse(notification.payload);
      }
    } else {
      notificationData = notification.data;
    }
    if (notificationData.template === 'earned_badge') {
      if (data.length && data[0].id) {
        projectUserId = data[0].id;
        dispatch(availableBatch(projectUserId));
        dispatch(badgeData(projectUserId));
        dispatch(earnedBatch(projectUserId)).then((res) => {
          if (!notification.foreground || notification.userInteraction) {
            if (
              ((projectSessionPayload &&
                projectSessionPayload.data[0].attributes
                  .gamification_enabled) ||
                (selectedProjectPayload &&
                  selectedProjectPayload.data.attributes
                    .gamification_enabled)) &&
              included[1].attributes.name === 'mentee'
            ) {
              dispatch(checkData(true));
              dispatch(resetSelectedChannelItemIndex());
              dispatch(clearChannelMessages());
              dispatch(channelDeselected());
              dispatch(setSelectedChannelItemIndex(-1));
              if (Platform.OS === 'ios' && screenName == 'Message') {
                const navigate = NavigationActions.navigate({
                  routeName: 'achievement',
                });
                dispatch(routeNameOfScreens('achievement'));
                dispatch(navigate);
              } else {
                const navigate = NavigationActions.navigate({
                  routeName: 'achievement',
                });
                dispatch(navigate);
              }
              emitter.emit('setSideMenuItemIndex', null, 'achievement');
            }
          }
        });
      }
    } else {
      const channelId = parseInt(notificationData.channel_id, 10);
      const channelItemsData = getChannelsName(getState());
      if (channelItemsData && channelItemsData.length) {
        const selectedChannelData = channelItemsData.find(
          (item) => item.channelId === channelId,
        );
        if (
          selectedChannelData &&
          selectedChannelData.hasOwnProperty('channelId')
        ) {
          const selectedChannelIndex = channelItemsData.findIndex(
            (item) => item.channelId === channelId,
          );
          AsyncStorage.getItem(
            Constant.ASYNC_KEYS.PROJECT_ID,
            (err, result) => {
              if (!notification.foreground || notification.userInteraction) {
                if (parseInt(result, 10) !== notificationData.project_id) {
                  dispatch(
                    errorHandler(
                      `You\'ve received a new message on ${notificationData.project_name} project. Please switch to read it`,
                      'Notice',
                    ),
                  );
                } else if (
                  selectedChannelIndex > -1 ||
                  !currentChannelData ||
                  currentChannelData.channelId !== selectedChannelData.channelId
                ) {
                  if (
                    included[1].attributes.name === 'mentee' &&
                    data[0].attributes.survey_state === 'unstarted' &&
                    data[0].attributes['survey_compulsory?']
                  ) {
                    dispatch(
                      NavigationActions.navigate({
                        routeName: 'LandingPage',
                      }),
                    );
                    dispatch(errorHandler(Constant.OPEN_SURVEY_INCOMPLETE));
                  } else {
                    dispatch(channelSelected());
                    channelsPayloadCopy.forEach((data, index) => {
                      if (index === selectedChannelIndex) {
                        channelsPayloadCopy[
                          selectedChannelIndex
                        ].notificationCount = 0;
                      }
                    });
                    emitter.emit('setSideMenuItemIndex', -1);
                    dispatch(displayChannelItems(channelsPayloadCopy));
                    dispatch(pushNotificationReceived());
                    dispatch(getChannels());
                    dispatch(channelsUser());
                    dispatch(
                      channelMessage([], selectedChannelData, null, 'sideMenu'),
                    );
                    dispatch(setSelectedChannelItemIndex(selectedChannelIndex));
                    const navigate = NavigationActions.navigate({
                      routeName: 'Message',
                    });
                    dispatch(navigate);
                  }
                }
              }
            },
          );
        }
      }
    }
  };
}

export function pushNotificationService(screenProps) {
  return (dispatch) => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister(token) {
        dispatch({
          type: PUSH_NOTIFICATION_SUCCESS,
          token,
        });
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification(notification) {
        dispatch(onNotification(notification, screenProps));

        // process the notification

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: Config.GCM_SENDER_ID,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });
  };
}

export function pushNotificationReceived() {
  return (dispatch) => {
    dispatch({
      type: PUSH_NOTIFICATION_RECEIVED,
      isPushNotificationRead: false,
    });
  };
}

export function pushNotificationRead() {
  return (dispatch) => {
    dispatch({
      type: PUSH_NOTIFICATION_READ,
      isPushNotificationRead: true,
    });
  };
}

export const pushNotificationReducer = function reducer(
  state = {
    pushNotificationToken: null,
    isPushNotificationRead: true,
  },
  action,
) {
  switch (action.type) {
    case PUSH_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        pushNotificationToken: action.token.token,
      };
    }
    case PUSH_NOTIFICATION_RECEIVED: {
      return {
        ...state,
        isPushNotificationRead: action.isPushNotificationRead,
      };
    }
    case PUSH_NOTIFICATION_READ: {
      return {
        ...state,
        isPushNotificationRead: action.isPushNotificationRead,
      };
    }
    default: {
      return state;
    }
  }
};
