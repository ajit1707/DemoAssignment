import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import moment from 'moment';
import Style from './Styles';
import {Container} from '../../components';
import {getProjects, setSideMenuItems} from '../../modules/getProjects';
import LandingPageCard from './LandingPageCard';
import Icon from '../../utility/icons';
import {
  getAskGraduateDetail,
  getTrendingPost,
  setAskGraduateVariables,
  setTrendingPostVariables,
  getEventAndStoryDetails,
  setStoryEventVariables,
} from '../../modules/landingPage';
import Constant from '../../utility/constant';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {getUserDetails} from '../../modules/getUserDetail';
import {
  clearPayload,
  getAllTopics,
  getThreads,
  getTopics,
} from '../../modules/communityScreen';
import {channelsUser} from '../../modules/channelsUser';
import {getChannels} from '../../modules/getChannels';
import {displayChannelItems} from '../../modules/displayChannelItems';
import Toast from 'react-native-simple-toast';

class ConnectionLandingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      updating: true,
    };
  }
  componentDidMount() {
    const {
      dispatch,
      screenProps: {emitter},
    } = this.props;
    this.getConnectionLandingPageData();
    if (
      ((this.props.projectSessionPayload &&
        this.props.projectSessionPayload.data[0].attributes.typeform_enabled) ||
        (this.props.selectedProjectPayload &&
          this.props.selectedProjectPayload.data.attributes
            .typeform_enabled)) &&
      ((this.props.projectSessionPayload &&
        this.props.projectSessionPayload.data[0].attributes.matching_enabled ===
          false) ||
        (this.props.selectedProjectPayload &&
          this.props.selectedProjectPayload.data.attributes.matching_enabled ===
            false)) &&
      this.props.userDetailPayload.data[0].attributes.state === 'unmatched' &&
      this.props.userDetailPayload.included[1].attributes.name === 'mentee'
    ) {
      Toast.showWithGravity(
        'Mentor Matching Tool - needs a top-up!\n' +
          "All the mentors on this project have already been snapped up! We'll allocate more amazing mentors very soon and notify you when you can try again!",
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  }

  onRefresh = async () => {
    const {dispatch, channelItems} = this.props;
    const projectSwitcherSelectedData = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
      () => {},
    );
    const parsedProjectData = JSON.parse(projectSwitcherSelectedData);
    if (parsedProjectData) {
      dispatch(getSelectedProject())
        .then(() => {
          dispatch(getUserDetails());
          dispatch(getChannels());
          dispatch(channelsUser()).then(() => {
            dispatch(displayChannelItems(channelItems));
          });
          this.getConnectionLandingPageData();
        })
        .catch(() => {
          this.setState({
            refreshing: false,
          });
        });
    } else {
      dispatch(getProjects())
        .then(() => {
          dispatch(getUserDetails());
          dispatch(getChannels());
          dispatch(channelsUser()).then(() => {
            dispatch(displayChannelItems(channelItems));
          });
          this.getConnectionLandingPageData();
        })
        .catch(() => {
          this.setState({
            refreshing: false,
          });
        });
    }
  };

  getConnectionLandingPageData = () => {
    const {
      dispatch,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    const projectPayload = projectSessionPayload
      ? projectSessionPayload.data[0].attributes
      : selectedProjectPayload.data.attributes;
    if (projectPayload) {
      if (projectPayload.ask_graduate_enabled) {
        dispatch(getAskGraduateDetail());
      }
      if (projectPayload.community_enabled) {
        dispatch(getTrendingPost());
      }
      dispatch(getEventAndStoryDetails())
        .then(() => {
          this.setState({refreshing: false, updating: false});
        })
        .catch((error) => {
          if (error.data.errors[0].title === 'Forbidden') {
            this.setState({refreshing: false, updating: false});
          }
        });
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

  navigateToScreens = (index) => {
    const {
      navigation: {navigate},
      askGraduateVariables: {expertTitle, expertIsAvailable},
      screenProps: {emitter},
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    if (index === 3) {
      navigate('AskTheGuruScreen', {expertTitle, expertIsAvailable});
    }
    if (index === 4) {
      if (
        this.props.getEventStoryDetailPayload &&
        this.props.getEventStoryDetailPayload.data.length
      ) {
        let {
          getEventStoryDetailPayload: {
            data: [
              {
                attributes: {event_registration_link},
              },
            ],
          },
        } = this.props;
        if (!event_registration_link.match(/^[a-zA-Z]+:\/\//)) {
          event_registration_link = `http://${event_registration_link}`;
        }
        let isProjectArchived = false;
        let archivedMessage = Constant.ARCHIVED_PROJECT;
        if (
          projectSessionPayload &&
          projectSessionPayload.data &&
          projectSessionPayload.data.length &&
          projectSessionPayload.data[0].attributes.is_archived === true
        ) {
          isProjectArchived =
            projectSessionPayload.data[0].attributes.is_archived;
        }
        if (
          selectedProjectPayload &&
          selectedProjectPayload.data &&
          selectedProjectPayload.data.attributes.is_archived === true
        ) {
          isProjectArchived =
            selectedProjectPayload.data.attributes.is_archived;
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
          navigate('PolicyScreen', {
            surveyUrl: event_registration_link,
            screenKey: 'survey',
            title: 'Register Event',
          });
        } else {
          Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
        }
      }
    }
    if (index === 2) {
      const {dispatch} = this.props;
      emitter.emit('setSideMenuItemIndex', null, 'CommunitiesScreen');
      dispatch(clearPayload('clearAll'));
      dispatch(getTopics(1));
      dispatch(getThreads(1));
      dispatch(getAllTopics());
      navigate('CommunitiesScreen');
    }
    // if (index === 5) { navigate('SubmitArticle'); }
  };
  render() {
    const {refreshing, updating} = this.state;
    const {
      askGraduateVariables: {
        askGraduatesEnabled,
        expertTitle,
        expertIsAvailable,
        expertImageURL,
        expertSubtitle,
        expertName,
        expertImageAvailable,
      },
      trendingPostVariables: {trendingEnabled},
      fetching,
      userDetailPayload: {
        included: [
          {
            attributes: {first_name},
          },
        ],
      },
      getTrendingPostPayload,
    } = this.props;
    let storyEventVariables;
    if (
      this.props.getEventStoryDetailPayload &&
      this.props.getEventStoryDetailPayload.data
    ) {
      storyEventVariables = this.props.getEventStoryDetailPayload.data[0]
        .attributes;
    }
    let url = '';
    if (
      this.props.getEventStoryDetailPayload &&
      this.props.getEventStoryDetailPayload.data &&
      this.props.getEventStoryDetailPayload.data.length &&
      this.props.getEventStoryDetailPayload.data[0].attributes
    ) {
      if (this.props.getEventStoryDetailPayload.data[0].attributes.video_id) {
        if (
          this.props.getEventStoryDetailPayload.data[0].attributes
            .video_type === 'youtube'
        ) {
          url = `https://www.youtube.com/embed/${this.props.getEventStoryDetailPayload.data[0].attributes.video_id}`;
        } else {
          url = `https://player.vimeo.com/video/${this.props.getEventStoryDetailPayload.data[0].attributes.video_id}`;
        }
      }
    }
    let startTime;
    let endTime;
    let formattedStartTime;
    let formattedEndTime;
    let formattedStartDate;
    let eventTitle;
    let eventDescription;
    let replacementText;
    if (storyEventVariables) {
      startTime = moment(storyEventVariables.event_start_time);
      endTime = moment(storyEventVariables.event_end_time);
      formattedStartTime = startTime.format('HH:mm');
      formattedEndTime = endTime.format('HH:mm');
      formattedStartDate = startTime.format('MMM Do YYYY');
      eventTitle = storyEventVariables.event_title;
      eventDescription = storyEventVariables.event_description;
      replacementText = storyEventVariables.replacement_text;
    }

    const dataBlob = [
      storyEventVariables && replacementText
        ? {
            title: storyEventVariables.story_title,
            subtitle: storyEventVariables.story_introduction,
            icon: Icon.PLAY_ICON,
            id: 'user-story',
            // footer: `Watch ${storyEventVariables.story_title} >`,
            videoId: storyEventVariables.video_id,
            videoType: storyEventVariables.video_type,
            picDesc: storyEventVariables.story_description,
            index: 1,
            isCardVisible: true,
          }
        : {isCardVisible: false},
      trendingEnabled
        ? {
            title: "What's trending today",
            subtitle: 'Have your say and contribute to the conversations.',
            icon: Icon.TRENDING_ICON,
            id: 'trending-post',
            footer: 'Post to the community >',
            getTrendingPostPayload,
            index: 2,
            isCardVisible: true,
          }
        : {isCardVisible: false},
      askGraduatesEnabled
        ? expertIsAvailable
          ? {
              expertIsAvailable: true,
              expertImageAvailable,
              id: 'ask-expert',
              title: `Ask the ${expertTitle}`,
              subtitle: expertSubtitle || null,
              icon: Icon.ASK_ICON,
              footer: expertName
                ? `Ask ${expertName} a question >`
                : 'Ask Graduate A Question',
              image: expertImageAvailable
                ? {uri: expertImageURL}
                : Icon.NO_EXPERT,
              index: 3,
              noImageText: 'No image available',
              isCardVisible: true,
            }
          : {
              expertIsAvailable: false,
              expertImageAvailable,
              icon: Icon.ASK_ICON,
              id: 'ask-expert',
              title: `Ask the ${expertTitle}`,
              noExpertText: `No ${expertTitle} available`,
              footer: `Ask ${expertTitle} a question >`,
              index: 3,
              isCardVisible: true,
            }
        : {isCardVisible: false},
      storyEventVariables && replacementText
        ? {
            title: 'Upcoming Events',
            subtitle: 'Add this to your calendar!',
            icon: Icon.UPCOMING_ICON,
            footer: 'Register for event  >',
            eventTitle,
            index: 4,
            id: 'event',
            eventDetail: {
              date: `Date: ${formattedStartDate}`,
              time: `Time: ${formattedStartTime} – ${formattedEndTime}`,
              cost: `Description: ${eventDescription}`,
            },
            isCardVisible: true,
          }
        : {isCardVisible: false},
      {
        title: 'Submit an article',
        subtitle: 'Got something to say, say it here!',
        icon: Icon.SUBMIT_ICON,
        id: 'submit-article',
        footer: 'Submit my article >',
        image: Icon.SUBMIT_ARTICLE,
        index: 5,
        isCardVisible: true,
      },
    ];

    return (
      <Container fetching={!refreshing && fetching}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          contentContainerStyle={{flex: 1}}
          nestedScrollEnabled>
          {!updating && !refreshing && !fetching && (
            <View style={Style.containerConnection}>
              <View style={styles.headerContainer}>
                <Text
                  style={{
                    fontSize: 19,
                    flexWrap: 'wrap',
                    color: '#1E2121',
                    textAlign: 'center',
                    marginHorizontal: 10,
                    marginVertical: 10,
                  }}>
                  {replacementText
                    ? `Hi ${first_name}! ${replacementText}`
                    : `Hi ${first_name}! Welcome to Brightside Connections`}
                </Text>
              </View>

              <FlatList
                data={dataBlob}
                extraData={dataBlob.length}
                bounces={false}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                renderItem={({item}) => (
                  <LandingPageCard
                    item={item}
                    navigateToScreens={this.navigateToScreens}
                    videoUrl={url}
                    navigateToThreadPost={this.navigateToThreadPost}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </ScrollView>
      </Container>
    );
  }
}

ConnectionLandingScreen.defaultProps = {
  projectSessionPayload: null,
  getEventStoryDetailPayload: null,
  getAskGraduateDetailsPayload: null,
  trendingPostVariables: null,
  askGraduateVariables: null,
};

ConnectionLandingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  getAskGraduateDetailsPayload: PropTypes.object,
  fetching: PropTypes.bool.isRequired,
  askGraduateVariables: PropTypes.object,
  trendingPostVariables: PropTypes.object,
  getEventStoryDetailPayload: PropTypes.object,
  userDetailPayload: PropTypes.object.isRequired,
  projectSessionPayload: PropTypes.object,
  selectedProjectPayload: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
  userDetailPayload: state.getUserDetail.userDetailPayload,
  pushNotificationToken: state.pushNotificationReducer.pushNotificationToken,
  getAskGraduateDetailsPayload:
    state.askGraduateCardReducer.getAskGraduateDetailsPayload,
  getTrendingPostPayload: state.getTrendingPostReducer.getTrendingPostPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
  askGraduateVariables: setAskGraduateVariables(state),
  trendingPostVariables: setTrendingPostVariables(state),
  storyEventVariables: setStoryEventVariables(state),
  getEventStoryDetailPayload:
    state.getEventStoryDetailReducer.getEventStoryDetailPayload,
  channelItems: state.displayChannelItemsReducer.channelItems,
  userDetail: state.getUserDetail.userDetailPayload,
  fetching:
    state.getUserDetail.fetching ||
    state.askGraduateCardReducer.fetching ||
    state.getTrendingPostReducer.fetching ||
    state.getEventStoryDetailReducer.fetching,
});

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    width: '98%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 10,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    elevation: 5,
  },
});
export default connect(mapStateToProps)(ConnectionLandingScreen);
