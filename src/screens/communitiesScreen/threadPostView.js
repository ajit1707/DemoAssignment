import React, {Component} from 'react';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {HeaderBackButton} from 'react-navigation';
import ActionButton from 'react-native-action-button';
import PropTypes from 'prop-types';
import {Button, Container, PaginationSpinner} from '../../components';
import Color from '../../utility/colorConstant';
import ThreadPostComponent from './threadPostComponent';
import {
  getThreadsData,
  deletePost,
  getSearchedThreadsPostData,
  threadPostLike,
  clearPayload,
  updatedThread,
  followThreads,
  likeThreads,
} from '../../modules/communityScreen';
import {fontMaker} from '../../utility/helper';
import {getTrendingPost} from '../../modules/landingPage';
import {errorHandler} from '../../modules/errorHandler';
import Style from './style';
import Constant from '../../utility/constant';
import {getProjects} from '../../modules/getProjects';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {getUserDetails} from '../../modules/getUserDetail';

let isArchive;

class ThreadPost extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Posts',
    headerLeft: (
      <HeaderBackButton
        tintColor={Color.HEADER_LEFT_BACK_BUTTON}
        onPress={() => navigation.goBack()}
      />
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      paginationSpinner: false,
      threadSearchedString: '',
      isSearching: false,
      refreshing: false,
      dataRoute: props.navigation.state.params.dataRoute,
    };
  }
  componentDidMount() {
    const {
      dispatch,
      navigation: {
        state: {
          params: {slug},
        },
      },
    } = this.props;
    dispatch(getThreadsData(slug))
      .then(() => {})
      .catch((err) => {
        console.log('err', err);
      });
  }
  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(clearPayload('threadPost'));
  }

  onChange = (changedText) => {
    this.setState({threadSearchedString: changedText});
    if (changedText.length <= 0) {
      this.setState({isSearching: false});
    }
  };
  onLikePost = (threadPostId, likeStatus) => {
    const {
      dispatch,
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
      const payload = {
        data: {
          attributes: {
            like_status: likeStatus,
          },
          type: 'posts',
        },
      };
      dispatch(threadPostLike(threadPostId, payload));
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  onSearchPost = (threadId) => {
    const {dispatch} = this.props;
    const {threadSearchedString} = this.state;
    Keyboard.dismiss();
    if (threadSearchedString.trim() === '') {
      dispatch(errorHandler('Please enter some text'));
      this.setState({threadSearchedString: ''});
    } else {
      dispatch(
        getSearchedThreadsPostData(threadId, threadSearchedString.trim()),
      ).then(() => {
        this.setState({isSearching: true});
      });
    }
  };
  onFollowThread = (threadId, status) => {
    const {
      dispatch,
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
      const payload = {
        data: {attributes: {follow_status: status}, type: 'thread'},
      };
      dispatch(followThreads(threadId, payload));
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  onLikeThread = (threadId, status) => {
    const {
      dispatch,
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
      const payload = {
        data: {attributes: {like_status: status}, type: 'thread'},
      };
      dispatch(likeThreads(threadId, payload));
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  onRefresh = () => {
    const {dispatch, threadsPostSlug} = this.props;
    this.setState({refreshing: true}, () => {
      dispatch(getProjects());
      dispatch(getSelectedProject());
      dispatch(getUserDetails());
      dispatch(getThreadsData(threadsPostSlug)).then(() => {
        this.clearTextBox();
        this.setState({refreshing: false});
      });
    });
  };
  clearTextBox = () => {
    this.setState({threadSearchedString: '', isSearching: false});
  };
  navigateToQuickPost = (postId) => {
    const {
      navigation: {navigate},
      threadsPost: {
        data: {
          id,
          attributes: {slug},
        },
      },
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    const {isSearching} = this.state;
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
      navigate('QuickPost', {
        id,
        postId,
        slug,
        route: 'threadPost',
        searchEnabled: isSearching,
      });
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
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
      navigation: {goBack},
    } = this.props;
    const {dataRoute} = this.state;
    if (key === 'edit') {
      this.navigateToAddTopic(
        route,
        canUpdate,
        isActive,
        description,
        name,
        id,
        'threadEdit',
        dataRoute,
      );
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
      dispatch(updatedThread(id, payload)).then(() => {
        dispatch(getTrendingPost()).then(() => {
          goBack();
          if (!isActive) {
            Toast.showWithGravity(
              'Thread archived successfully',
              Toast.SHORT,
              Toast.BOTTOM,
            );
          } else {
            Toast.showWithGravity(
              'Thread restored successfully',
              Toast.SHORT,
              Toast.BOTTOM,
            );
          }
        });
      });
    }
  };
  deletePost = (postId) => {
    const {
      dispatch,
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
      dispatch(deletePost(postId)).then(() => {
        Toast.showWithGravity(
          'Post deleted successfully',
          Toast.LONG,
          Toast.BOTTOM,
        );
      });
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  renderThreadCard = () => {
    const {threadsPost} = this.props;
    if (threadsPost && threadsPost.data) {
      const {
        data: {
          attributes: {
            name,
            can_archive,
            can_edit,
            current_user_follow_status,
            current_user_like_status,
            follow_count,
            is_archived,
            like_count,
            topic_ids,
            description,
          },
          id,
        },
      } = threadsPost;
      isArchive = is_archived;
      return (
        <View style={styles.outsideView}>
          <View style={styles.insideView}>
            <View
              style={styles.topicView}
              accessible
              accessibilityLabel={`Topic name ${topic_ids[0].name}`}>
              <Text style={styles.topicText}>Topic: </Text>
              <Text style={[styles.topicNameText]} numberOfLines={1}>
                {topic_ids[0].name}
              </Text>
            </View>
          </View>
          <View style={styles.viewEditArchieve}>
            <View style={styles.viewName}>
              <Text style={[styles.subTitleText, styles.viewText]}>{name}</Text>
            </View>
            {can_edit && can_archive && (
              <View style={styles.canEditView}>
                {can_edit && (
                  <TouchableOpacity
                    accessible
                    accessibilityLabel="Edit thread name button"
                    style={styles.canEditOpacity}
                    onPress={() =>
                      this.editOrArchiveThread(
                        'edit',
                        'threads',
                        true,
                        is_archived,
                        description,
                        name,
                        id,
                      )
                    }>
                    <FontAwesome name="pencil" size={20} color="#00f" />
                  </TouchableOpacity>
                )}
                {can_archive && (
                  <TouchableOpacity
                    accessible
                    accessibilityLabel="Archive thread button"
                    accessibilityHint="Navigates to the previous screen"
                    onPress={() =>
                      this.editOrArchiveThread(
                        'archive',
                        'threads',
                        true,
                        is_archived,
                        description,
                        name,
                        id,
                      )
                    }>
                    {!is_archived ? (
                      <FontAwesome
                        size={20}
                        name="file-archive-o"
                        color="#1A5CB5"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        size={20}
                        name="restore"
                        color="#1A5CB5"
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          {(can_archive || !is_archived) && (
            <View style={styles.buttonContainer}>
              <Button
                accessible
                accessibilityLabel={`${like_count} Likes`}
                accessibilityHint="Like button"
                style={[styles.button]}
                onPress={() =>
                  this.onLikeThread(id, !current_user_like_status)
                }>
                <Text
                  style={[
                    styles.countText,
                    {color: current_user_like_status ? '#1A5CB5' : '#000'},
                  ]}>
                  {like_count !== 0 ? like_count : null}
                </Text>
                <FontAwesome
                  style={[styles.fontIcon, {paddingTop: 1}]}
                  name="thumbs-o-up"
                  size={18}
                  color={current_user_like_status ? '#1A5CB5' : '#000'}
                />
                <Text
                  style={[
                    styles.likeText,
                    {color: current_user_like_status ? '#1A5CB5' : '#000'},
                  ]}>
                  Like
                </Text>
              </Button>
              <Button
                accessible
                accessibilityLabel={`${follow_count} Following`}
                style={[styles.button]}
                onPress={() =>
                  this.onFollowThread(id, !current_user_follow_status)
                }>
                <Text
                  style={[
                    styles.countText,
                    {color: current_user_follow_status ? '#1A5CB5' : '#000'},
                  ]}>
                  {follow_count !== 0 ? follow_count : null}
                </Text>
                {current_user_follow_status ? (
                  <SimpleLineIcons
                    style={styles.fontIcon}
                    name="user-unfollow"
                    size={18}
                    color="#1A5CB5"
                  />
                ) : (
                  <SimpleLineIcons
                    style={styles.fontIcon}
                    name="user-follow"
                    size={18}
                    color="#000"
                  />
                )}
                <Text
                  style={[
                    styles.unfollowText,
                    {color: current_user_follow_status ? '#1A5CB5' : '#000'},
                  ]}>
                  {current_user_follow_status ? 'Unfollow' : 'Follow'}
                </Text>
              </Button>
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  render() {
    const {
      userDetailPayload: {
        included: [
          {
            attributes: {super_admin},
            attributes,
          },
        ],
      },
      threadsPost,
      fetching,
      threadsSearchedPost,
    } = this.props;
    const {threadSearchedString, isSearching, refreshing} = this.state;
    return (
      <Container
        style={styles.containerBackground}
        fetching={fetching && !refreshing}>
        <View style={styles.container}>
          {this.renderThreadCard()}
          <View
            style={[
              styles.searchBoxContainer,
              styles.searchBoxContainerDirection,
            ]}>
            <TextInput
              accessible
              accessibilityLabel="Search thread post text field"
              value={threadSearchedString}
              autoCorrect
              spellCheck
              onChangeText={(changedText) => this.onChange(changedText)}
              placeholder="Search posts"
              placeholderTextColor={Color.PLACEHOLDER}
              style={styles.searchBoxTextInput}
            />
            <View style={styles.threadSearchedStringview}>
              {threadSearchedString &&
              threadSearchedString.trim().length !== 0 ? (
                <TouchableOpacity
                  accessible
                  accessibilityLabel="Clear search thread posts"
                  style={styles.threadSearchedStringView}
                  onPress={() => this.clearTextBox()}>
                  <Entypo name="cross" size={24} />
                </TouchableOpacity>
              ) : null}
            </View>
            {threadSearchedString ? (
              <TouchableOpacity
                style={styles.threadSearchedStringOpacity}
                accessible
                accessibilityLabel="Thread posts search button"
                onPress={() => this.onSearchPost(threadsPost.data.id)}>
                <MaterialIcons name="search" size={24} />
              </TouchableOpacity>
            ) : null}
          </View>
          {(!isSearching &&
            threadsPost &&
            threadsPost.hasOwnProperty('included') &&
            threadsPost.included.length > 0) ||
          (isSearching &&
            threadsSearchedPost &&
            threadsSearchedPost.data.length > 0) ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              data={
                isSearching
                  ? threadsSearchedPost.data
                  : threadsPost && threadsPost.included
              }
              extraData={this.props}
              renderItem={({item}) => (
                <ThreadPostComponent
                  item={item}
                  onLikePost={this.onLikePost}
                  navigateToQuickPost={this.navigateToQuickPost}
                  deletePost={this.deletePost}
                  threadsPost={threadsPost}
                />
              )}
              scrollEnabled
              scrollsToTop
              keyExtractor={(data, dataIndex) => dataIndex.toString()}
              ListFooterComponent={
                <PaginationSpinner animating={this.state.paginationSpinner} />
              }
              onEndReachedThreshold={0.2}
            />
          ) : !fetching ? (
            <Text style={Style.noDataFound}>
              Sorry, no threads post available
            </Text>
          ) : null}
        </View>
        {((isArchive && (super_admin || attributes['is_coordinator?'])) ||
          !isArchive) && (
          <ActionButton
            accessibilityLabel="Add thread post button"
            buttonColor="#8cc63f"
            buttonTextStyle={styles.buttonTextStyleEnable}
            offsetX={12}
            offsetY={12}
            onPress={() => this.navigateToQuickPost()}
            nativeFeedbackRippleColor="rgba(229, 229, 229, 1)"
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
    marginBottom: 5,
    width: '100%',
  },
  outsideView: {
    borderWidth: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginBottom: 5,
  },
  insideView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  topicView: {
    width: '75%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  topicText: {
    color: '#000',
    fontSize: 19,
    ...fontMaker('semibold'),
  },
  viewEditArchieve: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  viewName: {
    width: '75%',
    paddingVertical: 5,
    paddingRight: 5,
  },
  viewText: {
    paddingVertical: 7,
  },
  canEditOpacity: {
    paddingRight: 10,
  },
  canEditView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 24,
    width: '25%',
  },
  likeText: {
    marginLeft: 7,
    fontSize: 18,
  },
  containerBackground: {
    backgroundColor: '#E5E5E5',
    flex: 1,
  },
  unfollowText: {
    marginLeft: 7,
    fontSize: 18,
  },
  searchBoxContainerDirection: {
    flexDirection: 'row',
  },
  threadSearchedStringView: {
    paddingLeft: 7,
  },
  threadSearchedStringview: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
  buttonTextStyleEnable: {
    color: '#fff',
    fontSize: 35,
  },
  threadSearchedStringOpacity: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    paddingRight: 15,
  },
  headerContainer: {
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 7,
    marginTop: 7,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    elevation: 4,
  },
  text: {
    fontSize: 15,
    flexWrap: 'wrap',
    color: '#000',
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  searchBoxTextInput: {
    fontSize: 16,
    color: '#000',
    paddingLeft: 15,
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    height: 45,
    width: '80%',
  },
  searchBoxContainer: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 0.5,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
    flexDirection: 'row',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 15,
    width: '85%',
    alignSelf: 'flex-end',
    borderRadius: 10,
  },
  subTitleText: {
    marginHorizontal: 10,
    fontSize: 18,
    ...fontMaker('bold'),
    color: '#000',
  },
  topicNameText: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 16,
    ...fontMaker('bold'),
    color: '#fff',
    alignSelf: 'flex-end',
    textAlign: 'center',
    marginLeft: 5,
    backgroundColor: '#1A5CB5',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 35,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: 'transparent',
    width: '45%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginRight: 5,
    fontSize: 18,
  },
  fontIcon: {
    alignSelf: 'center',
  },
});
ThreadPost.defaultProps = {
  threadsPost: null,
  userDetailPayload: null,
  attributes: null,
  included: null,
  threadsSearchedPost: null,
  navigation: {},
  threadsPostSlug: '',
  fetching: false,
};

ThreadPost.propTypes = {
  dispatch: PropTypes.func.isRequired,
  attributes: PropTypes.object,
  threadsPost: PropTypes.object,
  userDetailPayload: PropTypes.object,
  threadsSearchedPost: PropTypes.object,
  navigation: PropTypes.object,
  included: PropTypes.object,
  threadsPostSlug: PropTypes.string,
  fetching: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  fetching: state.getCommunityScreenReducer.fetching,
  threads: state.getCommunityScreenReducer.threads,
  archiveThreads: state.getCommunityScreenReducer.archiveThreads,
  searchedThreadsOfTopics:
    state.getCommunityScreenReducer.searchedThreadsOfTopics,
  threadsPost: state.getCommunityScreenReducer.threadsPost,
  threadsSearchedPost: state.getCommunityScreenReducer.threadsSearchedPost,
  threadsForTopic: state.getCommunityScreenReducer.threadsForTopic,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  threadsPostSlug: state.getCommunityScreenReducer.threadsPostSlug,
  userDetail: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
});
export default connect(mapStateToProps)(ThreadPost);
