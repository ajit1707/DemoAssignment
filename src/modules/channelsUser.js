import AsyncStorage from '@react-native-async-storage/async-storage';
import {sortBy, indexOf} from 'lodash';
import {CHANNELS_USER} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';
import {capitalizeFirstLetter} from '../utility/helper';

// Action type for channels user
const CHANNELS_USER_REQUEST = 'CHANNELS_USER_REQUEST';
const CHANNELS_USER_SUCCESS = 'CHANNELS_USER_SUCCESS';
const CHANNELS_USER_FAIL = 'CHANNELS_USER_FAIL';

export function channelsUser() {
  return (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      const {
        getProjects: {projectSessionPayload},
        checkNetwork: {
          isConnected: {isConnected},
        },
        channelsUser: {channelsUserPayload},
      } = getState();
      const projectSwitcherSelectedData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
        () => {},
      );
      const projectId =
        JSON.parse(projectSwitcherSelectedData) ||
        (projectSessionPayload &&
          projectSessionPayload.data.length &&
          projectSessionPayload.data[0]);
      if (!isConnected && channelsUserPayload) {
        resolve(channelsUserPayload);
        dispatch({
          channelsUserPayload,
          type: CHANNELS_USER_SUCCESS,
        });
      } else {
        dispatch({
          type: CHANNELS_USER_REQUEST,
        });
        httpGet(`${CHANNELS_USER}?filter[project_id]=${projectId.id}`)
          .then((response) => {
            resolve(response.data);
            dispatch({
              channelsUserPayload: response.data,
              type: CHANNELS_USER_SUCCESS,
            });
          })
          .catch((error) => {
            if (
              error &&
              error.data &&
              error.data.errors &&
              error.data.errors.length
            ) {
              dispatch({
                type: CHANNELS_USER_FAIL,
                error: error.data.errors[0].title,
              });
              dispatch(errorHandler(error.data.errors[0].title));
            }
          });
      }
    });
}

export default function reducer(
  state = {
    fetching: false,
    channelsUserPayload: null,
  },
  action,
) {
  switch (action.type) {
    case CHANNELS_USER_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case CHANNELS_USER_SUCCESS: {
      return {
        ...state,
        fetching: false,
        channelsUserPayload: action.channelsUserPayload,
      };
    }
    case CHANNELS_USER_FAIL: {
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

export const getChannelsName = (state) => {
  const {
    channelsUser: {channelsUserPayload},
    displayChannelItemsReducer: {channelItems},
  } = state;
  if (
    channelsUserPayload &&
    channelsUserPayload.data &&
    channelsUserPayload.data.length
  ) {
    const {data, included} = channelsUserPayload;
    const userChannelsData = data;
    const channelPayload = [];
    if (userChannelsData && userChannelsData.length) {
      userChannelsData.forEach((item) => {
        included.forEach((includedData) => {
          if (item.attributes.channel_id === parseInt(includedData.id, 10)) {
            item.attributes.channelType = includedData.attributes.channel_type;
          }
        });
      });
    }
    if (userChannelsData && userChannelsData.length) {
      userChannelsData.forEach((channelData) => {
        const channelDataObject = {};
        const {
          attributes: {channelType},
        } = channelData;
        channelDataObject.channelId = channelData.attributes.channel_id;
        channelDataObject.channelType = channelType;
        channelDataObject.userRole = channelData.attributes.role;
        if (channelItems) {
          channelItems.forEach((item) => {
            if (item.channelId === channelData.attributes.channel_id) {
              channelDataObject.notificationCount = item.notificationCount;
            }
          });
        } else {
          channelDataObject.notificationCount = 0;
        }

        if (channelType === 'mentoring') {
          channelDataObject.channelName = capitalizeFirstLetter(
            channelData.attributes.display_name,
          );
          channelDataObject.lastReadAt = capitalizeFirstLetter(
            channelData.attributes.last_read_at,
          );
        } else if (channelType === 'group') {
          channelDataObject.channelName = `${capitalizeFirstLetter(
            channelData.attributes.group_name,
          )}`;
        } else if (channelType === 'support') {
          channelDataObject.channelName = 'Project Support';
        } else {
          channelDataObject.channelName = 'Unknown channel';
        }
        if (channelDataObject.channelName) {
          channelPayload.push(channelDataObject);
        }
      });
    }
    return sortByOrder(channelPayload);
  }
  return null;
};

export function sortByOrder(channelPayload) {
  const order = ['mentoring', 'group', 'support'];
  return sortBy(channelPayload, (items) => indexOf(order, items?.channelType));
}
