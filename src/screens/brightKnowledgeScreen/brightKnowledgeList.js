import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import HtmlRenderer from '../../components/HtmlRenderer';
import Config from '../../utility/config';
import Icon from '../../utility/icons';
import {likeArticle, unlikeArticle} from '../../modules/likeUnlikeArticle';
import Style from './style';
import {onAttachmentPress} from '../../modules/brightKnowledgeReducer';
import {logEventForAnalytics} from '../../utility/firebase-utils';

class BrightKnowledgeList extends Component {
  getNewsArticleTitle = (item) => {
    const {
      brightKnowledgePayload: {included},
    } = this.props;
    if (included) {
      const object = included.filter(
        (payload) => item.attributes.category_id === parseInt(payload.id, 10),
      );
      const title = object[0] ? object[0].attributes.title : '';
      return [title];
    }
    return [];
  };
  getArticleCategoryTitleColor = (item) => {
    const {
      brightKnowledgePayload: {included},
    } = this.props;
    if (included) {
      const object = included.filter(
        (payload) => item.attributes.category_id === parseInt(payload.id, 10),
      );
      const color = object[0] ? object[0].attributes.color : '';
      return [color];
    }
    return [];
  };
  formatDate = (date) => moment(date).format('MMM DD, YYYY');

  navigateToArticle = () => {
    logEventForAnalytics('open_article', {});
    const {
      navigation: {
        navigate,
        state: {routeName},
      },
      dropDownSelectedValue,
      item: {
        type,
        attributes: {slug, category_id},
      },
    } = this.props;
    navigate('ArticleList', {
      type,
      slug,
      category_id,
      title:
        dropDownSelectedValue === 'Featured Articles'
          ? 'Article'
          : 'News Article',
      routeName,
      ifLiked: this.ifLiked,
    });
  };

  ifLiked = (item) => {
    const {dispatch} = this.props;
    if (item.attributes.like_status) {
      logEventForAnalytics('article_unliked', {});
      dispatch(unlikeArticle(item));
    } else {
      dispatch(likeArticle(item));
      logEventForAnalytics('article_liked', {});
    }
  };
  openCategoryScreen = (data) => {
    const {
      navigation: {navigate},
    } = this.props;
    const {
      brightKnowledgePayload: {included},
    } = this.props;
    const {
      attributes: {category_id},
      attributes,
    } = data;
    if (included) {
      logEventForAnalytics('open_category', {});
      const object = included.filter(
        (item) => data.attributes.category_id === parseInt(item.id, 10),
      );
      const slug = object[0] ? object[0].attributes.slug : '';
      navigate('CategoryScreen', {
        slugId: attributes.slug,
        slug,
        id: category_id,
      });
    }
  };
  copiedLink = (item) => {
    const {dispatch} = this.props;
    dispatch(onAttachmentPress(item, 'list'));
  };

  render() {
    const {item} = this.props;
    const likeCount = item.attributes && item.attributes.like_count;
    return (
      <TouchableOpacity
        accessible={false}
        activeOpacity={0.9}
        disabled
        style={[Style.container, Style.shadow]}>
        <TouchableOpacity
          accessible={false}
          onPress={this.navigateToArticle}
          style={[Style.leftImageContainer]}
          activeOpacity={0.7}>
          <Image
            accessibilityLabel={item.attributes && item.attributes.title}
            accessibilityRole="image"
            accessible
            source={
              item.attributes
                ? item.attributes.image_id
                  ? {
                      uri: `${Config.IMAGE_SERVER_CDN}resize/1280x1280/${item.attributes.image_id}`,
                    }
                  : Icon.NO_IMAGE_AVAILABLE
                : null
            }
            style={Style.image}
          />
        </TouchableOpacity>
        <View style={Style.rightContainer}>
          <View style={Style.rightTopContainer}>
            <View style={Style.rightTopLeftView}>
              {item.type === 'news_articles' ? (
                <Text style={Style.dateTag}>
                  {this.formatDate(item.attributes.publication_date)}
                </Text>
              ) : null}
              {item.attributes && item.attributes.category_id ? (
                <View
                  accessible
                  accessibilityRole="button"
                  style={
                    item.type === 'news_articles'
                      ? Style.categoryTagContainer
                      : Style.categoryTagContainerArticle
                  }>
                  <TouchableOpacity
                    style={[
                      Style.categoryButton,
                      {
                        borderColor: `#${this.getArticleCategoryTitleColor(
                          item,
                        )}`,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => this.openCategoryScreen(item)}>
                    <Text
                      numberOfLines={1}
                      style={[
                        Style.categoryButtonText,
                        {color: `#${this.getArticleCategoryTitleColor(item)}`},
                      ]}>
                      {this.getNewsArticleTitle(item)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            {
              <View style={[Style.rightTopRightView]}>
                {item.attributes && item.attributes.like_count !== 0 && (
                  <Text
                    accessible
                    accessibilityLabel={`${likeCount} ${
                      likeCount > 1 ? 'Likes' : 'Like'
                    }`}
                    style={Style.countLikeContainer}>
                    {likeCount}
                  </Text>
                )}
                <TouchableOpacity
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`${likeCount} ${
                    likeCount > 1 ? 'Likes' : 'Like'
                  } ${item.attributes.like_status ? 'unlike' : 'like'}`}
                  style={Style.likeButtonIcon}
                  onPress={() => this.ifLiked(item)}>
                  <FontAwesome
                    name="thumbs-up"
                    size={16}
                    color={
                      item.attributes && item.attributes.like_status
                        ? '#00f'
                        : '#000'
                    }
                  />
                </TouchableOpacity>
                <View style={Style.attachmentView}>
                  <TouchableOpacity
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={
                      this.props.item.isAttachmentPressed
                        ? 'Remove Article link'
                        : 'Attach Article link'
                    }
                    activeOpacity={0.5}
                    style={Style.attachmentLink}
                    onPress={() => this.copiedLink(item)}>
                    <Entypo
                      name="attachment"
                      size={20}
                      color={
                        this.props.item.isAttachmentPressed ? '#0f0' : '#ccc'
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            }
          </View>
          {
            <View style={Style.rightBottomContainer}>
              <TouchableOpacity
                accessibilityRole="link"
                onPress={() => {
                  this.navigateToArticle(item);
                }}>
                <Text style={Style.boldTextTitle} numberOfLines={2}>
                  {item.attributes && item.attributes.title}
                </Text>
              </TouchableOpacity>
              <HtmlRenderer
                baseFontStyle={Style.titleDescription}
                html={item.attributes && item.attributes.intro}
                numberOfWords={60}
              />
            </View>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

BrightKnowledgeList.defaultProps = {
  brightKnowledgePayload: null,
  item: {},
  dropDownSelectedValue: '',
};

BrightKnowledgeList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  brightKnowledgePayload: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  item: PropTypes.object,
  dropDownSelectedValue: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fetching:
    state.logOut.fetching ||
    state.brightKnowledgeReducer.fetching ||
    state.brightKnowledgeCategoryReducer.fetching,
  brightKnowledgePayload: state.brightKnowledgeReducer.brightKnowledgePayload,
});

export default connect(mapStateToProps)(BrightKnowledgeList);
