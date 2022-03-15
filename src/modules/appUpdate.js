import {APP_UPDATE} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';

const GET_APP_UPDATE_REQUEST = 'GET_APP_UPDATE_REQUEST';
const GET_APP_UPDATE_SUCCESS = 'GET_APP_UPDATE_SUCCESS';
const GET_APP_UPDATE_FAIL = 'GET_APP_UPDATE_FAIL';

export function appUpdateCheck() {
  return async (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: GET_APP_UPDATE_REQUEST,
      });
      httpGet(`${APP_UPDATE}`)
        .then((response) => {
          if (
            response &&
            response.data &&
            response.data.data &&
            response.data.data.hasOwnProperty('attributes')
          ) {
            const {
              data: {
                data: {attributes},
              },
            } = response;
            dispatch({
              appUpdatePayload: attributes,
              type: GET_APP_UPDATE_SUCCESS,
            });
            resolve(attributes);
          }
        })
        .catch((error) => {
          dispatch({
            type: GET_APP_UPDATE_FAIL,
            error,
          });
          if (error) {
            errorHandler(error);
            reject(error);
          }
        });
    });
}

export default function algoliaSearch(
  state = {
    fetching: false,
    appUpdatePayload: null,
  },
  action,
) {
  switch (action.type) {
    case GET_APP_UPDATE_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case GET_APP_UPDATE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        appUpdatePayload: action.appUpdatePayload,
      };
    }
    case GET_APP_UPDATE_FAIL: {
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
