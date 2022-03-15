import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../screens/messageScreen/style';
import Icon from '../utility/icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {bytesConverter} from '../utility/helper';
import {Spinner} from '../components';
import Video from '../components/VideoComponent';
import Constant from '../utility/constant';
import ModerationMessageHeaderBox from '../screens/messageScreen/moderationMessageHeaderBox';
import ModerationMessageFooterBox from '../screens/messageScreen/moderationMessageFooterBox';
import Config from '../utility/config';
import DeviceInfo from 'react-native-device-info';

const Attachment = (props) => {
  const {
    item,
    renderMessages,
    isSender,
    userId,
    showModerationType,
    index,
    fileId,
    normalVideo,
  } = props;
  let image = '';
  let newImage = '';
  let videoUrl = '';
  const fileType = item.files[0].attachment_content_type;
  if (
    item &&
    item.files &&
    item.files.length &&
    item.files[0].hasOwnProperty('attachment_content_type') &&
    item.files[0].attachment_content_type !== null &&
    (fileType.includes('jpeg') ||
      fileType.includes('jpg') ||
      fileType.includes('png') ||
      fileType.includes('gif') ||
      fileType.includes('video/mp4') ||
      fileType.includes('video/webm'))
  ) {
    if (
      item.files[0].attachment_id.includes('brightside-assets') &&
      (fileType.includes('jpeg') ||
        fileType.includes('jpg') ||
        fileType.includes('png') ||
        fileType.includes('gif'))
    ) {
      image = `${Config.IMAGE_SERVER_CDN}resize/500x500/${item.files[0].attachment_id}`;
      newImage = `${Config.IMAGE_SERVER_CDN}${item.files[0].attachment_id}`;
    } else {
      image = item.files[0].attachment_id;
    }

    if (
      fileType.includes('video/mp4') ||
      fileType.includes('video/ogg') ||
      fileType.includes('video/webm')
    ) {
      if (
        Platform.OS === 'ios' &&
        item.files[0].attachment_id.includes('brightside-assets')
      ) {
        videoUrl = item.files[0].attachment_id.replace(
          /\bbrightside-assets\b/g,
          Constant.BRIGHTSIDE_ASSETS_URL,
        );
      } else {
        videoUrl = `${Config.IMAGE_SERVER_CDN}${item.files[0].attachment_id}`;
      }
    }
  }
  return item &&
    item.files &&
    item.files.length &&
    item.files[0].hasOwnProperty('attachment_content_type') &&
    item.files[0].attachment_content_type !== null &&
    (fileType.includes('jpeg') ||
      fileType.includes('jpg') ||
      fileType.includes('png') ||
      fileType.includes('gif')) ? (
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
      {(fileType.includes('jpeg') ||
        fileType.includes('jpg') ||
        fileType.includes('png') ||
        fileType.includes('gif')) && (
        <TouchableOpacity
          style={
            showModerationType
              ? styles.moderationContainer
              : styles.textContainer
          }
          onPress={() => props.imageView(image, newImage)}>
          <Image style={styles.img} source={{uri: image}} />
        </TouchableOpacity>
      )}
      <ModerationMessageFooterBox item={item} userId={userId} />
    </View>
  ) : Platform.OS === 'android' &&
    item &&
    item.files &&
    item.files.length &&
    item.files[0].hasOwnProperty('attachment_content_type') &&
    item.files[0].attachment_content_type !== null &&
    (fileType.includes('video/mp4') || fileType.includes('video/webm')) ? (
    <View
      style={
        showModerationType
          ? [
              styles.moderationBoxLeftContainer,
              !isSender && styles.moderationBoxRightContainer,
            ]
          : index === 0
          ? [styles.attachmentContainerForVidoes, styles.marginForMultimedia]
          : styles.attachmentContainerForMultiMedia
      }>
      {showModerationType ? (
        <ModerationMessageHeaderBox
          item={item}
          userId={userId}
          renderMessages={renderMessages}
        />
      ) : null}
      {
        <TouchableOpacity
          onPress={() => props.videoView(videoUrl, fileType, true)}>
          {(fileType.includes('video/mp4') ||
            fileType.includes('video/webm')) && (
            <View
              style={
                showModerationType
                  ? styles.moderationContainer
                  : styles.textContainerForNormal
              }>
              <Video
                html={`
                        <video width="100%" height="100%" style="background-color:${styles.webView.backgroundColor} " controls>
                          <source src="${videoUrl}" type="${item.files[0].attachment_content_type}">
                    </video>
                    `}
                containerStyles={
                  Platform.OS === 'android'
                    ? styles.webViewContainerInMessaging
                    : styles.webViewContainerIosInMessaging
                }
              />
            </View>
          )}
        </TouchableOpacity>
      }
      <ModerationMessageFooterBox item={item} userId={userId} />
    </View>
  ) : Platform.OS === 'ios' &&
    item &&
    item.files &&
    item.files.length &&
    item.files[0].hasOwnProperty('attachment_content_type') &&
    item.files[0].attachment_content_type !== null &&
    fileType.includes('video/mp4') ? (
    <View
      style={
        showModerationType
          ? [
              styles.moderationBoxLeftContainer,
              !isSender && styles.moderationBoxRightContainer,
            ]
          : index === 0
          ? [
              styles.attachmentContainerForMultiMediaIos,
              styles.marginForMultimedia,
            ]
          : styles.attachmentContainerForMultiMediaIos
      }>
      {showModerationType ? (
        <ModerationMessageHeaderBox
          item={item}
          userId={userId}
          renderMessages={renderMessages}
        />
      ) : null}
      {DeviceInfo.getModel() === 'iPhone X' ||
      DeviceInfo.getModel() === 'iPhone XS' ||
      DeviceInfo.getModel() === 'iPhone XS Max' ||
      DeviceInfo.getModel() === 'iPhone XR' ||
      DeviceInfo.getModel() === 'iPhone 11' ||
      DeviceInfo.getModel() === 'iPhone 11 Pro' ||
      DeviceInfo.getModel() === 'iPhone 11 Pro Max' ? (
        <TouchableOpacity
          onPress={() => props.videoView(videoUrl, fileType, true)}>
          {fileType.includes('video/mp4') && (
            <View
              style={
                showModerationType
                  ? styles.moderationContainerIos
                  : styles.textContainerIos
              }>
              <View
                style={
                  showModerationType
                    ? styles.iconContainerForIos
                    : styles.iconTextContainerForIos
                }>
                <AntDesign name="playcircleo" size={65} color="#fff" />
              </View>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => props.videoView(videoUrl, fileType, true)}>
          {fileType.includes('video/mp4') && (
            <View
              style={
                showModerationType
                  ? styles.moderationContainerIos
                  : styles.textContainerIosSmallDevices
              }>
              <View
                style={
                  showModerationType
                    ? styles.iconContainerForIos
                    : styles.iconTextContainerForIos
                }>
                <AntDesign name="playcircleo" size={65} color="#fff" />
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}
      <ModerationMessageFooterBox item={item} userId={userId} />
    </View>
  ) : (
    <View
      style={
        showModerationType
          ? [
              styles.moderationBoxLeftContainer,
              !isSender && styles.moderationBoxRightContainer,
            ]
          : index === 0
          ? [styles.attachmentContainer, styles.marginForMultimedia]
          : styles.attachmentContainer
      }>
      {showModerationType ? (
        <ModerationMessageHeaderBox
          item={item}
          userId={userId}
          renderMessages={renderMessages}
        />
      ) : null}
      <View
        style={
          showModerationType ? styles.moderationContainer : styles.textContainer
        }>
        <Text style={[styles.textName]}>
          {props.filePayload[0].attachment_filename.trim()}
        </Text>
        <Text style={[styles.textDate, styles.fileName]}>
          {bytesConverter(props.filePayload[0].attachment_size)}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {props.displaySpinner && fileId === item.id ? (
          <Spinner animating={props.displaySpinner} />
        ) : (
          <TouchableOpacity
            accessibilityLabel="Download File"
            accessibilityRole="button"
            style={styles.downloadButton}
            activeOpacity={0.7}
            onPress={() => props.handleDownloadForAndroid(props.item)}>
            <Image
              source={Icon.DOWNLOAD_ICON}
              style={styles.downloadIconStyle}
            />
          </TouchableOpacity>
        )}
      </View>
      <ModerationMessageFooterBox item={item} userId={userId} />
    </View>
  );
};

Attachment.defaultProps = {
  filePayload: [],
  displaySpinner: false,
  handleDownloadForAndroid: () => {},
  item: null,
  renderMessages: () => {},
  isSender: false,
  showModerationType: false,
  index: 0,
};

Attachment.propTypes = {
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

export default Attachment;
