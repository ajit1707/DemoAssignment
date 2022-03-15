//import Bugsnag from '@bugsnag/react-native';
import {Client, Configuration} from 'bugsnag-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constant from '../utility/constant';
import Config from './config';

let bugSnagClient;

export function initBugsnag() {
  new Client(Config.BUG_SNAG_API_KEY);
  const configuration = new Configuration();
  configuration.apiKey = Config.BUG_SNAG_API_KEY;
  configuration.releaseStage = Config.APP_RELEASE_STAGE;
  configuration.notifyReleaseStages = ['production', 'beta', 'staging', 'qa'];
  bugSnagClient = new Client(configuration);
}

export function setBugsnagMetaData() {
  AsyncStorage.getItem(Constant.ASYNC_KEYS.USER_DATA).then((payload) => {
    if (payload) {
      const userPayload = JSON.parse(payload);
      bugSnagClient.setUser(
        `${userPayload.included[0].id}`,
        undefined,
        userPayload.included[0].attributes.email,
      );
    }
  });
}
