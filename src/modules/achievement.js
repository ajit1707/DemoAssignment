import {httpGet, httpPost} from '../utility/http';
import Config from '../utility/config';
import {MATCHING_USERS} from '../utility/apis';
import Toast from 'react-native-simple-toast';
import Constant from '../utility/constant';

const EARNED_BATCH_REQUEST = 'EARNED_BATCH_REQUEST';
const EARNED_BATCH_SUCCESS = 'EARNED_BATCH_SUCCESS';
const EARNED_BATCH_FAIL = 'EARNED_BATCH_FAIL';

const AVAILABLE_BATCH_REQUEST = 'AVAILABLE_BATCH_REQUEST';
const AVAILABLE_BATCH_SUCCESS = 'AVAILABLE_BATCH_SUCCESS';
const AVAILABLE_BATCH_FAIL = 'AVAILABLE_BATCH_FAIL';

const MESSAGE_STREAK_REQUEST = 'MESSAGE_STREAK_REQUEST';
const MESSAGE_STREAK_SUCCESS = 'MESSAGE_STREAK_SUCCESS';
const MESSAGE_STREAK_FAIL = 'MESSAGE_STREAK_FAIL';

const BADGE_DATA_REQUEST = 'BADGE_DATA_REQUEST';
const BADGE_DATA_SUCCESS = 'BADGE_DATA_SUCCESS';
const BADGE_DATA_FAIL = 'BADGE_DATA_FAIL';

const MISSION_DATA_REQUEST = 'MISSION_DATA_REQUEST';
const MISSION_DATA_SUCCESS = 'MISSION_DATA_SUCCESS';
const MISSION_DATA_FAIL = 'MISSION_DATA_FAIL';

const CERTIFICATE_DATA_REQUEST = 'CERTIFICATE_DATA_REQUEST';
const CERTIFICATE_DATA_SUCCESS = 'CERTIFICATE_DATA_SUCCESS';
const CERTIFICATE_DATA_FAIL = 'CERTIFICATE_DATA_FAIL';

export const earnedBatch = (projectUserId) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: EARNED_BATCH_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}/badges?filter[earned_badges]=${projectUserId}&include=project_user_badges`,
    )
      .then((response) => {
        resolve(response);
        dispatch({
          earnedBatchDataPayload: response.data,
          type: EARNED_BATCH_SUCCESS,
        });
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: EARNED_BATCH_FAIL,
        });
      });
  });

export const availableBatch = (projectUserId) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: AVAILABLE_BATCH_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}/badges?filter[available_badges]=${projectUserId}`,
    )
      .then((response) => {
        resolve(response);
        dispatch({
          availableBatchDataPayload: response.data,
          type: AVAILABLE_BATCH_SUCCESS,
        });
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: AVAILABLE_BATCH_FAIL,
        });
      });
  });

export const messageStreak = (payload) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: MESSAGE_STREAK_REQUEST,
    });
    httpPost(`${Config.BASE_URL}/message_streaks`, payload)
      .then((response) => {
        resolve(response);
        dispatch({
          messageStreakPayload: response.data,
          type: MESSAGE_STREAK_SUCCESS,
        });
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: MESSAGE_STREAK_FAIL,
        });
      });
  });

export const badgeData = (projectUserId) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: BADGE_DATA_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}/badges?filter[all_badges]=${projectUserId}&include=project_user_badges`,
    )
      .then((response) => {
        resolve(response);
        dispatch({
          badgePayload: response.data,
          type: BADGE_DATA_SUCCESS,
        });
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: BADGE_DATA_FAIL,
        });
      });
  });

export const missionBatch = (projectUserId) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: MISSION_DATA_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}/badges?fields[badges]=title&filter[mission_accomplished]=${projectUserId}&include=project_user_badges`,
    )
      .then((response) => {
        resolve(response);
        dispatch({
          missionPayload: response.data,
          type: MISSION_DATA_SUCCESS,
        });
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: MISSION_DATA_FAIL,
        });
      });
  });

export const certficateDownload = (payload) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: CERTIFICATE_DATA_REQUEST,
    });
    httpPost(`${Config.BASE_URL}/gamification_certificates`, payload)
      .then((response) => {
        resolve(response);
        dispatch({
          certificatePayload: response.data,
          type: CERTIFICATE_DATA_SUCCESS,
        });
      })
      .catch((error) => {
        reject(error);
        if (
          error &&
          error.data &&
          error.data.errors &&
          error.data.errors.length &&
          error.data.errors[0].title
        ) {
          Toast.showWithGravity(
            error.data.errors[0].title,
            Toast.LONG,
            Toast.BOTTOM,
          );
          dispatch({
            type: CERTIFICATE_DATA_FAIL,
          });
        }
      });
  });

const dataWithTime = (badgeData) => {
  if (
    badgeData &&
    badgeData.data &&
    badgeData.data.length &&
    badgeData.included &&
    badgeData.included.length
  ) {
    badgeData.data.forEach((idOfBatch) => {
      badgeData.included.forEach((includedBatchId) => {
        if (includedBatchId.attributes.badge_id == idOfBatch.id) {
          idOfBatch.date = includedBatchId.attributes.created_at;
        }
      });
    });
    return badgeData;
  }
};

export default function achievementReducer(
  state = {
    fetching: false,
    earnedBatchDataPayload: null,
    availableBatchDataPayload: null,
    messageStreakPayload: null,
    badgePayload: null,
    missionPayload: null,
    certificatePayload: null,
  },
  action,
) {
  switch (action.type) {
    case EARNED_BATCH_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case EARNED_BATCH_SUCCESS: {
      const earnedBatchDataWithTime = dataWithTime(
        action.earnedBatchDataPayload,
      );
      return {
        ...state,
        fetching: false,
        earnedBatchDataPayload: earnedBatchDataWithTime,
      };
    }
    case EARNED_BATCH_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case AVAILABLE_BATCH_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case AVAILABLE_BATCH_SUCCESS: {
      return {
        ...state,
        fetching: false,
        availableBatchDataPayload: action.availableBatchDataPayload,
      };
    }
    case AVAILABLE_BATCH_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case MESSAGE_STREAK_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case MESSAGE_STREAK_SUCCESS: {
      return {
        ...state,
        fetching: false,
        messageStreakPayload: action.messageStreakPayload,
      };
    }
    case MESSAGE_STREAK_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case BADGE_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case BADGE_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        badgePayload: action.badgePayload,
      };
    }
    case BADGE_DATA_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case MISSION_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case MISSION_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        missionPayload: action.missionPayload,
      };
    }
    case MISSION_DATA_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case CERTIFICATE_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case CERTIFICATE_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        certificatePayload: action.certificatePayload,
      };
    }
    case CERTIFICATE_DATA_FAIL: {
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
