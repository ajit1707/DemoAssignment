import AsyncStorage from '@react-native-async-storage/async-storage';
import {CHANNELS, MATCHING_USERS} from '../utility/apis';
import {httpGet, httpPost} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';
import Config from '../utility/config';

// Action type for channels user
const CHANNELS_REQUEST = 'CHANNELS_REQUEST';
const CHANNELS_SUCCESS = 'CHANNELS_SUCCESS';
const CHANNELS_FAIL = 'CHANNELS_FAIL';

export const getChannels = () => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    const userDetails = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.USER_DETAILS,
      () => {},
    );
    const projectUserId = JSON.parse(userDetails);
    dispatch({
      type: CHANNELS_REQUEST,
    });
    httpGet(`${CHANNELS}?filter[project_user]=${projectUserId.data.data[0].id}`)
      .then((response) => {
        resolve(response);
        dispatch({
          channelsPayload: response.data,
          type: CHANNELS_SUCCESS,
        });
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: CHANNELS_FAIL,
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
export default function reducer(
  state = {
    fetching: false,
    channelsUserPayload: null,
    channelsPayload: null,
  },
  action,
) {
  switch (action.type) {
    case CHANNELS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case CHANNELS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        channelsPayload: action.channelsPayload,
      };
    }
    case CHANNELS_FAIL: {
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

export const getArchiveChannelData = (state) => {
  const {
    getchannels: {channelsPayload},
    channelMessage: {currentChannelData},
  } = state;
  return channelsPayload &&
    channelsPayload.included &&
    channelsPayload.included.length &&
    currentChannelData &&
    currentChannelData.hasOwnProperty('channelId')
    ? channelsPayload.included.find(
        (item) =>
          item.attributes.channel_id === currentChannelData.channelId &&
          item.attributes.role === currentChannelData.userRole,
      )
    : null;
};
