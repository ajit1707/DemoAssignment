import React, {Component} from 'react';
import {View, TouchableOpacity, Platform, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../screens/messageScreen/style';
import Video from '../components/VideoComponent';
import ModerationMessageHeaderBox from '../screens/messageScreen/moderationMessageHeaderBox';
import ModerationMessageFooterBox from '../screens/messageScreen/moderationMessageFooterBox';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class YoutubeAttachment extends Component {
  render() {
    const {
      item,
      renderMessages,
      isSender,
      userId,
      showModerationType,
      index,
      videoUrl,
      normalVideo,
    } = this.props;
    return (
      <View
        style={
          showModerationType
            ? [
                styles.moderationBoxLeftContainer,
                !isSender && styles.moderationBoxRightContainer,
              ]
            : index === 0
            ? [
                styles.attachmentContainerForMultiMedia,
                styles.marginForMultimedia,
              ]
            : styles.attachmentContainerForMultiMedia
        }>
        {showModerationType ? (
          <ModerationMessageHeaderBox
            item={item}
            userId={userId}
            renderMessages={renderMessages}
          />
        ) : null}
        <TouchableOpacity
          style={
            showModerationType
              ? styles.moderationContainer
              : styles.textContainer
          }
          onPress={() => this.props.videoView(videoUrl, undefined, false)}>
          <Video
            html={
              '<html><meta name="viewport" content="width=device-width", initial-scale=1 />' +
              `<iframe src="${videoUrl}"` +
              ` frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:200
                                        ;width:${deviceWidth}*0.9;position:absolute;top:0px;left:0px;right:0px;
                                        bottom:0px" height="100%" width="100%"  controls>` +
              '</iframe>' +
              '</html>'
            }
            containerStyles={
              Platform.OS === 'android'
                ? styles.youtubeWebViewContainerInMessaging
                : styles.youtubeWebViewContainerIosInMessaging
            }
            videoHeight={deviceHeight * 0.3}
            videoWidth={
              Platform.OS === 'android' ? deviceWidth * 0.9 : deviceWidth * 0.8
            }
          />
        </TouchableOpacity>
        <ModerationMessageFooterBox item={item} userId={userId} />
      </View>
    );
  }
}

YoutubeAttachment.defaultProps = {
  filePayload: [],
  displaySpinner: false,
  handleDownloadForAndroid: () => {},
  item: null,
  renderMessages: () => {},
  isSender: false,
  showModerationType: false,
  index: 0,
};

YoutubeAttachment.propTypes = {
  filePayload: PropTypes.array,
  displaySpinner: PropTypes.bool,
  handleDownloadForAndroid: PropTypes.func,
  item: PropTypes.object,
  renderMessages: PropTypes.func,
  isSender: PropTypes.bool,
  userId: PropTypes.string.isRequired,
  showModerationType: PropTypes.bool,
  index: PropTypes.number,
};

export default YoutubeAttachment;
