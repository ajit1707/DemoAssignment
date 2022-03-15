import {PROJECT_INVITATIONS} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';
import {LOGOUT_SUCCESS} from '../modules/logOut';
import {get} from 'lodash';

// Action type for channels user
const PROJECT_TOKEN_REQUEST = 'PROJECT_TOKEN_REQUEST';
const PROJECT_TOKEN_SUCCESS = 'PROJECT_TOKEN_SUCCESS';
const PROJECT_TOKEN_FAIL = 'PROJECT_TOKEN_FAIL';

export function checkProjectToken(id) {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: PROJECT_TOKEN_REQUEST,
      });
      httpGet(`${PROJECT_INVITATIONS}/${id}`)
        .then((response) => {
          resolve(response.data);
          dispatch({
            projectInvitationData: response.data,
            type: PROJECT_TOKEN_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: PROJECT_TOKEN_FAIL,
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
    });
}

export default function reducer(
  state = {
    fetching: false,
    projectInvitationData: null,
  },
  action,
) {
  let projectInvitationData;
  switch (action.type) {
    case PROJECT_TOKEN_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case PROJECT_TOKEN_SUCCESS: {
      return {
        ...state,
        fetching: false,
        projectInvitationData: action.projectInvitationData,
      };
    }
    case PROJECT_TOKEN_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case LOGOUT_SUCCESS: {
      projectInvitationData = get(action, 'logoutData.invitationData', null);
      if (projectInvitationData) {
        return {
          ...state,
          projectInvitationData,
        };
      }
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}
