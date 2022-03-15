import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from '../../components/Container';
import AlgoliaSearchBar from './algoliaSearcComponents/algoliaSearchBar';
import BrightKnowledgeList from './brightKnowledgeList';
import BrightKnowledgeCategories from './brightKnowledgeCategoriesComponent';
import {
  getNewsArticles,
  getArticles,
  getEssentialCategories,
  getNonEssentialCategories,
  clearBrightKnowledgeList,
} from '../../modules/brightKnowledgeReducer';
import {Dropdown, PaginationSpinner} from '../../components';
import {
  getCategorySearchedDataPayload,
  getSearchedDataPayload,
} from '../../modules/algoliaSearch';
import {logEventForAnalytics} from '../../utility/firebase-utils';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';

export class BrightKnowledgeScreen extends Component {
  static navigationOptions = () => ({
    title: 'Bright Knowledge',
  });
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      paginationSpinner: false,
      defaultValue: 'Featured Articles',
      isArticleSearched: false,
      country: 'Featured Articles',
    };
    this.offset = 1;
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const {pageNumber} = this.state;
    dispatch(getArticles(pageNumber));
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(clearBrightKnowledgeList());
  }

  onEndReached = () => {
    const {dispatch, brightKnowledgePayload} = this.props;
    const {pageNumber, paginationSpinner, defaultValue} = this.state;
    if (!paginationSpinner && defaultValue !== 'Categories') {
      if ((pageNumber - 1) * 10 <= brightKnowledgePayload.meta.record_count) {
        this.setState(
          {pageNumber: this.state.pageNumber + 1, paginationSpinner: true},
          () => {
            if (defaultValue === 'Latest News') {
              dispatch(getNewsArticles(this.state.pageNumber)).then(() => {
                this.setState({paginationSpinner: false});
              });
            } else if (defaultValue === 'Featured Articles') {
              dispatch(getArticles(this.state.pageNumber)).then(() => {
                this.setState({paginationSpinner: false});
              });
            } else {
              dispatch(getEssentialCategories());
              dispatch(getNonEssentialCategories()).then(() => {
                this.setState({paginationSpinner: false});
              });
            }
          },
        );
      }
    }
  };
  onSelect = (item, value) => {
    const {dispatch} = this.props;
    const {defaultValue} = this.state;
    if (item.label === 'Featured Articles' && defaultValue !== item.label) {
      logEventForAnalytics('open_article', {});
      dispatch(clearBrightKnowledgeList());
      dispatch(getArticles(1)).then(
        () =>
          this.sectionListRef &&
          this.sectionListRef.scrollToOffset({animated: false, offset: 0}),
      );
      this.setState({
        defaultValue: item.label,
        pageNumber: 1,
      });
    }
    if (item.label === 'Categories' && defaultValue !== item.label) {
      logEventForAnalytics('open_category', {});
      dispatch(clearBrightKnowledgeList());
      dispatch(getEssentialCategories()).then(() =>
        dispatch(getNonEssentialCategories()),
      );
      this.setState({defaultValue: item.label, pageNumber: 1});
    }
    this.setState({isArticleSearched: false});
    if (this.searchBarRef) {
      this.searchBarRef.clear();
    }
  };

  checkSearchArticle = (text) => {
    if (text.length >= 1) {
      this.setState({isArticleSearched: true});
    }

    if (text.length === 0) {
      this.setState({isArticleSearched: false});
    }
  };

  showSpinner = () => {
    const {fetching} = this.props;
    return <PaginationSpinner animating={fetching} />;
  };
  navigate = () => {
    this.props.navigation.goBack();
  };

  onItemPress = (item) => {
    const {
      dispatch,
      navigation: {navigate},
    } = this.props;
    const {defaultValue} = this.state;
    if (defaultValue === 'Categories') {
      logEventForAnalytics('open_category', {});
      dispatch(getCategorySearchedDataPayload(item.title)).then((res) => {
        const {
          data: [
            {
              attributes: {slug},
              id,
            },
          ],
        } = res;
        navigate('CategoryScreen', {id, slug});
      });
    } else {
      logEventForAnalytics('open_article', {});
      dispatch(getSearchedDataPayload(item.title, defaultValue)).then((res) => {
        const {
          data: [
            {
              attributes: {slug, category_id},
              type,
            },
          ],
        } = res;
        navigate('ArticleList', {
          type,
          slug,
          category_id,
          title: defaultValue,
        });
      });
    }
    this.setState({isArticleSearched: false});
    this.searchBarRef.clear();
    // this.onChange('');
  };

  render() {
    const {fetching, brightKnowledgePayload} = this.props;
    const {pageNumber, defaultValue, isArticleSearched} = this.state;
    return (
      <Container
        style={{backgroundColor: '#E5E5E5', flex: 1}}
        fetching={pageNumber === 1 && fetching}>
        {/*<Dropdown*/}
        {/*    data={['Featured Articles', 'Categories']}*/}
        {/*    onChangeHandler={(index, value) => this.onSelect(index, value)}*/}
        {/*    defaultValue={defaultValue}*/}
        {/*/>*/}
        <DropDownPicker
          items={[
            {
              label: 'Featured Articles',
              value: 'Featured Articles',
              hidden: true,
            },
            {label: 'Categories', value: 'Categories'},
          ]}
          defaultValue={this.state.country}
          containerStyle={{height: 50}}
          style={{backgroundColor: '#fff', fontSize: 22}}
          itemStyle={{
            //justifyContent: 'flex-start'
            //alignSelf: 'center',
            // fontSize: 22,
            // backgroundColor: 'transparent',
            // paddingHorizontal: '5%'
            //justifyContent: 'flex-start'
            //paddingVertical: 13,
            //justifyContent: 'center',
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderColor: '#E5E5E5',
            justifyContent: 'flex-start',
          }}
          arrowStyle={{
            color: '#ccc',
          }}
          labelStyle={{
            fontSize: 16,
            textAlign: 'left',
            //color: '#ccc'
          }}
          dropDownStyle={{backgroundColor: '#fff'}}
          onChangeItem={(index, value) => this.onSelect(index, value)}
        />
        <AlgoliaSearchBar
          searchBarRef={(el) => {
            this.searchBarRef = el;
          }}
          checkSearchArticle={(text) => this.checkSearchArticle(text)}
          onItemPress={(item) => this.onItemPress(item)}
          value={defaultValue}
          isArticleSearched={isArticleSearched}
          {...this.props}
        />
        {brightKnowledgePayload && !isArticleSearched ? (
          defaultValue !== 'Categories' ? (
            <View style={{flex: 1}}>
              <FlatList
                ref={(ref) => {
                  this.sectionListRef = ref;
                }}
                data={brightKnowledgePayload.data}
                extraData={this.props}
                renderItem={({item, index}) => (
                  <BrightKnowledgeList
                    item={item}
                    index={index}
                    pageNumber={pageNumber}
                    dropDownSelectedValue={defaultValue}
                    {...this.props}
                  />
                )}
                ListFooterComponent={
                  pageNumber !== 1 && fetching && this.showSpinner()
                }
                onEndReached={() => this.onEndReached()}
                bounces={false}
                scrollEnabled
                scrollsToTop
                onEndReachedThreshold={0.2}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ) : (
            <BrightKnowledgeCategories
              categoryPayload={brightKnowledgePayload}
              {...this.props}
            />
          )
        ) : null}
      </Container>
    );
  }
}

BrightKnowledgeScreen.defaultProps = {
  brightKnowledgePayload: null,
};

BrightKnowledgeScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  brightKnowledgePayload: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching:
    state.brightKnowledgeReducer.fetching ||
    state.brightKnowledgeCategoryReducer.fetching,
  brightKnowledgePayload: state.brightKnowledgeReducer.brightKnowledgePayload,
});

export default connect(mapStateToProps)(BrightKnowledgeScreen);
