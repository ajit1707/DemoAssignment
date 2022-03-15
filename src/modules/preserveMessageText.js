import AsyncStorage from '@react-native-async-storage/async-storage';

export const PRESERVE_MESSAGE_TEXT = 'PRESERVE_MESSAGE_TEXT';
export const CLEAR_PRESERVED_MESSAGE_TEXT = 'CLEAR_PRESERVED_MESSAGE_TEXT';
export const PRESERVED_MESSAGE_TEXT = 'PRESERVED_MESSAGE_TEXT';
export const ASYNC_PRESERVED_MESSAGE_TEXT = 'ASYNC_PRESERVED_MESSAGE_TEXT';

export const preserveMessageText = (message) => async (dispatch, getState) => {
  const {
    preserveMessageText: {preservedMessageText},
  } = getState();
  const index = preservedMessageText.findIndex(
    (item) => item.channelId === message.channelId,
  );
  const tempMessageText = [...preservedMessageText];
  if (index >= 0) {
    tempMessageText[index] = message;
  } else {
    tempMessageText.push(message);
  }

  try {
    await AsyncStorage.setItem(
      ASYNC_PRESERVED_MESSAGE_TEXT,
      JSON.stringify(tempMessageText),
    );
  } catch (e) {
    // save error
  }

  dispatch({
    type: PRESERVE_MESSAGE_TEXT,
    message: tempMessageText,
  });
};

export const clearPreservedMessageText = () => (dispatch) => {
  dispatch({
    type: CLEAR_PRESERVED_MESSAGE_TEXT,
  });
};

export const updatePreservedMessageText = () => (dispatch) => {
  let tempPreservedMessage = [];
  AsyncStorage.getItem(ASYNC_PRESERVED_MESSAGE_TEXT, (error, result) => {
    if (result) {
      tempPreservedMessage = JSON.parse(result);
    }
    dispatch({
      type: PRESERVED_MESSAGE_TEXT,
      data: tempPreservedMessage,
    });
  });
};

export default (
  state = {
    preservedMessageText: [],
  },
  action,
) => {
  switch (action.type) {
    case PRESERVE_MESSAGE_TEXT: {
      return {
        ...state,
        preservedMessageText: action.message,
      };
    }
    case CLEAR_PRESERVED_MESSAGE_TEXT: {
      return {
        ...state,
        preservedMessageText: [],
      };
    }
    case PRESERVED_MESSAGE_TEXT: {
      return {
        ...state,
        preservedMessageText: action.data,
      };
    }
    default: {
      return state;
    }
  }
};
