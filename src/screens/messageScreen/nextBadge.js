import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import PropTypes from 'prop-types';
import {fontMaker} from '../../utility/helper';
import Icon from '../../utility/icons';

const borderRadius = 10;

const NextBadge = (props) => {
  const {
    modalVisible,
    batchModalPress,
    titleOfBadge,
    image,
    descriptionOfBadge,
    percentageOfBadge,
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
        <View style={styles.header}>
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
                <Text style={styles.buttonText} accessible={false}>
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
        <View style={styles.modalSubContainer}>
          <View
            accessible
            accessibilityLabel={`${titleOfBadge} badge`}
            accessibilityRole="image">
            <Image style={styles.profileImage} source={image} />
          </View>
          <View style={styles.earnedContainer}>
            <Text style={styles.dateStyle}>Earned on {descriptionOfBadge}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  containerForProgressForAndroid: {
    height: 19,
    width: 170,
    backgroundColor: '#e0e0de',
    borderRadius: 49,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ef6c00',
    borderRadius: 20,
    textAlign: 'right',
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
  triangleColumnIceBreaker: {
    flexDirection: 'column',
    paddingLeft: 27,
  },
  triangleColumnTopTen: {
    flexDirection: 'column',
    paddingLeft: 50,
  },
  triangleTremendous: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  triangleThree: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 19,
    ...fontMaker('bold'),
    color: '#000',
  },
  dateStyle: {
    textAlign: 'center',
    paddingBottom: 8,
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
  crossButtonContainerTremendous: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 14,
    paddingLeft: 18,
  },
  crossButtonContainerThree: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 14,
    paddingLeft: 20,
  },
  crossButtonContainerMagicNumber: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 14,
    paddingLeft: 10,
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

NextBadge.defaultProps = {
  modalVisible: false,
  agreementPayload: [],
  handleLinkPress: () => {},
  onAgreementModalPress: () => {},
};

NextBadge.propTypes = {
  modalVisible: PropTypes.bool,
  agreementPayload: PropTypes.array,
  handleLinkPress: PropTypes.func,
  onAgreementModalPress: PropTypes.func,
};

export default NextBadge;
