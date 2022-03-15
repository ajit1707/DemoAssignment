import {PROJECT_CODE} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';

// Action type for project codes
const PROJECT_CODE_REQUEST = 'PROJECT_CODE_REQUEST';
const PROJECT_CODE_SUCCESS = 'PROJECT_CODE_SUCCESS';
const PROJECT_CODE_FAIL = 'PROJECT_CODE_FAIL';

// Action
export function projectCode(projectCodeData) {
  return (dispatch) => {
    dispatch({
      type: PROJECT_CODE_REQUEST,
    });
    httpGet(`${PROJECT_CODE}/${projectCodeData}`)
      .then((response) => {
        dispatch({
          projectCodePayload: response.data,
          type: PROJECT_CODE_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: PROJECT_CODE_FAIL,
        });
        if (
          error &&
          error.data &&
          error.data.errors &&
          error.data.errors.length
        ) {
          dispatch(errorHandler(error.data.errors[0].detail));
        }
      });
  };
}

// Reducer
export default function reducer(
  state = {
    fetching: false,
    projectCodePayload: null,
  },
  action,
) {
  switch (action.type) {
    case PROJECT_CODE_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case PROJECT_CODE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        projectCodePayload: action.projectCodePayload,
      };
    }
    case PROJECT_CODE_FAIL: {
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
