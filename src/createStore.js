import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import combineReducers from './reducers';
import Constant from '../src/utility/constant';
import {getProjectUser} from './modules/profile';

const middleware = [thunkMiddleware];
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'getProjects',
    'getUserDetail',
    'channelsUser',
    'displayChannelItemsReducer',
    'getSelectedProjectReducer',
    'channelMessage',
    'getchannels',
    'offlineMessageToSend',
    'checkNetwork',
    'userSignInInfoReducer',
    'typeformMenteeDataReducer',
  ],
  timeout: null,
};

const persistReducers = persistReducer(persistConfig, combineReducers);
const checkSession = (store) => (next) => (action) => {
  const {
    checkNetwork: {
      isConnected: {isConnected},
    },
  } = store.getState();
  AsyncStorage.getItem(Constant.ASYNC_KEYS.USER_DETAILS, (error, result) => {
    if (result && isConnected) {
      if (action.type === 'Navigation/NAVIGATE') {
        store.dispatch(getProjectUser('createStore'));
      }
    }
  });
  next(action);
};

export const store = createStore(
  persistReducers,
  applyMiddleware(...middleware, checkSession),
);
export const persistor = persistStore(store);
