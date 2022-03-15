import {FORGOT_PASSWORD} from '../utility/apis';
import {httpPatch, httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';

const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
const RESET_PASSWORD_FAIL = 'RESET_PASSWORD_FAIL';

export function resetPassword(userData, id) {
  return (dispatch) => {
    dispatch({
      type: RESET_PASSWORD_REQUEST,
    });
    httpPatch(`${FORGOT_PASSWORD}/${id}`, userData)
      .then((response) => {
        dispatch({
          resetPasswordPayload: response.data,
          type: RESET_PASSWORD_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: RESET_PASSWORD_FAIL,
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

export function fetchUserDataById(id) {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      httpGet(
        `${FORGOT_PASSWORD}?filter[token]=${id}&page[number]=1&page[size]=1`,
      )
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          if (
            error &&
            error.data &&
            error.data.error &&
            error.data.error.length
          ) {
            dispatch(errorHandler(error.data.error));
          }
          reject(error);
        });
    });
}

export default function reducer(
  state = {
    fetching: false,
    resetPasswordPayload: null,
  },
  action,
) {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        fetching: false,
        resetPasswordPayload: action.resetPasswordPayload,
      };
    }
    case RESET_PASSWORD_FAIL: {
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
