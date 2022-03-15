import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from './config';
import Constant from './constant';

const instance = axios.create({
  baseURL: Config.BASE_URL,
  headers: {
    'Content-type': 'application/vnd.api+json',
    'Cache-Control': 'no-cache',
  },
});

instance.interceptors.request.use(
  async (config) => {
    const asyncPayload = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.USER_DATA,
      (err, result) => {},
    );
    const projectId = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_ID,
      (err, result) => {},
    );
    const data = JSON.parse(asyncPayload);
    if (data) {
      config.headers.Authorization = `Token token="${data.data.attributes.token}"`;
      config.headers['project-id'] = projectId;
    }
    return config;
  },
  // Do something before request is sent
  (error) =>
    // Do something with request error
    Promise.reject(error),
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) =>
    // Do something with response data
    response,
  (error) => Promise.reject(errorParser(error.response)),

  // Do something with response error
);

export function errorParser(error) {
  let errorMessage = '';
  if (!error) {
    errorMessage = {
      data: {
        errors: [
          {title: Constant.NETWORK_ERROR, detail: Constant.NETWORK_ERROR},
          {title: Constant.NETWORK_ERROR, detail: Constant.NETWORK_ERROR},
        ],
      },
    };
  } else {
    errorMessage = error;
  }
  return errorMessage;
}

export function httpPost(url, params) {
  return instance.post(url, params);
}

export function httpGet(url) {
  return instance.get(url);
}

export function httpPatch(url, params) {
  return instance.patch(url, params);
}

export function httpDelete(url) {
  return instance.delete(url);
}

export function httpPut(url, params) {
  return instance.put(url, params);
}
