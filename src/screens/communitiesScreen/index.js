import React, {Component} from 'react';
import {Text, Dimensions, View} from 'react-native';
import {connect} from 'react-redux';
import {TabView, TabBar} from 'react-native-tab-view';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {setSideMenuItems} from '../../modules/getProjects';
import Style from './style';
import Topics from './topics';
import Threads from './threads';
import {clearSelectedTopics, likeThreads} from '../../modules/communityScreen';
import {communitiesNavigationOptions} from '../../navigators/Root';
import RenderScene from './renderScene';
import Toast from 'react-native-simple-toast';
import Constant from '../../utility/constant';

export const navigationOption = ({navigation, screenProps}) => ({
  ...communitiesNavigationOptions(
    {navigation, screenProps},
    'Communities',
    navigation.state.params && navigation.state.params.addTopic,
    navigation.state.params && navigation.state.params.isAdmin,
    navigation.state.params && navigation.state.params.onTopic,
  ),
});

class CommunitiesScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...navigationOption({navigation, screenProps}),
  });

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'first',
          title: 'Topics',
          name: 'briefcase-plus',
          accessibilityLabel: 'Topics tab',
        },
        {
          key: 'second',
          title: 'Threads',
          name: 'comment-processing-outline',
          accessibilityLabel: 'Threads tab',
        },
      ],
    };
  }
  componentDidMount() {
    const {
      navigation: {setParams},
      userDetailPayload: {
        included: [
          {
            attributes: {super_admin},
          },
          {
            attributes: {name},
          },
        ],
      },
      screenProps: {emitter},
    } = this.props;
    setParams({
      updateLandingPage: this.updateLandingPage,
      addTopic: this.navigateToAddTopic,
      isAdmin: super_admin || name === 'coordinator',
      onTopic: true,
    });
    emitter.emit('setSideMenuItemIndex', null, 'CommunitiesScreen');
  }

  onLikeThread = (threadId, status) => {
    const {
      dispatch,
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    const payload = {data: {attributes: {like_status: status}, type: 'thread'}};
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
      dispatch(likeThreads(threadId, payload));
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  navigateToSelectedTopic = (item) => {
    const {
      navigation: {navigate},
    } = this.props;
    navigate('SelectedTopicScreen', {
      item,
      onLikeThread: this.onLikeThread,
      navigateToThreadPost: this.navigateToThreadPost,
      navigateToAddTopic: this.navigateToAddTopic,
      navigateToQuickPost: this.navigateToQuickPost,
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
    topicIds,
    searchString,
    searchPayloadRoute,
  ) => {
    const {
      navigation: {navigate},
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
      navigate('AddTopicScreen', {
        route,
        canUpdate,
        isActive,
        description,
        name,
        id,
        key,
        dataRoute,
        topicIds,
        searchString,
        searchPayloadRoute,
      });
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  navigateToThreadPost = (slug, threadId, dataRoute) => {
    const {
      navigation: {navigate},
    } = this.props;
    navigate('ThreadPost', {
      slug,
      threadId,
      dataRoute,
    });
  };
  navigateToQuickPost = (id, postId, slug, route) => {
    const {
      navigation: {navigate},
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
      navigate('QuickPost', {
        id,
        postId,
        slug,
        route,
      });
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  updateLandingPage = () => {
    const {
      screenProps: {emitter},
      navigation: {navigate},
    } = this.props;
    emitter.emit('updateLandingPage');
    emitter.emit('setSideMenuItemIndex', 0);
    navigate('LandingPage');
  };
  renderTabBar = (props) => {
    const {sideMenuItems} = this.props;
    return (
      <TabBar
        {...props}
        style={{backgroundColor: '#fff'}}
        renderLabel={this.renderLabel}
        indicatorStyle={{
          backgroundColor: sideMenuItems && sideMenuItems.sideMenuColor,
        }}
      />
    );
  };

  renderLabel = ({route, focused}) => {
    const {sideMenuItems} = this.props;
    return (
      <View
        style={{flexDirection: 'row'}}
        accessible
        accessibilityRole="button">
        <MaterialCommunityIcons
          name={route.name}
          style={[
            Style.boldTextTitle,
            focused
              ? {color: sideMenuItems && sideMenuItems.sideMenuColor}
              : {opacity: 0.5, color: '#ccc'},
            {marginRight: 5, fontSize: 16, alignSelf: 'center'},
          ]}
        />
        <Text
          style={[
            Style.boldTextTitle,
            focused
              ? {color: sideMenuItems && sideMenuItems.sideMenuColor}
              : {opacity: 0.5, color: '#ccc'},
          ]}>
          {route.title}
        </Text>
      </View>
    );
  };

  onTabPress = () => {
    const {
      dispatch,
      navigation: {setParams},
      allTopicsData,
    } = this.props;
    const {index} = this.state;
    if (index === 0) {
      if (allTopicsData) {
        dispatch(clearSelectedTopics());
      }
      setParams({onTopic: true});
    } else {
      setParams({onTopic: false});
    }
  };
  render() {
    return (
      <View style={{flex: 1}} accessible={false}>
        <TabView
          onIndexChange={(index) =>
            this.setState({index}, () => this.onTabPress())
          }
          swipeEnabled={false}
          navigationState={this.state}
          renderScene={(route) => (
            <RenderScene
              navigateToSelectedTopic={this.navigateToSelectedTopic}
              navigateToAddTopic={this.navigateToAddTopic}
              navigateToThreadPost={this.navigateToThreadPost}
              onLikeThread={this.onLikeThread}
              onFollowThread={this.onFollowThread}
              navigateToQuickPost={this.navigateToQuickPost}
              route={route}
              {...this.props}
            />
          )}
          initialLayout={{width: Dimensions.get('window').width}}
          renderTabBar={this.renderTabBar}
        />
      </View>
    );
  }
}
CommunitiesScreen.defaultProps = {
  dispatch: () => {},
  navigation: {},
  sideMenuItems: null,
  screenProps: null,
  userDetailPayload: null,
  allTopicsData: null,
};

CommunitiesScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object,
  screenProps: PropTypes.object,
  sideMenuItems: PropTypes.object,
  userDetailPayload: PropTypes.object,
  allTopicsData: PropTypes.object,
};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
  allTopicsData: state.getCommunityScreenReducer.allTopicsData,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  userDetail: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
});
CommunitiesScreen.defaultProps = {
  dispatch: () => {},
  navigation: {},
  sideMenuItems: null,
  screenProps: null,
  userDetailPayload: null,
};

CommunitiesScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object,
  screenProps: PropTypes.object,
  sideMenuItems: PropTypes.object,
  userDetailPayload: PropTypes.object,
};
export default connect(mapStateToProps)(CommunitiesScreen);
