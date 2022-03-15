import {SIGN_IN} from '../utility/apis';
import {httpPost} from '../utility/http';
import {errorHandler} from './errorHandler';

// Action type for sign up
const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
const SIGN_IN_FAIL = 'SIGN_IN_FAIL';

export function signIn(payload) {
  return (dispatch) => {
    dispatch({
      type: SIGN_IN_REQUEST,
    });
    httpPost(`${SIGN_IN}`, payload)
      .then((response) => {
        dispatch({
          signInPayload: response.data,
          type: SIGN_IN_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: SIGN_IN_FAIL,
        });
        if (
          error &&
          error.data &&
          error.data.errors &&
          error.data.errors.length &&
          error.data.errors[1] === undefined
        ) {
          dispatch(errorHandler(error.data.errors[0].title));
        } else {
          dispatch(errorHandler(error.data.errors[1].title));
        }
      });
  };
}

export default function reducer(
  state = {
    fetching: false,
    signInPayload: null,
  },
  action,
) {
  switch (action.type) {
    case SIGN_IN_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case SIGN_IN_SUCCESS: {
      return {
        ...state,
        fetching: false,
        signInPayload: action.signInPayload,
      };
    }
    case SIGN_IN_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    default: {
      return state;
    }
  }
}
