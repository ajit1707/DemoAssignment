import AsyncStorage from '@react-native-async-storage/async-storage';
import {CATEGORIES, ARTICLES, SECTION_ARTICLES} from '../utility/apis';
import {httpGet, httpPost, httpPatch} from '../utility/http';
import Constant from '../utility/constant';

const GET_SUBMIT_ARTICLE_CATEGORIES_REQUEST =
  'GET_SUBMIT_ARTICLE_CATEGORIES_REQUEST';
const GET_SUBMIT_ARTICLE_CATEGORIES_SUCCESS =
  'GET_SUBMIT_ARTICLE_CATEGORIES_SUCCESS';
const GET_SUBMIT_ARTICLE_CATEGORIES_FAIL = 'GET_SUBMIT_ARTICLE_CATEGORIES_FAIL';
const SELECT_CATEGORY = 'SELECT_CATEGORY';
const SELECT_SUB_CATEGORY = 'SELECT_SUB_CATEGORY';

const GET_MY_ARTICLES_REQUEST = 'GET_MY_ARTICLES_REQUEST';
const GET_MY_ARTICLES_SUCCESS = 'GET_MY_ARTICLES_SUCCESS';
const GET_MY_ARTICLES_FAIL = 'GET_MY_ARTICLES_FAIL';

const GET_MY_POSTED_ARTICLE_REQUEST = 'GET_MY_POSTED_ARTICLE_REQUEST';
const GET_MY_POSTED_ARTICLE_SUCCESS = 'GET_MY_POSTED_ARTICLE_SUCCESS';
const GET_MY_POSTED_ARTICLE_FAIL = 'GET_MY_POSTED_ARTICLE_FAIL';

const POST_MY_ARTICLES_REQUEST = 'POST_MY_ARTICLES_REQUEST';
const POST_MY_ARTICLES_SUCCESS = 'POST_MY_ARTICLES_SUCCESS';
const POST_MY_ARTICLES_FAIL = 'POST_MY_ARTICLES_FAIL';

const PATCH_MY_ARTICLES_REQUEST = 'PATCH_MY_ARTICLES_REQUEST';
const PATCH_MY_ARTICLES_SUCCESS = 'PATCH_MY_ARTICLES_SUCCESS';
const PATCH_MY_ARTICLES_FAIL = 'PATCH_MY_ARTICLES_FAIL';

const PATCH_MY_SECTION_ARTICLES_REQUEST = 'PATCH_MY_SECTION_ARTICLES_REQUEST';
const PATCH_MY_SECTION_ARTICLES_SUCCESS = 'PATCH_MY_SECTION_ARTICLES_SUCCESS';
const PATCH_MY_SECTION_ARTICLES_FAIL = 'PATCH_MY_SECTION_ARTICLES_FAIL';

const POST_MY_SECTION_ARTICLES_REQUEST = 'POST_MY_SECTION_ARTICLES_REQUEST';
const POST_MY_SECTION_ARTICLES_SUCCESS = 'POST_MY_SECTION_ARTICLES_SUCCESS';
const POST_MY_SECTION_ARTICLES_FAIL = 'POST_MY_SECTION_ARTICLES_FAIL';

const CLEAR_PAYLOAD_DATA = 'CLEAR_PAYLOAD_DATA';

export function getCategoriesPayload() {
  return async (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: GET_SUBMIT_ARTICLE_CATEGORIES_REQUEST,
      });
      httpGet(`${CATEGORIES}?filter[type]=category&include=subcategories`)
        .then((response) => {
          response.data.included.forEach((item) => {
            item.isChecked = false;
          });
          response.data.selectAll = {
            attributes: {title: 'Select All'},
            isChecked: false,
          };
          dispatch({
            submitArticleCategories: response.data,
            type: GET_SUBMIT_ARTICLE_CATEGORIES_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_SUBMIT_ARTICLE_CATEGORIES_FAIL,
          });
          reject(error);
        });
    });
}
export function selectCategory(id) {
  return (dispatch) => {
    dispatch({
      type: SELECT_CATEGORY,
      id,
    });
  };
}
export function selectSubCategory(id, title, subCategories) {
  return (dispatch) => {
    dispatch({
      type: SELECT_SUB_CATEGORY,
      id,
      title,
      subCategories,
    });
  };
}
export function getMyArticle(pageNumber) {
  return async (dispatch, getState) => {
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
      type: GET_MY_ARTICLES_REQUEST,
    });
    httpGet(
      `${ARTICLES}?filter[project_id]=${projectId.id}&page[number]=${pageNumber}&page[size]=10)`,
    )
      .then((response) => {
        dispatch({
          getMyArticles: response.data,
          type: GET_MY_ARTICLES_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_MY_ARTICLES_FAIL,
          error,
        });
      });
  };
}

export function postArticle(payload) {
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
      payload.data.attributes.project_id = projectId.id;
      dispatch({
        type: POST_MY_ARTICLES_REQUEST,
      });
      httpPost(`${ARTICLES}`, payload)
        .then((response) => {
          dispatch({
            postArticles: response.data,
            type: POST_MY_ARTICLES_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            error,
            type: POST_MY_ARTICLES_FAIL,
          });
          reject(error);
        });
    });
}

export function postSectionArticle(payload) {
  return (dispatch) => {
    dispatch({
      type: POST_MY_SECTION_ARTICLES_REQUEST,
    });
    httpPost(`${SECTION_ARTICLES}`, payload)
      .then((response) => {
        dispatch({
          sectionArticles: response.data,
          type: POST_MY_SECTION_ARTICLES_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          error,
          type: POST_MY_SECTION_ARTICLES_FAIL,
        });
      });
  };
}

export function getMyPostedArticle(id) {
  return async (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: GET_MY_POSTED_ARTICLE_REQUEST,
      });
      httpGet(`${ARTICLES}/${id}`)
        .then((response) => {
          dispatch({
            getMyPostedArticle: response.data,
            type: GET_MY_POSTED_ARTICLE_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: GET_MY_POSTED_ARTICLE_FAIL,
          });
        });
    });
}

export function patchArticle(id, payload) {
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
      payload.data.attributes.project_id = projectId.id;
      dispatch({
        type: PATCH_MY_ARTICLES_REQUEST,
      });
      httpPatch(`${ARTICLES}/${id}`, payload)
        .then((response) => {
          dispatch({
            patchMyPostedArticle: response.data,
            type: PATCH_MY_ARTICLES_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: PATCH_MY_ARTICLES_FAIL,
          });
        });
    });
}

export function patchSectionArticle(id, payload) {
  return async (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: PATCH_MY_SECTION_ARTICLES_REQUEST,
      });
      httpPatch(`${SECTION_ARTICLES}/${id}`, payload)
        .then((response) => {
          dispatch({
            patchMyPostedSectionArticle: response.data,
            type: PATCH_MY_SECTION_ARTICLES_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: PATCH_MY_SECTION_ARTICLES_FAIL,
          });
        });
    });
}
export function unmountSubmitArticle() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PAYLOAD_DATA,
    });
  };
}

export default function getDataForSubmitArticleReducer(
  state = {
    fetching: false,
    submitArticleCategories: null,
    filteredCategories: null,
    getMyArticles: null,
    postArticles: null,
    getMyPostedArticle: null,
    patchMyPostedArticle: null,
    patchMyPostedSectionArticle: null,
  },
  action,
) {
  switch (action.type) {
    case GET_SUBMIT_ARTICLE_CATEGORIES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_SUBMIT_ARTICLE_CATEGORIES_SUCCESS: {
      const {submitArticleCategories} = action;
      const filteredCategories = submitArticleCategories.data.filter(
        (hasSubCategory) =>
          hasSubCategory.relationships.subcategories.data.length > 0,
      );
      filteredCategories.forEach((item) => {
        item.isChecked = false;
      });
      return {
        ...state,
        fetching: false,
        submitArticleCategories: action.submitArticleCategories,
        filteredCategories,
      };
    }
    case GET_SUBMIT_ARTICLE_CATEGORIES_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case SELECT_CATEGORY: {
      const {id} = action;
      const selectedCategory = state.filteredCategories.filter((data) => {
        if (data.id === id) {
          data.isChecked = !data.isChecked;
        } else {
          data.isChecked = false;
        }
        return data;
      });
      return {
        ...state,
        filteredCategories: [...selectedCategory],
      };
    }
    case SELECT_SUB_CATEGORY: {
      const {id, title, subCategories} = action;
      const isSelectAll = state.submitArticleCategories.selectAll;
      if (title === 'Select All') {
        isSelectAll.isChecked = !state.submitArticleCategories.selectAll
          .isChecked;
        const selectAllSubCategories = state.submitArticleCategories.included.filter(
          (obj) => {
            subCategories.forEach((obj2) => {
              if (obj.id === obj2.id) {
                obj.isChecked =
                  state.submitArticleCategories.selectAll.isChecked;
              }
              return obj2;
            });
            return obj;
          },
        );
        return {
          ...state,
          submitArticleCategories: {
            ...state.submitArticleCategories,
            selectAll: isSelectAll,
            included: selectAllSubCategories,
          },
        };
      }
      let checkSelectedAll = 0;
      subCategories.forEach((data) => {
        if (data.id === id) {
          data.isChecked = !data.isChecked;
        }
        if (data.isChecked === true) {
          checkSelectedAll += 1;
        }
      });
      isSelectAll.isChecked = checkSelectedAll === subCategories.length;
      return {
        ...state,
        submitArticleCategories: {
          ...state.submitArticleCategories,
          selectAll: isSelectAll,
          included: [
            ...state.submitArticleCategories.included,
            ...subCategories,
          ],
        },
      };
    }
    case GET_MY_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_MY_ARTICLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        getMyArticles: action.getMyArticles,
      };
    }
    case GET_MY_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case POST_MY_SECTION_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case POST_MY_SECTION_ARTICLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        sectionArticles: action.sectionArticles,
      };
    }
    case POST_MY_SECTION_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case PATCH_MY_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case PATCH_MY_ARTICLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        patchMyPostedArticle: action.patchMyPostedArticle,
      };
    }
    case PATCH_MY_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case PATCH_MY_SECTION_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case PATCH_MY_SECTION_ARTICLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        patchMyPostedSectionArticle: action.patchMyPostedSectionArticle,
      };
    }
    case PATCH_MY_SECTION_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case GET_MY_POSTED_ARTICLE_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_MY_POSTED_ARTICLE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        getMyPostedArticle: action.getMyPostedArticle,
      };
    }
    case GET_MY_POSTED_ARTICLE_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case POST_MY_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case POST_MY_ARTICLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        postArticles: action.postArticles,
      };
    }
    case POST_MY_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case CLEAR_PAYLOAD_DATA: {
      return {
        submitArticleCategories: null,
        filteredCategories: null,
      };
    }
    default: {
      return state;
    }
  }
}
