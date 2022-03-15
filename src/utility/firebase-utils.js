import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export const setAnalyticsCollectionEnabled = (isEnabled) => {
  analytics().setAnalyticsCollectionEnabled(true);
};

export const logEventForAnalytics = (event, params) => {
  analytics().logEvent(event, params);
};

export const dynamicEventLink = () => {
  dynamicLinks()
    .getInitialLink()
    .then((url) => url)
    .catch((err) => console.log('err', err));
};

export default dynamicEventLink;
