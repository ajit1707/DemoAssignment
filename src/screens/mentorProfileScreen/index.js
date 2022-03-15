import React, {Component} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import Style from './style';
import {connect} from 'react-redux';
import Config from '../../utility/config';
import {Container} from '../../components';
import {chatBot, mentorProfile} from '../../modules/typeformMentee';
import {getChannels} from '../../modules/getChannels';
import {getProfileDetail} from '../../modules/profile';

class MentorProfileScreen extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getProfileDetail());
    dispatch(getChannels()).then(() => dispatch(mentorProfile()));
  }
  render() {
    const {fetching, channelsPayload, myMentorPayload} = this.props;
    let image = '';
    let bio = '';
    let data = '';
    let name = '';
    if (
      !fetching &&
      channelsPayload &&
      channelsPayload.hasOwnProperty('included')
    ) {
      const mentoringChannel = channelsPayload.data.filter(
        (item) =>
          item.type === 'channels' &&
          item.attributes.channel_type === 'mentoring',
      );
      if (mentoringChannel && mentoringChannel.length) {
        data = channelsPayload.included.filter(
          (item) =>
            item.type === 'channel_users' &&
            item.attributes.role === 'mentor' &&
            String(item.attributes.channel_id) === mentoringChannel[0].id,
        );
      }
      if (data && data.length) {
        if (data[0].attributes.avatar_id.includes('brightside-assets')) {
          image = `${Config.IMAGE_SERVER_CDN}resize/500x500/${data[0].attributes.avatar_id}`;
          name = data[0].attributes.display_name;
        } else {
          image = data[0].attributes.avatar_id;
          name = data[0].attributes.display_name;
        }
      }
      if (myMentorPayload && myMentorPayload.included.length) {
        const mentorProfile = myMentorPayload.included.filter(
          (item) => item.type === 'users',
        );
        if (mentorProfile.length > 0) {
          bio = mentorProfile[0].attributes.approved_bio;
        }
      }
    }
    return (
      <Container style={Style.mainContainer} fetching={fetching}>
        <ScrollView>
          <View style={{marginTop: 5}}>
            <Text style={Style.sectionTitle}>Profile Picture</Text>
          </View>
          <View style={[Style.imageContainer]} accessible={false}>
            <View
              accessible
              accessibilityLabel={`Profile picture of ${name}`}
              accessibilityRole="image"
              style={Style.imageButton}>
              <Image style={Style.profileImage} source={{uri: image}} />
            </View>
          </View>
          <View style={Style.bottomBorder} />
          <View style={{marginTop: 15}}>
            <Text style={Style.sectionTitle}>Biography</Text>
            <Text style={Style.biography}>{bio}</Text>
          </View>
        </ScrollView>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  matchingPayload: state.typeformMenteeDataReducer.matchingPayload,
  matchingMentorPayload: state.typeformMenteeDataReducer.matchingMentorPayload,
  fetching:
    state.typeformMenteeDataReducer.fetching || state.getchannels.fetching,
  channelsPayload: state.getchannels.channelsPayload,
  myMentorPayload: state.typeformMenteeDataReducer.myMentorPayload,
  profileDetailPayload: state.profile.profileDetailPayload,
});

export default connect(mapStateToProps)(MentorProfileScreen);
