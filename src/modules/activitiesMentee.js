import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ATTACHED_ACTIVITIES,
  PROJECT_USER_ACTIVITIES,
  ATTEMPTED_QUESTIONS,
} from '../utility/apis';
import {httpGet, httpPatch, httpPost} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';
//import { Value } from 'react-native-reanimated';

// Action type for channels user
const GET_MENTEE_ACTIVITIES_REQUEST = 'GET_MENTEE_ACTIVITIES_REQUEST';
const GET_MENTEE_ACTIVITIES_SUCCESS = 'GET_MENTEE_ACTIVITIES_SUCCESS';
const GET_MENTEE_ACTIVITIES_FAIL = 'GET_MENTEE_ACTIVITIES_FAIL';

const CLEAR_MENTEE_ACTIVITIES_DATA = 'CLEAR_MENTEE_ACTIVITIES_DATA';

const CLEAR_ACTIVITIES_DATA = 'CLEAR_ACTIVITIES_DATA';

const GET_PROJECT_USER_ACTIVITIES_REQUEST =
  'GET_PROJECT_USER_ACTIVITIES_REQUEST';
const GET_PROJECT_USER_ACTIVITIES_SUCCESS =
  'GET_PROJECT_USER_ACTIVITIES_SUCCESS';
const GET_PROJECT_USER_ACTIVITIES_FAIL = 'GET_PROJECT_USER_ACTIVITIES_FAIL';

const GET_PROJECT_USER_ACTIVITIES_QUESTION_REQUEST =
  'GET_PROJECT_USER_ACTIVITIES_QUESTION_REQUEST';
const GET_PROJECT_USER_ACTIVITIES_QUESTION_SUCCESS =
  'GET_PROJECT_USER_ACTIVITIES_QUESTION_SUCCESS';
const GET_PROJECT_USER_ACTIVITIES_QUESTION_FAIL =
  'GET_PROJECT_USER_ACTIVITIES_QUESTION_FAIL';

const GET_ATTEMPTED_QUESTION_REQUEST = 'GET_ATTEMPTED_QUESTION_REQUEST';
const GET_ATTEMPTED_QUESTION_SUCCESS = 'GET_ATTEMPTED_QUESTION_SUCCESS';
const GET_ATTEMPTED_QUESTION_FAIL = 'GET_ATTEMPTED_QUESTION_FAIL';

const POST_START_ACTIVITIES_REQUEST = 'POST_START_ACTIVITIES_REQUEST';
const POST_START_ACTIVITIES_SUCCESS = 'POST_START_ACTIVITIES_SUCCESS';
const POST_START_ACTIVITIES_FAIL = 'POST_START_ACTIVITIES_FAIL';

const POST_START_QUESTION_REQUEST = 'POST_START_QUESTION_REQUEST';
const POST_START_QUESTION_SUCCESS = 'POST_START_QUESTION_SUCCESS';
const POST_START_QUESTION_FAIL = 'POST_START_QUESTION_FAIL';

const PATCH_ATTEMPTED_QUESTION_REQUEST = 'PATCH_ATTEMPTED_QUESTION_REQUEST';
const PATCH_ATTEMPTED_QUESTION_SUCCESS = 'PATCH_ATTEMPTED_QUESTION_SUCCESS';
const PATCH_ATTEMPTED_QUESTION_FAIL = 'PATCH_ATTEMPTED_QUESTION_FAIL';

const PATCH_PROJECT_USER_API_REQUEST = 'PATCH_PROJECT_USER_API_REQUEST';
const PATCH_PROJECT_USER_API_SUCCESS = 'PATCH_PROJECT_USER_API_SUCCESS';
const PATCH_PROJECT_USER_API_FAIL = 'PATCH_PROJECT_USER_API_FAIL';

export const getMenteeActivities = (pageNumber) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    const projectId = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_ID,
      () => {},
    );
    if (projectId) {
      dispatch({
        type: GET_MENTEE_ACTIVITIES_REQUEST,
      });
      // https://api.brightsidementoring.org/attached_activities?filter[activitable]=1102,project&filter[active_activities]&filter[assigned]&include=activity.questions.answers,activity.categories&page[number]=1&page[size]=25
      httpGet(
        `${ATTACHED_ACTIVITIES}?filter[activitable]=${projectId},project&filter[active_activities]&filter[assigned]&include=activity.questions.answers,activity.categories&page[number]=${pageNumber}&page[size]=10`,
      )
        .then((response) => {
          dispatch({
            pageNumber,
            menteeActivityPayload: response.data,
            type: GET_MENTEE_ACTIVITIES_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: GET_MENTEE_ACTIVITIES_FAIL,
          });
          reject(error);
          if (
            error &&
            error.data &&
            error.data.errors &&
            error.data.errors.length
          ) {
            dispatch(errorHandler(error.data.errors[0].title));
          }
        });
    }
  });

export const getProjectUserActivities = () => (dispatch) =>
  new Promise(async (resolve, reject) => {
    const projectId = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.USER_DETAILS,
      () => {},
    );
    if (projectId) {
      const projectUserData = JSON.parse(projectId);
      const projectUserId = projectUserData.data.data[0].id;
      dispatch({
        type: GET_PROJECT_USER_ACTIVITIES_REQUEST,
      });
      httpGet(
        `${PROJECT_USER_ACTIVITIES}?filter[project_user]=${projectUserId}&include=activity.questions.answers&filter[active_project_activities]`,
      )
        .then((response) => {
          dispatch({
            projectUserActivityPayload: response.data,
            newprojectUserActivityPayload: response.data,
            type: GET_PROJECT_USER_ACTIVITIES_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: GET_PROJECT_USER_ACTIVITIES_FAIL,
          });
          reject(error);
          if (
            error &&
            error.data &&
            error.data.errors &&
            error.data.errors.length
          ) {
            dispatch(errorHandler(error.data.errors[0].title));
          }
        });
    }
  });

export const postStartActivity = (activityId) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    const projectId = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.USER_DETAILS,
      () => {},
    );
    const projectUserData = JSON.parse(projectId);
    const projectUserId = projectUserData.data.data[0].id;
    const payload = {
      data: {
        attributes: {
          activity_id: activityId,
          project_user_id: projectUserId,
        },
        type: 'project_user_activities',
      },
    };
    dispatch({
      type: POST_START_ACTIVITIES_REQUEST,
    });
    httpPost(`${PROJECT_USER_ACTIVITIES}`, payload)
      .then((response) => {
        dispatch({
          type: POST_START_ACTIVITIES_SUCCESS,
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: POST_START_ACTIVITIES_FAIL,
        });
      });
  });

export const getProjectUserActivitiesQuestion = (pageNumber, activityId) => (
  dispatch,
) =>
  new Promise(async (resolve, reject) => {
    const projectId = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_ID,
      () => {},
    );
    const projectDetailId = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.USER_DETAILS,
      () => {},
    );
    if (projectId) {
      const projectUserData = JSON.parse(projectDetailId);
      const projectUserId = projectUserData.data.data[0].id;
      dispatch({
        type: GET_PROJECT_USER_ACTIVITIES_QUESTION_REQUEST,
      });
      httpGet(
        `${PROJECT_USER_ACTIVITIES}?filter[activity]=${activityId}&filter[project_user]=${projectUserId}&filter[active_project_activities]&filter[assigned]=${activityId},${projectId}&include=activity.categories,attempted_questions,activity.attached_activities&page[number]=${pageNumber}&page[size]=10`,
      )
        .then((response) => {
          dispatch({
            activityId,
            projectUserActivityQuestionPayload: response.data,
            type: GET_PROJECT_USER_ACTIVITIES_QUESTION_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: GET_PROJECT_USER_ACTIVITIES_QUESTION_FAIL,
          });
          reject(error);
          if (
            error &&
            error.data &&
            error.data.errors &&
            error.data.errors.length
          ) {
            dispatch(errorHandler(error.data.errors[0].title));
          }
        });
    }
  });

export const getActivityCurrentQuestion = (currentQuestionId, id) => (
  dispatch,
) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: GET_ATTEMPTED_QUESTION_REQUEST,
    });
    httpGet(
      `${ATTEMPTED_QUESTIONS}?filter[activity]=${id}&filter[question]=${currentQuestionId}`,
    )
      .then((response) => {
        resolve(response.data);
        dispatch({
          currentQuestionPayload: response.data,
          type: GET_ATTEMPTED_QUESTION_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_ATTEMPTED_QUESTION_FAIL,
        });
        reject(error);
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

export const patchAttemptedQuestionApi = (id, payload) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: PATCH_ATTEMPTED_QUESTION_REQUEST,
    });
    httpPatch(`${ATTEMPTED_QUESTIONS}/${id}`, payload)
      .then((response) => {
        dispatch({
          type: PATCH_ATTEMPTED_QUESTION_SUCCESS,
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: PATCH_ATTEMPTED_QUESTION_FAIL,
        });
      });
  });

export const patchProjectUserApi = (id, payload) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: PATCH_PROJECT_USER_API_REQUEST,
    });
    httpPatch(`${PROJECT_USER_ACTIVITIES}/${id}`, payload)
      .then((response) => {
        dispatch({
          type: PATCH_PROJECT_USER_API_SUCCESS,
        });
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: PATCH_PROJECT_USER_API_FAIL,
        });
      });
  });
export const postStartQuestionApi = (payload) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: POST_START_QUESTION_REQUEST,
    });
    httpPost(`${ATTEMPTED_QUESTIONS}`, payload)
      .then((response) => {
        dispatch({
          type: POST_START_QUESTION_SUCCESS,
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: POST_START_QUESTION_FAIL,
        });
      });
  });

export const resetFetchedMenteeData = () => (dispatch) => {
  dispatch({
    type: CLEAR_MENTEE_ACTIVITIES_DATA,
  });
};
export const resetActivitiesData = () => (dispatch) => {
  dispatch({
    type: CLEAR_ACTIVITIES_DATA,
  });
};
export default (
  state = {
    fetching: false,
    activities: [],
    categories: {},
    activityQuestions: [],
    activityAnswers: [],
    menteeDataPageNumber: 1,
    projectUserActivityPayload: null,
    recordCount: 0,
    projectUserActivityQuestionPayload: null,
    newprojectUserActivityPayload: null,
    activityHeaderData: null,
    currentQuestionPayload: null,
    questionData: null,
    enablebackButton: true,
  },
  action,
) => {
  switch (action.type) {
    case GET_MENTEE_ACTIVITIES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_MENTEE_ACTIVITIES_SUCCESS: {
      const {pageNumber} = action;
      if (
        action.menteeActivityPayload &&
        action.menteeActivityPayload.data.length > 0
      ) {
        const formattedResponse = formatAttachedActivitiesData(
          state,
          action.menteeActivityPayload,
        );
        if (pageNumber === 1) {
          return {
            ...state,
            fetching: false,
            activities: formattedResponse.activities,
            categories: formattedResponse.newCategories,
            menteeDataPageNumber: pageNumber + 1,
            recordCount: action.menteeActivityPayload.meta.record_count,
          };
        }
        return {
          ...state,
          fetching: false,
          menteeDataPageNumber: pageNumber + 1,
          categories: formattedResponse.newCategories,
          activities: [...state.activities, ...formattedResponse.activities],
          recordCount: action.menteeActivityPayload.meta.record_count,
        };
      }
      return {
        ...state,
        activities: [],
      };
    }
    case GET_MENTEE_ACTIVITIES_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case CLEAR_MENTEE_ACTIVITIES_DATA: {
      return {
        ...state,
        fetching: false,
        projectUserActivityQuestionPayload: null,
        activityHeaderData: null,
        currentQuestionPayload: null,
        questionData: null,
      };
    }
    case CLEAR_ACTIVITIES_DATA: {
      return {
        ...state,
        fetching: true,
        projectUserActivityQuestionPayload: null,
        activityHeaderData: null,
        currentQuestionPayload: null,
        questionData: null,
        activities: null,
      };
    }
    case GET_PROJECT_USER_ACTIVITIES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_PROJECT_USER_ACTIVITIES_SUCCESS: {
      const reducedProjectUserData = reduceProjectData(
        action.projectUserActivityPayload,
      );
      return {
        ...state,
        fetching: false,
        projectUserActivityPayload: reducedProjectUserData,
        newprojectUserActivityPayload: action.newprojectUserActivityPayload,
      };
    }
    case GET_PROJECT_USER_ACTIVITIES_QUESTION_REQUEST: {
      return {
        ...state,
        fetching: true,
        enablebackButton: false,
      };
    }
    case GET_PROJECT_USER_ACTIVITIES_QUESTION_SUCCESS: {
      const activityHeaderData = findQuestionData(state, action.activityId);
      return {
        ...state,
        fetching: false,
        activityHeaderData,
        projectUserActivityQuestionPayload:
          action.projectUserActivityQuestionPayload,
      };
    }
    case GET_PROJECT_USER_ACTIVITIES_QUESTION_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case GET_ATTEMPTED_QUESTION_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_ATTEMPTED_QUESTION_SUCCESS: {
      if (action.currentQuestionPayload.data.length > 0) {
        const questionData = getQuestionData(action.currentQuestionPayload);
        return {
          ...state,
          fetching: false,
          questionData,
          currentQuestionPayload: action.currentQuestionPayload,
          enablebackButton: true,
        };
      }
      return {
        ...state,
        fetching: false,
        currentQuestionPayload: action.currentQuestionPayload,
        enablebackButton: true,
      };
    }
    case GET_ATTEMPTED_QUESTION_FAIL: {
      return {
        ...state,
        fetching: false,
        enablebackButton: true,
      };
    }
    case PATCH_ATTEMPTED_QUESTION_REQUEST: {
      return {
        ...state,
        fetching: true,
        enablebackButton: false,
      };
    }
    case PATCH_ATTEMPTED_QUESTION_FAIL: {
      return {
        ...state,
        fetching: false,
        enablebackButton: true,
      };
    }
    case PATCH_PROJECT_USER_API_REQUEST: {
      return {
        ...state,
        fetching: true,
        enablebackButton: false,
      };
    }
    case POST_START_QUESTION_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case POST_START_QUESTION_SUCCESS: {
      return {
        ...state,
        fetching: false,
      };
    }
    default: {
      return state;
    }
  }
};

const formatAttachedActivitiesData = (state, response) => {
  const {data, included} = response;
  const allActivities = [];
  const categories = [];
  included.forEach((includedObj) => {
    if (includedObj.type === 'activities') {
      allActivities.push(includedObj);
    }
    if (includedObj.type === 'categories') {
      categories.push(includedObj);
    }
  });
  const newCategories = filterNewCategories(state, categories);
  const activities = allActivities.filter((activity) =>
    data.find(
      (dataObj) => dataObj.attributes.activity_id === parseInt(activity.id, 10),
    ),
  );
  return {
    activities,
    newCategories,
  };
};

const isActivtyAlradyExist = (activityId, activitiesData) => {
  let activities: any = [];
  if (activitiesData && activitiesData.length) {
    activities = activitiesData.map((item) => item.attributes.activity_id);
  }
  return activities.includes(activityId);
};

const reduceProjectData = (projectUserActivityPayload) => {
  const {data} = projectUserActivityPayload;
  const original = [];
  const newArray = [];
  const newActivityData = [];
  if (projectUserActivityPayload && projectUserActivityPayload.data.length) {
    projectUserActivityPayload.data.forEach((activityData) => {
      if (
        activityData.attributes &&
        activityData.attributes.activity_id &&
        !isActivtyAlradyExist(
          activityData.attributes.activity_id,
          newActivityData,
        )
      ) {
        newActivityData.push(activityData);
      }
    });
  }
  const updatedData = newActivityData.reduce((acc, dataObj) => {
    acc[dataObj.attributes.activity_id] = dataObj.attributes;
    return acc;
  }, {});
  return updatedData;
};

const filterNewCategories = (state, newCategories) => {
  const {categories} = state;
  const updatedCategories = categories;
  newCategories.forEach((category) => {
    if (!categories[category.id]) {
      updatedCategories[category.id] = category.attributes.title;
    }
  });
  return updatedCategories;
};

export const findQuestionData = (state, activityId) => {
  const {activities} = state;
  const activityData = activities.find(
    (item) => parseInt(item.id, 10) === activityId,
  );
  return {
    activityData,
  };
};
export const getQuestionData = (payload) => {
  const {included} = payload;
  const question = included.find((item) => item.type === 'activity_questions');
  if (question && question.attributes.type_of === 'multiple') {
    const answers = included.filter((item) => item.type === 'activity_answers');
    return {
      question,
      answers,
    };
  }
  return {
    question,
  };
};
