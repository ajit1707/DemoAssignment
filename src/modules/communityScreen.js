import AsyncStorage from '@react-native-async-storage/async-storage';
import {POSTS, THREADS, TOPICS} from '../utility/apis';
import {httpGet, httpPost, httpDelete, httpPut} from '../utility/http';
import Constant from '../utility/constant';

const GET_TOPICS_REQUEST = 'GET_TOPICS_REQUEST';
const GET_TOPICS_SUCCESS = 'GET_TOPICS_SUCCESS';
const GET_TOPICS_FAIL = 'GET_TOPICS_FAIL';

const GET_ALL_TOPICS_REQUEST = 'GET_ALL_TOPICS_REQUEST';
const GET_ALL_TOPICS_SUCCESS = 'GET_ALL_TOPICS_SUCCESS';
const GET_ALL_TOPICS_FAIL = 'GET_ALL_TOPICS_FAIL';

const GET_THREADS_REQUEST = 'GET_THREADS_REQUEST';
const GET_THREADS_SUCCESS = 'GET_THREADS_SUCCESS';
const GET_THREADS_FAIL = 'GET_THREADS_FAIL';

const GET_ARCHIVE_THREADS_REQUEST = 'GET_ARCHIVE_THREADS_REQUEST';
const GET_ARCHIVE_THREADS_SUCCESS = 'GET_ARCHIVE_THREADS_SUCCESS';
const GET_ARCHIVE_THREADS_FAIL = 'GET_ARCHIVE_THREADS_FAIL';

const GET_THREADS_FOR_TOPIC_REQUEST = 'GET_THREADS_FOR_TOPIC_REQUEST';
const GET_THREADS_FOR_TOPIC_SUCCESS = 'GET_THREADS_FOR_TOPIC_SUCCESS';
const GET_THREADS_FOR_TOPIC_FAIL = 'GET_THREADS_FOR_TOPIC_FAIL';

const GET_SEARCHED_POST_OF_THREADS_REQUEST =
  'GET_SEARCHED_POST_OF_THREADS_REQUEST';
const GET_SEARCHED_POST_OF_THREADS_SUCCESS =
  'GET_SEARCHED_POST_OF_THREADS_SUCCESS';
const GET_SEARCHED_POST_OF_THREADS_FAIL = 'GET_SEARCHED_POST_OF_THREADS_FAIL';

const GET_SEARCHED_THREADS_OF_TOPICS_REQUEST =
  'GET_SEARCHED_THREADS_OF_TOPICS_REQUEST';
const GET_SEARCHED_THREADS_OF_TOPICS_SUCCESS =
  'GET_SEARCHED_THREADS_OF_TOPICS_SUCCESS';
const GET_SEARCHED_THREADS_OF_TOPICS_FAIL =
  'GET_SEARCHED_THREADS_OF_TOPICS_FAIL';

const POST_FOLLOW_THREADS_REQUEST = 'POST_FOLLOW_THREADS_REQUEST';
const POST_FOLLOW_THREADS_SUCCESS = 'POST_FOLLOW_THREADS_SUCCESS';
const POST_FOLLOW_THREADS_FAIL = 'POST_FOLLOW_THREADS_FAIL';

const POST_LIKE_THREADS_REQUEST = 'POST_LIKE_THREADS_REQUEST';
const POST_LIKE_THREADS_SUCCESS = 'POST_LIKE_THREADS_SUCCESS';
const POST_LIKE_THREADS_FAIL = 'POST_LIKE_THREADS_FAIL';

const POST_LIKE_THREADS_POST_REQUEST = 'POST_LIKE_THREADS_POST_REQUEST';
const POST_LIKE_THREADS_POST_SUCCESS = 'POST_LIKE_THREADS_POST_SUCCESS';
const POST_LIKE_THREADS_POST_FAIL = 'POST_LIKE_THREADS_POST_FAIL';

const GET_THREADS_DATA_REQUEST = 'GET_THREADS_DATA_REQUEST';
const GET_THREADS_DATA_SUCCESS = 'GET_THREADS_DATA_SUCCESS';
const GET_THREADS_DATA_FAIL = 'GET_THREADS_DATA_FAIL';

const DELETE_THREAD_POST_REQUEST = 'DELETE_THREAD_POST_REQUEST';
const DELETE_THREAD_POST_SUCCESS = 'DELETE_THREAD_POST_SUCCESS';
const DELETE_THREAD_POST_FAIL = 'DELETE_THREAD_POST_FAIL';

const SUBMIT_THREAD_POST_REQUEST = 'SUBMIT_THREAD_POST_REQUEST';
const SUBMIT_THREAD_POST_SUCCESS = 'SUBMIT_THREAD_POST_SUCCESS';
const SUBMIT_THREAD_POST_FAIL = 'SUBMIT_THREAD_POST_FAIL';

const UPDATE_THREADS_POST_REQUEST = 'UPDATE_THREADS_POST_REQUEST';
const UPDATE_THREADS_POST_SUCCESS = 'UPDATE_THREADS_POST_SUCCESS';
const UPDATE_THREADS_POST_FAIL = 'UPDATE_THREADS_POST_FAIL';

const UPDATE_THREADS_REQUEST = 'UPDATE_THREADS_REQUEST';
const UPDATE_THREADS_SUCCESS = 'UPDATE_THREADS_SUCCESS';
const UPDATE_THREADS_FAIL = 'UPDATE_THREADS_FAIL';

const UPDATE_TOPICS_REQUEST = 'UPDATE_TOPICS_REQUEST';
const UPDATE_TOPICS_SUCCESS = 'UPDATE_TOPICS_SUCCESS';
const UPDATE_TOPICS_FAIL = 'UPDATE_TOPICS_FAIL';

const SELECT_MULTIPLE_TOPICS = 'SELECT_MULTIPLE_TOPICS';
const SELECT_TOPIC = 'SELECT_TOPIC';

const POST_SUBMIT_TOPIC_REQUEST = 'POST_SUBMIT_TOPIC_REQUEST';
const POST_SUBMIT_TOPIC_SUCCESS = 'POST_SUBMIT_TOPIC_SUCCESS';
const POST_SUBMIT_TOPIC_FAIL = 'POST_SUBMIT_TOPIC_FAIL';

const POST_SUBMIT_THREAD_REQUEST = 'POST_SUBMIT_THREAD_REQUEST';
const POST_SUBMIT_THREAD_SUCCESS = 'POST_SUBMIT_THREAD_SUCCESS';
const POST_SUBMIT_THREAD_FAIL = 'POST_SUBMIT_THREAD_FAIL';

const CLEAR_PAYLOAD = 'CLEAR_PAYLOAD';
const CLEAR_SELECTED_TOPICS = 'CLEAR_SELECTED_TOPICS';

export function getTopics(pageNumber) {
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
        type: GET_TOPICS_REQUEST,
      });
      httpGet(
        `${TOPICS}?filter[project_id]=${projectId.id}&page[number]=${pageNumber}&page[size]=15`,
      )
        .then((response) => {
          resolve(response.data);
          dispatch({
            topics: response.data,
            type: GET_TOPICS_SUCCESS,
            pageNumber,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_TOPICS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function getAllTopics() {
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
        type: GET_ALL_TOPICS_REQUEST,
      });
      httpGet(
        `${TOPICS}?filter[project_id]=${projectId.id}&filter[is_active]=true`,
      )
        .then((response) => {
          response.data.data.forEach((item) => (item.isChecked = false));
          response.data.selectAll = {
            attributes: {name: 'Select All'},
            isChecked: false,
          };
          resolve(response.data);
          dispatch({
            allTopicsData: response.data,
            type: GET_ALL_TOPICS_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_ALL_TOPICS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function getThreads(pageNumber) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: GET_THREADS_REQUEST,
      });
      httpGet(
        `${THREADS}?filter[archived]=false&page[number]=${pageNumber}&page[size]=10&filter[sort_by_last_post]=DESC`,
      )
        .then((response) => {
          resolve(response.data);
          dispatch({
            threads: response.data,
            type: GET_THREADS_SUCCESS,
            pageNumber,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_THREADS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function getArchivedThreads(pageNumber) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: GET_ARCHIVE_THREADS_REQUEST,
      });
      httpGet(
        `${THREADS}?filter[archived]=true&page[number]=${pageNumber}&page[size]=10&filter[sort_by_last_post]=DESC`,
      )
        .then((response) => {
          resolve(response.data);
          dispatch({
            archiveThreads: response.data,
            type: GET_ARCHIVE_THREADS_SUCCESS,
            pageNumber,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_ARCHIVE_THREADS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function getThreadsForTopic(pageNumber, topic) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: GET_THREADS_FOR_TOPIC_REQUEST,
      });
      httpGet(
        `${THREADS}?filter[for_topics]=${topic}&page[number]=${pageNumber}&page[size]=10&filter[sort_by_last_post]=DESC`,
      )
        .then((response) => {
          resolve(response.data);
          dispatch({
            threadsForTopic: response.data,
            type: GET_THREADS_FOR_TOPIC_SUCCESS,
            pageNumber,
            topic,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_THREADS_FOR_TOPIC_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function likeThreads(threadId, payload) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: POST_LIKE_THREADS_REQUEST,
      });
      httpPost(`${THREADS}/${threadId}/like`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            likeThreads: response.data,
            type: POST_LIKE_THREADS_SUCCESS,
            threadId,
          });
        })
        .catch((error) => {
          dispatch({
            type: POST_LIKE_THREADS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function followThreads(threadId, payload) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: POST_FOLLOW_THREADS_REQUEST,
      });
      httpPost(`${THREADS}/${threadId}/follow`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            followThreads: response.data,
            type: POST_FOLLOW_THREADS_SUCCESS,
            threadId,
          });
        })
        .catch((error) => {
          dispatch({
            type: POST_FOLLOW_THREADS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function getThreadsData(slug) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: GET_THREADS_DATA_REQUEST,
      });
      httpGet(`${THREADS}/${slug}`)
        .then((response) => {
          resolve(response.data);
          dispatch({
            threadsPost: response.data,
            threadsPostSlug: slug,
            type: GET_THREADS_DATA_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_THREADS_DATA_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function deletePost(postId) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: DELETE_THREAD_POST_REQUEST,
      });
      httpDelete(`${POSTS}/${postId}`)
        .then((response) => {
          resolve(response.data);
          dispatch({
            deletedPost: response.data,
            type: DELETE_THREAD_POST_SUCCESS,
            postId,
          });
        })
        .catch((error) => {
          dispatch({
            type: DELETE_THREAD_POST_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function submitPost(payload) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: SUBMIT_THREAD_POST_REQUEST,
      });
      httpPost(`${POSTS}`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            submitPost: response.data,
            type: SUBMIT_THREAD_POST_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: SUBMIT_THREAD_POST_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function getSearchedThreadsPostData(threadId, string) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: GET_SEARCHED_POST_OF_THREADS_REQUEST,
      });
      httpGet(
        `${POSTS}?filter[for_thread]=${threadId}&filter[search]=${string}`,
      )
        .then((response) => {
          resolve(response.data);
          dispatch({
            threadId,
            string,
            threadsSearchedPost: response.data,
            type: GET_SEARCHED_POST_OF_THREADS_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_SEARCHED_POST_OF_THREADS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function getSearchedThreadsData(pageNumber, threadIds, string, route) {
  let url;
  if (threadIds.length > 0) {
    url = `filter[search]=${string}&filter[for_topics]=${threadIds}&page[number]=${pageNumber}&page[size]=25`;
  } else {
    url = `filter[search]=${string}&page[number]=${pageNumber}&page[size]=25`;
  }
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: GET_SEARCHED_THREADS_OF_TOPICS_REQUEST,
      });
      httpGet(`${THREADS}?${url}`)
        .then((response) => {
          resolve(response.data);
          dispatch({
            searchedThreadsOfTopics: response.data,
            type: GET_SEARCHED_THREADS_OF_TOPICS_SUCCESS,
            pageNumber,
            threadIds,
            string,
            route,
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_SEARCHED_THREADS_OF_TOPICS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function threadPostLike(threadPostId, payload) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: POST_LIKE_THREADS_POST_REQUEST,
      });
      httpPost(`${POSTS}/${threadPostId}/like`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            threadPostId,
            type: POST_LIKE_THREADS_POST_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: POST_LIKE_THREADS_POST_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function updatedPost(threadPostId, payload) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: UPDATE_THREADS_POST_REQUEST,
      });
      httpPut(`${POSTS}/${threadPostId}`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            threadPostId,
            type: UPDATE_THREADS_POST_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_THREADS_POST_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function selectTopicsForThread(
  id,
  index,
  name,
  isChecked,
  isAllChecked,
) {
  return (dispatch) => {
    dispatch({
      type: SELECT_MULTIPLE_TOPICS,
      id,
      name,
      isChecked,
      isAllChecked,
    });
  };
}
export function selectTopicForAddThread(id, name, isChecked) {
  return (dispatch) => {
    dispatch({
      type: SELECT_TOPIC,
      id,
      name,
      isChecked,
    });
  };
}

export function submitTopic(payload) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: POST_SUBMIT_TOPIC_REQUEST,
      });
      httpPost(`${TOPICS}`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            submitPost: response.data,
            type: POST_SUBMIT_TOPIC_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: POST_SUBMIT_TOPIC_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function submitThread(payload) {
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
        type: POST_SUBMIT_THREAD_REQUEST,
      });
      httpPost(`${THREADS}`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            submitThread: response.data,
            type: POST_SUBMIT_THREAD_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: POST_SUBMIT_THREAD_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function updatedTopic(topicPostId, payload) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: UPDATE_TOPICS_REQUEST,
      });
      httpPut(`${TOPICS}/${topicPostId}`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            topicPostId,
            type: UPDATE_TOPICS_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_TOPICS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}
export function updatedThread(threadPostId, payload) {
  return (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch({
        type: UPDATE_THREADS_REQUEST,
      });
      const {
        data: {
          attributes: {is_archived},
        },
      } = payload;
      httpPut(`${THREADS}/${threadPostId}`, payload)
        .then((response) => {
          resolve(response.data);
          dispatch({
            threadPostId,
            is_archived,
            type: UPDATE_THREADS_SUCCESS,
          });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_THREADS_FAIL,
          });
          reject(error);
          // dispatch(errorHandler(error.data.errors[0].title));
        });
    });
}

export function clearPayload(route) {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PAYLOAD,
      route,
    });
  };
}

export function clearSelectedTopics() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_SELECTED_TOPICS,
    });
  };
}

export default function getCommunityScreenReducer(
  state = {
    fetching: false,
    topics: null,
    threads: null,
    archiveThreads: null,
    threadsForTopic: null,
    threadsPost: null,
    threadsPostSlug: null,
    threadsSearchedPost: null,
    searchedThreadsOfTopics: null,
    searchedThreads: null,
    allTopicsData: null,
    pageNumber: 1,
    threadsPageNumber: 1,
    threadsForTopicPageNumber: 1,
    archiveThreadsPageNumber: 1,
    searchedThreadsPageNumber: 1,
    searchedThreadsOfTopicsPageNumber: 1,
    topicId: null,
    threadPostSearchString: null,
    threadPostSearchId: null,
  },
  action,
) {
  switch (action.type) {
    case GET_TOPICS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_TOPICS_SUCCESS: {
      const getTopicSelectorData = getTopicSelector(state, action);
      return {
        ...state,
        topics: getTopicSelectorData.topics,
        fetching: getTopicSelectorData.fetching,
        pageNumber: getTopicSelectorData.pageNumber,
      };
    }
    case GET_TOPICS_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case GET_ALL_TOPICS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_ALL_TOPICS_SUCCESS: {
      return {
        ...state,
        allTopicsData: action.allTopicsData,
        fetching: false,
      };
    }
    case GET_ALL_TOPICS_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case GET_THREADS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_THREADS_SUCCESS: {
      const getThreadSelectorData = getThreadSelector(state, action);
      return {
        ...state,
        threads: getThreadSelectorData.threads,
        fetching: getThreadSelectorData.fetching,
        threadsPageNumber: action.pageNumber + 1,
      };
    }
    case GET_ARCHIVE_THREADS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_ARCHIVE_THREADS_SUCCESS: {
      const getArchiveSelectorData = getArchiveSelector(state, action);
      return {
        ...state,
        archiveThreads: getArchiveSelectorData.archiveThreads,
        archiveThreadsPageNumber:
          getArchiveSelectorData.archiveThreadsPageNumber,
        fetching: false,
      };
    }
    case POST_LIKE_THREADS_SUCCESS: {
      const likeSelectorData = likeSelector(state, action);
      return {
        ...state,
        threads: likeSelectorData.newThreadsData,
        searchedThreadsOfTopics: likeSelectorData.newSearchData,
        threadsForTopic: likeSelectorData.newTopicForThreadsData,
        archiveThreads: likeSelectorData.newArchiveThreadsData,
        threadsPost: likeSelectorData.threadsPostData,
        searchedThreads: likeSelectorData.newSearchThreads,
      };
    }
    case POST_FOLLOW_THREADS_SUCCESS: {
      const postSelectorData = postSelector(state, action);
      return {
        ...state,
        threads: postSelectorData.newThreadsData,
        searchedThreadsOfTopics: postSelectorData.newSearchData,
        threadsForTopic: postSelectorData.newTopicForThreadsData,
        archiveThreads: postSelectorData.newArchiveThreadsData,
        threadsPost: postSelectorData.threadsPostData,
        searchedThreads: postSelectorData.newSearchThreads,
      };
    }
    case GET_THREADS_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case GET_THREADS_FOR_TOPIC_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_THREADS_FOR_TOPIC_SUCCESS: {
      const data = getThreadForTopicSelector(state, action);
      return {
        ...state,
        threadsForTopic: data.threadsForTopic,
        threadsForTopicPageNumber: action.pageNumber + 1,
        fetching: data.fetching,
      };
    }
    case GET_THREADS_FOR_TOPIC_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case GET_THREADS_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_THREADS_DATA_SUCCESS: {
      return {
        ...state,
        threadsPost: action.threadsPost,
        threadsPostSlug: action.threadsPostSlug,
        fetching: false,
      };
    }
    case GET_THREADS_DATA_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case GET_SEARCHED_POST_OF_THREADS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_SEARCHED_POST_OF_THREADS_SUCCESS: {
      return {
        ...state,
        threadPostSearchId: action.threadId,
        threadPostSearchString: action.string,
        threadsSearchedPost: action.threadsSearchedPost,
        fetching: false,
      };
    }
    case GET_SEARCHED_THREADS_OF_TOPICS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GET_SEARCHED_THREADS_OF_TOPICS_SUCCESS: {
      const getSearchedThreadSelectorData = getSearchedThreadSelector(
        state,
        action,
      );
      return {
        ...state,
        searchedThreadsOfTopics:
          getSearchedThreadSelectorData.searchedThreadsOfTopics,
        searchedThreadsOfTopicsPageNumber:
          getSearchedThreadSelectorData.searchedThreadsOfTopicsPageNumber,
        fetching: getSearchedThreadSelectorData.fetching,
      };
    }
    case DELETE_THREAD_POST_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case DELETE_THREAD_POST_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case DELETE_THREAD_POST_SUCCESS: {
      const deleteSelectorData = deleteselector(state, action);
      return {
        ...state,
        threadsPost: deleteSelectorData.filteredPost,
        fetching: false,
      };
    }
    case POST_LIKE_THREADS_POST_SUCCESS: {
      const postLikeThreadPostSelectorData = postLikeThreadPostSelector(
        state,
        action,
      );
      return {
        ...state,
        threadsPost: postLikeThreadPostSelectorData.threadsPost,
      };
    }
    case POST_SUBMIT_THREAD_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case POST_SUBMIT_TOPIC_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case SUBMIT_THREAD_POST_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case UPDATE_THREADS_POST_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case SUBMIT_THREAD_POST_SUCCESS: {
      return {
        ...state,
        fetching: false,
      };
    }
    case SUBMIT_THREAD_POST_FAIL: {
      return {
        ...state,
        fetching: false,
      };
    }
    case POST_SUBMIT_THREAD_SUCCESS: {
      return {
        ...state,
        fetching: false,
      };
    }
    case POST_SUBMIT_TOPIC_SUCCESS: {
      return {
        ...state,
        fetching: false,
      };
    }

    case UPDATE_THREADS_POST_SUCCESS: {
      return {
        ...state,
        fetching: false,
      };
    }
    case SELECT_MULTIPLE_TOPICS: {
      const data = multipleTopicSelector(state, action);
      return {
        ...state,
        allTopicsData: data.allTopicsData,
      };
    }
    case SELECT_TOPIC: {
      const selectTopicSelectorData = selectTopicSelector(state, action);
      return {
        ...state,
        allTopicsData: selectTopicSelectorData.allTopicsData,
      };
    }
    case CLEAR_SELECTED_TOPICS: {
      const data = clearSelectedTopicSelector(state);
      return {
        ...state,
        allTopicsData: data.allTopicsData,
      };
    }
    case UPDATE_THREADS_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case UPDATE_THREADS_SUCCESS: {
      const updateThreadsSelectorData = updateThreadsSelector(state, action);
      return {
        ...state,
        fetching: updateThreadsSelectorData.fetching,
      };
    }
    case CLEAR_PAYLOAD: {
      clearPayloadSelector(state, action);
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}

const updateLikeStatus = (data) => {
  const filteredData = data;
  if (filteredData.attributes.current_user_like_status) {
    filteredData.attributes.like_count -= 1;
  } else {
    filteredData.attributes.like_count += 1;
  }
  filteredData.attributes.current_user_like_status = !filteredData.attributes
    .current_user_like_status;
  return filteredData;
};
const updateFollowStatus = (data) => {
  const filteredData = data;
  if (filteredData.attributes.current_user_follow_status) {
    filteredData.attributes.follow_count -= 1;
  } else {
    filteredData.attributes.follow_count += 1;
  }
  filteredData.attributes.current_user_follow_status = !filteredData.attributes
    .current_user_follow_status;
  return filteredData;
};
const likeSelector = (state, action) => {
  let newSearchData = state.searchedThreadsOfTopics;
  let newSearchThreads = state.searchedThreads;
  let newThreadsData = state.threads;
  let newTopicForThreadsData = state.threadsForTopic;
  let newArchiveThreadsData = state.archiveThreads;
  let threadsPostData = state.threadsPost;
  const {
    threads,
    threadsForTopic,
    searchedThreadsOfTopics,
    archiveThreads,
    threadsPost,
    searchedThreads,
  } = state;
  if (searchedThreadsOfTopics) {
    const updatedSearchThreads = searchedThreadsOfTopics.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedSearchThreads) {
      const updatedSearchData = updateLikeStatus(updatedSearchThreads);
      newSearchData = {
        ...state.searchedThreadsOfTopics,
        data: [
          ...new Set([...searchedThreadsOfTopics.data, updatedSearchData]),
        ],
      };
    }
  }
  if (searchedThreads) {
    const updatedSearchThreads = searchedThreads.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedSearchThreads) {
      const updatedSearchData = updateLikeStatus(updatedSearchThreads);
      newSearchThreads = {
        ...state.searchedThreads,
        data: [...new Set([...searchedThreads.data, updatedSearchData])],
      };
    }
  }
  if (threadsForTopic) {
    const updatedThreadsForTopic = threadsForTopic.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedThreadsForTopic) {
      const updatedTopicThreadsData = updateLikeStatus(updatedThreadsForTopic);
      newTopicForThreadsData = {
        ...state.threadsForTopic,
        data: [...new Set([...threadsForTopic.data, updatedTopicThreadsData])],
      };
    }
  }
  if (threads) {
    const updatedThreads = threads.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedThreads) {
      const updatedThreadsData = updateLikeStatus(updatedThreads);
      newThreadsData = {
        ...state.threads,
        data: [...new Set([...threads.data, updatedThreadsData])],
      };
    }
  }
  if (archiveThreads) {
    const updatedArchiveThreads = archiveThreads.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedArchiveThreads) {
      const updatedArchiveThreadsData = updateLikeStatus(updatedArchiveThreads);
      newArchiveThreadsData = {
        ...state.threads,
        data: [...new Set([...archiveThreads.data, updatedArchiveThreadsData])],
      };
    }
  }
  if (threadsPost) {
    const updateThreadsPost = threadsPostData.data;
    const updatedThreadsPost = updateLikeStatus(updateThreadsPost);
    threadsPostData = {...state.threadsPost, data: updatedThreadsPost};
  }
  return {
    ...state,
    newThreadsData,
    newSearchData,
    newTopicForThreadsData,
    newArchiveThreadsData,
    threadsPostData,
    newSearchThreads,
  };
};

const postSelector = (state, action) => {
  let newSearchData = state.searchedThreadsOfTopics;
  let newThreadsData = state.threads;
  let newTopicForThreadsData = state.threadsForTopic;
  let newArchiveThreadsData = state.archiveThreads;
  let threadsPostData = state.threadsPost;
  let newSearchThreads = state.searchedThreads;

  const {
    threads,
    threadsForTopic,
    searchedThreadsOfTopics,
    archiveThreads,
    threadsPost,
    searchedThreads,
  } = state;
  if (threads) {
    const updatedThreads = threads.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedThreads) {
      const updatedThreadsData = updateFollowStatus(updatedThreads);
      newThreadsData = {
        ...state.threads,
        data: [...new Set([...threads.data, updatedThreadsData])],
      };
    }
  }
  if (searchedThreadsOfTopics) {
    const updatedSearchThreads = searchedThreadsOfTopics.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedSearchThreads) {
      const updatedSearchData = updateFollowStatus(updatedSearchThreads);
      newSearchData = {
        ...state.searchedThreadsOfTopics,
        data: [
          ...new Set([...searchedThreadsOfTopics.data, updatedSearchData]),
        ],
      };
    }
  }
  if (searchedThreads) {
    const updatedSearchThreads = searchedThreads.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedSearchThreads) {
      const updatedSearchData = updateFollowStatus(updatedSearchThreads);
      newSearchThreads = {
        ...state.searchedThreads,
        data: [...new Set([...searchedThreads.data, updatedSearchData])],
      };
    }
  }
  if (threadsForTopic) {
    const updatedThreadsForTopic = threadsForTopic.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedThreadsForTopic) {
      const updatedTopicThreadsData = updateFollowStatus(
        updatedThreadsForTopic,
      );
      newTopicForThreadsData = {
        ...state.threadsForTopic,
        data: [...new Set([...threadsForTopic.data, updatedTopicThreadsData])],
      };
    }
  }
  if (archiveThreads) {
    const updatedArchiveThreads = archiveThreads.data.find(
      (item) => item.id === action.threadId,
    );
    if (updatedArchiveThreads) {
      const updatedArchiveThreadsData = updateFollowStatus(
        updatedArchiveThreads,
      );
      newArchiveThreadsData = {
        ...state.threads,
        data: [...new Set([...archiveThreads.data, updatedArchiveThreadsData])],
      };
    }
  }
  if (threadsPost) {
    const updateThreadsPost = threadsPostData.data;
    const updatedThreadsPost = updateFollowStatus(updateThreadsPost);
    threadsPostData = {...state.threadsPost, data: updatedThreadsPost};
  }
  return {
    ...state,
    newThreadsData,
    newSearchData,
    newTopicForThreadsData,
    newArchiveThreadsData,
    threadsPostData,
    newSearchThreads,
  };
};

const deleteselector = (state, action) => {
  const filteredPost = state.threadsPost;
  const updatedThreadPost = filteredPost.included.findIndex(
    (item) => item.id === action.postId,
  );
  filteredPost.included.splice(updatedThreadPost, 1);
  if (state.threadsSearchedPost) {
    const filteredSearchedThreadPost = state.threadsSearchedPost;
    const updatedSearchedPost = filteredSearchedThreadPost.data.findIndex(
      (item) => item.id === action.postId,
    );
    filteredSearchedThreadPost.data.splice(updatedSearchedPost, 1);
    return {
      ...state,
      fetching: false,
      threadsPost: filteredPost,
      threadsSearchedPost: filteredSearchedThreadPost,
    };
  }
  return {
    ...state,
    filteredPost,
  };
};

const getArchiveSelector = (state, action) => {
  if (action.pageNumber === 1) {
    return {
      ...state,
      archiveThreads: action.archiveThreads,
      archiveThreadsPageNumber: action.pageNumber + 1,
      fetching: false,
    };
  }
  return {
    ...state,
    archiveThreads: {
      ...state.archiveThreads,
      ...action.archiveThreads,
      data: [...state.archiveThreads.data, ...action.archiveThreads.data],
    },
    archiveThreadsPageNumber: action.pageNumber + 1,
  };
};

const clearPayloadSelector = (state, action) => {
  const {route} = action;
  if (route === 'search') {
    return {
      ...state,
      // threads: null,
      // threadsForTopic: null,
      // archiveThreads: null,
      threadsPageNumber: 1,
      // searchedThreadsOfTopics: null,
      searchedThreadsPageNumber: 1,
      archiveThreadsPageNumber: 1,
      threadsForTopicPageNumber: 1,
      searchedThreadsOfTopicsPageNumber: 1,
    };
  } else if (route === 'archive') {
    return {
      ...state,
      // threads: null,
      // searchedThreadsOfTopics: null,
      threadsPageNumber: 1,
      searchedThreadsPageNumber: 1,
    };
  } else if (route === 'active') {
    return {
      ...state,
      // threads: null,
      // searchedThreadsOfTopics: null,
      // archiveThreads: null,
      threadsPageNumber: 1,
      archiveThreadsPageNumber: 1,
      searchedThreadsPageNumber: 1,
      searchedThreadsOfTopicsPageNumber: 1,
    };
  } else if (route === 'addThread') {
    return {
      ...state,
      // threadsForTopic: null,
      // threads: null,
      threadsPageNumber: 1,
      threadsForTopicPageNumber: 1,
    };
  } else if (route === 'clearSearch') {
    return {
      ...state,
      // searchedThreadsOfTopics: null,
      searchedThreadsPageNumber: 1,
      searchedThreadsOfTopicsPageNumber: 1,
    };
  } else if (route === 'addTopic') {
    return {
      ...state,
      pageNumber: 1,
    };
  } else if (route === 'threadsForTopicUnmount') {
    return {
      ...state,
      threadsForTopic: null,
      searchedThreadsOfTopics: null,
      searchedThreadsOfTopicsPageNumber: 1,
      threadsForTopicPageNumber: 1,
      searchedThreadsPageNumber: 1,
    };
  } else if (route === 'threadPost') {
    return {
      ...state,
      threadsPost: null,
      threadsSearchedPost: null,
    };
  } else if (route === 'threadsForTopicSearch') {
    return {
      ...state,
      threadsForTopicPageNumber: 1,
      searchedThreadsPageNumber: 1,
      searchedThreadsOfTopicsPageNumber: 1,
    };
  } else if (route === 'threadRefresh') {
    return {
      ...state,
      // threads: null,
      // searchedThreadsOfTopics: null,
      // threadsForTopic: null,
      // archiveThreads: null,
      // threadsSearchedPost: null,
      threadsPageNumber: 1,
      threadsForTopicPageNumber: 1,
      archiveThreadsPageNumber: 1,
      searchedThreadsPageNumber: 1,
      searchedThreadsOfTopicsPageNumber: 1,
    };
  } else if (route === 'clearAll') {
    return {
      fetching: false,
      topics: null,
      threads: null,
      archiveThreads: null,
      threadsForTopic: null,
      threadsPost: null,
      threadsSearchedPost: null,
      searchedThreads: null,
      searchedThreadsOfTopics: null,
      allTopicsData: null,
      pageNumber: 1,
      threadsPageNumber: 1,
      threadsForTopicPageNumber: 1,
      archiveThreadsPageNumber: 1,
      searchedThreadsPageNumber: 1,
      searchedThreadsOfTopicsPageNumber: 1,
    };
  } else if (route === 'threadsClear') {
    return {};
  }
};

const updateThreadsSelector = (state, action) => {
  const activeThreads = state.threads;
  const selectedTopicThread = state.threadsForTopic;
  const archiveData = state.archiveThreads;
  if (action.is_archived) {
    if (selectedTopicThread) {
      const threadToArchive = selectedTopicThread.data.findIndex(
        (item) => item.id === action.threadPostId,
      );
      selectedTopicThread.data.splice(threadToArchive, 1);
      const indexToDelete = activeThreads.data.findIndex(
        (item) => item.id === action.threadPostId,
      );
      if (activeThreads) {
        activeThreads.data.splice(indexToDelete, 1);
      }
      return {
        ...state,
        fetching: false,
        threadsForTopic: selectedTopicThread,
        threads: activeThreads,
      };
    }
    const indexToDelete = activeThreads.data.findIndex(
      (item) => item.id === action.threadPostId,
    );
    activeThreads.data.splice(indexToDelete, 1);
    return {
      ...state,
      fetching: false,
      threads: activeThreads,
    };
  } else if (!action.is_archived) {
    const indexToDelete = archiveData.data.findIndex(
      (item) => item.id === action.threadPostId,
    );
    archiveData.data.splice(indexToDelete, 1);
    return {
      ...state,
      fetching: false,
      archiveThreads: archiveData,
    };
  }
  return {
    ...state,
    fetching: false,
  };
};

const clearSelectedTopicSelector = (state) => {
  const isCheckedFalseData = state.allTopicsData;
  isCheckedFalseData.data.forEach((item) => (item.isChecked = false));
  isCheckedFalseData.selectAll.isChecked = false;
  return {
    ...state,
    allTopicsData: isCheckedFalseData,
  };
};

const getSearchedThreadSelector = (state, action) => {
  if (action.route === 'thread') {
    if (action.pageNumber === 1) {
      return {
        ...state,
        searchedThreads: action.searchedThreadsOfTopics,
        fetching: false,
        searchedThreadsPageNumber: action.pageNumber + 1,
      };
    }
    return {
      ...state,
      searchedThreads: {
        ...state.searchedThreads,
        ...action.searchedThreadsOfTopics,
        data: [
          ...state.searchedThreads.data,
          ...action.searchedThreadsOfTopics.data,
        ],
      },
      searchedThreadsPageNumber: action.pageNumber + 1,
      threadsId: action.threadIds,
      searchString: action.string,
      fetching: false,
    };
  } else {
    if (action.pageNumber === 1) {
      return {
        ...state,
        searchedThreadsOfTopics: action.searchedThreadsOfTopics,
        fetching: false,
        searchedThreadsOfTopicsPageNumber: action.pageNumber + 1,
      };
    }
    return {
      ...state,
      searchedThreadsOfTopics: {
        ...state.searchedThreadsOfTopics,
        ...action.searchedThreadsOfTopics,
        data: [
          ...state.searchedThreadsOfTopics.data,
          ...action.searchedThreadsOfTopics.data,
        ],
      },
      searchedThreadsOfTopicsPageNumber: action.pageNumber + 1,
      fetching: false,
    };
  }
};

const selectTopicSelector = (state, action) => {
  const {id} = action;
  const selectedTopic = state.allTopicsData.data.filter((data) => {
    if (data.id === id) {
      data.isChecked = !data.isChecked;
    } else {
      data.isChecked = false;
    }
    return data;
  });
  return {
    ...state,
    allTopicsData: {...state.allTopicsData, data: selectedTopic},
  };
};

const getTopicSelector = (state, action) => {
  if (action.pageNumber === 1) {
    return {
      ...state,
      topics: action.topics,
      fetching: false,
      pageNumber: action.pageNumber + 1,
    };
  }
  return {
    ...state,
    topics: {
      ...state.topics,
      ...action.topics,
      data: [...state.topics.data, ...action.topics.data],
    },
    fetching: false,
    pageNumber: action.pageNumber + 1,
  };
};

const getThreadSelector = (state, action) => {
  if (action.pageNumber === 1) {
    return {
      ...state,
      threads: action.threads,
      fetching: false,
      threadsPageNumber: action.pageNumber + 1,
    };
  }
  return {
    ...state,
    threads: {
      ...state.threads,
      ...action.threads,
      data: [...state.threads.data, ...action.threads.data],
    },
    fetching: false,
  };
};

const multipleTopicSelector = (state, action) => {
  const {id, isChecked} = action;
  if (action.name === 'Select All') {
    return {
      ...state,
      allTopicsData: {
        ...state.allTopicsData,
        selectAll: {...state.allTopicsData.selectAll, isChecked: !isChecked},
        data: state.allTopicsData.data.map((topic) => {
          const updated = topic;
          updated.isChecked = !state.allTopicsData.selectAll.isChecked;
          return updated;
        }),
      },
    };
  }
  return {
    ...state,
    allTopicsData: {
      ...state.allTopicsData,
      selectAll: {
        ...state.allTopicsData.selectAll,
        isChecked: action.isAllChecked,
      },
      data: state.allTopicsData.data.map((topic) => {
        if (topic.id === id) {
          const updated = topic;
          updated.isChecked = !isChecked;
          return updated;
        }
        return topic;
      }),
    },
  };
};

const postLikeThreadPostSelector = (state, action) => {
  if (state.threadsSearchedPost) {
    return {
      ...state,
      threadsSearchedPost: {
        ...state.threadsSearchedPost,
        data: state.threadsSearchedPost.data.map((item) => {
          if (item.id === action.threadPostId) {
            return updateLikeStatus(item);
          }
          return item;
        }),
      },
      threadsPost: {
        ...state.threadsPost,
        included: state.threadsPost.included.map((item) => {
          if (item.id === action.threadPostId) {
            return updateLikeStatus(item);
          }
          return item;
        }),
      },
    };
  }
  return {
    ...state,
    threadsPost: {
      ...state.threadsPost,
      included: state.threadsPost.included.map((item) => {
        if (item.id === action.threadPostId) {
          return updateLikeStatus(item);
        }
        return item;
      }),
    },
  };
};

const getThreadForTopicSelector = (state, action) => {
  if (action.pageNumber === 1) {
    return {
      ...state,
      topicId: action.topic,
      threadsForTopic: action.threadsForTopic,
      threadsForTopicPageNumber: action.pageNumber + 1,
      fetching: false,
    };
  }
  return {
    ...state,
    threadsForTopic: {
      ...state.threadsForTopic,
      ...action.threadsForTopic,
      data: [...state.threadsForTopic.data, ...action.threadsForTopic.data],
    },
    fetching: false,
  };
};
