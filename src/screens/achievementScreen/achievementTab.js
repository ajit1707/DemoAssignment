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
  Animated,
  Easing,
} from 'react-native';
import PropTypes from 'prop-types';
import {Container, PaginationSpinner} from '../../components';
import {fontMaker} from '../../utility/helper';
import Icon from '../../utility/icons';
import moment from 'moment';
import EarnedModal from '../../components/earnedModal';
import {checkanimate} from '../../modules/chosseAsMentor';

class AchievementTabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableLazyLoading: false,
      paginationSpinner: false,
      refreshing: false,
      modalVisible: false,
      titleOfBadge: '',
      image: '',
      dateOfBadge: '',
      percentageOfBadge: '',
      clause: '',
      introduction: '',
      totalNumber: '',
      progressBar: '',
    };
    this.animatedValueForLiftOff = new Animated.Value(0);
    this.animatedValuePicturePerfect = new Animated.Value(0);
    this.animatedValueMaking = new Animated.Value(0);
    this.animatedValueMagicNumber = new Animated.Value(0);
    this.animatedValueHighFive = new Animated.Value(0);
    this.animatedValueForClip = new Animated.Value(0);
    this.animatedValueForTop = new Animated.Value(0);
    this.animatedValueLikeIt = new Animated.Value(0);
    this.animatedValueForTwenty = new Animated.Value(0);
    this.animatedValueForMission = new Animated.Value(0);
  }
  handleAnimation = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForLiftOff, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForLiftOff, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForLiftOff, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOut = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForLiftOff, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForLiftOff, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForLiftOff, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationPicture = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValuePicturePerfect, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValuePicturePerfect, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValuePicturePerfect, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutPicture = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValuePicturePerfect, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValuePicturePerfect, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValuePicturePerfect, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationIntro = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueMaking, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueMaking, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueMaking, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutIntro = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueMaking, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueMaking, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueMaking, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationThree = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueMagicNumber, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueMagicNumber, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueMagicNumber, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutThree = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueMagicNumber, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueMagicNumber, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueMagicNumber, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationFive = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueHighFive, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueHighFive, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueHighFive, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutFive = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueHighFive, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueHighFive, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueHighFive, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationClip = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForClip, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForClip, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForClip, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutClip = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForClip, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForClip, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForClip, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationTen = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForTop, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForTop, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForTop, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutTen = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForTop, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForTop, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForTop, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationLike = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueLikeIt, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueLikeIt, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueLikeIt, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutLike = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueLikeIt, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueLikeIt, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueLikeIt, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationTwenty = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForTwenty, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForTwenty, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForTwenty, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutTwenty = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForTwenty, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForTwenty, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForTwenty, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationMission = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForMission, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForMission, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForMission, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  handleAnimationOutMission = () => {
    // A loop is needed for continuous animation
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValueForMission, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValueForMission, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(this.animatedValueForMission, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  renderItem = (item, index) => {
    // console.log('item', item);
    let badgeImage = '';
    let date = '';
    if (item.id === '1') {
      badgeImage = Icon.SIGN_UP_SUCCESS;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '2') {
      badgeImage = Icon.PICTURE_PERFECT;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '3') {
      badgeImage = Icon.MAKING_AN_INTRODUCTION;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '4') {
      badgeImage = Icon.THREE_IS_A_MAGIC_NUMBER;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '5') {
      badgeImage = Icon.HIGH_FIVE;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '6') {
      badgeImage = Icon.CLIP_AND_SEND;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '7') {
      badgeImage = Icon.TIP_TOP_TEN;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '8') {
      badgeImage = Icon.I_LIKE_IT;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '9') {
      badgeImage = Icon.TREMENDOUS_TWENTY;
      date = moment(item.date).format('MMMM D, YYYY');
    } else if (item.id === '10') {
      badgeImage = Icon.MISSION_ACCOMPLISHED;
      date = moment(item.date).format('MMMM D, YYYY');
    }
    return (
      <TouchableOpacity
        style={{flex: 1}}
        accessible={false}
        onPress={() =>
          this.batchModalPress(
            item.attributes.title,
            badgeImage,
            date,
            item.attributes.earned_percentage,
            item.attributes.achievement_clause,
            item.attributes.achievement_introduction,
          )
        }>
        <View
          style={[styles.containerForBox, styles.newEarnedBadgesShadow]}
          accessible={false}>
          {item.id === '1' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimation}
                onPressOut={this.handleAnimationOut}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueForLiftOff.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : item.id === '2' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationPicture}
                onPressOut={this.handleAnimationOutPicture}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValuePicturePerfect.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : item.id === '3' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationIntro}
                onPressOut={this.handleAnimationOutIntro}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueMaking.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : item.id === '4' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationThree}
                onPressOut={this.handleAnimationOutThree}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueMagicNumber.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : item.id === '5' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationFive}
                onPressOut={this.handleAnimationOutFive}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueHighFive.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : item.id === '6' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationClip}
                onPressOut={this.handleAnimationOutClip}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueForClip.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : item.id === '7' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationTen}
                onPressOut={this.handleAnimationOutTen}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueForTop.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : item.id === '8' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationLike}
                onPressOut={this.handleAnimationOutLike}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueLikeIt.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : item.id === '9' ? (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationTwenty}
                onPressOut={this.handleAnimationOutTwenty}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueForTwenty.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              accessible
              accessibilityLabel={`${item.attributes.title} badge`}
              accessibilityRole="image">
              <TouchableOpacity
                style={[styles.leftImageContainer]}
                onPressIn={this.handleAnimationMission}
                onPressOut={this.handleAnimationOutMission}
                accessible
                accessibilityLabel={`${item.attributes.title} badge`}
                accessibilityRole="image">
                <Animated.View
                  accessible
                  style={{
                    transform: [
                      {
                        rotate: this.animatedValueForMission.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-0.1rad', '0.1rad'],
                        }),
                      },
                    ],
                  }}>
                  <Image style={styles.profileImage} source={badgeImage} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.rightContainer}>
            <View style={styles.rightTopContainer}>
              <Text
                style={styles.boldTextTitleForEarnedBadge}
                numberOfLines={1}>
                {item.attributes.title}
              </Text>
            </View>
            <View style={styles.rightMiddleContainer}>
              <Text style={styles.boldDateTitle}>
                {item.attributes.description}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  batchModalPress = (
    title,
    badgeImage,
    date,
    percentage,
    acheivementClause,
    acheivementIntroduction,
  ) => {
    const {earnedBatchDataPayload, dispatch} = this.props;
    const totalNumberBadgesEarned = earnedBatchDataPayload.data.length;
    const progressBarPercentage = totalNumberBadgesEarned * 10;
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible,
      titleOfBadge: title,
      image: badgeImage,
      dateOfBadge: date,
      percentageOfBadge: percentage,
      clause: acheivementClause,
      introduction: acheivementIntroduction,
      totalNumber: totalNumberBadgesEarned,
      progressBar: progressBarPercentage,
    });
    dispatch(checkanimate(true));
  };
  renderAvailableItem = (item, index) => {
    // console.log('item', item);
    let badgeImage = '';
    if (item.id === '1') {
      badgeImage = Icon.SIGN_UP_SUCCESS_FOR_AVAILABLE_BADGE;
    } else if (item.id === '2') {
      badgeImage = Icon.PICTURE_PERFECT_FOR_AVAILABLE_BADGE;
    } else if (item.id === '3') {
      badgeImage = Icon.MAKING_AN_INTRODUCTION_FOR_AVAILABLE_BADGE;
    } else if (item.id === '4') {
      badgeImage = Icon.THREE_IS_A_MAGIC_NUMBER_FOR_AVAILABLE_BADGE;
    } else if (item.id === '5') {
      badgeImage = Icon.HIGH_FIVE_FOR_AVAILABLE_BADGE;
    } else if (item.id === '6') {
      badgeImage = Icon.CLIP_AND_SEND_FOR_AVAILABLE_BADGE;
    } else if (item.id === '7') {
      badgeImage = Icon.TIP_TOP_TEN_FOR_AVAILABLE_BADGE;
    } else if (item.id === '8') {
      badgeImage = Icon.I_LIKE_IT_FOR_AVAILABLE_BADGE;
    } else if (item.id === '9') {
      badgeImage = Icon.TREMENDOUS_TWENTY_FOR_AVAILABLE_BADGE;
    } else if (item.id === '10') {
      badgeImage = Icon.MISSION_ACCOMPLISHED_FOR_AVAILABLE_BADGE;
    }
    return (
      <View style={{flex: 1}} accessible={false}>
        <View
          style={[styles.containerForBox, styles.shadow]}
          accessible={false}>
          <View
            style={[styles.leftImageContainer]}
            accessible
            accessibilityLabel={`${item.attributes.title} badge`}
            accessibilityRole="image">
            <Image style={styles.profileImage} source={badgeImage} />
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.rightTopContainer}>
              <Text style={styles.boldTextTitle} numberOfLines={1}>
                {item.attributes.title}
              </Text>
            </View>
            <View style={styles.rightMiddleContainer}>
              <Text style={styles.boldDateTitle}>
                {item.attributes.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  render() {
    const {
      fetching,
      earnedBatchDataPayload,
      availableBatchDataPayload,
    } = this.props;
    //  console.log('earnedBatchDataPayload', earnedBatchDataPayload);
    // console.log('availableBatchDataPayload', availableBatchDataPayload);
    const {
      paginationSpinner,
      refreshing,
      modalVisible,
      titleOfBadge,
      image,
      dateOfBadge,
      percentageOfBadge,
      clause,
      introduction,
      totalNumber,
      progressBar,
    } = this.state;
    // console.log('earnedBatchDataPayload', earnedBatchDataPayload);
    // console.log('availableBatchDataPayload', availableBatchDataPayload);
    return (
      <Container fetching={fetching} isTabBar accessible={false}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              {availableBatchDataPayload &&
              availableBatchDataPayload.data &&
              availableBatchDataPayload.data.length > 0 ? (
                <View>
                  <Text style={styles.yourGoal}>
                    Your Goal:{' '}
                    <Text style={styles.goal}>
                      Earn your{' '}
                      {availableBatchDataPayload.data[0].attributes.title} badge
                    </Text>
                  </Text>
                  {/* <Text style={styles.earned}>Badges Earned</Text> */}
                </View>
              ) : (
                availableBatchDataPayload &&
                availableBatchDataPayload.data && (
                  <View>
                    <Text style={styles.goal}>
                      Great! You have achieved all the badges.
                    </Text>
                    {/* <Text style={styles.earned}>Badges Earned</Text> */}
                  </View>
                )
              )}
              {earnedBatchDataPayload &&
                earnedBatchDataPayload.data &&
                earnedBatchDataPayload.data.length && (
                  <FlatList
                    data={earnedBatchDataPayload.data}
                    scrollEnabled={false}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    ListHeaderComponent={
                      <View>
                        <Text style={styles.earned}>Badges Earned</Text>
                      </View>
                    }
                    keyExtractor={(item) => item.id}
                  />
                )}
              {availableBatchDataPayload &&
                availableBatchDataPayload.data &&
                availableBatchDataPayload.data.length > 0 && (
                  <FlatList
                    data={availableBatchDataPayload.data}
                    scrollEnabled={false}
                    renderItem={({item, index}) =>
                      this.renderAvailableItem(item, index)
                    }
                    ListHeaderComponent={
                      <View>
                        <Text style={styles.earnedBadges}>
                          Available Badges
                        </Text>
                      </View>
                    }
                    keyExtractor={(item) => item.id}
                  />
                )}
              <EarnedModal
                batchModalPress={this.batchModalPress}
                titleOfBadge={titleOfBadge}
                image={image}
                dateOfBadge={dateOfBadge}
                percentageOfBadge={percentageOfBadge}
                clause={clause}
                introduction={introduction}
                totalNumber={totalNumber}
                progressBar={progressBar}
                modalVisible={modalVisible}
                dispatch={this.props.dispatch}
              />
            </View>
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
    // justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  profileImage: {
    height: 60,
    width: 60,
    // borderRadius: imageBorderRadius,
    backgroundColor: '#fff',
  },
  containerForBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  shadow: {
    // shadowColor: Color.CHANNEL_SEPARATOR_COLOR,
    // shadowOffset: { width: 0, height: 0.5 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  newEarnedBadgesShadow: {
    // shadowColor: Color.CHANNEL_SEPARATOR_COLOR,
    // shadowOffset: { width: 0, height: 0.5 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 1,
    borderWidth: 4,
    borderColor: '#e28834',
    borderRadius: 15,
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
    // ...fontMaker('bold'),
    paddingVertical: 8,
  },
  boldTextTitleForEarnedBadge: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('bold'),
    paddingVertical: 8,
  },
  boldDateTitle: {
    color: '#666666',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  goal: {
    color: '#009bbd',
    ...fontMaker('bold'),
    fontSize: 18,
    paddingBottom: 8,
  },
  yourGoal: {
    ...fontMaker('bold'),
    fontSize: 18,
    paddingBottom: 8,
  },
  earned: {
    ...fontMaker('bold'),
    fontSize: 18,
    paddingBottom: 5,
  },
  earnedBadges: {
    ...fontMaker('bold'),
    fontSize: 18,
    paddingVertical: 5,
  },
});

AchievementTabScreen.propTypes = {
  navigateToSelectedTopic: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  fetching: state.achievementReducer.fetching,
  earnedBatchDataPayload: state.achievementReducer.earnedBatchDataPayload,
  availableBatchDataPayload: state.achievementReducer.availableBatchDataPayload,
});
export default connect(mapStateToProps)(AchievementTabScreen);
