import React, {Component} from 'react';
import {
  View,
  KeyboardAvoidingView,
  SectionList,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import moment from 'moment';
import _, {get} from 'lodash';
import {NavigationActions, StackActions} from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropType from 'prop-types';
import Toast from 'react-native-simple-toast';
import {
  capitalizeFirstLetter,
  bytesConverter,
  iPhoneXHelper,
} from '../../utility/helper';
import {TextArea, Container, PaginationSpinner} from '../../components';
import {uploadAttachments} from '../../modules/uploadAttachments';
import styles from './style';
import Icon from './../../utility/icons';
import {
  joinChannel,
  socketConnect,
  socketPushMessage,
  socketDisconnect,
  socketLeaveChannel,
} from '../../utility/phoenix-utils';
import ConversationItem from './messageItem';
import {messageNavigationOptions} from '../../navigators/Root';
import {projectSwitcher, setSideMenuItems} from '../../modules/getProjects';
import {channelsUser, getChannelsName} from '../../modules/channelsUser';
import {getArchiveChannelData, getChannels} from '../../modules/getChannels';
import Constant from '../../utility/constant';
import ChannelUsersModal from './channelUsersModal';
import {errorHandler} from '../../modules/errorHandler';
import {clearCopiedLinkMessage} from '../../modules/brightKnowledgeReducer';
import {
  channelDeselected,
  channelSelected,
  resetSelectedChannelItemIndex,
} from '../../modules/displayChannelItems';
import {withImageUploader} from '../../components/withImageUploader';
import {getUserDetails, getUserDetail} from '../../modules/getUserDetail';
import {offlineMessagesToSend} from '../../modules/offlineMessagesToSend';
import {clearOfflineStatus} from '../../modules/postOfflineMessages';
import {logEventForAnalytics} from '../../utility/firebase-utils';
import {chatBot, mentorProfile} from '../../modules/typeformMentee';
import {clearChannelMessages} from '../../modules/channelMessage';
import MentorChatBotScreen from '../../screens/messageScreen/mentorChatBot';
import {
  availableBatch,
  badgeData,
  earnedBatch,
  messageStreak,
  missionBatch,
} from '../../modules/achievement';
import {getProfileDetail, getProjectUser} from '../../modules/profile';
import MissionAccomplishedScreen from '../messageScreen/missonAccomplishedCretificate';
import CongraluationBadge from './congraluationsBadge';
import Draggable from 'react-native-draggable';
import {checkData} from '../../modules/chosseAsMentor';
import {
  preserveMessageText,
  getPreserveMessageText,
} from '../../modules/preserveMessageText';

const actionSheetOptions = {
  ...Platform.select({
    ios: {
      options: ['Take Photo', 'Photo Library', 'Browse', 'Cancel'],
      fileType: ['camera', 'gallery', 'file', 'cancel'],
    },
    android: {
      options: ['Take Photo', 'Files', 'Cancel'],
      fileType: ['camera', 'file', 'cancel'],
    },
  }),
};
const cancelIndex = {
  ...Platform.select({
    ios: {
      buttonIndex: 3,
    },
    android: {
      buttonIndex: 2,
    },
  }),
};

const sectionFooterDateFormat = 'YYYY-MM-DD';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height - 150;

export const navigationOption = ({navigation, screenProps}) => ({
  ...messageNavigationOptions(
    {navigation, screenProps},
    navigation.state.params && navigation.state.params.currentChannelData,
    navigation.state.params && navigation.state.params.showModal,
    navigation.state.params && navigation.state.params.showSmartModerationFlag,
    navigation.state.params && navigation.state.params.handleReportMessage,
    navigation.state.params && navigation.state.params.handleSmartModeration,
  ),
});

class MessageScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...navigationOption({navigation, screenProps}),
  });

  constructor(props) {
    super();
    this.state = {
      pageNumber: 0,
      enableLazyLoading: false,
      paginationSpinner: false,
      filename: '',
      format: '',
      id: '',
      size: '',
      url: '',
      message: '',
      spinner: false,
      showUploadedFileView: false,
      modalVisible: false,
      previousChannelId:
        props.currentChannelData && props.currentChannelData.channelId,
      isChannelRemoved: false,
      selectedChannelData: null,
      selectedLongPressData: [],
      currentDate: moment().format(sectionFooterDateFormat),
      isImageSelected: false,
      isButtonLongPressed: false,
      sequenceNumber: 1,
      fileUpload: false,
      modalOfBadge: false,
      name: '',
      congratsModalVisible: false,
      automatedBadge: true,
      badgeEarnedDate: '',
      badgeImage: '',
      missonFlag: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const channelData = props.userChannelsPayload.filter(
      (item) => item.channelId === state.previousChannelId,
    );
    if (channelData.length === 0) {
      return {
        isChannelRemoved: true,
      };
    }
    if (
      props.imagePayload &&
      props.imagePayload.eventType === 'imageSelected' &&
      state.showUploadedFileView
    ) {
      const {
        fileData: {filename, format, size, url},
      } = props.imagePayload;
      if (size > 10000000) {
        Toast.showWithGravity(
          'Please attach file size upto 10 MB',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return {
          filename: '',
          format: '',
          size: '',
          id: '',
          url: '',
          showUploadedFileView: false,
        };
      }
    }
    if (props.imagePayload.eventType === 'cancel') {
      return {
        isImageSelected: false,
      };
    }
    return null;
  }
  componentDidMount() {
    const {
      dispatch,
      networkState: {isConnected},
      isOfflineMessagesSent,
      screenProps: {emitter},
      currentChannelData,
      userDetailPayload,
      projectSessionPayload,
      selectedProjectPayload,
      navigation,
    } = this.props;
    emitter.emit('setSideMenuItemIndex', -1, null);
    dispatch(channelSelected());
    dispatch(getChannels());
    dispatch(channelsUser());
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

    if (
      userDetailPayload &&
      userDetailPayload.data &&
      userDetailPayload.data.length &&
      userDetailPayload.data[0].attributes['has_survey?'] &&
      userDetailPayload.included[1].attributes.name === 'mentee'
    ) {
      dispatch(getUserDetails());
    }
    if (
      (projectSessionPayload &&
        projectSessionPayload.data[0].attributes.gamification_enabled) ||
      (selectedProjectPayload &&
        selectedProjectPayload.data.attributes.gamification_enabled)
    ) {
      const projectUserId = userDetailPayload.data[0].id;
      dispatch(earnedBatch(projectUserId));
      dispatch(availableBatch(projectUserId));
      dispatch(messageStreak(payload));
      dispatch(missionBatch(projectUserId)).then((res) => {
        if (res && res.data && res.data.included && res.data.included.length) {
          if (
            res.data.included[0].attributes.created_at ===
            res.data.included[0].attributes.updated_at
          ) {
          }
        }
      });
      dispatch(badgeData(projectUserId));
    }
    if (isConnected && isOfflineMessagesSent) {
      return dispatch(clearOfflineStatus(this.socketConnection));
    }
    if (currentChannelData && currentChannelData.channelType === 'mentoring') {
      dispatch(getChannels()).then(() => dispatch(mentorProfile()));
      dispatch(getChannels()).then(() => dispatch(chatBot()));
    }
  }

  gammification = (response) => {
    const {
      dispatch,
      networkState: {isConnected},
      isOfflineMessagesSent,
      screenProps: {emitter},
      currentChannelData,
      userDetailPayload,
      projectSessionPayload,
      selectedProjectPayload,
      channelsPayload,
    } = this.props;
    currentChannelData.messages[0].new_message = false;
    if (
      ((projectSessionPayload &&
        projectSessionPayload.data[0].attributes.gamification_enabled) ||
        (selectedProjectPayload &&
          selectedProjectPayload.data.attributes.gamification_enabled)) &&
      userDetailPayload.included[1].attributes.name === 'mentee'
    ) {
      const projectUserId = userDetailPayload.data[0].id;
      dispatch(availableBatch(projectUserId));
      dispatch(badgeData(projectUserId));
      dispatch(missionBatch(projectUserId)).then((res) => {
        if (res && res.data.included && res.data.included.length) {
          if (
            res.data.included[0].attributes.created_at ===
            res.data.included[0].attributes.updated_at
          ) {
            if (isConnected) {
              if (response && response.included && response.included.length) {
                for (let i = 0; i <= response.included.length; i += 1) {
                  if (
                    response.included[i].type == 'projects' &&
                    response.included[i].id ==
                      userDetailPayload.data[0].attributes.project_id
                  ) {
                    if (
                      response.included[i].attributes.mission_accomplished ===
                      true
                    ) {
                      this.badgeModal();
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
  };
  missionBadge = (response) => {
    const {
      dispatch,
      networkState: {isConnected},
      isOfflineMessagesSent,
      screenProps: {emitter},
      currentChannelData,
      userDetailPayload,
      projectSessionPayload,
      selectedProjectPayload,
      channelsPayload,
    } = this.props;
    const {missonFlag} = this.state;
    currentChannelData.messages[0].new_message = false;
    if (
      ((projectSessionPayload &&
        projectSessionPayload.data[0].attributes.gamification_enabled) ||
        (selectedProjectPayload &&
          selectedProjectPayload.data.attributes.gamification_enabled)) &&
      userDetailPayload.included[1].attributes.name === 'mentee' &&
      missonFlag === true
    ) {
      this.setState({missonFlag: false});
      const projectUserId = userDetailPayload.data[0].id;
      dispatch(availableBatch(projectUserId));
      dispatch(badgeData(projectUserId));
      dispatch(missionBatch(projectUserId)).then((res) => {
        if (res && res.data.included && res.data.included.length) {
          if (
            res.data.included[0].attributes.created_at ===
            res.data.included[0].attributes.updated_at
          ) {
            if (isConnected) {
              if (response && response.included && response.included.length) {
                for (let i = 0; i <= response.included.length; i += 1) {
                  if (
                    response.included[i].type == 'projects' &&
                    response.included[i].id ==
                      userDetailPayload.data[0].attributes.project_id
                  ) {
                    if (
                      response.included[i].attributes.mission_accomplished ===
                      true
                    ) {
                      this.badgeModal();
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
  };
  badgeModal = () => {
    const {visibleModal} = this.state;
    const {userPayload, currentChannelData, projectUserPayload} = this.props;
    if (
      projectUserPayload &&
      projectUserPayload.included &&
      projectUserPayload.included.length
    ) {
      if (
        currentChannelData &&
        currentChannelData.channelType === 'mentoring'
      ) {
        this.setState({
          visibleModal: !visibleModal,
          name: userPayload[0].attributes.first_name,
        });
      }
    }
  };
  closePopUp = () => {
    const {visibleModal} = this.state;
    this.setState({
      visibleModal: !visibleModal,
    });
  };
  knowMore = (popUpCheck) => {
    const {congratsModalVisible, automatedBadge} = this.state;
    const {
      currentChannelData,
      navigation: {navigate},
      dispatch,
      screenProps: {emitter},
      userDetailPayload,
    } = this.props;
    currentChannelData.messages[0].new_message = false;
    const date = moment(currentChannelData.messages[0].inserted_at).format(
      'D MMMM, YYYY',
    );
    if (popUpCheck === true) {
      this.setState({
        congratsModalVisible: !congratsModalVisible,
        automatedBadge: false,
        badgeEarnedDate: date,
      });
    }
    this.setState({
      congratsModalVisible: !congratsModalVisible,
      automatedBadge: false,
      badgeEarnedDate: date,
    });
    const projectUserId = userDetailPayload.data[0].id;
    dispatch(resetSelectedChannelItemIndex());
    dispatch(clearChannelMessages());
    dispatch(channelDeselected());
    emitter.emit('setSideMenuItemIndex', 4);
    dispatch(availableBatch(projectUserId)).then(() => navigate('achievement'));
  };
  showCongratsModal = (popUpCheck) => {
    const {congratsModalVisible, automatedBadge, badgeEarnedDate} = this.state;
    const {currentChannelData, dispatch, userDetailPayload} = this.props;
    currentChannelData.messages[0].new_message = false;
    const messageForRegex = currentChannelData.messages[0].body;
    const batchId = messageForRegex.replace(/^\D+/g, '');
    let badgeImage = '';
    if (batchId === '1') {
      badgeImage = Icon.SIGN_UP_SUCCESS;
    } else if (batchId === '2') {
      badgeImage = Icon.PICTURE_PERFECT;
    } else if (batchId === '3') {
      badgeImage = Icon.MAKING_AN_INTRODUCTION;
    } else if (batchId === '4') {
      badgeImage = Icon.THREE_IS_A_MAGIC_NUMBER;
    } else if (batchId === '5') {
      badgeImage = Icon.HIGH_FIVE;
    } else if (batchId === '6') {
      badgeImage = Icon.CLIP_AND_SEND;
    } else if (batchId === '7') {
      badgeImage = Icon.TIP_TOP_TEN;
    } else if (batchId === '8') {
      badgeImage = Icon.I_LIKE_IT;
    } else if (batchId === '9') {
      badgeImage = Icon.TREMENDOUS_TWENTY;
    } else if (batchId === '10') {
      badgeImage = Icon.MISSION_ACCOMPLISHED;
    }
    const date = moment(currentChannelData.messages[0].inserted_at).format(
      'D MMMM, YYYY',
    );
    if (popUpCheck === true) {
      this.setState({
        congratsModalVisible: !congratsModalVisible,
        automatedBadge: false,
        badgeEarnedDate: date,
        badgeImage,
      });
    }
    const projectUserId = userDetailPayload.data[0].id;
    dispatch(availableBatch(projectUserId));
    dispatch(earnedBatch(projectUserId));
    this.setState({
      congratsModalVisible: !congratsModalVisible,
      automatedBadge: false,
      badgeEarnedDate: date,
      badgeImage,
    });
  };
  componentDidUpdate(prevProps) {
    const {
      currentChannelData,
      dispatch,
      copiedLink,
      isChannelSelected,
      imagePayload,
      networkState: {isConnected},
      isOfflineMessagesSent,
      fetching,
      offlineStoredMessages,
      projectUserPayload,
      preservedMessageTextData,
    } = this.props;
    const {isImageSelected, congratsModalVisible} = this.state;
    if (imagePayload.eventType === 'imageSelected' && isImageSelected) {
      this.uploadDocument();
    }
    if (
      isChannelSelected &&
      ((!prevProps.currentChannelData && currentChannelData) ||
        (currentChannelData && prevProps.currentChannelData))
    ) {
      dispatch(channelDeselected());
      this.resetState();
      this.socketConnection();
      if (
        currentChannelData &&
        currentChannelData.channelType === 'mentoring'
      ) {
        dispatch(getProfileDetail()).then((response) => {
          if (
            currentChannelData &&
            currentChannelData.channelType === 'mentoring'
          ) {
            this.gammification(response);
          }
        });
      }
    }
    if (
      currentChannelData &&
      currentChannelData.messages &&
      currentChannelData.messages.length &&
      currentChannelData.messages[0].body !==
        'Congratulations you have earned the badge 10'
    ) {
      if (
        currentChannelData.messages[0].automated === true &&
        currentChannelData.messages[0].new_message === true
      ) {
        this.showCongratsModal(false);
        dispatch(getProfileDetail()).then((response) => {
          if (
            currentChannelData &&
            currentChannelData.channelType === 'mentoring'
          ) {
            this.gammification(response);
          }
        });
      }
    }
    if (
      currentChannelData &&
      currentChannelData.messages &&
      currentChannelData.messages.length &&
      currentChannelData.messages[0].body ===
        'Congratulations you have earned the badge 10'
    ) {
      if (
        currentChannelData.messages[0].automated === true &&
        currentChannelData.messages[0].new_message === true
      ) {
        dispatch(getProfileDetail()).then((response) => {
          if (
            currentChannelData &&
            currentChannelData.channelType === 'mentoring'
          ) {
            this.missionBadge(response);
          }
        });
      }
    }
    if (copiedLink !== prevProps.copiedLink) {
      this.setState({message: `${copiedLink}`});
    }
    if (isConnected && isOfflineMessagesSent && !fetching) {
      dispatch(channelDeselected());
      socketLeaveChannel();
      dispatch(clearOfflineStatus(this.socketConnection));
      this.setState({sequenceNumber: 1});
    }
    if (
      prevProps.networkState.isConnected === false &&
      isConnected &&
      offlineStoredMessages.length === 0
    ) {
      this.socketConnection();
    }
  }

  onMomentumScrollBegin = () => {
    this.setState({enableLazyLoading: true});
  };

  onEndReached = () => {
    const {
      dispatch,
      currentChannelData,
      networkState: {isConnected},
      userId,
      channels,
      projectSessionPayload,
      selectedProjectPayload,
      mentorPayload,
      userDetailPayload,
    } = this.props;
    const {pageNumber, enableLazyLoading, paginationSpinner} = this.state;
    const channelMessageData = _.get(
      channels[currentChannelData.channelId],
      'messages',
      [],
    );
    if (enableLazyLoading && !paginationSpinner && isConnected) {
      if (
        channelMessageData[channelMessageData.length - 1].last_page === false &&
        ((projectSessionPayload &&
          projectSessionPayload.data[0].attributes.typeform_enabled) ||
          (selectedProjectPayload &&
            selectedProjectPayload.data.attributes.typeform_enabled)) &&
        userDetailPayload.data[0].attributes.state === 'matched' &&
        userDetailPayload.included[1].attributes.name === 'mentee' &&
        mentorPayload &&
        mentorPayload.hasOwnProperty('included') && currentChannelData &&
        currentChannelData.channelType === 'mentoring'
      ) {
        this.setState(
          {paginationSpinner: true, pageNumber: pageNumber + 1},
          () => {
            joinChannel(
              currentChannelData,
              dispatch,
              this.state.pageNumber,
              'messageScreen',
              userId[0].id,
              true,
            ).then(() => {
              this.setState({paginationSpinner: false});
            });
          },
        );
      } else if (
        channelMessageData[channelMessageData.length - 1].last_page !== true
      ) {
        this.setState(
          {
            pageNumber: pageNumber + 1,
            paginationSpinner: true,
          },
          () => {
            joinChannel(
              currentChannelData,
              dispatch,
              this.state.pageNumber,
              'messageScreen',
              userId[0].id,
              true,
            ).then(() => {
              this.setState({paginationSpinner: false});
            });
          },
        );
      }
    }
  };

  onPressBrightKnowledge = () => {
    const {
      navigation: {navigate},
    } = this.props;
    navigate('BrightKnowledgeScreen', {
      handleBKLinkAppend: this.handleBKLinkAppend,
    });
    logEventForAnalytics('bright_knowledge', {});
  };

  getSectionListData = (messages) => {
    const {currentChannelData, offlineStoredMessages} = this.props;
    let offlineMsgsOfChannel = [];
    if (
      offlineStoredMessages &&
      offlineStoredMessages.length > 0 &&
      currentChannelData
    ) {
      offlineMsgsOfChannel = offlineStoredMessages
        .filter((data) => currentChannelData.channelId === data.channel_id)
        .reverse();
    }
    if (
      (messages.length && currentChannelData) ||
      (messages.length === 0 && offlineMsgsOfChannel && currentChannelData)
    ) {
      let sectionListData = offlineMsgsOfChannel.concat(messages);
      if (sectionListData.length) {
        sectionListData = _(sectionListData)
          .groupBy((x) => x.date)
          .map((value, key) => ({title: key, data: value}))
          .value();
      }
      const sortedData = [];
      sectionListData.forEach((dateObj) => {
        const sectionData = [];
        let timeData = [];
        dateObj.data.forEach((timeObj, index) => {
          const timeArray = dateObj.data;
          const startIndex = index;
          const endIndex = timeArray[index + 1]
            ? index + 1
            : timeArray.length - 1;
          const timeDiff = Math.floor(
            moment
              .duration(
                moment(timeArray[startIndex].inserted_at).diff(
                  moment(timeArray[endIndex].inserted_at),
                ),
              )
              .asMinutes(),
          );
          if (
            ((timeDiff >= 0 && timeDiff <= 5) || timeDiff === -1) &&
            timeArray[startIndex].user_id === timeArray[endIndex].user_id
          ) {
            timeData.push(timeObj);
          } else {
            timeData.push(timeObj);
            sectionData.push({
              time: timeArray[startIndex].inserted_at,
              ...timeObj,
              data: timeData.reverse(),
            });
            timeData = [];
          }
          if (timeArray.length - 1 === index) {
            sectionData.push({
              time: timeArray[index].inserted_at,
              ...timeObj,
              data: timeData.reverse(),
            });
          }
        });
        sortedData.push({title: dateObj.title, data: sectionData});
      });
      return sortedData;
    }

    return [];
  };

  getMessageDateTitleFormat = (titleDate) => {
    const {currentDate} = this.state;
    if (titleDate === currentDate) {
      return 'Today';
    } else if (
      titleDate === moment().subtract(1, 'days').format(sectionFooterDateFormat)
    ) {
      return 'Yesterday';
    }
    return moment(titleDate).format('MMM Do YYYY');
  };

  handleSmartModeration = (event, flag, item, index, userId) => {
    const {selectedLongPressData, isButtonLongPressed} = this.state;
    const {
      navigation: {setParams},
      currentChannelData,
      channels,
    } = this.props;
    const channelMessageData = channels[currentChannelData.channelId].messages;
    if (item) {
      const selectedMessageData = channelMessageData.find(
        (message) => message.id === item.id,
      );
      const messageIndex = selectedLongPressData.findIndex(
        (message) => message.id === item.id,
      );

      if (
        selectedMessageData &&
        selectedMessageData.state === 'pending' &&
        selectedMessageData.user_id.toString() !== userId &&
        currentChannelData &&
        currentChannelData.userRole !== 'supportee' &&
        item
      ) {
        if (
          (event === 'singlePress' && isButtonLongPressed) ||
          (event === 'longPress' && !isButtonLongPressed)
        ) {
          if (messageIndex === -1) {
            selectedLongPressData.push(item);
          } else {
            selectedLongPressData.splice(messageIndex, 1);
          }
        }
        this.setState(
          {
            isButtonLongPressed: selectedLongPressData.length !== 0,
            selectedLongPressData,
            selectedChannelData: selectedLongPressData[0],
          },
          () => {
            setParams({
              showSmartModerationFlag: selectedLongPressData.length === 1,
            });
          },
        );
      }
    } else if (!item) {
      this.setState({selectedLongPressData: []});
      setParams({showSmartModerationFlag: false});
    }
  };

  resetReportModerationState = () => {
    const {
      screenProps: {emitter},
      navigation: {setParams},
    } = this.props;
    emitter.on('resetReportModeration', () => {
      this.setState(
        {selectedLongPressData: [], isButtonLongPressed: false},
        () => {
          setParams({showSmartModerationFlag: false});
        },
      );
    });
  };

  resetState = () => {
    this.setState({
      pageNumber: 0,
      enableLazyLoading: false,
      paginationSpinner: false,
      filename: '',
      format: '',
      id: '',
      size: '',
      url: '',
      message: '',
      spinner: false,
      showUploadedFileView: false,
      modalVisible: false,
      visibleModal: false,
      isChannelRemoved: false,
      selectedChannelData: null,
      selectedLongPressData: [],
      currentDate: moment().format(sectionFooterDateFormat),
      isImageSelected: false,
      isButtonLongPressed: false,
    },()=>{
      this.setPreserveMessageTextToMessageBox()
    });
  };

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text;
    this.setState(newState);
  };

  showSpinner = () => (
    <View
      style={{
        paddingVertical: 20,
        backgroundColor: 'transparent',
      }}>
      <ActivityIndicator color="#ccc" size="large" />
    </View>
  );

  socketConnection = () => {
    const {
      dispatch,
      currentChannelData,
      networkState: {isConnected},
      userId,
      userDetailPayload,
    } = this.props;
    const pageNumber = 0;
    if (!currentChannelData) {
      return true;
    }
    this.setState({
      spinner: isConnected,
      previousChannelId: currentChannelData.channelId,
    });
    const {
      navigation: {setParams},
    } = this.props;
    setParams({
      showModal: this.showModal,
      currentChannelData,
      handleReportMessage: this.handleReportMessage,
      handleSmartModeration: this.handleSmartModeration,
      showSmartModerationFlag: false,
    });
    dispatch(getUserDetails());
    this.resetReportModerationState();
    if (isConnected) {
      dispatch(getUserDetails());
      socketConnect(userDetailPayload.data[0].attributes.project_id)
        .then(() => {
          this.setState({spinner: false});
          joinChannel(
            currentChannelData,
            dispatch,
            pageNumber,
            'messageScreen',
            userId[0].id,
            false,
          )
            .then(() => {
              // do not dispach following action here since it is going
              // to clear offline messages even if they have not sent.
              // dispatch(clearSentMessages());
              this.setState({spinner: false});
            })
            .catch((err) => {
              dispatch(errorHandler(err));
              this.setState({spinner: false});
            });
        })
        .catch((err) => {
          dispatch(errorHandler(err));
          this.setState({spinner: false});
        });
    }
  };

  uploadDocument = () => {
    const {
      dispatch,
      imagePayload,
      currentChannelData: {channelId},
      networkState: {isConnected},
    } = this.props;
    if (isConnected) {
      this.setState(
        {
          isImageSelected: false,
          filename: imagePayload.fileData.filename,
          format: imagePayload.fileData.format,
          size: imagePayload.fileData.size,
          url: imagePayload.fileData.url,
          showUploadedFileView: true,
          fileUpload: true,
        },
        () => {
          const fileData = new FormData();
          fileData.append('file', {
            uri: imagePayload.fileData.url,
            type: imagePayload.fileData.format,
            name: imagePayload.fileData.filename,
          });
          dispatch(uploadAttachments(fileData, `channels/${channelId}`));
        },
      );
    } else {
      Toast.showWithGravity(
        Constant.UNABLE_TO_UPLOAD,
        Toast.SHORT,
        Toast.BOTTOM,
      );
    }
  };

  displayLastActive = (currentChannelData) => {
    const {userChannelsPayload} = this.props;
    if (userChannelsPayload) {
      const channelData = userChannelsPayload.filter(
        (item) => item.channelId === currentChannelData.channelId,
      );
      if (channelData && channelData.length && channelData[0].userRole) {
        return `${capitalizeFirstLetter(
          channelData[0].userRole,
        )} last active: ${moment(channelData[0].lastReadAt).format(
          'MMM Do [at] HH:mm',
        )}`;
      }
    }
    return null;
  };

  handleReportMessage = () => {
    const {
      navigation: {navigate},
    } = this.props;
    const {selectedChannelData} = this.state;
    navigate('ReportMessageScreen', {messagePayload: selectedChannelData});
  };

  handleSubmit = async () => {
    const {
      message,
      showUploadedFileView,
      sequenceNumber,
      filename,
    } = this.state;
    const {
      projects,
      uploadAttachmentsData,
      dispatch,
      currentChannelData,
      networkState: {isConnected},
      userId,
      currentChannelData: {channelId},
    } = this.props;
    if (this.sectionListRef) {
      this.sectionListRef.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: false,
      });
    }
    let projectId;
    const localData = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
      () => {},
    );
    if (localData && localData.length) {
      projectId = JSON.parse(localData);
    } else {
      projectId = projects.data[0];
    }
    if (!isConnected) {
      if (
        uploadAttachmentsData &&
        uploadAttachmentsData.data &&
        uploadAttachmentsData.data.hasOwnProperty('format') &&
        filename
      ) {
        this.setState({
          filename: '',
          format: '',
          size: '',
          id: '',
          url: '',
          showUploadedFileView: false,
          fileUpload: false,
        });
        const fileData = new FormData();
        fileData.append('file', {
          uri: '',
          type: '',
          name: '',
        });
        Toast.showWithGravity(
          Constant.UNABLE_TO_UPLOAD,
          Toast.SHORT,
          Toast.BOTTOM,
        );
      } else {
        const offlineMessageObj = {
          attachments: [],
          body: message,
          automated: false,
          channel_id: currentChannelData.channelId,
          date: moment().format('YYYY-MM-DD'),
          files: [],
          id: -1,
          inserted_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
          last_message: false,
          last_page: false,
          new_message: true,
          reported_user_id: null,
          state: 'pending',
          offline: true,
          user_id: parseInt(userId[0].id, 10),
          project_id: parseInt(projectId.id, 10),
          sequence_id: sequenceNumber,
        };
        dispatch(offlineMessagesToSend(offlineMessageObj));
        Toast.showWithGravity(Constant.OFFLINE, Toast.SHORT, Toast.BOTTOM);
        this.setState(
          {
            message: '',
            showUploadedFileView: false,
            fileUpload: false,
            sequenceNumber: sequenceNumber + 1,
          },
          () => {
            this.handlePreserveMessageText();
            logEventForAnalytics('message_send', {});
          },
        );
      }
    } else {
      let attachmentPayload = '';
      if (
        showUploadedFileView &&
        uploadAttachmentsData &&
        uploadAttachmentsData.data &&
        uploadAttachmentsData.data.hasOwnProperty('format') &&
        isConnected
      ) {
        attachmentPayload = uploadAttachmentsData.data;
        attachmentPayload.content_type = uploadAttachmentsData.data.format;
        attachmentPayload = JSON.stringify(attachmentPayload);
      }
      const messageData = {
        body: message,
        project_id: projectId.id,
        attachment: attachmentPayload,
      };
      this.setState(
        {
          message: '',
          showUploadedFileView: false,
          filename: '',
          fileUpload: false,
        },
        () => {
          this.handlePreserveMessageText();
          socketPushMessage(messageData);
          logEventForAnalytics('message_send', {});
          dispatch(clearCopiedLinkMessage());
        },
      );
    }
  };
  closeUploadView = () => {
    this.setState({
      filename: '',
      format: '',
      size: '',
      id: '',
      url: '',
      showUploadedFileView: false,
      fileUpload: false,
    });
  };
  goMentorProfile = () => {
    const {
      navigation: {navigate},
      dispatch,
      screenProps: {emitter},
    } = this.props;
    dispatch(resetSelectedChannelItemIndex());
    dispatch(clearChannelMessages());
    dispatch(channelDeselected());
    emitter.emit('setSideMenuItemIndex', 5);
    navigate('MentorProfileScreen');
  };

  navigate = () => {
    const {dispatch} = this.props;
    dispatch(projectSwitcher());
    const resetNavigator = StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: 'SplashScreen',
        }),
      ],
    });
    dispatch(resetNavigator);
  };
  navigateToAchivmentScreen = () => {
    const {
      navigation: {navigate},
      dispatch,
      screenProps: {emitter},
      userDetailPayload,
      networkState: {isConnected},
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
      dispatch(earnedBatch(projectUserId));
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
  handleBKLinkAppend = (link, isClicked) => {
    const linkArray = this.state.message.trim().split('\n');
    if (isClicked) {
      const linkToRemoveIndex = linkArray.findIndex((item) => item === link[0]);
      if (linkToRemoveIndex === -1) {
        this.setState({message: `${this.state.message}\n${link}`});
      }
    } else {
      let filteredMessage = '';
      const linkToRemoveIndex = linkArray.findIndex((item) => item === link[0]);
      linkArray.splice(linkToRemoveIndex, 1);
      linkArray.forEach((item) => {
        filteredMessage += `${item}\n`;
      });
      this.setState({message: filteredMessage.replace(/[\r\n]{2,}/g, '\n')});
    }
  };

  showModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  handleFileUpload = () => {
    const {showActionSheet} = this.props;
    logEventForAnalytics('upload_file', {});
    setTimeout(() => {
      this.setState(
        {
          isImageSelected: true,
        },
        () => {
          showActionSheet();
        },
      );
    }, 20);
  };

  createPreserveMessageTextObject = () => {
    const {
      dispatch,
      currentChannelData: {channelId},
    } = this.props;
    const {message} = this.state;
    return {channelId, message};
  };

  handlePreserveMessageText = () => {
    const {dispatch} = this.props;
    dispatch(preserveMessageText(this.createPreserveMessageTextObject()));
  };

  setPreserveMessageTextToMessageBox = () => {
    const {preservedMessageTextData, currentChannelData} = this.props;
    const preservedMessageText =
      preservedMessageTextData.find(
        (item) => item.channelId === currentChannelData.channelId,
      ) || {};
    this.setState({
      message: preservedMessageText.message || '',
    });
  };

  render() {
    const {
      channelNotice,
      sideMenuItems,
      fetching,
      currentChannelData,
      userDetail: {data},
      channelArchivedData,
      channels,
      offlineStoredMessages,
      projectSessionPayload,
      selectedProjectPayload,
      userDetailPayload,
      mentorPayload,
      myMentorPayload,
      uploadAttachmentsData,
      dispatch,
      projectUserPayload,
      channelsPayload,
      spin,
      availableBatchDataPayload,
    } = this.props;
    const {
      paginationSpinner,
      message,
      spinner,
      showUploadedFileView,
      modalVisible,
      isChannelRemoved,
      selectedLongPressData,
      fileUpload,
      modalOfBadge,
      name,
      visibleModal,
      congratsModalVisible,
      badgeEarnedDate,
      badgeImage,
    } = this.state;
    let nextBadge = 'Next badge: ';
    let nextBadgeLength = nextBadge.length;
    let titleLength = 0;
    if (
      availableBatchDataPayload &&
      availableBatchDataPayload.data &&
      availableBatchDataPayload.data.length > 0 &&
      availableBatchDataPayload.data.length !== 10
    ) {
      if (availableBatchDataPayload.data[0].attributes.title == 'Ice breaker') {
        titleLength =
          availableBatchDataPayload.data[0].attributes.title.length + 1;
      } else if (
        availableBatchDataPayload.data[0].attributes.title == 'High five!'
      ) {
        titleLength =
          availableBatchDataPayload.data[0].attributes.title.length + 1;
      } else if (
        availableBatchDataPayload.data[0].attributes.title == 'Clip and send'
      ) {
        titleLength =
          availableBatchDataPayload.data[0].attributes.title.length + 1;
      } else if (
        availableBatchDataPayload.data[0].attributes.title == 'Top Ten'
      ) {
        titleLength =
          availableBatchDataPayload.data[0].attributes.title.length + 3;
      } else if (
        availableBatchDataPayload.data[0].attributes.title == 'I like it'
      ) {
        titleLength =
          availableBatchDataPayload.data[0].attributes.title.length + 1;
      } else if (
        availableBatchDataPayload.data[0].attributes.title ==
        'Tremendous Twenty'
      ) {
        titleLength =
          availableBatchDataPayload.data[0].attributes.title.length + 2;
      } else if (
        availableBatchDataPayload.data[0].attributes.title ==
        'We have lift off!'
      ) {
        titleLength =
          availableBatchDataPayload.data[0].attributes.title.length - 1;
      } else {
        titleLength = availableBatchDataPayload.data[0].attributes.title.length;
      }
    }
    let finalLength = titleLength * 10 + nextBadgeLength + 64;
    let isProjectArchived = false;
    if (
      projectSessionPayload &&
      projectSessionPayload.data &&
      projectSessionPayload.data.length &&
      projectSessionPayload.data[0].attributes
    ) {
      isProjectArchived = projectSessionPayload.data[0].attributes.is_archived;
    }
    if (
      selectedProjectPayload &&
      selectedProjectPayload.data &&
      selectedProjectPayload.data.attributes
    ) {
      isProjectArchived = selectedProjectPayload.data.attributes.is_archived;
    }
    const isArchived = data.length && data[0].attributes.is_archived;
    const isChannelArchived =
      channelArchivedData &&
      channelArchivedData.attributes &&
      channelArchivedData.attributes.hasOwnProperty('is_archived')
        ? channelArchivedData.attributes.is_archived
        : null;
    let channelMessageData = [];
    if (currentChannelData && channels[currentChannelData.channelId]) {
      channelMessageData = _.get(
        channels[currentChannelData.channelId],
        'messages',
        [],
      );
    }
    let offlineMsgsOfChannel = [];
    if (
      offlineStoredMessages &&
      offlineStoredMessages.length > 0 &&
      currentChannelData &&
      channels[currentChannelData.channelId]
    ) {
      offlineMsgsOfChannel = offlineStoredMessages
        .filter((msgs) => currentChannelData.channelId === msgs.channel_id)
        .reverse();
    }
    const lastValue = get(offlineStoredMessages, '0.last_page');
    return (
      <Container
        fetching={fetching || spinner || spin}
        style={styles.container}>
        {isChannelRemoved ? (
          <View style={styles.noChannelContainer}>
            <Text style={[styles.textName, styles.channelNoticeTitle]}>
              Sorry, channel not found!
            </Text>
            <Text style={[styles.textDate, styles.channelNoticeMessage]}>
              You have been removed from channel, please contact to your
              coordinator.
            </Text>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {marginTop: 20, borderColor: sideMenuItems.sideMenuColor},
              ]}
              activeOpacity={0.7}
              onPress={this.navigate}>
              <Text
                style={[
                  styles.buttonText,
                  {color: sideMenuItems.sideMenuColor},
                ]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {!isChannelRemoved ? (
          currentChannelData &&
          currentChannelData.channelType === 'mentoring' ? (
            <View
              style={[
                styles.lastTimeActiveContainer,
                {backgroundColor: sideMenuItems.sideMenuColor},
              ]}>
              <Text style={{color: '#fff'}}>
                {this.displayLastActive(currentChannelData)}
              </Text>
            </View>
          ) : null
        ) : null}
        {isArchived || isChannelArchived || isProjectArchived ? (
          <View style={styles.bannerContainer}>
            <Text style={styles.bannerText}>
              {isArchived || isProjectArchived
                ? Constant.ARCHIVED_USER
                : `Your ${currentChannelData.userRole} has been archived from this project so you can no longer send messages in this channel but feel free to review your previous conversation.`}
            </Text>
          </View>
        ) : null}
        {!isChannelRemoved ? (
          <View style={styles.relativeContainer}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={
                Platform.OS === 'ios'
                  ? iPhoneXHelper(
                      currentChannelData &&
                        currentChannelData.channelType === 'mentoring'
                        ? 118
                        : 90,
                      currentChannelData &&
                        currentChannelData.channelType === 'mentoring'
                        ? 90
                        : 60,
                    )
                  : null
              }
              style={styles.flexContainer}
              behavior={Platform.OS === 'ios' && 'padding'}
              keyboardShouldPersistTaps="never"
              alwaysBounceVertical={false}>
              <View style={{flex: 9}}>
                {(!fetching || !spinner) &&
                  channelNotice &&
                  channelMessageData.length === 0 &&
                  offlineMsgsOfChannel.length === 0 && (
                    <ScrollView
                      keyboardVerticalOffset={
                        Platform.OS === 'ios'
                          ? iPhoneXHelper(
                              currentChannelData &&
                                currentChannelData.channelType === 'mentoring'
                                ? 118
                                : 90,
                              currentChannelData &&
                                currentChannelData.channelType === 'mentoring'
                                ? 90
                                : 60,
                            )
                          : null
                      }
                      contentContainerStyle={[
                        styles.flexContainer,
                        {justifyContent: 'center', alignItems: 'center'},
                      ]}
                      behavior={Platform.OS === 'ios' && 'padding'}
                      keyboardShouldPersistTaps="handled"
                      alwaysBounceVertical={false}>
                      {currentChannelData &&
                      ((projectSessionPayload &&
                        projectSessionPayload.data[0].attributes
                          .typeform_enabled) ||
                        (selectedProjectPayload &&
                          selectedProjectPayload.data.attributes
                            .typeform_enabled)) &&
                      userDetailPayload.data[0].attributes.state ===
                        'matched' &&
                      mentorPayload &&
                      mentorPayload.hasOwnProperty('included') &&
                      userDetailPayload.included[1].attributes.name ===
                        'mentee' && currentChannelData &&
                      currentChannelData.channelType === 'mentoring' ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <View
                            style={{marginBottom: 60, paddingHorizontal: -50}}>
                            <React.Fragment>
                              <MentorChatBotScreen
                                navigation={this.props.navigation}
                                screenProps={this.props.screenProps}
                                mentorPayload={this.props.mentorPayload}
                                channelsPayload={this.props.channelsPayload}
                                goMentorProfile={this.goMentorProfile}
                                myMentorPayload={myMentorPayload}
                              />
                            </React.Fragment>
                          </View>
                        </ScrollView>
                      ) : currentChannelData ? (
                        <React.Fragment>
                          <Text
                            style={[
                              styles.textName,
                              styles.channelNoticeTitle,
                            ]}>
                            {`${channelNotice.title} ${
                              currentChannelData &&
                              currentChannelData.channelType === 'mentoring'
                                ? currentChannelData.channelName
                                : ''
                            }`}
                          </Text>
                          <Text
                            style={[
                              styles.textDate,
                              styles.channelNoticeMessage,
                            ]}>
                            {channelNotice.message}
                          </Text>
                        </React.Fragment>
                      ) : null}
                    </ScrollView>
                  )}
                {(!fetching || !spinner) &&
                  (channelMessageData.length !== 0 ||
                    offlineMsgsOfChannel.length > 0) && (
                    <SectionList
                      accessible={false}
                      ref={(ref) => {
                        this.sectionListRef = ref;
                      }}
                      extraData={this.props}
                      style={{marginBottom: 7}}
                      renderItem={({item, index}) => (
                        <ConversationItem
                          formatDate={(date) => {
                            this.formatDate(date);
                          }}
                          selectedLongPressData={selectedLongPressData}
                          fileData={{
                            fileName: this.state.filename,
                            format: this.state.format,
                            id: this.state.id,
                            size: this.state.size,
                            url: this.state.url,
                          }}
                          item={item}
                          index={index}
                          handleSmartModeration={(
                            event,
                            flag,
                            items,
                            index,
                            userId,
                          ) => {
                            this.handleSmartModeration(
                              event,
                              flag,
                              items,
                              index,
                              userId,
                            );
                          }}
                          {...this.props}
                        />
                      )}
                      renderSectionFooter={({section: {title}}) => (
                        <View style={styles.sectionListFooter}>
                          <View style={styles.sectionListFooterSeparator} />
                          <View style={styles.sectionListFooterDateContainer}>
                            <Text style={styles.sectionListFooterText}>
                              {this.getMessageDateTitleFormat(title)}
                            </Text>
                          </View>
                        </View>
                      )}
                      sections={this.getSectionListData(channelMessageData)}
                      bounces={false}
                      inverted
                      ListFooterComponent={
                        <View>
                          {(channelMessageData === 'undefined' ||
                            (channelMessageData.length &&
                              channelMessageData[channelMessageData.length - 1]
                                .last_page === true) ||
                            channelMessageData.length <= 14 ||
                            lastValue === false) &&
                            ((projectSessionPayload &&
                              projectSessionPayload.data[0].attributes
                                .typeform_enabled) ||
                              (selectedProjectPayload &&
                                selectedProjectPayload.data.attributes
                                  .typeform_enabled)) &&
                            userDetailPayload.data[0].attributes.state ===
                              'matched' &&
                            userDetailPayload.included[1].attributes.name ===
                              'mentee' &&
                            !fetching &&
                            mentorPayload &&
                            mentorPayload.hasOwnProperty('included') &&
                            currentChannelData &&
                            currentChannelData.channelType === 'mentoring' && (
                              <MentorChatBotScreen
                                navigation={this.props.navigation}
                                screenProps={this.props.screenProps}
                                mentorPayload={this.props.mentorPayload}
                                channelsPayload={this.props.channelsPayload}
                                goMentorProfile={this.goMentorProfile}
                                myMentorPayload={myMentorPayload}
                              />
                            )}
                          <PaginationSpinner animating={paginationSpinner} />
                        </View>
                      }
                      onMomentumScrollBegin={this.onMomentumScrollBegin}
                      onEndReached={this.onEndReached}
                      onEndReachedThreshold={0.2}
                      keyExtractor={(item, index) =>
                        index ? index.toString() : item
                      }
                    />
                  )}
              </View>
              {showUploadedFileView ? (
                <View style={styles.uploadViewContainer}>
                  <View style={styles.iconWidth}>
                    <Image
                      accessible
                      accessibilityLabel="attachment icon"
                      source={Icon.UPLOAD_ICON}
                      style={styles.uploadIcon}
                    />
                  </View>
                  <View style={styles.fileNameContainer}>
                    <Text style={styles.fileNameText}>{`${
                      this.state.filename
                    } ${bytesConverter(this.state.size)}`}</Text>
                  </View>
                  <View style={styles.iconWidth}>
                    <TouchableOpacity
                      accessibilityLabel="remove attachment"
                      accessibilityRole="button"
                      onPress={this.closeUploadView}
                      style={styles.crossButtonContainer}>
                      <Image
                        source={Icon.CROSS_ICON}
                        style={styles.crossIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
              {!isChannelArchived && !isArchived && !isProjectArchived ? (
                <View style={[styles.textBoxContainer]}>
                  <View style={[styles.textAreaContainer, {width: '70%'}]}>
                    <TextArea
                      onBlur={() => this.handlePreserveMessageText()}
                      onChangeText={this.handleTextChange('message')}
                      value={message && message}
                      placeholder={`Message ${
                        currentChannelData && currentChannelData.channelName
                      }`}
                      maxLength={2000}
                      numberOfLines={1}
                    />
                  </View>
                  <View style={styles.fileUploadContainer}>
                    <TouchableOpacity
                      accessibilityLabel="Bright Knowledge"
                      accessibilityRole="button"
                      activeOpacity={0.7}
                      onPress={() => this.onPressBrightKnowledge()}>
                      <Image
                        source={Icon.BRIGHT_KNOWLEDGE}
                        style={styles.uploadFile}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.fileUploadContainer}>
                    <TouchableOpacity
                      accessibilityLabel="Attach file"
                      accessibilityRole="button"
                      activeOpacity={0.7}
                      onPress={() => this.handleFileUpload()}>
                      <Image
                        source={Icon.UPLOAD_FILE}
                        style={styles.uploadFile}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sendButtonContainer}>
                    <TouchableOpacity
                      disabled={!fileUpload && !message}
                      onPress={this.handleSubmit}
                      accessibilityLabel="Send message"
                      accessibilityRole="button">
                      <MaterialCommunityIcons
                        name="send"
                        size={24}
                        color={message || fileUpload ? '#666' : '#ccc'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
              {((projectSessionPayload &&
                projectSessionPayload.data[0].attributes
                  .gamification_enabled) ||
                (selectedProjectPayload &&
                  selectedProjectPayload.data.attributes
                    .gamification_enabled)) &&
              userDetailPayload.included[1].attributes.name === 'mentee' &&
              availableBatchDataPayload &&
              availableBatchDataPayload.data &&
              availableBatchDataPayload.data.length > 0 &&
              availableBatchDataPayload.data.length !== 10 &&
              currentChannelData &&
              currentChannelData.channelType !== null &&
              currentChannelData.channelType === 'mentoring' &&
              currentChannelData.messages &&
              currentChannelData.messages.length ? (
                <Draggable
                  x={deviceWidth - finalLength}
                  y={2}
                  maxX={deviceWidth}
                  minX={2}
                  maxY={deviceHeight}
                  minY={2}
                  touchableOpacityProps={0}
                  onShortPressRelease={() => this.navigateToAchivmentScreen()}>
                  <View
                    onPress={() => this.navigateToAchivmentScreen()}
                    activeOpacity={0.9}
                    accessible={false}
                    style={[
                      styles.buttonDownload,
                      {backgroundColor: '#fff', borderColor: '#e28834'},
                    ]}>
                    <Text style={styles.nextbadgeTitleView}>
                      Next badge:{' '}
                      <Text style={styles.nextbadgeTitle}>
                        {availableBatchDataPayload.data[0].attributes.title}
                      </Text>
                    </Text>
                  </View>
                </Draggable>
              ) : null}
              <ChannelUsersModal
                modalVisible={modalVisible}
                showModal={this.showModal}
              />
              <MissionAccomplishedScreen
                visibleModal={visibleModal}
                userDetailPayload={userDetailPayload}
                name={name}
                dispatch={dispatch}
                sideMenuItems={sideMenuItems}
                badgeModal={this.badgeModal}
                closePopUp={this.closePopUp}
              />
              <CongraluationBadge
                batchModalPress={this.showCongratsModal}
                knowMore={this.knowMore}
                modalVisible={congratsModalVisible}
                badgeEarnedDate={badgeEarnedDate}
                image={badgeImage}
                color={sideMenuItems.sideMenuColor}
              />
            </KeyboardAvoidingView>
          </View>
        ) : null}
      </Container>
    );
  }
}

MessageScreen.defaultProps = {
  channelMessages: [],
  getChannelsPayload: null,
  currentChannelData: null,
  channelNotice: null,
  uploadAttachmentsData: null,
  channelsPayload: null,
  sideMenuItems: null,
  userChannelsPayload: [],
  userId: [],
  channels: [],
  offlineStoredMessages: [],
  copiedLink: '',
  isChannelSelected: false,
  isOfflineMessagesSent: false,
  imagePayload: null,
  projects: null,
  channelArchivedData: null,
  userDetail: null,
};

MessageScreen.propTypes = {
  dispatch: PropType.func.isRequired,
  showActionSheet: PropType.func.isRequired,
  fetching: PropType.bool.isRequired,
  projects: PropType.object,
  navigation: PropType.object.isRequired,
  channelMessages: PropType.array,
  userId: PropType.array,
  getChannelsPayload: PropType.object,
  currentChannelData: PropType.object,
  channelNotice: PropType.object,
  uploadAttachmentsData: PropType.object,
  channelsPayload: PropType.object,
  sideMenuItems: PropType.object,
  userChannelsPayload: PropType.array,
  offlineStoredMessages: PropType.array,
  channels: PropType.array,
  copiedLink: PropType.string,
  isChannelSelected: PropType.bool,
  isOfflineMessagesSent: PropType.bool,
  imagePayload: PropType.object,
  userDetail: PropType.object,
  channelArchivedData: PropType.object,
  screenProps: PropType.object.isRequired,
  networkState: PropType.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching:
    state.logOut.fetching ||
    state.getchannels.fetching ||
    state.uploadAttachments.fetching ||
    state.achievementReducer.fetching,
  spin: state.profile.spin,
  projects: state.getProjects.projectSessionPayload,
  channelMessages: state.channelMessage.channelMessages,
  channels: state.channelMessage.channels,
  getChannelsPayload: state.getchannels.channelsPayload,
  currentChannelData: state.channelMessage.currentChannelData,
  channelNotice: state.channelMessage.channelNotice,
  uploadAttachmentsData: state.uploadAttachments.uploadAttachmentsData,
  channelsPayload: state.getchannels.channelsPayload,
  sideMenuItems: setSideMenuItems(state),
  userChannelsPayload: getChannelsName(state),
  copiedLink: state.brightKnowledgeReducer.copiedLink,
  isChannelSelected: state.selectedChannelItemIndexReducer.isChannelSelected,
  userDetail: state.getUserDetail.userDetailPayload,
  channelArchivedData: getArchiveChannelData(state),
  networkState: state.checkNetwork.isConnected,
  offlineStoredMessages: state.offlineMessageToSend.offlineStoredMessages,
  isOfflineMessagesSent: state.postOfflineMessage.isOfflineMessagesSent,
  userId: getUserDetail(state),
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  mentorPayload: state.typeformMenteeDataReducer.mentorPayload,
  myMentorPayload: state.typeformMenteeDataReducer.myMentorPayload,
  userPayload: getUserDetail(state),
  projectUserPayload: state.profile.projectUserPayload,
  badgePayload: state.achievementReducer.badgePayload,
  availableBatchDataPayload: state.achievementReducer.availableBatchDataPayload,
  preservedMessageTextData: state.preserveMessageText.preservedMessageText,
});

export default connect(mapStateToProps)(
  withImageUploader(
    MessageScreen,
    navigationOption,
    actionSheetOptions,
    cancelIndex,
  ),
);
