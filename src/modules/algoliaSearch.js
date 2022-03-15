import {NEWS_ARTICLES, ARTICLES, CATEGORIES} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';

const GET_SEARCHED_DATA_REQUEST = 'GET_SEARCHED_DATA_REQUEST';
const GET_SEARCHED_DATA_SUCCESS = 'GET_SEARCHED_DATA_SUCCESS';
const GET_SEARCHED_DATA_FAIL = 'GET_SEARCHED_DATA_FAIL';

const GET_CATEGORY_SEARCHED_DATA_REQUEST = 'GET_CATEGORY_SEARCHED_DATA_REQUEST';
const GET_CATEGORY_SEARCHED_DATA_SUCCESS = 'GET_CATEGORY_SEARCHED_DATA_SUCCESS';
const GET_CATEGORY_SEARCHED_DATA_FAIL = 'GET_CATEGORY_SEARCHED_DATA_FAIL';

export function getSearchedDataPayload(title, screenValue) {
  let articleType;
  if (screenValue === 'Latest News') {
    articleType = NEWS_ARTICLES;
  } else {
    articleType = ARTICLES;
  }
  return async (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: GET_SEARCHED_DATA_REQUEST,
      });
      httpGet(
        `${articleType}?filter[is_draft]=false&filter[search]=${title}&page[number]`,
      )
        .then((response) => {
          dispatch({
            searchPayload: response.data,
            type: GET_SEARCHED_DATA_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: GET_SEARCHED_DATA_FAIL,
          });
          reject(error);
        });
    });
}

export function getCategorySearchedDataPayload(title) {
  return async (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: GET_CATEGORY_SEARCHED_DATA_REQUEST,
      });
      httpGet(`${CATEGORIES}?filter[search]=${title}`)
        .then((response) => {
          dispatch({
            categorySearchPayload: response.data,
            type: GET_CATEGORY_SEARCHED_DATA_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            error,
            type: GET_CATEGORY_SEARCHED_DATA_FAIL,
          });
          reject(error);
        });
    });
}

export default function algoliaSearch(
  state = {
    fetching: false,
    categorySearchPayload: null,
    searchPayload: null,
  },
  action,
) {
  switch (action.type) {
    case GET_SEARCHED_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_SEARCHED_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        searchPayload: action.searchPayload,
      };
    }
    case GET_SEARCHED_DATA_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case GET_CATEGORY_SEARCHED_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_CATEGORY_SEARCHED_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        categorySearchPayload: action.categorySearchPayload,
      };
    }
    case GET_CATEGORY_SEARCHED_DATA_FAIL: {
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
