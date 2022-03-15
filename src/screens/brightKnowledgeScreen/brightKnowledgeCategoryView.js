import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from 'react-redux';
import HtmlRenderer from '../../components/HtmlRenderer';
import Color from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';
import Config from '../../utility/config';
import {
  getCategoriesPayload,
  getSubCategoriesPayload,
  getNewsArticlesForCategories,
  getArticlesForCategories,
  clearCategoryPayloads,
} from '../../modules/brightKnowledgeCategoryReducer';
import {Container} from '../../components';
import Icon from '../../utility/icons';
import {logEventForAnalytics} from '../../utility/firebase-utils';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class CategoryScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params && navigation.state.params.title,
  });

  componentDidMount() {
    const {
      navigation: {setParams},
      dispatch,
    } = this.props;
    dispatch(clearCategoryPayloads());
    this.openCategory();
    setParams({title: 'Category'});
  }
  getNewsArticleTitle = (item) => {
    if (item.type === 'news_articles') {
      const {
        newsArticleCategoryPayload: {included},
      } = this.props;
      const object = included.filter(
        (data) => item.attributes.category_id === parseInt(data.id, 10),
      );
      const title = object[0] ? object[0].attributes.title : '';
      return [title];
    }

    const {
      articleCategoryPayload: {included},
    } = this.props;
    const object = included.filter(
      (data) => item.attributes.category_id === parseInt(data.id, 10),
    );
    const title = object[0] ? object[0].attributes.title : '';
    return [title];
  };
  getArticleCategoryTitleColor = (item) => {
    if (item.type === 'news_articles') {
      const {
        newsArticleCategoryPayload: {included},
      } = this.props;
      const object = included.filter(
        (data) => item.attributes.category_id === parseInt(data.id, 10),
      );
      const color = object[0] ? object[0].attributes.color : '';
      return [color];
    }

    const {
      articleCategoryPayload: {included},
    } = this.props;
    const object = included.filter(
      (data) => item.attributes.category_id === parseInt(data.id, 10),
    );
    const color = object[0] ? object[0].attributes.color : '';
    return [color];
  };
  openCategoryCommonDispatch = (id, slug) => {
    const {dispatch} = this.props;
    dispatch(getCategoriesPayload(slug));
    dispatch(getSubCategoriesPayload(id));
    dispatch(getNewsArticlesForCategories(id));
    dispatch(getArticlesForCategories(id));
  };
  openCategory = () => {
    const {
      navigation: {
        state: {
          params: {id, slug},
        },
      },
    } = this.props;
    this.openCategoryCommonDispatch(id, slug);
  };

  formatDate = (date) => moment(date).format('LL');

  openSubCategories = (data) => {
    const {
      dispatch,
      navigation: {setParams},
    } = this.props;
    setParams({title: 'Sub-Category'});
    dispatch(clearCategoryPayloads());
    const {id} = data;
    const {
      attributes: {slug},
    } = data;
    this.openCategoryCommonDispatch(id, slug);
    logEventForAnalytics('open_category', {});
  };
  openCategoryScreen = (data) => {
    const {
      navigation: {setParams},
    } = this.props;
    logEventForAnalytics('open_category', {});
    if (data.type === 'news_articles') {
      const {
        newsArticleCategoryPayload: {included},
      } = this.props;
      const {
        attributes: {category_id},
      } = data;
      const object = included.filter(
        (item) => data.attributes.category_id === parseInt(item.id, 10),
      );
      const slug = object[0] ? object[0].attributes.slug : '';
      this.openCategoryCommonDispatch(category_id, slug);
    } else {
      setParams({title: 'Category'});
      const {
        articleCategoryPayload: {included},
      } = this.props;
      const {
        attributes: {category_id},
      } = data;
      const object = included.filter(
        (item) => data.attributes.category_id === parseInt(item.id, 10),
      );
      const slug = object[0] ? object[0].attributes.slug : '';
      this.openCategoryCommonDispatch(category_id, slug);
    }
  };
  navigateToArticle = (item, title) => {
    logEventForAnalytics('open_article', {});
    const {
      navigation: {push},
    } = this.props;
    const {
      attributes: {slug, category_id},
      type,
    } = item;
    // dispatch(clearCategoryPayloads());
    push('ArticleList', {
      type,
      slug,
      category_id,
      title,
    });
  };

  renderLatestNews = (item, index, title) => {
    const {
      newsArticleCategoryPayload,
      articleCategoryPayload,
      categoryPayload,
    } = this.props;
    return (
      (newsArticleCategoryPayload || articleCategoryPayload) && (
        <View
          key={index.toString()}
          style={[styles.container, {justifyContent: 'flex-start'}]}>
          <View style={styles.newsArticleView}>
            {item.type === 'news_articles' ? (
              <TouchableOpacity
                accessible={false}
                accessibilityLabel={item.attributes.title}
                activeOpacity={0.7}
                onPress={() => this.navigateToArticle(item, title)}
                style={styles.leftArticleImageContainer}>
                <Image
                  accessible
                  accessibilityLabel={item.attributes.title}
                  accessibilityRole="image"
                  source={
                    item.attributes
                      ? item.attributes.image_id
                        ? {
                            uri: `${Config.IMAGE_SERVER_CDN}resize/1280x1280/${item.attributes.image_id}`,
                          }
                        : Icon.NO_IMAGE_AVAILABLE
                      : null
                  }
                  style={styles.articleImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null}
            <View
              style={
                item.type === 'news_articles'
                  ? [styles.articleRightContainer]
                  : {width: '100%'}
              }>
              {item.type === 'news_articles' && (
                <Text style={styles.newsArticleText}>
                  {this.formatDate(item.attributes.publication_date)}
                </Text>
              )}
              <View style={styles.categoryTagContainerArticle}>
                <TouchableOpacity
                  disabled={
                    categoryPayload.data[0].attributes.title ===
                    this.getNewsArticleTitle(item)[0]
                  }
                  style={styles.categoryButtonArticle}
                  activeOpacity={0.7}
                  onPress={() => this.openCategoryScreen(item, 'Article')}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.categoryButtonTextArticles,
                      {color: `#${this.getArticleCategoryTitleColor(item)}`},
                    ]}>
                    {this.getNewsArticleTitle(item)}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                accessibilityRole="link"
                onPress={() => this.navigateToArticle(item, title)}>
                <Text style={styles.boldTextTitle} numberOfLines={2}>
                  {item.attributes.title}
                </Text>
              </TouchableOpacity>
              <HtmlRenderer
                baseFontStyle={styles.titleDescription}
                numberOfWords={60}
                html={item.attributes.intro
                  .replace(/<\/p>/gim, '</div>')
                  .replace(/(<p)/gim, '<div')}
              />
            </View>
          </View>
        </View>
      )
    );
  };

  renderSubCategories = (data, index) => (
    <View key={index.toString()} style={styles.subCategoriesStyle}>
      <TouchableOpacity
        accessible={false}
        onPress={() => this.openSubCategories(data)}>
        <View style={styles.subCategoriesOpen}>
          <View style={styles.openSubCategoriesView}>
            <View
              accessible
              accessibiltyRole="image"
              accessibilityLabel={`${data.attributes.title} default image`}
              style={[
                styles.leftImageContainer,
                {backgroundColor: `#${data.attributes.color}`},
              ]}>
              <View style={styles.leftImageContainerStyle} />
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.boldTextTitle} numberOfLines={1}>
              {data.attributes.title}
            </Text>

            <HtmlRenderer
              baseFontStyle={styles.titleDescription}
              numberOfWords={60}
              html={data.attributes.description
                .replace(/<\/p>/gim, '</div>')
                .replace(/(<p)/gim, '<div')}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  render() {
    const {
      categoryPayload,
      subCategoryPayload,
      newsArticleCategoryPayload,
      articleCategoryPayload,
      fetching,
    } = this.props;
    return (
      <Container style={[styles.overlay]} fetching={fetching}>
        {categoryPayload &&
          subCategoryPayload &&
          newsArticleCategoryPayload &&
          articleCategoryPayload && (
            <View style={styles.containerView}>
              <View
                accessibiltyRole="link"
                style={[
                  styles.linkView,
                  {
                    backgroundColor: `#${categoryPayload.data[0].attributes.color}`,
                  },
                ]}>
                <Text
                  accessibiltyRole="link"
                  style={styles.linkText}
                  numberOfLines={1}>
                  {categoryPayload.data[0].attributes.title}
                </Text>
              </View>
              <ScrollView
                ref={(ref) => {
                  this.scrollView = ref;
                }}>
                <View style={styles.categoryView}>
                  <View style={styles.htmlView}>
                    <HtmlRenderer
                      html={categoryPayload.data[0].attributes.description}
                      baseFontStyle={{fontSize: 14, ...fontMaker('regular')}}
                    />
                  </View>
                  {subCategoryPayload.data.length > 0 ? (
                    <View style={styles.subCategoriesPayload}>
                      <Text style={styles.subCategoriesText}>
                        Sub-Categories
                      </Text>
                      {subCategoryPayload.data.map((data, index) =>
                        this.renderSubCategories(data, index),
                      )}
                    </View>
                  ) : null}
                  {newsArticleCategoryPayload.data.length > 0 ? (
                    <View style={styles.subCategoriesPayload}>
                      <Text style={styles.subCategoriesText}>Latest News</Text>
                      {newsArticleCategoryPayload.data.map((item, index) =>
                        this.renderLatestNews(item, index, 'News Article'),
                      )}
                    </View>
                  ) : null}
                  {articleCategoryPayload.data.length > 0 ? (
                    <View style={styles.subCategoriesPayload}>
                      <Text style={styles.subCategoriesText}>Top Articles</Text>
                      {articleCategoryPayload.data.map((item, index) =>
                        this.renderLatestNews(item, index, 'Article'),
                      )}
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            </View>
          )}
      </Container>
    );
  }
}

CategoryScreen.defaultProps = {
  categoryPayload: null,
  subCategoryPayload: null,
  fetching: false,
  newsArticleCategoryPayload: null,
  articleCategoryPayload: null,
};
CategoryScreen.propTypes = {
  categoryPayload: PropTypes.object,
  subCategoryPayload: PropTypes.object,
  newsArticleCategoryPayload: PropTypes.object,
  articleCategoryPayload: PropTypes.object,
  fetching: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    width: '100%',
  },
  subCategoriesText: {
    ...fontMaker('bold'),
    fontSize: 16,
  },
  subCategoriesPayload: {
    paddingTop: 8,
  },
  htmlView: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    width: '100%',
  },
  categoryView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  linkText: {
    ...fontMaker('bold'),
    fontSize: 20,
    color: '#fff',
    paddingHorizontal: 10,
  },
  linkView: {
    width: '100%',
    justifyContent: 'center',
    height: 50,
  },
  containerView: {
    flex: 1,
  },
  leftImageContainerStyle: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  openSubCategoriesView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: deviceWidth * 0.18,
  },
  subCategoriesOpen: {
    paddingVertical: 8,
    flexDirection: 'row',
  },
  subCategoriesStyle: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Color.SEPARATOR_COLOR,
  },
  newsArticleText: {
    fontSize: 12,
    ...fontMaker('regular'),
    color: '#9DBEEE',
    paddingTop: 1,
  },
  newsArticleView: {
    paddingVertical: 8,
    flexDirection: 'row',
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
  leftImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  articleRightContainer: {
    width: '70%',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  boldTextTitle: {
    color: '#000',
    fontSize: 15,
    ...fontMaker('bold'),
    paddingBottom: 3,
  },
  titleDescription: {
    color: '#4d3a3a',
    fontSize: 13,
    ...fontMaker('regular'),
  },
  container: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Color.SEPARATOR_COLOR,
    justifyContent: 'space-around',
  },
  leftArticleImageContainer: {
    width: '30%',
    paddingRight: 5,
  },
  articleImage: {
    width: '100%',
    height: '100%',
    maxHeight: 80,
  },
  rightContainer: {
    width: '80%',
  },
  dateTag: {
    fontSize: 10,
    ...fontMaker('regular'),
    alignSelf: 'center',
  },
  categoryTagContainer: {
    backgroundColor: '#fff',
    marginLeft: 7,
    maxWidth: deviceWidth * 0.3,
  },
  categoryTagContainerArticle: {
    backgroundColor: '#fff',
  },
  categoryButton: {
    width: '100%',
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  categoryButtonArticle: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  categoryButtonText: {
    fontSize: 10,
    ...fontMaker('bold'),
    padding: 4,
  },
  categoryButtonTextArticles: {
    fontSize: 12,
    ...fontMaker('semibold'),
    paddingVertical: 3,
  },
  rightTopContainer: {
    flexDirection: 'row',
  },
  rightTopLeftView: {
    flex: 3,
    flexDirection: 'row',
  },
  rightTopRightView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  countLikeContainer: {
    fontSize: 10,
    ...fontMaker('regular'),
    alignSelf: 'center',
    color: '#000',
  },
  likeButtonIcon: {
    paddingHorizontal: 5,
    alignSelf: 'center',
  },
  attacheLinkIcon: {
    width: 20,
    height: 20,
  },
  rightBottomContainer: {
    marginTop: 5,
    width: '95%',
  },
});

const mapStateToProps = (state) => ({
  fetching: state.brightKnowledgeCategoryReducer.fetching,
  categoryPayload: state.brightKnowledgeCategoryReducer.categoryPayload,
  subCategoryPayload: state.brightKnowledgeCategoryReducer.subCategoryPayload,
  newsArticleCategoryPayload:
    state.brightKnowledgeCategoryReducer.newsArticleCategoryPayload,
  articleCategoryPayload:
    state.brightKnowledgeCategoryReducer.articleCategoryPayload,
  brightKnowledgePayload: state.brightKnowledgeReducer.brightKnowledgePayload,
});

export default connect(mapStateToProps)(CategoryScreen);
