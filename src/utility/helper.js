import {Alert, Dimensions, Image, Linking, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import Permissions from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import {NavigationActions, StackActions} from 'react-navigation';
import {navigationDispatchService} from '../navigators/AppNavigator';
import Toast from 'react-native-simple-toast';
import Constant from './constant';
import {errorHandler} from '../modules/errorHandler';
import {checkProjectToken} from '../modules/checkProjectToken';
import {LOGOUT_SUCCESS} from '../modules/logOut';
import {fetchUserDataById} from '../modules/resetPassword';
import {
  verifyEmail,
  navigateToChannel,
  disableDeepLink,
} from '../modules/deepLinkHandler';
import Config from './config';

// Function to return the proper error
export function fetchErrorMessage(error) {
  if (
    (error.response && error.response.status === Constant.HTTP_ERROR_CODE) ||
    (error.response && error.response.status === Constant.SERVER_NOT_FOUND)
  ) {
    return Constant.REQ_FAILED;
  } else if (
    error.response &&
    error.response.status === Constant.UNAUTHORIZED_ACCESS_CODE
  ) {
    return Constant.UNAUTHORIZED_ACCESS_CODE;
  }
  return error.response && error.response.data
    ? error.response.data.error.message
    : Constant.NETWORK_ERROR;
}

// Function to navigate to screen

export function navigateToScreen(route) {
  const navigationAction = NavigationActions.navigate({
    routeName: route,
  });
  navigationDispatchService(navigationAction);
}
export function getBase64(path) {
  return new Promise((resolve, reject) => {
    RNFS.readFile(path, 'base64')
      .then((res) => {
        // Getting Base64 for Image, Pdf, doc etc.
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const detectHTMLTags = (text) => /<[a-z][\s\S]*>/i.test(text);

export const fontMaker = (key) => {
  let fontType;
  switch (key) {
    case 'regular':
      fontType = checkFontType(Constant.FONTS.regular);
      break;
    case 'bold':
      fontType = checkFontType(Constant.FONTS.bold);
      break;
    case 'semibold':
      fontType = checkFontType(Constant.FONTS.semiBold);
      break;
    case 'italic':
      fontType = checkFontType(Constant.FONTS.italic);
      break;
    default:
      break;
  }
  return fontType;
};

export const checkFontType = (font) =>
  Platform.select({
    ios: {
      fontFamily: font.family,
      fontWeight: font.weight,
      fontStyle: font.style,
    },
    android: {
      fontWeight: font.weight,
      fontFamily: font.family,
    },
  });

export function testID(id, hint) {
  return {accessible: true, accessibilityLabel: id, accessibilityHint: hint};
}

export function bytesConverter(data) {
  if (data < 1024) {
    return `${data} Bytes`;
  } else if (data < 1048576) {
    return `${(data / 1024).toFixed(2)} KB`;
  }
  return `${(data / 1048576).toFixed(2)} MB`;
}

export function capitalizeFirstLetter(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : null;
}

export function iPhoneXHelper(iphoneXSeries, iphone) {
  if (
    DeviceInfo.getModel() === 'iPhone X' ||
    DeviceInfo.getModel() === 'iPhone XS' ||
    DeviceInfo.getModel() === 'iPhone XS Max' ||
    DeviceInfo.getModel() === 'iPhone XR' ||
    DeviceInfo.getModel() === 'iPhone 11' ||
    DeviceInfo.getModel() === 'iPhone 11 Pro' ||
    DeviceInfo.getModel() === 'iPhone 11 Pro Max'
  ) {
    return iphoneXSeries;
  }
  return iphone;
}

export function openSettings(type) {
  return setTimeout(() => {
    Alert.alert(
      Constant.OOPS_TITLE,
      type === 'camera'
        ? Constant.CAMERA_PERMISSION
        : Constant.GALLERY_PERMISSION,
      [
        {
          text: 'Settings',
          onPress: () => Permissions.openSettings(),
        },
        {text: 'Ok', onPress: () => null},
      ],
    );
  }, 50);
}

export function requestPermissionMessage(type) {
  let message;
  if (type === 'camera') {
    message = Constant.CAMERA_PERMISSION;
  } else if (type === 'photo') {
    message = Constant.GALLERY_PERMISSION;
  } else {
    message = Constant.EXTERNAL_STORAGE_PERMISSION;
  }
  return message;
}

export function androidRequestAlert(type) {
  return setTimeout(() => {
    Alert.alert(
      type === 'camera'
        ? Constant.CAMERA_PERMISSION_TITLE
        : Constant.PHOTO_PERMISSION_TITLE,
      requestPermissionMessage(type),
      [{text: 'Ok', onPress: () => null}],
    );
  }, 50);
}

export function formatChannelDate(date) {
  return moment(date).format('HH:mm');
}

export function getRandomNumber(min, max) {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min
  );
}

export function linkifyText(text) {
  const markdown_regex = /\(([^|]+)\|<(\S+)>\)|<(\S+)>/g;
  text = text.replace(markdown_regex, ($1, $2, $3, $4) =>
    replaceWithLink($1, $2, $3, $4),
  );
  return addLinkProtocols(text);
}

export function addLinkProtocols(text) {
  const regex = /(href=")(?!https?:\/\/)/g;
  return text.replace(regex, '"http://');
}

export function replaceWithLink(group1, group2, group3, group4) {
  if (typeof group4 === 'undefined') {
    return `href="${group3}"`;
  }

  return `href="${group4}"`;
}
export function formatDate(date, format) {
  return moment(date).format(format);
}
export function openLink(url, props) {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        props.dispatch(errorHandler('Unable to open url'));
      } else {
        Linking.openURL(url);
      }
    })
    .catch((err) => {
      if (props && err && props.dispatch) {
        props.dispatch(errorHandler(err));
      }
    });
}

export function handleDynamicLinks(url, props, isLoggedIn, getProjectsdata) {
  const {dispatch} = props;
  const parameters = url.split('/');
  const isInvitation = parameters.some(
    (parameter) => parameter === 'invitations',
  );
  if (isInvitation) {
    return dispatch(checkProjectToken(parameters[4])).then((responseData) => {
      let screen = 'WelcomeScreen';
      AsyncStorage.clear().then(() => {
        if (
          responseData &&
          responseData.data &&
          responseData.hasOwnProperty('data') &&
          responseData.data.hasOwnProperty('attributes') &&
          responseData.data.attributes.state === 'accepted'
        ) {
          screen = 'LoginScreen';
          dispatch({
            logoutData: {
              screen,
              invitationData: responseData,
            },
            type: LOGOUT_SUCCESS,
          });
        } else if (
          responseData &&
          responseData.hasOwnProperty('data') &&
          responseData.data.hasOwnProperty('attributes') &&
          responseData.data.attributes.state === 'pending'
        ) {
          if (responseData.data.attributes.existing_user_id !== null) {
            screen = 'LoginScreen';
          } else {
            screen = 'SignUpScreen';
          }
          dispatch({
            logoutData: {
              screen,
              invitationData: responseData,
            },
            type: LOGOUT_SUCCESS,
          });
        }
      });
    });
  }
  const isResetPassword = parameters.some(
    (parameter) => parameter === 'passwords',
  );
  if (isResetPassword && !isLoggedIn) {
    return dispatch(fetchUserDataById(parameters[4]))
      .then((userData) => {
        if (
          userData &&
          userData.length &&
          userData[0].hasOwnProperty('id') &&
          userData[0].id
        ) {
          const navigateAction = NavigationActions.navigate({
            routeName: 'ResetPasswordScreen',
            params: {
              resetPasswordInfo: userData,
            },
          });
          dispatch(navigateAction);
        } else {
          const navigateAction = NavigationActions.navigate({
            routeName: 'ForgotPasswordScreen',
            params: {
              showToastMessage: true,
            },
          });
          dispatch(navigateAction);
        }
      })
      .catch(() => {
        resetNavigation('WelcomeScreen', props);
      });
  }
  const isVerifyEmail = parameters.some((parameter) => parameter === 'emails');
  if (isVerifyEmail && !isLoggedIn) {
    dispatch(verifyEmail(parameters[4]))
      .then((response) => {
        Toast.showWithGravity(response, Toast.SHORT, Toast.BOTTOM);
      })
      .catch((error) => {
        Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
      });
    const navigateAction = NavigationActions.navigate({
      routeName: 'LoginScreen',
    });
    return dispatch(navigateAction);
  }
  const isChannels = parameters.some((parameter) => parameter === 'channels');
  if (isChannels && isLoggedIn) {
    return dispatch(navigateToChannel(parameters[4]));
  }
  if (getProjectsdata && isLoggedIn) {
    return getProjectsdata();
  }
  if (!isLoggedIn) {
    dispatch(disableDeepLink());
    return resetNavigation('WelcomeScreen', props);
  }
  return null;
}

export function resetNavigation(route, props) {
  const {dispatch} = props;
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
}

const deviceWidth = Dimensions.get('window').width;

export function getOriginalImageSize(logoImage) {
  const widthOfDevice = deviceWidth;
  let newWidth = '';
  let newHeight = '';
  let newImage = '';
  if (logoImage.includes('brightside-assets')) {
    newImage = `${Config.IMAGE_SERVER_CDN}${logoImage}`;
  } else {
    newImage = this.props.sideMenuItems.logoImage;
  }
  Image.getSize(newImage, (width, height) => {
    if (width > widthOfDevice) {
      const aspectRatio = height / width;
      newWidth = widthOfDevice;
      newHeight = aspectRatio * newWidth;
    }
    return {
      newWidth,
      newHeight,
      width,
      height,
    };
  });
}
