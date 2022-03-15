export const MESSAGE_TO_SEND_OFFLINE = 'MESSAGE_TO_SEND_OFFLINE';
export const CLEAR_SENT_OFFLINE_MESSAGES = 'CLEAR_SENT_OFFLINE_MESSAGES';

export const offlineMessagesToSend = (message) => (dispatch, getState) => {
  const {
    offlineMessageToSend: {offlineStoredMessages},
  } = getState();
  offlineStoredMessages.push(message);
  dispatch({
    type: MESSAGE_TO_SEND_OFFLINE,
    message: offlineStoredMessages,
  });
};

export const clearSentMessages = (updatedChannels) => (dispatch) => {
  dispatch({
    type: CLEAR_SENT_OFFLINE_MESSAGES,
    updatedChannels,
  });
};

export default (
  state = {
    offlineStoredMessages: [],
  },
  action,
) => {
  switch (action.type) {
    case MESSAGE_TO_SEND_OFFLINE: {
      return {
        ...state,
        offlineStoredMessages: action.message,
      };
    }
    case CLEAR_SENT_OFFLINE_MESSAGES: {
      return {
        ...state,
        offlineStoredMessages: [],
      };
    }
    default: {
      return state;
    }
  }
};
