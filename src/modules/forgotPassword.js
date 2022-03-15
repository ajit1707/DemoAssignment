import {FORGOT_PASSWORD} from '../utility/apis';
import {httpPost} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';

// Action type for forgot password
const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
const FORGOT_PASSWORD_SUCCESS = ' FORGOT_PASSWORD_SUCCESS';
const FORGOT_PASSWORD_FAIL = 'FORGOT_PASSWORD_FAIL';

export function forgotPassword(payload) {
  return (dispatch) => {
    dispatch({
      type: FORGOT_PASSWORD_REQUEST,
    });
    httpPost(`${FORGOT_PASSWORD}`, payload)
      .then((response) => {
        dispatch({
          forgotPasswordPayload: response.data,
          type: FORGOT_PASSWORD_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: FORGOT_PASSWORD_FAIL,
        });
        if (
          error &&
          error.data &&
          error.data.errors &&
          error.data.errors.length &&
          error.data.errors[0].code === 100
        ) {
          dispatch(errorHandler(Constant.USER_NOT_PASSWORD));
        } else {
          dispatch(errorHandler(error.data.errors[0].title));
        }
      });
  };
}

// Reducer
export default function reducer(
  state = {
    fetching: false,
    forgotPasswordPayload: null,
  },
  action,
) {
  switch (action.type) {
    case FORGOT_PASSWORD_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        fetching: false,
        forgotPasswordPayload: action.forgotPasswordPayload,
      };
    }
    case FORGOT_PASSWORD_FAIL: {
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
