import {httpGet, httpPost, httpPut} from '../utility/http';
import {errorHandler} from './errorHandler';
import Config from '../utility/config';
import {MENTOR_PROFILES, GET_FORM} from '../utility/apis';
import {get} from 'lodash';

// Action type for project codes
const TYPEFORM_MENTOR_DATA_REQUEST = 'TYPEFORM_MENTOR_DATA_REQUEST';
const TYPEFORM_MENTOR_DATA_SUCCESS = 'TYPEFORM_MENTOR_DATA_SUCCESS';
const TYPEFORM_MENTOR_DATA_FAIL = 'TYPEFORM_MENTOR_DATA_FAIL';

const GETFORM_DATA_REQUEST = 'GETFORM_DATA_REQUEST';
const GETFORM_DATA_SUCCESS = 'GETFORM_DATA_SUCCESS';
const GETFORM_DATA_FAIL = 'GETFORM_DATA_FAIL';

const SUBMIT_TYPEFORM_REQUEST = 'SUBMIT_TYPEFORM_REQUEST';
const SUBMIT_TYPEFORM_SUCCESS = 'SUBMIT_TYPEFORM_SUCCESS';
const SUBMIT_TYPEFORM_FAIL = 'SUBMIT_TYPEFORM_FAIL';

const POST_TYPEFORM_REQUEST = 'POST_TYPEFORM_REQUEST';
export const POST_TYPEFORM_SUCCESS = 'POST_TYPEFORM_SUCCESS';
const POST_TYPEFORM_FAIL = 'POST_TYPEFORM_FAIL';

const SELECT_QUESTION = 'SELECT_QUESTION';

const CLEAR_TYPEFORM_DATA = 'CLEAR_TYPEFORM_DATA';

// Action
export const typeformMentorData = () => async (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const {
      getUserDetail: {userDetailPayload},
      typeformMentorDataReducer: {createTypeFormApiCall},
    } = getState();
    if (
      Object.keys(userDetailPayload.data[0].relationships).includes(
        'mentor_profiles',
      ) &&
      userDetailPayload.data[0].relationships.mentor_profiles.data.length
    ) {
      const mentorId =
        userDetailPayload.data[0].relationships.mentor_profiles.data[0].id;
      let typeformId = '';
      dispatch({
        type: TYPEFORM_MENTOR_DATA_REQUEST,
      });
      httpGet(`${Config.BASE_URL}/${MENTOR_PROFILES}/${mentorId}`)
        .then((response) => {
          resolve(response);
          typeformId = response.data.data.attributes.typeform_id;
          if (
            typeformId !== userDetailPayload.data[0].attributes.typeform_link
          ) {
            typeformId = userDetailPayload.data[0].attributes.typeform_link;
          } else {
            typeformId = response.data.data.attributes.typeform_id;
          }
          dispatch({
            typeformMentorPayload: response.data,
            userPaylaod: userDetailPayload.data[0].attributes.typeform_link,
            type: TYPEFORM_MENTOR_DATA_SUCCESS,
          });
          dispatch(getFormMentorData(typeformId));
        })
        .catch((error) => {
          reject(error);
          dispatch({
            type: TYPEFORM_MENTOR_DATA_FAIL,
          });
        });
    } else if (!createTypeFormApiCall) {
      const projectUserId = userDetailPayload.data[0].id;
      const projectId = userDetailPayload.data[0].attributes.project_id;
      const typeformId = userDetailPayload.data[0].attributes.typeform_link;
      const payload = {
        data: {
          type: 'mentor_profiles',
          attributes: {
            project_user_id: projectUserId,
            project_id: projectId,
            typeform_id: typeformId,
            data: {},
          },
        },
      };
      dispatch(postMentorFile(payload));
    }
  });
export const postMentorFile = (payload) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: POST_TYPEFORM_REQUEST,
    });
    httpPost(`${Config.BASE_URL}/${MENTOR_PROFILES}/`, payload)
      .then((response) => {
        resolve(response);
        dispatch({
          mentorProfilePayload: response.data,
          type: POST_TYPEFORM_SUCCESS,
        });
        dispatch(getFormMentorData(response.data.data.attributes.typeform_id));
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: POST_TYPEFORM_FAIL,
        });
      });
  });

export const getFormMentorData = (typeformId) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: GETFORM_DATA_REQUEST,
    });
    httpGet(`${Config.BASE_URL}/${GET_FORM}/${typeformId}`)
      .then((response) => {
        dispatch({
          getFormMentorPayload: response.data,
          type: GETFORM_DATA_SUCCESS,
        });
        resolve(response.data);
      })
      .catch((error) => {
        dispatch({
          type: GETFORM_DATA_FAIL,
        });
        reject(error);
      });
  });

export const submittypeformData = (payload) => (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const {
      typeformMentorDataReducer: {typeformMentorPayload},
    } = getState();
    const mentorId = typeformMentorPayload.data.id;
    dispatch({
      type: SUBMIT_TYPEFORM_REQUEST,
    });
    httpPut(`${Config.BASE_URL}/${MENTOR_PROFILES}/${mentorId}`, payload)
      .then((response) => {
        resolve(response);
        dispatch({
          submittypeformPayload: response.data,
          type: SUBMIT_TYPEFORM_SUCCESS,
        });
      })
      .catch((error) => {
        reject(error);
        dispatch({
          type: SUBMIT_TYPEFORM_FAIL,
        });
      });
  });
export const selectAnswers = (id, questionId, multipleSelection) => (
  dispatch,
) => {
  dispatch({
    type: SELECT_QUESTION,
    id,
    questionId,
    multipleSelection,
  });
};
// Reducer
export default function typeformMentorDataReducer(
  state = {
    fetching: false,
    typeformMentorPayload: null,
    userPaylaod: null,
    getFormMentorPayload: null,
    submittypeformPayload: null,
    createTypeFormApiCall: false,
  },
  action,
) {
  switch (action.type) {
    case TYPEFORM_MENTOR_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case TYPEFORM_MENTOR_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        typeformMentorPayload: action.typeformMentorPayload,
        userPaylaod: action.userPaylaod,
      };
    }
    case TYPEFORM_MENTOR_DATA_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case GETFORM_DATA_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case GETFORM_DATA_SUCCESS: {
      return {
        ...state,
        getFormMentorPayload: {
          ...action.getFormMentorPayload,
          fields: action.getFormMentorPayload.fields.map((fieldDetails) => {
            const answers =
              state.typeformMentorPayload?.data.attributes.data[
                fieldDetails.id
              ];
            if (
              state.userPaylaod !==
              state.typeformMentorPayload?.data.attributes.typeform_id
            ) {
              return {
                ...fieldDetails,
                properties: {
                  ...fieldDetails.properties,
                  choices: get(fieldDetails, 'properties.choices', []).map(
                    (choice, index) => ({
                      ...choice,
                      isChecked: false,
                    }),
                  ),
                },
              };
            } else if (answers && Array.isArray(answers)) {
              return {
                ...fieldDetails,
                properties: {
                  ...fieldDetails.properties,
                  choices: get(fieldDetails, 'properties.choices', []).map(
                    (choice, index) => ({
                      ...choice,
                      isChecked:
                        state.typeformMentorPayload?.data.attributes.data[
                          fieldDetails.id
                        ][index],
                    }),
                  ),
                },
              };
            }
            return fieldDetails;
          }),
        },
        fetching: false,
      };
    }
    case GETFORM_DATA_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case POST_TYPEFORM_REQUEST: {
      return {
        ...state,
        fetching: true,
        createTypeFormApiCall: true,
        error: '',
      };
    }
    case POST_TYPEFORM_SUCCESS: {
      return {
        ...state,
        fetching: false,
        typeformMentorPayload: action.mentorProfilePayload,
      };
    }
    case POST_TYPEFORM_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
        createTypeFormApiCall: false,
      };
    }
    case SELECT_QUESTION: {
      const {id, questionId, multipleSelection} = action;
      return {
        ...state,
        getFormMentorPayload: {
          ...state.getFormMentorPayload,
          fields: state.getFormMentorPayload.fields.map((fieldDetails) => {
            if (fieldDetails.id === questionId) {
              return {
                ...fieldDetails,
                properties: {
                  ...fieldDetails.properties,
                  choices: get(fieldDetails, 'properties.choices', []).map(
                    (choice) => {
                      if (choice.id === id) {
                        return {
                          ...choice,
                          isChecked: !choice.isChecked,
                        };
                      }
                      if (multipleSelection) {
                        return choice;
                      }
                      return {
                        ...choice,
                        isChecked: false,
                      };
                    },
                  ),
                },
              };
            }
            return fieldDetails;
          }),
        },
      };
    }
    case CLEAR_TYPEFORM_DATA: {
      return {
        ...state,
        getFormMentorPayload: [],
      };
    }
    case SUBMIT_TYPEFORM_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case SUBMIT_TYPEFORM_SUCCESS: {
      return {
        ...state,
        fetching: false,
        typeformMentorPayload: action.submittypeformPayload,
      };
    }
    case SUBMIT_TYPEFORM_FAIL: {
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
