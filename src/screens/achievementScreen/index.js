import React, {Component} from 'react';
import {connect} from 'react-redux';
import {HeaderBackButton, NavigationActions} from 'react-navigation';
import {TabView, TabBar} from 'react-native-tab-view';
import {
  Text,
  Dimensions,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import Style from './style';
import {Container} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import {
  earnedBatch,
  availableBatch,
  certficateDownload,
} from '../../modules/achievement';
import AchievementTabScreen from '../achievementScreen/achievementTab';
import MessageStreakTabScreen from '../achievementScreen/messageStreakTab';
import {
  assignmentNavigationOptions,
  communitiesNavigationOptions,
  achievementNavigationOptions,
} from '../../navigators/Root';
import {getChannels} from '../../modules/getChannels';
import {getAssignmentData} from '../../modules/assignmentReducer';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import Constant from '../../utility/constant';
import {getRandomNumber} from '../../utility/helper';
import {getProjectUser} from '../../modules/profile';
import {checkData} from '../../modules/chosseAsMentor';

export const navigationOption = ({navigation, screenProps}) => ({
  ...achievementNavigationOptions(
    {navigation, screenProps},
    navigation.state.params && navigation.state.params.handleFile,
    navigation.state.params && navigation.state.params.IconFlag,
  ),
});
class AchievementScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...navigationOption({navigation, screenProps}),
  });
  constructor(props) {
    super(props);
    this.state = {
      displaySpinner: false,
      iconFlag: false,
      index: 0,
      routes: [
        {
          key: 'first',
          title: 'Achievements',
          accessibilityLabel: 'Achievements tab',
        },
        {
          key: 'second',
          title: 'Message streak',
          accessibilityLabel: 'Message streak tab',
        },
      ],
    };
  }
  componentDidMount() {
    const {
      dispatch,
      userDetailPayload,
      projectUserPayload,
      downloadIcon,
    } = this.props;
    if (downloadIcon === true) {
      dispatch(checkData(false));
      dispatch(getProjectUser()).then((res) => {
        if (res && res.included && res.included.length) {
          for (let i = 0; i < res.included.length; i = i + 1) {
            if (
              res &&
              res.included &&
              res.included[i].type &&
              res.included[i].type !== undefined &&
              res.included[i].type == 'projects'
            ) {
              if (
                userDetailPayload &&
                userDetailPayload.included &&
                userDetailPayload.included.length &&
                userDetailPayload.included[1].attributes.name === 'mentee' &&
                res &&
                res.included &&
                res.included.length &&
                res.included[i].attributes.mission_accomplished === true
              ) {
                this.props.navigation.setParams({
                  handleFile: this.handleFileUpload,
                  IconFlag: true,
                });
              } else {
                this.props.navigation.setParams({
                  IconFlag: false,
                });
              }
            }
          }
        }
      });
    }
  }
  handleFileUpload = () => {
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
        if (
          Platform.OS === 'android' &&
          res.data.data.attributes.certificate_pdf !== null
        ) {
          this.downloadPdfForAndroid(res.data.data.attributes.certificate_pdf);
        } else if (
          Platform.OS === 'ios' &&
          res.data.data.attributes.certificate_pdf !== null
        ) {
          this.downloadPdfForIos(res.data.data.attributes.certificate_pdf);
        } else {
          Toast.showWithGravity(
            'Mission accomplished badge not earned',
            Toast.SHORT,
            Toast.BOTTOM,
          );
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
    console.log('granted', granted);
    console.log('PermissionsAndroid', PermissionsAndroid);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const directory = RNFetchBlob.fs.dirs.DownloadDir;
      // RNFetchBlob.fetch('GET', 'http://www.africau.edu/images/default/sample.pdf').then((res) => {
      // console.log('res', res);
      const base64data = item;
      // const fileName = item.files[0].attachment_filename.split('.');
      // const randomNumber = getRandomNumber(0, 999);
      const randomNumber = getRandomNumber(0, 999);
      const attachmentFilename = `mentoring_journey_completed(${randomNumber}).pdf`;
      const filePath = `${directory}/${attachmentFilename}`;
      // this.setState({
      //     displaySpinner: true,
      // });
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
      // })
      // Something went wrong:
      //     .catch(() => {
      //         // error handling
      //     });
    } else {
      Toast.showWithGravity(
        'Permission Required to store data.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };
  // componentDidMount() {
  //     const {
  //         navigation: { setParams }, userDetailPayload, dispatch
  //     } = this.props;
  //     console.log('userDetailPayload', userDetailPayload);
  //     let projectUserId = '';
  //     if (userDetailPayload && userDetailPayload.data && userDetailPayload.data.length && userDetailPayload.data[0].id) {
  //         projectUserId = userDetailPayload.data[0].id;
  //         dispatch(earnedBatch(projectUserId));
  //         dispatch(availableBatch(projectUserId));
  //     }
  //     // setParams({
  //     //     onSelectOfTab: true
  //     // });
  // }
  onTabPress = () => {
    const {
      dispatch,
      navigation: {setParams},
      allTopicsData,
    } = this.props;
    const {index} = this.state;
    // if (index === 0) {
    //     setParams({ onSelectOfTab: true });
    // } else {
    //     setParams({ onSelectOfTab: false });
    // }
  };
  renderTabBar = (props) => {
    const {sideMenuItems} = this.props;
    return (
      <TabBar
        {...props}
        style={{backgroundColor: '#fff'}}
        renderLabel={this.renderLabel}
        indicatorStyle={{
          backgroundColor: sideMenuItems && sideMenuItems.sideMenuColor,
        }}
      />
    );
  };

  renderLabel = ({route, focused}) => {
    const {sideMenuItems} = this.props;
    return (
      <Text
        style={[
          Style.boldTextTitle,
          focused
            ? {color: sideMenuItems && sideMenuItems.sideMenuColor}
            : {opacity: 0.5, color: '#ccc'},
        ]}>
        {route.title}
      </Text>
    );
  };

  renderScene = ({route}) => {
    if (route && route.key) {
      switch (route.key) {
        case 'first':
          return <AchievementTabScreen />;
        case 'second':
          return <MessageStreakTabScreen />;
        default:
          return null;
      }
    }
  };

  render() {
    return (
      <View style={{flex: 1}} accessible={false}>
        {/*<TabView*/}
        {/*    onIndexChange={index => this.setState({ index }, )}*/}
        {/*    swipeEnabled={false}*/}
        {/*    navigationState={this.state}*/}
        {/*    renderScene={this.renderScene}*/}
        {/*    initialLayout={{ width: Dimensions.get('window').width }}*/}
        {/*    renderTabBar={this.renderTabBar}*/}
        {/*/>*/}
        <AchievementTabScreen />
      </View>
    );
  }
}
AchievementScreen.defaultProps = {
  userDetailPayload: null,
  sideMenuItems: null,
  getAskGraduateDetailsPayload: null,
  screenProps: null,
};

AchievementScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  userDetailPayload: PropTypes.object,
  sideMenuItems: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  getAskGraduateDetailsPayload: PropTypes.object,
  screenProps: PropTypes.object,
};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
  channelItems: state.displayChannelItemsReducer.channelItems,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  projectUserPayload: state.profile.projectUserPayload,
  downloadIcon: state.menteeMentorReducer.downloadIcon,
});

export default connect(mapStateToProps)(AchievementScreen);
