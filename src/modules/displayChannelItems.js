const DISPLAY_CHANNEL_ITEMS = 'DISPLAY_CHANNEL_ITEMS';
const SELECTED_INDEX = 'SELECTED_INDEX';
const RESET_SELECTED_INDEX = 'SELECTED_INDEX';
const CHANNEL_SELECTED = 'CHANNEL_SELECTED';
const CHANNEL_DESELECTED = 'CHANNEL_DESELECTED';

/**
 *  Action for Socket notification.
 */
export function displayChannelItems(channelItems) {
  return (dispatch) =>
    new Promise((resolve) => {
      dispatch({
        channelItems,
        type: DISPLAY_CHANNEL_ITEMS,
      });
      resolve(channelItems);
    });
}

export function setSelectedChannelItemIndex(index) {
  return (dispatch) => {
    dispatch({
      index,
      type: SELECTED_INDEX,
    });
  };
}

export function resetSelectedChannelItemIndex(index) {
  return (dispatch) => {
    dispatch({
      index,
      type: RESET_SELECTED_INDEX,
    });
  };
}

export function channelSelected() {
  return (dispatch) => {
    dispatch({
      type: CHANNEL_SELECTED,
      isChannelSelected: true,
    });
  };
}

export function channelDeselected() {
  return (dispatch) => {
    dispatch({
      type: CHANNEL_DESELECTED,
    });
  };
}

export const selectedChannelItemIndexReducer = function reducer(
  state = {
    selectedChannelItemIndex: -1,
  },
  action,
) {
  switch (action.type) {
    case SELECTED_INDEX: {
      return {
        ...state,
        selectedChannelItemIndex: action.index,
      };
    }
    case RESET_SELECTED_INDEX: {
      return {
        ...state,
        selectedChannelItemIndex: -1,
      };
    }
    case CHANNEL_SELECTED: {
      return {
        ...state,
        isChannelSelected: action.isChannelSelected,
      };
    }
    case CHANNEL_DESELECTED: {
      return {
        ...state,
        isChannelSelected: false,
      };
    }
    default: {
      return state;
    }
  }
};

export const displayChannelItemsReducer = function reducer(
  state = {
    channelItems: null,
  },
  action,
) {
  switch (action.type) {
    case DISPLAY_CHANNEL_ITEMS: {
      return {
        ...state,
        channelItems: action.channelItems,
      };
    }
    default: {
      return state;
    }
  }
};
