import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  BackHandler,
} from 'react-native';
import PropTypes from 'prop-types';
import {Container, PaginationSpinner} from '../../components';
import {fontMaker} from '../../utility/helper';
import Icon from '../../utility/icons';
import {messageStreak} from '../../modules/achievement';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const imageHeight = 50;
const imageWidth = 50;
const imageBorderRadius = 120;
const borderRadius = 98;

class MessageStreakTabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    };
  }
  renderItemForTuesday = (item, index) => (
    <View>
      {index === 1 && (
        <View
          style={
            item == '1'
              ? styles.wordColouredstyleForTuesday
              : styles.wordstyleForTuesday
          }
          accessible
          accessibilityLabel={`${
            item == '1'
              ? 'Message sent on Tuesday'
              : 'Message not sent on Tuesday'
          } `}>
          <Text
            accessible={false}
            style={
              item == '1' ? styles.coluredNumber : styles.numberForTuesday
            }>
            T
          </Text>
        </View>
      )}
    </View>
  );
  renderItemForWednesday = (item, index) => (
    <View>
      {index === 2 && (
        <View
          style={
            item == '1'
              ? styles.wordColouredstyleForTuesday
              : styles.wordstyleForTuesday
          }
          accessible
          accessibilityLabel={`${
            item == '1'
              ? 'Message sent on Wednesday'
              : 'Message not sent on Wednesday'
          } `}>
          <Text
            accessible={false}
            style={
              item == '1' ? styles.coluredNumber : styles.numberForTuesday
            }>
            W
          </Text>
        </View>
      )}
    </View>
  );
  renderItemForThursday = (item, index) => (
    <View>
      {index === 3 && (
        <View
          style={
            item == '1'
              ? styles.wordColouredstyleForTuesday
              : styles.wordstyleForTuesday
          }
          accessible
          accessibilityLabel={`${
            item == '1'
              ? 'Message sent on Thursday'
              : 'Message not sent on Thursday'
          } `}>
          <Text
            accessible={false}
            style={
              item == '1' ? styles.coluredNumber : styles.numberForTuesday
            }>
            T
          </Text>
        </View>
      )}
    </View>
  );
  renderItemForFriday = (item, index) => (
    <View>
      {index === 4 && (
        <View
          style={
            item == '1' ? styles.wordColouredstyle : styles.wordstyleForFriday
          }
          accessible
          accessibilityLabel={`${
            item == '1'
              ? 'Message sent on Friday'
              : 'Message not sent on Friday'
          } `}>
          <Text
            accessible={false}
            style={
              item == '1' ? styles.coluredNumber : styles.numberForTuesday
            }>
            F
          </Text>
        </View>
      )}
    </View>
  );
  renderItemForSaturday = (item, index) => (
    <View>
      {index === 5 && (
        <View
          style={
            item == '1'
              ? styles.wordColouredstyleForTuesday
              : styles.wordstyleForTuesday
          }
          accessible
          accessibilityLabel={`${
            item == '1'
              ? 'Message sent on Saturday'
              : 'Message not sent on Saturday'
          } `}>
          <Text
            accessible={false}
            style={
              item == '1' ? styles.coluredNumber : styles.numberForTuesday
            }>
            S
          </Text>
        </View>
      )}
    </View>
  );
  renderItemForSunday = (item, index) => (
    <View>
      {index === 6 && (
        <View
          style={
            item == '1'
              ? styles.wordColouredstyleForTuesday
              : styles.wordstyleForTuesday
          }
          accessible
          accessibilityLabel={`${
            item == '1'
              ? 'Message sent on Sunday'
              : 'Message not sent on Sunday'
          } `}>
          <Text
            accessible={false}
            style={
              item == '1' ? styles.coluredNumber : styles.numberForTuesday
            }>
            S
          </Text>
        </View>
      )}
    </View>
  );
  renderItem = (item, index) => (
    <View style={{flexDirection: 'row'}}>
      {index === 0 && (
        <View
          style={
            item == '1'
              ? styles.wordColouredstyleForMonday
              : styles.wordstyleForMonday
          }
          accessible
          accessibilityLabel={`${
            item == '1'
              ? 'Message sent on Monday'
              : 'Message not sent on Monday'
          } `}>
          <Text
            accessible={false}
            style={item == '1' ? styles.coluredNumber : styles.numberForMonday}>
            M
          </Text>
        </View>
      )}
    </View>
  );
  render() {
    const {fetching, messageStreakPayload} = this.props;
    let runningWeek = '';
    let totalWeek = '';
    if (
      !fetching &&
      messageStreakPayload &&
      messageStreakPayload.data &&
      messageStreakPayload.data.attributes &&
      messageStreakPayload.data.attributes.message_streak
    ) {
      runningWeek =
        messageStreakPayload.data.attributes.message_streak.running_week;
      totalWeek =
        messageStreakPayload.data.attributes.message_streak.total_weeks;
    }
    return (
      <Container
        // fetching={fetching}
        isTabBar
        accessible={false}>
        <View style={styles.container}>
          <ScrollView>
            {messageStreakPayload &&
              messageStreakPayload.data &&
              messageStreakPayload.data.attributes &&
              messageStreakPayload.data.attributes.message_streak && (
                <View style={styles.header}>
                  <Text style={styles.goal}>Awesome!</Text>
                  <Text style={styles.earned}>
                    You've maintained your messaging streak for:
                  </Text>
                  <View style={styles.weeksComponent}>
                    <View style={styles.messageStreak}>
                      <View
                        accessible
                        accessibilityLabel={`${messageStreakPayload.data.attributes.message_streak.streak} Weeks`}>
                        <Image
                          style={styles.profileImage}
                          source={Icon.MESSAGE_STREAK}
                        />
                      </View>
                    </View>
                    <View
                      style={styles.numberComponent}
                      accessible
                      accessibilityLabel={`${messageStreakPayload.data.attributes.message_streak.streak} Weeks`}>
                      <Text style={styles.streak}>
                        {
                          messageStreakPayload.data.attributes.message_streak
                            .streak
                        }
                      </Text>
                      <Text style={styles.week}>Weeks</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', paddingVertical: 10}}>
                    <View>
                      <FlatList
                        data={
                          messageStreakPayload.data.attributes.message_streak
                            .current_week
                        }
                        scrollEnabled={false}
                        renderItem={({item, index}) =>
                          this.renderItem(item, index)
                        }
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                    <View>
                      <FlatList
                        data={
                          messageStreakPayload.data.attributes.message_streak
                            .current_week
                        }
                        scrollEnabled={false}
                        renderItem={({item, index}) =>
                          this.renderItemForTuesday(item, index)
                        }
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                    <View>
                      <FlatList
                        data={
                          messageStreakPayload.data.attributes.message_streak
                            .current_week
                        }
                        scrollEnabled={false}
                        renderItem={({item, index}) =>
                          this.renderItemForWednesday(item, index)
                        }
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                    <View>
                      <FlatList
                        data={
                          messageStreakPayload.data.attributes.message_streak
                            .current_week
                        }
                        scrollEnabled={false}
                        renderItem={({item, index}) =>
                          this.renderItemForThursday(item, index)
                        }
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', paddingVertical: 10}}>
                    <View>
                      <FlatList
                        data={
                          messageStreakPayload.data.attributes.message_streak
                            .current_week
                        }
                        scrollEnabled={false}
                        renderItem={({item, index}) =>
                          this.renderItemForFriday(item, index)
                        }
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                    <View>
                      <FlatList
                        data={
                          messageStreakPayload.data.attributes.message_streak
                            .current_week
                        }
                        scrollEnabled={false}
                        renderItem={({item, index}) =>
                          this.renderItemForSaturday(item, index)
                        }
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                    <View>
                      <FlatList
                        data={
                          messageStreakPayload.data.attributes.message_streak
                            .current_week
                        }
                        scrollEnabled={false}
                        renderItem={({item, index}) =>
                          this.renderItemForSunday(item, index)
                        }
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                  </View>
                  <Text style={styles.earnedWeeks}>
                    You are in Week{' '}
                    {
                      messageStreakPayload.data.attributes.message_streak
                        .running_week
                    }{' '}
                    of{' '}
                    {
                      messageStreakPayload.data.attributes.message_streak
                        .total_weeks
                    }
                  </Text>
                </View>
              )}
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  messageStreak: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberComponent: {
    zIndex: 99,
    marginTop: -150,
    marginBottom: 40,
  },
  weeksComponent: {
    paddingVertical: 5,
  },
  wordstyle: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    borderWidth: 4,
    borderColor: '#e2e7ed',
    marginLeft: deviceWidth * 0.37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordstyleForMonday: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    borderWidth: 4,
    borderColor: '#e2e7ed',
    marginLeft: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  wordColouredstyleForMonday: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    borderWidth: 4,
    borderColor: '#e28834',
    marginLeft: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  wordstyleForTuesday: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    borderWidth: 4,
    borderColor: '#e2e7ed',
    marginLeft: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  wordColouredstyleForTuesday: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    borderWidth: 4,
    borderColor: '#e28834',
    marginLeft: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  wordstyleForFriday: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    borderWidth: 4,
    borderColor: '#e2e7ed',
    marginLeft: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  wordColouredstyle: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    borderWidth: 4,
    borderColor: '#e28834',
    marginLeft: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fourDayscontainer: {
    flexDirection: 'row',
  },
  number: {
    color: '#e2e7ed',
    ...fontMaker('bold'),
    fontSize: 20,
  },
  numberForMonday: {
    color: '#e2e7ed',
    ...fontMaker('bold'),
    fontSize: 20,
  },
  numberForTuesday: {
    color: '#e2e7ed',
    ...fontMaker('bold'),
    fontSize: 20,
  },
  coluredNumber: {
    color: '#e28834',
    ...fontMaker('bold'),
    fontSize: 20,
  },
  streak: {
    color: '#e28834',
    ...fontMaker('bold'),
    fontSize: 35,
    textAlign: 'center',
    zIndex: 0,
  },
  week: {
    color: '#e28834',
    ...fontMaker('bold'),
    fontSize: 25,
    textAlign: 'center',
  },
  profileImage: {
    height: 250,
    width: 250,
    backgroundColor: '#fff',
  },
  containerForBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  shadow: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  leftImageContainer: {
    width: '25%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 7,
    alignContent: 'flex-start',
  },
  rightContainer: {
    width: '75%',
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 7,
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  rightTopContainer: {
    flexDirection: 'row',
  },
  rightMiddleContainer: {
    marginTop: 1,
    width: '95%',
  },
  boldTextTitle: {
    color: '#666666',
    fontSize: 16,
    paddingVertical: 8,
  },
  boldDateTitle: {
    color: '#666666',
  },
  header: {
    paddingTop: 15,
  },
  goal: {
    color: '#666',
    ...fontMaker('bold'),
    fontSize: 20,
    paddingBottom: 8,
    textAlign: 'center',
  },
  earned: {
    fontSize: 17,
    paddingBottom: 5,
    textAlign: 'center',
  },
  earnedWeeks: {
    fontSize: 17,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'center',
  },
  earnedBadges: {
    ...fontMaker('bold'),
    fontSize: 18,
    paddingVertical: 5,
  },
});

MessageStreakTabScreen.propTypes = {
  navigateToSelectedTopic: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  fetching: state.achievementReducer.fetching || state.profile.fetching,
  messageStreakPayload: state.achievementReducer.messageStreakPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
});
export default connect(mapStateToProps)(MessageStreakTabScreen);
