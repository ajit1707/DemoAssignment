import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {fontMaker} from '../../utility/helper';
import Config from '../../utility/config';
import Icon from './../../utility/icons';
import Constant from '../../utility/constant';
import moment from 'moment';
import NextBadge from '../messageScreen/nextBadge';
import EarnedModal from '../../components/earnedModal';
import {
  channelDeselected,
  resetSelectedChannelItemIndex,
} from '../../modules/displayChannelItems';
import {clearChannelMessages} from '../../modules/channelMessage';
import {availableBatch, messageStreak} from '../../modules/achievement';
import CongraluationBadge from './congraluationsBadge';
import {checkData} from '../../modules/chosseAsMentor';

const imageHeight = 40;
const imageWidth = 40;
const borderWidth = 0.7;
const borderRadius = 20;
const imageHeightMentor = 120;
const imageWidthMentor = 120;
const buttonBorderRadiusMentor = 60;

class BadgeItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableLazyLoading: false,
      paginationSpinner: false,
      refreshing: false,
      modalVisible: false,
      titleOfBadge: '',
      image: '',
      descriptionOfBadge: '',
      percentageOfBadge: '',
      totalNumber: '',
      progressBar: '',
    };
  }
  navigateToAchivmentScreen = () => {
    const {
      navigation: {navigate},
      dispatch,
      screenProps: {emitter},
      userDetailPayload,
      isConnected,
    } = this.props;
    const projectUserId = userDetailPayload.data[0].id;
    const project_user_id = userDetailPayload.data[0].id;
    const project_id = userDetailPayload.data[0].attributes.project_id;
    const payload = {
      data: {
        attributes: {
          project_user_id,
          project_id,
        },
        type: 'message_streaks',
      },
    };
    dispatch(resetSelectedChannelItemIndex());
    dispatch(clearChannelMessages());
    dispatch(channelDeselected());
    emitter.emit('setSideMenuItemIndex', 4);
    if (isConnected === true) {
      dispatch(checkData(true));
      dispatch(messageStreak(payload)).then(() => {
        dispatch(availableBatch(projectUserId)).then(() =>
          navigate('achievement'),
        );
      });
    } else {
      dispatch(checkData(false));
      navigate('achievement');
    }
  };
  batchName = (batchId, item) => {
    const {earnedBatchDataPayload, badgePayload} = this.props;
    if (badgePayload && badgePayload.data && badgePayload.data.length) {
      for (let i = 0; i < badgePayload.data.length; i += 1) {
        if (batchId == badgePayload.data[i].id) {
          return badgePayload.data[i].attributes.content.channel_title;
        }
      }
    }
  };
  achievementClause = (batchId, item) => {
    const {earnedBatchDataPayload, badgePayload} = this.props;
    if (badgePayload && badgePayload.data && badgePayload.data.length) {
      for (let i = 0; i < badgePayload.data.length; i += 1) {
        if (batchId == badgePayload.data[i].id) {
          return badgePayload.data[
            i
          ].attributes.content.achievement_introduction.replace(/\s+$/, '');
        }
      }
    }
  };
  achievementIntroduction = (batchId, item) => {
    const {earnedBatchDataPayload, badgePayload} = this.props;
    if (badgePayload && badgePayload.data && badgePayload.data.length) {
      for (let i = 0; i < badgePayload.data.length; i += 1) {
        if (batchId == badgePayload.data[i].id) {
          return badgePayload.data[i].attributes.content.next_badge.replace(
            /\s+$/,
            '',
          );
        }
      }
    }
  };
  archieved = (batchId, item) => {
    const {earnedBatchDataPayload, badgePayload} = this.props;
    if (badgePayload && badgePayload.data && badgePayload.data.length) {
      for (let i = 0; i < badgePayload.data.length; i += 1) {
        if (batchId == badgePayload.data[i].id) {
          return badgePayload.data[i].attributes.content.achievement_clause;
        }
      }
    }
  };
  batchModalPress = (
    badgeImage,
    newBatchId,
    badgePayload,
    earnedBatchDataPayload,
  ) => {
    const {userDetailPayload} = this.props;
    let title = '';
    let percentage = '';
    let description = '';
    let progressBarPercentage = '';
    let totalNumberBadgesEarned = '';
    if (
      earnedBatchDataPayload &&
      earnedBatchDataPayload.data &&
      earnedBatchDataPayload.data.length
    ) {
      totalNumberBadgesEarned = earnedBatchDataPayload.data.length;
      progressBarPercentage = totalNumberBadgesEarned * 10;
      for (let i = 0; i < earnedBatchDataPayload.data.length; i += 1) {
        if (newBatchId == earnedBatchDataPayload.data[i].id) {
          title = earnedBatchDataPayload.data[i].attributes.title;
          percentage =
            earnedBatchDataPayload.data[i].attributes.earned_percentage;
          description = moment(earnedBatchDataPayload.data[i].date).format(
            'MMMM D, YYYY',
          );
        }
      }
    }
    const {modalVisible} = this.state;
    if (userDetailPayload.included[1].attributes.name === 'mentee') {
      this.setState({
        modalVisible: !modalVisible,
        titleOfBadge: title,
        image: badgeImage,
        descriptionOfBadge: description,
        percentageOfBadge: percentage,
        totalNumber: totalNumberBadgesEarned,
        progressBar: progressBarPercentage,
      });
    }
  };
  render() {
    const {
      item,
      badgePayload,
      earnedBatchDataPayload,
      currentChannelData,
      userDetailPayload,
      sideMenuItems,
    } = this.props;
    const {
      paginationSpinner,
      refreshing,
      modalVisible,
      titleOfBadge,
      image,
      descriptionOfBadge,
      percentageOfBadge,
      totalNumber,
      progressBar,
    } = this.state;
    let batchId = '';
    let newBatchId = '';
    const messageForRegex = item.body;
    batchId = messageForRegex.replace(/^\D+/g, '');
    let badgeImage = '';
    let nextBadgeImage = '';
    if (batchId === '1') {
      badgeImage = Icon.SIGN_UP_SUCCESS;
      newBatchId = 1;
      nextBadgeImage = Icon.PICTURE_PERFECT;
    } else if (batchId === '2') {
      badgeImage = Icon.PICTURE_PERFECT;
      newBatchId = 2;
      nextBadgeImage = Icon.MAKING_AN_INTRODUCTION;
    } else if (batchId === '3') {
      badgeImage = Icon.MAKING_AN_INTRODUCTION;
      newBatchId = 3;
      nextBadgeImage = Icon.THREE_IS_A_MAGIC_NUMBER;
    } else if (batchId === '4') {
      badgeImage = Icon.THREE_IS_A_MAGIC_NUMBER;
      newBatchId = 4;
      nextBadgeImage = Icon.HIGH_FIVE;
    } else if (batchId === '5') {
      badgeImage = Icon.HIGH_FIVE;
      newBatchId = 5;
      nextBadgeImage = Icon.CLIP_AND_SEND;
    } else if (batchId === '6') {
      badgeImage = Icon.CLIP_AND_SEND;
      newBatchId = 6;
      nextBadgeImage = Icon.TIP_TOP_TEN;
    } else if (batchId === '7') {
      badgeImage = Icon.TIP_TOP_TEN;
      newBatchId = 7;
      nextBadgeImage = Icon.I_LIKE_IT;
    } else if (batchId === '8') {
      badgeImage = Icon.I_LIKE_IT;
      newBatchId = 8;
      nextBadgeImage = Icon.TREMENDOUS_TWENTY;
    } else if (batchId === '9') {
      badgeImage = Icon.TREMENDOUS_TWENTY;
      newBatchId = 9;
      nextBadgeImage = Icon.MISSION_ACCOMPLISHED;
    } else if (batchId === '10') {
      badgeImage = Icon.MISSION_ACCOMPLISHED;
      newBatchId = 10;
      nextBadgeImage = Icon.MISSION_ACCOMPLISHED;
    }
    return (
      <View>
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
              <TouchableOpacity
                accessible={false}
                style={Styles.messageBubble}
                onPress={() =>
                  this.batchModalPress(
                    badgeImage,
                    newBatchId,
                    badgePayload,
                    earnedBatchDataPayload,
                  )
                }>
                <View style={Styles.titleView}>
                  <Text style={Styles.boldTextTitle}>
                    {this.batchName(batchId, item)}
                  </Text>
                </View>
                <View style={Styles.iconComponent} accessible={false}>
                  <View
                    style={[Styles.leftImageContainer]}
                    accessible
                    accessibilityLabel={`${this.batchName(
                      batchId,
                      item,
                    )} badge`}
                    accessibilityRole="image">
                    <Image style={Styles.profileImage} source={badgeImage} />
                  </View>
                  <View style={Styles.rightContainer} accessible={false}>
                    <View style={Styles.rightTopContainer}>
                      <Text style={Styles.messageOfCongratulations}>
                        {this.achievementClause(batchId, item)}
                      </Text>
                      <Text style={Styles.acheieved}>
                        {this.archieved(batchId, item)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {userDetailPayload.included[1].attributes.name === 'mentor' && (
            <View style={Styles.awardedView}>
              <Text style={Styles.awardedText}>
                Awarded to {currentChannelData.channelName} on{' '}
                {moment(item.inserted_at).format('D MMMM, YYYY')}
              </Text>
            </View>
          )}
          <View />
        </View>
        <NextBadge
          batchModalPress={this.batchModalPress}
          titleOfBadge={titleOfBadge}
          image={image}
          descriptionOfBadge={descriptionOfBadge}
          percentageOfBadge={percentageOfBadge}
          modalVisible={modalVisible}
          totalNumber={totalNumber}
          progressBar={progressBar}
        />
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: '#002b39',
  },
  titleView: {
    paddingLeft: 9,
  },
  awardedText: {
    ...fontMaker('semibold'),
    color: '#e28834',
  },
  awardedView: {
    paddingLeft: 70,
  },
  rightContainer: {
    width: '75%',
    paddingLeft: 18,
    // paddingTop: 3,
    // paddingBottom: 2,
    // marginRight: 7,
    alignContent: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  rightTopContainer: {
    // flexDirection: 'row',
  },
  boldTextTitle: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('bold'),
    paddingTop: 5,
    paddingBottom: 4,
  },
  nextbadgeTitle: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('bold'),
    paddingTop: 5,
    paddingBottom: 4,
  },
  nextbadgeTitleView: {
    color: '#000',
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 4,
  },
  rightMiddleContainer: {
    marginTop: 1,
    width: '95%',
  },
  boldDateTitle: {
    color: '#666666',
  },
  leftImageContainer: {
    width: '25%',
    paddingHorizontal: 1,
    paddingTop: 4,
    // paddingBottom: 2,
    marginLeft: 3,
    alignContent: 'flex-start',
  },
  badgeTitleContainer: {
    width: '25%',
    paddingHorizontal: 1,
    paddingTop: 7,
    // paddingBottom: 2,
    marginLeft: 3,
    // alignContent: 'flex-start'
  },
  bottomContainer: {
    width: '100%',
    paddingLeft: 4,
    // paddingRight : 5,
    // paddingVertical: 5,
    marginLeft: 3,
    marginRight: 8,
    alignContent: 'flex-start',
  },
  acheieved: {
    // paddingTop : 20,
    color: 'black',
    paddingRight: 6,
    // ...fontMaker('semibold'),
  },
  messageOfCongratulations: {
    color: 'black',
    paddingBottom: 5,
    fontSize: 15,
    paddingTop: 5, // OPTONAL
    paddingRight: 6,
  },
  messageOfNext: {
    color: 'black',
    paddingBottom: 8,
    fontSize: 15,
    paddingRight: 6,
  },
  profileImage: {
    height: 70,
    width: 70,
    // borderRadius: imageBorderRadius,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    fontSize: 16,
  },
  messageBubbleFornextBadge: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '28%' : '33%',
  },
  messageBubbleiceBreaker: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '8%' : '13%',
  },
  messageBubbleForHighFive: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '20%' : '25%',
  },
  messageBubbleForMagicNumber: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '30%' : '35%',
  },
  messageBubbleForTopTen: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '33%' : '38%',
  },
  messageBubbleClipAndSend: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '32%' : '37%',
  },
  messageBubbleForTwenty: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '7%' : '11%',
  },
  messageBubbleForliftOff: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '18%' : '23%',
  },
  messageBubbleForPicturePerfect: {
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#e28834',
    borderWidth: 3,
    color: '#000',
    padding: '1%',
    marginTop: '1%',
    marginBottom: '3%',
    marginLeft: '18%',
    marginRight: Platform.OS === 'android' ? '25%' : '30%',
  },
  iconComponent: {
    flexDirection: 'row',
  },
  messageContainer: {
    // marginLeft: 18,
  },
  brightSide: {
    flexDirection: 'row',
    paddingLeft: 12,
  },
  brightsideTitle: {
    color: '#000',
    fontSize: 16,
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

export default BadgeItemScreen;
