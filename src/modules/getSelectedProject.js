import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET_PROJECTS} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';

// Action type for side menu
const GET_SELECTED_PROJECT_REQUEST = 'GET_SELECTED_PROJECT_REQUEST';
const GET_SELECTED_PROJECT_SUCCESS = 'GET_SELECTED_PROJECT_SUCCESS';
const GET_SELECTED_PROJECTS_FAIL = 'GET_SELECTED_PROJECTS_FAIL';

export function getSelectedProject() {
  return (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      const projectSwitcherSelectedData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
        () => {},
      );
      const parsedProjectData = JSON.parse(projectSwitcherSelectedData);
      const {
        getSelectedProjectReducer: {selectedProjectPayload},
        checkNetwork: {
          isConnected: {isConnected},
        },
      } = getState();
      if (!isConnected && selectedProjectPayload) {
        resolve(selectedProjectPayload);
        const isConnectionProject =
          selectedProjectPayload.data.attributes.is_connection_project;
        dispatch({
          type: GET_SELECTED_PROJECT_SUCCESS,
          selectedProjectPayload,
          isConnectionProject,
        });
      } else {
        dispatch({
          type: GET_SELECTED_PROJECT_REQUEST,
        });
        httpGet(`${GET_PROJECTS}/${parsedProjectData.id}`)
          .then((response) => {
            if (response && response.data && response.data.data) {
              AsyncStorage.setItem(
                Constant.ASYNC_KEYS.PROJECT_ID,
                response.data.data.id,
              );
              const isConnectionProject =
                response.data.data.attributes.is_connection_project;
              resolve(isConnectionProject);
              dispatch({
                type: GET_SELECTED_PROJECT_SUCCESS,
                selectedProjectPayload: response.data,
                isConnectionProject,
              });
            }
          })
          .catch((error) => {
            reject(error);
            if (
              error &&
              error.data &&
              error.data.errors &&
              error.data.errors.length &&
              error.data.errors.length > 1
            ) {
              dispatch({
                type: GET_SELECTED_PROJECTS_FAIL,
                error: error.data.errors[1].title,
              });
              dispatch(errorHandler(error.data.errors[1].title));
            }
          });
      }
    });
}

export default function getSelectedProjectReducer(
  state = {
    fetching: false,
    selectedProjectPayload: null,
  },
  action,
) {
  switch (action.type) {
    case GET_SELECTED_PROJECT_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case GET_SELECTED_PROJECT_SUCCESS: {
      return {
        ...state,
        fetching: false,
        selectedProjectPayload: action.selectedProjectPayload,
        isConnectionProject: action.isConnectionProject,
      };
    }
    case GET_SELECTED_PROJECTS_FAIL: {
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
