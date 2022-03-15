import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Container} from './index';
import Style from '../screens/landingPageScreen/Styles';
import {fontMaker} from '../utility/helper';
import Constant from '../utility/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSelectedProject} from '../modules/getSelectedProject';
import {getUserDetails} from '../modules/getUserDetail';
import {channelsUser} from '../modules/channelsUser';
import {getChannels} from '../modules/getChannels';
import {getProjects, setSideMenuItems} from '../modules/getProjects';
import {getLandingPageDetails} from '../modules/getLandingPageDetails';
import {
  getAskGraduateDetail,
  getEventAndStoryDetails,
  getTrendingPost,
} from '../modules/landingPage';
import {connect} from 'react-redux';
import {displayChannelItems} from '../modules/displayChannelItems';

class SurveyPage extends Component {
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
            dispatch(getChannels());
            dispatch(channelsUser()).then(() => {
              dispatch(displayChannelItems(channelItems));
            });
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
            dispatch(getChannels());
            dispatch(channelsUser()).then(() => {
              dispatch(displayChannelItems(channelItems));
            });
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
              dispatch(channelsUser());
              dispatch(getChannels());
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
              dispatch(channelsUser());
              dispatch(getChannels());
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
  render() {
    const {userDetailPayload, navigate, sideMenuItems, fetching} = this.props;
    const surveyUrl = userDetailPayload.data[0].attributes.survey_link;
    return (
      <Container fetching={fetching}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View style={Style.container}>
            <Text style={styles.headerText}>
              {Constant.SURVEY_PAGE_TEXTS.HEADER_TEXT}
            </Text>
            <Text style={styles.bodyText}>
              {Constant.SURVEY_PAGE_TEXTS.BODY_TEXT}
            </Text>
            <View style={{alignSelf: 'center'}}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {borderColor: sideMenuItems.sideMenuColor},
                ]}
                accessible
                accessibilityLabel="Open Survey"
                accessibilityRole="button"
                onPress={() =>
                  navigate('PolicyScreen', {surveyUrl, screenKey: 'survey'})
                }>
                <Text
                  style={[
                    styles.buttonText,
                    {color: sideMenuItems.sideMenuColor},
                  ]}>
                  Open Survey
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>
              {Constant.SURVEY_PAGE_TEXTS.FOOTER_TEXT}
            </Text>
          </View>
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  headerText: {
    color: '#002b39',
    ...fontMaker('bold'),
    fontSize: 22,
    textAlign: 'center',
  },
  surveyView: {
    alignSelf: 'center',
  },
  bodyText: {
    color: '#666666',
    ...fontMaker('italic'),
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    marginBottom: 30,
  },
  footerText: {
    color: '#666666',
    textAlign: 'center',
    marginVertical: 30,
    ...fontMaker('italic'),
    fontSize: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 50,
    borderRadius: 3,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 14,
    alignSelf: 'center',
    ...fontMaker('bold'),
  },
});

SurveyPage.defaultProps = {
  sideMenuItems: null,
  userDetailPayload: null,
};

SurveyPage.propTypes = {
  sideMenuItems: PropTypes.object,
  userDetailPayload: PropTypes.object,
  navigate: PropTypes.func,
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
  channelItems: state.displayChannelItemsReducer.channelItems,
  sideMenuItems: setSideMenuItems(state),
});
export default connect(mapStateToProps)(SurveyPage);
