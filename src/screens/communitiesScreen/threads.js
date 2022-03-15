import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import {Button, Container, PaginationSpinner} from '../../components';
import Color from '../../utility/colorConstant';
import ThreadCard from './threadCard';
import {
  getThreads,
  selectTopicsForThread,
  getSearchedThreadsData,
  getArchivedThreads,
  clearPayload,
  updatedThread,
  clearSelectedTopics,
  getAllTopics,
} from '../../modules/communityScreen';
import {fontMaker} from '../../utility/helper';
import Style from '../submitArticleScreen/styles';
import NoDataStyle from './style';
import TopicsModal from '../../components/TopicsModal';
import {errorHandler} from '../../modules/errorHandler';
import {getProjects, setSideMenuItems} from '../../modules/getProjects';
import {channelDeselected} from '../../modules/displayChannelItems';
import Toast from 'react-native-simple-toast';
import Constant from '../../utility/constant';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {getUserDetails} from '../../modules/getUserDetail';

class Threads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchingText: false,
      paginationSpinner: false,
      enableLazyLoading: false,
      threadSearchedString: '',
      header: 'Select topics',
      modalVisible: false,
      topicId: [],
      isActiveEnabled: true,
      refreshing: false,
      allTopicArray: [],
    };
    this.sub = null;
  }
  static getDerivedStateFromProps(props) {
    const {
      isChannelSelected,
      navigation: {
        state: {
          params: {onTopic},
        },
      },
      dispatch,
      allTopicsData,
    } = props;
    if (isChannelSelected || onTopic) {
      return {
        searchingText: false,
        threadSearchedString: '',
        topicId: [],
        isActiveEnabled: true,
        allTopicArray: [],
      };
    }
    return null;
  }
  componentDidUpdate() {
    const {dispatch, isChannelSelected} = this.props;
    if (isChannelSelected) {
      dispatch(channelDeselected());
    }
  }

  onChange = (changedText) => {
    this.setState({threadSearchedString: changedText});
    if (changedText.length <= 0) {
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
      isActiveEnabled,
      topicId,
      threadSearchedString,
      refreshing,
    } = this.state;
    const {
      dispatch,
      threads,
      searchedThreads,
      archiveThreads,
      threadsPageNumber,
      archiveThreadsPageNumber,
      searchedThreadsPageNumber,
    } = this.props;
    if (searchingText) {
      if (enableLazyLoading && !paginationSpinner && !refreshing) {
        if (
          (searchedThreadsPageNumber - 1) * 10 <=
          searchedThreads.meta.record_count
        ) {
          this.setState(
            {
              paginationSpinner: true,
            },
            () =>
              dispatch(
                getSearchedThreadsData(
                  searchedThreadsPageNumber,
                  topicId,
                  threadSearchedString,
                  'thread',
                ),
              ).then(() => {
                this.setState({
                  paginationSpinner: false,
                  enableLazyLoading: false,
                });
              }),
          );
        }
      }
    } else if (!isActiveEnabled) {
      if (enableLazyLoading && !paginationSpinner && !refreshing) {
        if (
          (archiveThreadsPageNumber - 1) * 10 <=
          archiveThreads.meta.record_count
        ) {
          this.setState(
            {
              paginationSpinner: true,
            },
            () =>
              dispatch(getArchivedThreads(archiveThreadsPageNumber)).then(
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
    } else if (enableLazyLoading && !paginationSpinner && !refreshing) {
      if ((threadsPageNumber - 1) * 10 <= threads.meta.record_count) {
        this.setState(
          {
            paginationSpinner: true,
          },
          () =>
            dispatch(getThreads(threadsPageNumber)).then(() => {
              this.setState({
                paginationSpinner: false,
                enableLazyLoading: false,
              });
            }),
        );
      }
    }
  };

  onSelectTopic = () => {
    this.setState({modalVisible: true, header: 'Select topics'});
  };
  onRowItemSelect = (id, index, name, isChecked) => {
    const {dispatch, allTopicsData} = this.props;
    const {topicId, allTopicArray} = this.state;
    const idToRemove = topicId.findIndex((item) => item === id);
    const dataToRemove = allTopicArray.findIndex((item) => item.id === id);
    let isAllChecked = false;
    if (name === 'Select All') {
      if (!isChecked) {
        const allTopicId = allTopicsData.data.map((item) => item.id);
        this.setState({topicId: allTopicId, allTopicArray: allTopicsData.data});
      } else {
        this.setState({topicId: [], allTopicArray: []}, () =>
          this.clearTextBox(),
        );
      }
    } else if (name !== 'Select All' && !isChecked) {
      const topicIdData = topicId;
      const topicData = allTopicArray;
      topicIdData.push(id);
      const topicItem = allTopicsData.data.find((item) => item.id === id);
      topicData.push(topicItem);
      this.setState({topicId: topicIdData, allTopicArray: topicData});
    } else {
      const subData = topicId;
      const topicData = allTopicArray;
      subData.splice(idToRemove, 1);
      topicData.splice(dataToRemove, 1);
      this.setState({topicId: subData, allTopicArray: topicData});
      if (this.state.topicId.length <= 0) {
        this.clearTextBox();
      }
    }
    if (allTopicsData.data.length === allTopicArray.length) {
      isAllChecked = true;
    }
    dispatch(selectTopicsForThread(id, index, name, isChecked, isAllChecked));
  };
  onSwitchingBetweenActiveAndArchiveThreads = (status) => {
    const {dispatch} = this.props;
    const {isActiveEnabled} = this.state;
    if (isActiveEnabled && status === 'archived') {
      dispatch(clearPayload('archive'));
      dispatch(clearSelectedTopics());
      dispatch(getArchivedThreads(1));
      this.changeActiveStatus();
    } else if (!isActiveEnabled && status === 'active') {
      dispatch(clearPayload('active'));
      dispatch(getThreads(1));
      this.changeActiveStatus();
    }
  };
  onThreadSearch = () => {
    const {
      dispatch,
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    const {topicId, threadSearchedString, searchingText} = this.state;
    Keyboard.dismiss();
    let isProjectArchived = false;
    let archivedMessage = Constant.ARCHIVED_PROJECT;
    if (
      projectSessionPayload &&
      projectSessionPayload.data &&
      projectSessionPayload.data.length &&
      projectSessionPayload.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = projectSessionPayload.data[0].attributes.is_archived;
    }
    if (
      selectedProjectPayload &&
      selectedProjectPayload.data &&
      selectedProjectPayload.data.attributes.is_archived === true
    ) {
      isProjectArchived = selectedProjectPayload.data.attributes.is_archived;
    }
    if (
      userDetail &&
      userDetail.data &&
      userDetail.data.length &&
      userDetail.data[0].attributes &&
      userDetail.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = userDetail.data[0].attributes.is_archived;
      archivedMessage = Constant.USER_ARCHIVED;
    }
    if (
      (userDetail &&
        userDetail.data &&
        userDetail.data.length &&
        userDetail.data[0].attributes &&
        userDetail.data[0].attributes.is_archived === true &&
        selectedProjectPayload &&
        selectedProjectPayload.data &&
        selectedProjectPayload.data.attributes &&
        selectedProjectPayload.data.attributes.is_archived === true) ||
      (projectSessionPayload &&
        projectSessionPayload.data &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes &&
        projectSessionPayload.data[0].attributes.is_archived === true)
    ) {
      archivedMessage = Constant.ARCHIVED_PROJECT;
    }
    if (isProjectArchived === false) {
      if (topicId.length <= 0 && threadSearchedString.trim() === '') {
        dispatch(errorHandler('Please enter some text'));
        if (searchingText) {
          this.clearTextBox();
        } else {
          this.setState({
            searchingText: false,
            refreshing: false,
            threadSearchedString: '',
          });
        }
      } else {
        dispatch(clearPayload('search'));
        dispatch(
          getSearchedThreadsData(1, topicId, threadSearchedString, 'thread'),
        ).then(() => {
          this.setState({searchingText: true, refreshing: false});
        });
      }
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  onAddThreadButton = () => {
    const {
      navigateToAddTopic,
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    let isProjectArchived = false;
    let archivedMessage = Constant.ARCHIVED_PROJECT;
    if (
      projectSessionPayload &&
      projectSessionPayload.data &&
      projectSessionPayload.data.length &&
      projectSessionPayload.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = projectSessionPayload.data[0].attributes.is_archived;
    }
    if (
      selectedProjectPayload &&
      selectedProjectPayload.data &&
      selectedProjectPayload.data.attributes.is_archived === true
    ) {
      isProjectArchived = selectedProjectPayload.data.attributes.is_archived;
    }
    if (
      userDetail &&
      userDetail.data &&
      userDetail.data.length &&
      userDetail.data[0].attributes &&
      userDetail.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = userDetail.data[0].attributes.is_archived;
      archivedMessage = Constant.USER_ARCHIVED;
    }
    if (
      (userDetail &&
        userDetail.data &&
        userDetail.data.length &&
        userDetail.data[0].attributes &&
        userDetail.data[0].attributes.is_archived === true &&
        selectedProjectPayload &&
        selectedProjectPayload.data &&
        selectedProjectPayload.data.attributes &&
        selectedProjectPayload.data.attributes.is_archived === true) ||
      (projectSessionPayload &&
        projectSessionPayload.data &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes &&
        projectSessionPayload.data[0].attributes.is_archived === true)
    ) {
      archivedMessage = Constant.ARCHIVED_PROJECT;
    }
    if (isProjectArchived === false) {
      this.clearTextBox();
      navigateToAddTopic('threads');
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };

  editOrArchiveThread = (
    key,
    route,
    canUpdate,
    isActive,
    description,
    name,
    id,
    blankKey,
    dataRoute,
  ) => {
    const {dispatch, navigateToAddTopic} = this.props;
    const {searchingText, threadSearchedString, topicId} = this.state;
    if (key === 'edit') {
      if (searchingText) {
        navigateToAddTopic(
          route,
          canUpdate,
          isActive,
          description,
          name,
          id,
          'threadEdit',
          dataRoute,
          topicId,
          threadSearchedString,
          'thread',
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
          dataRoute,
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

  onRefresh = () => {
    const {dispatch} = this.props;
    const {searchingText, isActiveEnabled} = this.state;
    this.setState({refreshing: true});
    dispatch(clearPayload('threadRefresh'));
    dispatch(getProjects());
    dispatch(getSelectedProject());
    dispatch(getUserDetails());
    searchingText
      ? this.onThreadSearch()
      : !isActiveEnabled
      ? dispatch(getArchivedThreads(1)).then(() => {
          this.setState({refreshing: false});
        })
      : dispatch(getThreads(1)).then(() => {
          this.setState({refreshing: false});
        });
    dispatch(getAllTopics());
  };

  showModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  clearTextBox = () => {
    const {dispatch} = this.props;
    const {searchingText} = this.state;
    Keyboard.dismiss();
    dispatch(clearSelectedTopics());
    if (searchingText) {
      dispatch(clearPayload('active'));
      dispatch(getThreads(1));
    }
    this.setState({
      threadSearchedString: '',
      searchingText: false,
      isActiveEnabled: true,
      topicId: [],
      allTopicArray: [],
    });
  };
  changeActiveStatus = () => {
    const {isActiveEnabled} = this.state;
    this.setState({
      isActiveEnabled: !isActiveEnabled,
      threadSearchedString: '',
      searchingText: false,
      topicId: [],
      allTopicArray: [],
    });
  };
  render() {
    const {
      threadSearchedString,
      header,
      modalVisible,
      searchingText,
      isActiveEnabled,
      paginationSpinner,
      allTopicArray,
      refreshing,
    } = this.state;
    const {
      fetching,
      allTopicsData,
      threads,
      archiveThreads,
      searchedThreads,
      navigateToThreadPost,
      onLikeThread,
      navigateToQuickPost,
    } = this.props;
    return (
      <Container
        style={styles.containerStyle}
        isTabBar
        fetching={fetching && !paginationSpinner && !refreshing}>
        <View style={styles.container} accessible={false}>
          {allTopicsData && isActiveEnabled && (
            <Button
              style={[Style.touchableStyle, styles.buttonStyle]}
              onPress={() => this.onSelectTopic()}>
              <ScrollView horizontal>
                {allTopicArray.length > 0 ? (
                  allTopicArray.map((item, index) => {
                    if (index === 3) {
                      const numHiddenGroups = Math.max(
                        allTopicArray.length - index,
                        0,
                      );
                      return (
                        <View
                          key={String(index)}
                          style={{alignSelf: 'center', marginHorizontal: 5}}>
                          <Text>+{numHiddenGroups} more.</Text>
                        </View>
                      );
                    }
                    if (index > 3) {
                      return null;
                    }
                    return (
                      <View key={String(index)} style={{flexDirection: 'row'}}>
                        <Text style={styles.buttonText} numberOfLines={1}>
                          {item.attributes.name}
                        </Text>
                        <TouchableOpacity
                          style={styles.icon}
                          onPress={() =>
                            this.onRowItemSelect(
                              item.id,
                              index,
                              item.attributes.name,
                              item.isChecked,
                            )
                          }>
                          <Entypo name="cross" size={18} color="#000" />
                        </TouchableOpacity>
                      </View>
                    );
                  })
                ) : (
                  <Text
                    style={[
                      Style.addSectionButtonText,
                      {
                        alignSelf: 'center',
                        width: '100%',
                        color: Color.PLACEHOLDER,
                      },
                    ]}>
                    Select topics
                  </Text>
                )}
              </ScrollView>
              <View style={styles.icon}>
                <Entypo name="chevron-small-down" size={28} color="#ccc" />
              </View>
            </Button>
          )}
          {isActiveEnabled && (
            <View style={[styles.searchBoxContainer, styles.searchBox]}>
              <TextInput
                value={threadSearchedString}
                onChangeText={(changedText) => this.onChange(changedText)}
                placeholder="Search threads"
                placeholderTextColor={Color.PLACEHOLDER}
                style={styles.searchBoxTextInput}
                spellCheck
                autoCorrect
                autoSuggest
              />
              <View style={styles.threadSearch}>
                {threadSearchedString &&
                threadSearchedString.trim().length !== 0 ? (
                  <TouchableOpacity
                    style={styles.clearIcon}
                    onPress={() => this.clearTextBox()}>
                    <Entypo name="cross" size={25} />
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity
                accessible
                accessibilityLabel="search icon"
                accessibilityRole="button"
                style={styles.searchIcon}
                onPress={() => this.onThreadSearch()}>
                <MaterialIcons name="search" size={24} />
              </TouchableOpacity>
            </View>
          )}
          {(searchingText &&
            searchedThreads &&
            searchedThreads.data.length > 0) ||
          (!searchingText &&
            !isActiveEnabled &&
            archiveThreads &&
            archiveThreads.data &&
            archiveThreads.data.length > 0) ||
          (!searchingText &&
            isActiveEnabled &&
            threads &&
            threads.data.length > 0) ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              data={
                searchingText
                  ? searchedThreads.data
                  : !isActiveEnabled
                  ? archiveThreads.data
                  : threads.data
              }
              extraData={this.props}
              renderItem={({item}) => (
                <ThreadCard
                  item={item}
                  onLikeThread={onLikeThread}
                  navigateToQuickPost={navigateToQuickPost}
                  navigateToThreadPost={navigateToThreadPost}
                  editOrArchiveThread={this.editOrArchiveThread}
                  route="Threads"
                  dataRoute={
                    searchingText
                      ? 'search'
                      : isActiveEnabled
                      ? 'threads'
                      : 'archive'
                  }
                />
              )}
              scrollEnabled
              scrollsToTop
              keyExtractor={(data, dataIndex) => dataIndex.toString()}
              ListFooterComponent={
                <PaginationSpinner animating={this.state.paginationSpinner} />
              }
              onMomentumScrollBegin={this.onMomentumScrollBegin}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.2}
            />
          ) : !fetching && !refreshing ? (
            <Text style={NoDataStyle.noDataFound}>
              Sorry, no threads available
            </Text>
          ) : null}
        </View>

        <ActionButton
          accessibilityLabel="Action button"
          buttonColor="#8cc63f"
          buttonTextStyle={styles.buttonTextStyle}
          offsetX={12}
          offsetY={12}>
          {!isActiveEnabled && (
            <ActionButton.Item
              buttonColor="#9b59b6"
              title="Active Threads"
              onPress={() =>
                this.onSwitchingBetweenActiveAndArchiveThreads('active')
              }>
              <TouchableOpacity
                accessible
                accessibilityLabel="Active threads action button"
                onPress={() =>
                  this.onSwitchingBetweenActiveAndArchiveThreads('active')
                }>
                <FontAwesome
                  size={22}
                  name="file-archive-o"
                  style={styles.actionButtonIcon}
                />
              </TouchableOpacity>
            </ActionButton.Item>
          )}
          {isActiveEnabled && (
            <ActionButton.Item
              buttonColor="#1abc9c"
              title="Archived Threads"
              onPress={() =>
                this.onSwitchingBetweenActiveAndArchiveThreads('archived')
              }>
              <TouchableOpacity
                accessible
                accessibilityLabel="Archived threads action button"
                onPress={() =>
                  this.onSwitchingBetweenActiveAndArchiveThreads('archived')
                }>
                <FontAwesome
                  size={22}
                  name="file-archive-o"
                  style={styles.actionButtonIcon}
                />
              </TouchableOpacity>
            </ActionButton.Item>
          )}
          {isActiveEnabled && (
            <ActionButton.Item
              buttonColor="#1abc9c"
              title="Add Thread"
              onPress={() => this.onAddThreadButton()}>
              <TouchableOpacity
                accessible
                accessibilityLabel="Add Thread action button"
                onPress={() => this.onAddThreadButton()}>
                <MaterialCommunityIcons
                  size={22}
                  name="briefcase-plus"
                  style={styles.actionButtonIcon}
                />
              </TouchableOpacity>
            </ActionButton.Item>
          )}
        </ActionButton>

        {modalVisible && (
          <TopicsModal
            data={allTopicsData}
            headerText={header}
            modalVisible={modalVisible}
            showModal={this.showModal}
            onRowItemSelect={this.onRowItemSelect}
            route="threads"
          />
        )}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
  searchIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: '10%',
  },
  clearIcon: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 40,
  },
  threadSearch: {
    width: '10%',
    alignItems: 'flex-end',
  },
  searchBox: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    alignSelf: 'center',
  },
  buttonStyle: {
    backgroundColor: '#fff',
    paddingHorizontal: 17,
  },
  containerStyle: {
    backgroundColor: '#E5E5E5',
    flex: 1,
  },
  searchBoxTextInput: {
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#000',
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    width: '80%',
  },
  searchBoxContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    borderRadius: 0.5,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
    flexDirection: 'row',
  },
  buttonText: {
    ...fontMaker('semiBold'),
    fontSize: 16,
    textAlign: 'center',
    width: 50,
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 35,
  },
});
Threads.defaultProps = {
  threads: null,
  fetching: null,
  allTopicsData: null,
  archiveThreads: null,
  searchedThreads: null,
  isChannelSelected: false,
  threadsPageNumber: 1,
  archiveThreadsPageNumber: 1,
  searchedThreadsPageNumber: 1,
};

Threads.propTypes = {
  dispatch: PropTypes.func.isRequired,
  threads: PropTypes.object,
  navigateToThreadPost: PropTypes.func.isRequired,
  navigateToQuickPost: PropTypes.func.isRequired,
  onLikeThread: PropTypes.func.isRequired,
  navigateToAddTopic: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  allTopicsData: PropTypes.object,
  archiveThreads: PropTypes.object,
  searchedThreads: PropTypes.object,
  isChannelSelected: PropTypes.bool,
  threadsPageNumber: PropTypes.number,
  archiveThreadsPageNumber: PropTypes.number,
  searchedThreadsPageNumber: PropTypes.number,
};
const mapStateToProps = (state) => ({
  fetching: state.getCommunityScreenReducer.fetching,
  threads: state.getCommunityScreenReducer.threads,
  archiveThreads: state.getCommunityScreenReducer.archiveThreads,
  topics: state.getCommunityScreenReducer.topics,
  allTopicsData: state.getCommunityScreenReducer.allTopicsData,
  searchedThreads: state.getCommunityScreenReducer.searchedThreads,
  sideMenuItems: setSideMenuItems(state),
  threadsPageNumber: state.getCommunityScreenReducer.threadsPageNumber,
  archiveThreadsPageNumber:
    state.getCommunityScreenReducer.archiveThreadsPageNumber,
  searchedThreadsPageNumber:
    state.getCommunityScreenReducer.searchedThreadsPageNumber,
  isChannelSelected: state.selectedChannelItemIndexReducer.isChannelSelected,
  userDetail: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
});
export default connect(mapStateToProps)(Threads);
