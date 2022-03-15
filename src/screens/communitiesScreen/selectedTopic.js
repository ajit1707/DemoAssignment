import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import {HeaderBackButton} from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Container, Input, PaginationSpinner} from '../../components';
import ThreadCard from './threadCard';
import Constant from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';
import {
  getThreadsForTopic,
  clearPayload,
  getSearchedThreadsData,
  updatedThread,
} from '../../modules/communityScreen';
import {errorHandler} from '../../modules/errorHandler';
import Style from './style';
import {getProjects} from '../../modules/getProjects';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {getUserDetails} from '../../modules/getUserDetail';

class SelectedTopicScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Threads',
    headerLeft: (
      <HeaderBackButton
        tintColor={Constant.HEADER_LEFT_BACK_BUTTON}
        onPress={() => navigation.goBack()}
      />
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      isKeyboardActive: false,
      searchText: '',
      enableLazyLoading: false,
      paginationSpinner: false,
      searchingText: false,
      topicId: [props.navigation.state.params.item.id],
      refreshing: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      navigation: {
        state: {
          params: {
            item: {id},
          },
        },
      },
    } = this.props;
    const {pageNumber} = this.state;
    dispatch(clearPayload('threadsForTopicUnmount'));
    dispatch(getThreadsForTopic(pageNumber, id));
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({isKeyboardActive: true});
  };

  keyboardDidHide = () => {
    this.setState({isKeyboardActive: false});
  };

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text;
    this.setState(newState);
    if (text.length <= 0) {
      this.setState({searchingText: false});
    }
  };
  onMomentumScrollBegin = () => {
    this.setState({enableLazyLoading: true});
  };

  onEndReached = () => {
    const {
      enableLazyLoading,
      paginationSpinner,
      searchingText,
      refreshing,
    } = this.state;
    const {
      threadsForTopicPageNumber,
      threadsForTopic,
      dispatch,
      navigation: {
        state: {
          params: {
            item: {id},
          },
        },
      },
    } = this.props;
    if (
      enableLazyLoading &&
      !paginationSpinner &&
      !searchingText &&
      !refreshing
    ) {
      if (
        (threadsForTopicPageNumber - 1) * 10 <=
        threadsForTopic.meta.record_count
      ) {
        this.setState(
          {
            pageNumber: this.state.pageNumber + 1,
            paginationSpinner: true,
          },
          () =>
            dispatch(getThreadsForTopic(threadsForTopicPageNumber, id)).then(
              () => {
                this.setState({
                  paginationSpinner: false,
                  enableLazyLoading: false,
                });
              },
            ),
        );
      }
    }
  };
  onThreadSearch = () => {
    const {dispatch} = this.props;
    const {topicId, searchText} = this.state;
    Keyboard.dismiss();
    if (searchText.trim() === '') {
      dispatch(errorHandler('Please enter some text'));
      this.setState({searchText: '', searchingText: false});
    } else {
      dispatch(clearPayload('threadsForTopicSearch'));
      dispatch(
        getSearchedThreadsData(1, topicId, searchText.trim(), 'selectedThread'),
      )
        .then(() => {
          this.setState({searchingText: true});
        })
        .catch(() => {
          this.setState({searchingText: false});
        });
    }
  };
  clearTextBox = () => {
    const {dispatch} = this.props;
    const {topicId, searchingText} = this.state;
    if (searchingText) {
      dispatch(clearPayload('clearSearch'));
      dispatch(getThreadsForTopic(1, topicId));
    }
    this.setState({searchText: '', searchingText: false});
  };
  onRefresh = () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: {
            item: {id},
          },
        },
      },
    } = this.props;
    this.setState({refreshing: true}, () => {
      dispatch(clearPayload('threadsForTopicSearch'));
      dispatch(getProjects());
      dispatch(getSelectedProject());
      dispatch(getUserDetails());
      dispatch(getThreadsForTopic(1, id)).then(() => {
        this.setState({
          pageNumber: 1,
          searchText: '',
          searchingText: false,
          refreshing: false,
        });
      });
    });
  };
  navigateToAddTopic = (
    route,
    canUpdate,
    isActive,
    description,
    name,
    id,
    key,
    dataRoute,
  ) => {
    const {
      navigation: {navigate},
    } = this.props;
    navigate('AddTopicScreen', {
      route,
      canUpdate,
      isActive,
      description,
      name,
      id,
      key,
      dataRoute,
    });
  };

  editOrArchiveThread = (
    key,
    route,
    canUpdate,
    isActive,
    description,
    name,
    id,
  ) => {
    const {
      dispatch,
      navigation: {
        state: {
          params: {navigateToAddTopic},
        },
      },
    } = this.props;
    const {searchingText} = this.state;
    if (key === 'edit') {
      if (searchingText) {
        this.navigateToAddTopic(
          route,
          canUpdate,
          isActive,
          description,
          name,
          id,
          'threadEdit',
          'search',
        );
      } else {
        navigateToAddTopic(
          route,
          canUpdate,
          isActive,
          description,
          name,
          id,
          'threadEdit',
          'selectedThreads',
        );
      }
    } else {
      const payload = {
        data: {
          attributes: {
            is_archived: !isActive,
          },
          id,
          type: 'threads',
        },
      };
      dispatch(updatedThread(id, payload));
    }
  };
  headerComponent = () => {
    const {searchText} = this.state;
    return (
      <View style={styles.searchBoxContainer}>
        <TextInput
          onChangeText={this.handleTextChange('searchText')}
          placeholder="Search threads"
          spellCheck
          autoCorrect
          placeholderTextColor={Constant.PLACEHOLDER}
          style={styles.searchBoxTextInput}
          value={searchText}
        />
        <View style={styles.topicView}>
          {searchText && searchText.trim().length !== 0 ? (
            <TouchableOpacity
              style={styles.closeButtonStyle}
              onPress={() => this.clearTextBox()}>
              <Entypo name="cross" size={24} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.searchView}>
          {searchText ? (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => this.onThreadSearch()}>
              <MaterialIcons name="search" size={24} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };
  render() {
    const {
      navigation: {
        state: {
          params: {
            item,
            onLikeThread,
            navigateToThreadPost,
            navigateToAddTopic,
            navigateToQuickPost,
          },
        },
      },
    } = this.props;
    const {threadsForTopic, searchedThreadsOfTopics, fetching} = this.props;
    const {
      isKeyboardActive,
      searchText,
      searchingText,
      paginationSpinner,
      refreshing,
    } = this.state;
    return (
      <Container fetching={fetching && !paginationSpinner && !refreshing}>
        <View
          onStartShouldSetResponder={() => Keyboard.dismiss()}
          style={styles.container}>
          <View style={[styles.headerContainer]}>
            <Text style={styles.nameTextStyle}>{item.attributes.name}</Text>
            <Text style={styles.descriptionTextStyle}>
              {item.attributes.description}
            </Text>
          </View>
          {this.headerComponent()}
          {(!searchingText &&
            threadsForTopic &&
            threadsForTopic.data.length > 0) ||
          (searchingText &&
            searchedThreadsOfTopics &&
            searchedThreadsOfTopics.data.length > 0) ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              data={
                searchingText &&
                searchedThreadsOfTopics &&
                searchedThreadsOfTopics.data
                  ? searchedThreadsOfTopics.data
                  : threadsForTopic && threadsForTopic.data
              }
              extraData={this.props}
              // bounces={false}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <ThreadCard
                  item={item}
                  onLikeThread={onLikeThread}
                  navigateToThreadPost={navigateToThreadPost}
                  navigateToQuickPost={navigateToQuickPost}
                  editOrArchiveThread={this.editOrArchiveThread}
                  route="selectedTopic"
                  dataRoute={searchingText ? 'search' : 'selectedThreads'}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled
              ListFooterComponent={
                <PaginationSpinner animating={this.state.paginationSpinner} />
              }
              onMomentumScrollBegin={this.onMomentumScrollBegin}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.2}
            />
          ) : !fetching ? (
            <Text style={Style.noDataFound}>Sorry, no threads available</Text>
          ) : null}

          {!isKeyboardActive && (
            <ActionButton
              buttonColor="#8cc63f"
              buttonTextStyle={{color: '#fff', fontSize: 35}}
              offsetX={12}
              offsetY={12}
              onPress={() =>
                navigateToAddTopic(
                  'threadToTopic',
                  false,
                  true,
                  '',
                  item.attributes.name,
                  item.id,
                )
              }
              nativeFeedbackRippleColor="rgba(229, 229, 229, 1)"
            />
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    width: '100%',
  },
  descriptionTextStyle: {
    color: '#000',
    marginBottom: 10,
    fontSize: 17,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  nameTextStyle: {
    color: '#000',
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
    ...fontMaker('bold'),
  },
  searchButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 45,
  },
  searchView: {
    width: '10%',
  },
  closeButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  topicView: {
    width: '6%',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#fff',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  searchBoxContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 50,
    borderRadius: 0.5,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
    paddingLeft: '2%',
    paddingRight: '2%',
    flexDirection: 'row',
  },
  searchBoxTextInput: {
    fontSize: 16,
    color: '#000',
    paddingLeft: 10,
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    width: '80%',
  },
});

SelectedTopicScreen.defaultProps = {
  navigation: {},
};

SelectedTopicScreen.propTypes = {
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => ({
  fetching: state.getCommunityScreenReducer.fetching,
  threadsForTopic: state.getCommunityScreenReducer.threadsForTopic,
  searchedThreadsOfTopics:
    state.getCommunityScreenReducer.searchedThreadsOfTopics,
  threadsForTopicPageNumber:
    state.getCommunityScreenReducer.threadsForTopicPageNumber,
});

export default connect(mapStateToProps)(SelectedTopicScreen);
