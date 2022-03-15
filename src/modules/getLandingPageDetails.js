import AsyncStorage from '@react-native-async-storage/async-storage';
import {LANDING_PAGES} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';

// http://dev.brightsideapi.tudip.uk/landing_pages?filter[project_id]=175&filter[role]=mentee&page[number]=1&page[size]=1

const GET_LANDING_PAGE_DETAILS_REQUEST = 'GET_LANDING_PAGE_DETAILS_REQUEST';
const GET_LANDING_PAGE_DETAILS_SUCCESS = 'GET_LANDING_PAGE_DETAILS_SUCCESS';
const GET_LANDING_PAGE_DETAILS_FAIL = 'GET_LANDING_PAGE_DETAILS_FAIL';

export function getLandingPageDetails() {
  return (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      const {
        getProjects: {projectSessionPayload},
        getUserDetail: {
          userDetailPayload: {included},
        },
      } = getState();
      const projectSwitcherSelectedData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
        () => {},
      );
      const projectId = projectSwitcherSelectedData
        ? JSON.parse(projectSwitcherSelectedData)
        : projectSessionPayload.data[0];
      const userRole = included[1].attributes.name;
      dispatch({
        type: GET_LANDING_PAGE_DETAILS_REQUEST,
      });
      httpGet(
        `${LANDING_PAGES}?filter[project_id]=${projectId.id}&filter[role]=${userRole}&page[number]=1&page[size]=1`,
      )
        .then((response) => {
          resolve(response.data);
          dispatch({
            landingPageDetails: response.data,
            type: GET_LANDING_PAGE_DETAILS_SUCCESS,
          });
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: GET_LANDING_PAGE_DETAILS_FAIL,
            error,
          });
          // dispatch(errorHandler(error.data.errors[1].title));
        });
    });
}

export default function getLandingPageDetailsReducer(
  state = {
    fetching: false,
    landingPageDetails: null,
  },
  action,
) {
  switch (action.type) {
    case GET_LANDING_PAGE_DETAILS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_LANDING_PAGE_DETAILS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        landingPageDetails: action.landingPageDetails,
      };
    }
    case GET_LANDING_PAGE_DETAILS_FAIL: {
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

// selector function

export const getLandingPageData = (state) => {
  const {
    getLandingPageDetailsReducer: {landingPageDetails},
  } = state;
  let titleData;
  let introData;
  let videoUrl;
  let imageUrl;
  let bodyData;
  let titleOfLandingPage = '';
  if (landingPageDetails !== null) {
    if (landingPageDetails.data.length > 0) {
      const {data} = landingPageDetails;
      const {
        attributes: {title, intro, video_id, image_id, body, video_type},
      } = data[0];
      if (video_id !== null && video_id !== '') {
        if (video_type === 'youtube') {
          videoUrl = `https://www.youtube.com/embed/${video_id}`;
        } else {
          videoUrl = `https://player.vimeo.com/video/${video_id}`;
        }
      } else {
        videoUrl = null;
      }
      if (title !== null && title !== '') {
        titleData = title;
      } else {
        titleData = Constant.LANDING_PAGE_DEFAULT.TITLE;
      }
      if (intro !== null) {
        introData = intro;
      } else {
        introData = null;
      }
      if (image_id !== null) {
        imageUrl = image_id;
      } else {
        imageUrl = null;
      }
      if (body !== null && body !== '') {
        bodyData = body;
      } else {
        bodyData = null;
      }
      if (title !== null && title !== '') {
        titleOfLandingPage = landingPageDetails.data[0].attributes.title;
      }
    } else {
      titleData = Constant.LANDING_PAGE_DEFAULT.TITLE;
      introData = null;
      imageUrl = null;
    }
  }
  return {
    titleData,
    introData,
    imageUrl,
    bodyData,
    videoUrl,
    titleOfLandingPage,
  };
};
