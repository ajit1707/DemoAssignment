import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {DrawerActions} from 'react-navigation';
import {inRange} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../utility/icons';
import {logOut} from '../modules/logOut';
import Alert from '../components/Alert';
import Constant from '../utility/constant';
import {Container} from '../components';
import {
  socketConnect,
  socketChannelNotification,
  socketDisconnect,
  socketLeaveChannel,
} from '../utility/phoenix-utils';
import {setSideMenuItems, getProjects} from '../modules/getProjects';
import {getUserDetail, userDetails} from '../modules/getUserDetail';
import {channelsUser, getChannelsName} from '../modules/channelsUser';
import {errorHandler} from '../modules/errorHandler';
import {getChannels} from '../modules/getChannels';
import {socketNotification} from '../modules/socketNotification';
import {channelMessage, clearChannelMessages} from '../modules/channelMessage';
import {
  getProjectMaterials,
  resetProjectMaterialData,
} from '../modules/getProjectMaterial';
import {
  displayChannelItems,
  setSelectedChannelItemIndex,
  channelSelected,
  channelDeselected,
} from '../modules/displayChannelItems';
import {
  setAskGraduateVariables,
  getAskGraduateDetail,
} from '../modules/landingPage';
import {getSelectedProject} from '../modules/getSelectedProject';
import {
  getMenteeActivities,
  getProjectUserActivities,
  resetFetchedMenteeData,
  resetActivitiesData,
} from '../modules/activitiesMentee';
import {
  getProjectUserActivitiesMentor,
  resetActivitiesDataMentor,
} from '../modules/activitiesMentor';
import {
  getAssignmentData,
  resetAssignmentData,
} from '../modules/assignmentReducer';
import {
  clearPayload,
  getAllTopics,
  getThreads,
  getTopics,
} from '../modules/communityScreen';
import {chatBot, mentorProfile} from '../modules/typeformMentee';
import Toast from 'react-native-simple-toast';
import {
  connectionData,
  checkData,
  routeNameOfScreens,
} from '../modules/chosseAsMentor';
import {getProfileDetail, getProjectUser} from '../modules/profile';
import {
  availableBatch,
  earnedBatch,
  messageStreak,
} from '../modules/achievement';

const deviceWidth = Dimensions.get('window').width;

let length;

class SideMenu extends Component {
  constructor(props) {
    super();
    this.state = {
      logOutVisiblity: false,
      alertContent: '',
      sideMenuItems: props.sideMenuItems,
      isDrawerMenuItemSelected: 0,
      message: false,
    };
    if (props.channelItems && props.channelItems.length > 0) {
      length = props.channelItems.length;
    }
  }

  componentDidMount() {
    const {
      dispatch,
      channelItems,
      screenProps: {emitter},
      networkState: {isConnected},
      sideMenuItems: {sideMenuItems},
      connectionOfSocket,
      userDetailPayload,
    } = this.props;
    if (isConnected && connectionOfSocket === true) {
      dispatch(connectionData(false));
      socketConnect(userDetailPayload.data[0].attributes.project_id)
        .then(() => {
          socketChannelNotification(channelItems, dispatch);
        })
        .catch((err) => {
          dispatch(errorHandler(err));
        });
    }
    emitter.on('setSideMenuItemIndex', (selectedIndex, route) => {
      const findIndex = sideMenuItems.findIndex((item) => item.route === route);
      if (findIndex !== -1) {
        this.setSideMenuItemIndex(findIndex);
      } else {
        this.setSideMenuItemIndex(selectedIndex);
      }
    });
  }

  componentDidUpdate(prevProps) {
    const {
      channelItems,
      channelUserPayload,
      dispatch,
      currentChannelData,
      userDetailPayload,
    } = this.props;
    if (
      JSON.stringify(prevProps.channelUserPayload) !==
      JSON.stringify(channelItems)
    ) {
      if (
        channelItems &&
        channelItems.length &&
        channelUserPayload &&
        channelUserPayload.length
      ) {
        const difference = prevProps.channelUserPayload.filter(
          (item, index) =>
            channelItems[index] &&
            item.channelId !== channelItems[index].channelId,
        );
        if (difference.length) {
          channelUserPayload.forEach((item, index) => {
            if (
              currentChannelData &&
              item.channelId === currentChannelData.channelId
            ) {
              dispatch(setSelectedChannelItemIndex(index));
            }
          });
          dispatch(displayChannelItems(channelUserPayload));
        }
      }
    }
  }
  setSideMenuItemIndex = (selectedIndex) => {
    this.setState({
      isDrawerMenuItemSelected: selectedIndex,
    });
  };

  getProjectData = async () => {
    const {dispatch} = this.props;
    const projectSwitcherSelectedData = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
      () => {},
    );
    const parsedProjectData = JSON.parse(projectSwitcherSelectedData);
    if (parsedProjectData) {
      dispatch(getSelectedProject());
    } else {
      dispatch(getProjects());
    }
  };

  closeDrawer = () => {
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  handleOptions = (route, index, items) => {
    let expertTitle;
    let expertIsAvailable;
    let projectUserId = '';
    let project_user_id = '';
    let project_id = '';
    const {
      channelItems,
      currentChannelData,
      selectedChannelItemIndex,
      userDetailPayload: {data, included},
      userStatus: {role},
      screenProps: {emitter},
      networkState: {isConnected},
      projectSessionPayload,
      selectedProjectPayload,
      sideMenuItems,
    } = this.props;
    const {message} = this.state;
    const channelsPayloadCopy = channelItems;
    const {
      dispatch,
      navigation: {navigate},
    } = this.props;
    console.log('route', route);
    let isDrawerMenuItemSelected = 0;
    if (isConnected) {
      this.getProjectData();
    }
    if (route === 'LogOut') {
      socketDisconnect();
      this.closeDrawer();
      this.setState({
        logOutVisiblity: true,
        alertContent: 'Are you sure you want to sign out?',
      });
    } else if (route === 'Profile' || route === 'LandingPage') {
      socketLeaveChannel();
      dispatch(getProfileDetail());
      dispatch(setSelectedChannelItemIndex(-1));
      emitter.emit('updateLandingPage');
      emitter.emit('updateProfile');
      if (isConnected) {
        dispatch(clearChannelMessages());
      }
      if (route === 'Profile') {
        dispatch(routeNameOfScreens('Profile'));
        this.setState({message: true});
      } else {
        dispatch(routeNameOfScreens('LandingPage'));
        this.setState({message: true});
      }
      dispatch(channelDeselected());
      isDrawerMenuItemSelected = index;
      this.setState({isDrawerMenuItemSelected});
      if (
        ((projectSessionPayload &&
          projectSessionPayload.data[0].attributes.typeform_enabled) ||
          (selectedProjectPayload &&
            selectedProjectPayload.data.attributes.typeform_enabled)) &&
        ((projectSessionPayload &&
          projectSessionPayload.data[0].attributes.matching_enabled ===
            false) ||
          (selectedProjectPayload &&
            selectedProjectPayload.data.attributes.matching_enabled ===
              false)) &&
        this.props.userDetailPayload.data[0].attributes.survey_state !==
          'unstarted' &&
        this.props.userDetailPayload.data[0].attributes['has_survey?'] &&
        data[0].attributes.state === 'unmatched' &&
        included[1].attributes.name === 'mentee' &&
        message === true
      ) {
        this.setState({message: false});
        Toast.showWithGravity(
          'Mentor Matching Tool - needs a top-up!\n' +
            "All the mentors on this project have already been snapped up! We'll allocate more amazing mentors very soon and notify you when you can try again!",
          Toast.LONG,
          Toast.BOTTOM,
        );
      }

      navigate(route);
    } else if (route === 'CommunitiesScreen') {
      dispatch(setSelectedChannelItemIndex(-1));
      dispatch(clearPayload('clearAll'));
      this.setState({isDrawerMenuItemSelected: index, message: true});
      dispatch(channelSelected());
      dispatch(routeNameOfScreens('CommunitiesScreen'));
      dispatch(getProfileDetail());
      dispatch(getTopics(1));
      dispatch(getThreads(1));
      dispatch(getAllTopics());
      navigate(route);
      this.closeDrawer();
    } else if (route === 'AskTheGuruScreen') {
      socketLeaveChannel();
      dispatch(getProfileDetail());
      dispatch(routeNameOfScreens('AskTheGuruScreen'));
      dispatch(setSelectedChannelItemIndex(-1));
      dispatch(clearChannelMessages());
      dispatch(channelDeselected());
      isDrawerMenuItemSelected = index;
      this.setState({isDrawerMenuItemSelected, message: true});
      dispatch(getAskGraduateDetail('sideMenu')).then((res) => {
        const {
          data: {included},
        } = res;
        expertTitle = res.data.data[0].attributes.replacement_text_enabled
          ? res.data.data[0].attributes.replacement_text
          : 'Graduate';
        const activeGraduate =
          included &&
          included.filter((graduate) => graduate.attributes.state === 'active');
        expertIsAvailable = activeGraduate ? !!activeGraduate.length : false;
        navigate(route, {expertTitle, expertIsAvailable});
        this.closeDrawer();
      });
    } else if (route === 'ProjectMaterial') {
      dispatch(getProfileDetail());
      dispatch(setSelectedChannelItemIndex(-1));
      dispatch(resetProjectMaterialData());
      this.setState({isDrawerMenuItemSelected: index, message: true});
      dispatch(routeNameOfScreens('ProjectMaterial'));
      dispatch(getProjectMaterials(1));
      dispatch(channelDeselected());
      navigate(route);
      this.closeDrawer();
    } else if (route === 'AssignmentScreen') {
      dispatch(getProfileDetail());
      if (
        included[1].attributes.name === 'mentee' &&
        data[0].attributes.survey_state === 'unstarted' &&
        data[0].attributes['survey_compulsory?']
      ) {
        dispatch(errorHandler(Constant.OPEN_SURVEY_IN_ASSIGNMENT));
      } else {
        dispatch(setSelectedChannelItemIndex(-1));
        dispatch(resetAssignmentData());
        dispatch(routeNameOfScreens('AssignmentScreen'));
        this.setState({isDrawerMenuItemSelected: index, message: true});
        dispatch(getAssignmentData(1));
        navigate(route);
        this.closeDrawer();
      }
    } else if (route === 'mentorProfile') {
      dispatch(getProfileDetail());
      dispatch(setSelectedChannelItemIndex(-1));
      this.setState({isDrawerMenuItemSelected: index, message: true});
      dispatch(routeNameOfScreens('mentorProfile'));
      dispatch(mentorProfile());
      navigate(route);
      this.closeDrawer();
    } else if (route === 'achievement') {
      dispatch(getProfileDetail());
      dispatch(setSelectedChannelItemIndex(-1));
      this.setState({isDrawerMenuItemSelected: index, message: true});
      if (data.length && data[0].id) {
        projectUserId = data[0].id;
        dispatch(earnedBatch(projectUserId));
        project_user_id = data[0].id;
        project_id = data[0].attributes.project_id;
        const payload = {
          data: {
            attributes: {
              project_user_id,
              project_id,
            },
            type: 'message_streaks',
          },
        };
        dispatch(messageStreak(payload));
        dispatch(routeNameOfScreens('achievement'));
        dispatch(checkData(true));
        dispatch(availableBatch(projectUserId));
      }
      navigate(route);
      this.closeDrawer();
    } else if (route === 'Activities') {
      dispatch(getProfileDetail());
      dispatch(setSelectedChannelItemIndex(-1));
      dispatch(routeNameOfScreens('Activities'));
      this.setState({isDrawerMenuItemSelected: index, message: true});
      if (role === 'mentor') {
        dispatch(resetActivitiesDataMentor());
        dispatch(getProjectUserActivitiesMentor(1));
      } else {
        dispatch(resetActivitiesData());
        dispatch(getMenteeActivities(1)).then(() => {
          dispatch(getProjectUserActivities());
        });
      }
      navigate(route);
      this.closeDrawer();
    } else if (
      included[1].attributes.name === 'mentee' &&
      data[0].attributes.survey_state === 'unstarted' &&
      data[0].attributes['survey_compulsory?']
    ) {
      dispatch(errorHandler(Constant.OPEN_SURVEY_INCOMPLETE));
    } else if (
      selectedChannelItemIndex < 0 ||
      (currentChannelData && currentChannelData.channelId !== items.channelId)
    ) {
      socketLeaveChannel();
      dispatch(channelsUser());
      this.setState({message: true});
      dispatch(routeNameOfScreens('Message'));
      if (isConnected) {
        projectUserId = data[0].id;
        dispatch(earnedBatch(projectUserId));
        dispatch(getChannels()).then(() => dispatch(chatBot()));
        dispatch(getChannels()).then(() => dispatch(mentorProfile()));
        dispatch(getProfileDetail());
      }
      dispatch(channelSelected());
      emitter.emit('setSideMenuItemIndex', -1);
      dispatch(socketNotification('remove', null));
      dispatch(channelMessage([], items, null, 'sideMenu'));
      channelsPayloadCopy[index].notificationCount = 0;
      dispatch(displayChannelItems(channelsPayloadCopy));
      dispatch(setSelectedChannelItemIndex(index));
      navigate(route);
    }
    if (route !== 'AskTheGuruScreen') {
      this.closeDrawer();
    }
  };

  handleLogout = () => {
    this.setState({logOutVisiblity: false});
    const {
      navigation: {dispatch},
    } = this.props;
    dispatch(logOut());
  };
  handleDismiss = () => {
    this.setState({logOutVisiblity: false});
  };

  handleProjectSwitcher = () => {
    this.closeDrawer();
    this.props.navigation.navigate('ProjectListScreen');
  };

  renderSideMenuItem = (items, index) => {
    const {isDrawerMenuItemSelected} = this.state;
    const {
      askGraduateVariables: {
        askGraduatesEnabled,
        expertTitle,
        expertIsAvailable,
      },
    } = this.props;
    const buttonText = expertTitle
      ? `${items.title} ${expertTitle}`
      : `${items.title} Graduate`;
    if (items.id === 'askTheGraduate' && askGraduatesEnabled) {
      return (
        <TouchableOpacity
          accessibilityLabel={buttonText}
          accessibilityRole="button"
          style={[
            styles.sideMenuItemButton,
            isDrawerMenuItemSelected === index && styles.activeBackgroundColor,
          ]}
          activeOpacity={0.6}
          onPress={() =>
            this.handleOptions(
              items.route,
              index,
              items,
              expertTitle,
              expertIsAvailable,
            )
          }>
          <View
            style={[
              styles.labelIconContainer,
              styles.sideMenuMarginHorizontal,
            ]}>
            <Text style={[styles.navItemStyle]}>{buttonText}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        accessibilityLabel={items.title}
        accessibilityRole="button"
        style={[
          styles.sideMenuItemButton,
          isDrawerMenuItemSelected === index && styles.activeBackgroundColor,
        ]}
        activeOpacity={0.6}
        onPress={() => this.handleOptions(items.route, index)}>
        <View
          style={[styles.labelIconContainer, styles.sideMenuMarginHorizontal]}>
          <Text style={[styles.navItemStyle]}>{items.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderSignOutComponent = (items, activeItemKey) => (
    <TouchableOpacity
      accessibilityLabel="Sign Out"
      accessibilityRole="button"
      activeOpacity={0.6}
      onPress={() => this.handleOptions('LogOut')}>
      <View style={[styles.labelIconContainer, styles.signOutText]}>
        <Text
          style={[
            styles.navItemStyle,
            activeItemKey === items.route && styles.activeTab,
          ]}>
          {items.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  renderItems = (items, index) => {
    const {selectedChannelItemIndex} = this.props;
    const isChannelSelected = selectedChannelItemIndex === index;
    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.7}
        style={[
          {paddingVertical: 7, width: '100%'},
          isChannelSelected && styles.activeBackgroundColor,
        ]}
        onPress={() => this.handleOptions('Message', index, items)}>
        <View
          style={[styles.labelIconContainer, styles.sideMenuMarginHorizontal]}>
          <View
            style={{width: '85%', flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={[styles.bullet, isChannelSelected && styles.activeBullet]}
            />
            <Text
              style={[
                styles.navItemStyle,
                {paddingLeft: 10},
                isChannelSelected && styles.activeTab,
              ]}>
              {items && items.channelType === 'group'
                ? `${items.channelName} (Group Chat)`
                : items.channelName}
            </Text>
          </View>
          {items.notificationCount > 0 ? (
            <View style={{width: '15%'}}>
              <View style={styles.notificationIcon} />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  renderChannelsComponent = (items, activeItemKey) => {
    const {channelItems} = this.props;
    const isChannelSelected = activeItemKey === items.route;
    return (
      <React.Fragment>
        <View
          key={items.title}
          style={[styles.labelIconContainer, styles.sideMenuMarginHorizontal]}>
          <Text
            style={[
              styles.navItemStyle,
              isChannelSelected && styles.activeTab,
            ]}>
            {items.title}
          </Text>
        </View>
        <View style={{marginVertical: 4}}>
          <FlatList
            bounces={false}
            data={channelItems}
            extraData={this.props}
            renderItem={({item, index}) => this.renderItems(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </React.Fragment>
    );
  };

  renderOptions = (items, index) => {
    const {
      activeItemKey,
      askGraduateVariables: {askGraduatesEnabled},
      sideMenuItems: {
        communitiesEnabled,
        externalMaterialsEnabled,
        assignmentEnabled,
        activitiesEnabled,
      },
      userStatus: {isAdmin, role},
      projectSessionPayload,
      selectedProjectPayload,
      userDetailPayload: {data, included},
    } = this.props;
    const {isDrawerMenuItemSelected} = this.state;
    return (
      <View key={items.route}>
        {items.id === 'home' ? (
          <View style={index === 0 ? {marginVertical: 8} : {marginBottom: 8}}>
            {this.renderSideMenuItem(items, index)}
          </View>
        ) : null}
        {items.id === 'channel'
          ? this.renderChannelsComponent(items, activeItemKey)
          : null}
        {items.id === 'myAccount' ? (
          <View>{this.renderSideMenuItem(items, index)}</View>
        ) : null}
        {items.id === 'myAchievement' &&
        ((projectSessionPayload &&
          projectSessionPayload.data[0].attributes.gamification_enabled) ||
          (selectedProjectPayload &&
            selectedProjectPayload.data.attributes.gamification_enabled)) &&
        included[1].attributes.name === 'mentee' ? (
          <View>{this.renderSideMenuItem(items, index)}</View>
        ) : null}
        {items.id === 'mentorAccount' &&
        ((projectSessionPayload &&
          projectSessionPayload.data[0].attributes.typeform_enabled) ||
          (selectedProjectPayload &&
            selectedProjectPayload.data.attributes.typeform_enabled)) &&
        data[0].attributes.state === 'matched' &&
        included[1].attributes.name === 'mentee' ? (
          <View>{this.renderSideMenuItem(items, index)}</View>
        ) : null}
        {items.id === 'projectResourcesScreen' && externalMaterialsEnabled ? (
          <View>{this.renderSideMenuItem(items, index)}</View>
        ) : null}
        {items.id === 'askTheGraduate' && askGraduatesEnabled ? (
          <View>{this.renderSideMenuItem(items, index)}</View>
        ) : null}
        {items.id === 'activities' &&
        activitiesEnabled &&
        !(isAdmin || role === 'coordinator') ? (
          <View>{this.renderSideMenuItem(items, index)}</View>
        ) : null}
        {items.id === 'assignment' && assignmentEnabled ? (
          <View>{this.renderSideMenuItem(items, index)}</View>
        ) : null}
        {items.id === 'resources' ? (
          <View
            style={[
              styles.sideMenuItemButton,
              isDrawerMenuItemSelected === index &&
                styles.activeBackgroundColor,
            ]}
            activeOpacity={0.6}
            onPress={() => this.handleOptions(items.route, index, items)}>
            <View
              style={[
                styles.labelIconContainer,
                styles.sideMenuMarginHorizontal,
              ]}>
              <Text style={[styles.navItemStyle]}>{items.title}</Text>
            </View>
          </View>
        ) : null}
        {items.id === 'communities' && communitiesEnabled ? (
          <View>{this.renderSideMenuItem(items, index)}</View>
        ) : null}
        {items.id === 'signOut' ? (
          <View
            style={[
              styles.sideMenuMarginHorizontal,
              {
                justifyContent: 'flex-end',
                paddingBottom: 15,
                height:
                  length <= 2
                    ? deviceWidth * 0.5
                    : inRange(length, 2.9, 4.1)
                    ? deviceWidth * 0.45
                    : inRange(length, 4.9, 6.1)
                    ? deviceWidth * 0.4
                    : inRange(length, 6.9, 8.1)
                    ? deviceWidth * 0.35
                    : deviceWidth * 0.3,
              },
            ]}
            key={items.id}>
            {this.renderSignOutComponent(items, activeItemKey)}
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    const {logOutVisiblity, alertContent, sideMenuItems, message} = this.state;
    const {userPayload} = this.props;
    const name = userPayload && userPayload[0];
    return (
      <Container safeAreaViewColor={sideMenuItems.sideMenuColor}>
        <View
          style={[
            styles.container,
            {backgroundColor: sideMenuItems.sideMenuColor},
          ]}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View style={{marginHorizontal: 0}}>
              <View
                style={[
                  styles.projectContainer,
                  styles.sideMenuMarginHorizontal,
                ]}>
                <View style={styles.projectNameContainer}>
                  <Text numberOfLines={3} style={{fontSize: 30, color: '#fff'}}>
                    {sideMenuItems.projectName}
                  </Text>
                  <Text style={{fontSize: 16, color: '#fff', paddingTop: 5}}>
                    {name &&
                      `${
                        name.attributes.first_name
                      } ${name.attributes.last_name.charAt(0)} (you)`}
                  </Text>
                </View>
                <View style={styles.projectSwitcher}>
                  <TouchableOpacity
                    accessibilityLabel="Project switcher"
                    accessibilityRole="button"
                    style={styles.projectSwitcherButton}
                    activeOpacity={0.7}
                    onPress={this.handleProjectSwitcher}>
                    <Image
                      source={Icon.PROJECT_SWITCHER}
                      style={{width: 25, height: 25}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {sideMenuItems.sideMenuItems.map((items, index) =>
                this.renderOptions(items, index),
              )}
            </View>
          </ScrollView>
          <Alert
            content={alertContent}
            route="LogOut"
            isVisible={logOutVisiblity}
            handleSubmit={this.handleLogout}
            handleDismiss={this.handleDismiss}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navItemStyle: {
    color: '#fff',
    fontSize: 18,
    width: '90%',
  },
  navSectionStyle: {
    paddingTop: 8,
    paddingBottom: 15,
  },
  projectContainer: {
    paddingTop: 25,
    paddingBottom: 22,
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ffffff80',
  },
  projectNameContainer: {
    justifyContent: 'center',
    width: '70%',
  },
  projectSwitcher: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: '100%',
    height: 50,
  },
  crossIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  crossIcon: {
    width: 22,
    height: 22,
  },
  activeTab: {
    color: '#fff',
    fontWeight: '500',
  },
  labelIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  labelIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  separator: {
    backgroundColor: '#fff',
    width: '90%',
    height: 0.2,
    alignSelf: 'center',
    borderRadius: 50,
  },
  bullet: {
    height: 8,
    width: 8,
    borderRadius: 25,
    backgroundColor: '#ccc1c7',
  },
  activeBullet: {
    backgroundColor: '#fff',
  },
  signOutContainer: {
    height: 50,
    justifyContent: 'center',
  },
  signOutText: {
    borderBottomColor: '#FFFFFF80',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#FFFFFF80',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  projectSwitcherButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    height: 8,
    width: 8,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginTop: 0,
  },
  sideMenuMarginHorizontal: {
    marginHorizontal: 15,
  },
  activeBackgroundColor: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  sideMenuItemButton: {
    paddingVertical: 7,
    width: '100%',
  },
  signOutHeight: {},
});

SideMenu.defaultProps = {
  currentChannelData: null,
  channelUserPayload: null,
  userStatus: null,
  userDetailPayload: null,
  askGraduateVariables: null,
  isConnected: true,
  selectedChannelItemIndex: -1,
};

SideMenu.propTypes = {
  navigation: PropTypes.object.isRequired,
  activeItemKey: PropTypes.string.isRequired,
  sideMenuItems: PropTypes.object.isRequired,
  askGraduateVariables: PropTypes.object,
  isConnected: PropTypes.bool,
  channelItems: PropTypes.array.isRequired,
  currentChannelData: PropTypes.object,
  networkState: PropTypes.object.isRequired,
  userStatus: PropTypes.object,
  userDetailPayload: PropTypes.object,
  screenProps: PropTypes.object.isRequired,
  userPayload: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  channelUserPayload: PropTypes.array,
  selectedChannelItemIndex: PropTypes.number,
};
const mapStateToProps = (state) => ({
  fetching: state.logOut.fetching,
  sideMenuItems: setSideMenuItems(state),
  userPayload: getUserDetail(state),
  channelsPayload: getChannelsName(state),
  userDetailPayload: state.getUserDetail.userDetailPayload,
  channelItems: state.displayChannelItemsReducer.channelItems,
  selectedChannelItemIndex:
    state.selectedChannelItemIndexReducer.selectedChannelItemIndex,
  channelMessages: state.channelMessage.channelMessages,
  socketNotification: state.socketNotification.notification,
  currentChannelData: state.channelMessage.currentChannelData,
  channelUserPayload: getChannelsName(state),
  askGraduateVariables: setAskGraduateVariables(state),
  getAskGraduateDetailsPayload:
    state.askGraduateCardReducer.getAskGraduateDetailsPayload,
  networkState: state.checkNetwork.isConnected,
  userStatus: userDetails(state),
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
  connectionOfSocket: state.menteeMentorReducer.connectionOfSocket,
});

export default connect(mapStateToProps)(SideMenu);
