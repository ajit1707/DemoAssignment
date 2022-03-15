import {httpPost} from '../utility/http';
import {SIGN_UP} from '../utility/apis';
import {errorHandler} from './errorHandler';

// Action type for sign up
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAIL = 'SIGN_UP_FAIL';

// Action
export function signUp(payload) {
  return (dispatch) => {
    dispatch({
      type: SIGN_UP_REQUEST,
    });
    httpPost(`${SIGN_UP}`, payload)
      .then((response) => {
        dispatch({
          signUpPayload: response.data,
          type: SIGN_UP_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: SIGN_UP_FAIL,
        });
        if (
          error &&
          error.data &&
          error.data.errors &&
          error.data.errors.length
        ) {
          dispatch(errorHandler(error.data.errors[0].title));
        }
      });
  };
}

// Reducer
export default function reducer(
  state = {
    fetching: false,
    signUpPayload: null,
  },
  action,
) {
  switch (action.type) {
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case SIGN_UP_SUCCESS: {
      return {
        ...state,
        fetching: false,
        signUpPayload: action.signUpPayload,
      };
    }
    case SIGN_UP_FAIL: {
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
