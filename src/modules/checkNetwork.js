const IS_CONNECTED = 'IS_CONNECTED';

/**
 *  Action for access the network information.
 */
export function checkNetwork(state) {
  return (dispatch) =>
    new Promise((resolve) => {
      dispatch({
        type: IS_CONNECTED,
        networkState: state,
      });
      resolve(state);
    });
}

export default function reducer(
  state = {
    isConnected: {isConnected: true},
  },
  action,
) {
  switch (action.type) {
    case IS_CONNECTED: {
      return {
        ...state,
        isConnected: action.networkState,
      };
    }
    default: {
      return state;
    }
  }
}
