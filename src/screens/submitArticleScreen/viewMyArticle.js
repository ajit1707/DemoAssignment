import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import {HeaderBackButton} from 'react-navigation';
import {uniqBy} from 'lodash';
import {Container, PaginationSpinner} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import {getMyArticle} from '../../modules/getDataForSubmitArticle';
import Constant from '../../utility/colorConstant';
import ViewMyArticleList from './viewMyArticleComponent';
import {fontMaker} from '../../utility/helper';
import Style from './styles';

class ViewMyArticle extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'My Articles',
    headerLeft: (
      <HeaderBackButton
        tintColor={Constant.HEADER_LEFT_BACK_BUTTON}
        onPress={() => navigation.state.params.backToSubmitArticle()}
      />
    ),
  });
  constructor() {
    super();
    this.state = {
      pageNumber: 1,
      paginationSpinner: false,
      enableMomentum: false,
      paginatedData: [],
    };
  }
  componentDidMount() {
    const {
      dispatch,
      navigation: {
        state: {
          params: {resetArticleState},
        },
        setParams,
      },
    } = this.props;
    const {pageNumber} = this.state;
    dispatch(getMyArticle(pageNumber));
    BackHandler.addEventListener('hardwareBackPress', () => {
      resetArticleState();
    });
    setParams({backToSubmitArticle: this.backToSubmitArticle});
  }
  backToSubmitArticle = () => {
    const {navigation} = this.props;
    navigation.state.params.resetArticleState();
    navigation.goBack();
  };
  componentDidUpdate(prevProps) {
    const {getMyArticles} = this.props;
    const {paginatedData} = this.state;
    if (prevProps.getMyArticles !== getMyArticles) {
      const uniquePaginatedData = uniqBy(
        [...paginatedData, ...getMyArticles.data],
        'id',
      );
      this.setState({
        paginatedData: uniquePaginatedData,
        paginationSpinner: false,
      });
    }
  }
  onEditArticle = (id) => {
    const {
      navigation: {
        goBack,
        state: {
          params: {editArticle, resetArticleState},
        },
      },
    } = this.props;
    resetArticleState();
    editArticle(id);
    goBack();
  };

  onEndReached = () => {
    const {
      pageNumber,
      enableMomentum,
      paginatedData,
      paginationSpinner,
    } = this.state;
    const {dispatch, getMyArticles} = this.props;
    if (enableMomentum) {
      if (paginatedData.length !== getMyArticles.meta.record_count) {
        if (!paginationSpinner) {
          this.setState(
            {
              pageNumber: pageNumber + 1,
              paginationSpinner: true,
            },
            () => {
              dispatch(getMyArticle(this.state.pageNumber));
            },
          );
        }
      }
    }
  };

  onMomentumScrollBegin = () => {
    this.setState({enableMomentum: true});
  };
  showSpinner = () => {
    const {fetching} = this.props;
    return <PaginationSpinner animating={fetching} />;
  };
  render() {
    const {fetching, getMyArticles, filteredCategories} = this.props;
    const {pageNumber, paginatedData} = this.state;
    return (
      <Container
        style={Style.containerStyle}
        fetching={pageNumber === 1 && fetching}>
        {getMyArticles && getMyArticles.data.length > 0 ? (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={paginatedData}
            extraData={this.props}
            renderItem={({item, index}) => (
              <ViewMyArticleList
                item={item}
                index={index}
                onEditArticle={(id) => this.onEditArticle(id)}
              />
            )}
            ListFooterComponent={
              pageNumber !== 1 && fetching && this.showSpinner()
            }
            onEndReached={() => this.onEndReached()}
            onMomentumScrollBegin={this.onMomentumScrollBegin}
            bounces={false}
            scrollEnabled
            scrollsToTop
            onEndReachedThreshold={0.2}
          />
        ) : (
          <View style={Style.recordView}>
            <Text style={Style.recordText}>No records found</Text>
          </View>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  fetching: state.getDataForSubmitArticleReducer.fetching,
  sideMenuItems: setSideMenuItems(state),
  getMyArticles: state.getDataForSubmitArticleReducer.getMyArticles,
  filteredCategories: state.getDataForSubmitArticleReducer.filteredCategories,
});

export default connect(mapStateToProps)(ViewMyArticle);
