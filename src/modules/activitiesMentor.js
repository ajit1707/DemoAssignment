import AsyncStorage from '@react-native-async-storage/async-storage';
import Constant from '../utility/constant';
import {httpGet} from '../utility/http';
import {PROJECT_USER_ACTIVITIES} from '../utility/apis';
import {errorHandler} from './errorHandler';

const GET_PROJECT_USER_ACTIVITIES_MENTOR_REQUEST =
  'GET_PROJECT_USER_ACTIVITIES_MENTOR_REQUEST';
const GET_PROJECT_USER_ACTIVITIES_MENTOR_SUCCESS =
  'GET_PROJECT_USER_ACTIVITIES_MENTOR_SUCCESS';
const GET_PROJECT_USER_ACTIVITIES_MENTOR_FAIL =
  'GET_PROJECT_USER_ACTIVITIES_MENTOR_FAIL';

const GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_REQUEST =
  'GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_REQUEST';
const GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_SUCCESS =
  'GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_SUCCESS';
const GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_FAIL =
  'GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_FAIL';

const CLEAR_MENTOR_ACTIVITIES_DATA = 'CLEAR_MENTOR_ACTIVITIES_DATA';
const CLEAR_ACTIVITIES_DATA_MENTOR = 'CLEAR_ACTIVITIES_DATA_MENTOR';

export const getProjectUserActivitiesMentor = (pageNumber) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    const projectId = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_ID,
      () => {},
    );
    if (projectId) {
      const projectUserData = JSON.parse(projectId);
      dispatch({
        type: GET_PROJECT_USER_ACTIVITIES_MENTOR_REQUEST,
      });
      httpGet(
        `${PROJECT_USER_ACTIVITIES}?filter[reviewable,project]=true,${projectUserData}&filter[active_project_activities]&include=activity,project_user.user,activity.attached_activities&page[number]=${pageNumber}&page[size]=10`,
      )
        .then((response) => {
          resolve(response.data);
          dispatch({
            pageNumber,
            projectUserMentorActivityPayload: response.data,
            type: GET_PROJECT_USER_ACTIVITIES_MENTOR_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_PROJECT_USER_ACTIVITIES_MENTOR_FAIL,
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

export const getProjectUserMentorActivitiesQuestion = (
  projectUserId,
  activityId,
) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_REQUEST,
    });
    httpGet(
      `${PROJECT_USER_ACTIVITIES}/${projectUserId}?include=activity.categories,attempted_questions,activity.attached_activities`,
    )
      .then((response) => {
        dispatch({
          activityId,
          projectUserMentorActivitiesQuestionPayload: response.data,
          type: GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_SUCCESS,
        });
        resolve(response.data);
      })
      .catch((error) => {
        dispatch({
          type: GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_FAIL,
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
export const resetFetchedMentorData = () => (dispatch) => {
  dispatch({
    type: CLEAR_MENTOR_ACTIVITIES_DATA,
  });
};
export const resetActivitiesDataMentor = () => (dispatch) => {
  dispatch({
    type: CLEAR_ACTIVITIES_DATA_MENTOR,
  });
};
export default (
  state = {
    fetching: false,
    mentorDataPageNumber: 1,
    projectUserMentorActivityPayload: null,
    projectUserData: null,
    userData: null,
    activitiesMentor: [],
    categories: [],
    activityHeaderData: null,
    mentorRecordCount: 0,
    projectUserMentorActivitiesQuestionPayload: null,
  },
  action,
) => {
  switch (action.type) {
    case GET_PROJECT_USER_ACTIVITIES_MENTOR_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case CLEAR_MENTOR_ACTIVITIES_DATA: {
      return {
        ...state,
        fetching: false,
        projectUserMentorActivityPayload: null,
        activityHeaderData: null,
      };
    }
    case CLEAR_ACTIVITIES_DATA_MENTOR: {
      return {
        ...state,
        fetching: true,
        projectUserActivityQuestionPayload: null,
        activityHeaderData: null,
      };
    }
    case GET_PROJECT_USER_ACTIVITIES_MENTOR_SUCCESS: {
      const {
        projectUserMentorActivityPayload,
        pageNumber,
        projectUserMentorActivityPayload: {
          meta: {record_count},
        },
      } = action;
      let reducedProjectData = {};
      let reducedUserData = {};
      let activitiesData = [];
      if (
        projectUserMentorActivityPayload &&
        projectUserMentorActivityPayload.data.length > 0
      ) {
        reducedProjectData = reduceProjectData(
          projectUserMentorActivityPayload,
        );
        activitiesData = filterActivities(projectUserMentorActivityPayload);
        reducedUserData = reduceUserData(projectUserMentorActivityPayload);
      }
      if (pageNumber === 1) {
        return {
          ...state,
          fetching: false,
          activitiesMentor: activitiesData,
          mentorDataPageNumber: pageNumber + 1,
          projectUserMentorActivityPayload: reducedProjectData,
          mentorRecordCount: record_count,
          userData: reducedUserData.userData,
          projectUserData: reducedUserData.projectUsers,
        };
      }
      return {
        ...state,
        fetching: false,
        activitiesMentor: [...state.activitiesMentor, ...activitiesData],
        mentorDataPageNumber: pageNumber + 1,
        projectUserMentorActivityPayload: Object.assign(
          state.projectUserMentorActivityPayload,
          reducedProjectData,
        ),
        userData: Object.assign(state.userData, reducedUserData.userData),
        projectUserData: Object.assign(
          state.projectUserData,
          reducedUserData.projectUsers,
        ),
        mentorRecordCount: record_count,
      };
    }
    case GET_PROJECT_USER_ACTIVITIES_MENTOR_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_SUCCESS: {
      const activityHeaderData = findQuestionData(state, action.activityId);
      const categoriesArray = filterCategories(
        action.projectUserMentorActivitiesQuestionPayload,
      );
      return {
        ...state,
        fetching: false,
        activityHeaderData,
        categories: categoriesArray,
        projectUserMentorActivitiesQuestionPayload:
          action.projectUserMentorActivitiesQuestionPayload,
      };
    }
    case GET_PROJECT_USER_MENTOR_ACTIVITIES_QUESTION_FAIL: {
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

const reduceProjectData = (projectUserActivityPayload) => {
  const {data} = projectUserActivityPayload;
  const updatedData = data.reduce((acc, dataObj) => {
    acc[dataObj.attributes.activity_id] = {
      ...dataObj.attributes,
      id: dataObj.id,
    };
    return acc;
  }, {});
  return updatedData;
};

const reduceUserData = (projectUserActivityPayload) => {
  const {included} = projectUserActivityPayload;
  const filteredData = included.filter((item) => item.type === 'users');
  const projectUsersData = included.filter(
    (item) => item.type === 'project_users',
  );
  const projectUsers = projectUsersData.reduce((acc, dataObj) => {
    acc[dataObj.id] = dataObj.attributes;
    return acc;
  }, {});
  const userData = filteredData.reduce((acc, dataObj) => {
    acc[dataObj.id] = dataObj.attributes;
    return acc;
  }, {});
  return {userData, projectUsers};
};

const filterActivities = (projectUserActivityPayload) => {
  const {included} = projectUserActivityPayload;
  const updatedData = included.filter((item) => item.type === 'activities');
  return updatedData;
};

const filterCategories = (projectUserMentorActivitiesQuestionPayload) => {
  const {included} = projectUserMentorActivitiesQuestionPayload;
  const filteredData = included.filter((item) => item.type === 'categories');
  const updatedData = filteredData.map((item) => item.attributes.title);
  return updatedData;
};
export const findQuestionData = (state, activityId) => {
  const {activitiesMentor} = state;
  const activityData = activitiesMentor.find(
    (item) => parseInt(item.id, 10) === activityId,
  );
  return {
    activityData,
  };
};
