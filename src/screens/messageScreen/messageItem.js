import React, {Component} from 'react';
import {connect} from 'react-redux';
import {unescape} from 'lodash';
import ParsedText from 'react-native-parsed-text';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import {
  View,
  Text,
  Linking,
  Image,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Config from '../../utility/config';
import styles from './style';
import Constant from '../../utility/constant';
import Regex from '../../utility/regex';
import Color from '../../utility/colorConstant';
import {
  formatChannelDate,
  getRandomNumber,
  linkifyText,
} from '../../utility/helper';
import {errorHandler} from '../../modules/errorHandler';
import {Attachment, Button} from '../../components';
import ModerationBox from './moderationBox';
import YoutubeAttachment from '../../components/youtubeAttachment';
import {setSideMenuItems} from '../../modules/getProjects';
import BadgeItemScreen from './badgeItem';
import {
  channelDeselected,
  resetSelectedChannelItemIndex,
} from '../../modules/displayChannelItems';
import {clearChannelMessages} from '../../modules/channelMessage';

class MessageItem extends Component {
  constructor() {
    super();
    this.state = {
      displaySpinner: false,
      fileId: '',
      modalVisible: false,
      imageLink: '',
    };
  }
  getMessengerName = (payload) => {
    const {channelsPayload} = this.props;
    if (channelsPayload) {
      const userName =
        channelsPayload &&
        channelsPayload.included &&
        channelsPayload.included.length &&
        channelsPayload.included.filter(
          (item) =>
            item.type === 'channel_users' &&
            payload.user_id === item.attributes.user_id,
        );
      return userName && userName.length !== 0
        ? userName[0].attributes.display_name.trim()
        : null;
    }
    return null;
  };

  getMessengerImage = (payload) => {
    const {channelsPayload} = this.props;
    let imageURL;
    if (channelsPayload) {
      const userImage = channelsPayload.included.filter(
        (item) =>
          item.type === 'channel_users' &&
          payload.user_id === item.attributes.user_id,
      );
      if (userImage && userImage.length !== 0) {
        if (userImage[0].attributes.avatar_id.includes('brightside-assets')) {
          imageURL = `${Config.IMAGE_SERVER_CDN}resize/500x500/${userImage[0].attributes.avatar_id}`;
        } else {
          imageURL = userImage[0].attributes.avatar_id;
        }
      } else {
        imageURL = '';
      }
    }

    return imageURL;
  };

  getUserId = () => {
    const {userDetail} = this.props;
    if (userDetail.data.length) {
      const userData = userDetail.included.filter(
        (payload) => payload.type === 'users',
      );
      return userData[0].id.toString();
    }
    return null;
  };
  imageView = (image, newImage) => {
    const {modalVisible} = this.state;
    const {
      navigation: {navigate},
    } = this.props;
    navigate('ImageModal', {image, newImage});
    this.setState({modalVisible: !modalVisible, imageLink: image});
  };
  videoView = (videoUrl, type, isNotYoutubeVideo) => {
    const {
      navigation: {navigate},
      networkState: {isConnected},
    } = this.props;
    if (isConnected) {
      navigate('VideoModal', {videoUrl, type, isNotYoutubeVideo});
    } else {
      Toast.showWithGravity(
        Constant.UNABLE_TO_PLAY_VIDEO,
        Toast.SHORT,
        Toast.BOTTOM,
      );
    }
  };
  handleDownloadForAndroid = async (item) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: Constant.EXTERNAL_STORAGE_TITLE,
          message: Constant.EXTERNAL_STORAGE_PERMISSION,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const directory = RNFetchBlob.fs.dirs.DownloadDir;
        RNFetchBlob.fetch(
          'GET',
          `${Config.IMAGE_SERVER_CDN}${item.files[0].attachment_id}`,
        )
          .then((res) => {
            const base64data = res.data;
            const fileName = item.files[0].attachment_filename.split('.');
            const randomNumber = getRandomNumber(0, 999);
            const attachmentFilename = `${fileName[0]}_${randomNumber}.${fileName[1]}`;
            const filePath = `${directory}/${attachmentFilename}`;
            this.setState({
              displaySpinner: true,
              fileId: item.id,
            });
            RNFetchBlob.fs.writeFile(filePath, base64data, 'base64');
            RNFetchBlob.fs
              .scanFile([{path: filePath}])
              .then(() => {
                this.setState({
                  displaySpinner: false,
                  fileId: '',
                });
                Toast.showWithGravity(
                  'File Downloaded Successfully!',
                  Toast.SHORT,
                  Toast.BOTTOM,
                );
              })
              .catch(() => {});
          })
          // Something went wrong:
          .catch(() => {
            // error handling
          });
      }
    } catch (err) {
      Toast.showWithGravity(
        'Permission Required to store data.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  handleDownloadForIOS = async (item) => {
    const directory = RNFetchBlob.fs.dirs.DocumentDir;
    RNFetchBlob.fetch(
      'GET',
      `${Config.IMAGE_SERVER_CDN}${item.files[0].attachment_id}`,
    )
      .then((res) => {
        const base64data = res.data;
        const fileName = item.files[0].attachment_filename;
        const filePath = `${directory}/${fileName}`;
        this.setState({
          displaySpinner: true,
          fileId: item.id,
        });
        RNFetchBlob.fs
          .writeFile(filePath, base64data, 'base64')
          .then(() => {
            RNFetchBlob.ios.previewDocument(filePath);
            this.setState({
              displaySpinner: false,
              fileId: '',
            });
          })
          .catch(() => {
            Toast.showWithGravity(
              'Error in Downloading file',
              Toast.SHORT,
              Toast.BOTTOM,
            );
            this.setState({
              displaySpinner: false,
            });
          });
      })
      // Something went wrong:
      .catch(() => {
        this.setState({
          displaySpinner: false,
          fileId: '',
        });
        // error handling
      });
  };
  checkContentType = (content) => {
    let contentType = Constant.TEXT;
    if (
      content.charAt(0) === Constant.OPENING_ANGULAR ||
      content.includes(Constant.READ_ARTICLE_TEXT) ||
      content.includes(Constant.HTTPS) ||
      content.includes(Constant.HTTP)
    ) {
      contentType = Constant.LINK;
    }
    return contentType;
  };

  activityCheckContentType = (content) => {
    let contentType = Constant.TEXT;
    if (content !== '') {
      contentType = Constant.LINK;
    }
    return contentType;
  };

  openLink = (message) => {
    message = `<${message}>`;
    if (message) {
      const url = linkifyText(message)
        .replace(/"|href=|,|Read this article:/g, '')
        .trim();
      const {dispatch} = this.props;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            dispatch(errorHandler(Constant.UNABLE_TO_OPEN_URL));
          } else {
            Linking.openURL(url);
          }
        })
        .catch((err) => dispatch(errorHandler(err)));
    }
  };
  openLinkActivity = (link) => {
    if (link) {
      const url = linkifyText(link)
        .replace(/"|href=|Review it now/g, '')
        .trim();
      const {dispatch} = this.props;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            dispatch(errorHandler(Constant.UNABLE_TO_OPEN_URL));
          } else {
            Linking.openURL(url);
          }
        })
        .catch((err) => dispatch(errorHandler(err)));
    }
  };
  angleBracketsRemove = (match) =>
    match.replace(/<|>|Read this article:/g, '').trim();
  handleLinkPress(message, matchIndex) {
    if (message.charAt(0) === Constant.STAR) {
      const asterikSplit = message.split(Constant.STAR);
      if (asterikSplit && asterikSplit.length) {
        asterikSplit.forEach((msg) => {
          if (msg.includes(Constant.HTTP) || msg.includes(Constant.HTTPS)) {
            message = msg;
          }
        });
      }
    }
    const url = linkifyText(message)
      .replace(/"|href=|_|Read this article:/g, '')
      .trim();
    Linking.canOpenURL(url).then(() => {
      Linking.openURL(url);
    });
  }
  renderBoldAndItalic = (matchingString, matches) =>
    matchingString.substring(1, matchingString.length - 1);
  renderBoldItalic = (matchingString, matches) =>
    matchingString.substring(2, matchingString.length - 2);
  renderMessages = (item, isSender) => {
    if (item.body !== null) {
      const content = item.body.trim().split('\n');
      return content.map((messageItem, index) => {
        let message = messageItem.trim();
        let finalActivityName = '';
        let newActivityLink = '';
        let boldOrItalic = false;
        let activityOrArticle = false;
        let searchAsterisksRegex = '';
        let searchUnderScoreRegex = '';
        let searchASterikUnderscoreRegex = '';
        let searchUnderscoreAsterisksRegex = '';
        let angleBrackets = '';
        let normalLink = '';
        let normalLinkWithouthttp = '';
        let normalLinkWithoutStarhttp = '';
        let activityLink = false;
        const linkActivity = new RegExp(Regex.ACTIVITY_REGEX, 'gmi');
        const activityLinkAfterUsingRegex = message.match(linkActivity);
        if (
          activityLinkAfterUsingRegex &&
          activityLinkAfterUsingRegex.length > 0 &&
          !message.includes(Constant.READ_ARTICLE_TEXT)
        ) {
          const activity = message;
          const activityNameAfterSpliting = activity.split(
            Constant.OPENING_BRACKET,
          );
          if (
            activityNameAfterSpliting &&
            activityNameAfterSpliting.length &&
            activityNameAfterSpliting.length > 1
          ) {
            finalActivityName = activityNameAfterSpliting[0].trim();
            activityLink = true;
            newActivityLink = activityLinkAfterUsingRegex[0].replace(
              /Review it now|\(|\||\)/g,
              '',
            );
          }
        }
        if (
          (message.includes(Constant.STAR) ||
            message.includes(Constant.UNDERSCORE)) &&
          finalActivityName === ''
        ) {
          boldOrItalic = true;
          searchAsterisksRegex = new RegExp(Regex.SEARCH_ASTERISKS_REGEX);
          searchUnderScoreRegex = new RegExp(Regex.SEARCH_UNDERSCORES_REGEX);
          searchUnderscoreAsterisksRegex = new RegExp(
            Regex.SEARCH_UNDERSCORE_ASTERIK_REGEX,
          );
          searchASterikUnderscoreRegex = new RegExp(
            Regex.SEARCH_ASTERIK_UNDERSCORE_REGEX,
          );
          angleBrackets = new RegExp(
            Regex.REMOVE_ANGLE_BRACES_FROM_LINK_REGEX,
            'gmi',
          );
          normalLink = new RegExp(Regex.FIND_NORMAL_LINK);
          normalLinkWithouthttp = new RegExp(Regex.FIND_WITHOUT_HTTP, 'gmi');
          const angle = message.match(angleBrackets);
          if (angle && angle.length) {
            angle.map((match) => {
              message = message.replace(match, this.angleBracketsRemove(match));
            });
          }
        }
        if (
          (!message.includes(Constant.STAR) ||
            !message.includes(Constant.UNDERSCORE)) &&
          finalActivityName === ''
        ) {
          activityOrArticle = true;
          normalLink = new RegExp(Regex.FIND_NORMAL_LINK, 'gmi');
          angleBrackets = new RegExp(
            Regex.REMOVE_ANGLE_BRACES_FROM_LINK_REGEX,
            'gmi',
          );
          normalLinkWithoutStarhttp = new RegExp(
            Regex.FIND_WITHOUT_ASTERISK_HTTP,
            'gmi',
          );
          const angle = message.match(angleBrackets);
          if (angle && angle.length) {
            angle.map((match) => {
              message = message.replace(match, this.angleBracketsRemove(match));
            });
          }
        }
        const isLink =
          message.charAt(0) === Constant.OPENING_ANGULAR ||
          message.includes(Constant.READ_ARTICLE_TEXT);
        return (
          <View>
            {boldOrItalic ? (
              <ParsedText
                style={[
                  item.hasOwnProperty('offline') && item.offline && !isSender
                    ? styles.textWithOffline
                    : styles.text,
                ]}
                parse={[
                  {
                    pattern: normalLink,
                    style: styles.linkStyle,
                    onPress: this.handleLinkPress,
                  },
                  {
                    pattern: normalLink,
                    style: styles.linkStyle,
                    onPress: this.handleLinkPress,
                  },
                  {
                    pattern: normalLinkWithouthttp,
                    style: styles.linkStyle,
                    onPress: this.handleLinkPress,
                  },
                  {
                    pattern: searchUnderscoreAsterisksRegex,
                    style: styles.boldItalicWord,
                    renderText: this.renderBoldItalic,
                  },
                  {
                    pattern: searchASterikUnderscoreRegex,
                    style: styles.boldItalicWord,
                    renderText: this.renderBoldItalic,
                  },
                  {
                    pattern: searchAsterisksRegex,
                    style: styles.boldWord,
                    renderText: this.renderBoldAndItalic,
                  },
                  {
                    pattern: searchUnderScoreRegex,
                    style: styles.italicWord,
                    renderText: this.renderBoldAndItalic,
                  },
                ]}
                childrenProps={{allowFontScaling: false}}>
                {message}
              </ParsedText>
            ) : activityOrArticle ? (
              <ParsedText
                style={[
                  item.hasOwnProperty('offline') && item.offline && !isSender
                    ? styles.textWithOffline
                    : styles.text,
                ]}
                parse={[
                  {
                    pattern: normalLink,
                    style: styles.linkStyle,
                    onPress: this.openLink,
                  },
                  {
                    pattern: normalLinkWithoutStarhttp,
                    style: styles.linkStyle,
                    onPress: this.openLink,
                  },
                ]}
                childrenProps={{allowFontScaling: false}}>
                {message}
              </ParsedText>
            ) : (
              <Text
                key={index.toString()}
                style={[
                  styles.textBody,
                  item.hasOwnProperty('offline') &&
                    item.offline &&
                    !isSender &&
                    styles.offlineText,
                ]}>
                {message.includes(Constant.READ_ARTICLE_TEXT)
                  ? Constant.READ_ARTICLE_TEXT
                  : finalActivityName !== ''
                  ? finalActivityName
                  : !isLink
                  ? unescape(message)
                  : ''}
                {''}
                {isLink ? (
                  <Text
                    onPress={() => this.openLink(message, item)}
                    style={[
                      this.checkContentType(message) === 'link' && {
                        color: Color.LINK,
                        width: 20,
                      },
                    ]}>
                    {item && this.checkContentType(message) === 'link'
                      ? message.replace(/<|>|Read this article:/g, '').trim()
                      : null}
                  </Text>
                ) : activityLink ? (
                  <Text
                    onPress={() => this.openLinkActivity(newActivityLink)}
                    style={[
                      this.activityCheckContentType(finalActivityName) ===
                        'link' && {color: Color.LINK, width: 20},
                    ]}>
                    {item &&
                    this.activityCheckContentType(finalActivityName) === 'link'
                      ? ' Review it now.'
                      : null}
                  </Text>
                ) : null}
              </Text>
            )}
          </View>
        );
      });
    }
    return true;
  };
  angleBracketsRemove = (match) =>
    match.replace(/<|>|Read this article:/g, '').trim();
  renderMessageBubble = (showModerationType, item, isSender, index) => {
    const {
      networkState: {isConnected},
      earnedBatchDataPayload,
      badgePayload,
      currentChannelData,
      projectSessionPayload,
      selectedProjectPayload,
      userDetailPayload,
    } = this.props;
    let videoUrl = '';
    let angleBrackets = '';
    let youtubeId = '';
    let message = '';
    let isYoutubeID = false;
    const batchId = '';
    if (
      item &&
      item.body &&
      (item.body.includes(Constant.YOUTUBE_COM) ||
        item.body.includes(Constant.YOUTUBE_BE))
    ) {
      angleBrackets = new RegExp(
        Regex.REMOVE_ANGLE_BRACES_FROM_LINK_REGEX,
        'gmi',
      );
      message = item.body;
      const angle = message.match(angleBrackets);
      if (angle && angle.length) {
        angle.map((match) => {
          message = message.replace(match, this.angleBracketsRemove(match));
        });
      }
      const url = message
        .replace(Regex.REMOVE_ANGLE_BRACKETS, '')
        .split(Regex.YOUTUBE_URL_SEPARATOR);
      if (url[2] !== undefined) {
        youtubeId = url[2].split(Regex.YOUTUBE_ID_SEPARATOR);
        youtubeId = youtubeId[0];
        videoUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
        isYoutubeID = true;
      }
    }
    if (
      item.automated === false ||
      item.automated === null ||
      (item.automated === true && item.body.includes('just completed the'))
    ) {
      if (!item.body) {
        return (
          <View style={[styles.sender, !isSender && styles.notSender]}>
            {(item.state === 'declined' &&
              item.reported_user_id &&
              this.getUserId() !== item.reported_user_id.toString()) ||
            !(
              (item.state === 'flagged' || item.state === 'declined') &&
              this.getUserId() !== item.user_id.toString()
            )
              ? this.renderMessages(item, isSender)
              : null}
            {item.hasOwnProperty('offline') &&
            item.offline &&
            !isSender &&
            !isConnected ? (
              <View
                style={styles.clockIcon}
                accessible
                accessibilityLabel="offline message"
                accessibilityRole="text">
                <EvilIcons name="clock" size={14} color="#000" />
              </View>
            ) : null}
            {item.files.length !== 0 && isYoutubeID === false ? (
              <View
                style={
                  !isSender && {flexDirection: 'row', alignSelf: 'flex-end'}
                }>
                <Attachment
                  userId={this.getUserId()}
                  isSender={isSender}
                  index={index}
                  item={item}
                  showModerationType={showModerationType}
                  renderMessages={(items) => this.renderMessages(items)}
                  filePayload={item.files}
                  imageView={this.imageView}
                  videoView={this.videoView}
                  handleDownloadForAndroid={
                    Platform.OS === 'android'
                      ? this.handleDownloadForAndroid
                      : this.handleDownloadForIOS
                  }
                  displaySpinner={this.state.displaySpinner}
                  fileId={this.state.fileId}
                />
              </View>
            ) : null}
            {showModerationType && item.files.length === 0 ? (
              <ModerationBox
                userId={this.getUserId()}
                isSender={isSender}
                item={item}
                index={index}
                showModerationType={showModerationType}
                renderMessages={(items) => this.renderMessages(items)}
              />
            ) : null}
          </View>
        );
      }
      return (
        <View style={[styles.sender, !isSender && styles.notSender]}>
          {!showModerationType ? (
            <View
              accessible
              style={[
                styles.bubble,
                !isSender && styles.newBubble,
                isSender &&
                  index === 0 && {
                    marginLeft: 15,
                    marginTop: 4,
                  },
              ]}>
              {(item.state === 'declined' &&
                item.reported_user_id &&
                this.getUserId() !== item.reported_user_id.toString()) ||
              !(
                (item.state === 'flagged' || item.state === 'declined') &&
                this.getUserId() !== item.user_id.toString()
              )
                ? this.renderMessages(item, isSender)
                : null}
              {item.hasOwnProperty('offline') &&
              item.offline &&
              !isSender &&
              !isConnected ? (
                <View
                  style={styles.clockIcon}
                  accessible
                  accessibilityLabel="offline message"
                  accessibilityRole="text">
                  <EvilIcons name="clock" size={14} color="#000" />
                </View>
              ) : null}
            </View>
          ) : null}
          {item.files.length !== 0 && isYoutubeID === false ? (
            <View
              style={
                !isSender && {flexDirection: 'row', alignSelf: 'flex-end'}
              }>
              <Attachment
                userId={this.getUserId()}
                isSender={isSender}
                index={index}
                item={item}
                showModerationType={showModerationType}
                renderMessages={(items) => this.renderMessages(items)}
                filePayload={item.files}
                normalVideo
                imageView={this.imageView}
                videoView={this.videoView}
                handleDownloadForAndroid={
                  Platform.OS === 'android'
                    ? this.handleDownloadForAndroid
                    : this.handleDownloadForIOS
                }
                displaySpinner={this.state.displaySpinner}
                fileSize={this.state.fileId}
              />
            </View>
          ) : null}
          {isYoutubeID === true &&
          (item.body.includes(Constant.YOUTUBE_COM) ||
            item.body.includes(Constant.YOUTUBE_BE)) ? (
            <View
              style={
                !isSender && {flexDirection: 'row', alignSelf: 'flex-end'}
              }>
              <YoutubeAttachment
                userId={this.getUserId()}
                isSender={isSender}
                index={index}
                item={item}
                normalVideo={false}
                imageView={this.imageView}
                videoView={this.videoView}
                showModerationType={showModerationType}
                renderMessages={(items) => this.renderMessages(items)}
                videoUrl={videoUrl}
              />
            </View>
          ) : null}
          {showModerationType &&
          item.files.length === 0 &&
          isYoutubeID === false ? (
            <ModerationBox
              userId={this.getUserId()}
              isSender={isSender}
              item={item}
              index={index}
              showModerationType={showModerationType}
              renderMessages={(items) => this.renderMessages(items)}
            />
          ) : null}
        </View>
      );
    }
  };

  renderMessageUI = (item) => {
    const {
      networkState: {isConnected},
      earnedBatchDataPayload,
      badgePayload,
      currentChannelData,
      projectSessionPayload,
      selectedProjectPayload,
      userDetailPayload,
      sideMenuItems,
    } = this.props;
    const userId = this.getUserId();
    const isSender = this.getUserId() !== item.user_id.toString();
    const isMessageModerated =
      (item.state === 'flagged' &&
        item.reported_user_id &&
        this.getUserId() === item.reported_user_id.toString()) ||
      (item.state === 'flagged' && !item.reported_user_id) ||
      item.state === 'declined';
    const {handleSmartModeration, selectedLongPressData} = this.props;
    return (
      <TouchableOpacity
        accessible={false}
        activeOpacity={0.9}
        disabled
        style={[
          styles.renderMessageUIOpacity,
          !isSender && styles.messageUiOpacityNotSender,
        ]}>
        <View style={[styles.messageView]}>
          {item.data.map((item, index) => {
            const showModerationType =
              (item.state === 'flagged' &&
                item.reported_user_id &&
                this.getUserId() === item.reported_user_id.toString()) ||
              (item.state === 'flagged' && !item.reported_user_id) ||
              item.state === 'declined';
            if (
              item.automated === false ||
              item.automated === null ||
              (item.automated === true &&
                item.body.includes('just completed the'))
            ) {
              return (
                <React.Fragment>
                  <TouchableOpacity
                    accessible={false}
                    key={index.toString()}
                    style={[
                      styles.opacityPadding,
                      selectedLongPressData.some(
                        (message) => item.id === message.id,
                      ) && styles.opacityBackground,
                    ]}
                    onLongPress={() =>
                      handleSmartModeration(
                        'longPress',
                        true,
                        item,
                        index,
                        userId,
                      )
                    }
                    onPress={() =>
                      handleSmartModeration(
                        'singlePress',
                        true,
                        item,
                        index,
                        userId,
                      )
                    }
                    activeOpacity={0.9}>
                    <View style={styles.imageView}>
                      {index === 0 && isSender ? (
                        <View style={[styles.circleImageContainer]}>
                          <Image
                            accessible
                            accessibilityLabel={`Profile Image of ${this.getMessengerName(
                              item,
                            )}`}
                            accessibilityRole="image"
                            source={{uri: this.getMessengerImage(item)}}
                            style={styles.circleImage}
                          />
                        </View>
                      ) : null}
                      {index === 0 && (
                        <View>
                          <View
                            accessible
                            style={[
                              styles.nameContainer,
                              styles.messageMarginHorizontal,
                              !isSender && styles.viewNotSender,
                            ]}>
                            {isSender ? (
                              <Text style={[styles.textName]}>
                                {this.getMessengerName(item)}
                              </Text>
                            ) : null}
                            {!isMessageModerated ? (
                              <Text style={[styles.textDate]}>
                                {formatChannelDate(item.inserted_at)}
                              </Text>
                            ) : null}
                          </View>
                          {isSender
                            ? this.renderMessageBubble(
                                showModerationType,
                                item,
                                isSender,
                                index,
                              )
                            : null}
                        </View>
                      )}
                    </View>
                    {!isSender || index > 0
                      ? this.renderMessageBubble(
                          showModerationType,
                          item,
                          isSender,
                          index,
                        )
                      : null}
                  </TouchableOpacity>
                </React.Fragment>
              );
            } else if (
              currentChannelData &&
              currentChannelData.channelType === 'mentoring' &&
              ((projectSessionPayload &&
                projectSessionPayload.data[0].attributes
                  .gamification_enabled) ||
                (selectedProjectPayload &&
                  selectedProjectPayload.data.attributes.gamification_enabled))
            ) {
              return (
                <View>
                  <BadgeItemScreen
                    index={index}
                    item={item}
                    earnedBatchDataPayload={earnedBatchDataPayload}
                    badgePayload={badgePayload}
                    userDetailPayload={userDetailPayload}
                    currentChannelData={currentChannelData}
                    navigation={this.props.navigation}
                    screenProps={this.props.screenProps}
                    dispatch={this.props.dispatch}
                    sideMenuItems={sideMenuItems}
                    isConnected={isConnected}
                  />
                </View>
              );
            }
          })}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {item, index, lastBadgeId} = this.props;
    const {selectedLongPressData, sideMenuItems, missionPayload} = this.props;
    const {modalVisible, imageLink} = this.state;
    return (
      <View
        style={index === selectedLongPressData && styles.messageItembackground}>
        {this.renderMessageUI(item, index)}
      </View>
    );
  }
}

MessageItem.defaultProps = {
  channelsPayload: null,
  item: null,
  index: 0,
  selectedLongPressData: [],
  userDetail: null,
  handleSmartModeration: () => {},
};

MessageItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  channelsPayload: PropTypes.object,
  item: PropTypes.object,
  index: PropTypes.number,
  selectedLongPressData: PropTypes.array,
  userDetail: PropTypes.object,
  handleSmartModeration: PropTypes.func,
};

const mapStateToProps = (state) => ({
  fetching: state.logOut.fetching || state.achievementReducer.fetching,
  channelsPayload: state.getchannels.channelsPayload,
  currentChannelData: state.channelMessage.currentChannelData,
  lastBadgeId: state.channelMessage.lastBadgeId,
  userDetail: state.getUserDetail.userDetailPayload,
  messge: state.userSignInInfoReducer.messge,
  networkState: state.checkNetwork.isConnected,
  sideMenuItems: setSideMenuItems(state),
  badgePayload: state.achievementReducer.badgePayload,
  missionPayload: state.achievementReducer.missionPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  earnedBatchDataPayload: state.achievementReducer.earnedBatchDataPayload,
});

export default connect(mapStateToProps)(MessageItem);
