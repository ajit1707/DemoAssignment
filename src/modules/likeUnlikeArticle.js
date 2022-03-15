import {httpPost} from '../utility/http';
import {errorHandler} from './errorHandler';
const LIKE_ARTICLE_REQUEST = 'LIKE_ARTICLE_REQUEST';
export const LIKE_ARTICLE_SUCCESS = 'LIKE_ARTICLE_SUCCESS';
export const LIKE_ARTICLE_FAIL = 'LIKE_ARTICLE_FAIL';

const UNLIKE_ARTICLE_REQUEST = 'UNLIKE_ARTICLE_REQUEST';
export const UNLIKE_ARTICLE_SUCCESS = 'UNLIKE_ARTICLE_SUCCESS';
export const UNLIKE_ARTICLE_FAIL = 'UNLIKE_ARTICLE_FAIL';

export function likeArticle(item) {
  return (dispatch) => {
    dispatch({
      type: LIKE_ARTICLE_REQUEST,
    });
    httpPost(`${item.links.self}/like`)
      .then((response) => {
        dispatch({
          likeArticlePayload: response,
          type: LIKE_ARTICLE_SUCCESS,
          id: item.id,
        });
      })
      .catch((error) => {
        dispatch({
          type: LIKE_ARTICLE_FAIL,
        });
        // dispatch(errorHandler(error.data.errors[0].title));
      });
  };
}

export function unlikeArticle(item) {
  return (dispatch) => {
    dispatch({
      type: UNLIKE_ARTICLE_REQUEST,
    });
    httpPost(`${item.links.self}/unlike`)
      .then((response) => {
        dispatch({
          likeArticlePayload: response,
          type: UNLIKE_ARTICLE_SUCCESS,
          id: item.id,
        });
      })
      .catch((error) => {
        dispatch({
          type: UNLIKE_ARTICLE_FAIL,
        });
        // dispatch(errorHandler(error.data.errors[0].title));
      });
  };
}
