import {httpGet, httpPost} from '../utility/http';
import Config from '../utility/config';
import {ASSIGNMENT_DATA, UPLOAD_ATTACHMENTS} from '../utility/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constant from '../utility/constant';

const UPLOAD_ASSIGNMENT_FILE_REQUEST = 'UPLOAD_ASSIGNMENT_FILE_REQUEST';
const UPLOAD_ASSIGNMENT_FILE_SUCCESS = 'UPLOAD_ASSIGNMENT_FILE_SUCCESS';
const UPLOAD_ASSIGNMENT_FILE_FAIL = 'UPLOAD_ASSIGNMENT_FILE_FAIL';

export function uploadAssignmentFile(payload) {
  return async (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: UPLOAD_ASSIGNMENT_FILE_REQUEST,
      });
      const projectId = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_ID,
      );
      const {
        data: {attributes},
      } = payload;
      attributes.project_id = projectId;
      httpPost('assignments', payload)
        .then((response) => {
          resolve(response);
          dispatch({
            getAssignmentFilePayload: response.data,
            type: UPLOAD_ASSIGNMENT_FILE_SUCCESS,
          });
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: UPLOAD_ASSIGNMENT_FILE_FAIL,
          });
        });
    });
}
export default function uploadAssignmentFileReducer(
  state = {
    fetching: false,
    uploadAssignmentFileData: null,
  },
  action,
) {
  switch (action.type) {
    case UPLOAD_ASSIGNMENT_FILE_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case UPLOAD_ASSIGNMENT_FILE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        getAssignmentFilePayload: action.getAssignmentFilePayload,
      };
    }
    case UPLOAD_ASSIGNMENT_FILE_FAIL: {
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
