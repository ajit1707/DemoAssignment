import React, {Component} from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Container} from '../../components';
import Config from '../../utility/config';
import Constant from '../../utility/constant';
import Icons from '../../utility/icons';
import {fontMaker, linkifyText, testID} from '../../utility/helper';
import Regex from '../../utility/regex';
import {connect} from 'react-redux';
import ParsedText from 'react-native-parsed-text';
import Color from '../../utility/colorConstant';
import {errorHandler} from '../../modules/errorHandler';

class ThreadPostComponent extends Component {
  openLink = (message) => {
    message = `<${message}>`;
    if (message) {
      const url = linkifyText(message)
        .replace(/"|href=|Read this article:/g, '')
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
  render() {
    const {
      item: {
        attributes: {
          created_by,
          content,
          like_count,
          current_user_like_status,
          state,
          created_at,
          attachments,
          can_delete,
          can_edit,
          is_anonymous,
        },
        id,
      },
      onLikePost,
      navigateToQuickPost,
      deletePost,
      threadsPost: {
        data: {
          attributes: {can_archive, is_archived},
        },
      },
    } = this.props;
    let boldOrItalic = false;
    let activityOrArticle = false;
    let searchAsterisksRegex = '';
    let searchUnderScoreRegex = '';
    let searchASterikUnderscoreRegex = '';
    let searchUnderscoreAsterisksRegex = '';
    let normalLink = '';
    let normalLinkWithouthttp = '';
    let normalLinkWithoutStarhttp = '';
    if (
      (content.includes(Constant.STAR) ||
        content.includes(Constant.UNDERSCORE)) &&
      !content.includes(Constant.I_HAVE_COMPLETED)
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
      normalLink = new RegExp(Regex.FIND_NORMAL_LINK);
      normalLinkWithouthttp = new RegExp(Regex.FIND_WITHOUT_HTTP, 'gmi');
    }
    if (
      !content.includes(Constant.UNDERSCORE) &&
      !content.includes(Constant.UNDERSCORE)
    ) {
      activityOrArticle = true;
      normalLink = new RegExp(Regex.FIND_NORMAL_LINK, 'gmi');
      normalLinkWithoutStarhttp = new RegExp(
        Regex.FIND_WITHOUT_ASTERISK_HTTP,
        'gmi',
      );
    }
    return (
      <Container style={styles.containerStyle}>
        {state !== 'pending' ? (
          <View style={styles.container}>
            <View style={styles.leftContainerView}>
              <View style={styles.leftContainer}>
                <View
                  accessible
                  accessibilityLabel="Profile Image of the user"
                  {...testID(
                    `Profile Image of ${
                      !is_anonymous ? created_by.first_name : 'Anonymous'
                    }`,
                  )}
                  style={styles.circleImageContainer}>
                  <Image
                    source={
                      created_by &&
                      !is_anonymous &&
                      Object.hasOwnProperty.call(created_by, 'avatar_id')
                        ? {
                            uri: created_by.avatar_id.includes(
                              'brightside-assets',
                            )
                              ? `${Config.IMAGE_SERVER_CDN}${created_by.avatar_id}`
                              : created_by.avatar_id,
                          }
                        : Icons.NO_EXPERT
                    }
                    style={styles.circleImage}
                  />
                </View>
                <View style={styles.isAnaymousView}>
                  {!is_anonymous ? (
                    <Text style={[styles.titleText, {color: Color.TITLE_TEXT}]}>
                      {`${created_by.first_name} ${created_by.last_name.charAt(
                        0,
                      )}.`}
                    </Text>
                  ) : (
                    <Text style={[styles.titleText, {color: Color.TITLE_TEXT}]}>
                      Anonymous
                    </Text>
                  )}
                  <Text style={[styles.subTitleText]}>
                    {moment(created_at).format('ll')}
                  </Text>
                </View>
              </View>
              <View style={styles.rightContainer}>
                <View style={styles.rigthContainerView}>
                  {!is_archived || can_archive ? (
                    <TouchableOpacity
                      accessible
                      accessibilityLabel={`Like thread post button ${like_count} likes`}
                      style={[styles.spaceBetweenIcons]}
                      onPress={() => onLikePost(id, !current_user_like_status)}>
                      <Text style={styles.likeCountText}>{like_count}</Text>
                      <FontAwesome
                        name="thumbs-up"
                        size={20}
                        color={
                          current_user_like_status
                            ? Color.LIKE_STATUS_COLOR
                            : Color.PAGINATION_SPINNER
                        }
                      />
                    </TouchableOpacity>
                  ) : null}
                  {can_edit && (
                    <TouchableOpacity
                      accessible
                      accessibilityLabel="Edit thread post button"
                      style={styles.spaceBetweenIcons}
                      onPress={() => navigateToQuickPost(id)}>
                      <FontAwesome name="pencil" size={20} color="#00f" />
                    </TouchableOpacity>
                  )}
                  {can_delete && (
                    <TouchableOpacity
                      accessible
                      accessibilityLabel="Delete thread post button"
                      style={styles.spaceBetweenIcons}
                      onPress={() => deletePost(id)}>
                      <AntDesign name="delete" size={20} color="#f00" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.boldItalicView}>
              {boldOrItalic ? (
                <ParsedText
                  style={styles.parseTextView}
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
                  {content}
                </ParsedText>
              ) : (
                activityOrArticle && (
                  <ParsedText
                    style={styles.parseTextView}
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
                    {content}
                  </ParsedText>
                )
              )}
            </View>
            {attachments.length > 0 ? (
              <View style={styles.imageView}>
                <Image
                  source={{
                    uri: `${Config.IMAGE_SERVER_CDN}${attachments[0].attachment_id}`,
                  }}
                  style={styles.imageStyle}
                  resizeMode="contain"
                  accessible
                  accessibilityLabel="thread post"
                  accessibilityRole="image"
                />
              </View>
            ) : null}
          </View>
        ) : (
          <View style={[styles.container]} opacity={0.6}>
            <View style={styles.moderationHeader}>
              <AntDesign name="exclamationcircleo" size={14} color="#f00" />
              <View
                accessible
                accessibilityLabel={`Pending Moderation sent on ${moment(
                  created_at,
                ).format('lll')}`}>
                <Text
                  style={styles.moderationHeaderText}
                  multiline>{`Pending Moderation sent on ${moment(
                  created_at,
                ).format('lll')}`}</Text>
              </View>
            </View>
            {boldOrItalic ? (
              <ParsedText
                style={{
                  fontSize: 16,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
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
                {content}
              </ParsedText>
            ) : (
              activityOrArticle && (
                <ParsedText
                  style={{
                    fontSize: 16,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}
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
                  {content}
                </ParsedText>
              )
            )}

            {attachments.length > 0 ? (
              <View
                style={styles.moderationImageView}
                accessible
                accessibilityLabel="Moderation Image">
                <Image
                  source={{
                    uri: `${Config.IMAGE_SERVER_CDN}${attachments[0].attachment_id}`,
                  }}
                  style={styles.moderationImageStyle}
                  resizeMode="contain"
                />
              </View>
            ) : null}
            <View
              style={styles.moderationFooter}
              accessible
              accessibilityLabel={Constant.FlAGGED_MODERATION_THREAD_MESSAGE}>
              <Text style={styles.moderationFooterText}>
                {Constant.FlAGGED_MODERATION_THREAD_MESSAGE}
              </Text>
            </View>
          </View>
        )}
      </Container>
    );
  }
}
ThreadPostComponent.defaultProps = {
  item: null,
};

ThreadPostComponent.propTypes = {
  item: PropTypes.object,
  onLikePost: PropTypes.func.isRequired,
  navigateToQuickPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

ThreadPostComponent.defaultProps = {
  item: null,
  threadsPost: null,
};

ThreadPostComponent.propTypes = {
  item: PropTypes.object,
  threadsPost: PropTypes.object,
  onLikePost: PropTypes.func.isRequired,
  navigateToQuickPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const borderWidth = 1;
const borderRadius = 25;
const borderColor = Color.BODER_COLOR;

const styles = StyleSheet.create({
  leftContainer: {
    width: '70%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingTop: 8,
    paddingLeft: 10,
  },
  moderationFooterText: {
    color: Color.FOOTER_COLOR,
    textAlign: 'center',
  },
  moderationFooter: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.MODERATION_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  moderationImageStyle: {
    height: 260,
    width: '90%',
    opacity: 0.3,
  },
  moderationImageView: {
    paddingLeft: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  contentStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  moderationHeaderText: {
    paddingLeft: 5,
  },
  moderationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  imageView: {
    paddingBottom: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  imageStyle: {
    height: 260,
    width: '90%',
  },
  parseTextView: {
    fontSize: 16,
    marginVertical: 4,
  },
  boldItalicView: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  rigthContainerView: {
    flexDirection: 'row',
  },
  likeCountText: {
    paddingRight: 5,
    fontSize: 18,
  },
  isAnaymousView: {
    paddingLeft: 10,
    paddingTop: 5,
  },
  leftContainerView: {
    flexDirection: 'row',
    width: '100%',
  },
  containerStyle: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
    marginTop: 5,
  },
  boldWord: {
    color: Color.PAGINATION_SPINNER,
    fontSize: 16,
    ...fontMaker('bold'),
    fontFamily: 'OpenSans-Italic',
  },
  boldItalicWord: {
    color: Color.PAGINATION_SPINNER,
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  italicWord: {
    color: Color.PAGINATION_SPINNER,
    fontSize: 16,
    fontFamily: 'OpenSans-Italic',
  },
  linkStyle: {
    color: Color.LINK,
    width: 20,
  },
  rightContainer: {
    position: 'absolute',
    right: 12,
    top: 2,
    flexDirection: 'row',
  },
  spaceBetweenIcons: {
    padding: 5,
    flexDirection: 'row',
  },
  circleImageContainer: {
    backgroundColor: Color.IMAGE_BACKGROUND_COLOR,
    width: 50,
    height: 50,
    borderRadius,
    borderWidth,
    borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleImage: {
    width: 50,
    height: 50,
    borderRadius,
    borderWidth,
    borderColor,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Color.THREAD_POST_BACKGROUND_COLOR,
    paddingVertical: 20,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  iconContainer: {},
  crossIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 10,
  },
  titles: {
    marginTop: 10,
    width: '70%',
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 18,
    flexWrap: 'wrap',
    color: Color.TEXT_COLOUR,
    marginBottom: 5,
  },
  subTitleText: {
    fontSize: 13,
    flexWrap: 'wrap',
    color: Color.SUBTITLE_TEXT,
  },
});
export default ThreadPostComponent;
