const SOCKET_NOTIFICATION_ADD = 'SOCKET_NOTIFICATION_ADD';
const SOCKET_NOTIFICATION_REMOVE = 'SOCKET_NOTIFICATION_REMOVE';

/**
 *  Action for Socket notification.
 */
export function socketNotification(action, notification) {
  return (dispatch) => {
    if (action === 'add') {
      dispatch({
        notification,
        type: SOCKET_NOTIFICATION_ADD,
      });
    } else {
      dispatch({
        notification: null,
        type: SOCKET_NOTIFICATION_REMOVE,
      });
    }
  };
}

export default function reducer(
  state = {
    isConnected: false,
  },
  action,
) {
  switch (action.type) {
    case SOCKET_NOTIFICATION_ADD: {
      return {
        ...state,
        notification: action.notification,
      };
    }
    case SOCKET_NOTIFICATION_REMOVE: {
      return {
        ...state,
        notification: action.notification,
      };
    }
    default: {
      return state;
    }
  }
}
