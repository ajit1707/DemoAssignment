import _ from 'lodash';
import Toast from 'react-native-simple-toast';
import {NEWS_ARTICLES, ARTICLES, CATEGORIES} from '../utility/apis';
import {httpGet} from '../utility/http';
import Config from '../utility/config';
import {
  LIKE_ARTICLE_SUCCESS,
  LIKE_ARTICLE_FAIL,
  UNLIKE_ARTICLE_SUCCESS,
  UNLIKE_ARTICLE_FAIL,
} from '../modules/likeUnlikeArticle';
import Constant from '../utility/constant';
import {logEventForAnalytics} from '../utility/firebase-utils';

const GET_NEWS_ARTICLES_REQUEST = 'GET_NEWS_ARTICLES_REQUEST';
const GET_NEWS_ARTICLES_SUCCESS = 'GET_NEWS_ARTICLES_SUCCESS';
const GET_NEWS_ARTICLES_FAIL = 'GET_NEWS_ARTICLES_FAIL';
const GET_FEATURED_ARTICLES_REQUEST = 'GET_FEATURED_ARTICLES_REQUEST';
const GET_FEATURED_ARTICLES_SUCCESS = 'GET_FEATURED_ARTICLES_SUCCESS';
const GET_FEATURED_ARTICLES_FAIL = 'GET_FEATURED_ARTICLES_FAIL';
const GET_RELATED_ARTICLES_REQUEST = 'GET_RELATED_ARTICLES_REQUEST';
const GET_RELATED_ARTICLES_SUCCESS = 'GET_RELATED_ARTICLES_SUCCESS';
const GET_RELATED_ARTICLES_FAIL = 'GET_RELATED_ARTICLES_FAIL';
const GET_ARTICLES_REQUEST = 'GET_ARTICLES_REQUEST';
const GET_ARTICLES_SUCCESS = 'GET_ARTICLES_SUCCESS';
const GET_ARTICLES_FAIL = 'GET_ARTICLES_FAIL';
const REMOVE_ARTICLE = 'REMOVE_ARTICLE';
const REMOVE_BRIGHTKNOWLEDGE_LIST = 'REMOVE_BRIGHTKNOWLEDGE_LIST';
const GET_ESSENTIAL_CATEGORIES_REQUEST = 'GET_ESSENTIAL_CATEGORIES_REQUEST';
const GET_ESSENTIAL_CATEGORIES_SUCCESS = 'GET_ESSENTIAL_CATEGORIES_SUCCESS';
const GET_ESSENTIAL_CATEGORIES_FAIL = 'GET_ESSENTIAL_CATEGORIES_FAIL';
const GET_NON_ESSENTIAL_CATEGORIES_REQUEST =
  'GET_NON_ESSENTIAL_CATEGORIES_REQUEST';
const GET_NON_ESSENTIAL_CATEGORIES_SUCCESS =
  'GET_NON_ESSENTIAL_CATEGORIES_SUCCESS';
const GET_NON_ESSENTIAL_CATEGORIES_FAIL = 'GET_NON_ESSENTIAL_CATEGORIES_FAIL';
const CLEAR_ATTACHMENT_ARTICLES = 'CLEAR_ATTACHMENT_ARTICLES';

const ADD_ATTACHMENT_ARTICLES = 'ADD_ATTACHMENT_ARTICLES';

export function getNewsArticles(pageNumber) {
  return async (dispatch) => {
    dispatch({
      type: GET_NEWS_ARTICLES_REQUEST,
    });
    {
      pageNumber &&
        httpGet(
          `${Config.BASE_URL}${NEWS_ARTICLES}?filter[is_draft]=false&include=category&page[number]=${pageNumber}&page[size]=10`,
        )
          .then((response) => {
            response.data.data.forEach((item) => {
              item.isAttachmentPressed = false;
            });
            dispatch({
              newsArticlePayload: response.data,
              type: GET_NEWS_ARTICLES_SUCCESS,
            });
          })
          .catch((error) => {
            dispatch({
              type: GET_NEWS_ARTICLES_FAIL,
            });
            // dispatch(errorHandler(error.data.errors[0].title));
          });
    }
  };
}

export function getArticles(pageNumber) {
  return async (dispatch) =>
    new Promise((resolve) => {
      dispatch({
        type: GET_FEATURED_ARTICLES_REQUEST,
      });
      httpGet(
        `${Config.BASE_URL}${ARTICLES}?filter[draft]=false&filter[featured]=true&include=category&page[number]=${pageNumber}&page[size]=10)`,
      )
        .then((response) => {
          response.data.data.forEach((item) => {
            item.isAttachmentPressed = false;
          });
          dispatch({
            featuredArticlesPayload: response.data,
            type: GET_FEATURED_ARTICLES_SUCCESS,
          });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: GET_FEATURED_ARTICLES_FAIL,
          });
          // dispatch(errorHandler(error.data.errors[1].title));
        });
    });
}

export function getRelatedNewsArticle(categoryId) {
  return async (dispatch) => {
    dispatch({
      type: GET_RELATED_ARTICLES_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}${ARTICLES}?filter[for_category]=${categoryId}&filter[is_draft]=false&include=category&page[number]&page[size]=10`,
    )
      .then((response) => {
        dispatch({
          relatedArticleDataPayload: response.data,
          type: GET_RELATED_ARTICLES_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_RELATED_ARTICLES_FAIL,
        });
        // dispatch(errorHandler(error.data.errors[0].title));
      });
  };
}

export function openArticle(type, slug) {
  let section;
  return async (dispatch) =>
    new Promise((resolve) => {
      dispatch({
        type: GET_ARTICLES_REQUEST,
      });
      if (type === 'articles') {
        section = 'category,sections';
      } else {
        section = 'category';
      }
      httpGet(`${Config.BASE_URL}${type}/${slug}?include=${section}`)
        .then((res) => {
          res.data.data.isAttachmentPressed = false;
          dispatch({
            articlesDataPayload: res.data,
            type: GET_ARTICLES_SUCCESS,
          });
          resolve(res.data);
        })
        .catch(() => {
          dispatch({
            type: GET_ARTICLES_FAIL,
          });
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function clearArticle() {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_ARTICLE,
    });
  };
}

export function clearBrightKnowledgeList() {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_BRIGHTKNOWLEDGE_LIST,
    });
  };
}

export function getEssentialCategories() {
  return async (dispatch) => {
    dispatch({
      type: GET_ESSENTIAL_CATEGORIES_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}${CATEGORIES}?filter[essential]=true&filter[type]=category&filter[with_articles]=true&include=`,
    )
      .then((res) => {
        dispatch({
          essentialCategoriesPayload: res.data,
          type: GET_ESSENTIAL_CATEGORIES_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_ESSENTIAL_CATEGORIES_FAIL,
        });
        // dispatch(errorHandler(error.data.errors[0].title));
      });
  };
}

export function getNonEssentialCategories() {
  return async (dispatch) => {
    dispatch({
      type: GET_NON_ESSENTIAL_CATEGORIES_REQUEST,
    });
    httpGet(
      `${Config.BASE_URL}${CATEGORIES}?filter[essential]=false&filter[type]=category&filter[with_articles]=true&include=`,
    )
      .then((res) => {
        dispatch({
          nonEssentialCategoriesPayload: res.data,
          type: GET_NON_ESSENTIAL_CATEGORIES_SUCCESS,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_NON_ESSENTIAL_CATEGORIES_FAIL,
        });
        // dispatch(errorHandler(error.data.errors[0].title));
      });
  };
}

export function onAttachmentPress(item, routeName) {
  return (dispatch) => {
    dispatch({
      type: ADD_ATTACHMENT_ARTICLES,
      item,
      routeName,
    });
  };
}

export function clearCopiedLinkMessage() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ATTACHMENT_ARTICLES,
    });
  };
}

export const brightKnowledgeReducer = function brightKnowledgeReducer(
  state = {
    fetching: false,
    featuredArticlesPayload: {
      data: [],
      included: [],
    },
    newsArticlePayload: {
      data: [],
      included: [],
      meta: {},
    },
    brightKnowledgePayload: null,
    relatedArticleDataPayload: null,
    articlesDataPayload: null,
    essentialCategoriesPayload: {},
    nonEssentialCategoriesPayload: [],
    copiedLink: '',
    routeName: '',
  },
  action,
) {
  switch (action.type) {
    case GET_NEWS_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_NEWS_ARTICLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        newsArticlePayload: {
          ...state.newsArticlePayload,
          ...action.newsArticlePayload,
          data: [
            ...state.newsArticlePayload.data,
            ...action.newsArticlePayload.data,
          ],
          included: [
            ...state.newsArticlePayload.included,
            ...action.newsArticlePayload.included,
          ],
          meta: {
            ...state.newsArticlePayload.meta,
            ...action.newsArticlePayload.meta,
          },
        },
        brightKnowledgePayload: {
          ...state.newsArticlePayload,
          ...action.newsArticlePayload,
          data: [
            ...state.newsArticlePayload.data,
            ...action.newsArticlePayload.data,
          ],
          included: [
            ...state.newsArticlePayload.included,
            ...action.newsArticlePayload.included,
          ],
          meta: {
            ...state.newsArticlePayload.meta,
            ...action.newsArticlePayload.meta,
          },
        },
      };
    }
    case GET_NEWS_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case LIKE_ARTICLE_SUCCESS: {
      const article = state.brightKnowledgePayload.data.filter(
        (object) => object.id === String(action.id),
      );
      const articleLiked = state.articlesDataPayload;
      if (article.length > 0) {
        article[0].attributes.like_count += 1;
        article[0].attributes.like_status = true;
        if (state.articlesDataPayload !== null) {
          articleLiked.data.attributes.like_count += 1;
          articleLiked.data.attributes.like_status = true;
          return {
            ...state,
            brightKnowledgePayload: {
              ...state.brightKnowledgePayload,
              data: [...state.brightKnowledgePayload.data],
            },
            articlesDataPayload: {
              ...state.articlesDataPayload,
              data: {...state.articlesDataPayload.data},
            },
          };
        }
        return {
          ...state,
          brightKnowledgePayload: {
            ...state.brightKnowledgePayload,
            data: [...state.brightKnowledgePayload.data],
          },
        };
      }
      articleLiked.data.attributes.like_count += 1;
      articleLiked.data.attributes.like_status = true;
      return {
        ...state,
        brightKnowledgePayload: {
          ...state.brightKnowledgePayload,
        },
        articlesDataPayload: {
          ...state.articlesDataPayload,
          data: {...state.articlesDataPayload.data},
        },
      };
    }

    case LIKE_ARTICLE_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }

    case UNLIKE_ARTICLE_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case UNLIKE_ARTICLE_SUCCESS: {
      const article = state.brightKnowledgePayload.data.filter(
        (object) => object.id === String(action.id),
      );
      const articleUnliked = state.articlesDataPayload;
      if (article.length > 0) {
        article[0].attributes.like_count -= 1;
        article[0].attributes.like_status = false;
        if (state.articlesDataPayload !== null) {
          articleUnliked.data.attributes.like_count -= 1;
          articleUnliked.data.attributes.like_status = false;
          return {
            ...state,
            brightKnowledgePayload: {
              ...state.brightKnowledgePayload,
              data: [...state.brightKnowledgePayload.data],
            },
            articlesDataPayload: {
              ...state.articlesDataPayload,
              data: {...state.articlesDataPayload.data},
            },
          };
        }
        return {
          ...state,
          brightKnowledgePayload: {
            ...state.brightKnowledgePayload,
            data: [...state.brightKnowledgePayload.data],
          },
        };
      }
      articleUnliked.data.attributes.like_count -= 1;
      articleUnliked.data.attributes.like_status = false;
      return {
        ...state,
        brightKnowledgePayload: {
          ...state.brightKnowledgePayload,
        },
        articlesDataPayload: {
          ...state.articlesDataPayload,
          data: {...state.articlesDataPayload.data},
        },
      };
    }
    case GET_FEATURED_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_FEATURED_ARTICLES_SUCCESS: {
      const attributesData = action.featuredArticlesPayload.data.filter(
        (object) => !!object.attributes.category_id,
      );
      const updatedData = action.featuredArticlesPayload;
      updatedData.data = attributesData;
      return {
        ...state,
        fetching: false,
        featuredArticlesPayload: {
          ...state.featuredArticlesPayload,
          ...action.featuredArticlesPayload,
          data: [...state.featuredArticlesPayload.data, ...attributesData],
          included: [
            ...state.featuredArticlesPayload.included,
            ...action.featuredArticlesPayload.included,
          ],
        },
        brightKnowledgePayload: {
          ...state.featuredArticlesPayload,
          ...action.featuredArticlesPayload,
          data: [...state.featuredArticlesPayload.data, ...attributesData],
          included: [
            ...state.featuredArticlesPayload.included,
            ...action.featuredArticlesPayload.included,
          ],
        },
      };
    }

    case GET_FEATURED_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case GET_RELATED_ARTICLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        relatedArticleDataPayload: action.relatedArticleDataPayload,
      };
    }
    case GET_RELATED_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_RELATED_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case GET_ARTICLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        articlesDataPayload: action.articlesDataPayload,
      };
    }
    case GET_ESSENTIAL_CATEGORIES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_NON_ESSENTIAL_CATEGORIES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_ARTICLES_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_ARTICLES_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case REMOVE_ARTICLE: {
      return {
        ...state,
        articlesDataPayload: null,
        relatedArticleDataPayload: null,
      };
    }
    case CLEAR_ATTACHMENT_ARTICLES: {
      return {
        ...state,
        copiedLink: '',
      };
    }
    case REMOVE_BRIGHTKNOWLEDGE_LIST: {
      return {
        ...state,
        featuredArticlesPayload: {
          data: [],
          included: [],
        },
        newsArticlePayload: {
          data: [],
          included: [],
          meta: {},
        },
        brightKnowledgePayload: {},
        relatedArticleDataPayload: null,
        articlesDataPayload: null,
        essentialCategoriesPayload: {},
        nonEssentialCategoriesPayload: [],
      };
    }

    case GET_ESSENTIAL_CATEGORIES_SUCCESS: {
      const payload = action.essentialCategoriesPayload;
      payload.categoryTitle = 'Essentials';
      return {
        ...state,
        fetching: true,
        essentialCategoriesPayload: payload,
      };
    }
    case GET_NON_ESSENTIAL_CATEGORIES_SUCCESS: {
      const payload = action.nonEssentialCategoriesPayload;
      payload.categoryTitle = 'Subject';
      return {
        ...state,
        fetching: false,
        nonEssentialCategoriesPayload: payload,
        brightKnowledgePayload: {
          data: [
            state.essentialCategoriesPayload,
            action.nonEssentialCategoriesPayload,
          ],
        },
      };
    }
    case ADD_ATTACHMENT_ARTICLES: {
      let messages = '';
      const articleDetailData = state.articlesDataPayload;
      const brightKnowledgeListData = state.brightKnowledgePayload;
      let showToastMessage = true;
      const route = action.routeName;
      const filteredArticleData = _.cloneDeep(articleDetailData);
      const availableBrightKnowledgeListData = brightKnowledgeListData.data.filter(
        (item) => item.id === action.item.id,
      );
      let toastMessage = Constant.LINK_REMOVED_MESSAGE;
      if (availableBrightKnowledgeListData.length !== 0) {
        if (route === 'list') {
          brightKnowledgeListData.data.forEach((item) => {
            if (item.id === action.item.id) {
              item.isAttachmentPressed = !item.isAttachmentPressed;
              if (item.isAttachmentPressed) {
                toastMessage = Constant.LINK_COPIED_MESSAGE;
              }
              messages += addRemoveCopiedLinkMessage(
                state,
                availableBrightKnowledgeListData,
              );
            }
          });
        } else if (articleDetailData) {
          if (
            filteredArticleData.data.isAttachmentPressed &&
            availableBrightKnowledgeListData[0].isAttachmentPressed
          ) {
            messages += [
              `${state.copiedLink.replace(
                `${Constant.READ_ARTICLE_TEXT} ${availableBrightKnowledgeListData[0].attributes.knowledge_url}\n`,
                '',
              )}`,
            ];
            filteredArticleData.data.isAttachmentPressed = false;
            brightKnowledgeListData.data.forEach((item) => {
              if (item.id === action.item.id) {
                item.isAttachmentPressed = false;
              }
            });
          } else if (
            !filteredArticleData.data.isAttachmentPressed &&
            !availableBrightKnowledgeListData[0].isAttachmentPressed
          ) {
            messages += [
              `${state.copiedLink}${Constant.READ_ARTICLE_TEXT} ${availableBrightKnowledgeListData[0].attributes.knowledge_url}\n`,
            ];
            toastMessage = Constant.LINK_COPIED_MESSAGE;
            filteredArticleData.data.isAttachmentPressed = true;
            brightKnowledgeListData.data.forEach((item) => {
              if (item.id === action.item.id) {
                item.isAttachmentPressed = true;
              }
            });
          } else if (
            !filteredArticleData.data.isAttachmentPressed &&
            availableBrightKnowledgeListData[0].isAttachmentPressed
          ) {
            messages += state.copiedLink;
            showToastMessage = false;
            toastMessage = Constant.LINK_COPIED_MESSAGE;
            filteredArticleData.data.isAttachmentPressed = true;
          }
        }
      } else {
        filteredArticleData.data.isAttachmentPressed = !filteredArticleData.data
          .isAttachmentPressed;
        if (
          !state.copiedLink.includes(
            `${filteredArticleData.data.attributes.knowledge_url}\n`,
          )
        ) {
          messages += [
            `${state.copiedLink}${Constant.READ_ARTICLE_TEXT} ${filteredArticleData.data.attributes.knowledge_url}\n`,
          ];
        } else {
          messages += [
            `${state.copiedLink.replace(
              `${Constant.READ_ARTICLE_TEXT} ${filteredArticleData.data.attributes.knowledge_url}\n`,
              '',
            )}`,
          ];
        }
        if (filteredArticleData.data.isAttachmentPressed) {
          toastMessage = Constant.LINK_COPIED_MESSAGE;
        }
      }
      if (showToastMessage) {
        if (toastMessage === Constant.LINK_COPIED_MESSAGE) {
          logEventForAnalytics('copy_article', {});
          Toast.showWithGravity(toastMessage, Toast.SHORT, Toast.BOTTOM);
        } else {
          logEventForAnalytics('remove_article', {});
        }
      }
      return {
        ...state,
        brightKnowledgePayload: {
          ...brightKnowledgeListData,
        },
        articlesDataPayload:
          state.articlesDataPayload && filteredArticleData
            ? {
                ...filteredArticleData,
              }
            : null,
        copiedLink: messages,
      };
    }
    default: {
      return state;
    }
  }
};
const addRemoveCopiedLinkMessage = (
  state,
  availableBrightKnowledgeListData,
) => {
  let message = '';
  if (
    !state.copiedLink.includes(
      `${availableBrightKnowledgeListData[0].attributes.knowledge_url}\n`,
    )
  ) {
    message = [
      `${state.copiedLink}${Constant.READ_ARTICLE_TEXT} ${availableBrightKnowledgeListData[0].attributes.knowledge_url}\n`,
    ];
  } else {
    message = [
      `${state.copiedLink.replace(
        `${Constant.READ_ARTICLE_TEXT} ${availableBrightKnowledgeListData[0].attributes.knowledge_url}\n`,
        '',
      )}`,
    ];
  }
  return message;
};
