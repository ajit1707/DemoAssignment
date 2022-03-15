import {NavigationActions, StackActions} from 'react-navigation';
import {httpGet} from '../utility/http';
import {VERIFY_EMAIL} from '../utility/apis';
import {errorHandler} from './errorHandler';
import {socketLeaveChannel} from '../utility/phoenix-utils';
import {
  channelSelected,
  displayChannelItems,
  setSelectedChannelItemIndex,
} from './displayChannelItems';
import {socketNotification} from './socketNotification';
import {getChannels} from './getChannels';
import {channelMessage} from './channelMessage';
import {SWITCH_PROJECT} from './getProjects';
import {chatBot} from './typeformMentee';

/**
 *  Action for access the network information.
 */
const DEEP_LINK_SUCCESS = 'DEEP_LINK_SUCCESS';
const DISABLE_DEEP_LINK = 'DISABLE_DEEP_LINK';

export function deepLinkHandler(deepLinkPayload) {
  return (dispatch) => {
    dispatch({
      deepLinkPayload,
      type: DEEP_LINK_SUCCESS,
    });
    if (deepLinkPayload.params.isDeepLink) {
      const resetAction = StackActions.reset({
        key: null,
        index: 0,
        actions: [NavigationActions.navigate(deepLinkPayload)],
      });
      dispatch(resetAction);
    }
  };
}

export function verifyEmail(token) {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      httpGet(`${VERIFY_EMAIL}/${token}`)
        .then(() => {
          resolve('Email Address Verified');
        })
        .catch((error) => {
          if (error && error.errors && error.errors.length) {
            dispatch(errorHandler(error.errors[0].title));
            reject(error.errors[0].title);
          }
        });
    });
}

export function navigateToChannel(channelId) {
  return (dispatch, getState) => {
    const {
      selectedChannelItemIndexReducer: {selectedChannelItemIndex},
      channelMessage: {currentChannelData},
      checkNetwork: {isConnected},
      displayChannelItemsReducer: {channelItems},
    } = getState();
    const channelsPayloadCopy = channelItems;
    if (channelItems && channelItems.length) {
      const index = channelItems.findIndex(
        (item) => item.channelId === parseInt(channelId, 10),
      );
      if (
        index >= 0 &&
        (selectedChannelItemIndex < 0 ||
          (currentChannelData && currentChannelData.channelId !== channelId))
      ) {
        socketLeaveChannel();
        if (isConnected) {
          dispatch(getChannels());
        }
        dispatch(channelSelected());
        dispatch(socketNotification('remove', null));
        dispatch(channelMessage([], channelItems[index], null, 'sideMenu'));
        dispatch(displayChannelItems(channelsPayloadCopy));
        dispatch(setSelectedChannelItemIndex(index));
        const navigateAction = NavigationActions.navigate({
          routeName: 'Message',
        });
        return dispatch(navigateAction);
      }
    }
    const resetNavigator = StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: 'DrawerNavigator',
        }),
      ],
    });
    return dispatch(resetNavigator);
  };
}

export function navigateToMessage(channelId, screenProps) {
  return (dispatch, getState) => {
    const {
      checkNetwork: {isConnected},
      displayChannelItemsReducer: {channelItems},
    } = getState();
    const channelsPayloadCopy = channelItems;
    const index = channelItems.findIndex(
      (item) => item.channelId === parseInt(channelId, 10),
    );
    socketLeaveChannel();
    if (isConnected) {
      dispatch(getChannels());
    }
    dispatch(channelSelected());
    dispatch(socketNotification('remove', null));
    screenProps.emitter.emit('setSideMenuItemIndex', -1);
    dispatch(channelMessage([], channelItems[index], null, 'sideMenu'));
    dispatch(displayChannelItems(channelsPayloadCopy));
    dispatch(setSelectedChannelItemIndex(index));
    dispatch(chatBot());
    const navigateAction = NavigationActions.navigate({
      routeName: 'Message',
    });
    return dispatch(navigateAction);
  };
}
export function disableDeepLink() {
  return {
    type: DISABLE_DEEP_LINK,
  };
}

export default function reducer(
  state = {
    isConnected: false,
    disableDeepLink: false,
  },
  action,
) {
  switch (action.type) {
    case DEEP_LINK_SUCCESS: {
      return {
        ...state,
        deepLinkPayload: action.deepLinkPayload,
      };
    }
    case DISABLE_DEEP_LINK: {
      return {
        ...state,
        disableDeepLink: true,
      };
    }
    case SWITCH_PROJECT: {
      return {
        ...state,
        disableDeepLink: true,
      };
    }
    default: {
      return state;
    }
  }
}
