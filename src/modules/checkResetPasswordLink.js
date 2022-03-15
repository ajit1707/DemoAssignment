import {FORGOT_PASSWORD} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';

const CHECK_PASSWORD_LINK_REQUEST = 'CHECK_PASSWORD_LINK_REQUEST';
const CHECK_PASSWORD_LINK_SUCCESS = 'CHECK_PASSWORD_LINK_SUCCESS';
const CHECK_PASSWORD_LINK_FAIL = 'CHECK_PASSWORD_LINK_FAIL';

export function checkResetPasswordLink(token) {
  return (dispatch) => {
    dispatch({
      type: CHECK_PASSWORD_LINK_REQUEST,
    });
    httpGet(
      `${FORGOT_PASSWORD}?filter[token]=${token}&page[number]=1&page[size]=1`,
    )
      .then((response) => {
        dispatch({
          passwordLinkPayload: response.data,
          type: CHECK_PASSWORD_LINK_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: CHECK_PASSWORD_LINK_FAIL,
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

export default function reducer(
  state = {
    fetching: false,
    passwordLinkPayload: null,
  },
  action,
) {
  switch (action.type) {
    case CHECK_PASSWORD_LINK_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case CHECK_PASSWORD_LINK_SUCCESS: {
      return {
        ...state,
        fetching: false,
        passwordLinkPayload: action.passwordLinkPayload,
      };
    }
    case CHECK_PASSWORD_LINK_FAIL: {
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
