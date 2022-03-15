import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, NavigationActions} from 'react-navigation';
import Constant from '../utility/constant';
import Config from '../utility/config';
import {errorHandler} from './errorHandler';
import {LOGOUT} from '../utility/apis';
import {httpDelete} from '../utility/http';
import {logEventForAnalytics} from '../utility/firebase-utils';
import {userSignInInfo} from './userSignIn';
import {clearPreservedMessageText} from './preserveMessageText';
// Action type for logOut
const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'LOGOUT_FAIL';

/**
 * This function dispatches an action to logout reducer
 * @returns {Function}
 */

export function logOut(sessionTimeOutMessage) {
  return (dispatch, getState) => {
    const signInData = getUserData(getState());
    dispatch({
      type: LOGOUT_REQUEST,
    });
    AsyncStorage.getItem(Constant.ASYNC_KEYS.USER_DATA, (err, result) => {
      const token = JSON.parse(result);
      if (
        token &&
        token.hasOwnProperty('data') &&
        token.data &&
        token.data.hasOwnProperty('id')
      ) {
        httpDelete(`${Config.BASE_URL}${LOGOUT}/${token.data.id}`)
          .then((response) => {
            dispatch(clearPreservedMessageText());
            dispatch({
              logoutData: response,
              type: LOGOUT_SUCCESS,
            });
            logEventForAnalytics('signOut', {});
            if (response.status === Constant.NO_CONTENT_FOUND) {
              if (sessionTimeOutMessage) {
                setTimeout(() => {
                  dispatch(errorHandler(sessionTimeOutMessage));
                }, 300);
              }
              dispatch(resetStack(signInData));
            }
          })
          .catch((error) => {
            dispatch({
              error: err,
              type: LOGOUT_FAIL,
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
      }
    });
  };
}
export function resetStack(signInData) {
  return (dispatch) => {
    AsyncStorage.clear().then(() => {
      const resetAction = StackActions.reset({
        key: null,
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'WelcomeScreen'})],
      });
      dispatch(resetAction);
      if (signInData.type === 'users') {
        dispatch(userSignInInfo(signInData));
      } else {
        signInData.rememberMe = false;
        dispatch(userSignInInfo(signInData));
      }
    });
  };
}

// Reducer
export default function reducer(
  state = {
    fetching: false,
  },
  action,
) {
  switch (action.type) {
    case LOGOUT_REQUEST: {
      return {
        ...state,
        fetching: true,
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        fetching: false,
        logoutData: action.logoutData,
      };
    }
    case LOGOUT_FAIL: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    }
    default:
      return state;
  }
}

// selector
export const getUserData = (state) => {
  const {
    userSignInInfoReducer: {userData},
    getUserDetail: {userDetailPayload},
  } = state;
  let image = '';
  let type = '';
  let fullName = '';
  if (userDetailPayload && userDetailPayload.hasOwnProperty('included')) {
    if (
      userDetailPayload.included[0].attributes.avatar_id.includes(
        'brightside-assets',
      )
    ) {
      image = `${Config.IMAGE_SERVER_CDN}resize/500x500/${userDetailPayload.included[0].attributes.avatar_id}`;
    } else {
      image = userDetailPayload.included[0].attributes.avatar_id;
    }
    type = userDetailPayload.included[0].type;
    fullName = `${userDetailPayload.included[0].attributes.first_name}`;
  }
  return {
    username: userData.username,
    password: userData.password,
    image,
    fullName,
    rememberMe: userData.rememberMe,
    type,
    pushNotificationToken: userData.pushNotificationToken,
  };
};
