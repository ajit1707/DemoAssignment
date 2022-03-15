import {httpGet, httpPost} from '../utility/http';
import Config from '../utility/config';
import {MATCHING_USERS, PROJECT_MATCHES, PROJECT_USERS} from '../utility/apis';
import {navigateToMessage} from '../modules/deepLinkHandler';
import {
  channelSelected,
  displayChannelItems,
  setSelectedChannelItemIndex,
} from './displayChannelItems';
import {getChannels} from './getChannels';
import {channelsUser} from './channelsUser';
import {channelMessage} from './channelMessage';
import {NavigationActions} from 'react-navigation';
import {socketLeaveChannel} from '../utility/phoenix-utils';
import {socketNotification} from './socketNotification';
import {getUserDetails} from './getUserDetail';
import Toast from 'react-native-simple-toast';
import {chosseYourMentorData} from './chosseAsMentor';

// Action type for project codes
const PROJECT_MATCH_REQUEST = 'PROJECT_MATCH_REQUEST';
const PROJECT_MATCH_SUCCESS = 'PROJECT_MATCH_SUCCESS';
const PROJECT_MATCH_FAIL = 'PROJECT_MATCH_FAIL';

const POST_MATCH_REQUEST = 'POST_MATCH_REQUEST';
const POST_MATCH_SUCCESS = 'POST_MATCH_SUCCESS';
const POST_MATCH_FAIL = 'POST_MATCH_FAIL';

const MENTOR_DATA_REQUEST = 'MENTOR_DATA_REQUEST';
const MENTOR_DATA_SUCCESS = 'MENTOR_DATA_SUCCESS';
const MENTOR_DATA_FAIL = 'MENTOR_DATA_FAIL';

const MY_MENTOR_REQUEST = 'MY_MENTOR_REQUEST';
const MY_MENTOR_SUCCESS = 'MY_MENTOR_SUCCESS';
const MY_MENTOR_FAIL = 'MY_MENTOR_FAIL';

// Action
export const postMentorunaviable = (payload, navigate) => async (
  dispatch,
  getState,
) =>
  new Promise(async (resolve, reject) => {
    const {
      typeformMenteeDataReducer: {matchingMentorPayload},
    } = getState();
    dispatch({
      type: POST_MATCH_REQUEST,
    });
    httpPost(`${Config.BASE_URL}/${MATCHING_USERS}/`, payload)
      .then((response) => {
        resolve(response);
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.attributes &&
          response.data.data.attributes.potential_matching_users.length !== 0
        ) {
          dispatch({
            matchingMentorPayload: response.data,
            type: POST_MATCH_SUCCESS,
          });
        } else {
          dispatch({
            matchingMentorPayload: response.data,
            type: POST_MATCH_SUCCESS,
          });
          navigate('MenteeQuestionScreen');
          dispatch(chosseYourMentorData(false));
        }
      })
      .catch((error) => {
        reject(error);
        if (error) {
          navigate('MenteeQuestionScreen');
        }
        dispatch({
          type: POST_MATCH_FAIL,
        });
      });
  });
export const postMentorFile = (payload, navigate) => async (
  dispatch,
  getState,
) =>
  new Promise(async (resolve, reject) => {
    const {
      typeformMenteeDataReducer: {matchingMentorPayload},
    } = getState();
    dispatch({
      type: POST_MATCH_REQUEST,
    });
    httpPost(`${Config.BASE_URL}/${MATCHING_USERS}/`, payload)
      .then((response) => {
        resolve(response);
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.attributes &&
          response.data.data.attributes.potential_matching_users.length !== 0
        ) {
          dispatch({
            matchingMentorPayload: response.data,
            type: POST_MATCH_SUCCESS,
          });
        } else {
          const mentorPayload = {
            data: {
              type: matchingMentorPayload.data.type,
              attributes: {
                respondent_id:
                  matchingMentorPayload.data.attributes.respondent_id,
                project_id: matchingMentorPayload.data.attributes.project_id,
              },
            },
          };
          dispatch(postMentorunaviable(mentorPayload, navigate)).then((res) => {
            navigate('MenteeQuestionScreen');
            if (
              res &&
              res.data &&
              res.data.data &&
              res.data.data.attributes &&
              res.data.data.attributes.potential_matching_users.length !== 0
            ) {
              Toast.showWithGravity(
                'Mentor is currently unavailable',
                Toast.SHORT,
                Toast.BOTTOM,
              );
            } else {
              Toast.showWithGravity(
                'Mentor Matching Tool - needs a top-up!\n' +
                  "All the mentors on this project have already been snapped up! We'll allocate more amazing mentors very soon and notify you when you can try again!",
                Toast.LONG,
                Toast.BOTTOM,
              );
            }
            dispatch(chosseYourMentorData(false));
          });
        }
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: POST_MATCH_FAIL,
        });
      });
  });
export const projectMatch = (payload, navigation, screenProps) => async (
  dispatch,
  getState,
) =>
  new Promise(async (resolve, reject) => {
    const {
      checkNetwork: {isConnected},
      displayChannelItemsReducer: {channelItems},
      typeformMenteeDataReducer: {matchingMentorPayload},
    } = getState();
    dispatch({
      type: PROJECT_MATCH_REQUEST,
    });
    httpPost(`${Config.BASE_URL}/${PROJECT_MATCHES}/`, payload)
      .then((response) => {
        resolve(response);
        dispatch(getUserDetails());
        dispatch(getChannels());
        dispatch(channelsUser()).then(() => {
          dispatch(displayChannelItems(channelItems)).then(() => {
            const channelId = response.data.data.attributes.channel_id;
            dispatch(navigateToMessage(channelId, screenProps));
          });
        });
        dispatch({
          matchingPayload: response.data,
          type: PROJECT_MATCH_SUCCESS,
        });
      })
      .catch((error) => {
        if (
          error &&
          error.data &&
          error.data.errors &&
          error.data.errors.length &&
          ((error.data.errors.length === 1 &&
            error.data.errors[0].title === 'Mentor is currently unavailable') ||
            (error.data.errors.length === 2 &&
              error.data.errors[1].title ===
                'Mentor is currently unavailable') ||
            (error.data.errors.length === 3 &&
              error.data.errors[2].title === 'Mentor is currently unavailable'))
        ) {
          const payload = {
            data: {
              type: matchingMentorPayload.data.type,
              attributes: {
                respondent_id:
                  matchingMentorPayload.data.attributes.respondent_id,
                project_id: matchingMentorPayload.data.attributes.project_id,
              },
            },
          };
          dispatch(postMentorFile(payload, navigation)).then((res) => {
            if (
              res &&
              res.data &&
              res.data.data &&
              res.data.data.attributes &&
              res.data.data.attributes.potential_matching_users.length !== 0
            ) {
              Toast.showWithGravity(
                'Mentor is currently unavailable',
                Toast.SHORT,
                Toast.BOTTOM,
              );
            } else {
              Toast.showWithGravity(
                'Mentor Matching Tool - needs a top-up!\n' +
                  "All the mentors on this project have already been snapped up! We'll allocate more amazing mentors very soon and notify you when you can try again!",
                Toast.LONG,
                Toast.BOTTOM,
              );
            }
            navigation('MenteeQuestionScreen');
            dispatch(chosseYourMentorData(false));
          });
        }
        reject(error);
        dispatch({
          type: PROJECT_MATCH_FAIL,
        });
      });
  });

export const chatBot = () => async (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const {
      getchannels: {channelsPayload},
      channelMessage: {currentChannelData},
    } = getState();
    if (
      channelsPayload &&
      channelsPayload.data &&
      channelsPayload.data.length &&
      channelsPayload.included &&
      channelsPayload.included.length &&
      currentChannelData &&
      currentChannelData.hasOwnProperty('channelId')
    ) {
      const channelId = currentChannelData.channelId;
      if (channelId) {
        const mentorData = channelsPayload.included.filter(
          (item) =>
            item.type === 'channel_users' &&
            item.attributes.role === 'mentor' &&
            item.attributes.channel_id === channelId,
        );
        if (
          mentorData &&
          mentorData.length &&
          mentorData[0].hasOwnProperty('attributes') &&
          mentorData[0].attributes.hasOwnProperty('project_user_id')
        ) {
          const projectUserId = mentorData[0].attributes.project_user_id;
          if (projectUserId) {
            dispatch({
              type: MENTOR_DATA_REQUEST,
            });
            httpGet(`${PROJECT_USERS}/${projectUserId}?include=mentor_profiles`)
              .then((response) => {
                resolve(response);
                dispatch({
                  mentorPayload: response.data,
                  type: MENTOR_DATA_SUCCESS,
                });
              })
              .catch((error) => {
                reject(error);
                dispatch({
                  type: MENTOR_DATA_FAIL,
                });
              });
          }
        }
      }
    }
  });

export const mentorProfile = () => async (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const {
      getchannels: {channelsPayload},
    } = getState();
    if (
      channelsPayload &&
      channelsPayload.data &&
      channelsPayload.data.length &&
      channelsPayload.included &&
      channelsPayload.included.length
    ) {
      const mentoringChannel = channelsPayload.data.filter(
        (item) =>
          item.type === 'channels' &&
          item.attributes.channel_type === 'mentoring',
      );
      const mentorData = channelsPayload.included.filter(
        (item) =>
          item.type === 'channel_users' &&
          item.attributes.role === 'mentor' &&
          mentoringChannel &&
          mentoringChannel.length &&
          String(item.attributes.channel_id) === mentoringChannel[0].id,
      );
      if (
        mentorData &&
        mentorData.length &&
        mentorData[0].hasOwnProperty('attributes') &&
        mentorData[0].attributes.hasOwnProperty('project_user_id')
      ) {
        const projectUserId = mentorData[0].attributes.project_user_id;
        if (projectUserId) {
          dispatch({
            type: MY_MENTOR_REQUEST,
          });
          httpGet(
            `${PROJECT_USERS}/${projectUserId}?include=mentor_profiles,mentor_profiles.project_user.user`,
          )
            .then((response) => {
              resolve(response);
              dispatch({
                myMentorPayload: response.data,
                type: MY_MENTOR_SUCCESS,
              });
            })
            .catch((error) => {
              reject(error);
              dispatch({
                type: MY_MENTOR_FAIL,
              });
            });
        }
      }
    }
  });
// Reducer
export default function typeformMenteeDataReducer(
  state = {
    fetching: false,
    matchingMentorPayload: null,
    matchingPayload: null,
    mentorPayload: null,
    myMentorPayload: null,
  },
  action,
) {
  switch (action.type) {
    case POST_MATCH_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case POST_MATCH_SUCCESS: {
      return {
        ...state,
        fetching: false,
        matchingMentorPayload: action.matchingMentorPayload,
      };
    }
    case POST_MATCH_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case PROJECT_MATCH_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case PROJECT_MATCH_SUCCESS: {
      return {
        ...state,
        fetching: false,
        matchingPayload: action.matchingPayload,
      };
    }
    case PROJECT_MATCH_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case MENTOR_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case MENTOR_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        mentorPayload: action.mentorPayload,
      };
    }
    case MENTOR_DATA_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case MY_MENTOR_REQUEST: {
      return {
        ...state,
        fetching: true,
        error: '',
      };
    }
    case MY_MENTOR_SUCCESS: {
      return {
        ...state,
        fetching: false,
        myMentorPayload: action.myMentorPayload,
      };
    }
    case MY_MENTOR_FAIL: {
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
