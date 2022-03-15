import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {fontMaker} from '../../utility/helper';
import Config from '../../utility/config';
import Icon from './../../utility/icons';

const imageHeight = 40;
const imageWidth = 40;
const borderWidth = 0.7;
const borderRadius = 20;
const imageHeightMentor = 120;
const imageWidthMentor = 120;
const buttonBorderRadiusMentor = 60;

class MentorChatBotScreen extends Component {
  render() {
    const {
      channelsPayload,
      mentorPayload,
      goMentorProfile,
      myMentorPayload,
    } = this.props;
    let bio = '';
    let image;
    let data = '';
    let name = '';
    if (channelsPayload && channelsPayload.hasOwnProperty('included')) {
      const mentoringChannel = channelsPayload.data.filter(
        (item) =>
          item.type === 'channels' &&
          item.attributes.channel_type === 'mentoring',
      );
      data = channelsPayload.included.filter(
        (item) =>
          item.type === 'channel_users' &&
          item.attributes.role === 'mentor' &&
          mentoringChannel &&
          mentoringChannel.length &&
          String(item.attributes.channel_id) === mentoringChannel[0].id,
      );
      if (
        myMentorPayload &&
        myMentorPayload.included &&
        myMentorPayload.included.length
      ) {
        const mentorProfile = myMentorPayload.included.filter(
          (item) => item.type === 'users',
        );
        if (mentorProfile.length > 0) {
          bio = mentorProfile[0].attributes.approved_bio;
        }
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
    }
    return (
      <View>
        <View style={Styles.titleContainer}>
          <Text style={Styles.title}>Meet your mentor</Text>
        </View>
        <View style={Styles.mentorProfileContainer}>
          <View
            style={Styles.mentorImage}
            accessible
            accessibilityLabel={`Profile picture of ${name}`}
            accessibilityRole="image">
            <Image style={Styles.img} source={{uri: image}} />
          </View>
          <View>
            <Text style={Styles.biography} numberOfLines={4}>
              {bio}
            </Text>
          </View>
          <TouchableOpacity
            style={Styles.mentorButton}
            onPress={() => goMentorProfile()}>
            <Text style={Styles.mentorProfile}>View Mentor Profile </Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.messageContainer} accessible={false}>
          <View style={Styles.brightSide} accessible={false}>
            <View
              style={Styles.brightSideContainer}
              accessible
              accessibilityLabel="Profile picture of brightside team"
              accessibilityRole="image">
              <Image source={Icon.BRIGHTSIDELOGO} style={Styles.circleImage} />
            </View>
            <View style={Styles.brightSideTitleContainer}>
              <Text style={Styles.brightsideTitle}>Brightside Team</Text>
              <Text style={Styles.messageBubble}>
                Welcome to your mentoring journey! Let{"'"}s get started...
              </Text>
              <Text style={Styles.messageBubble}>
                Here are a few tips to help you to write your first message:
                {'\n'}
                1. Introduce yourself briefly{'\n'}
                2. Say what you{"'"}re interested in{'\n'}
                3. Use an ice-breaker question e.g. what would be your
                superpower and why{'?'}
              </Text>
              <Text style={Styles.messageBubble}>
                Remember to just be yourself
              </Text>
            </View>
          </View>
          <View />
        </View>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: '#002b39',
  },
  messageBubble: {
    backgroundColor: '#d1ecff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    color: '#000',
    padding: '3%',
    marginVertical: '1%',
    fontSize: 16,
  },
  messageContainer: {
    marginHorizontal: 22,
  },
  brightSide: {
    flexDirection: 'row',
  },
  brightsideTitle: {
    color: '#000',
    fontSize: 17,
    ...fontMaker('bold'),
  },
  circleImage: {
    ...Platform.select({
      ios: {
        width: imageWidth,
        height: imageHeight,
      },
      android: {
        width: imageWidth,
        height: imageHeight,
        borderRadius,
        borderWidth,
      },
    }),
  },
  brightSideContainer: {
    width: '15%',
    alignContent: 'flex-start',
  },
  brightSideTitleContainer: {
    width: '75%',
    alignContent: 'flex-start',
    marginTop: '2%',
  },
  mentorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '4%',
  },
  mentorProfile: {
    fontSize: 18,
    color: '#0078af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  biography: {
    marginHorizontal: 22,
    fontSize: 16,
    marginTop: '2%',
    color: '#000',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Platform.OS === 'android' ? '2%' : null,
    marginTop: Platform.OS === 'ios' ? '2%' : null,
    marginBottom: Platform.OS === 'ios' ? '-1%' : null,
  },
  mentorProfileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4%',
    width: '92%',
    borderWidth: 2,
    borderColor: '#002b39',
    borderStyle: 'dotted',
    borderRadius: 1,
    marginLeft: '4%',
    marginTop: Platform.OS === 'ios' ? '3%' : null,
  },
  mentorImage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '3%',
  },
  img: {
    height: imageHeightMentor,
    width: imageWidthMentor,
    borderRadius: buttonBorderRadiusMentor,
    backgroundColor: '#ccc',
  },
});

export default MentorChatBotScreen;
