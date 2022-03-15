import _ from 'lodash';

import {CLEAR_SENT_OFFLINE_MESSAGES} from './offlineMessagesToSend';

const SOCKET_MESSAGE = 'SOCKET_MESSAGE';
const CLEAR_SOCKET_MESSAGE = 'CLEAR_SOCKET_MESSAGE';

/**
 *  Action for access the network information.
 */
export function channelMessage(
  messages,
  currentChannelData,
  moderation,
  screenKey,
  isPagination,
) {
  return (dispatch, getState) => {
    const currentChannelInfo = currentChannelData;
    currentChannelInfo.messages = getChannelMessages(
      messages,
      getState,
      moderation,
      screenKey,
      currentChannelData,
      isPagination,
    );
    dispatch({
      currentChannelData,
      currentChannelInfo,
      channelNotice: currentChannelData
        ? socketChannelNotice(currentChannelData)
        : null,
      type: SOCKET_MESSAGE,
    });
  };
}

export function clearChannelMessages() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_SOCKET_MESSAGE,
    });
  };
}

export function socketChannelNotice(currentChannelData) {
  let title;
  let message;
  if (currentChannelData && currentChannelData.channelType === 'group') {
    title = 'This is a group channel';
    message = 'Messages sent here will be seen by everyone in the group';
  } else if (
    currentChannelData &&
    currentChannelData.channelType === 'support'
  ) {
    title = 'This is your support channel';
    message = 'Messages sent here will be sent to your coordinator';
  } else {
    title = 'This is the start of your mentoring experience with';
    message = 'Messages sent here will be kept private between you two';
  }
  return {title, message};
}

export default function reducer(
  state = {
    channelMessages: [],
    currentChannelData: null,
    channelNotice: null,
    channels: null,
  },
  action,
) {
  switch (action.type) {
    case SOCKET_MESSAGE: {
      return {
        ...state,
        currentChannelData: action.currentChannelData,
        channelNotice: action.channelNotice,
        channels: {
          ...state.channels,
          [action.currentChannelInfo.channelId]: action.currentChannelInfo,
        },
      };
    }
    case CLEAR_SOCKET_MESSAGE: {
      return {
        ...state,
        currentChannelData: null,
      };
    }

    case CLEAR_SENT_OFFLINE_MESSAGES: {
      return {
        ...state,
        channels: action.updatedChannels,
      };
    }

    default: {
      return state;
    }
  }
}

const groupMessageByChannelId = (
  channelMessages,
  messages,
  selectedChannelData,
  isPagination,
  moderation,
  getState,
) => {
  let groupMessage;
  const {
    getUserDetail: {userDetailPayload},
  } = getState;
  let channelMessage = channelMessages;
  let userData;
  if (Array.isArray(messages)) {
    if (isPagination) {
      channelMessage = channelMessage.concat(messages);
      groupMessage = channelMessage;
    } else {
      groupMessage = messages;
    }
  } else if (!Array.isArray(messages)) {
    if (userDetailPayload.data.length) {
      userData = userDetailPayload.included.filter(
        (payload) => payload.type === 'users',
      );
      const moderationIndex = channelMessage.findIndex(
        (message) => message.id === messages.id,
      );
      if (messages && !moderation) {
        if (messages.new_message) {
          messages.last_message = true;
          if (messages.state === 'flagged' || messages.state === 'declined') {
            if (
              userData.length &&
              messages.user_id.toString() === userData[0].id
            ) {
              channelMessage = [messages].concat(channelMessage);
            }
            return channelMessage;
          }
          if (moderationIndex < 0) {
            channelMessage = [messages].concat(channelMessage);
          }
        }
      } else if (moderation) {
        if (
          messages.state === 'flagged' &&
          messages.reported_user_id &&
          messages.reported_user_id.toString() !== userData[0].id &&
          userData[0].id !== messages.user_id.toString()
        ) {
          channelMessage.splice(moderationIndex, 1);
        } else if (moderationIndex > -1) {
          messages.last_page = channelMessages[moderationIndex].last_page;
          channelMessage[moderationIndex] = messages;
        }
        if (
          userData.length !== 0 &&
          messages.user_id.toString() !== userData[0].id &&
          messages.state !== 'declined'
        ) {
          if (moderationIndex < 0) {
            return [messages].concat(channelMessage);
          }
        }
        return channelMessages;
      }
    }
    groupMessage = channelMessage;
  } else {
    groupMessage = messages;
  }
  return groupMessage;
};

export const getChannelMessages = (
  messages,
  getState,
  moderation,
  screenKey,
  currentChannelData,
  isPagination,
) => {
  const {
    channelMessage: {channels},
  } = getState();
  let channelMessages = [];
  if (channels && channels[currentChannelData.channelId]) {
    channelMessages = _.get(
      channels[currentChannelData.channelId],
      'messages',
      [],
    );
  }
  if (screenKey === 'sideMenu') {
    if (channels) {
      return channelMessages;
    }
    return [];
  }
  let groupMessageByChannelFlag = false;
  const offlineMessages = channelMessages.filter(
    (message) => message.id === -1,
  );
  if (Array.isArray(messages) && offlineMessages.length > 0) {
    const maxId = channelMessages.reduce(
      (msgId, cnlMessage) => Math.max(msgId, cnlMessage.id),
      0,
    );
    const filteredMessages = messages.filter((message) => message.id > maxId);
    offlineMessages.forEach((msg) => {
      const index = filteredMessages.findIndex((messageObj) => {
        if (/\<([^\s][^\<\>]+?[^\s])\>/.test(messageObj.body)) {
          return messageObj.body.replace(/[<|>]/g, '') === msg.body;
        }
        return messageObj.body === msg.body;
      });
      if (index >= 0) {
        const indexOfMessage = channelMessages.findIndex(
          (channelMessageObj) =>
            channelMessageObj.body === msg.body && channelMessageObj.id === -1,
        );
        if (indexOfMessage >= 0) {
          channelMessages.splice(indexOfMessage, 1, filteredMessages[index]);
        }
      }
    });
    return channelMessages;
  }
  if (!Array.isArray(messages)) {
    const trimmedMessage = /\<([^\s][^\<\>]+?[^\s])\>/.test(messages.body)
      ? messages.body.replace(/[<|>]/g, '')
      : messages.body;
    const repeatedModerationIndex = channelMessages.findIndex(
      (message) => message.id === messages.id,
    );
    if (repeatedModerationIndex >= 0) {
      channelMessages.splice(repeatedModerationIndex, 1, messages);
      return channelMessages;
    }
    groupMessageByChannelFlag = offlineMessages.some((msg) => {
      if (trimmedMessage === msg.body) {
        const indexOfMessage = channelMessages.findIndex(
          (channelMessageObj) =>
            channelMessageObj.id === -1 && channelMessageObj.body === msg.body,
        );
        if (indexOfMessage >= 0) {
          channelMessages.splice(indexOfMessage, 1, messages);
          return true;
        }
      }
      return false;
    });
  }
  if (groupMessageByChannelFlag) {
    return channelMessages;
  }
  return groupMessageByChannelId(
    channelMessages,
    messages,
    currentChannelData,
    isPagination,
    moderation,
    getState(),
  );
};
