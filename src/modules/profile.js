import AsyncStorage from '@react-native-async-storage/async-storage';
import {USERS, PROJECT_USERS} from '../utility/apis';
import {httpGet, httpPut} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';
import {logOut} from './logOut';

// Action type for user detail
const GET_PROFILE_DETAIL_REQUEST = 'GET_PROFILE_DETAIL_REQUEST';
const GET_PROFILE_DETAIL_SUCCESS = 'GET_PROFILE_DETAIL_SUCCESS';
const GET_PROFILE_DETAIL_FAIL = 'GET_PROFILE_DETAIL_FAIL';
const UPDATE_PROFILE_DETAIL_REQUEST = 'UPDATE_PROFILE_DETAIL_REQUEST';
const UPDATE_PROFILE_DETAIL_SUCCESS = 'UPDATE_PROFILE_DETAIL_SUCCESS';
const UPDATE_PROFILE_DETAIL_FAIL = 'UPDATE_PROFILE_DETAIL_FAIL';
const UPDATE_NOTIFICATION_PREFERENCES_REQUEST =
  'UPDATE_NOTIFICATION_PREFERENCES_REQUEST';
const UPDATE_NOTIFICATION_PREFERENCES_SUCCESS =
  'UPDATE_NOTIFICATION_PREFERENCES_SUCCESS';
const UPDATE_NOTIFICATION_PREFERENCES_FAIL =
  'UPDATE_NOTIFICATION_PREFERENCES_FAIL';
const GET_PROJECT_USER_REQUEST = 'GET_PROJECT_USER_REQUEST';
const GET_PROJECT_USER_SUCCESS = 'GET_PROJECT_USER_SUCCESS';
const GET_PROJECT_USER_FAIL = 'GET_PROJECT_USER_FAIL';
const GET_INCLUDED_PROJECT_USER_REQUEST = 'GET_INCLUDED_PROJECT_USER_REQUEST';
const GET_INCLUDED_PROJECT_USER_SUCCESS = 'GET_INCLUDED_PROJECT_USER_SUCCESS';
const GET_INCLUDED_PROJECT_USER_FAIL = 'GET_INCLUDED_PROJECT_USER_FAIL';
const SESSION_LOG_OUT = 'SESSION_LOG_OUT';

export function getProfileDetail() {
  return (dispatch) =>
    new Promise(async (resolve) => {
      const projectSwitcherSelectedData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.USER_DATA,
        () => {},
      );
      const projectId = JSON.parse(projectSwitcherSelectedData);
      dispatch({
        type: GET_PROFILE_DETAIL_REQUEST,
      });
      if (
        projectId &&
        projectId.included &&
        projectId.included.length &&
        projectId.included[0].id
      ) {
        httpGet(`${USERS}/${projectId.included[0].id}`)
          .then((response) => {
            resolve(response.data);
            dispatch({
              profileDetailPayload: response.data,
              type: GET_PROFILE_DETAIL_SUCCESS,
            });
          })
          .catch((error) => {
            dispatch({
              type: GET_PROFILE_DETAIL_FAIL,
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

export function updateProfileDetail(userData) {
  return (dispatch) =>
    new Promise(async (resolve) => {
      const projectSwitcherSelectedData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.USER_DATA,
        () => {},
      );
      const projectId = JSON.parse(projectSwitcherSelectedData);
      dispatch({
        type: UPDATE_PROFILE_DETAIL_REQUEST,
      });
      httpPut(`${USERS}/${projectId.included[0].id}`, userData)
        .then((response) => {
          resolve(response.data);
          dispatch({
            updatedProfileDetailPayload: response.data,
            type: UPDATE_PROFILE_DETAIL_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_PROFILE_DETAIL_FAIL,
          });
          if (
            error &&
            error.data &&
            error.data.errors.length &&
            error.data.errors[0].detail ===
              'phone_number - has already been taken'
          ) {
            dispatch(errorHandler(Constant.PHONE_NUMBER_USED));
          }
          if (
            error &&
            error.data &&
            error.data.errors.length &&
            error.data.errors[0].detail !==
              'The required parameter, data, is missing.' &&
            error.data.errors[0].detail !==
              'phone_number - has already been taken'
          ) {
            dispatch(errorHandler(error.data.errors[0].detail));
          }
        });
    });
}

export function getProjectUser(screenKey) {
  return (dispatch) =>
    new Promise(async (resolve) => {
      const projectId = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_ID,
        (err, result) => {},
      );
      const userPayload = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.USER_DATA,
        () => {},
      );
      const userData = JSON.parse(userPayload);
      if (screenKey !== 'createStore') {
        dispatch({
          type: GET_PROJECT_USER_REQUEST,
        });
      }
      httpGet(
        `${PROJECT_USERS}/?filter[project_id]=${projectId}&filter[user_id]=${userData.included[0].id}&include=project,project.ask_graduate&fields[project_users]=is_archived,is_authorized,user_id,project_id,typeform_link&fields[projects]=is_archived,name,ask_graduate_enabled,typeform_enabled,gamification_enabled,mission_accomplished&fields[ask_graduates]=replacement_text_enabled,replacement_text`,
      )
        .then((response) => {
          if (!response.data.data[0].attributes.is_authorized) {
            dispatch({
              type: SESSION_LOG_OUT,
            });
            dispatch(logOut(Constant.SESSION_OUT_MESSAGE));
            resolve(response.data);
            dispatch({
              projectUserPayload: response.data,
              type: GET_PROJECT_USER_SUCCESS,
            });
          } else {
            resolve(response.data);
            dispatch({
              projectUserPayload: response.data,
              type: GET_PROJECT_USER_SUCCESS,
            });
          }
        })
        .catch((error) => {
          dispatch({
            type: GET_PROJECT_USER_FAIL,
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
    });
}

export function getIncludedProjectUser() {
  return (dispatch, getState) =>
    new Promise((resolve) => {
      const {
        profile: {projectUserPayload},
      } = getState();
      dispatch({
        type: GET_INCLUDED_PROJECT_USER_REQUEST,
      });
      httpGet(`${PROJECT_USERS}/${projectUserPayload.data[0].id}?include=user`)
        .then((response) => {
          resolve(response.data);
          dispatch({
            includedProjectUserPayload: response.data,
            type: GET_INCLUDED_PROJECT_USER_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_INCLUDED_PROJECT_USER_FAIL,
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
    });
}

export function updateNotificationPreferences(userData) {
  return (dispatch, getState) =>
    new Promise(async (resolve) => {
      const {
        profile: {projectUserPayload},
      } = getState();
      dispatch({
        type: UPDATE_NOTIFICATION_PREFERENCES_REQUEST,
      });
      httpPut(`${PROJECT_USERS}/${projectUserPayload.data[0].id}`, userData)
        .then((response) => {
          resolve(response.data);
          dispatch({
            updatedNotificationPreferencesPayload: response.data,
            type: UPDATE_NOTIFICATION_PREFERENCES_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_NOTIFICATION_PREFERENCES_FAIL,
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
    });
}

export default (
  state = {fetching: false, profileDetailPayload: null},
  action,
) => {
  switch (action.type) {
    case GET_PROFILE_DETAIL_REQUEST: {
      return {
        ...state,
      };
    }
    case GET_PROFILE_DETAIL_SUCCESS: {
      return {
        ...state,
        fetching: false,
        profileDetailPayload: action.profileDetailPayload,
      };
    }
    case GET_PROFILE_DETAIL_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case UPDATE_PROFILE_DETAIL_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case UPDATE_PROFILE_DETAIL_SUCCESS: {
      return {
        ...state,
        fetching: false,
        updatedProfileDetailPayload: action.updatedProfileDetailPayload,
      };
    }
    case UPDATE_PROFILE_DETAIL_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case UPDATE_NOTIFICATION_PREFERENCES_REQUEST: {
      return {
        ...state,
      };
    }
    case UPDATE_NOTIFICATION_PREFERENCES_SUCCESS: {
      return {
        ...state,
        updatedNotificationPreferencesPayload:
          action.updatedNotificationPreferencesPayload,
      };
    }
    case UPDATE_NOTIFICATION_PREFERENCES_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case GET_PROJECT_USER_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_PROJECT_USER_SUCCESS: {
      return {
        ...state,
        projectUserPayload: action.projectUserPayload,
      };
    }
    case GET_PROJECT_USER_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case GET_INCLUDED_PROJECT_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case GET_INCLUDED_PROJECT_USER_SUCCESS: {
      return {
        ...state,
        includedProjectUserPayload: action.includedProjectUserPayload,
      };
    }
    case GET_INCLUDED_PROJECT_USER_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case SESSION_LOG_OUT: {
      return {
        ...state,
        fetching: false,
      };
    }
    default: {
      return state;
    }
  }
};
