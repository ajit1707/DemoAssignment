import React from 'react';
import {Dimensions, View, StyleSheet, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const WebViewVideo = (props) => (
  <View style={props.parentViewStyle}>
    <WebView
      scalesPageToFit={Platform.OS === 'android' ? false : undefined}
      style={props.containerStyles}
      allowsFullscreenVideo
      javaScriptEnabled
      mediaPlaybackRequiresUserAction={Platform.OS === 'ios' ? true : undefined}
      domStorageEnabled
      userAgent={props.userAgent}
      {...props}
      source={{html: props.html}}
    />
  </View>
);
const styles = StyleSheet.create({
  webViewContainer: {
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.9,
  },
  webViewContainerIos: {
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.8,
  },
  parentViewStyle: {
    flex: 1,
  },
});

WebViewVideo.defaultProps = {
  containerStyles: styles.webViewContainer,
  videoHeight: deviceHeight * 0.25,
  videoWidth: deviceWidth,
  parentViewStyle: styles.parentViewStyle,
};
WebViewVideo.propTypes = {
  containerStyles: PropTypes.object,
  videoUrl: PropTypes.string.isRequired,
  videoHeight: PropTypes.number,
  videoWidth: PropTypes.number,
  parentViewStyle: PropTypes.object,
};
export default WebViewVideo;
