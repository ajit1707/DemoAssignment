import React, {Component} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import {imageShowOptions} from '../navigators/Root';
import {WebView} from 'react-native-webview';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export const navigationOption = ({navigation}) => ({
  ...imageShowOptions(),
});
class VideoModal extends Component {
  static navigationOptions = ({navigation}) => ({
    ...navigationOption({navigation}),
  });
  render() {
    const {
      navigation: {
        state: {
          params: {isNotYoutubeVideo, type, videoUrl},
        },
      },
    } = this.props;
    return (
      <View style={styles.modalContainer}>
        <View
          style={
            isNotYoutubeVideo
              ? styles.modalSubContainer
              : styles.modalSubContainerForYoutube
          }>
          <WebView
            scalesPageToFit={Platform.OS === 'android' ? false : undefined}
            style={styles.webViewContainerInMessaging}
            allowsFullscreenVideo
            javaScriptEnabled
            mediaPlaybackRequiresUserAction={Platform.OS === 'ios'}
            // mediaPlaybackRequiresUserAction={Platform.OS === 'ios' ? false : undefined}
            domStorageEnabled
            userAgent={
              isNotYoutubeVideo
                ? undefined
                : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
            }
            source={
              isNotYoutubeVideo
                ? {
                    html: `
                    <video width="100%" height="100%" style="background-color:${styles.webView.backgroundColor} " autoplay controls>
                          <source src="${videoUrl}" type="${type}">
                    </video>
                    `,
                  }
                : {
                    html:
                      '<html><meta name="viewport" content="width=device-width", initial-scale=1 />' +
                      `<iframe src="${videoUrl}"` +
                      ` frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:200
                                        ;width:${deviceWidth}*0.9;position:absolute;top:0px;left:0px;right:0px;
                                        bottom:0px" height="100%" width="100%"  controls>` +
                      '</iframe>' +
                      '</html>',
                  }
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.99)',
  },
  webViewContainerInMessaging: {
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.99,
    backgroundColor: 'rgba(0,0,0,0.99)',
  },
  webView: {
    backgroundColor: '#000',
  },
  webViewContainerIosInMessaging: {
    height: deviceHeight * 0.5,
    width: deviceWidth * 0.99,
  },
  crossButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    paddingLeft: 163,
  },
  crossIcon: {
    height: 13,
    width: 13,
  },
  header: {
    height: '10%',
    width: '98%',
    paddingRight: '2%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  modalSubContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubContainerForYoutube: {
    paddingTop: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: '47%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    height: 25,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});

VideoModal.defaultProps = {
  modalVisible: false,
};

VideoModal.propTypes = {
  modalVisible: PropTypes.bool,
};

export default VideoModal;
