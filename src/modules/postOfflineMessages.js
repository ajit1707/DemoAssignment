import {clearSentMessages} from '../modules/offlineMessagesToSend';
import {OFFLINE_MESSAGE} from '../utility/apis';
import {httpPost} from '../utility/http';
import _ from 'lodash';

export const OFFLINE_MESSAGE_REQUEST = 'OFFLINE_MESSAGE_REQUEST';
export const OFFLINE_MESSAGE_SUCCESS = 'OFFLINE_MESSAGE_SUCCESS';
export const OFFLINE_MESSAGE_FAIL = 'OFFLINE_MESSAGE_FAIL';

export const CLEAR_OFFLINE_STATUS = 'CLEAR_OFFLINE_STATUS';

export const postOfflineMessage = (messages) => (dispatch, getState) => {
  const {
    checkNetwork: {
      isConnected: {isConnected},
    },
  } = getState();
  dispatch({
    type: OFFLINE_MESSAGE_REQUEST,
    fetching: true,
  });
  httpPost(`${OFFLINE_MESSAGE}`, messages)
    .then((res) => {
      dispatch({
        type: OFFLINE_MESSAGE_SUCCESS,
        offlineMessagePayload: res,
        fetching: false,
        isOfflineMessagesSent: true,
      });
    })
    .catch((error) => {
      if (isConnected) {
        dispatch(postOfflineMessage(messages));
      }
      dispatch({
        type: OFFLINE_MESSAGE_FAIL,
        error,
        fetching: false,
      });
    });
};

export function clearOfflineStatus(socketConnection) {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_OFFLINE_STATUS,
    });
    const {
      offlineMessageToSend: {offlineStoredMessages},
      channelMessage: {channels},
    } = getState();
    const groupedMessages = groupBy(offlineStoredMessages);
    const updatedChannels = channels;
    groupedMessages.forEach((messagePayload) => {
      if (updatedChannels[messagePayload.channelId]) {
        updatedChannels[
          messagePayload.channelId
        ].messages = messagePayload.messages
          .reverse()
          .concat(updatedChannels[messagePayload.channelId].messages);
      }
    });
    dispatch(clearSentMessages(updatedChannels));
    if (socketConnection) {
      socketConnection();
    }
  };
}

const groupBy = (messages) =>
  _(messages)
    .groupBy((x) => x.channel_id)
    .map((value, key) => ({channelId: key, messages: value}))
    .value();

export default (
  state = {
    fetching: false,
    offlineMessagePayload: null,
    isOfflineMessagesSent: false,
  },
  action,
) => {
  switch (action.type) {
    case OFFLINE_MESSAGE_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case OFFLINE_MESSAGE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        offlineMessagePayload: action.offlineMessagePayload,
        error: '',
        isOfflineMessagesSent: action.isOfflineMessagesSent,
      };
    }
    case OFFLINE_MESSAGE_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case CLEAR_OFFLINE_STATUS: {
      return {
        ...state,
        isOfflineMessagesSent: false,
      };
    }
    default: {
      return state;
    }
  }
};
