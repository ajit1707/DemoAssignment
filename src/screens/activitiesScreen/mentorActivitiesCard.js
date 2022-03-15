import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {fontMaker, formatDate} from '../../utility/helper';
import {setSideMenuItems} from '../../modules/getProjects';
import Config from '../../utility/config';
import Icons from '../../utility/icons';

const deviceWidth = Dimensions.get('window').width;

class MentorActivitiesCard extends PureComponent {
  render() {
    const {
      item: {
        attributes: {title},
        id,
      },
      userData,
      projectUserMentorActivityPayload,
      navigateToQuestionScreen,
      projectUserData,
    } = this.props;
    const activityId = projectUserMentorActivityPayload[parseInt(id, 10)].id;
    const projectUserId =
      projectUserMentorActivityPayload[parseInt(id, 10)].project_user_id;
    const userId = projectUserData[projectUserId].user_id;
    const userPayload = userData[userId];
    const {first_name, last_name, avatar_id} = userPayload;
    const completedAtDate =
      projectUserMentorActivityPayload[parseInt(id, 10)].completed_at;
    const completedAt = formatDate(completedAtDate, 'LL');
    return (
      <TouchableOpacity
        style={styles.container}
        accessible={false}
        activeOpacity={0.6}
        onPress={() =>
          navigateToQuestionScreen(parseInt(id, 10), true, activityId)
        }>
        <View style={styles.touchableCard} accessible={false}>
          <View
            style={styles.circleImageContainer}
            accessible
            accessibilityLabel={`Profile picture of ${first_name}`}
            accessibilityRole="image">
            <Image
              source={
                avatar_id
                  ? {
                      uri: avatar_id.includes('brightside-assets')
                        ? `${Config.IMAGE_SERVER_CDN}${avatar_id}`
                        : avatar_id,
                    }
                  : Icons.NO_EXPERT
              }
              style={styles.circleImage}
            />
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.activityTextPureComponent} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.viewStyle}>
            <Text style={styles.nameTextPureComponent} numberOfLines={1}>
              {`By: ${first_name} ${last_name.charAt(0)}`}
            </Text>
          </View>
          <Text style={styles.dateTextPureComponent}>{completedAt}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => ({
  activitiesMentor: state.mentorActivities.activitiesMentor,
  projectUserMentorActivityPayload:
    state.mentorActivities.projectUserMentorActivityPayload,
  projectUserData: state.mentorActivities.projectUserData,
  userData: state.mentorActivities.userData,
  sideMenuItems: setSideMenuItems(state),
});

MentorActivitiesCard.defaultProps = {
  item: null,
  projectUserMentorActivityPayload: null,
  userData: null,
  projectUserData: null,
  sideMenuItems: null,
};

MentorActivitiesCard.propTypes = {
  item: PropTypes.object,
  projectUserMentorActivityPayload: PropTypes.object,
  projectUserData: PropTypes.object,
  userData: PropTypes.object,
  navigateToQuestionScreen: PropTypes.func.isRequired,
};

const borderWidth = 1;
const borderRadius = deviceWidth * 0.09;
const borderColor = '#0078af';
const circleWidth = deviceWidth * 0.18;
const circleHeight = deviceWidth * 0.18;

const styles = StyleSheet.create({
  container: {
    width: deviceWidth * 0.96,
    backgroundColor: '#fff',
    marginTop: deviceWidth * 0.02,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    height: 100,
    flexDirection: 'row',
    flex: 1,
  },
  viewStyle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  touchableCard: {
    width: '20%',
    alignSelf: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  rightContainer: {
    width: '71%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  activityTextPureComponent: {
    ...fontMaker('bold'),
    fontSize: 18,
  },
  nameTextPureComponent: {
    ...fontMaker('regular'),
    fontSize: 16,
  },
  dateTextPureComponent: {
    ...fontMaker('regular'),
    fontSize: 16,
  },
  circleImageContainer: {
    width: circleWidth,
    height: circleHeight,
    borderRadius,
    borderWidth,
    borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  circleImage: {
    width: circleWidth,
    height: circleHeight,
    borderRadius,
    borderWidth,
    borderColor,
  },
  reviewButton: {
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 5,
    width: '50%',
  },
  reviewText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default connect(mapStateToProps)(MentorActivitiesCard);
