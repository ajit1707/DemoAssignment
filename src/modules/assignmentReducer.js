import Config from '../utility/config';
import {ASSIGNMENT_DATA} from '../utility/apis';
import {httpGet} from '../utility/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constant from '../utility/constant';

// Action types to fetch the file name and date of submission
const GET_ASSIGNMENT_DATA_REQUEST = 'GET_ASSIGNMENT_DATA_REQUEST';
const GET_ASSIGNMENT_DATA_SUCCESS = 'GET_ASSIGNMENT_DATA_SUCCESS';
const GET_ASSIGNMENT_DATA_FAIL = 'GET_ASSIGNMENT_DATA_FAIL';
const CLEAR_PROJECT_MATERIAL_DATA = 'CLEAR_PROJECT_MATERIAL_DATA';
const CLEAR_PROJECT_MATERIAL_STATE_DATA = 'CLEAR_PROJECT_MATERIAL_STATE_DATA';

export function getAssignmentData(pageNumber) {
  return async (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: GET_ASSIGNMENT_DATA_REQUEST,
      });
      const projectId = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_ID,
      );
      httpGet(
        `${ASSIGNMENT_DATA}?filter[project_id]=${projectId}&include=project_user.user&page[number]=${pageNumber}&page[size]=10&sort=-created_at`,
      )
        .then((response) => {
          resolve(response);
          dispatch({
            getAssignmentPayload: response.data,
            type: GET_ASSIGNMENT_DATA_SUCCESS,
            pageNumber,
          });
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: GET_ASSIGNMENT_DATA_FAIL,
          });
        });
    });
}
export const resetAssignmentData = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROJECT_MATERIAL_DATA,
  });
};

export const resetAssignmentStateData = (state) => (dispatch) => {
  dispatch({
    state,
    type: CLEAR_PROJECT_MATERIAL_STATE_DATA,
  });
};
export default function getAssignmentDataReducer(
  state = {
    fetching: false,
    backPress: false,
    getAssignmentPayload: null,
    pageNumber: 1,
  },
  action,
) {
  switch (action.type) {
    case GET_ASSIGNMENT_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_ASSIGNMENT_DATA_SUCCESS: {
      if (action.pageNumber === 1) {
        return {
          ...state,
          getAssignmentPayload: action.getAssignmentPayload,
          fetching: false,
          pageNumber: action.pageNumber + 1,
        };
      }
      return {
        ...state,
        getAssignmentPayload: {
          ...state.getAssignmentPayload,
          data: [
            ...state.getAssignmentPayload.data,
            ...action.getAssignmentPayload.data,
          ],
          included: [
            ...state.getAssignmentPayload.included,
            ...action.getAssignmentPayload.included,
          ],
        },
        fetching: false,
        pageNumber: action.pageNumber + 1,
      };
    }
    case GET_ASSIGNMENT_DATA_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case CLEAR_PROJECT_MATERIAL_DATA: {
      return {
        ...state,
        getAssignmentPayload: [],
      };
    }
    case CLEAR_PROJECT_MATERIAL_STATE_DATA: {
      return {
        ...state,
        backPress: action.state,
      };
    }
    default: {
      return state;
    }
  }
}
