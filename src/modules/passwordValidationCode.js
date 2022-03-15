import {FORGOT_PASSWORD} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';

// Action type for validation code for forgot password
export const VALIDATE_PASSCODE_REQUEST = 'VALIDATE_PASSCODE_REQUEST';
export const VALIDATE_PASSCODE_SUCCESS = ' VALIDATE_PASSCODE_SUCCESS';
export const VALIDATE_PASSCODE_FAIL = 'VALIDATE_PASSCODE_FAIL';

// Action
export function passwordValidationCode(validationCode) {
  return (dispatch) => {
    dispatch({
      type: VALIDATE_PASSCODE_REQUEST,
    });
    httpGet(
      `${FORGOT_PASSWORD}?filter[token]=${validationCode}&page[number]=1&page[size]=1`,
    )
      .then((response) => {
        dispatch({
          validationCodePayload: response.data,
          type: VALIDATE_PASSCODE_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: VALIDATE_PASSCODE_FAIL,
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
    validationCodePayload: null,
  },
  action,
) {
  switch (action.type) {
    case VALIDATE_PASSCODE_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case VALIDATE_PASSCODE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        validationCodePayload: action.validationCodePayload,
      };
    }
    case VALIDATE_PASSCODE_FAIL: {
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
