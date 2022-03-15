import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import {GET_PROJECTS} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';
import {logOut, getUserData} from '../modules/logOut';
import {userSignInInfo} from './userSignIn';
import Config from '../utility/config';
// Action type for side menu
const GET_PROJECTS_REQUEST = 'GET_PROJECTS_REQUEST';
const GET_PROJECTS_SUCCESS = 'GET_PROJECTS_SUCCESS';
const GET_PROJECTS_FAIL = 'GET_PROJECTS_FAIL';
const GET_ACTIVE_PROJECTS_SUCCESS = 'GET_ACTIVE_PROJECTS_SUCCESS';
const GET_ARCHIVED_PROJECTS_SUCCESS = 'GET_ARCHIVED_PROJECTS_SUCCESS';
const SESSION_LOG_OUT = 'SESSION_LOG_OUT';
export const SWITCH_PROJECT = 'SWITCH_PROJECT';

const pages = 15;

export function getProjects(pageNumber, type) {
  let filterUrl;
  if (type === 'active') {
    filterUrl = `?filter[is_authorized]=true&filter[is_archived]=false&page[number]=${pageNumber}
                &page[size]=${pages}&sort=-starts_on`;
  } else if (type === 'archived') {
    filterUrl = `?filter[is_authorized]=true&filter[is_archived]=true&page[number]=${pageNumber}
        &page[size]=${pages}&sort=-starts_on`;
  } else {
    filterUrl =
      '?filter[is_authorized]=true&page[number]=1&page[size]=1&sort=starts_on';
  }
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const {
        getProjects: {projectSessionPayload, isConnectionProject},
        checkNetwork: {
          isConnected: {isConnected},
        },
      } = getState();
      if (!isConnected && projectSessionPayload) {
        resolve(isConnectionProject);
        dispatch({
          projectSessionPayload,
          isConnectionProject,
          type: GET_PROJECTS_SUCCESS,
        });
      } else {
        dispatch({
          type: GET_PROJECTS_REQUEST,
        });
        httpGet(`${GET_PROJECTS}${filterUrl}`)
          .then((response) => {
            if (
              type === 'active' ||
              type === 'archived' ||
              response.data.data.length
            ) {
              if (response.data.data.length !== 0) {
                AsyncStorage.setItem(
                  Constant.ASYNC_KEYS.PROJECT_ID,
                  response.data.data[0].id,
                );
              }
              if (type === 'archived') {
                dispatch({
                  archivedProjectPayload: response.data,
                  type: GET_ARCHIVED_PROJECTS_SUCCESS,
                });
              } else if (type === 'active') {
                dispatch({
                  activeProjectPayload: response.data,
                  type: GET_ACTIVE_PROJECTS_SUCCESS,
                });
              } else {
                const isConnectionProject =
                  response.data.data[0].attributes.is_connection_project;
                resolve(isConnectionProject);
                dispatch({
                  projectSessionPayload: response.data,
                  isConnectionProject,
                  type: GET_PROJECTS_SUCCESS,
                });
              }
            } else if (type !== 'archived') {
              dispatch({
                type: SESSION_LOG_OUT,
              });
              dispatch(logOut(Constant.SESSION_OUT_MESSAGE));
            } else {
              dispatch({
                type: SESSION_LOG_OUT,
              });
            }
          })
          .catch((error) => {
            if (
              error &&
              error.data &&
              error.data.errors &&
              error.data.errors.length &&
              error.data.errors.length > 1
            ) {
              reject(error);
              dispatch({
                type: GET_PROJECTS_FAIL,
                error: error.data.errors[1].title,
              });
              dispatch(errorHandler(error.data.errors[1].title));
            }
          });
      }
    });
}

export function projectSwitcher(route) {
  return (dispatch, getState) => {
    const signInData = getUserData(getState());
    dispatch({
      type: SWITCH_PROJECT,
    });
    const resetNavigator = StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: route || 'SplashScreen',
        }),
      ],
    });
    dispatch(resetNavigator);
    if (signInData.type === 'users') {
      dispatch(userSignInInfo(signInData));
    } else {
      signInData.rememberMe = false;
      dispatch(userSignInInfo(signInData));
    }
  };
}

export default function getProjectsReducer(
  state = {
    fetching: false,
    projectSessionPayload: null,
    projectSwitcherPayload: null,
    isConnectionProject: false,
  },
  action,
) {
  switch (action.type) {
    case GET_PROJECTS_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case GET_PROJECTS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        projectSessionPayload: action.projectSessionPayload,
        isConnectionProject: action.isConnectionProject,
      };
    }
    case GET_ARCHIVED_PROJECTS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        archivedProjectPayload: action.archivedProjectPayload,
      };
    }
    case GET_ACTIVE_PROJECTS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        activeProjectPayload: action.activeProjectPayload,
      };
    }
    case GET_PROJECTS_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case SWITCH_PROJECT: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}

// Selectors Function

export const setSideMenuItems = (state) => {
  const {
    getProjects: {projectSessionPayload},
    getSelectedProjectReducer: {selectedProjectPayload},
  } = state;
  let sideMenuColor;
  let projectName;
  let isConnectionProject;
  let communitiesEnabled;
  let externalMaterialsEnabled;
  let activitiesEnabled;
  let assignmentEnabled;
  let logoImage;

  if (projectSessionPayload || selectedProjectPayload) {
    const sideMenuItems = [];
    Constant.SIDE_MENU_ELEMENTS.forEach((obj) => {
      if (obj.isRequired) {
        sideMenuItems.push(obj);
      }
    });
    if (selectedProjectPayload) {
      sideMenuColor =
        selectedProjectPayload.included[0].attributes.primary_color;
      projectName = selectedProjectPayload.data.attributes.display_name;
      isConnectionProject =
        selectedProjectPayload.data.attributes.is_connection_project;
      communitiesEnabled =
        selectedProjectPayload.data.attributes.community_enabled;
      externalMaterialsEnabled =
        selectedProjectPayload.data.attributes.external_materials_enabled;
      activitiesEnabled =
        selectedProjectPayload.data.attributes.activities_enabled;
      assignmentEnabled =
        selectedProjectPayload.data.attributes.assignments_enabled;
      logoImage = selectedProjectPayload.included[0].attributes.logo_id;
    }

    if (projectSessionPayload) {
      const {data, included} = projectSessionPayload;
      sideMenuColor = included[0].attributes.primary_color;
      projectName = data[0].attributes.display_name;
      isConnectionProject = data[0].attributes.is_connection_project;
      communitiesEnabled = data[0].attributes.community_enabled;
      externalMaterialsEnabled = data[0].attributes.external_materials_enabled;
      activitiesEnabled = data[0].attributes.activities_enabled;
      assignmentEnabled = data[0].attributes.assignments_enabled;
      logoImage = included[0].attributes.logo_id;
    }
    return {
      sideMenuItems,
      sideMenuColor,
      projectName,
      isConnectionProject,
      externalMaterialsEnabled,
      assignmentEnabled,
      communitiesEnabled,
      activitiesEnabled,
      logoImage,
    };
  }
  return null;
};

export const getProjectList = (payload) => {
  if (payload) {
    const {data, included} = payload;
    const projectList = data;
    projectList.forEach((item) => {
      included.forEach((includedData) => {
        if (
          item.attributes.partner_id === parseInt(includedData.id, 10) &&
          includedData.type === 'partners'
        ) {
          item.attributes.primary_color = includedData.attributes.primary_color;
          item.attributes.secondary_color =
            includedData.attributes.secondary_color;
          item.attributes.name = includedData.attributes.name;
        }
      });
    });
    return projectList;
  }
  return null;
};
