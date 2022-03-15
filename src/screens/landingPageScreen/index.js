import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {SurveyPage} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import ConnectionLandingPage from './connectionLandingPage';
import LandingPage from './landingPage';
import {pushNotificationService} from '../../modules/pushNotification';
import {BackHandler} from 'react-native';
import {userSign} from '../../modules/userSignIn';
import TypeformScreen from './TypeformPage';
import TypeformMenteeScreen from './TypeformMenteePage';
import {typeformMentorData} from '../../modules/typeformMentor';
import {getProfileDetail, getProjectUser} from '../../modules/profile';
import {
  socketChannelNotification,
  socketConnect,
} from '../../utility/phoenix-utils';
import {errorHandler} from '../../modules/errorHandler';
import {connectionData} from '../../modules/chosseAsMentor';

class LandingScreen extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      screenProps,
      userDetailPayload,
      projectSessionPayload,
      selectedProjectPayload,
      channelItems,
      networkState: {isConnected},
    } = this.props;
    dispatch(connectionData(true));
    dispatch(pushNotificationService(screenProps));
    if (
      userDetailPayload.included[1].attributes.name === 'mentor' &&
      ((projectSessionPayload &&
        projectSessionPayload.data[0].attributes.typeform_enabled) ||
        (selectedProjectPayload &&
          selectedProjectPayload.data.attributes.typeform_enabled))
    ) {
      dispatch(typeformMentorData());
    }
    dispatch(getProfileDetail());
    dispatch(getProjectUser());
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }
  onBack = () => {
    const {userData, dispatch} = this.props;
    if (userData.back === true) {
      dispatch(userSign());
    }
    return false;
  };
  render() {
    const {
      sideMenuItems,
      userDetailPayload,
      navigation: {navigate},
      projectSessionPayload,
      typeformMentorPayload,
      selectedProjectPayload,
      fetching,
      channelUserPayload,
      userDetail,
    } = this.props;
    let isProjectArchived = false;
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
    }
    if (
      userDetailPayload &&
      userDetailPayload.data &&
      userDetailPayload.data.length &&
      userDetailPayload.data[0].attributes.survey_state === 'unstarted' &&
      userDetailPayload.data[0].attributes['has_survey?'] &&
      userDetailPayload.included[1].attributes.name === 'mentee' &&
      isProjectArchived === false
    ) {
      return (
        <SurveyPage
          navigate={navigate}
          userDetailPayload={userDetailPayload}
          sideMenuItems={sideMenuItems}
        />
      );
    } else if (
      ((projectSessionPayload &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes.typeform_enabled) ||
        (selectedProjectPayload &&
          selectedProjectPayload.data.attributes.typeform_enabled)) &&
      userDetailPayload &&
      userDetailPayload.data &&
      userDetailPayload.data.length &&
      userDetailPayload.data[0].attributes.state === 'unmatched' &&
      userDetailPayload.included[1].attributes.name === 'mentee' &&
      ((projectSessionPayload &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes.matching_enabled === true) ||
        (selectedProjectPayload &&
          selectedProjectPayload.data &&
          selectedProjectPayload.data.attributes.matching_enabled === true)) &&
      isProjectArchived === false
    ) {
      return <TypeformMenteeScreen navigation={this.props.navigation} />;
    } else if (
      ((projectSessionPayload &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes.typeform_enabled) ||
        (selectedProjectPayload &&
          selectedProjectPayload.data.attributes.typeform_enabled)) &&
      userDetailPayload &&
      userDetailPayload.data &&
      userDetailPayload.data.length &&
      userDetailPayload.data[0].attributes.state === 'unmatched' &&
      userDetailPayload.included[1].attributes.name === 'mentor' &&
      typeformMentorPayload &&
      typeformMentorPayload.data.attributes.submit_for_review === false &&
      isProjectArchived === false
    ) {
      return <TypeformScreen navigation={this.props.navigation} />;
    } else if (
      userDetailPayload &&
      userDetailPayload.data.length &&
      sideMenuItems.isConnectionProject
    ) {
      return <ConnectionLandingPage {...this.props} />;
    }
    return <LandingPage {...this.props} />;
    // return null;
  }
}

LandingScreen.defaultProps = {
  userDetailPayload: null,
  sideMenuItems: null,
  getAskGraduateDetailsPayload: null,
  askGraduateVariables: null,
  trendingPostVariables: null,
  userData: null,
};

LandingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  userDetailPayload: PropTypes.object,
  sideMenuItems: PropTypes.object,
  userData: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  getAskGraduateDetailsPayload: PropTypes.func,
  fetching: PropTypes.bool.isRequired,
  askGraduateVariables: PropTypes.func,
  trendingPostVariables: PropTypes.func,
  screenProps: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
  userDetailPayload: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
  pushNotificationToken: state.pushNotificationReducer.pushNotificationToken,
  userData: state.userSignInInfoReducer.userData,
  typeformMentorPayload: state.typeformMentorDataReducer.typeformMentorPayload,
  channelUserPayload: state.channelsUser.channelsUserPayload,
  channelItems: state.displayChannelItemsReducer.channelItems,
  networkState: state.checkNetwork.isConnected,
  userDetail: state.getUserDetail.userDetailPayload,
});

export default connect(mapStateToProps)(LandingScreen);
