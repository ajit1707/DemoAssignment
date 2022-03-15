import React, {Component} from 'react';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Animated,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {fontMaker} from '../utility/helper';
import Icon from '../utility/icons';
import {connect} from 'react-redux';
import {checkanimate} from '../modules/chosseAsMentor';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const borderRadius = 10;

const EarnedModal = (props) => {
  const {
    modalVisible,
    batchModalPress,
    titleOfBadge,
    image,
    dateOfBadge,
    percentageOfBadge,
    clause,
    introduction,
    totalNumber,
    progressBar,
  } = props;
  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {}}>
      <View style={styles.modalContainer}>
        <View style={styles.header} accessible={false}>
          <View style={styles.trinagleDirection}>
            <View
              style={
                titleOfBadge == 'We have lift off!'
                  ? styles.triangleColumn
                  : titleOfBadge == 'Ice breaker' ||
                    titleOfBadge == 'Clip and send' ||
                    titleOfBadge == 'Picture perfect'
                  ? styles.triangleColumnIceBreaker
                  : titleOfBadge == 'Top Ten' ||
                    titleOfBadge == 'High five!' ||
                    titleOfBadge == 'I like it!'
                  ? styles.triangleColumnTopTen
                  : titleOfBadge == 'Tremendous Twenty'
                  ? styles.triangleTremendous
                  : titleOfBadge == '3 is a magic number'
                  ? styles.triangleThree
                  : styles.triangleColumnMagicNumber
              }
            />
            <View style={styles.button}>
              <View accessible={false}>
                <Text style={styles.buttonText} accessible>
                  {titleOfBadge}
                </Text>
              </View>
            </View>
            <View style={styles.triangleRigthDirection} />
          </View>
          <TouchableOpacity
            accessible
            accessibilityLabel="Close"
            accessibilityRole="button"
            onPress={batchModalPress}
            activeOpacity={0.7}
            style={
              titleOfBadge == 'We have lift off!'
                ? styles.crossButtonContainer
                : titleOfBadge == 'Ice breaker' ||
                  titleOfBadge == 'Clip and send' ||
                  titleOfBadge == 'Picture perfect'
                ? styles.crossButtonContainerIceBreaker
                : titleOfBadge == 'Top Ten' ||
                  titleOfBadge == 'High five!' ||
                  titleOfBadge == 'I like it!'
                ? styles.crossButtonContainerTopTen
                : titleOfBadge == 'Tremendous Twenty'
                ? styles.crossButtonContainerTremendous
                : titleOfBadge == '3 is a magic number'
                ? styles.crossButtonContainerThree
                : styles.crossButtonContainerMagicNumber
            }>
            <Image source={Icon.CROSS_ICON} style={styles.crossIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalSubContainer} accessible={false}>
          <View
            accessible
            accessibilityLabel={`${titleOfBadge} badge`}
            accessibilityRole="image">
            <Image style={styles.profileImage} source={image} />
          </View>
          <View style={styles.earnedContainer}>
            <Text style={styles.dateStyle}>Earned on {dateOfBadge}</Text>
            <Text style={styles.percentageStyle}>
              Achieved by {percentageOfBadge}% mentees
            </Text>
          </View>
          <View
            style={styles.progressComponent}
            accessible
            accessibilityLabel={`Your progress is ${totalNumber} out of 10 badges`}>
            <View
              style={
                Platform.OS === 'android'
                  ? styles.containerForProgressForAndroid
                  : styles.containerForProgress
              }>
              <ProgressBarAnimated
                width={Platform.OS === 'android' ? 170 : 180}
                height={19}
                value={progressBar}
                backgroundColor="#ef6c00"
                borderColor="#fff"
                barAnimationDuration={5000}
              />
            </View>
            <Text style={styles.numberOfbadges}>{totalNumber}/10</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  numberOfbadges: {
    paddingLeft: 10,
  },
  progressComponent: {
    flexDirection: 'row',
    paddingTop: 4,
    paddingBottom: 8,
  },
  fillerStyles: {
    height: '100%',
    width: '10%',
    backgroundColor: '#ef6c00',
    borderRadius: 20,
    textAlign: 'right',
  },
  containerForProgress: {
    height: 19,
    width: 180,
    backgroundColor: '#e0e0de',
    borderRadius: 49,
  },
  containerForProgressForAndroid: {
    height: 19,
    width: 170,
    backgroundColor: '#e0e0de',
    borderRadius: 49,
  },
  leftTop: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: '#009bbd',
    transform: [{rotate: '90deg'}],
  },
  leftBottom: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: '#009bbd',
    transform: [{rotate: '180deg'}],
  },
  rigthTop: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: '#009bbd',
    transform: [{rotate: '360deg'}],
  },
  rigthBottom: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: '#009bbd',
    transform: [{rotate: '270deg'}],
  },
  trinagleDirection: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  triangleRigthDirection: {
    flexDirection: 'column',
  },
  triangleColumn: {
    flexDirection: 'column',
    paddingLeft: 26,
  },
  triangleColumnMagicNumber: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  triangleThree: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  triangleTremendous: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  triangleColumnIceBreaker: {
    flexDirection: 'column',
    paddingLeft: 27,
  },
  triangleColumnTopTen: {
    flexDirection: 'column',
    paddingLeft: 50,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 19,
    ...fontMaker('bold'),
  },
  dateStyle: {
    textAlign: 'center',
    paddingBottom: 8,
  },
  introductionClause: {
    textAlign: 'center',
    color: '#666',
    ...fontMaker('semibold'),
    paddingBottom: 8,
    marginHorizontal: 8,
  },
  clauseOf: {
    textAlign: 'center',
    color: '#666',
    ...fontMaker('semibold'),
    paddingBottom: 16,
    marginHorizontal: 10,
  },
  percentageStyle: {
    textAlign: 'center',
  },
  earnedContainer: {
    paddingVertical: 10,
  },
  profileImage: {
    height: 100,
    width: 100,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  crossButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 35,
  },
  crossButtonContainerIceBreaker: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 40,
  },
  crossButtonContainerTopTen: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
    paddingLeft: 60,
  },
  crossButtonContainerMagicNumber: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 14,
    paddingLeft: 10,
  },
  crossButtonContainerThree: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 14,
    paddingLeft: 20,
  },
  crossButtonContainerTremendous: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 14,
    paddingLeft: 18,
  },
  crossIcon: {
    height: 13,
    width: 13,
  },
  header: {
    height: 70,
    width: '80%',
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 14,
    backgroundColor: '#fff',
  },
  modalSubContainer: {
    paddingBottom: 10,
    width: '80%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
  buttonContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    height: 25,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  agreementText: {
    fontSize: 18,
    color: '#000',
    ...fontMaker('semibold'),
  },
});

EarnedModal.defaultProps = {
  modalVisible: false,
  agreementPayload: [],
  handleLinkPress: () => {},
  onAgreementModalPress: () => {},
};

EarnedModal.propTypes = {
  modalVisible: PropTypes.bool,
  agreementPayload: PropTypes.array,
  handleLinkPress: PropTypes.func,
  onAgreementModalPress: PropTypes.func,
};
const mapStateToProps = (state) => ({
  animation: state.menteeMentorReducer.animation,
});
export default connect(mapStateToProps)(EarnedModal);
