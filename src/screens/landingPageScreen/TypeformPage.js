import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {Container} from '../../components';
import Icon from '../../utility/icons';
import PropTypes from 'prop-types';
import Constant from '../../utility/constant';
import styles from '../landingPageScreen/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {getUserDetails} from '../../modules/getUserDetail';
import {channelsUser} from '../../modules/channelsUser';
import {getChannels} from '../../modules/getChannels';
import {getProjects, setSideMenuItems} from '../../modules/getProjects';
import {getLandingPageDetails} from '../../modules/getLandingPageDetails';
import {
  getAskGraduateDetail,
  getEventAndStoryDetails,
  getTrendingPost,
} from '../../modules/landingPage';
import {typeformMentorData} from '../../modules/typeformMentor';
import {displayChannelItems} from '../../modules/displayChannelItems';

const DATA = [
  {
    img: Icon.FIRST,
    heading: Constant.ABOUT_YOURSELF,
    headingText: Constant.SHORT_PROFILE,
    id: '1',
  },
  {
    img: Icon.SECOND,
    heading: Constant.COMPLETE_YOUR_PROFILE,
    headingText: Constant.COMPLETE_YOUR_PROFILE_HEADING,
    id: '2',
  },
  {
    img: Icon.THIRD,
    heading: Constant.START_YOUR_JOURNEY,
    headingText: Constant.START_YOUR_JOURNEY_HEADING,
    id: '3',
  },
];
class TypeformScreen extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      updating: true,
    };
  }
  onRefresh = async () => {
    const {
      dispatch,
      sideMenuItems,
      userDetailPayload,
      channelItems,
    } = this.props;
    const projectSwitcherSelectedData = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
      () => {},
    );
    const parsedProjectData = JSON.parse(projectSwitcherSelectedData);
    if (userDetailPayload.data.length && sideMenuItems.isConnectionProject) {
      if (parsedProjectData) {
        dispatch(getSelectedProject())
          .then(() => {
            dispatch(getUserDetails());
            dispatch(channelsUser());
            dispatch(getChannels());
            this.getConnectionLandingPage();
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
            dispatch(channelsUser());
            dispatch(getChannels());
            this.getConnectionLandingPage();
          })
          .catch(() => {
            this.setState({
              refreshing: false,
            });
          });
      }
    } else {
      this.setState({refreshing: true}, () => {
        if (parsedProjectData) {
          dispatch(getSelectedProject())
            .then(() => {
              dispatch(getUserDetails());
              dispatch(getChannels());
              dispatch(channelsUser()).then(() => {
                dispatch(displayChannelItems(channelItems));
              });
              this.getLandingPageData();
              this.setState({refreshing: false});
            })
            .catch(() => {
              this.setState({refreshing: false});
            });
        } else {
          dispatch(getProjects())
            .then(() => {
              dispatch(getUserDetails());
              dispatch(getChannels());
              dispatch(channelsUser()).then(() => {
                dispatch(displayChannelItems(channelItems));
              });
              this.getLandingPageData();
              this.setState({refreshing: false});
            })
            .catch(() => {
              this.setState({refreshing: false});
            });
        }
      });
    }
  };

  getLandingPageData = () => {
    const {dispatch} = this.props;
    dispatch(getLandingPageDetails())
      .then(() => {
        dispatch(getAskGraduateDetail()).then(() => {
          this.setState({
            refreshing: false,
          });
        });
      })
      .catch(() => {
        this.setState({
          refreshing: false,
        });
      });
  };
  getConnectionLandingPage = () => {
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
  navigateToMentorDetails = () => {
    const {
      dispatch,
      navigation: {navigate},
    } = this.props;
    // dispatch(typeformMentorData())
    //     .then(() => {
    navigate('MentorQuestionScreen', {channelData: false});
    // });
  };
  renderItem = (item) => (
    <View style={styles.viewContainer}>
      <View style={styles.card}>
        <View
          accessible
          accessibilityLabel={`${item.heading}`}
          accessibilityRole="image">
          <Image style={styles.img} source={item.img} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.heading}</Text>
          <Text style={styles.textTitle}>{item.headingText}</Text>
        </View>
      </View>
    </View>
  );
  render() {
    const {
      navigation: {navigate},
      fetching,
    } = this.props;
    return (
      <Container style={styles.mainContainer} fetching={fetching}>
        <FlatList
          data={DATA}
          renderItem={({item}) => this.renderItem(item)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          ListFooterComponent={
            <View style={styles.startView}>
              <View>
                <Text style={styles.titleStart}>
                  Complete the questionnaire and start your mentoring journey!{' '}
                </Text>
              </View>
              <View style={styles.buttonComponentStart}>
                <View
                  style={styles.button}
                  accessible
                  accessibilityLabel="Start"
                  accessibilityRole="button">
                  <TouchableOpacity
                    onPress={() => this.navigateToMentorDetails()}
                    accessible={false}>
                    <Text style={styles.buttonText}>Start</Text>
                  </TouchableOpacity>
                </View>
                <View />
              </View>
            </View>
          }
          keyExtractor={(item) => item.id}
        />
      </Container>
    );
  }
}
TypeformScreen.defaultProps = {
  menteeDataPageNumber: 1,
  mentorDataPageNumber: 1,
  recordCount: 0,
  mentorRecordCount: 0,
  activities: null,
  activitiesMentor: null,
  categories: null,
  userDetails: null,
  projectUserActivityPayload: null,
  projectUserMentorActivityPayload: null,
  fetching: false,
};

TypeformScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching:
    state.getUserDetail.fetching ||
    state.askGraduateCardReducer.fetching ||
    state.getTrendingPostReducer.fetching ||
    state.getEventStoryDetailReducer.fetching ||
    state.typeformMentorDataReducer.fetching ||
    state.getLandingPageDetailsReducer.fetching,
  typeformMentorPayload: state.typeformMentorDataReducer.typeformMentorPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
  sideMenuItems: setSideMenuItems(state),
  channelItems: state.displayChannelItemsReducer.channelItems,
});

export default connect(mapStateToProps)(TypeformScreen);
