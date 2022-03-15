import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  PermissionsAndroid,
  ImageBackground,
} from 'react-native';
import {fontMaker, getRandomNumber} from '../../utility/helper';
import Config from '../../utility/config';
import Icon from './../../utility/icons';
import Constant from '../../utility/constant';
import moment from 'moment';
import NextBadge from '../messageScreen/nextBadge';
import CERTIFICATE from '../../assets/certificate.png';
import {
  availableBatch,
  earnedBatch,
  messageStreak,
  certficateDownload,
} from '../../modules/achievement';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';

const imageHeight = 40;
const imageWidth = 40;
const borderWidth = 0.7;
const borderRadius = 20;
const imageHeightMentor = 120;
const imageWidthMentor = 120;
const buttonBorderRadiusMentor = 60;

class MissionAccomplishedScreen extends Component {
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
      displaySpinner: false,
    };
  }
  downloadFileForGammification = () => {
    const {userDetailPayload, dispatch} = this.props;
    let project_user_id = '';
    let project_id = '';
    if (userDetailPayload.data.length && userDetailPayload.data[0].id) {
      project_user_id = userDetailPayload.data[0].id;
      project_id = userDetailPayload.data[0].attributes.project_id.toString();
      const payload = {
        data: {
          attributes: {
            project_id,
            project_user_id,
          },
          type: 'gamification_certificates',
        },
      };
      dispatch(certficateDownload(payload)).then((res) => {
        if (Platform.OS === 'android') {
          this.downloadPdfForAndroid(res.data.data.attributes.certificate_pdf);
        } else {
          this.downloadPdfForIos(res.data.data.attributes.certificate_pdf);
        }
      });
    }
  };
  downloadPdfForIos = (item) => {
    const directory = RNFetchBlob.fs.dirs.DocumentDir;
    const base64data = item;
    const randomNumber = getRandomNumber(0, 999);
    const fileName = `mentoring_journey_completed(${randomNumber}).pdf`;
    const filePath = `${directory}/${fileName}`;
    this.setState({
      displaySpinner: true,
    });
    RNFetchBlob.fs
      .writeFile(filePath, base64data, 'base64')
      .then(() => {
        RNFetchBlob.ios.previewDocument(filePath);
        this.setState({
          displaySpinner: false,
        });
      })
      .catch(() => {
        Toast.showWithGravity(
          'Error in Downloading file',
          Toast.SHORT,
          Toast.BOTTOM,
        );
        this.setState({
          displaySpinner: false,
        });
      });
  };
  downloadPdfForAndroid = async (item) => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: Constant.EXTERNAL_STORAGE_TITLE,
        message: Constant.EXTERNAL_STORAGE_PERMISSION,
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const directory = RNFetchBlob.fs.dirs.DownloadDir;
      const base64data = item;
      const randomNumber = getRandomNumber(0, 999);
      const attachmentFilename = `mentoring_journey_completed(${randomNumber}).pdf`;
      const filePath = `${directory}/${attachmentFilename}`;
      RNFetchBlob.fs.writeFile(filePath, base64data, 'base64');
      RNFetchBlob.fs
        .scanFile([{path: filePath}])
        .then(() => {
          this.setState({
            displaySpinner: false,
          });
          Toast.showWithGravity(
            'File Downloaded Successfully!',
            Toast.SHORT,
            Toast.BOTTOM,
          );
        })
        .catch(() => {});
    } else {
      Toast.showWithGravity(
        'Permission Required to store data.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };
  render() {
    const {
      name,
      visibleModal,
      badgeModal,
      sideMenuItems,
      closePopUp,
    } = this.props;
    const {
      paginationSpinner,
      refreshing,
      descriptionOfBadge,
      percentageOfBadge,
    } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent
        visible={visibleModal}
        onRequestClose={() => {}}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.trinagleDirection}>
              <View style={styles.button}>
                <View accessible={false}>
                  <Text style={styles.buttonText}>Mission Accomplished!</Text>
                </View>
              </View>
              <TouchableOpacity
                accessible
                accessibilityLabel="Close"
                accessibilityRole="button"
                onPress={closePopUp}
                style={styles.iconStyle}>
                <Image source={Icon.CROSS_ICON} style={styles.crossIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.modalSubContainer}>
            <ImageBackground source={Icon.RIBBION} style={styles.cracker}>
              <View style={styles.congrats}>
                <Text style={styles.clauseOf}>
                  Congratulations {name}! you have completed your{' '}
                  {sideMenuItems.projectName} programme
                </Text>
              </View>
              <View
                accessible
                accessibilityLabel="Mission Accomplished"
                accessibilityRole="image">
                <Image style={styles.profileImage} source={Icon.CONGRATS} />
              </View>
              <View style={styles.congrats}>
                <Text style={styles.clauseOf}>
                  Your certificate of participation is now available to
                  download.
                </Text>
              </View>
              <View style={styles.downloadComponent}>
                <View
                  style={styles.buttonDownload}
                  accessible
                  accessibilityLabel="Download Certificate"
                  accessibilityRole="button">
                  <TouchableOpacity
                    accessible={false}
                    onPress={() => {
                      this.downloadFileForGammification();
                      closePopUp();
                    }}>
                    <Text style={styles.buttonTextDownload} accessible={false}>
                      Download Certificate
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cracker: {
    width: 274,
    height: 330,
    alignItems: 'center',
  },
  buttonTextDownload: {
    color: '#0078af',
  },
  buttonDownload: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0078af',
    marginBottom: 10,
  },
  downloadComponent: {
    paddingVertical: 12,
  },
  iconStyle: {
    paddingTop: 11,
    width: '10%',
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
    paddingLeft: 14,
  },
  triangleColumnMagicNumber: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  triangleColumnIceBreaker: {
    flexDirection: 'column',
    paddingLeft: 25,
  },
  triangleColumnTopTen: {
    flexDirection: 'column',
    paddingLeft: 27,
  },
  button: {
    paddingVertical: 10,
    width: '90%',
  },
  buttonText: {
    fontSize: 16,
    ...fontMaker('bold'),
    color: '#00008b',
    paddingLeft: 56,
  },
  dateStyle: {
    textAlign: 'center',
    color: '#009bbd',
    paddingBottom: 8,
  },
  introductionClause: {
    textAlign: 'center',
    color: '#292b2c',
    ...fontMaker('semibold'),
    paddingBottom: 8,
    marginHorizontal: 8,
  },
  congrats: {
    width: '100%',
  },
  clauseOf: {
    textAlign: 'center',
    paddingBottom: 8,
    marginHorizontal: 10,
    fontSize: 15,
  },
  percentageStyle: {
    textAlign: 'center',
    color: '#009bbd',
  },
  earnedContainer: {
    paddingVertical: 10,
  },
  profileImage: {
    height: 150,
    width: 150,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 12,
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
    paddingLeft: 50,
  },
  crossButtonContainerTopTen: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 64,
  },
  crossButtonContainerMagicNumber: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 22,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
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

export default MissionAccomplishedScreen;
