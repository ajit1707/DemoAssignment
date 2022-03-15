import Axios from 'axios';
import {UPLOAD_ATTACHMENTS} from '../utility/apis';
import Config from '../utility/config';

// Action type for side menu
const UPLOAD_ATTACHMENTS_REQUEST = 'UPLOAD_ATTACHMENTS_REQUEST';
const UPLOAD_ATTACHMENTS_SUCCESS = 'UPLOAD_ATTACHMENTS_SUCCESS';
const UPLOAD_ATTACHMENTS_FAIL = 'UPLOAD_ATTACHMENTS_FAIL';

export function uploadAttachments(payload, referer) {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: UPLOAD_ATTACHMENTS_REQUEST,
      });
      const header = {
        'Content-type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
        Referer: `http://dev.angular.brightsidementoring.tudip.uk/${referer}`,
      };
      Axios.post(`${Config.ATTACHMENT_URL}${UPLOAD_ATTACHMENTS}`, payload, {
        headers: header,
      })
        .then((response) => {
          resolve(response);
          dispatch({
            uploadAttachmentsData: response,
            type: UPLOAD_ATTACHMENTS_SUCCESS,
          });
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: UPLOAD_ATTACHMENTS_FAIL,
          });
          //  dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export default function reducer(
  state = {
    fetching: false,
    uploadAttachmentsData: null,
  },
  action,
) {
  switch (action.type) {
    case UPLOAD_ATTACHMENTS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case UPLOAD_ATTACHMENTS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        uploadAttachmentsData: action.uploadAttachmentsData,
      };
    }
    case UPLOAD_ATTACHMENTS_FAIL: {
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
