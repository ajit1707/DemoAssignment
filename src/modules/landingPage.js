import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {
  ASK_GRADUATE,
  POSTS,
  GRADUATES,
  GRADUATE_QUESTIONS,
  CONNECTION_LANDING_PAGES,
} from '../utility/apis';
import {httpGet, httpPost} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';
import Config from '../utility/config';
import {USER_DATA} from './userSignIn';

// Action types for Ask The Graduate
const GET_ASK_GRADUATE_REQUEST = 'GET_ASK_GRADUATE_REQUEST';
const GET_ASK_GRADUATE_SUCCESS = 'GET_ASK_GRADUATE_SUCCESS';
const GET_ASK_GRADUATE_FAIL = 'GET_ASK_GRADUATE_FAIL';

// Action types to fetch Trending Posts
const TRENDING_POST_REQUEST = 'TRENDING_POST_REQUEST';
const TRENDING_POST_SUCCESS = 'TRENDING_POST_SUCCESS';
const TRENDING_POST_FAIL = 'TRENDING_POST_FAIL';

// Action types to fetch Answer
const GRADUATE_ANSWER_REQUEST = 'GRADUATE_ANSWER_REQUEST';
const GRADUATE_ANSWER_SUCCESS = 'GRADUATE_ANSWER_SUCCESS';
const GRADUATE_ANSWER_FAIL = 'GRADUATE_ANSWER_FAIL';

// Action types to send question to Graduate
const SEND_QUESTION_GRADUATE_REQUEST = 'SEND_QUESTION_GRADUATE_REQUEST';
const SEND_QUESTION_GRADUATE_SUCCESS = 'SEND_QUESTION_GRADUATE_SUCCESS';
const SEND_QUESTION_GRADUATE_FAIL = 'SEND_QUESTION_GRADUATE_FAIL';

// Action types to get upcoming event and story details
const GET_EVENT_STORY_REQUEST = 'GET_EVENT_STORY_REQUEST';
const GET_EVENT_STORY_SUCCESS = 'GET_EVENT_STORY_SUCCESS';
const GET_EVENT_STORY_FAIL = 'GET_EVENT_STORY_FAIL';

const ACTIVE_GURU_DATA = 'ACTIVE_GURU_DATA';
const INACTIVE_GURU_DATA = 'INACTIVE_GURU_DATA';

// Action creator for Ask The Graduate
export function getAskGraduateDetail(screenKey) {
  return (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      const {
        getProjects: {projectSessionPayload},
      } = getState();
      const projectSwitcherSelectedData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
        () => {},
      );
      const projectId = projectSwitcherSelectedData
        ? JSON.parse(projectSwitcherSelectedData)
        : projectSessionPayload.data[0];
      if (!screenKey) {
        dispatch({
          type: GET_ASK_GRADUATE_REQUEST,
        });
      }
      httpGet(
        `${ASK_GRADUATE}?filter[project_id]=${projectId.id}&include=graduates`,
      )
        .then((response) => {
          resolve(response);
          dispatch({
            getAskGraduateDetailsPayload: response.data,
            type: GET_ASK_GRADUATE_SUCCESS,
          });
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: GET_ASK_GRADUATE_FAIL,
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
}

// Action creator to fetch Answer
export function getGraduateAnswer(id) {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: GRADUATE_ANSWER_REQUEST,
      });
      httpGet(`${GRADUATES}/${id}/graduate_answers`)
        .then((response) => {
          resolve(response);
          dispatch({
            graduateAnswerPayload: response.data,
            type: GRADUATE_ANSWER_SUCCESS,
          });
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: GRADUATE_ANSWER_FAIL,
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
}

// Action creator to send question to Graduate
export function sendGraduateQuestion(payload) {
  return async (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: SEND_QUESTION_GRADUATE_REQUEST,
      });
      httpPost(`${GRADUATE_QUESTIONS}`, payload)
        .then((response) => {
          resolve(response);
          dispatch({
            sendQuestionGraduatePayload: response.data,
            type: SEND_QUESTION_GRADUATE_SUCCESS,
          });
          dispatch(errorHandler(Constant.QUESTION_SUBMIT_SUCCESS, 'Success'));
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: SEND_QUESTION_GRADUATE_FAIL,
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
}

// Action creator to fetch Trending Posts
export function getTrendingPost() {
  return (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      const {
        getProjects: {projectSessionPayload},
      } = getState();
      const projectSwitcherSelectedData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
        () => {},
      );
      const projectId = projectSwitcherSelectedData
        ? JSON.parse(projectSwitcherSelectedData)
        : projectSessionPayload.data[0];
      dispatch({
        type: TRENDING_POST_REQUEST,
      });
      httpGet(
        `${POSTS}?page[size]=3&page[number]=1&filter[trending_for]=${projectId.id}`,
      )
        .then((response) => {
          resolve(response);
          dispatch({
            getTrendingPostPayload: response.data,
            type: TRENDING_POST_SUCCESS,
          });
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: TRENDING_POST_FAIL,
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
}

// Action creator to fetch details of Upcoming Events card.
export function getEventAndStoryDetails() {
  return (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      const {
        getProjects: {projectSessionPayload},
      } = getState();
      const projectSwitcherSelectedData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
        () => {},
      );
      const projectId = projectSwitcherSelectedData
        ? JSON.parse(projectSwitcherSelectedData)
        : projectSessionPayload.data[0];
      dispatch({
        type: GET_EVENT_STORY_REQUEST,
      });
      // http://dev.brightsideapi.tudip.uk/connection_landing_pages?filter[project_id]=10&page[number]=1&page[size]=1
      httpGet(
        `${CONNECTION_LANDING_PAGES}?filter[project_id]=${projectId.id}&page[number]=1&page[size]=1`,
      )
        .then((response) => {
          resolve(response);
          dispatch({
            getEventStoryDetailPayload: response.data,
            type: GET_EVENT_STORY_SUCCESS,
          });
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: GET_EVENT_STORY_FAIL,
          });
          if (
            error &&
            error.data &&
            error.data.errors.length &&
            error.data.errors[0].title !== 'Forbidden'
          ) {
            dispatch(errorHandler(error.data.errors[0].title));
          }
        });
    });
}
export const activeGuruData = (userInfo) => (dispatch) => {
  dispatch({
    type: ACTIVE_GURU_DATA,
    activeData: userInfo,
  });
};
export const inActiveGuruData = (userdata) => (dispatch) => {
  dispatch({
    type: INACTIVE_GURU_DATA,
    inActiveData: userdata,
  });
};
export const askGraduateCardReducer = function reducer(
  state = {
    fetching: false,
    activeData: null,
    inActiveData: null,
    getAskGraduateDetailsPayload: null,
    graduateAnswerPayload: null,
    sendQuestionGraduatePayload: null,
  },
  action,
) {
  switch (action.type) {
    case ACTIVE_GURU_DATA: {
      return {
        ...state,
        activeData: action.activeData,
      };
    }
    case INACTIVE_GURU_DATA: {
      return {
        ...state,
        inActiveData: action.inActiveData,
      };
    }
    case GET_ASK_GRADUATE_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_ASK_GRADUATE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        getAskGraduateDetailsPayload: action.getAskGraduateDetailsPayload,
      };
    }
    case GET_ASK_GRADUATE_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case GRADUATE_ANSWER_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GRADUATE_ANSWER_SUCCESS: {
      return {
        ...state,
        fetching: false,
        graduateAnswerPayload: action.graduateAnswerPayload,
      };
    }
    case GRADUATE_ANSWER_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case SEND_QUESTION_GRADUATE_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case SEND_QUESTION_GRADUATE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        sendQuestionGraduatePayload: action.sendQuestionGraduatePayload,
      };
    }
    case SEND_QUESTION_GRADUATE_FAIL: {
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
};

export const getTrendingPostReducer = function reducer(
  state = {
    fetching: false,
    getTrendingPostPayload: null,
  },
  action,
) {
  switch (action.type) {
    case TRENDING_POST_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case TRENDING_POST_SUCCESS: {
      return {
        ...state,
        fetching: false,
        getTrendingPostPayload: action.getTrendingPostPayload,
      };
    }
    case TRENDING_POST_FAIL: {
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
};

export const getEventStoryDetailReducer = function reducer(
  state = {
    fetching: false,
    getEventStoryDetailPayload: null,
  },
  action,
) {
  switch (action.type) {
    case GET_EVENT_STORY_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_EVENT_STORY_SUCCESS: {
      return {
        ...state,
        fetching: false,
        getEventStoryDetailPayload: action.getEventStoryDetailPayload,
      };
    }
    case GET_EVENT_STORY_FAIL: {
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
};

// Selectors Function to set variables of Ask Graduate card

export const setAskGraduateVariables = (state) => {
  const {
    getProjects: {projectSessionPayload},
    getSelectedProjectReducer: {selectedProjectPayload},
    askGraduateCardReducer: {getAskGraduateDetailsPayload},
  } = state;
  let askGraduatesEnabled;
  if (projectSessionPayload && projectSessionPayload.data) {
    askGraduatesEnabled =
      projectSessionPayload.data[0].attributes.ask_graduate_enabled;
  }

  if (selectedProjectPayload && selectedProjectPayload.data) {
    askGraduatesEnabled =
      selectedProjectPayload.data.attributes.ask_graduate_enabled;
  }
  let expertTitle;
  let expertIsAvailable;
  let expertImageURL;
  let expertSubtitle;
  let expertName;
  let expertImageAvailable;
  let imageId;
  let name;

  if (askGraduatesEnabled) {
    if (
      getAskGraduateDetailsPayload &&
      getAskGraduateDetailsPayload.data &&
      getAskGraduateDetailsPayload.data[0]
    ) {
      expertTitle = getAskGraduateDetailsPayload.data[0].attributes
        .replacement_text_enabled
        ? getAskGraduateDetailsPayload.data[0].attributes.replacement_text
        : 'Graduate';
    }

    if (getAskGraduateDetailsPayload && getAskGraduateDetailsPayload.included) {
      const {included: listOfGraduates} = getAskGraduateDetailsPayload;
      const activeGraduate = listOfGraduates.filter(
        (graduate) => graduate.attributes.state === 'active',
      );
      if (activeGraduate.length) {
        expertImageAvailable = !!activeGraduate[0].attributes.image_id;
        expertIsAvailable = true;
        [
          {
            attributes: {title: expertSubtitle, image_id: imageId, name},
          },
        ] = activeGraduate;
        expertImageURL = imageId
          ? `${Config.IMAGE_SERVER_CDN}${imageId}`
          : null;
        expertName = name.replace(/ .*/, ''); // regex to extract first name from name.
      } else {
        expertIsAvailable = false;
        expertSubtitle = null;
        expertImageURL = null;
      }
    } else {
      expertIsAvailable = false;
      expertSubtitle = null;
      expertImageURL = null;
    }
  }
  return {
    askGraduatesEnabled,
    expertTitle,
    expertIsAvailable,
    expertImageURL,
    expertSubtitle,
    expertName,
    expertImageAvailable,
    imageId,
    name,
  };
};

// Selector function to set variables of Trending Post Card

export const setTrendingPostVariables = (state) => {
  const {
    getProjects: {projectSessionPayload},
    getSelectedProjectReducer: {selectedProjectPayload},
    getTrendingPostReducer: {getTrendingPostPayload},
  } = state;
  let trendingArticles;
  let trendingEnabled;

  if (projectSessionPayload && projectSessionPayload.data) {
    trendingEnabled =
      projectSessionPayload.data[0].attributes.community_enabled;
  }

  if (selectedProjectPayload && selectedProjectPayload.data) {
    trendingEnabled = selectedProjectPayload.data.attributes.community_enabled;
  }

  return {
    trendingEnabled,
  };
};

// Selector function to set variables of Story card and Event card

export const setStoryEventVariables = (state) => {
  const {
    getEventStoryDetailReducer: {getEventStoryDetailPayload},
  } = state;

  let eventDescription;
  let eventEndTime;
  let eventRegistrationLink;
  let eventStartTime;
  let eventTitle;
  let replacementText;
  let storyDescription;
  let storyIntroduction;
  let storyTitle;
  let storyVideoId;
  let storyVideoType;

  let startDateObject;
  let endDateObject;
  let startTime;
  let endTime;
  let formattedStartTime;
  let formattedEndTime;
  let formattedStartDate;

  if (getEventStoryDetailPayload && getEventStoryDetailPayload.data) {
    [
      {
        attributes: {
          event_description: eventDescription,
          event_end_time: eventEndTime,
          event_registration_link: eventRegistrationLink,
          event_start_time: eventStartTime,
          event_title: eventTitle,
          replacement_text: replacementText,
          story_description: storyDescription,
          story_introduction: storyIntroduction,
          story_title: storyTitle,
          video_id: storyVideoId,
          video_type: storyVideoType,
        },
      },
    ] = getEventStoryDetailPayload.data;

    startDateObject = new Date(Date.parse(eventStartTime));
    endDateObject = new Date(Date.parse(eventEndTime));
    startTime = moment.utc(startDateObject);
    endTime = moment.utc(endDateObject);
    formattedStartTime = startTime.format('HH:MM');
    formattedEndTime = endTime.format('HH:MM');
    formattedStartDate = startTime.format('MMM Do YYYY');
  }
  return {
    eventDescription,
    eventRegistrationLink,
    eventTitle,
    replacementText,
    storyDescription,
    storyIntroduction,
    storyTitle,
    storyVideoId,
    storyVideoType,
    formattedStartTime,
    formattedEndTime,
    formattedStartDate,
  };
};

// Function to set date of Trending Card
