// Action type for errorHandler
const ADD_ERROR_MESSAGE = 'ADD_ERROR_MESSAGE';
const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';

export function errorHandler(error, title) {
  return (dispatch, getState) => {
    const {
      nav: {routes},
    } = getState();
    if (error && routes.length && routes[0].routeName !== 'SplashScreen') {
      dispatch({
        type: ADD_ERROR_MESSAGE,
        title,
        error,
      });
    } else {
      dispatch({
        type: CLEAR_ERROR_MESSAGE,
      });
    }
  };
}

export default function reducer(
  state = {
    error: null,
    title: null,
  },
  action,
) {
  switch (action.type) {
    case ADD_ERROR_MESSAGE: {
      return {
        ...state,
        error: action.error,
        title: action.title,
      };
    }
    case CLEAR_ERROR_MESSAGE: {
      return {
        ...state,
        error: null,
        title: null,
      };
    }
    default: {
      return state;
    }
  }
}
