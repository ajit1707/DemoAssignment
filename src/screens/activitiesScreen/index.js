import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Style from './style';
import Container from '../../components/Container';
import {
  getMenteeActivities,
  getProjectUserActivities,
  postStartActivity,
  resetFetchedMenteeData,
} from '../../modules/activitiesMentee';
import {profileNavigationOptions} from '../../navigators/Root';
import CommonStyle from '../../styles/commonStyle';
import {errorHandler} from '../../modules/errorHandler';
import RenderMenteeUI from './renderMenteeUI';
import RenderMentorUI from './renderMentorUI';
import ActivitiesCard from './activitiesCard';
import {getUserDetails, userDetails} from '../../modules/getUserDetail';
import MentorActivitiesCard from './mentorActivitiesCard';
import {getProjectUserActivitiesMentor} from '../../modules/activitiesMentor';
import Toast from 'react-native-simple-toast';
import {getProjects} from '../../modules/getProjects';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {PaginationSpinner} from '../../components';

class ActivitiesScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...profileNavigationOptions({navigation, screenProps}, 'Mentee Activities'),
  });

  constructor(props) {
    super(props);
    this.state = {
      paginationSpinner: false,
      refreshing: false,
    };
  }

  onEndReached = () => {
    const {paginationSpinner, refreshing} = this.state;
    const {recordCount, menteeDataPageNumber, dispatch} = this.props;
    if (!paginationSpinner && !refreshing) {
      if ((menteeDataPageNumber - 1) * 10 < recordCount) {
        this.setState(
          {
            paginationSpinner: true,
          },
          () => {
            dispatch(getMenteeActivities(menteeDataPageNumber))
              .then(() => {
                dispatch(getProjectUserActivities()).then(() => {
                  this.setState({paginationSpinner: false});
                });
              })
              .catch((err) => {
                dispatch(errorHandler(err));
                this.setState({paginationSpinner: false});
              });
          },
        );
      }
    }
  };
  onEndReachedForMentor = () => {
    const {paginationSpinner, refreshing} = this.state;
    const {mentorRecordCount, mentorDataPageNumber, dispatch} = this.props;
    if (!paginationSpinner && !refreshing) {
      if ((mentorDataPageNumber - 1) * 10 < mentorRecordCount) {
        this.setState(
          {
            paginationSpinner: true,
          },
          () =>
            dispatch(getProjectUserActivitiesMentor(mentorDataPageNumber))
              .then(() => {
                this.setState({paginationSpinner: false});
              })
              .catch((err) => {
                dispatch(errorHandler(err));
                this.setState({paginationSpinner: false});
              }),
        );
      }
    }
  };

  onRefresh = () => {
    const {
      dispatch,
      userDetails: {role},
    } = this.props;
    this.setState({refreshing: true}, () => {
      dispatch(getProjects());
      dispatch(getSelectedProject());
      dispatch(getUserDetails());
      if (role === 'mentee') {
        dispatch(getMenteeActivities(1))
          .then(() => {
            dispatch(getProjectUserActivities()).then(() => {
              this.setState({refreshing: false});
            });
          })
          .catch((err) => {
            dispatch(errorHandler(err));
            this.setState({refreshing: false});
          });
      } else {
        dispatch(getProjectUserActivitiesMentor(1))
          .then(() => {
            this.setState({refreshing: false});
          })
          .catch((err) => {
            dispatch(errorHandler(err));
            this.setState({refreshing: false});
          });
      }
    });
  };
  archivedCheck = (id, archived, buttonText, archivedMessage) => {
    if (archived === true && buttonText === 'See answers') {
      this.navigateToQuestionScreen(id);
    } else if (archived === false) {
      this.navigateToQuestionScreen(id);
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  navigateToQuestionScreen = async (
    activityId,
    mentorStatus,
    projectUserId,
  ) => {
    const {
      navigation: {navigate},
      dispatch,
      projectUserActivityPayload,
      projectUserMentorActivityPayload,
    } = this.props;
    const userStatus = projectUserActivityPayload
      ? projectUserActivityPayload[activityId]
      : projectUserMentorActivityPayload[activityId];
    dispatch(resetFetchedMenteeData());
    if (mentorStatus) {
      navigate('ActivitiesMentorQuestion', {activityId, projectUserId});
    } else if (!userStatus) {
      dispatch(postStartActivity(activityId)).then(() => {
        navigate('ActivitiesQuestion', {activityId});
      });
    } else {
      navigate('ActivitiesQuestion', {activityId});
    }
  };

  renderItem = (item) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => this.navigate(item)}
      style={[Style.projectButton]}
    />
  );
  renderItemSeparatorComponent = () => <View style={CommonStyle.separator} />;
  render() {
    const {
      fetching,
      userDetails: {role},
    } = this.props;
    const {paginationSpinner, refreshing} = this.state;
    return (
      <Container fetching={fetching && !paginationSpinner && !refreshing}>
        {role === 'mentee' ? (
          <RenderMenteeUI
            navigation={this.props.navigation}
            onRefresh={this.onRefresh}
            onEndReached={this.onEndReached}
            ItemSeparatorComponent={this.renderItemSeparatorComponent}
            navigateToQuestionScreen={this.navigateToQuestionScreen}
            paginationSpinner={paginationSpinner}
            refreshing={refreshing}
            activities={this.props.activities}
          />
        ) : (
          <RenderMentorUI
            navigation={this.props.navigation}
            onRefresh={this.onRefresh}
            ItemSeparatorComponent={this.renderItemSeparatorComponent}
            navigateToQuestionScreen={this.navigateToQuestionScreen}
            onEndReached={this.onEndReachedForMentor}
            paginationSpinner={paginationSpinner}
            refreshing={refreshing}
          />
        )}
      </Container>
    );
  }

  renderItemSeparatorComponent = () => <View style={CommonStyle.separator} />;

  renderMenteeUI = () => {
    const {
      fetching,
      activities,
      projectUserActivityPayload,
      categories,
      newprojectUserActivityPayload,
    } = this.props;
    const {paginationSpinner, refreshing} = this.state;
    return (
      <View style={[Style.container, Style.viewMarginBottom]}>
        {activities &&
        activities.length > 0 &&
        projectUserActivityPayload &&
        categories ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.renderItemSeparatorComponent}
            data={activities}
            extraData={this.props}
            renderItem={({item, index}) => (
              <ActivitiesCard
                item={item}
                index={index}
                navigateToQuestionScreen={this.navigateToQuestionScreen}
                activityPayload={newprojectUserActivityPayload}
                archivedCheck={this.archivedCheck}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              <PaginationSpinner animating={paginationSpinner} />
            }
          />
        ) : !fetching &&
          !refreshing &&
          (!activities || activities.length === 0) ? (
          <View style={Style.noActivites}>
            <Text style={Style.noActivitesMessage}>
              No Activities Assigned Yet..
            </Text>
            <Text style={Style.message}>
              Assigned activities will be displayed here.
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  renderMentorUI = () => {
    const {
      activitiesMentor,
      fetching,
      projectUserMentorActivityPayload,
    } = this.props;
    const {paginationSpinner, refreshing} = this.state;
    return (
      <View style={[Style.container, Style.mentorBackground]}>
        {activitiesMentor &&
        activitiesMentor.length > 0 &&
        projectUserMentorActivityPayload ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.renderItemSeparatorComponent}
            data={activitiesMentor}
            extraData={this.props}
            renderItem={({item, index}) => (
              <MentorActivitiesCard
                item={item}
                index={index}
                navigateToQuestionScreen={this.navigateToQuestionScreen}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.onEndReachedForMentor}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              <PaginationSpinner animating={paginationSpinner} />
            }
          />
        ) : !fetching && !refreshing && activitiesMentor.length === 0 ? (
          <View style={Style.noActivites}>
            <Text style={Style.noActivitesMessage}>No records found</Text>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    const {
      fetching,
      userDetails: {role},
    } = this.props;
    const {paginationSpinner, refreshing} = this.state;
    return (
      <Container fetching={fetching && !paginationSpinner && !refreshing}>
        {role === 'mentee' ? this.renderMenteeUI() : this.renderMentorUI()}
      </Container>
    );
  }
}
ActivitiesScreen.defaultProps = {
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

ActivitiesScreen.propTypes = {
  fetching: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  menteeDataPageNumber: PropTypes.number,
  mentorDataPageNumber: PropTypes.number,
  recordCount: PropTypes.number,
  mentorRecordCount: PropTypes.number,
  categories: PropTypes.object,
  userDetails: PropTypes.object,
  activities: PropTypes.array,
  activitiesMentor: PropTypes.array,
  projectUserActivityPayload: PropTypes.object,
  projectUserMentorActivityPayload: PropTypes.object,
};
const mapStateToProps = (state) => ({
  fetching: state.menteeActivities.fetching || state.mentorActivities.fetching,
  activitiesMentor: state.mentorActivities.activitiesMentor,
  projectUserMentorActivityPayload:
    state.mentorActivities.projectUserMentorActivityPayload,
  userDetails: userDetails(state),
  activities: state.menteeActivities.activities,
  menteeDataPageNumber: state.menteeActivities.menteeDataPageNumber,
  mentorDataPageNumber: state.mentorActivities.mentorDataPageNumber,
  recordCount: state.menteeActivities.recordCount,
  mentorRecordCount: state.mentorActivities.mentorRecordCount,
  categories: state.menteeActivities.categories,
  projectUserActivityPayload: state.menteeActivities.projectUserActivityPayload,
  newprojectUserActivityPayload:
    state.menteeActivities.newprojectUserActivityPayload,
});

export default connect(mapStateToProps)(ActivitiesScreen);
