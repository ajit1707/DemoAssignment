import {NEWS_ARTICLES, ARTICLES, CATEGORIES} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';
import Config from '../utility/config';

const GET_ARTICLE_CATEGORY_REQUEST = 'GET_ARTICLE_CATEGORY_REQUEST';
const GET_ARTICLE_CATEGORY_SUCCESS = 'GET_ARTICLE_CATEGORY_SUCCESS';
const GET_ARTICLE_CATEGORY_FAIL = 'GET_ARTICLE_CATEGORY_FAIL';

const GET_CATEGORIES_PAYLOAD_REQUEST = 'GET_CATEGORIES_PAYLOAD_REQUEST';
const GET_CATEGORIES_PAYLOAD_SUCCESS = 'GET_CATEGORIES_PAYLOAD_SUCCESS';
const GET_CATEGORIES_PAYLOAD_FAIL = 'GET_CATEGORIES_PAYLOAD_FAIL';

const GET_SUB_CATEGORIES_PAYLOAD_REQUEST = 'GET_SUB_CATEGORIES_PAYLOAD_REQUEST';
const GET_SUB_CATEGORIES_PAYLOAD_SUCCESS = 'GET_SUB_CATEGORIES_PAYLOAD_SUCCESS';
const GET_SUB_CATEGORIES_PAYLOAD_FAIL = 'GET_SUB_CATEGORIES_PAYLOAD_FAIL';

const GET_NEWS_ARTICLE_CATEGORIES_REQUEST =
  'GET_NEWS_ARTICLE_CATEGORIES_REQUEST';
const GET_NEWS_ARTICLE_CATEGORIES_SUCCESS =
  'GET_NEWS_ARTICLE_CATEGORIES_SUCCESS';
const GET_NEWS_ARTICLE_CATEGORIES_FAIL = 'GET_NEWS_ARTICLE_CATEGORIES_FAIL';

const REMOVE_CATEGORY_PAYLOAD = 'REMOVE_CATEGORY_PAYLOAD';

export function getCategoriesPayload(slug) {
  return (dispatch) => {
    dispatch({
      type: GET_CATEGORIES_PAYLOAD_REQUEST,
    });
    httpGet(
      `${CATEGORIES}?filter[slug]=${slug}&include=&page[number]=1&page[size]=1`,
    )
      .then((response) => {
        dispatch({
          categoryPayload: response.data,
          type: GET_CATEGORIES_PAYLOAD_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_CATEGORIES_PAYLOAD_FAIL,
        });
      });
  };
}
export function getSubCategoriesPayload(id) {
  return (dispatch) => {
    dispatch({
      type: GET_SUB_CATEGORIES_PAYLOAD_REQUEST,
    });
    httpGet(
      `${CATEGORIES}?filter[parent_category_id]=${id}&filter[with_articles]=true&include=`,
    )
      .then((response) => {
        dispatch({
          subCategoryPayload: response.data,
          type: GET_SUB_CATEGORIES_PAYLOAD_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_SUB_CATEGORIES_PAYLOAD_FAIL,
        });
      });
  };
}

export function getNewsArticlesForCategories(id) {
  return (dispatch) => {
    dispatch({
      type: GET_NEWS_ARTICLE_CATEGORIES_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}${NEWS_ARTICLES}?filter[category_id]=${id}&filter[is_draft]=false&include=category&page[number]=1&page[size]=1`,
    )
      .then((response) => {
        dispatch({
          newsArticleCategoryPayload: response.data,
          type: GET_NEWS_ARTICLE_CATEGORIES_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_NEWS_ARTICLE_CATEGORIES_FAIL,
        });
        // dispatch(errorHandler(error.data.errors[0].title));
      });
  };
}

export function getArticlesForCategories(id) {
  return (dispatch) => {
    dispatch({
      type: GET_ARTICLE_CATEGORY_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}${ARTICLES}?filter[for_category]=${id}&filter[is_draft]=false&include=category&page[number]=1&page[size]=13`,
    )
      .then((response) => {
        dispatch({
          articleCategoryPayload: response.data,
          type: GET_ARTICLE_CATEGORY_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_ARTICLE_CATEGORY_FAIL,
        });
        // dispatch(errorHandler(error.data.errors[0].title));
      });
  };
}
export function clearCategoryPayloads() {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_CATEGORY_PAYLOAD,
    });
  };
}

export default function brightKnowledgeCategoryReducer(
  state = {
    fetching: false,
    categoryPayload: null,
    subCategoryPayload: null,
    newsArticleCategoryPayload: null,
    articleCategoryPayload: null,
  },
  action,
) {
  switch (action.type) {
    case GET_CATEGORIES_PAYLOAD_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_SUB_CATEGORIES_PAYLOAD_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_NEWS_ARTICLE_CATEGORIES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_ARTICLE_CATEGORY_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_CATEGORIES_PAYLOAD_SUCCESS: {
      return {
        ...state,
        fetching: false,
        categoryPayload: action.categoryPayload,
      };
    }
    case GET_SUB_CATEGORIES_PAYLOAD_SUCCESS: {
      return {
        ...state,
        fetching: false,
        subCategoryPayload: action.subCategoryPayload,
      };
    }
    case GET_NEWS_ARTICLE_CATEGORIES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        newsArticleCategoryPayload: action.newsArticleCategoryPayload,
      };
    }
    case GET_ARTICLE_CATEGORY_SUCCESS: {
      return {
        ...state,
        fetching: false,
        articleCategoryPayload: action.articleCategoryPayload,
      };
    }
    case REMOVE_CATEGORY_PAYLOAD: {
      return {
        ...state,
        categoryPayload: null,
        subCategoryPayload: null,
        newsArticleCategoryPayload: null,
        articleCategoryPayload: null,
      };
    }
    default: {
      return state;
    }
  }
}
