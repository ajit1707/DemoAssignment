import AsyncStorage from '@react-native-async-storage/async-storage';
import {PROJECT_MATERIAL} from '../utility/apis';
import {httpGet} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';
import _ from 'lodash';

// Action type for channels user
const PROJECT_MATERIAL_REQUEST = 'PROJECT_MATERIAL_REQUEST';
const PROJECT_MATERIAL_SUCCESS = 'PROJECT_MATERIAL_SUCCESS';
const PROJECT_MATERIAL_FAIL = 'PROJECT_MATERIAL_FAIL';
const CLEAR_PROJECT_MATERIAL_DATA = 'CLEAR_PROJECT_MATERIAL_DATA';

export const getProjectMaterials = (
  pageNumber,
  isPaginationEnabled,
  isOnRefreshEnabled,
) => (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const projectId = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_ID,
      () => {},
    );
    const {
      getProjectMaterial: {projectMaterialPayload},
    } = getState();
    if (!isPaginationEnabled) {
      dispatch({
        type: PROJECT_MATERIAL_REQUEST,
      });
    }
    httpGet(
      `${PROJECT_MATERIAL}?filter[attached_to]=${projectId},project&page[number]=${pageNumber}&page[size]=25`,
    )
      .then((response) => {
        dispatch({
          projectMaterialPayload: setProjectMaterialData(
            projectMaterialPayload,
            response,
            isOnRefreshEnabled,
          ),
          type: PROJECT_MATERIAL_SUCCESS,
        });
        resolve(response.data);
      })
      .catch((error) => {
        dispatch({
          type: PROJECT_MATERIAL_FAIL,
        });
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

export const resetProjectMaterialData = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROJECT_MATERIAL_DATA,
  });
};

export default (
  state = {
    fetching: true,
    projectMaterialPayload: [],
  },
  action,
) => {
  switch (action.type) {
    case PROJECT_MATERIAL_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case PROJECT_MATERIAL_SUCCESS: {
      return {
        ...state,
        fetching: false,
        projectMaterialPayload: action.projectMaterialPayload,
      };
    }
    case PROJECT_MATERIAL_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    case CLEAR_PROJECT_MATERIAL_DATA: {
      return {
        ...state,
        projectMaterialPayload: [],
      };
    }
    default: {
      return state;
    }
  }
};

const setProjectMaterialData = (
  projectMaterialPayload,
  response,
  isOnRefreshEnabled,
) => {
  const projectMaterialData = projectMaterialPayload;
  const {
    data: {data, included, meta},
  } = response;
  if (projectMaterialPayload.length === 0 || isOnRefreshEnabled) {
    return response.data;
  }
  if (data && data.length && included && included.length) {
    projectMaterialData.data = _.concat(projectMaterialData.data, data);
    projectMaterialData.included = _.concat(
      projectMaterialData.included,
      included,
    );
    projectMaterialData.meta.record_count = meta.record_count;
  }
  return projectMaterialData;
};

export const getProjectMaterialData = (state) => {
  const {
    getProjectMaterial: {projectMaterialPayload},
  } = state;
  const materialData = [];
  if (projectMaterialPayload.data) {
    projectMaterialPayload.data.forEach((data) => {
      projectMaterialPayload.included.forEach((included) => {
        if (
          data.attributes.external_material_id === parseInt(included.id, 10)
        ) {
          const projectMaterial = {
            title: included.attributes.title,
            intro: included.attributes.intro,
            url: included.attributes.url,
          };
          materialData.push(projectMaterial);
        }
      });
    });
  }
  return materialData;
};
