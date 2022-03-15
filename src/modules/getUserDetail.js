import AsyncStorage from '@react-native-async-storage/async-storage';
import {V2_PROJECT_USERS} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';
import {logOut} from './logOut';

// Action type for user detail
const GET_USER_DETAIL_REQUEST = 'GET_USER_DETAIL_REQUEST';
export const GET_USER_DETAIL_SUCCESS = 'GET_USER_DETAIL_SUCCESS';
const GET_USER_DETAIL_FAIL = 'GET_USER_DETAIL_FAIL';
const UPDATE_SURVEY_STATUS = 'UPDATE_SURVEY_STATUS';

const SESSION_LOG_OUT = 'SESSION_LOG_OUT';

export function getUserDetails() {
  return (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      const {
        getProjects: {projectSessionPayload},
        checkNetwork: {
          isConnected: {isConnected},
        },
        getUserDetail: {userDetailPayload},
      } = getState();
      if (!isConnected && userDetailPayload) {
        resolve(userDetailPayload);
        dispatch({
          userDetailPayload,
          type: GET_USER_DETAIL_SUCCESS,
        });
      } else {
        const projectSwitcherSelectedData = await AsyncStorage.getItem(
          Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
          () => {},
        );
        const projectId = projectSwitcherSelectedData
          ? JSON.parse(projectSwitcherSelectedData)
          : projectSessionPayload.data[0];
        dispatch({
          type: GET_USER_DETAIL_REQUEST,
        });
        httpGet(
          `${V2_PROJECT_USERS}?filter[project_id]=${projectId.id}&filter[is_authorized]=true`,
        )
          .then((response) => {
            if (response.data.data.length) {
              resolve(response.data);
              AsyncStorage.setItem(
                Constant.ASYNC_KEYS.USER_DETAILS,
                JSON.stringify(response),
              );
              dispatch({
                userDetailPayload: response.data,
                type: GET_USER_DETAIL_SUCCESS,
              });
            } else {
              dispatch({
                type: SESSION_LOG_OUT,
              });
              dispatch(logOut(Constant.SESSION_OUT_MESSAGE));
            }
          })
          .catch((error) => {
            dispatch({
              type: GET_USER_DETAIL_FAIL,
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
      }
    });
}

export function updateState() {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_SURVEY_STATUS,
    });
  };
}

export default function reducer(
  state = {
    fetching: false,
    userDetailPayload: null,
    mentorProfilePayload: null,
  },
  action,
) {
  switch (action.type) {
    case GET_USER_DETAIL_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case GET_USER_DETAIL_SUCCESS: {
      return {
        ...state,
        fetching: false,
        userDetailPayload: action.userDetailPayload,
      };
    }
    case GET_USER_DETAIL_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case UPDATE_SURVEY_STATUS: {
      const updatedPayload = state.userDetailPayload;
      updatedPayload.data[0].attributes.survey_state = 'completed';
      return {
        ...state,
        userDetailPayload: updatedPayload,
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserDetail = (state) => {
  const {
    getUserDetail: {userDetailPayload},
  } = state;
  if (userDetailPayload.data.length) {
    return userDetailPayload.included.filter((items) => items.type === 'users');
  }
  return null;
};

export const userDetails = (state) => {
  let isAdmin;
  let role;
  const {
    getUserDetail: {userDetailPayload},
  } = state;
  if (
    userDetailPayload &&
    userDetailPayload.included &&
    userDetailPayload.included.length &&
    userDetailPayload.included[0].attributes &&
    userDetailPayload.included[1].attributes
  ) {
    const {
      included: [
        {
          attributes: {super_admin},
        },
        {
          attributes: {name},
        },
      ],
    } = userDetailPayload;
    isAdmin = super_admin;
    role = name;
    return {
      isAdmin,
      role,
    };
  }
  return null;
};
