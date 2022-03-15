import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import Style from './style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import PropType from 'prop-types';
import PropTypes from 'prop-types';
import moment from 'moment';

class MenteeAssignment extends Component {
  constructor() {
    super();
    this.state = {
      displaySpinner: false,
    };
  }
  render() {
    const {
      item: {
        attributes: {
          attachment_content_type,
          attachment_filename,
          attachment_id,
          attachment_size,
          created_at,
          project_id,
        },
        relationships: {
          project,
          project_user: {
            data: {id, type},
          },
        },
      },
      downloadForAndroid,
      downloadForIOS,
      getAssignmentPayload,
      userDetailPayload,
    } = this.props;
    const matchId = getAssignmentPayload.included.find(
      (matchUser) => matchUser.id === id && matchUser.type === 'project_users',
    );
    const userID = matchId.attributes.user_id;
    const menteeID = getAssignmentPayload.included.find(
      (user) => user.id === userID.toString() && user.type === 'users',
    );
    const menteeName = menteeID.attributes.full_name;
    const date = moment(created_at).format('MMMM D, YYYY');
    return (
      <View style={{flex: 1}} accessible={false}>
        <View style={[Style.container, Style.shadow]} accessible={false}>
          <View style={[Style.leftImageContainer]} accessible={false}>
            {attachment_content_type === 'image/jpeg' ||
            attachment_content_type === 'image/jpg' ||
            attachment_content_type === 'image/png' ||
            attachment_content_type === 'image/gif' ? (
              <FontAwesome
                name="file-image-o"
                size={60}
                accessibilityLabel="Image file"
                accessible
              />
            ) : attachment_content_type === 'application/pdf' ? (
              <FontAwesome
                name="file-pdf-o"
                size={60}
                accessibilityLabel="Pdf file"
                accessible
              />
            ) : attachment_content_type === 'application/zip' ? (
              <FontAwesome
                name="file-archive-o"
                size={60}
                accessibilityLabel="Zip file"
                accessible
              />
            ) : attachment_content_type === 'application/msword' ||
              attachment_content_type === 'text/plain; charset=utf-8' ? (
              <FontAwesome
                name="file-word-o"
                size={60}
                accessibilityLabel="Doc file"
                accessible
              />
            ) : attachment_content_type === 'video/mp4' ||
              attachment_content_type === 'video/quicktime' ? (
              <FontAwesome
                name="file-video-o"
                size={60}
                accessibilityLabel="Video file"
                accessible
              />
            ) : (
              <FontAwesome
                name="file-o"
                size={60}
                accessibilityLabel="Other files"
                accessible
              />
            )}
          </View>
          <View style={Style.rightContainer}>
            <View
              style={Style.rightTopContainer}
              accessible
              accessibilityLabel={attachment_filename}
              accessibilityRole="text">
              <Text style={Style.boldTextTitle} numberOfLines={1}>
                {attachment_filename}
              </Text>
            </View>
            <View
              style={Style.rightMiddleContainer}
              accessible
              accessibilityLabel={date}
              accessibilityRole="text">
              <Text style={Style.boldDateTitle}>{date}</Text>
            </View>
            {userDetailPayload.included[1].attributes.name === 'mentor' ||
            userDetailPayload.included[1].attributes.name === 'coordinator' ||
            userDetailPayload.included[0].attributes.super_admin ? (
              <View
                style={Style.rightBottomContainer}
                accessible
                accessibilityLabel={`By ${menteeName}`}
                accessibilityRole="text">
                <Text style={Style.boldmenteeTitle} numberOfLines={1}>
                  By: {menteeName}
                </Text>
              </View>
            ) : null}
          </View>
          <TouchableOpacity
            accessibilityLabel="Download Assignment"
            accessibilityRole="button"
            accessible
            activeOpacity={0.7}
            style={Style.downloadContainer}
            onPress={
              Platform.OS === 'android'
                ? () => downloadForAndroid(this.props.item)
                : () => downloadForIOS(this.props.item)
            }>
            <AntDesign name="clouddownload" size={30} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
MenteeAssignment.defaultProps = {
  displaySpinner: false,
};
MenteeAssignment.propTypes = {
  item: PropTypes.object.isRequired,
  showActionSheet: PropType.func.isRequired,
  displaySpinner: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  getAssignmentPayload: state.getAssignmentDataReducer.getAssignmentPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
});

export default connect(mapStateToProps)(MenteeAssignment);
