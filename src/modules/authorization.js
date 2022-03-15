import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {NavigationActions, StackActions} from 'react-navigation';
import Constant from '../utility/constant';
import {getProjects} from '../modules/getProjects';
import {checkNetwork} from './checkNetwork';

const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export function authorization() {
  return async (dispatch, getState) => {
    let route;
    await NetInfo.fetch().then((state) => {
      dispatch(checkNetwork(state === undefined ? true : state));
    });
    const {
      checkNetwork: {
        isConnected: {isConnected},
      },
    } = getState();
    AsyncStorage.getItem(Constant.ASYNC_KEYS.LOGGED_IN, (error, result) => {
      if (result) {
        // if (!isConnected) {
        //     dispatch(getProjects());
        // }
        dispatch({
          type: USER_LOGGED_IN,
          loggedInPayload: JSON.stringify(result),
        });
        route =
          isConnected || isConnected === undefined
            ? 'SplashScreen'
            : 'DrawerNavigator';
      } else {
        dispatch({
          type: USER_LOGGED_OUT,
        });
        route = isConnected ? 'WelcomeScreen' : 'SplashScreen';
      }
      const resetNavigator = StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: route,
          }),
        ],
      });
      dispatch(resetNavigator);
    });
  };
}

export default function reducer(
  state = {
    fetching: false,
    loggedInPayload: null,
  },
  action,
) {
  switch (action.type) {
    case USER_LOGGED_IN: {
      return {
        ...state,
        loggedInPayload: action.loggedInPayload,
      };
    }
    case USER_LOGGED_OUT: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}
