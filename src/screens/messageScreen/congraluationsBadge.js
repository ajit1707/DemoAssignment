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
} from 'react-native';
import PropTypes from 'prop-types';
import {fontMaker} from '../../utility/helper';
import Icon from '../../utility/icons';

const borderRadius = 10;

const CongraluationBadge = (props) => {
  const {
    modalVisible,
    batchModalPress,
    titleOfBadge,
    image,
    descriptionOfBadge,
    percentageOfBadge,
    totalNumber,
    progressBar,
    knowMore,
    badgeEarnedDate,
    color,
  } = props;
  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalSubContainer}>
          <View accessible accessibilityLabel="Trophy image">
            <Image style={styles.profileImage} source={Icon.TROPHY} />
          </View>
          <View style={styles.earnedContainer} accessible={false}>
            <Text style={styles.buttonText} accessible>
              Congratulations!
            </Text>
            <Text style={styles.dateStyle} accessible>
              You have earned new badge.
            </Text>
          </View>
          <View style={styles.progressComponent}>
            <View
              style={styles.buttonDownload}
              accessible
              accessibilityLabel="Got it button">
              <TouchableOpacity
                onPress={() => batchModalPress(true)}
                activeOpacity={0.9}
                accessible={false}>
                <Text style={styles.buttonTextDownload} accessible={false}>
                  Got It!
                </Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  earnedText: {
    fontSize: 16,
    color: '#e0e0de',
    textAlign: 'center',
  },
  earnedView: {
    paddingTop: 10,
  },
  buttonTextDownload: {
    color: '#fff',
    fontSize: 16,
  },
  buttonDownload: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#000',
    borderColor: '#000',
  },
  buttonDownloadForKnowMore: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0078af',
    marginBottom: 10,
    marginRight: 20,
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
    paddingTop: 8,
    paddingBottom: 10,
  },
  fillerStyles: {
    height: '100%',
    width: '10%',
    backgroundColor: '#ef6c00',
    borderRadius: 20,
    textAlign: 'right',
  },
  containerForProgress: {
    height: 20,
    width: '60%',
    backgroundColor: '#e0e0de',
    borderRadius: 50,
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
    fontSize: 20,
    ...fontMaker('bold'),
    color: '#000',
    textAlign: 'center',
  },
  dateStyle: {
    textAlign: 'center',
    fontSize: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginHorizontal: 10,
  },
  percentageStyle: {
    textAlign: 'center',
  },
  earnedContainer: {
    paddingTop: 12,
    paddingBottom: 10,
  },
  profileImage: {
    height: 250,
    width: 250,
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
    height: 30,
    width: '80%',
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 14,
    backgroundColor: '#fffcf3',
  },
  modalSubContainer: {
    paddingTop: 16,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    paddingBottom: 10,
    width: '80%',
    backgroundColor: '#fffcf3',
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

CongraluationBadge.defaultProps = {
  modalVisible: false,
  agreementPayload: [],
  handleLinkPress: () => {},
  onAgreementModalPress: () => {},
};

CongraluationBadge.propTypes = {
  modalVisible: PropTypes.bool,
  agreementPayload: PropTypes.array,
  handleLinkPress: PropTypes.func,
  onAgreementModalPress: PropTypes.func,
};

export default CongraluationBadge;
