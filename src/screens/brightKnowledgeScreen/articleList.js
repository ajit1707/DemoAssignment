import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {shuffle} from 'lodash';
import Color from '../../utility/colorConstant';
import HtmlRenderer from '../../components/HtmlRenderer';
import {fontMaker} from '../../utility/helper';
import Config from '../../utility/config';
import {
  getRelatedNewsArticle,
  openArticle,
  clearArticle,
  onAttachmentPress,
} from '../../modules/brightKnowledgeReducer';
import {likeArticle, unlikeArticle} from '../../modules/likeUnlikeArticle';
import {Container} from '../../components';
import Style from './style';
import {logEventForAnalytics} from '../../utility/firebase-utils';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ArticleList extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title,
  });
  constructor(props) {
    super(props);
    this.state = {
      pickerVisible: false,
    };
  }
  componentDidMount() {
    const {
      dispatch,
      navigation: {setParams},
      navigation: {
        state: {
          params: {title},
        },
      },
    } = this.props;
    dispatch(clearArticle());
    this.openArticle();
    setParams({title});
  }

  getArticleCategoryTitle = (item) => {
    const {
      relatedArticleDataPayload: {included},
    } = this.props;
    const object = included.filter(
      (data) => item.attributes.category_id === parseInt(data.id, 10),
    );
    const title = object[0] ? object[0].attributes.title : '';
    return [title];
  };
  getArticleCategoryTitleColor = (item) => {
    const {
      relatedArticleDataPayload: {included},
    } = this.props;
    const object = included.filter(
      (data) => item.attributes.category_id === parseInt(data.id, 10),
    );
    const color = object[0] ? object[0].attributes.color : '';
    return [color];
  };
  openArticle = () => {
    const {dispatch, brightKnowledgePayload} = this.props;
    const {
      navigation: {
        state: {
          params: {routeName},
        },
      },
    } = this.props;
    const {
      navigation: {
        state: {
          params: {type, slug, category_id},
        },
      },
    } = this.props;
    if (category_id !== null) {
      dispatch(getRelatedNewsArticle(category_id));
    }
    dispatch(openArticle(type, slug)).then((res) => {
      const isAttachmentPressed = brightKnowledgePayload.data.find(
        (item) => item.id === res.data.id && item.isAttachmentPressed,
      );
      if (isAttachmentPressed) {
        dispatch(onAttachmentPress(res.data));
      }
    });
  };
  handleModal = () => {
    const {pickerVisible} = this.state;
    this.setState({pickerVisible: !pickerVisible});
  };
  handleDone = () => {
    const {pickerVisible} = this.state;
    this.setState({
      pickerVisible: !pickerVisible,
    });
  };

  ifLiked = (item) => {
    const {dispatch} = this.props;
    if (item.attributes.like_status) {
      dispatch(unlikeArticle(item));
      logEventForAnalytics('article_unliked', {});
    } else {
      dispatch(likeArticle(item));
      logEventForAnalytics('article_liked', {});
    }
  };
  sectionComponent = (item, index) => (
    <View style={styles.viewStyle} key={index.toString()}>
      <Text style={styles.textStyle}>{item.attributes.title}</Text>
      {item.attributes.image_id ? (
        <Image
          accessible
          accessibilityLabel={item.attributes.title}
          accessibilityRole="image"
          source={{
            uri: `${Config.IMAGE_SERVER_CDN}resize/1280x1280/${item.attributes.image_id}`,
          }}
          resizeMode="contain"
          style={styles.imageStyle}
        />
      ) : null}
      <View>
        <HtmlRenderer html={item.attributes.body} />
      </View>
    </View>
  );

  openRelatedArticle = (data) => {
    const {
      dispatch,
      navigation: {setParams},
    } = this.props;
    const {
      item: {
        attributes: {category_id, slug},
      },
    } = data;
    const {
      item: {type},
    } = data;
    dispatch(clearArticle());
    if (category_id !== null) {
      setParams({title: 'Article'});
      dispatch(getRelatedNewsArticle(category_id));
    }
    dispatch(openArticle(type, slug));
    logEventForAnalytics('open_article', {});
  };

  openCategoryScreen = (data) => {
    const {
      navigation: {push},
      relatedArticleDataPayload: {included},
    } = this.props;
    const {
      attributes: {category_id},
    } = data.item;
    const object = included.filter(
      (item) => data.item.attributes.category_id === parseInt(item.id, 10),
    );
    const slug = object[0] ? object[0].attributes.slug : '';
    const id = category_id;
    logEventForAnalytics('open_category', {});
    // dispatch(clearArticle());
    push('CategoryScreen', {
      id,
      slug,
      screen: 'article',
    });
  };

  copiedLink(item) {
    const {
      dispatch,
      navigation: {
        state: {routeName},
      },
    } = this.props;
    dispatch(onAttachmentPress(item, routeName));
  }

  render() {
    const {
      relatedArticleDataPayload,
      articlesDataPayload,
      fetching,
    } = this.props;
    return (
      <Container style={[styles.overlay]} fetching={fetching}>
        <ScrollView
          ref={(ref) => {
            this.sectionListRef = ref;
          }}>
          <View style={styles.viewStyle1}>
            {articlesDataPayload && (
              <View style={styles.viewStyle2}>
                <Text style={styles.textStyle1}>
                  {articlesDataPayload.data.attributes.title}
                </Text>
                {articlesDataPayload.data.attributes.image_id ? (
                  <Image
                    accessible
                    accessibilityLabel="Article image"
                    accessibilityRole="image"
                    source={{
                      uri: `${Config.IMAGE_SERVER_CDN}resize/1280x1280/${articlesDataPayload.data.attributes.image_id}`,
                    }}
                    resizeMode="contain"
                    style={styles.imageStyle1}
                  />
                ) : null}
                <View style={[Style.rightTopRightView]}>
                  {articlesDataPayload.data.attributes &&
                    articlesDataPayload.data.attributes.like_count !== 0 && (
                      <Text
                        accessibilityLabel={`${
                          articlesDataPayload.data.attributes.like_count
                        } ${
                          articlesDataPayload.data.attributes.like_count > 1
                            ? 'Likes'
                            : 'Like'
                        }`}
                        style={[Style.countLikeContainer, {fontSize: 14}]}>
                        {articlesDataPayload.data.attributes.like_count}
                      </Text>
                    )}
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={
                      articlesDataPayload.data.attributes.like_status
                        ? 'Unlike'
                        : 'like'
                    }
                    style={Style.likeButtonIcon}
                    onPress={() => this.ifLiked(articlesDataPayload.data)}>
                    <FontAwesome
                      name="thumbs-up"
                      size={18}
                      color={
                        articlesDataPayload.data.attributes &&
                        articlesDataPayload.data.attributes.like_status
                          ? '#00f'
                          : '#000'
                      }
                    />
                  </TouchableOpacity>
                  <View style={styles.articleView}>
                    <TouchableOpacity
                      accessibilityLabel={
                        this.props.articlesDataPayload.data.isAttachmentPressed
                          ? 'Remove Article link'
                          : 'Attach Article link'
                      }
                      accessibilityRole="button"
                      activeOpacity={0.5}
                      style={styles.touchable}
                      onPress={() => this.copiedLink(articlesDataPayload.data)}>
                      <Entypo
                        name="attachment"
                        size={20}
                        color={
                          this.props.articlesDataPayload.data
                            .isAttachmentPressed
                            ? '#0f0'
                            : '#ccc'
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.articleViewStyle}>
                  <HtmlRenderer
                    html={articlesDataPayload.data.attributes.intro}
                    containerStyle={{paddingVertical: 10}}
                  />

                  {articlesDataPayload.data.attributes.body && (
                    <React.Fragment>
                      <View style={styles.htmlRenderViewStyle} />
                      <HtmlRenderer
                        html={articlesDataPayload.data.attributes.body}
                      />
                    </React.Fragment>
                  )}
                  {articlesDataPayload.data.attributes.category_id !== null &&
                    articlesDataPayload.included.map(
                      (item, index) =>
                        index !== 0 && this.sectionComponent(item, index),
                    )}
                </View>
              </View>
            )}
            {articlesDataPayload &&
              relatedArticleDataPayload &&
              relatedArticleDataPayload.data.length > 0 &&
              relatedArticleDataPayload.data.filter(
                (item) => articlesDataPayload.data.id !== item.id,
              ).length > 0 && (
                <View style={styles.relatedArticleView}>
                  <View style={styles.relatedArticleDataView}>
                    <Text style={styles.relatedArticleText}>
                      Related Articles
                    </Text>
                  </View>
                  <FlatList
                    data={shuffle(
                      relatedArticleDataPayload.data
                        .filter(
                          (item) => articlesDataPayload.data.id !== item.id,
                        )
                        .slice(0, 3),
                    )}
                    extraData={this.props}
                    renderItem={(data) => (
                      <View style={styles.flatListContainer}>
                        <TouchableOpacity
                          style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                          }}
                          activeOpacity={0.7}
                          onPress={() => this.openCategoryScreen(data)}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.categoryTitle,
                              {
                                color: `#${this.getArticleCategoryTitleColor(
                                  data.item,
                                )}`,
                              },
                            ]}>
                            {this.getArticleCategoryTitle(data.item)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={
                            relatedArticleDataPayload.data[0].attributes
                              .title ===
                            this.getArticleCategoryTitle(data.item)[0]
                          }
                          onPress={() => this.openRelatedArticle(data)}>
                          <Text style={styles.articleTitle} numberOfLines={2}>
                            {data.item.attributes.title}
                          </Text>
                        </TouchableOpacity>
                        <HtmlRenderer
                          containerStyle={Style.titleDescription}
                          html={`${data.item.attributes.intro.split('.')[0]}.`}
                        />
                      </View>
                    )}
                    bounces={false}
                    scrollEnabled
                    scrollsToTop
                    keyExtractor={(data, dataIndex) => dataIndex.toString()}
                  />
                </View>
              )}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  relatedArticleText: {
    ...fontMaker('bold'),
    fontSize: 16,
  },
  relatedArticleDataView: {
    paddingTop: 10,
  },
  relatedArticleView: {
    flex: 1,
    width: '100%',
  },
  htmlRenderViewStyle: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRadius: 1,
    borderColor: '#000',
    marginTop: 10,
  },
  articleViewStyle: {
    paddingVertical: 5,
  },
  touchable: {
    paddingRight: 3,
    alignSelf: 'center',
  },
  articleView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewStyle1: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  viewStyle2: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 1,
    borderColor: '#000',
  },
  imageStyle: {
    width: '100%',
    height: 200,
    paddingTop: 10,
  },
  imageStyle1: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  textStyle: {
    fontSize: 18,
    // paddingTop: 7,
    ...fontMaker('bold'),
  },
  textStyle1: {
    fontSize: 20,
    paddingVertical: 15,
    ...fontMaker('bold'),
  },
  viewStyle: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRadius: 1,
    borderColor: '#000',
    paddingVertical: 5,
  },
  modal: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
  modalBtnContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  optionText: {
    color: Color.LOGO,
    fontSize: 16,
    ...fontMaker('regular'),
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 15,
    marginBottom: deviceHeight * 0.03,
    width: deviceWidth * 0.8,
    height: 50,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: Color.PLACEHOLDER,
    ...fontMaker('regular'),
  },
  categoryTitle: {
    fontSize: 13,
    ...fontMaker('semibold'),
  },
  articleTitle: {
    color: '#000',
    fontSize: 15,
    ...fontMaker('bold'),
    paddingVertical: 3,
  },
  articleBody: {
    color: '#4d3a3a',
    fontSize: 13,
    ...fontMaker('regular'),
  },
  flatListContainer: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Color.SEPARATOR_COLOR,
    paddingVertical: 10,
  },
});
ArticleList.defaultProps = {
  relatedArticleDataPayload: null,
  articlesDataPayload: null,
  fetching: false,
  dispatch: null,
  navigation: null,
};
ArticleList.propTypes = {
  relatedArticleDataPayload: PropTypes.object,
  articlesDataPayload: PropTypes.object,
  dispatch: PropTypes.func,
  fetching: PropTypes.bool,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => ({
  fetching: state.brightKnowledgeReducer.fetching,
  relatedArticleDataPayload:
    state.brightKnowledgeReducer.relatedArticleDataPayload,
  articlesDataPayload: state.brightKnowledgeReducer.articlesDataPayload,
  brightKnowledgePayload: state.brightKnowledgeReducer.brightKnowledgePayload,
});

export default connect(mapStateToProps)(ArticleList);
